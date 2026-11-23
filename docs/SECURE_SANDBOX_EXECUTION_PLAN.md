# LORIN — Secure Sandbox Execution Plan

## 1. Objective

Give LORIN an actual bounded environment to inspect approved source, modify working copies, run tests and produce reviewable artifacts without unrestricted access to the owner machine or production services.

## 2. Execution lifecycle

`requested → planned → policy_checked → awaiting_approval → provisioned → running → verifying → review_ready → approved_for_delivery`

Terminal states: `denied`, `blocked`, `failed`, `cancelled`, `expired`, `discarded`.

A job can be marked complete only when the worker exit state, logs, tests and artifacts have been collected. Applying changes to an original project or deploying to production is a separate authorization boundary.

## 3. Architecture

- LORIN Planner: turns user intent into a task plan and declared inputs/outputs.
- Owen Coordinator: schedules bounded job steps.
- Lena Guardian: policy decision, data access and approval enforcement.
- Sandbox Job Manager: provisions and terminates disposable worker environments.
- Worker: rootless container for lower-risk controlled tasks; microVM for higher-risk untrusted code.
- Artifact Service: stores output files, logs, diffs, manifests and test evidence.
- Review UI: diff, test summary and explicit accept/reject/discard actions.
- Audit Service: append-only record of request, policy, approval, execution, evidence and delivery.

## 4. Environment classes

### Code environment

- Approved project snapshot or Git branch.
- Language runtimes and pinned dependencies.
- Terminal, lint, typecheck, tests, build and preview process.
- No host mounts except a scoped, read-only input and a scoped temporary output directory.

### Data environment

- Validated file inputs.
- Sandboxed parsing and processing tools.
- Export-only output path.
- No access to unrelated private folders or credentials.

### Browser environment

- Separate browser profile/container.
- No inherited owner cookies, password store or existing sessions.
- Explicit network policy and download quarantine.

### App-preview environment

- Job-scoped process, port and preview origin.
- No public exposure unless explicitly provisioned.
- Automatic termination and artifact collection after expiry.

## 5. Isolation controls

- Rootless container runtime for suitable jobs; dedicated microVM workers for stronger isolation.
- Seccomp, AppArmor or equivalent mandatory-access controls.
- Read-only root filesystem where feasible.
- Ephemeral workspace with explicit input/output mounts.
- CPU, RAM, disk, process-count, network and wall-clock limits.
- Default-deny outbound network; per-job allowlist only.
- Never mount the Docker socket or host credential directories into a worker.
- No unrestricted host filesystem or device access.
- No production secrets in environment variables visible to the job process.
- Kill and cleanup on timeout, policy violation or worker loss.

## 6. Data and secret brokerage

- Job receives short-lived, scoped capability grants, not raw long-lived credentials.
- All source files are copied or mounted into a read-only input boundary unless a specific write scope is approved.
- Private-vault files remain local/private and require explicit task-level inclusion.
- Retrieved documents and code are untrusted input and cannot alter agent policy.
- Network requests and tool calls are logged with target, purpose and policy result.

## 7. Review and delivery

- Record original commit or source digest before modification.
- Generate a structured file diff and artifact manifest.
- Run relevant lint, typecheck, unit, integration and build checks.
- Identify tests not run and reasons.
- Scan dependencies and generated artifacts according to project policy.
- Present a review bundle before applying output to original files.
- Apply through a clean Git commit/branch or atomic file replacement only after authorization.
- Keep rollback information and preserve the original workspace.

## 8. UI layout

### Overview

Runtime health, queued jobs, active jobs, failed jobs, recent artifacts, CPU/RAM usage and policy warnings.

### Environments

Code, Data, Browser and Application Preview. Each shows isolation profile, image/runtime version, resource limits and status.

### Job detail

Task plan, policy decision, input scope, owner approval ID, worker ID, execution events, logs, changed files, test results, artifact list and termination reason.

### Review

Diff viewer, test matrix, security findings, artifact preview, accept/reject/revise/discard controls. Publishing or deployment is a separate explicit action.

## 9. Release gates

- Escape/isolation tests.
- Filesystem boundary and path traversal tests.
- Secret non-disclosure tests.
- Network egress allowlist tests.
- Resource exhaustion and timeout tests.
- Worker crash/cleanup tests.
- Malicious dependency and prompt-injection tests.
- Artifact integrity and provenance tests.
- Approval replay and fingerprint mismatch tests.
- Rollback and safe-delivery tests.
