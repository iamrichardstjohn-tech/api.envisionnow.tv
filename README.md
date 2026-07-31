# EnvisionNow.TV — Vercel Ready

## Local validation
```bash
npm install
npm run build
```

## Vercel
Import this folder/repository into Vercel. Vercel will use:
- Framework: Vite
- Build command: `npm run build`
- Output directory: `dist`

## Required production follow-up
The signup form currently uses the placeholder `https://formspree.io/f/YOUR_FORM_ID`. Replace it with a real Formspree or backend endpoint before collecting production submissions.

## Zero-install fallback
The `static-deploy` folder contains the already compiled website and can be deployed directly to Vercel without running npm. In Vercel, set the Root Directory to `static-deploy`, Framework Preset to `Other`, leave Build Command empty, and use `.` as the Output Directory.
