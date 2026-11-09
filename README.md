# My Budget — GitHub Pages complete release (V5)

This archive contains **the complete website**, with individual files at the root (no enclosing project folder). Based on the tested V5 version. It preserves: budgeting, transactions, goals, future projections, subscriptions, debts, insights and emergency fund, annual planning and tax-document checklist, practical financial guidance, local browser storage, JSON import/export, dark mode, and Arabic/English/French/German.

## Publish with GitHub Desktop
1. Extract the ZIP. Do **not** copy the ZIP file into the repository.
2. In GitHub Desktop, open your `My-budget` repository: Repository > Show in Explorer.
3. Copy **every file** from the extracted folder into the repository root, including `index.html`, `style.css`, and `app.js`. Do not copy the parent folder. (Windows may hide `.nojekyll`; it is optional for basic functionality.)
4. Commit to main and Push origin.
5. GitHub web: Settings > Pages > Deploy from a branch > main > /(root), Save.
6. Visit `https://islamtanjawi.github.io/My-budget/` after Pages deployment completes. Hard-refresh after deployment if necessary.

## File manifest
- `index.html`: site HTML and shell.
- `style.css`: **all layout, visual design, and mobile styles**. Without it, the site looks like plain text.
- `app.js`: **all calculations, navigation, UI, languages, and local data**. Without it, the dashboard does not function.
- `icon.svg`: website favicon.
- `manifest.webmanifest`: installable app metadata.
- `robots.txt`: search crawler directive.
- `.nojekyll`: prevents Jekyll interference on GitHub Pages.
- `README.md`: this deployment guide; not loaded by the site.

## Data and privacy
Data is saved in your browser's local storage. GitHub does not receive the users' budget data. Before replacing any existing site, use the in-app JSON export to back up important local entries. This site does not submit tax returns, connect to banks, or guarantee returns on projected savings/investments.

## Known considerations
On first use, an internet connection is required to load the site. A previous GitHub Pages release may have cached assets; hard-refresh and clear site cache if old content persists. Do not paste the GitHub Pages URL into a file: the relative `./` links work under the project subpath.
