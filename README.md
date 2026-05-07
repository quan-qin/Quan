# Quan Qin Academic Homepage

Static academic homepage for GitHub Pages. The page displays public Google Scholar metadata for profile details, publications, and co-authors while intentionally excluding all citation metrics.

## Files to edit

- `publications.json`: edit `profile.email` to update the displayed email, edit `profile.interests` to add research tags, and edit `publications[].externalUrl` to add DOI, arXiv, publisher, or project links.
- `index.html`: edit static page copy if you add a bio or extra sections later.
- `style.css`: edit visual styling.

## Local preview

Open `index.html` directly in a browser. The page includes a JavaScript data fallback for direct `file://` preview, and uses `publications.json` when served by GitHub Pages.

## GitHub Pages setup

1. Create a public GitHub repository under your own GitHub account.
2. Push this folder to the repository.
3. In the repository, open `Settings > Pages`.
4. Set the source to `Deploy from a branch`.
5. Select the main branch and `/ (root)`.

After GitHub Pages publishes, the static site will serve `index.html`, `style.css`, `script.js`, and `publications.json`.

## Scholar sync

The workflow in `.github/workflows/sync-scholar.yml` runs every Monday at 06:00 UTC on GitHub-hosted `ubuntu-latest`.

It runs:

```bash
node scripts/sync-scholar.js
```

The sync script reads public Google Scholar profile metadata and updates `publications.json` plus the fallback data in `script.js`. It preserves manually maintained `profile.email`, `profile.interests`, and `publications[].externalUrl` values.

If the Scholar request fails or parsing produces no publications/co-authors, the script exits without overwriting existing data.

## Excluded content

The site and sync script do not render citation counts, "Cited by", h-index, i10-index, citation charts, or per-paper citation metrics.
