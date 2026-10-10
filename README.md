# delivery-ui

React (Vite) dashboard for **Delivery Intelligence**: KPI cards, delay-hotspot map (Leaflet),
rain/festival trend (Recharts), partner and hub leaderboards, filters, and auto-generated recommendations.

## Run locally (VS Code)

1. Start the backend first (`delivery-api`, http://localhost:8080).
2. In a terminal inside this folder:

```bash
npm install
npm run dev
```

3. Open http://localhost:5173

The backend URL comes from `VITE_API_URL` (defaults to `http://localhost:8080`).
To change it, copy `.env.example` to `.env.local` and edit it.

## Deploy to Firebase Hosting (free plan)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting      # choose your Google Cloud project, public dir: dist, single-page app: Yes, overwrite index.html: No
```

Create `.env.production` with your Cloud Run URL (no trailing slash):

```
VITE_API_URL=https://delivery-api-xxxxx-el.a.run.app
```

Then build and deploy:

```bash
npm run build
firebase deploy --only hosting
```

Finally allow your Firebase URL in the backend:

```bash
gcloud run services update delivery-api --region asia-south1 \
  --update-env-vars "CORS_ORIGINS=https://YOUR-PROJECT.web.app,https://YOUR-PROJECT.firebaseapp.com"
```

## Project layout

```
src/
  App.jsx              loads filters + all endpoints, lays out the dashboard
  api.js               fetch helper (reads VITE_API_URL)
  format.js            currency / percent helpers and risk colours
  components/          Filters, Kpis, RiskMap, TrendChart, Leaderboard, Factors, Insights
```
