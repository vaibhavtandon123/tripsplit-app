# TripSplit

Trip expense splitter. Frontend hosted on **Cloudflare Pages**; backend runs on **Google Apps Script** (data in a Google Sheet).

## How it fits together
- `index.html` — the whole app UI (served by Cloudflare Pages).
- `functions/api.js` — a Pages Function at `/api` that proxies the app's calls to the Apps Script backend. The Apps Script URL is stored as the `APPS_SCRIPT_URL` environment variable in the Cloudflare Pages project (not in this repo).
- `apps-script/Code.gs.txt` — reference copy of the Apps Script backend (deployed in the Apps Script editor).

## Updating
Push to `main` → Cloudflare Pages auto-deploys the new frontend. No copy-paste.
Backend changes (rare) are pasted into the Apps Script editor from `apps-script/Code.gs.txt`.
