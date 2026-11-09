# My Budget

A global, offline-ready, local-first personal budget planner, built for https://github.com/islamtanjawi/My-budget.

## Version 2 — complete scope

All V1 features are retained. Additional features:

- Subscriptions and recurring bills with active/paused states, optional renewal dates, monthly and yearly totals. Active subscriptions are automatically part of planned expenses.
- Debt tracker with principal, APR, minimum repayment, optional extra repayment, and comparison of **avalanche** and **snowball** plans with a clear non-amortization warning. Debt payments are included in the budget, not applied to balances automatically.
- Spending insights with manual month-by-month actual ledger comparisons and optional category ceilings.
- Emergency reserve planner that excludes savings earmarked for other financial goals.
- International tax-document organizer with residence country, tax year, checklist progress and personal notes. Personal annual reminder dates remain separate; the country does not select official filing deadlines.
- In-browser print-friendly summaries, installable web-app manifest and cached offline reading after initial visit on supported secure hosts.
- Fully translated interface for all new features in Arabic, English, French and German.
- Local V1 data compatibility: storage remains under `my-budget-v1`; older validated backups load with default values for V2 additions.

**How to avoid double counting:** Active subscriptions, minimum debt payments, and any extra debt payment are automatically included in monthly expenses. Do not enter the same obligations in the ordinary expenses list. The journal is for actual transactions and does not modify these plans.


- Complete English, Arabic (RTL), French and German interfaces.
- Planning currencies from the browser's ISO currency list. **No exchange-rate conversion.**
- Net income and expense planning with weekly, biweekly, monthly, quarterly and annual periods.
- Savings goals, deadlines, monthly allocations, milestone timelines and over-allocation warnings.
- Future projections from 1–40 years with zero-return baseline, optional hypothetical returns, inflation and percentage fees.
- What-if income / cost scenarios; positive adjustments can be applied, reductions are applied by editing original entries.
- Actual income/expense journal, month filtering and safe CSV export.
- Annual organizer with personal dates, preparation notes and completed/pending status. Tax reserve category and a link to the official ELSTER portal.
- Local storage, JSON backup/restore with validation, delete/reset, light/dark modes.
- Original multilingual guide and privacy/terms pages. No external libraries, fonts, analytics or ad scripts. An offline service worker caches only static files, never financial data or JSON/CSV backups.

## Run and verify

Requires Node.js 22+ for checks/build; no package installation required.

```sh
npm run check
npm test
npm run build
python3 -m http.server 8080 --directory dist
```

Open http://localhost:8080. Serve over HTTP; opening a module-based app as a `file://` URL may be blocked by a browser.

## GitHub Pages

The workflow `.github/workflows/pages.yml` tests, builds and deploys `dist` from `main`.

The repository owner must enable **Settings → Pages → Source: GitHub Actions** once (or grant API access so it can be enabled). The repository's source files, including `.github/workflows/pages.yml`, must be pushed to `main`. The expected GitHub Pages URL is https://islamtanjawi.github.io/My-budget/ ; that URL is not a claim that deployment has succeeded.

Root HTML and relative asset links also allow conventional root-directory static hosting. The build artifact contains no tests, source helpers or private data.

## Financial model

- Weekly × 52 / 12; biweekly × 26 / 12; quarterly ÷ 3; yearly ÷ 12.
- Monthly surplus = normalized net income − ordinary normalized expenses − active subscriptions − minimum debt payments − configured extra debt payment (when active debt exists).
- Goal contributions allocate this surplus. They do not subtract a second time from projected total savings.
- Starting savings include all earmarked goal balances. The app warns if goal balances exceed total savings.
- Goal duration rounds up `(target − saved) / monthly contribution`. Dates and contributions do not automatically change after a goal is completed.
- Future monthly rate = `((1 + annualReturn/100) * (1 − fees/100))^(1/12) − 1`.
- Deposits occur at month-end. Purchasing power divides the balance by `(1 + inflation/100)^(month/12)`.
- The future model is a fixed-assumption accumulation illustration. It does not model goal purchases, withdrawals, variable returns, debt payoff milestones, tax liabilities or entire net worth. Currently planned repayments remain fixed expenses in long-range projections even if a debt would finish earlier. A negative balance is an unfunded gap.
- Actual journal entries never silently modify the plan or starting savings.
- Reminder dates are user supplied, not official deadlines; there are no automatic notifications or document uploads.

## Privacy and monetization

No backend or account is required. Data stays in browser localStorage under `my-budget-v1`; clearing browser storage removes it. This is not encrypted storage. Backups contain private financial details. Hosting infrastructure may process routine request metadata.

Ads are intentionally inactive: no publisher identifier for this project was supplied. Do not reuse another site's advertising identifier without confirmation. Before enabling ads, add the owner's approved publisher configuration, suitable consent management, publisher/legal/contact details, and update the privacy page for the actual providers and target jurisdictions. Never send income, debts, notes, goals or financial journal data to ad/analytics systems. Prefer placing ads only on public educational pages. Ad approval and earnings are not guaranteed.

German language support is not German tax calculation software. The planner does not prepare or submit tax returns, calculate refunds, determine filing deadlines, or connect to ELSTER. Do not double count withholding already deducted from net income.

## Verification

See `QA.md` for V2 tests and limitations. The browser test data is stored in the test browser only and is not shipped in source. The optional example is clearly identified and only loads on user request.
