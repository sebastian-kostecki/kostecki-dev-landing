---
change_id: site-prerender
title: Prerender wszystkich tras po buildzie wraz z sitemapą, JSON-LD i llms.txt
status: implementing
created: 2026-11-09
updated: 2026-11-09
archived_at: null
---

## Notes

Prerender wszystkich tras z src/router po buildzie, żeby każdy URL zwracał własny HTML z treścią i meta (audyt B1). Research ma porównać post-build prerender z vite-ssg i wybrać tańsze dla statycznego JSON-a. Po prerenderze sitemap ze wszystkimi trasami, JSON-LD Person i llms.txt z gałęzi design/hero-variants.
