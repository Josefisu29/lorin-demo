# LORIN 2.0 — UI/UX Layout and Acceptance Specification

## 1. Product direction

LORIN is one private, owner-controlled personal intelligence workspace. Internal specialists are capabilities behind the main assistant, not competing chat identities. The interface should feel like a premium, dependable software product: calm, intelligent, precise and useful rather than a cinematic HUD or an overfilled analytics dashboard.

## 2. Design language

### Foundation

- Background: `#0B0F14`
- Surface: `#111821`
- Elevated surface: `#17212C`
- Borders: `#243140`
- Main text: `#E8EEF4`
- Muted text: `#8B9AAB`
- Primary accent: `#66E3CB`
- Secondary accent: `#A9B8FF`
- Warning: warm amber; danger: restrained muted red
- Typography: Inter for interface text; Space Grotesk for display headings
- Surfaces: hairline borders, controlled elevation, moderate corner radii
- Motion: short interruptible transitions; no essential information depends on animation
- Accessibility: keyboard focus, clear labels, reduced-motion support, touch targets and responsive reflow

### Layout principles

- Desktop: stable left navigation, central workspace and optional contextual inspector.
- Tablet: collapsible navigation and responsive card grids.
- Mobile: drawer navigation, horizontally scrollable compact mode controls, single-column content and full-width primary actions.
- Never create horizontal overflow at a 390 px viewport.
- Keep the core conversation accessible from all main modes.

## 3. Navigation map

### Workspace

1. Today — overview, active project, pending approvals, real session metrics and capability readiness.
2. Conversation — LORIN conversation, prompts, source references, model-route explanation and scoped actions.
3. Projects — project cards, active project selection and strict project boundaries.
4. Tasks & approvals — proposed, awaiting, running, completed, verified, failed, blocked and cancelled actions.
5. Workbench — controlled change proposals, diffs and verification evidence.
6. Sandbox — isolated execution workspace and job visibility (runtime is not connected in the current demo).

### Knowledge & memory

1. Knowledge vault — approved documents, search, indexing and source connectors.
2. Private vault — separated private content, local-only boundary and explicit access messaging.
3. Memory — approved records, source provenance, review, export and deletion roadmap.
4. Continuity — chronological GIDEON events and decision history.

### Senses

1. Voice — permission state, listening source, transcription state, speech output and interruption.
2. Vision — user-selected visual input, selected file details and honest model-processing state.

### Infrastructure

1. Intelligence Studio — model library, download manager, provider connections, routing and hardware readiness.
2. Connected Services — Google Drive, local folders and future connectors.
3. Devices — pairing, device status, revocation and companion health.
4. Security & Trust — roles, policies, capability registry, audit and access grants.

## 4. Intelligence Studio layout

### Model Library

- Search and filter by model purpose, provider, context range, license and hardware fit.
- Distinguish model catalogue entries from installed models.
- Each card must show exact model ID, version/revision, source, license, parameter size, quantization, context window, file size, checksum and compatibility status where known.
- Buttons must communicate whether they open details, queue a download or activate an installed model.

### Downloads

- Stepper: select model → compatibility check → choose storage → download → verify → register → health check.
- Queue list with real state: queued, downloading, verifying, installing, completed, failed, cancelled.
- Show bytes downloaded, total bytes, speed, ETA only when measured, retry controls and error details.
- Do not fake progress or claim installation before manifest/checksum verification and runtime registration.

### Providers

- Local runtime (Ollama initially), approved cloud providers (Gemini initially), future OpenAI-compatible endpoints and future private inference server.
- Each provider has connection state, last successful health check, endpoint, selected model and privacy policy.
- A provider is not “verified” because a user clicked a button. Verification requires an actual server-side health/authentication request.

### Hardware

- Trusted Windows companion reports CPU, system RAM, GPU, VRAM, storage capacity/free space, OS build and runtime version.
- Show source and timestamp of each probe.
- Unknown values remain “Unknown”; browser guesses are prohibited.
- Model compatibility must be checked against the exact model revision and quantization.

## 5. Connected Services and Google Drive layout

- Connection card: account label, connection state, granted scopes, last sync, selected folders/files, indexed file count and last error.
- Actions: connect, choose files/folders, sync now, pause, disconnect, revoke and inspect audit events.
- Permission summary: read/index by default; create/edit/delete originals off by default and separately approved.
- Sync details: file changes, content extraction status, chunk count, embedding status, index version and retry status.
- Distinguish imported originals, extracted text, indexed chunks and actual RAG retrieval events.

## 6. Sandbox layout

- Overview: runtime health, active jobs, queue, failed jobs, resource usage and recent artifacts.
- Environments: code, data, browser and app-preview workspaces.
- Job detail: task plan, policy decision, workspace ID, source revision, resource limits, logs, changed files, tests, artifacts and exit reason.
- Review: structured diff, security checks, test results and approval/reject controls.
- Destructive or external actions use explicit scoped authorization.

## 7. Interaction and status rules

- All visible controls perform a real action or are clearly disabled with a reason.
- Every asynchronous operation has loading, success, empty and error states.
- “Connected”, “verified”, “downloaded”, “indexed”, “running” and “completed” are evidence-backed statuses.
- No demo seed data may appear as a live connected account or remote file.
- No model/provider fallback may silently move private content to a cloud provider.
- No action is considered completed solely because a request was accepted.

## 8. Acceptance checklist

### Functional

- Navigation reaches every original and new view.
- Existing task approval/deny/verify/reject/cancel flows continue to work.
- Project switching preserves the Atlas/MOSAIRA privacy boundary.
- Knowledge and private vaults remain separate.
- Voice and vision disclose exactly what is and is not happening.
- Search fields filter the visible collection.
- Intelligence tabs, Connected Services setup details and Sandbox tabs work.

### Responsive

- Desktop 1440×900: sidebar, workspace, optional inspector do not overlap.
- Tablet 768×1024: navigation remains reachable and content grids reflow.
- Mobile 390×844: no horizontal overflow, controls have usable touch targets, cards stack and text remains readable.

### Reliability and accessibility

- No uncaught browser errors or failed application asset loads.
- Keyboard navigation and focus indication work.
- Reduced-motion preference is respected.
- Empty and error states are explicit and actionable.
- No invented telemetry, hardware readings or integration state.
