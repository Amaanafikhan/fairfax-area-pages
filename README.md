# Fairfax area pages

Next.js App Router site for Fairfax County area reference guides, styled after the homesalesfairfax.com guide template.

## Pages

- `/` — index of area guides
- `/long-branch-fairfax-county-virginia-real-estate-landscape` — Long Branch, Fairfax County, Virginia

## Layout

- `content/long-branch.js` — all page text, tables, FAQs, references and disclaimers
- `app/long-branch-fairfax-county-virginia-real-estate-landscape/page.js` — metadata plus `Article`, `BreadcrumbList` and `FAQPage` JSON-LD
- `components/LongBranchMonograph.jsx` — client component that renders the guide (contents highlighting, FAQ expand/collapse)
- `lib/site.js` — site name, URL and header links; `HEADER_PHONE` is intentionally empty

## Commands

```
npm install
npm run build
npm run lint
npm run content:check   # after build: no dollar signs, 10 FAQs, FAQ schema and sections present
```
