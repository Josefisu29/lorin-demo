# LORIN 2.0 — Corrected Demo Upgrade

This package is an additive UI/UX upgrade of the **root application in the supplied `lorin demo.zip`**. It is not rebuilt from one of the embedded reference ZIPs.

## Preserve and source of truth

- The original root project, package manifest and lockfile are retained.
- Original application features, platform shell, authentication scaffolding, preview bridge, PWA/server middleware, migrations, scripts, screenshots, attachments and embedded reference archives are retained.
- The root application's six edited source files are listed in `LORIN_2_0_CORRECTED_NOTES.md`.
- New layout and implementation plans are under `docs/`.

## Start locally on Windows

1. Extract the ZIP to a normal writable folder (not inside another ZIP or a protected system folder).
2. Install Node.js 22 or a compatible Node 22 release and npm.
3. Open PowerShell in the extracted project root (the folder containing `package.json`).
4. Install the locked dependencies:

   ```powershell
   npm ci
   ```

5. Start the development application:

   ```powershell
   npm run dev
   ```

6. Open `http://localhost:8080`.

If dependency installation fails, check network access to the npm registry and retry. Do not delete or regenerate `package-lock.json` just to silence an install error; reconcile the manifest and lockfile deliberately.

## Useful project commands

```powershell
npm test
npm run typecheck
npm run lint
npm run build
```

Run these from the project root. The upgrade snapshot's test and build limitations are recorded in `LORIN_2_0_CORRECTED_NOTES.md`.

## What changed in this update

- Existing demo workspaces have been visually reorganized and redesigned while retaining their underlying demo flows.
- New Intelligence Studio, Connected Services and Sandbox views are added to the same app shell.
- The local-only Gemini verification flag can no longer authorize cloud routing.
- New detailed specifications define the next implementation stages for local model downloads, Google Drive and secure sandbox execution.

## Important capability boundary

This is a **UI/UX source upgrade and implementation-ready layout snapshot**, not a claim that all infrastructure integrations are live. The current demo does not include a production model download worker, Google OAuth/Drive sync backend, trusted hardware-probe companion or isolated container/microVM sandbox executor. These are documented as pending in `docs/` and are shown honestly in the interface.

Before deployment, install dependencies, run typecheck/lint/build and complete desktop/mobile browser QA in a network-enabled development environment. The original `.vercel/output` files are retained as supplied; a successful new build should generate fresh deployment output from the updated source.
