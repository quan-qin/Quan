const DATA_URL = "publications.json";

// Generated fallback used when the page is opened directly from disk and the browser blocks JSON loading.
// Edit publications.json first; scripts/sync-scholar.js keeps this fallback synchronized.
const FALLBACK_DATA = /* ACADEMIC_DATA_START */
{
  "_comment": "Edit profile.email and profile.interests to update displayed profile details. Edit publications[].externalUrl to add DOI, arXiv, publisher, or project links. The Scholar sync preserves email, interests, and externalUrl values.",
  "profile": {
    "name": "Quan Qin",
    "email": "qinquan@whu.edu.cn",
    "affiliation": "",
    "verifiedEmail": "",
    "photoUrl": "https://scholar.googleusercontent.com/citations?view_op=view_photo&user=v_yErA4AAAAJ&citpid=3",
    "scholarUrl": "https://scholar.google.com/citations?user=v_yErA4AAAAJ&hl=en",
    "interests": [],
    "lastSyncedAt": "2026-05-07T00:00:00.000Z"
  },
  "publications": [
    {
      "scholarId": "v_yErA4AAAAJ:W7OEmFMy1HYC",
      "title": "Cross-city traffic noise modeling and inequality analysis via AlphaEarth Geospatial Foundation Models",
      "authors": "Y Zhang, Q Qin, H Nie, MP Kwan, S He, E Ke",
      "venue": "Transportation Research Part D: Transport and Environment 156, 105378",
      "year": 2026,
      "scholarUrl": "https://scholar.google.com/citations?view_op=view_citation&hl=en&oe=ASCII&user=v_yErA4AAAAJ&citation_for_view=v_yErA4AAAAJ:W7OEmFMy1HYC",
      "externalUrl": ""
    },
    {
      "scholarId": "v_yErA4AAAAJ:Tyk-4Ss8FVUC",
      "title": "Deep learning for tropospheric prediction: an integration of knowledge and data-driven approaches",
      "authors": "X Lei, J Guo, T Yang, J Tao, Q Qin, J Zhang, Q Zhao",
      "venue": "GPS Solutions 30 (2), 85",
      "year": 2026,
      "scholarUrl": "https://scholar.google.com/citations?view_op=view_citation&hl=en&oe=ASCII&user=v_yErA4AAAAJ&citation_for_view=v_yErA4AAAAJ:Tyk-4Ss8FVUC",
      "externalUrl": ""
    },
    {
      "scholarId": "v_yErA4AAAAJ:zYLM7Y9cAGgC",
      "title": "Urban region representation learning via dual spatial contrasts",
      "authors": "Q Qin, T Ai, W Huang, S Xu, M Du, S Li",
      "venue": "International Journal of Geographical Information Science, 1-27",
      "year": 2025,
      "scholarUrl": "https://scholar.google.com/citations?view_op=view_citation&hl=en&oe=ASCII&user=v_yErA4AAAAJ&citation_for_view=v_yErA4AAAAJ:zYLM7Y9cAGgC",
      "externalUrl": ""
    },
    {
      "scholarId": "v_yErA4AAAAJ:UeHWp8X0CEIC",
      "title": "Beyond AlphaEarth: toward human-centered spatial representation via POI-guided contrastive learning",
      "authors": "J Liu, Q Qin, G Dong, X Wang, J Feng, Z Zeng, T Cheng",
      "venue": "arXiv preprint arXiv:2510.09894",
      "year": 2025,
      "scholarUrl": "https://scholar.google.com/citations?view_op=view_citation&hl=en&oe=ASCII&user=v_yErA4AAAAJ&citation_for_view=v_yErA4AAAAJ:UeHWp8X0CEIC",
      "externalUrl": "https://arxiv.org/abs/2510.09894"
    },
    {
      "scholarId": "v_yErA4AAAAJ:2osOgNQ5qMEC",
      "title": "Learning dual context aware POI representations for geographic mapping",
      "authors": "Q Qin, T Ai, S Xu, Y Zhang, W Huang, M Du, S Li",
      "venue": "International Journal of Applied Earth Observation and Geoinformation 142, 104683",
      "year": 2025,
      "scholarUrl": "https://scholar.google.com/citations?view_op=view_citation&hl=en&oe=ASCII&user=v_yErA4AAAAJ&citation_for_view=v_yErA4AAAAJ:2osOgNQ5qMEC",
      "externalUrl": ""
    },
    {
      "scholarId": "v_yErA4AAAAJ:d1gkVwhDpl0C",
      "title": "Identifying urban functional zones by capturing multi-spatial distribution patterns of points of interest",
      "authors": "Q Qin, S Xu, M Du, S Li",
      "venue": "International Journal of Digital Earth 15 (1), 2468-2494",
      "year": 2022,
      "scholarUrl": "https://scholar.google.com/citations?view_op=view_citation&hl=en&oe=ASCII&user=v_yErA4AAAAJ&citation_for_view=v_yErA4AAAAJ:d1gkVwhDpl0C",
      "externalUrl": ""
    },
    {
      "scholarId": "v_yErA4AAAAJ:u-x6o8ySG0sC",
      "title": "Urban functional zone identification by considering the heterogeneous distribution of points of interests",
      "authors": "Q Qin, S Xu, M Du, S Li",
      "venue": "ISPRS Annals of the Photogrammetry, Remote Sensing and Spatial Information Sciences",
      "year": 2022,
      "scholarUrl": "https://scholar.google.com/citations?view_op=view_citation&hl=en&oe=ASCII&user=v_yErA4AAAAJ&citation_for_view=v_yErA4AAAAJ:u-x6o8ySG0sC",
      "externalUrl": ""
    }
  ],
  "coauthors": [
    {
      "name": "Songnian Li",
      "affiliation": "Professor, Toronto Metropolitan University (formerly Ryerson University)",
      "verifiedEmail": "Verified email at torontomu.ca",
      "photoUrl": "https://scholar.googleusercontent.com/citations?view_op=view_photo&user=RodaPPgAAAAJ&citpid=18",
      "scholarUrl": "https://scholar.google.com/citations?user=RodaPPgAAAAJ&hl=en&oe=ASCII"
    },
    {
      "name": "Weiming Huang",
      "affiliation": "University of Leeds",
      "verifiedEmail": "Verified email at leeds.ac.uk",
      "photoUrl": "https://scholar.googleusercontent.com/citations?view_op=view_photo&user=gDM3WGwAAAAJ&citpid=3",
      "scholarUrl": "https://scholar.google.com/citations?user=gDM3WGwAAAAJ&hl=en&oe=ASCII"
    },
    {
      "name": "Yan Zhang (张岩)",
      "affiliation": "Chinese University of HongKong; Wuhan University",
      "verifiedEmail": "Verified email at cuhk.edu.hk",
      "photoUrl": "https://scholar.googleusercontent.com/citations?view_op=view_photo&user=H8T2HtsAAAAJ&citpid=9",
      "scholarUrl": "https://scholar.google.com/citations?user=H8T2HtsAAAAJ&hl=en&oe=ASCII"
    },
    {
      "name": "Tinghua Ai",
      "affiliation": "Wuhan University",
      "verifiedEmail": "Verified email at whu.edu.cn",
      "photoUrl": "https://scholar.googleusercontent.com/citations?view_op=view_photo&user=ujAtYEQAAAAJ&citpid=1",
      "scholarUrl": "https://scholar.google.com/citations?user=ujAtYEQAAAAJ&hl=en&oe=ASCII"
    },
    {
      "name": "Tao Cheng",
      "affiliation": "Professor in GeoInformatics, University College London",
      "verifiedEmail": "Verified email at ucl.ac.uk",
      "photoUrl": "https://scholar.googleusercontent.com/citations?view_op=view_photo&user=OA2E5JsAAAAJ&citpid=2",
      "scholarUrl": "https://scholar.google.com/citations?user=OA2E5JsAAAAJ&hl=en&oe=ASCII"
    },
    {
      "name": "Zichao Zeng",
      "affiliation": "University College London",
      "verifiedEmail": "Verified email at ucl.ac.uk",
      "photoUrl": "https://scholar.googleusercontent.com/citations?view_op=view_photo&user=WPOWP6gAAAAJ&citpid=4",
      "scholarUrl": "https://scholar.google.com/citations?user=WPOWP6gAAAAJ&hl=en&oe=ASCII"
    },
    {
      "name": "Junyuan Liu",
      "affiliation": "PhD Candidate, University College London",
      "verifiedEmail": "Verified email at ucl.ac.uk",
      "photoUrl": "https://scholar.googleusercontent.com/citations?view_op=view_photo&user=UzbbeIcAAAAJ&citpid=3",
      "scholarUrl": "https://scholar.google.com/citations?user=UzbbeIcAAAAJ&hl=en&oe=ASCII"
    },
    {
      "name": "Xinglei Wang",
      "affiliation": "PhD Student, University College London",
      "verifiedEmail": "Verified email at ucl.ac.uk",
      "photoUrl": "https://scholar.googleusercontent.com/citations?view_op=view_photo&user=860DSHkAAAAJ&citpid=3",
      "scholarUrl": "https://scholar.google.com/citations?user=860DSHkAAAAJ&hl=en&oe=ASCII"
    },
    {
      "name": "Entong KE",
      "affiliation": "Wuhan University",
      "verifiedEmail": "Verified email at whu.edu.cn",
      "photoUrl": "https://scholar.googleusercontent.com/citations?view_op=view_photo&user=DGyciHgAAAAJ&citpid=2",
      "scholarUrl": "https://scholar.google.com/citations?user=DGyciHgAAAAJ&hl=en&oe=ASCII"
    },
    {
      "name": "Mei-Po Kwan (关美宝)",
      "affiliation": "Choh-Ming Li Professor of Geography and Resource Management, The Chinese University of Hong Kong",
      "verifiedEmail": "Verified email at cuhk.edu.hk",
      "photoUrl": "https://scholar.googleusercontent.com/citations?view_op=view_photo&user=vd-iK1cp0AIC&citpid=3",
      "scholarUrl": "https://scholar.google.com/citations?user=vd-iK1cp0AIC&hl=en&oe=ASCII"
    }
  ]
}
/* ACADEMIC_DATA_END */;

