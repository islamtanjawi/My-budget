# Verification — 2026-11-09

## Automated

`npm run check`, `npm test`, `npm run build`.

Calculation tests cover period conversion, annual reserves, avoiding duplicate goal deductions, deficits, zero income, goal completion, date gaps, zero-return accumulation, inflation, negative returns, fees, cash drawdown, import validation and complete translation-key parity.

## Browser checks

- Empty-state dashboard renders without invented user data.
- Explicit sample: income 3,000; costs 1,700; monthly surplus 1,300; goal allocation 500; remaining allocation 800.
- Added illustrative annual tax reserve 1,200: monthly costs became 1,800 and surplus 1,200.
- German forecast for 1 year with initial savings 3,000 and monthly 1,200: 17,400 at zero return.
- Added German annual preparation reminder with multiline notes.
- Arabic goal update to 1,500 monthly correctly warns of a 300 over-allocation.
- Four language translations have exact key parity; Arabic layout uses RTL.

## Explicit limitations

No authenticated GitHub write connection was available at creation. Public GitHub Pages publication is separate from the private review deployment. No bank, live exchange rate, city cost data, tax submission or live advertisement integrations are claimed.
- Arabic responsive rendering reviewed in a 390px-wide iframe viewport; native mobile devices were not tested.
- What-if income +200 and expenses −100 changes a 1,200 surplus to 1,500, with 3,600 difference over 12 months.
- A recorded 75 expense appears only in the actual journal, with recorded net flow −75.
- Forecast controls updated on input after browser testing revealed a need for immediate recalculation.

## V2 checks (2026-11-09)

- 21 native automated tests passed with `npm test`; V1 regressions remained green.
- `npm run check` and `npm run build` verified the module syntax and static assets.
- Browser interaction smoke test passed on Chromium using injected local test assets: 12 routes, create recurring expense, create debt, category cap save, tax country/year update, document add and completion toggle, Arabic RTL, desktop and narrow mobile layouts; **no page JavaScript errors**.
- The test environment blocks navigation to localhost and `file://` URLs. Therefore actual HTTP module loading and real service-worker installation were not independently browser-tested here. GitHub Pages deployment remains necessary for a full hosted test.
- Tested financial model for paused subscriptions, debt extra-payment inclusion, underfunded loans, avalanche/snowball comparison, emergency-earmark exclusion and invalid backup values.
- New sections are local-only and illustrative: no bank synchronizations, tax refunds, country-specific tax returns, live exchange rates, investment trades, reminders by email, cloud sync or paid subscriptions.
