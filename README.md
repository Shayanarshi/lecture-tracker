# SBWMS Lecture Tracker

A responsive React + Vite + Tailwind CSS app to track the remaining SBWMS course lectures.

## Features
- Responsive dashboard with progress statistics
- Five-day lecture plan
- Mark lectures complete or pending
- Search lectures by number, date, or duration
- Filter by all, pending, and completed
- Progress persists in browser local storage
- Export progress as JSON
- Reset progress with confirmation
- Lucide icons

> Lecture 77 was missing from the supplied list, so the app includes the 30 listed lectures: 71–76 and 78–101.

## Requirements
- Node.js 18+ recommended
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Production build

```bash
npm run build
npm run preview
```

## Push to GitHub

Create an empty GitHub repository, then run from this project folder:

```bash
git init
git add .
git commit -m "Build React lecture tracker"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/sbwms-lecture-tracker.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

## Data storage
Progress is stored in `localStorage` in the current browser on the current device. Use **Export progress** to back up your completion data. It is not automatically synced between browsers or devices.