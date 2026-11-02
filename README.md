# CareFlow landing page

Landing page for CareFlow, a concept product for emergency room nurses.

Live site: https://careflow-ban.pages.dev/

CareFlow is a concept in development by a Carnegie Mellon student team. It is not available for clinical use, and the patient shown in the demo is fictional.

## Run it

```sh
npm install
npm run dev
```

Other scripts: `npm test`, `npm run lint`, `npm run build`.

## Configuration

Everything that changes per deployment is in `src/config.ts`: the Google Analytics ID, the video link, the site URL and the signup form. With no form connected, the signup flow runs without saving anything.

## Stack

React, TypeScript and Vite, with CSS Modules. Tests use Vitest and Testing Library. The page is a static build, so any static host works.
