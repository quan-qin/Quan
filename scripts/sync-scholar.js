#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const DATA_PATH = path.join(ROOT, "publications.json");
const SCRIPT_PATH = path.join(ROOT, "script.js");
const SCHOLAR_BASE = "https://scholar.google.com";
const SCHOLAR_USER = process.env.SCHOLAR_USER || "v_yErA4AAAAJ";
const PROFILE_URL = `${SCHOLAR_BASE}/citations?user=${SCHOLAR_USER}&hl=en`;
const LIST_URL = `${SCHOLAR_BASE}/citations?hl=en&oe=ASCII&user=${SCHOLAR_USER}&view_op=list_works&sortby=pubdate`;
const DATA_COMMENT = "Edit profile.email and profile.interests to update displayed profile details. Edit publications[].externalUrl to add DOI, arXiv, publisher, or project links. The Scholar sync preserves email, interests, and externalUrl values.";
const FALLBACK_START = "/* ACADEMIC_DATA_START */";
const FALLBACK_END = "/* ACADEMIC_DATA_END */";

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

async function main() {
  const existing = readExistingData();
  const html = await fetchScholarHtml(LIST_URL);
  const scraped = scrapeScholarPage(html, existing);
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
    console.log("Scholar metadata is already up to date.");
    return;
  }

  fs.writeFileSync(DATA_PATH, nextJson);
  fs.writeFileSync(SCRIPT_PATH, nextScript);
  console.log(`Updated ${path.relative(ROOT, DATA_PATH)} and ${path.relative(ROOT, SCRIPT_PATH)}.`);
}

async function fetchScholarHtml(url) {
  const response = await fetch(url, {
    headers: {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "accept-language": "en-US,en;q=0.9",
      "user-agent": "Mozilla/5.0 (compatible; AcademicHomepageSync/1.0; +https://pages.github.com/)"
    }
  });

  if (!response.ok) {
    throw new Error(`Scholar request failed with HTTP ${response.status}. Existing data was not changed.`);
  }

  return response.text();
}

function scrapeScholarPage(html, existing) {
  const existingById = new Map((existing.publications || []).map((paper) => [paper.scholarId, paper]));
  const existingByTitle = new Map((existing.publications || []).map((paper) => [paper.title, paper]));
  const profile = scrapeProfile(html, existing.profile || {});
  const publications = scrapePublications(html, existingById, existingByTitle);
  const coauthors = scrapeCoauthors(html);

  return {
    _comment: DATA_COMMENT,
    profile,
    publications,
    coauthors
  };
}

function scrapeProfile(html, existingProfile) {
  const name = firstText(html, /<div id="gsc_prf_in">([\s\S]*?)<\/div>/) ||
    firstAttribute(html, /<meta property="og:title" content="([^"]+)"/);
  const photoUrl = normalizeUrl(firstAttribute(html, /<meta property="og:image" content="([^"]+)"/)) ||
    normalizeUrl(firstAttribute(html, /<img[^>]+id="gsc_prf_pup-img"[^>]+src="([^"]+)"/));

  return {
    name: name || existingProfile.name || "Quan Qin",
    email: existingProfile.email || "qinquan@whu.edu.cn",
    affiliation: existingProfile.affiliation || "",
    verifiedEmail: existingProfile.verifiedEmail || "",
    photoUrl: photoUrl || existingProfile.photoUrl || "",
    scholarUrl: PROFILE_URL,
    interests: Array.isArray(existingProfile.interests) ? existingProfile.interests : [],
    lastSyncedAt: existingProfile.lastSyncedAt || null
  };
}

function scrapePublications(html, existingById, existingByTitle) {
  const rows = findAll(html, /<tr class="gsc_a_tr">([\s\S]*?)<\/tr>/g);
  return rows.map((row) => {
    const linkMatch = row.match(/<a href="([^"]+)" class="gsc_a_at">([\s\S]*?)<\/a>/);
    if (!linkMatch) {
      return null;
    }

    const scholarUrl = normalizeUrl(linkMatch[1]);
    const scholarId = extractQueryValue(scholarUrl, "citation_for_view") || scholarUrl;
    const title = cleanText(linkMatch[2]);
    const grayBlocks = findAll(row, /<div class="gs_gray">([\s\S]*?)<\/div>/g);
    const authors = cleanText(grayBlocks[0] || "");
    const rawVenue = cleanText(String(grayBlocks[1] || "").replace(/<span class="gs_oph">[\s\S]*?<\/span>/g, ""));
    const year = Number(firstText(row, /<td class="gsc_a_y"><span[^>]*>(\d{4})<\/span><\/td>/)) || null;
    const existing = existingById.get(scholarId) || existingByTitle.get(title) || {};
    const venue = shouldKeepExistingVenue(rawVenue, existing.venue) ? existing.venue : rawVenue;

    return {
      scholarId,
      title,
      authors,
      venue,
      year,
      scholarUrl,
      externalUrl: existing.externalUrl || inferExternalUrl(rawVenue)
    };
  }).filter(Boolean).sort((a, b) => {
    const yearDiff = Number(b.year || 0) - Number(a.year || 0);
    return yearDiff || String(a.title).localeCompare(String(b.title));
  });
}

