# LORIN — Private LLM Download and Management Plan

## 1. Objective

Build a controlled model lifecycle manager for LORIN's local/private AI runtime. The browser UI is a control surface; model download, filesystem access, hardware probing and model process management must be owned by a trusted Windows companion or authenticated private backend. A web page must not pretend it can inspect local GPU memory or install a model directly onto a user's computer.

## 2. Initial technology direction

- Ollama: initial Windows local model runtime and local model inventory.
- Open-weight models: candidates selected after hardware benchmark and license review.
- Embeddings: separate model role for document indexing.
- Reranker: optional model role for improving retrieval relevance.
- vLLM: future private GPU server option after the first local model pipeline is stable.
- Model Gateway: one LORIN API abstraction so application features do not call Ollama or cloud vendors directly.

## 3. UI information architecture

Intelligence Studio contains four tabs: Model Library, Downloads, Providers and Hardware.

### Model Library fields

- Display name and canonical model identifier.
- Publisher and trusted source.
- Revision / immutable digest.
- License identifier and acceptance record.
- Parameter count and architecture family.
- Context length and supported modalities.
- Quantization choices.
- Approximate artifact size (source-provided, not guessed).
- Minimum/recommended RAM and VRAM (source-provided and benchmark qualified).
- Inference runtime compatibility.
- Checksum and manifest availability.

### Download workflow

1. User opens a model detail page.
2. The companion reports actual hardware and free storage.
3. Compatibility service checks the exact model revision and quantization.
4. User chooses an approved model directory.
5. Download worker streams the artifact to a temporary quarantine path.
6. Worker checks expected size, SHA-256 digest and signed/source manifest where available.
7. Worker atomically moves a verified artifact to the model store.
8. Runtime adapter registers the model and runs a minimal health/inference check.
9. Model becomes “Installed” only after registration and successful verification.

### Download states

`queued → checking → downloading → verifying → registering → health_check → installed`

Terminal states: `failed`, `cancelled`, `quarantined`. A failed or cancelled operation must clean or retain temporary files according to an explicit recovery policy. Do not report percent complete unless byte counts are measured.

## 4. Proposed service contract

The exact route names can be adapted to the existing backend, but the contract should provide equivalents of:

- `GET /api/intelligence/hardware` — signed hardware capability report with probe timestamp and companion version.
- `GET /api/intelligence/models` — trusted catalogue and local inventory, clearly separated.
- `GET /api/intelligence/models/:id` — immutable model revision details.
- `POST /api/intelligence/downloads` — create download job after compatibility and owner approval.
- `GET /api/intelligence/downloads/:jobId` — measured progress and log cursor.
- `POST /api/intelligence/downloads/:jobId/cancel` — cancel the job.
- `POST /api/intelligence/models/:id/verify` — recheck artifact integrity and manifest.
- `POST /api/intelligence/models/:id/activate` — register and health-check a selected model.
- `DELETE /api/intelligence/models/:id` — delete an installed model after confirmation, with dependency checks.
- `GET /api/intelligence/providers` and `POST /api/intelligence/providers/:id/health-check` — provider state and live test result.

All mutating routes require owner authorization, CSRF/session protection, idempotency keys, audit records and strict input validation.

## 5. Storage and security

- Default model directory should be configurable by the owner and outside the web application's static/public directory.
- Keep partial downloads in a separate temporary subdirectory.
- Prevent path traversal, symlink escape, archive traversal and unsafe overwrite.
- Check free space before download and reserve headroom for temporary and extracted files.
- Verify SHA-256, expected size and provider manifest before activation.
- Do not execute model-provided code or conversion scripts automatically.
- Restrict local model runtime endpoints to loopback or a private authenticated network.
- Never expose API keys, local runtime secrets or model-store paths to untrusted browser origins.
- Record model source, digest, license, quantization, install time and health-test result.

## 6. Hardware compatibility

The Windows companion reports CPU, core count, system RAM, GPU model, VRAM, driver/runtime versions, disk capacity and free space. Values include source and measurement time. The compatibility service evaluates the exact artifact, not just model family. If any required hardware fact is missing, report “Unknown” and prevent a confident compatibility claim.

## 7. Routing integration

The Model Gateway selects a model based on task class, latency, quality benchmarks, available memory, provider health, privacy rules and owner preference. Private content remains local unless the owner explicitly authorizes a particular cloud route. Fallback must not silently change the data boundary. Every decision stores provider, model, policy decision and reason.

## 8. Release gates

- Model catalogue signature/source validation.
- Interrupted-download recovery.
- Checksum mismatch and corrupted-file tests.
- Disk-full and permission-denied tests.
- Path traversal / symlink / archive-bomb tests.
- Model activation and health-check tests.
- Correct removal and rollback behaviour.
- Actual local inference from selected model.
- Accurate UI states backed by service responses.
