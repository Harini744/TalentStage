# TalentStage

An AI-powered freelancer marketplace built with **React + Vite + Tailwind CSS**, using **Firebase Authentication** and **Cloud Firestore**. No custom backend is required.

## Features

- Sign up / log in with email and password, plus onboarding (identity verification request and profile setup)
- Roles: freelancer, client, or both
- Freelancers: profile, portfolio gallery, browse projects, submit bids, earnings dashboard, skill quizzes
- Clients: post projects (4-step wizard), review proposals, hire, save talents with private notes
- Contracts: milestone escrow tracker, delivery links, realtime chat
- Community: public feed with likes, skill challenges, mentorship list
- AI helpers (scope a project, match freelancers, evaluate bids, audit a portfolio, generate skill tests). They run with a simulator by default, or with real Claude responses if you add an Anthropic API key in the app header.

## Tech stack

React 19, Vite, Tailwind CSS 4, React Router, Recharts, Lucide icons, Firebase (Auth + Firestore).

## Prerequisites

- Node.js 22 or newer
- A free Firebase account

## Setup

### 1. Create the Firebase project
1. Go to the [Firebase console](https://console.firebase.google.com) and create a project.
2. Add a **Web app** (the `</>` icon) and copy the config values it shows.
3. **Build → Authentication → Sign-in method:** enable **Email/Password**.
4. **Build → Firestore Database:** click **Create database** and choose a location.

### 2. Add your config
Create a file named exactly `.env` in this folder (next to `package.json`). Copy `.env.example` and fill it in:

```dotenv
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef

# Optional
VITE_CLAUDE_MODEL=claude-sonnet-5-5
```

Rules for `.env`: no spaces around `=`, no quotes, no commas. Restart the dev server after editing it.

### 3. Publish the security rules
Open **Firestore Database → Rules**, replace everything with the contents of `firestore.rules`, and click **Publish**.

Or with the Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
firebase use --add
firebase deploy --only firestore:rules
```

### 4. Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173 and create an account.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Check the code with ESLint |

## Deploying

```bash
npm run build
firebase deploy --only hosting
```

`firebase.json` is already configured for single-page-app hosting.

## Project structure

```
src/
  main.jsx, App.jsx, index.css
  firebase/     Firebase config and services (auth, users, projects, contracts, wallet, community)
  context/      Auth, Toast and AI-settings providers
  hooks/        Realtime Firestore hooks
  services/ai/  Claude client and local simulator
  config/       Routes and sidebar navigation
  constants/    Shared options and fallback data
  utils/        Formatting, profile score, earnings calculations
  components/   ui/, layout/, common/, auth/, projects/, profile/, contracts/, earnings/
  pages/        One file per screen (freelancer/, client/, community/)
```

## Firestore collections

| Collection | Contents |
|---|---|
| `users` | Profiles, skills, portfolio, saved talents |
| `projects` | Posted project briefs |
| `proposals` | Freelancer bids |
| `contracts` (+ `messages`) | Hires, milestones, chat |
| `transactions` | Income and withdrawals |
| `posts` | Community feed |
| `challenges` (+ `submissions`) | Skill challenges and entries |

If `challenges` is empty, built-in sample challenges are shown.

## Troubleshooting

| Problem | Fix |
|---|---|
| `auth/invalid-api-key` or "Missing VITE_FIREBASE" | `.env` is missing, misnamed (`.env.example` is ignored), or badly formatted. Fix it and restart `npm run dev`. |
| "Missing or insufficient permissions" | Publish `firestore.rules` (step 3). |
| `auth/operation-not-allowed` | Enable Email/Password sign-in (step 1). |
| Page stuck loading after login | Firestore database not created, or rules not published. Check the browser console (F12). |

## Important notes

- **Payments are simulated.** The client's browser writes the freelancer's income record. Before handling real money, move milestone release into a Cloud Function or payment provider webhook.
- **Verification is manual.** Verification requests are saved as "pending". The verified badge can only be granted in the Firebase console.
- **Anthropic key:** if a user adds one in the app, it stays in that browser tab only. For production, proxy Claude calls through a server or Cloud Function so no key lives in the frontend.
- Firebase web config values are not secret. Your Firestore rules are what protect your data.