function scrapeCoauthors(html) {
  const blocks = findAll(html, /<li><div class="gsc_rsb_aa"[\s\S]*?<\/li>/g);
  return blocks.map((block) => {
    const match = block.match(/<span class="gsc_rsb_a_desc"><a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a><span class="gsc_rsb_a_ext">([\s\S]*?)<\/span><span class="gsc_rsb_a_ext gsc_rsb_a_ext2">([\s\S]*?)<\/span>/);
    if (!match) {
      return null;
    }

    return {
      name: cleanText(match[2]),
      affiliation: cleanText(match[3]),
      verifiedEmail: cleanText(match[4]),
      photoUrl: extractBestImageUrl(block),
      scholarUrl: normalizeUrl(match[1])
    };
  }).filter(Boolean);
}

function extractBestImageUrl(block) {
  const srcset = firstAttribute(block, /\sdata-srcset="([^"]+)"/);
  if (srcset) {
    const urls = decodeHtml(srcset)
      .split(",")
      .map((part) => part.trim().split(/\s+/)[0])
      .filter(Boolean);
    return normalizeUrl(urls.find((url) => url.includes("view_photo")) || urls.at(-1));
  }

  return normalizeUrl(firstAttribute(block, /\sdata-src="([^"]+)"/)) ||
    normalizeUrl(firstAttribute(block, /\ssrc="([^"]+)"/));
}

function shouldKeepExistingVenue(nextVenue, previousVenue) {
  if (!previousVenue) {
    return false;
  }

  return !nextVenue || nextVenue.includes("...") || nextVenue.endsWith("…");
}

function inferExternalUrl(venue) {
  const arxiv = String(venue || "").match(/arXiv:(\d{4}\.\d{4,5})/i);
  return arxiv ? `https://arxiv.org/abs/${arxiv[1]}` : "";
}

function validateData(data) {
  if (!data.profile || !data.profile.name) {
    throw new Error("Scholar sync parsed no profile name. Existing data was not changed.");
  }
  if (!Array.isArray(data.publications) || data.publications.length === 0) {
    throw new Error("Scholar sync parsed no publications. Existing data was not changed.");
  }
  if (!Array.isArray(data.coauthors) || data.coauthors.length === 0) {
    throw new Error("Scholar sync parsed no co-authors. Existing data was not changed.");
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

function findAll(input, regex) {
  return [...String(input || "").matchAll(regex)].map((match) => match[1]);
}

function firstText(input, regex) {
  const value = firstMatch(input, regex);
  return value ? cleanText(value) : "";
}

function firstAttribute(input, regex) {
  const value = firstMatch(input, regex);
  return value ? decodeHtml(value) : "";
}

function firstMatch(input, regex) {
  const match = String(input || "").match(regex);
  return match ? match[1] : "";
}

function cleanText(input) {
  return decodeHtml(String(input || ""))
    .replace(/<i>([\s\S]*?)<\/i>/gi, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/\uFFFD/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function decodeHtml(input) {
  return String(input || "")
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function normalizeUrl(url) {
  if (!url) {
    return "";
  }

  const decoded = decodeHtml(url);
  if (decoded.startsWith("http://") || decoded.startsWith("https://")) {
    return decoded;
  }
  if (decoded.startsWith("//")) {
    return `https:${decoded}`;
  }
  if (decoded.startsWith("/")) {
    return `${SCHOLAR_BASE}${decoded}`;
  }
  return decoded;
}

function extractQueryValue(url, key) {
  try {
    return new URL(url).searchParams.get(key) || "";
  } catch {
    return "";
  }
}

function escapeRegExp(input) {
  return String(input).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