document.addEventListener("DOMContentLoaded", () => {
  loadAcademicData().then(renderAcademicPage).catch((error) => {
    const status = document.getElementById("data-status");
    if (status) {
      status.textContent = "Publication data could not be loaded.";
    }
    console.error(error);
  });
});

async function loadAcademicData() {
  try {
    const response = await fetch(DATA_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Unable to load ${DATA_URL}: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    if (FALLBACK_DATA) {
      return FALLBACK_DATA;
    }
    throw error;
  }
}

function renderAcademicPage(data) {
  renderProfile(data.profile || {});
  renderInterests((data.profile && data.profile.interests) || []);
  renderCoauthors(data.coauthors || []);
  renderPublications(data.publications || []);
  renderLastUpdated(data.profile && data.profile.lastSyncedAt);
}

function renderProfile(profile) {
  setText("profile-name", profile.name || "Quan Qin");
  renderProfileEmail(profile.email || profile.verifiedEmail || "");

  const scholarLink = document.getElementById("profile-scholar-link");
  if (scholarLink && profile.scholarUrl) {
    scholarLink.href = profile.scholarUrl;
  }

  const photo = document.getElementById("profile-photo");
  const fallback = document.getElementById("profile-photo-fallback");
  if (fallback) {
    fallback.textContent = initials(profile.name || "Quan Qin");
  }
  setImage(photo, profile.photoUrl, profile.name || "Quan Qin");
}

function renderProfileEmail(email) {
  const element = document.getElementById("profile-email");
  if (!element) {
    return;
  }

  element.replaceChildren();
  if (!email) {
    element.hidden = true;
    return;
  }

  element.hidden = false;
  const link = document.createElement("a");
  link.href = `mailto:${email}`;
  link.textContent = email;
  element.append(link);
}

function renderInterests(interests) {
  const list = document.getElementById("interest-tags");
  if (!list) {
    return;
  }

  list.replaceChildren();
  interests.filter(Boolean).forEach((interest) => {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = interest;
    list.append(tag);
  });
}

function renderCoauthors(coauthors) {
  const list = document.getElementById("coauthors-list");
  if (!list) {
    return;
  }

  list.replaceChildren();
  coauthors.forEach((coauthor) => {
    const item = document.createElement("article");
    item.className = "coauthor";

    const photoWrap = document.createElement("div");
    photoWrap.className = "coauthor-photo";

    const image = document.createElement("img");
    image.decoding = "async";
    setImage(image, coauthor.photoUrl, coauthor.name);

    const fallback = document.createElement("span");
    fallback.className = "avatar-fallback";
    fallback.textContent = initials(coauthor.name);

    const copy = document.createElement("div");
    const name = document.createElement("a");
    name.className = "coauthor-name";
    name.href = coauthor.scholarUrl || "#";
    name.target = "_blank";
    name.rel = "noopener";
    name.textContent = coauthor.name || "Co-author";

    const affiliation = document.createElement("p");
    affiliation.className = "coauthor-meta";
    affiliation.textContent = coauthor.affiliation || "";

    const email = document.createElement("p");
    email.className = "coauthor-email";
    email.textContent = coauthor.verifiedEmail || "";

    photoWrap.append(image, fallback);
    copy.append(name, affiliation, email);
    item.append(photoWrap, copy);
    list.append(item);
  });
}

function renderPublications(publications) {
  const list = document.getElementById("publication-list");
  if (!list) {
    return;
  }

  list.replaceChildren();
  const sorted = [...publications].sort((a, b) => {
    const yearDiff = Number(b.year || 0) - Number(a.year || 0);
    return yearDiff || String(a.title || "").localeCompare(String(b.title || ""));
  });

  sorted.forEach((paper) => {
    const item = document.createElement("li");
    item.className = "publication";

    const body = document.createElement("div");
    const title = document.createElement("h3");
    title.className = "publication-title";

    const paperUrl = paper.externalUrl || paper.scholarUrl;
    if (paperUrl) {
      const link = document.createElement("a");
      link.href = paperUrl;
      link.target = "_blank";
      link.rel = "noopener";
      link.textContent = paper.title || "Untitled publication";
      title.append(link);
    } else {
      title.textContent = paper.title || "Untitled publication";
    }

    const authors = document.createElement("p");
    authors.className = "publication-authors";
    authors.textContent = paper.authors || "";

    const venue = document.createElement("p");
    venue.className = "publication-venue";
    venue.textContent = paper.venue || "";

    const year = document.createElement("span");
    year.className = "publication-year";
    year.textContent = paper.year || "";

    body.append(title, authors, venue);
    item.append(body, year);
    list.append(item);
  });
}

function renderLastUpdated(lastSyncedAt) {
  const target = document.getElementById("last-updated");
  if (!target || !lastSyncedAt) {
    return;
  }

  const date = new Date(lastSyncedAt);
  if (Number.isNaN(date.getTime())) {
    return;
  }

  target.textContent = `Last synced ${date.toLocaleDateString("en", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })}`;
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

function setImage(image, src, label) {
  if (!image) {
    return;
  }

  image.alt = label ? `${label} profile photo` : "";
  image.removeAttribute("src");

  if (!src) {
    image.hidden = true;
    return;
  }

  image.hidden = false;
  image.addEventListener("error", () => {
    image.hidden = true;
    image.removeAttribute("src");
  }, { once: true });
  image.src = src;
}

function initials(name) {
  return String(name || "")
    .replace(/\([^)]*\)/g, "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "A";
}
