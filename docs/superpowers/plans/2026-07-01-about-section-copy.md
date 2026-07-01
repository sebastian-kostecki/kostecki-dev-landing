# About Section Copy — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the three `about.paragraphs` strings in PL and EN content JSON with the approved copy from the about-section design spec.

**Architecture:** Content-only change. `AboutSection.vue` already renders `content.about.paragraphs` as a list — no component or type changes required.

**Tech Stack:** Vue 3, JSON content files, Vite. No test framework — verify with JSON parse, `pnpm build`, manual locale check.

**Spec:** `docs/superpowers/specs/2026-07-01-about-section-design.md`

---

## Verification model

- `node -e "JSON.parse(...)"` on each edited JSON file → `OK`
- `pnpm type-check && pnpm lint && pnpm build` → exit 0
- `rg` spot-check for approved opening phrases in both locale files
- Manual: `pnpm dev` → About section in PL and EN

---

## File Structure

**Modify only:**
- `src/content/pl.json` — `about.paragraphs` array (3 strings)
- `src/content/en.json` — `about.paragraphs` array (3 strings)

---

## Task 1: Polish about copy (`pl.json`)

**Files:**
- Modify: `src/content/pl.json`

- [ ] **Step 1: Replace `about.paragraphs`**

Replace the `about` object paragraphs (lines 44–48) with:

```json
    "paragraphs": [
      "Od 4 lat buduję backend w PHP — głównie Laravel — w produkcyjnym produkcie B2B. Pracuję w ModulesGarden nad platformą PanelAlpha, która firmom usługowym umożliwia automatyzację zarządzania WordPress.",
      "Lubię przejąć feature i dowieźć go od warstwy backendowej po działającą logikę — a gdy potrzeba, wchodzę we frontend (Vue.js). Pracuję na żywym produkcie, więc liczy się dla mnie kod, który faktycznie działa u klientów.",
      "Na co dzień korzystam z narzędzi AI (m.in. Cursor) jako wsparcia przy implementacji i refaktoryzacji. Poza kodem — rodzina, wypoczynek na świeżym powietrzu i ciągły rozwój w IT."
    ]
```

- [ ] **Step 2: Verify JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('src/content/pl.json','utf8')); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 3: Confirm old hosting-first copy is gone**

```bash
rg "hosterom umożliwia provisioning|integracje z infrastrukturą hostingową" src/content/pl.json
```

Expected: no matches

---

## Task 2: English about copy (`en.json`)

**Files:**
- Modify: `src/content/en.json`

- [ ] **Step 1: Replace `about.paragraphs`**

```json
    "paragraphs": [
      "For 4 years I've been building PHP backends — mostly Laravel — on a production B2B product. At ModulesGarden I work on PanelAlpha, a platform that helps service companies automate WordPress management.",
      "I like owning a feature from the backend layer through to working business logic — and when needed, I pick up the frontend (Vue.js). I work on a live product, so I care about code that actually works for customers.",
      "Day to day I use AI tools (including Cursor) to support implementation and refactoring. Outside of code — family, time outdoors, and keeping up with the industry."
    ]
```

- [ ] **Step 2: Verify JSON**

```bash
node -e "JSON.parse(require('fs').readFileSync('src/content/en.json','utf8')); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 3: Confirm old copy is gone**

```bash
rg "hosting providers provision|integrations with hosting infrastructure" src/content/en.json
```

Expected: no matches

---

## Task 3: Final verification

**Files:** none (commands only)

- [ ] **Step 1: Build pipeline**

```bash
pnpm type-check && pnpm lint && pnpm build
```

Expected: exit 0

- [ ] **Step 2: Confirm new copy present**

```bash
rg "wypoczynek na świeżym powietrzu|time outdoors" src/content/
```

Expected: one match per locale file

- [ ] **Step 3: Manual smoke test**

Run `pnpm dev`, scroll to About (`#about`):

- PL: 3 paragraphs match spec; mentions family + outdoor rest
- EN: switch locale; same structure and messaging
- Experience section below unchanged (still has detailed PanelAlpha bullets)

- [ ] **Step 4: Commit (if requested)**

```bash
git add src/content/pl.json src/content/en.json docs/superpowers/specs/2026-07-01-about-section-design.md docs/superpowers/plans/2026-07-01-about-section-copy.md
git commit -m "$(cat <<'EOF'
feat: rewrite about section for recruiter-friendly positioning

Emphasize ownership and production quality with a lightly personal close;
reduce overlap with experience section hosting jargon.
EOF
)"
```
