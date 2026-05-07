#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const DATA_PATH = path.join(ROOT, "publications.json");
const SCRIPT_PATH = path.join(ROOT, "script.js");
const ORCID_ID = process.env.ORCID_ID || "0000-0002-7540-4371";
const ORCID_BASE = "https://pub.orcid.org/v3.0";
const ORCID_PROFILE_URL = `https://orcid.org/${ORCID_ID}`;
const WORKS_URL = `${ORCID_BASE}/${ORCID_ID}/works`;
const DATA_COMMENT = "Edit profile.email and profile.interests to update displayed profile details. Publication metadata is synced from ORCID; DOI values are written to publications[].externalUrl.";
const FALLBACK_START = "/* ACADEMIC_DATA_START */";
const FALLBACK_END = "/* ACADEMIC_DATA_END */";

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

async function main() {
  const existing = readExistingData();
  const works = await fetchOrcidJson(WORKS_URL);
  const scraped = await scrapeOrcidWorks(works, existing);
  validateData(scraped);

  const candidate = withStableTimestamp(scraped, existing);
  const finalData = hasDataChanged(existing, candidate)
    ? withTimestamp(candidate, new Date().toISOString())
    : candidate;

  const nextJson = `${JSON.stringify(finalData, null, 2)}\n`;
  const nextScript = buildNextScript(finalData);
  const currentJson = readFileIfExists(DATA_PATH);
  const currentScript = readFileIfExists(SCRIPT_PATH);

  if (currentJson === nextJson && currentScript === nextScript) {
    console.log("ORCID publication metadata is already up to date.");
    return;
  }

  fs.writeFileSync(DATA_PATH, nextJson);
  fs.writeFileSync(SCRIPT_PATH, nextScript);
  console.log(`Updated ${path.relative(ROOT, DATA_PATH)} and ${path.relative(ROOT, SCRIPT_PATH)}.`);
}

async function fetchOrcidJson(url) {
  const response = await fetch(url, {
    headers: {
      "accept": "application/json",
      "user-agent": "AcademicHomepageSync/1.0 (GitHub Pages; ORCID public metadata)"
    }
  });

  if (!response.ok) {
    throw new Error(`ORCID request failed with HTTP ${response.status}. Existing data was not changed.`);
  }

  return response.json();
}

async function scrapeOrcidWorks(works, existing) {
  const existingByTitle = new Map((existing.publications || []).map((paper) => [normalizeTitle(paper.title), paper]));
  const groups = Array.isArray(works.group) ? works.group : [];
  const publications = [];

  for (const group of groups) {
    const summary = chooseWorkSummary(group);
    if (!summary) {
      continue;
    }

    let detail = null;
    try {
      detail = await fetchOrcidJson(`${ORCID_BASE}/${ORCID_ID}/work/${summary["put-code"]}`);
    } catch (error) {
      console.warn(`${error.message} Falling back to ORCID summary for put-code ${summary["put-code"]}.`);
    }

    const paper = buildPublication(group, summary, detail, existingByTitle);
    if (paper) {
      publications.push(paper);
    }
  }

  return {
    _comment: DATA_COMMENT,
    profile: buildProfile(existing.profile || {}),
    publications: sortPublications(dedupePublications(publications)),
    coauthors: Array.isArray(existing.coauthors) ? existing.coauthors : []
  };
}

function chooseWorkSummary(group) {
  const summaries = Array.isArray(group && group["work-summary"]) ? group["work-summary"] : [];
  if (summaries.length === 0) {
    return null;
  }

  return summaries.find((summary) => getDoiUrl(summary["external-ids"])) ||
    summaries.find((summary) => getDoiUrl(group["external-ids"])) ||
    summaries[0];
}

function buildProfile(existingProfile) {
  return {
    name: existingProfile.name || "Quan Qin",
    email: existingProfile.email || "qinquan@whu.edu.cn",
    affiliation: existingProfile.affiliation || "",
    verifiedEmail: existingProfile.verifiedEmail || "",
    photoUrl: existingProfile.photoUrl || "",
    scholarUrl: existingProfile.scholarUrl || "https://scholar.google.com/citations?user=v_yErA4AAAAJ&hl=en",
    orcidUrl: ORCID_PROFILE_URL,
    interests: Array.isArray(existingProfile.interests) ? existingProfile.interests : [],
    lastSyncedAt: existingProfile.lastSyncedAt || null
  };
}

function buildPublication(group, summary, detail, existingByTitle) {
  const source = detail || summary;
  const title = textValue(source.title && source.title.title) ||
    textValue(summary.title && summary.title.title);
  if (!title) {
    return null;
  }

  const existing = existingByTitle.get(normalizeTitle(title)) || {};
  const doiUrl = getDoiUrl(source["external-ids"]) ||
    getDoiUrl(summary["external-ids"]) ||
    getDoiUrl(group["external-ids"]);
  const year = Number(textValue(source["publication-date"] && source["publication-date"].year) ||
    textValue(summary["publication-date"] && summary["publication-date"].year)) || null;
  const venue = textValue(source["journal-title"]) || textValue(summary["journal-title"]) || existing.venue || "";
  const authors = formatContributors(source.contributors) || existing.authors || "";
  const putCode = source["put-code"] || summary["put-code"];

  return {
    sourceId: `orcid:${putCode}`,
    orcidPutCode: putCode,
    title: titleToSentenceCaseWhenAllCaps(title),
    authors,
    venue,
    year,
    scholarUrl: "",
    externalUrl: doiUrl || existing.externalUrl || ""
  };
}

