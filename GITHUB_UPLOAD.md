# Upload to GitHub

Do not upload the ZIP file as the website source.

1. Download and extract `ENVISIONNOW_TV_GITHUB_READY.zip`.
2. Open the extracted folder.
3. In a new empty GitHub repository, choose **Add file → Upload files**.
4. Drag the contents of the extracted folder into GitHub, including `src`, `public`, `package.json`, and `vercel.json`.
5. Commit the files.
6. Import that repository into Vercel. Vercel should detect **Vite** automatically.

Vercel settings:
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm install`
