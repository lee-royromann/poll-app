# Poll App

A small web app for creating and answering surveys ("polls"), built with Angular and a
Supabase backend. Anyone can create a survey, share it, vote, and watch the results update
live — no login required. Built to the "Poll App Design" Figma spec (desktop 1440px and
mobile 375px).

Live: https://poll-app.lee-roy.ch

## Features

- **Home** — all surveys at a glance, sorted by deadline, with an "Ending soon" highlight
  row, `Active` / `Past` tabs, and a category filter.
- **Create** — a separate form with required (title, answer options) and optional fields
  (description, end date, category), inline validation, and 2–6 answers per question.
- **Vote** — open a running survey, pick answers, and complete it; every question must be
  answered before submitting. Past surveys are read-only and not clickable.
- **Live results** — a horizontal bar chart that updates as you select options; shown next
  to the form on desktop and behind a "See results" accordion on mobile.
- **Responsive** — a single mobile breakpoint (768px); the layout stacks vertically below it.

## Tech stack

- Angular 21 (standalone components, signals, native control flow)
- TypeScript, SCSS (BEM + shared mixins), HTML
- Supabase (`@supabase/supabase-js`) with two tables: `surveys` + `votes`
- `@fontsource/nerko-one` + `@fontsource/mulish` for the design fonts

## Getting started

**Prerequisites:** Node.js 20+ and a Supabase project with the schema from
`_docs/poll-app-handoff/docs/database.md` (tables `surveys` + `votes`, plus the read/insert
RLS policies).

1. Install dependencies:

   ```bash
   npm install
   ```

2. Add your Supabase URL and anon key to the environment files
   (`src/environments/environment.ts` and `environment.development.ts`):

   ```ts
   export const environment = {
     supabaseUrl: 'https://<your-project>.supabase.co',
     supabaseKey: '<your-anon-key>',
   };
   ```

3. Start the dev server:

   ```bash
   npm start
   ```

   Open `http://localhost:4200/`.

## Build & deploy

```bash
ng build
```

The production build lands in `dist/poll-app/browser/` — upload the **contents** of that
folder to any static host. The app uses **hash-based routing** (`/#/survey/:id`), so it needs
no server-side rewrite rules and works on hosting that answers unknown paths with a 404.

## Project structure

```
src/app/
  core/        models, services (SurveyService, VotesService), utilities
  features/    home, survey-create, survey-detail
  shared/      header, survey-card, survey-list-card, category-dropdown
src/styles/    _mixins.scss (shared button/badge/checkbox/breakpoint mixins)
```

Design tokens (colours, fonts, spacing) live as CSS custom properties in `src/styles.scss`.
