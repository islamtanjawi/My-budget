# My Budget V6 — Complete GitHub Pages Website

This is the FULL replacement for the prior V5 site. The ZIP stores all website files **at the ZIP root, with no wrapper directory**.

## Features
- Four-language personal budget: Arabic, English, French, German.
- Edit / Delete buttons clearly visible next to every income source and expense.
- Monthly income and expense tracking, spending insights, goals, future forecasts, subscriptions, debt tracking, tax document checklist, backups and dark mode.
- Loan/instalment/cash purchase simulator: adjustable price, down payment, APR, months, fees, recurring upkeep, income decrease and expense increase. Illustrative amortization, monthly budget changes and 12-month cash trajectory. Simulations do NOT create a real loan or change the entered budget.
- Emergency fund: save a dedicated reserve balance and monthly contribution, estimate target, coverage, shortfall and the time needed to build it.
- Merchant area: record dated sales, merchandise purchases, estimated cost of goods sold, other shop costs and cash withdrawn for home. View daily, weekly and monthly figures plus family/shop comparison. Export merchant CSV.
- Data saved in the local browser. JSON backup/import and CSV export. No financial credentials or bank access.

## Publish on GitHub Desktop
1. Export a JSON backup from the old site Settings if you already use it.
2. Extract this ZIP; it contains `index.html`, `style.css`, `app.js`, `icon.svg`, `manifest.webmanifest`, `robots.txt`, `.nojekyll` and `README.md`.
3. In GitHub Desktop select Repository > Show in Explorer (or Finder). Copy **every extracted file directly into the repository root**, replacing older files. Do not copy the ZIP itself and do not copy an enclosing folder.
4. Commit to main and Push origin. In the GitHub repository, configure Settings > Pages > Deploy from branch > main > /(root).
5. Open `https://islamtanjawi.github.io/My-budget/` after deployment and hard-refresh if it appears cached.

## Important modeling limitations
- These estimates are not bank quotes, a full accounting system, tax advice or investment advice. Borrowing interest is calculated using a standard fixed-monthly-rate formula (annual nominal interest / 12); insurance and bank-specific terms can differ.
- Merchant revenue is **not** profit. Gross profit here uses a manually entered cost of goods sold, while cashflow subtracts stock purchase outflows; this is a planning model and does not automatically maintain inventory lots or tax payable.
- Emergency money is earmarked in the app; it is not actually transferred between bank accounts.
- Changing the display currency does not perform live FX conversion.
