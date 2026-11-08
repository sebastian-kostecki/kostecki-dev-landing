# Root Keeper

A family tree where every fact is linked to a source: a parish record, a civil registry entry, a gravestone. Built for after-hours genealogy research, where "probably" is not good enough.

Live: https://genealog.kostecki.dev

## What it does

- Tree view with people, parent links and partial dates (year only, "about", "before/after").
- Sources (records, books, gravestones) attached to facts, so every date and place can be traced back.
- Places and parishes index.
- Relationship rules enforced server-side: at most two parents, no cycles.

## Stack

PHP 8.5 · Laravel 13 · Inertia v3 · React 19 (React Compiler) · TypeScript · Tailwind CSS v4 · PostgreSQL · Laravel Fortify · Pest 5 / PHPUnit 13 · Larastan level 7 · Playwright · Vite+ (Oxlint, Oxfmt)

## Quality gates

Four GitHub Actions workflows run on every push and pull request:

| Workflow | What it checks |
|---|---|
| `lint` | Oxlint and Oxfmt, warnings treated as errors |
| `static-analysis` | Larastan level 7 |
| `tests` | Pest feature and unit tests |
| `e2e` | Playwright end-to-end tests |

## How it is built

The product is shaped in `context/foundation/` (PRD, roadmap, infrastructure, health checks). Each change gets its own folder in `context/changes/` with research, a plan and an implementation review, and moves to the archive when it ships. Coding agents (Claude Code) follow `CLAUDE.md`; every change lands through a pull request with green CI.

## Running locally

Requires Docker (Laravel Sail).

```bash
cp .env.example .env
./vendor/bin/sail up -d
./vendor/bin/sail artisan key:generate
./vendor/bin/sail artisan migrate --seed
./vendor/bin/sail npm install
./vendor/bin/sail npm run dev
```

`TreeViewDemoSeeder` creates a fictional demo family with sources.

## License

MIT
