# Ambimed Healthcare Website

A React (Vite) website for **Ambimed Healthcare**—elder care, physiotherapy, home nurses, and mother & baby care at home. Elegant, trustworthy, and modular for easy editing.

## Theme

- **Deep blue:** `#1D3D72`
- **Bright blue:** `#0078D4`
- **White:** `#FFFFFF`

## Client app (web) – same backend as the Ambimed mobile app

The public marketing site stays at **`/`**. The **client booking experience** (sign in with phone OTP, browse services from Supabase, book with address & dates, view history) lives at **`/app`**, aligned with `ambimed/frontend` (Expo).

1. Copy `.env.example` to `.env` and set:
   - `VITE_SUPABASE_URL` – same project as the mobile app (`EXPO_PUBLIC_SUPABASE_URL`)
   - `VITE_SUPABASE_ANON_KEY` – same as `EXPO_PUBLIC_SUPABASE_ANON_KEY`
2. Restart `npm run dev`
3. Open **http://localhost:5173/app** – sign in with the same phone as the app (client profile required).

**Routes:** `/app` → booking home · `/app/login` · `/app/booking` · `/app/book/:serviceTypeId` · `/app/book/review` · `/app/history` (legacy `/app/home` redirects to `/app/booking`)

Deploying the built site to static hosting: configure the server to **serve `index.html` for all routes** (SPA fallback) so `/app/...` works.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Use **Book care** in the header or hero to open **`/app`**.

## Build for production

```bash
npm run build
npm run preview   # optional: preview the build
```

## Modular editing

- **App links & contact:** Edit `src/data/config.js` for Google Play app URL, caregiver app URL, QR image paths, and contact details.
- **Customer feedback:** Edit `src/data/testimonials.js` to add or change testimonials.
- **Services:** Edit `src/data/services.js` for service titles and descriptions.
- **Team:** Edit `src/data/team.js` for team members and photos.
- **Sections:** Each section is a component in `src/components/` with its own CSS file. Add, remove, or reorder sections in `src/App.jsx`.

## Assets

All images live in `public/assets/`. You can replace any of these with your own photos later.

- **Logo:** `ambimed-logo.png` — Ambimed logo 5 (house + nurse + arrow). Replace this file to change the logo.
- **Hero:** `hero-caregiver-home.png` — Family welcoming caregiver at home (AI-generated placeholder).
- **About:** `what-we-do-1.png` — Care-at-home photo (your provided image).
- **What we do cards:** `what-we-do-1.png` (physiotherapy), `what-we-do-2.png` (mother & baby), `what-we-do-3.png` (caregiving) — your provided photos.
- **Caregivers section:** `elder-care-home.png` — Elder care at home (AI-generated placeholder).
- **Additional placeholders** (replace as needed): `physiotherapy-home.png`, `mother-baby-care.png`, `hero-app-booking.png`.
- **App QR codes:** Add `qr-client-app.png` and `qr-caregiver-app.png` when ready; paths in `src/data/config.js`.

## “Not secure” in the browser

The app does **not** use `http://` anywhere (fonts and assets use relative paths or `https://`).  
The “Not secure” message appears because the **page itself** is loaded over **HTTP** (e.g. `http://localhost:5173` or a server without HTTPS).

- **Local:** Run with HTTPS (see below) or ignore the warning on localhost.
- **Production:** Serve the site over **HTTPS** (your host’s SSL certificate, e.g. Let’s Encrypt). No code changes needed.

### Optional: HTTPS for local dev

To use `https://localhost:5173`:

```bash
npm install -D @vitejs/plugin-basic-ssl
```

Then in `vite.config.js` add the plugin and `server.https: true` (see comments in the file).

## Tech stack

- React 18, Vite 5
- Framer Motion for animations
- CSS variables for theme; no UI framework