function formatContributors(contributors) {
  const list = contributors && Array.isArray(contributors.contributor)
    ? contributors.contributor
    : [];
  const names = list
    .filter((contributor) => {
      const role = contributor["contributor-attributes"] && contributor["contributor-attributes"]["contributor-role"];
      return !role || role === "author";
    })
    .map((contributor) => textValue(contributor["credit-name"]))
    .filter(Boolean)
    .map(formatAuthorName);

  return names.join(", ");
}

function formatAuthorName(name) {
  const cleaned = String(name || "")
    .replace(/\([^)]*\)/g, "")
    .replace(/\s+/g, " ")
    .trim();
  const parts = cleaned.split(" ").filter(Boolean);

  if (parts.length <= 1) {
    return cleaned;
  }

  const surname = parts.at(-1);
  const initials = parts.slice(0, -1)
    .map((part) => {
      const match = part.match(/[A-Za-z]/);
      return match ? match[0].toUpperCase() : part[0];
    })
    .filter(Boolean)
    .join("");

  return initials ? `${initials} ${surname}` : surname;
}

function getDoiUrl(externalIds) {
  const ids = externalIds && Array.isArray(externalIds["external-id"])
    ? externalIds["external-id"]
    : [];
  const doi = ids.find((id) =>
    String(id["external-id-type"] || "").toLowerCase() === "doi" &&
    (!id["external-id-relationship"] || id["external-id-relationship"] === "self")
  ) || ids.find((id) => String(id["external-id-type"] || "").toLowerCase() === "doi");

  if (!doi) {
    return "";
  }

  const url = textValue(doi["external-id-url"]);
  if (url) {
    return normalizeDoiUrl(url);
  }

  const value = textValue(doi["external-id-normalized"]) || textValue(doi["external-id-value"]);
  return value ? normalizeDoiUrl(value) : "";
}

function normalizeDoiUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return "";
  }

  if (/^https?:\/\/doi\.org\//i.test(raw)) {
    return raw.replace(/^http:\/\//i, "https://");
  }

  if (/^https?:\/\/dx\.doi\.org\//i.test(raw)) {
    return raw.replace(/^https?:\/\/dx\.doi\.org\//i, "https://doi.org/");
  }

  const doi = raw.replace(/^doi:\s*/i, "");
  return `https://doi.org/${doi}`;
}

function dedupePublications(publications) {
  const seen = new Set();
  return publications.filter((paper) => {
    const key = paper.externalUrl || normalizeTitle(paper.title);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function sortPublications(publications) {
  return publications.sort((a, b) => {
    const yearDiff = Number(b.year || 0) - Number(a.year || 0);
    return yearDiff || String(a.title).localeCompare(String(b.title));
  });
}

function validateData(data) {
  if (!data.profile || !data.profile.name) {
    throw new Error("ORCID sync parsed no profile name. Existing data was not changed.");
  }
  if (!Array.isArray(data.publications) || data.publications.length === 0) {
    throw new Error("ORCID sync parsed no publications. Existing data was not changed.");
  }
  if (!Array.isArray(data.coauthors) || data.coauthors.length === 0) {
    throw new Error("Existing co-author data is missing. Existing data was not changed.");
  }
}

function withStableTimestamp(data, existing) {
  return {
    ...data,
    profile: {
      ...data.profile,
      lastSyncedAt: existing.profile && existing.profile.lastSyncedAt ? existing.profile.lastSyncedAt : null
    }
  };
}

function withTimestamp(data, timestamp) {
  return {
    ...data,
    profile: {
      ...data.profile,
      lastSyncedAt: timestamp
    }
  };
}

function hasDataChanged(existing, candidate) {
  return JSON.stringify(comparable(existing)) !== JSON.stringify(comparable(candidate));
}

function comparable(data) {
  const clone = JSON.parse(JSON.stringify(data || {}));
  if (clone.profile) {
    delete clone.profile.lastSyncedAt;
  }
  return clone;
}

function buildNextScript(data) {
  const current = readFileIfExists(SCRIPT_PATH);
  if (!current.includes(FALLBACK_START) || !current.includes(FALLBACK_END)) {
    throw new Error("script.js is missing academic data fallback markers. Existing data was not changed.");
  }

  const replacement = `${FALLBACK_START}\n${JSON.stringify(data, null, 2)}\n${FALLBACK_END}`;
  return current.replace(new RegExp(`${escapeRegExp(FALLBACK_START)}[\\s\\S]*?${escapeRegExp(FALLBACK_END)}`), replacement);
}

function readExistingData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
  } catch {
    return {};
  }
}

function readFileIfExists(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return "";
  }
}

function textValue(value) {
  if (value === null || value === undefined) {
    return "";
  }
  if (typeof value === "object" && "value" in value) {
    return textValue(value.value);
  }
  return String(value).replace(/\s+/g, " ").trim();
}

function normalizeTitle(title) {
  return String(title || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function titleToSentenceCaseWhenAllCaps(title) {
  const value = String(title || "").trim();
  const letters = value.replace(/[^A-Za-z]/g, "");
  if (!letters || value !== value.toUpperCase()) {
    return value;
  }

  return value.toLowerCase().replace(/(^|[:.!?]\s+)([a-z])/g, (_, prefix, letter) => prefix + letter.toUpperCase());
}

function escapeRegExp(input) {
  return String(input).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
