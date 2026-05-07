# Quan Qin Academic Homepage

Static academic homepage for GitHub Pages. The page displays public profile details, ORCID-synced publications, and co-authors while intentionally excluding all citation metrics.

## Files to edit

- `publications.json`: edit `profile.email` to update the displayed email and edit `profile.interests` to add research tags. Publication links are synced from ORCID DOI metadata; only edit `publications[].externalUrl` manually for works that have no DOI in ORCID.
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

## ORCID sync

The workflow in `.github/workflows/sync-orcid.yml` runs every Monday at 06:00 UTC on GitHub-hosted `ubuntu-latest`.

It runs:

```bash
node scripts/sync-orcid.js
```

The sync script reads public ORCID works metadata from `0000-0002-7540-4371` and updates `publications.json` plus the fallback data in `script.js`. Paper title links are DOI URLs from ORCID when DOI metadata is available.

If the ORCID request fails or parsing produces no publications, the script exits without overwriting existing data.

## Excluded content

The site and sync script do not render citation counts, "Cited by", h-index, i10-index, citation charts, or per-paper citation metrics.
