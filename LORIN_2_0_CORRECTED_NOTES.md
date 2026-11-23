# LORIN 2.0 — Corrected Upgrade Snapshot

**Date:** 23 November 2026  
**Base:** The exact root application supplied in `lorin demo.zip`  
**Status:** UI/UX source upgrade applied; runtime service integrations remain planned, not connected.

## Source-selection correction

The previous upgrade snapshot was incorrectly assembled from an embedded reference archive in the supplied ZIP. It was not a complete upgrade of the root demo application. This corrected snapshot is based on the root of the original `lorin demo.zip` and preserves its application structure, platform files, scripts, styles, package manifests, original attachments and existing feature surfaces.

The original package contained 245 files across 318 ZIP entries (approximately 121 MB uncompressed). This corrected build is intended to retain the original root paths and all original packaged assets, then add this document set and update the root application's source files.

## Existing functionality preserved

- Today / Home
- Conversation
- Projects and Atlas / MOSAIRA context separation
- Tasks and single-use approval flow
- Knowledge vault and private vault separation
- Memory proposals and verification
- GIDEON continuity history
- Voice interaction and explicit microphone permission
- Vision single-image local acknowledgement
- Workbench policy-diff proposal
- Device pairing demonstration and revocation
- Trust capability registry, specialist roster and audit history
- Workspace, Companion, Compact, Immersive and Ambient presentation modes
- Original TanStack Start shell, auth provider, preview host bridge, PWA middleware, Vercel configuration, migration and test scripts
- Original embedded reference archives and App Builder materials

## UI/UX work applied

- Reworked the application shell into a responsive, grouped navigation system.
- Added consistent top bar, project context, presentation-mode switcher, inspector and status language.
- Added a coherent component language for page headers, panels, metric cards, actions, badges, forms, timelines and empty states.
- Redesigned all existing main views to use consistent spacing, hierarchy and responsive layouts.
- Added Intelligence Studio with Model Library, Downloads, Providers and Hardware sections.
- Added Connected Services with Google Drive and local-folder setup surfaces.
- Added Sandbox with overview, environments and security-policy sections.
- Added explicit integration readiness states. No model, Drive account, file, download, hardware reading or sandbox job is reported as connected unless a real service reports it.
- Retained the reduced-motion preference and improved mobile navigation and touch layouts.
- Removed the local-only Gemini verification toggle as a source of authorization. Historical persisted demo flags are cleared during rehydration.

## Important implementation boundary

The new screens are functional UI and layout surfaces. This snapshot does **not** claim to implement:

- A live Ollama/native model manager or model download worker.
- A live Gemini API request or provider credential verification.
- A Google OAuth flow, Picker, refresh-token store or Drive synchronization worker.
- A Windows hardware-probe companion.
- A container or microVM sandbox executor.
- Production persistent multi-device memory or a completed RAG/vector pipeline.

Those require trusted backend/native services, credentials, permission handling, environment configuration and end-to-end verification. The new UI intentionally labels them as pending.

## Verification performed in this environment

- TypeScript/TSX syntax transpilation of changed source files: no syntax diagnostics.
- Original project test suite: 191 passed, 6 failed out of 197.
- The same six tests fail on the untouched original demo copy, so they are pre-existing baseline failures in the App Builder PWA/title-injection tests, not regressions from the UI changes.
- `npm ci --dry-run` could not reach `registry.npmjs.org` (DNS `EAI_AGAIN`), so dependencies could not be installed in this environment.
- Full TypeScript typecheck, Vite build, dev-server render and browser desktop/mobile QA therefore remain unverified here. Do not treat this snapshot as production-certified until those gates pass in the target App Builder environment or a network-enabled Windows/Linux development environment.

## Files changed

- `src/components/lorin/chrome.tsx`
- `src/components/lorin/views.tsx`
- `src/components/lorin/App.tsx`
- `src/lib/lorin/engine.ts`
- `src/lib/lorin/store.ts`
- `src/styles.css`

## Added documents

- `docs/LORIN_2_0_UI_UX_LAYOUT_AND_ACCEPTANCE.md`
- `docs/LLM_MODEL_DOWNLOAD_MANAGER_PLAN.md`
- `docs/GOOGLE_DRIVE_KNOWLEDGE_CONNECTOR_PLAN.md`
- `docs/SECURE_SANDBOX_EXECUTION_PLAN.md`
