# LORIN — Google Drive Knowledge Connector Plan

## 1. Objective

Connect owner-selected Google Drive documents to LORIN's Knowledge Vault so the assistant can search and cite approved information without requiring repeated manual uploads. Google Drive remains an external source; LORIN's own database/object store remains the canonical home for LORIN-owned memory, task history and application data.

## 2. Initial access model

- Begin with user-selected files and the narrowest compatible Google Drive scope (`drive.file`) through Google Picker.
- Do not request full Drive read access unless a documented use case requires it and the owner explicitly approves it.
- Do not request Drive write/delete access for the initial read-and-index integration.
- Explain the exact permissions before consent.
- Make disconnect and Google-side revocation easy to understand.

The application must use the appropriate Google OAuth flow for the actual deployment type. OAuth state/nonce protection and PKCE should be used where supported by the chosen client flow. Refresh tokens and client secrets must remain server-side and be encrypted at rest with a managed key. Never store them in `localStorage`, frontend state, logs or generated client bundles.

## 3. User experience

### Connected Services → Google Drive

- Connection status: not connected / authorizing / connected / reauthorization required / revoked / error.
- Google account label (minimum identifying information only).
- Granted scopes and consent timestamp.
- Choose files/folders via Google Picker.
- Per-source inclusion and exclusion controls.
- Read/index permission summary.
- Sync now, pause, retry, disconnect and revoke actions.
- Last sync, last successful change token, source count and processing errors.

### Knowledge Vault → Sources

- Source name and Drive file ID.
- MIME type, owner, selected location/folder context and modified time.
- Imported version / checksum.
- Processing state and parser result.
- Indexed chunks and embedding version.
- Searchable source citation that links to the original Drive file only when permission remains valid.

## 4. Synchronization pipeline

1. Complete OAuth callback and validate state.
2. Persist encrypted token material on the backend.
3. User selects files through Picker.
4. Store file IDs, metadata and granted access scope.
5. Fetch initial content using Drive download for binary files or export for Google Workspace documents.
6. Validate MIME type, size, extension/content consistency and supported parser.
7. Scan/quarantine untrusted binary content where appropriate.
8. Extract text/metadata with format-aware parsers.
9. Chunk by semantic sections while preserving page/slide/sheet/heading location metadata.
10. Create embeddings using the selected embedding model.
11. Persist source metadata, content version, chunk records and index version.
12. Retrieve subsequent changes with the Drive Changes API and update only affected sources.
13. Periodically reconcile the selection with current permissions and source state.

Push/watch notifications indicate that a change may exist; they must be followed by fetching actual change records. Notifications are not the source of truth.

## 5. Supported file types

Initial support should be explicitly listed and tested: PDF, DOCX, TXT, Markdown, CSV, JSON, HTML, Google Docs, Google Sheets and Google Slides. Add presentations and images through format-specific extraction where feasible. Unsupported, encrypted, malformed or oversized files must produce a per-file processing error rather than being silently skipped.

## 6. Data model outline

- `connected_accounts`: owner, provider, account label, encrypted token reference, scopes, status, timestamps.
- `knowledge_sources`: owner, provider, external ID, MIME type, selected state, source metadata, current revision, permissions.
- `source_versions`: source ID, remote revision/modified time, content digest, parser version, processing state.
- `knowledge_chunks`: source version, text, source location, chunk index, embedding model/version, embedding vector.
- `sync_cursors`: account/source scope, Drive page token, last successful sync, last reconciliation.
- `connector_audit`: connection, consent, selection, sync, revocation, export and deletion events.

All queries must enforce owner-level isolation. Connector secrets must not be returned to the browser.

## 7. Deletion and revocation

- If a file is removed from the user's selected scope or access is revoked, mark it inaccessible immediately.
- Stop serving cached content as current if source access is lost; apply the declared retention policy to copies and embeddings.
- When the owner disconnects Drive, revoke tokens when possible, delete encrypted token material and make the source set inactive.
- Deletion propagation must cover original cached copies (if retained), extracted text, chunks, embeddings and search indexes.
- Keep a minimal audit event that does not retain deleted document content.

## 8. Retrieval and prompt-injection protection

- Drive content is untrusted data, not executable instructions.
- Retrieved passages must not override LORIN's system policy, permissions or owner instructions.
- Use hybrid keyword + vector retrieval, then reranking where appropriate.
- Enforce project and private-vault boundaries before retrieval.
- Return citations with document title, source ID, section/page/sheet/slide location, revision and access status.
- Never send private Drive content to a public LLM unless the owner has enabled that specific data route.

## 9. Failure handling

Handle OAuth expiry, revoked consent, quota limits, rate limiting, deleted files, changed permissions, unsupported MIME, export failure, parser failure, indexing worker failure and interrupted sync. Use bounded retries with backoff; do not advance the sync cursor until the associated page has been durably processed. Show per-file errors and preserve the last known good index while clearly marking it stale.

## 10. Release gates

- OAuth callback and CSRF/state tests.
- Token encryption and redaction tests.
- Scope-minimization tests.
- Picker-selection tests.
- Binary download and Workspace export tests.
- Initial and incremental sync tests.
- Rename, move, edit, delete and permission-revocation tests.
- Reconciliation after missed notifications.
- Multi-user and cross-project isolation tests.
- Retrieval citations and prompt-injection tests.
- Disconnect, revocation and complete deletion propagation tests.
