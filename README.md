# Fairfax area pages — batch 1

Next.js App Router pages for five Fairfax County area monographs:

- `/long-branch-va-real-estate`
- `/ravensworth-va-real-estate`
- `/west-springfield-va-real-estate`
- `/north-springfield-va-real-estate`
- `/burke-centre-va-real-estate`

Page text lives in `content/areas/*.js`. Each route's `page.js` builds metadata and the Article, BreadcrumbList and FAQPage JSON-LD from that file, and `components/AreaArticle.js` renders it.

```
npm install
npm run build
npm run lint
npm run content:md     # regenerate AREA-PAGES-CONTENT.md
npm run content:check  # after build: no dollar signs, FAQ schema matches visible FAQs, required sections present
```
