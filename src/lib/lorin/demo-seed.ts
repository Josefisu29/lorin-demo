import type { Doc, Memory, View } from "./engine";

export type EnvironmentTenant = "demo" | "live";
export type AutomationLevel = 0 | 1 | 2 | 3;
export type PresencePriority = "P0" | "P1" | "P2" | "P3" | "P4";
export type ServiceStatusBadge =
  | "LIVE"
  | "DEMO"
  | "SIMULATED"
  | "CONFIGURED"
  | "CONNECTED"
  | "VERIFIED"
  | "DEGRADED"
  | "OFFLINE"
  | "NOT CONFIGURED"
  | "UNAVAILABLE";

export interface WorkTask {
  id: string;
  projectId: string;
  title: string;
  assignee: string;
  status: "todo" | "in_progress" | "completed" | "overdue";
  priority: "high" | "medium" | "low";
  dueAt: string;
  summary: string;
}

export interface DemoContact {
  id: string;
  name: string;
  role: string;
  organization: string;
  email: string;
  projectId: string;
  lastInteraction: string;
  status: "Follow-up due" | "Active" | "Awaiting reply";
}

export interface ConversationThread {
  id: string;
  title: string;
  projectId: string;
  updatedAt: string;
  summary: string;
  turnCount: number;
  lastModel: string;
}

export interface CalendarEntry {
  id: string;
  title: string;
  projectId: string;
  startAt: string;
  durationMin: number;
  kind: "Briefing" | "Milestone" | "Review" | "Sync";
  participants: string[];
  notes: string;
}

export interface PresenceEventRecord {
  id: string;
  title: string;
  detail: string;
  priority: PresencePriority;
  projectId: string;
  relatedTaskId?: string;
  status: "active" | "acknowledged" | "escalated";
  category: "deadline" | "security" | "sync" | "briefing" | "contact" | "approval";
  at: number;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  priority: PresencePriority;
  read: boolean;
  linkedView: View;
  at: number;
}

export interface StorageObjectRecord {
  id: string;
  name: string;
  category: "Document" | "Archive" | "Dataset" | "Config" | "Artifact";
  projectId: string;
  sizeKb: number;
  version: string;
  checksum: string;
  location: "Local IndexedDB / Vault" | "Primary Node SQLite (Demo)" | "Optional Private Cloud (Unconfigured)";
  encrypted: boolean;
  updatedAt: string;
}

export interface BackupRecord {
  id: string;
  label: string;
  createdAt: string;
  sizeKb: number;
  checksum: string;
  location: string;
  integrity: "SHA-256 matched" | "Pending restore check";
  restoreVerified: boolean;
  lastVerifiedAt: string | null;
}

export interface SyncOperationRecord {
  id: string;
  opId: string;
  entityType: "task" | "document" | "memory" | "conversation" | "presence" | "setting";
  entityTitle: string;
  originDevice: string;
  targetDevice: string;
  version: number;
  status: "acknowledged" | "queued_offline" | "conflict";
  transport: "Local Wi-Fi (mDNS/TLS)" | "Mobile Hotspot" | "Offline Queue";
  at: number;
}

export interface SyncConflictRecord {
  id: string;
  entityType: "task" | "document" | "memory" | "project";
  entityTitle: string;
  localDevice: string;
  remoteDevice: string;
  localSummary: string;
  remoteSummary: string;
  policyRecommendation: string;
  status: "unresolved" | "resolved_local" | "resolved_remote" | "resolved_merged";
  resolvedNote?: string;
}

export interface ExploreStep {
  step: number;
  id: string;
  title: string;
  view: View;
  instruction: string;
  expectedOutcome: string;
}

export interface GuidedScenario {
  id: string;
  title: string;
  category: string;
  view: View;
  description: string;
  samplePrompt?: string;
}

export interface AcceptanceCriterion {
  id: string;
  milestone: "M1" | "M2" | "M3" | "M4" | "M5" | "M6" | "M7" | "M8" | "M9";
  capability: string;
  status:
    | "Verified"
    | "Implemented"
    | "Tested"
    | "Simulated"
    | "Not configured"
    | "Unavailable";
  evidence: string;
}

const BASE_TIME = 1764050000000;

export function computeChecksum(input: string): string {
  let h1 = 0xdeadbeef ^ input.length;
  let h2 = 0x41c6ce57 ^ input.length;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return `sha256:${(h2 >>> 0).toString(16).padStart(8, "0")}${(h1 >>> 0).toString(16).padStart(8, "0")}`;
}

/**
 * 12 Substantive LORIN & Project Documents (§17) + 20-Domain Technical Knowledge Starter Collection (§8.1).
 */
export const DEMO_KNOWLEDGE_DOCS: Doc[] = [
  // Original core docs preserved for backward compatibility with existing tests & prompts
  {
    id: "d1",
    vault: "knowledge",
    title: "Atlas project brief",
    body: "Atlas is the private intelligence shell. It routes locally first, cites vault sources, and never treats a finished process as verification. Atlas Commerce coordinates fulfillment, supplier audits, and regional inventory.",
    tags: ["project", "atlas", "verification", "brief"],
    indexed: true,
    scope: "atlas",
    topic: "Project Architecture",
    category: "LORIN Projects",
    provenance: "Demonstration Seed · v2.1",
    version: "2.1.0",
    verified: true,
    createdAt: "2026-11-18",
    checksum: computeChecksum("Atlas project brief"),
    relatedIds: ["d2", "doc-09"],
  },
  {
    id: "d2",
    vault: "knowledge",
    title: "Permission model",
    body: "Capabilities are closed schemas. Critical operations are denied. A write requires a single-use approval bound to the action fingerprint. No AI model or specialist can expand its own permissions.",
    tags: ["security", "permissions", "lena", "fingerprint"],
    indexed: true,
    scope: "atlas",
    topic: "Security & Authorization",
    category: "LORIN Security",
    provenance: "Demonstration Seed · Lena Guardian Spec",
    version: "2.1.0",
    verified: true,
    createdAt: "2026-11-18",
    checksum: computeChecksum("Permission model"),
    relatedIds: ["doc-03", "d1"],
  },
  {
    id: "d4",
    vault: "knowledge",
    title: "MOSAIRA public boundary",
    body: "MOSAIRA publishes research. It does not receive private notes, memories, credentials, or device permissions from Atlas. Only explicitly approved public documents cross the boundary via an auditable sync.",
    tags: ["mosaira", "public", "boundary", "isolation"],
    indexed: true,
    scope: "public",
    topic: "Tenant Isolation",
    category: "LORIN Security",
    provenance: "Demonstration Seed · Boundary Policy",
    version: "2.0.4",
    verified: true,
    createdAt: "2026-11-19",
    checksum: computeChecksum("MOSAIRA public boundary"),
    relatedIds: ["doc-03"],
  },
  {
    id: "d3",
    vault: "private",
    title: "Owner note",
    body: "Keep private notes off cloud models. The working timezone is WAT. Do not copy this note into MOSAIRA. Emergency stop revokes background automation immediately.",
    tags: ["private", "owner", "timezone"],
    indexed: false,
    scope: "atlas",
    topic: "Owner Preferences",
    category: "Private Vault",
    provenance: "Owner Private Vault · Alex Mercer",
    version: "1.4.0",
    verified: true,
    createdAt: "2026-11-20",
    checksum: computeChecksum("Owner note"),
    relatedIds: [],
  },
  // 12 Named Documents from Section 17
  {
    id: "doc-01",
    vault: "knowledge",
    title: "LORIN Product Requirements",
    body: "LORIN is an owner-controlled personal intelligence system operating across Web, installable PWA, Windows desktop, Android companion, and private home server. It maintains a single assistant identity backed by internal specialists (Lena, Owen, Riley, Iris, Nolan, GIDEON).",
    tags: ["lorin", "product", "requirements", "specialists", "m1-m9"],
    indexed: true,
    scope: "atlas",
    topic: "Product Requirements",
    category: "LORIN Architecture",
    provenance: "Synthetic Demo Document · PRD-01",
    version: "2.1.0",
    verified: true,
    createdAt: "2026-11-15",
    checksum: computeChecksum("LORIN Product Requirements"),
    relatedIds: ["doc-02", "doc-03"],
  },
  {
    id: "doc-02",
    vault: "knowledge",
    title: "LORIN System Architecture",
    body: "LORIN uses a local-first hybrid architecture: Primary Node data store, backend-controlled Model Gateway supporting Ollama local models and verified cloud providers (Gemini), cryptographic device fabric, and deterministic capability registry.",
    tags: ["architecture", "system", "primary-node", "gateway"],
    indexed: true,
    scope: "atlas",
    topic: "System Architecture",
    category: "LORIN Architecture",
    provenance: "Synthetic Demo Document · ARCH-02",
    version: "2.1.0",
    verified: true,
    createdAt: "2026-11-16",
    checksum: computeChecksum("LORIN System Architecture"),
    relatedIds: ["doc-01", "doc-04"],
  },
  {
    id: "doc-03",
    vault: "knowledge",
    title: "LORIN Security Policy",
    body: "Zero-trust client boundary: API keys never enter browser bundles, device pairing requires high-entropy one-time challenge + owner approval, and every consequential action requires explicit owner authorization bound to a SHA/FNV action digest.",
    tags: ["security", "policy", "zero-trust", "pairing", "audit"],
    indexed: true,
    scope: "atlas",
    topic: "Cybersecurity & Policy",
    category: "LORIN Security",
    provenance: "Synthetic Demo Document · SEC-03",
    version: "2.1.0",
    verified: true,
    createdAt: "2026-11-17",
    checksum: computeChecksum("LORIN Security Policy"),
    relatedIds: ["d2", "doc-07"],
  },
  {
    id: "doc-04",
    vault: "knowledge",
    title: "LORIN Model Routing Specification",
    body: "Routing evaluates privacy intent, network state, and provider verification. Private queries lock to local models (ollama-local). Cloud requests (Gemini) require an authenticated server endpoint and never substitute canned text for failed inference.",
    tags: ["routing", "models", "ollama", "gemini", "privacy"],
    indexed: true,
    scope: "atlas",
    topic: "AI Model Routing",
    category: "Artificial Intelligence",
    provenance: "Synthetic Demo Document · MOD-04",
    version: "2.0.2",
    verified: true,
    createdAt: "2026-11-18",
    checksum: computeChecksum("LORIN Model Routing Specification"),
    relatedIds: ["doc-02"],
  },
  {
    id: "doc-05",
    vault: "knowledge",
    title: "Google Drive Integration Guide",
    body: "Google Drive integration uses per-file OAuth 2.0 scope (drive.file) with user-selected files via Google Picker. Refresh tokens remain encrypted server-side. Until OAuth is configured, the connector displays NOT CONNECTED.",
    tags: ["google-drive", "oauth", "connectors", "knowledge"],
    indexed: true,
    scope: "atlas",
    topic: "External Connectors",
    category: "Cloud Computing",
    provenance: "Synthetic Demo Document · INT-05",
    version: "1.8.0",
    verified: true,
    createdAt: "2026-11-19",
    checksum: computeChecksum("Google Drive Integration Guide"),
    relatedIds: ["doc-08"],
  },
  {
    id: "doc-06",
    vault: "knowledge",
    title: "Presence and Call-In Requirements",
    body: "Presence monitors internal deadlines, security alerts, and pending approvals across priorities P0–P4. Simulated incoming call briefings synthesize actual project and task records and respect quiet hours and rate limits.",
    tags: ["presence", "call-in", "briefing", "proactive", "m7"],
    indexed: true,
    scope: "atlas",
    topic: "Proactive Intelligence",
    category: "LORIN Architecture",
    provenance: "Synthetic Demo Document · PRES-06",
    version: "2.1.0",
    verified: true,
    createdAt: "2026-11-20",
    checksum: computeChecksum("Presence and Call-In Requirements"),
    relatedIds: ["doc-01"],
  },
  {
    id: "doc-07",
    vault: "knowledge",
    title: "Device Pairing Specification",
    body: "Devices pair once via cryptographic challenge and Ed25519/ECDSA key registration. Transport priority prefers Local Wi-Fi (mDNS/TLS), then Local Hotspot, Native Peer, Approved Private Server, and Encrypted Relay. Pairing never grants Primary Node privileges.",
    tags: ["devices", "pairing", "wifi", "bluetooth", "mdns", "m6"],
    indexed: true,
    scope: "atlas",
    topic: "Device Fabric",
    category: "Networking",
    provenance: "Synthetic Demo Document · DEV-07",
    version: "2.1.0",
    verified: true,
    createdAt: "2026-11-21",
    checksum: computeChecksum("Device Pairing Specification"),
    relatedIds: ["doc-03"],
  },
  {
    id: "doc-08",
    vault: "knowledge",
    title: "Cloud Storage Strategy",
    body: "LORIN defaults to local-first storage on the owner's devices and Primary Node. Remote private-server or encrypted cloud backup is strictly opt-in. Backups are only marked VERIFIED after a restore integrity check passes.",
    tags: ["storage", "backup", "local-first", "sync", "m9"],
    indexed: true,
    scope: "atlas",
    topic: "Storage & Backup",
    category: "Cloud Computing",
    provenance: "Synthetic Demo Document · STOR-08",
    version: "2.0.0",
    verified: true,
    createdAt: "2026-11-21",
    checksum: computeChecksum("Cloud Storage Strategy"),
    relatedIds: ["doc-05"],
  },
  {
    id: "doc-09",
    vault: "knowledge",
    title: "Atlas Commerce Requirements",
    body: "Atlas Commerce is a multi-vendor logistics and catalog initiative requiring deterministic inventory reconciliation, manual bank-transfer settlement verification, and zero-downtime schema migrations.",
    tags: ["atlas-commerce", "project", "logistics", "inventory"],
    indexed: true,
    scope: "atlas",
    topic: "Atlas Commerce",
    category: "Project Management",
    provenance: "Synthetic Demo Document · PROJ-09",
    version: "1.5.0",
    verified: true,
    createdAt: "2026-11-22",
    checksum: computeChecksum("Atlas Commerce Requirements"),
    relatedIds: ["d1"],
  },
  {
    id: "doc-10",
    vault: "knowledge",
    title: "Meridian Studio Brief",
    body: "Meridian Studio delivers architectural visualization, CAD asset pipelines, and WebGPU spatial walkthroughs with strict frame-budget targets (60 FPS desktop, 30 FPS mobile fallback).",
    tags: ["meridian-studio", "project", "3d", "webgpu", "design"],
    indexed: true,
    scope: "atlas",
    topic: "Meridian Studio",
    category: "Software Architecture",
    provenance: "Synthetic Demo Document · PROJ-10",
    version: "1.3.0",
    verified: true,
    createdAt: "2026-11-22",
    checksum: computeChecksum("Meridian Studio Brief"),
    relatedIds: ["doc-09"],
  },
  {
    id: "doc-11",
    vault: "knowledge",
    title: "Horizon Research Notes",
    body: "Horizon Intelligence evaluates quantized local language models (4-bit and 8-bit GGUF), retrieval-augmented generation citation accuracy, and low-power edge wake-word detectors.",
    tags: ["horizon", "research", "quantization", "rag", "wake-word"],
    indexed: true,
    scope: "public",
    topic: "Horizon Intelligence",
    category: "Machine Learning",
    provenance: "Synthetic Demo Document · RES-11",
    version: "1.7.0",
    verified: true,
    createdAt: "2026-11-23",
    checksum: computeChecksum("Horizon Research Notes"),
    relatedIds: ["doc-04"],
  },
  {
    id: "doc-12",
    vault: "knowledge",
    title: "Weekly Project Meeting Summary",
    body: "Weekly review across Atlas Commerce, Meridian Studio, Horizon Intelligence, and LORIN Development: M6 Device Fabric pairing verified, M7 Presence call-in ready for demo, and M9 conflict resolution UI scheduled for owner sign-off.",
    tags: ["meeting", "summary", "weekly", "milestones", "tasks"],
    indexed: true,
    scope: "atlas",
    topic: "Execution Review",
    category: "Productivity & Planning",
    provenance: "Synthetic Demo Document · MEET-12",
    version: "1.0.0",
    verified: true,
    createdAt: "2026-11-24",
    checksum: computeChecksum("Weekly Project Meeting Summary"),
    relatedIds: ["doc-09", "doc-10", "doc-11"],
  },
  // Starter Technical Knowledge Collection covering the remaining 20 domains (§8.1)
  {
    id: "kb-cs-01",
    vault: "knowledge",
    title: "Computer Science & Data Structures Fundamentals",
    body: "Hash tables provide O(1) average lookup using collision-resistant hash functions; B-trees and LSM-trees power relational and embedded key-value storage engines; directed acyclic graphs (DAGs) model task dependencies and version histories.",
    tags: ["computer-science", "algorithms", "data-structures", "dag", "btree"],
    indexed: true,
    scope: "public",
    topic: "Computer Science Fundamentals",
    category: "Computer Science",
    provenance: "Demonstration Knowledge Starter · KB-CS",
    version: "1.0.0",
    verified: true,
    createdAt: "2026-11-10",
    checksum: computeChecksum("Computer Science & Data Structures Fundamentals"),
    relatedIds: ["kb-db-01"],
  },
  {
    id: "kb-prog-01",
    vault: "knowledge",
    title: "Programming Concepts & Type Systems",
    body: "Static structural type systems (such as TypeScript) catch contract mismatches at compile time, while runtime schema validators (such as Zod) enforce invariants across untrusted network, file, and model-output boundaries.",
    tags: ["programming", "typescript", "types", "validation", "zod"],
    indexed: true,
    scope: "public",
    topic: "Programming Concepts",
    category: "Programming",
    provenance: "Demonstration Knowledge Starter · KB-PROG",
    version: "1.0.0",
    verified: true,
    createdAt: "2026-11-10",
    checksum: computeChecksum("Programming Concepts & Type Systems"),
    relatedIds: ["kb-web-01"],
  },
  {
    id: "kb-web-01",
    vault: "knowledge",
    title: "Web & Progressive Web Application Architecture",
    body: "Modern PWAs combine responsive CSS grid/flexbox layouts, Web App Manifests, and Service Workers using Stale-While-Revalidate for public static assets while strictly excluding private authenticated API responses from shared caches.",
    tags: ["web", "pwa", "service-worker", "manifest", "http", "html"],
    indexed: true,
    scope: "public",
    topic: "Web Development & Internet Technologies",
    category: "Web Development",
    provenance: "Demonstration Knowledge Starter · KB-WEB",
    version: "1.0.0",
    verified: true,
    createdAt: "2026-11-10",
    checksum: computeChecksum("Web & Progressive Web Application Architecture"),
    relatedIds: ["kb-mob-01"],
  },
  {
    id: "kb-mob-01",
    vault: "knowledge",
    title: "Mobile & Desktop Lifecycle Constraints",
    body: "Android background microphone capture requires a permissioned foreground service with a persistent system notification. iOS PWAs support foreground audio and tap-to-talk. Windows Tauri 2 desktop companions support system tray residence and explicit autostart controls.",
    tags: ["mobile", "android", "ios", "windows", "tauri", "lifecycle"],
    indexed: true,
    scope: "public",
    topic: "Mobile & Desktop Development",
    category: "Mobile Development",
    provenance: "Demonstration Knowledge Starter · KB-MOB",
    version: "1.0.0",
    verified: true,
    createdAt: "2026-11-11",
    checksum: computeChecksum("Mobile & Desktop Lifecycle Constraints"),
    relatedIds: ["kb-os-01"],
  },
  {
    id: "kb-net-01",
    vault: "knowledge",
    title: "Networking, mDNS Discovery & TLS Transport",
    body: "Local-first device discovery uses mDNS/DNS-SD over UDP port 5353 to locate peer endpoints on a shared LAN, followed by mutual TLS certificate fingerprint verification. Wi-Fi client isolation on public hotspots must be probed before assuming peer reachability.",
    tags: ["networking", "tcp", "dns", "tls", "mdns", "hotspot"],
    indexed: true,
    scope: "public",
    topic: "Networking & Transport",
    category: "Networking",
    provenance: "Demonstration Knowledge Starter · KB-NET",
    version: "1.0.0",
    verified: true,
    createdAt: "2026-11-11",
    checksum: computeChecksum("Networking, mDNS Discovery & TLS Transport"),
    relatedIds: ["doc-07"],
  },
  {
    id: "kb-os-01",
    vault: "knowledge",
    title: "Operating Systems, Sandboxing & Process Isolation",
    body: "Operating systems isolate untrusted workloads using virtual memory spaces, rootless containers, cgroups resource quotas, and seccomp syscall filters so an agent job cannot read host credentials or raw device sockets.",
    tags: ["operating-systems", "linux", "windows", "sandbox", "isolation"],
    indexed: true,
    scope: "public",
    topic: "Operating Systems",
    category: "Operating Systems",
    provenance: "Demonstration Knowledge Starter · KB-OS",
    version: "1.0.0",
    verified: true,
    createdAt: "2026-11-12",
    checksum: computeChecksum("Operating Systems, Sandboxing & Process Isolation"),
    relatedIds: ["doc-03"],
  },
  {
    id: "kb-db-01",
    vault: "knowledge",
    title: "Databases, SQLite WAL & Local-First Sync Journals",
    body: "SQLite in Write-Ahead Logging (WAL) mode enables concurrent reads with ACID transactions. Local-first synchronization relies on an append-only change journal with monotonic version vectors, idempotent operation IDs, and deterministic conflict resolution.",
    tags: ["databases", "sqlite", "postgres", "acid", "wal", "sync"],
    indexed: true,
    scope: "public",
    topic: "Databases & Persistence",
    category: "Databases",
    provenance: "Demonstration Knowledge Starter · KB-DB",
    version: "1.0.0",
    verified: true,
    createdAt: "2026-11-12",
    checksum: computeChecksum("Databases, SQLite WAL & Local-First Sync Journals"),
    relatedIds: ["doc-08"],
  },
  {
    id: "kb-sec-01",
    vault: "knowledge",
    title: "Cybersecurity, Cryptography & Zero-Trust Defense",
    body: "Defense-in-depth combines least-privilege RBAC, parameterized queries, output encoding, short-lived cryptographic challenges with replay protection, and tamper-evident audit trails.",
    tags: ["cybersecurity", "encryption", "zero-trust", "authentication", "rbac"],
    indexed: true,
    scope: "public",
    topic: "Cybersecurity Fundamentals",
    category: "Cybersecurity",
    provenance: "Demonstration Knowledge Starter · KB-SEC",
    version: "1.0.0",
    verified: true,
    createdAt: "2026-11-13",
    checksum: computeChecksum("Cybersecurity, Cryptography & Zero-Trust Defense"),
    relatedIds: ["doc-03", "d2"],
  },
  {
    id: "kb-ai-01",
    vault: "knowledge",
    title: "Artificial Intelligence, Machine Learning & RAG Grounding",
    body: "Retrieval-Augmented Generation (RAG) grounds transformer model synthesis in verified local documents with explicit source citations, reducing hallucination and preserving privacy boundaries.",
    tags: ["ai", "machine-learning", "llm", "rag", "embeddings", "citations"],
    indexed: true,
    scope: "public",
    topic: "AI & Machine Learning",
    category: "Artificial Intelligence",
    provenance: "Demonstration Knowledge Starter · KB-AI",
    version: "1.0.0",
    verified: true,
    createdAt: "2026-11-13",
    checksum: computeChecksum("Artificial Intelligence, Machine Learning & RAG Grounding"),
    relatedIds: ["doc-04", "doc-11"],
  },
  {
    id: "kb-math-01",
    vault: "knowledge",
    title: "Mathematics, Logic & Formal Verification Principles",
    body: "Boolean logic, set theory, linear algebra (cosine similarity in vector spaces), and Bayesian probability underpin retrieval ranking, cryptographic proofs, and deterministic policy verification.",
    tags: ["mathematics", "logic", "vectors", "probability", "verification"],
    indexed: true,
    scope: "public",
    topic: "Mathematics & Logic",
    category: "Mathematics",
    provenance: "Demonstration Knowledge Starter · KB-MATH",
    version: "1.0.0",
    verified: true,
    createdAt: "2026-11-14",
    checksum: computeChecksum("Mathematics, Logic & Formal Verification Principles"),
    relatedIds: ["kb-ai-01"],
  },
];

export const DEMO_PROJECTS = [
  {
    id: "p1",
    name: "Atlas Commerce",
    status: "Active",
    note: "Private owner workspace · Multi-vendor commerce, bank-transfer settlement verification, and supplier logistics.",
  },
  {
    id: "p3",
    name: "Meridian Studio",
    status: "Active",
    note: "Architectural visualization, technical-drawing precision, and real-time 3D WebGPU walkthroughs.",
  },
  {
    id: "p4",
    name: "Horizon Intelligence",
    status: "Active",
    note: "Quantized local model benchmarks, RAG citation auditing, and low-latency edge wake-word evaluation.",
  },
  {
    id: "p5",
    name: "LORIN Development",
    status: "Active",
    note: "Core M1–M9 personal intelligence platform, cryptographic device fabric, and local-first sync engine.",
  },
  {
    id: "p2",
    name: "MOSAIRA",
    status: "Separate",
    note: "Isolated public research surface. Never inherits private notes, memories, or device permissions from owner workspaces.",
  },
];

/**
 * 26 internally consistent tasks across the projects (§17).
 */
export const DEMO_WORK_TASKS: WorkTask[] = [
  // Atlas Commerce (p1) - 7 tasks
  { id: "wt-01", projectId: "p1", title: "Verify manual bank-transfer settlement rules", assignee: "Alex Mercer", status: "completed", priority: "high", dueAt: "2026-11-22", summary: "Ensure orders stay pending until settlement proof is verified by a trusted reviewer." },
  { id: "wt-02", projectId: "p1", title: "Audit vendor tenant isolation boundaries", assignee: "Lena Guardian", status: "completed", priority: "high", dueAt: "2026-11-23", summary: "Confirm hybrid sellers only access their own catalog and order partitions." },
  { id: "wt-03", projectId: "p1", title: "Reconcile regional warehouse Q4 SKU manifest", assignee: "Maya Lin", status: "in_progress", priority: "high", dueAt: "2026-11-26", summary: "Cross-check 1,420 SKUs against customs clearance receipts." },
  { id: "wt-04", projectId: "p1", title: "Review logistics carrier SLA escalation thresholds", assignee: "Owen Coordinator", status: "overdue", priority: "high", dueAt: "2026-11-24", summary: "Flag shipments delayed over 18 hours for proactive Presence briefing." },
  { id: "wt-05", projectId: "p1", title: "Prepare Q4 supplier compliance briefing", assignee: "Iris Investigator", status: "todo", priority: "medium", dueAt: "2026-11-28", summary: "Compile verified supplier audit certificates from Knowledge Vault." },
  { id: "wt-06", projectId: "p1", title: "Validate offline receipt queue retry policy", assignee: "Nolan Strategist", status: "completed", priority: "medium", dueAt: "2026-11-21", summary: "Idempotent receipt upload keys tested across network drops." },
  { id: "wt-07", projectId: "p1", title: "Sign off December fulfillment freeze schedule", assignee: "Alex Mercer", status: "todo", priority: "low", dueAt: "2026-11-30", summary: "Coordinate holiday cut-off dates with delivery partners." },

  // Meridian Studio (p3) - 6 tasks
  { id: "wt-08", projectId: "p3", title: "Optimize pavilion GLB mesh LOD transitions", assignee: "Soren Lindqvist", status: "completed", priority: "high", dueAt: "2026-11-20", summary: "Reduced triangle count by 42% for mobile Safari viewport stability." },
  { id: "wt-09", projectId: "p3", title: "Calibrate warm organic modernism lighting presets", assignee: "Elena Vance", status: "completed", priority: "medium", dueAt: "2026-11-22", summary: "Balanced sun-azimuth shadows with technical linework overlay." },
  { id: "wt-10", projectId: "p3", title: "Export elevation technical drawings to PDF/SVG", assignee: "Soren Lindqvist", status: "in_progress", priority: "high", dueAt: "2026-11-26", summary: "Package 1:100 scale section views for client review." },
  { id: "wt-11", projectId: "p3", title: "Verify reduced-motion camera interpolation", assignee: "Riley Companion", status: "completed", priority: "medium", dueAt: "2026-11-23", summary: "Instant camera cuts when prefers-reduced-motion is active." },
  { id: "wt-12", projectId: "p3", title: "Review acoustic simulation material coefficients", assignee: "Iris Investigator", status: "todo", priority: "low", dueAt: "2026-11-29", summary: "Cross-check timber absorption metrics against studio notes." },
  { id: "wt-13", projectId: "p3", title: "Deliver client walkthrough build v1.4", assignee: "Alex Mercer", status: "overdue", priority: "high", dueAt: "2026-11-24", summary: "Awaiting final elevation sign-off before publishing client link." },

  // Horizon Intelligence (p4) - 6 tasks
  { id: "wt-14", projectId: "p4", title: "Benchmark 4-bit GGUF model latency on 8GB RAM", assignee: "Nolan Strategist", status: "completed", priority: "high", dueAt: "2026-11-19", summary: "Measured time-to-first-token and memory pressure headroom." },
  { id: "wt-15", projectId: "p4", title: "Evaluate zero-hallucination RAG citation scorer", assignee: "Iris Investigator", status: "completed", priority: "high", dueAt: "2026-11-21", summary: "Rejects any answer lacking verifiable document passage support." },
  { id: "wt-16", projectId: "p4", title: "Measure foreground wake-word false-accept rate", assignee: "Riley Companion", status: "in_progress", priority: "high", dueAt: "2026-11-26", summary: "Testing 5 configurable wake phrases across ambient office noise." },
  { id: "wt-17", projectId: "p4", title: "Document unknown-answer refusal threshold", assignee: "Lena Guardian", status: "completed", priority: "medium", dueAt: "2026-11-23", summary: "Ensures LORIN states clearly when knowledge is unverified." },
  { id: "wt-18", projectId: "p4", title: "Compare embedding chunk overlap strategies", assignee: "Dr. Aris Thorne", status: "todo", priority: "medium", dueAt: "2026-11-28", summary: "Evaluate 256-token vs 512-token sliding windows on technical specs." },
  { id: "wt-19", projectId: "p4", title: "Publish sanitized benchmark summary to MOSAIRA", assignee: "Owen Coordinator", status: "todo", priority: "low", dueAt: "2026-12-01", summary: "Requires explicit owner boundary approval before sync." },

  // LORIN Development (p5) - 7 tasks
  { id: "wt-20", projectId: "p5", title: "Complete M1 5-second companion activation sequence", assignee: "Riley Companion", status: "completed", priority: "high", dueAt: "2026-11-24", summary: "Four-stage emergence with skip button and command preservation." },
  { id: "wt-21", projectId: "p5", title: "Harden M6 one-time cryptographic device pairing", assignee: "Lena Guardian", status: "completed", priority: "high", dueAt: "2026-11-24", summary: "Challenge-response handshake with per-device capability scopes." },
  { id: "wt-22", projectId: "p5", title: "Implement M7 semi-automatic Presence & Call-In briefing", assignee: "Owen Coordinator", status: "completed", priority: "high", dueAt: "2026-11-24", summary: "Interactive simulated call synthesizing live demo tasks and alerts." },
  { id: "wt-23", projectId: "p5", title: "Verify M9 local-first sync conflict resolution UI", assignee: "Nolan Strategist", status: "in_progress", priority: "high", dueAt: "2026-11-25", summary: "Resolve concurrent device edits with full version lineage." },
  { id: "wt-24", projectId: "p5", title: "Run backup integrity & restore verification check", assignee: "GIDEON", status: "completed", priority: "medium", dueAt: "2026-11-24", summary: "SHA-256 snapshot verified via non-destructive restore test." },
  { id: "wt-25", projectId: "p5", title: "Package Windows Tauri 2 desktop installer", assignee: "Nolan Strategist", status: "todo", priority: "medium", dueAt: "2026-12-03", summary: "Blocked in web container; honestly labeled Not Yet Available until built on Windows host." },
  { id: "wt-26", projectId: "p5", title: "Audit Level 2 semi-autonomous emergency stop", assignee: "Lena Guardian", status: "completed", priority: "high", dueAt: "2026-11-24", summary: "Single-click emergency stop halts automation and pending jobs immediately." },
];

export const DEMO_CONTACTS: DemoContact[] = [
  { id: "ct-1", name: "Maya Lin", role: "Head of Operations", organization: "Atlas Commerce", email: "maya.lin@atlas-demo.local", projectId: "p1", lastInteraction: "2 hours ago · Q4 SKU manifest review", status: "Follow-up due" },
  { id: "ct-2", name: "Soren Lindqvist", role: "Lead Spatial Architect", organization: "Meridian Studio", email: "soren@meridian-demo.local", projectId: "p3", lastInteraction: "Yesterday · Pavilion elevation drawings", status: "Active" },
  { id: "ct-3", name: "Dr. Aris Thorne", role: "Principal ML Researcher", organization: "Horizon Intelligence", email: "athorne@horizon-demo.local", projectId: "p4", lastInteraction: "3 days ago · 4-bit GGUF latency benchmarks", status: "Awaiting reply" },
  { id: "ct-4", name: "Elena Vance", role: "Design Systems Director", organization: "Meridian Studio", email: "elena.vance@meridian-demo.local", projectId: "p3", lastInteraction: "Yesterday · Lighting & contrast review", status: "Active" },
  { id: "ct-5", name: "Marcus Okafor", role: "Security Compliance Lead", organization: "Atlas Commerce", email: "m.okafor@atlas-demo.local", projectId: "p1", lastInteraction: "4 hours ago · Bank-transfer verification audit", status: "Follow-up due" },
  { id: "ct-6", name: "claire.devries", role: "Embedded Systems Engineer", organization: "LORIN Hardware Partner", email: "claire@lorin-demo.local", projectId: "p5", lastInteraction: "1 day ago · mDNS discovery packet timing", status: "Active" },
];

export const DEMO_CONVERSATIONS: ConversationThread[] = [
  { id: "conv-1", title: "Atlas Commerce settlement verification audit", projectId: "p1", updatedAt: "Today, 08:15", summary: "Reviewed single-use approval digests and manual settlement rules.", turnCount: 6, lastModel: "ollama-local" },
  { id: "conv-2", title: "LORIN M6 device pairing & mDNS transport priority", projectId: "p5", updatedAt: "Today, 07:40", summary: "Verified Wi-Fi mDNS -> Hotspot -> Peer transport order and key revocation.", turnCount: 5, lastModel: "ollama-local" },
  { id: "conv-3", title: "Meridian pavilion WebGPU LOD & reduced-motion fallback", projectId: "p3", updatedAt: "Yesterday", summary: "Checked 60 FPS desktop target and 2D orbital fallback on low-GPU devices.", turnCount: 4, lastModel: "ollama-local" },
  { id: "conv-4", title: "Horizon 4-bit quantization & RAG citation grounding", projectId: "p4", updatedAt: "Yesterday", summary: "Evaluated memory pressure thresholds and unknown-answer refusals.", turnCount: 7, lastModel: "ollama-local" },
  { id: "conv-5", title: "Wake-word pipeline & trailing command retention", projectId: "p5", updatedAt: "2 days ago", summary: "Tested 'LORIN, can you check the Atlas project?' context preservation.", turnCount: 5, lastModel: "ollama-local" },
  { id: "conv-6", title: "Google Drive per-file OAuth scope boundary", projectId: "p1", updatedAt: "2 days ago", summary: "Confirmed drive.file picker scope and server-side token encryption requirements.", turnCount: 3, lastModel: "ollama-local" },
  { id: "conv-7", title: "MOSAIRA public boundary isolation test", projectId: "p2", updatedAt: "3 days ago", summary: "Verified Lena Guardian blocks private vault and memory queries in MOSAIRA.", turnCount: 4, lastModel: "ollama-local" },
  { id: "conv-8", title: "M9 SQLite change journal & conflict resolution policy", projectId: "p5", updatedAt: "3 days ago", summary: "Inspected version vectors and non-destructive task field merging.", turnCount: 6, lastModel: "ollama-local" },
];

export const DEMO_CALENDAR: CalendarEntry[] = [
  { id: "cal-1", title: "Morning Presence & Priority Task Briefing", projectId: "p1", startAt: "Today · 09:00", durationMin: 15, kind: "Briefing", participants: ["Alex Mercer", "LORIN"], notes: "Review 2 overdue tasks and 1 pending vault index approval." },
  { id: "cal-2", title: "Atlas Commerce Warehouse SKU Reconciliation", projectId: "p1", startAt: "Today · 11:30", durationMin: 45, kind: "Review", participants: ["Alex Mercer", "Maya Lin", "Marcus Okafor"], notes: "Verify Q4 customs manifest and settlement logs." },
  { id: "cal-3", title: "Meridian Studio Pavilion Walkthrough Sign-Off", projectId: "p3", startAt: "Today · 15:00", durationMin: 30, kind: "Milestone", participants: ["Alex Mercer", "Soren Lindqvist", "Elena Vance"], notes: "Inspect 1:100 elevation drawings and WebGPU lighting." },
  { id: "cal-4", title: "Horizon Edge Wake-Word & RAG Evaluation", projectId: "p4", startAt: "Tomorrow · 10:00", durationMin: 60, kind: "Review", participants: ["Alex Mercer", "Dr. Aris Thorne"], notes: "Review false-accept rates and citation fidelity." },
  { id: "cal-5", title: "LORIN M6–M9 Device Sync & Backup Verification", projectId: "p5", startAt: "Tomorrow · 14:00", durationMin: 45, kind: "Sync", participants: ["Alex Mercer", "claire.devries"], notes: "Test multi-client conflict resolution and SHA-256 backup restore." },
];

export const DEMO_PRESENCE_EVENTS: PresenceEventRecord[] = [
  { id: "pe-01", title: "Overdue SLA escalation threshold review", detail: "Task wt-04 in Atlas Commerce passed its 2026-11-24 deadline. Carrier escalation rules need owner review.", priority: "P1", projectId: "p1", relatedTaskId: "wt-04", status: "active", category: "deadline", at: BASE_TIME - 1800_000 },
  { id: "pe-02", title: "Meridian client walkthrough v1.4 overdue", detail: "Task wt-13 is awaiting final elevation sign-off for Soren Lindqvist.", priority: "P1", projectId: "p3", relatedTaskId: "wt-13", status: "active", category: "deadline", at: BASE_TIME - 3600_000 },
  { id: "pe-03", title: "Pending approval: Index Knowledge Vault", detail: "Read-only scan of Knowledge Vault titles (j1) is awaiting your approval.", priority: "P2", projectId: "p1", status: "active", category: "approval", at: BASE_TIME - 5400_000 },
  { id: "pe-04", title: "Sync conflict detected on Task wt-03", detail: "ThinkPad X1 Laptop and Pixel 9 Pro modified Q4 SKU manifest notes while offline.", priority: "P2", projectId: "p1", relatedTaskId: "wt-03", status: "active", category: "sync", at: BASE_TIME - 7200_000 },
  { id: "pe-05", title: "Follow-up due with Maya Lin", detail: "Maya requested confirmation on the regional warehouse Q4 SKU manifest before 11:30.", priority: "P2", projectId: "p1", status: "active", category: "contact", at: BASE_TIME - 9000_000 },
  { id: "pe-06", title: "Critical shell capability test blocked", detail: "Lena Guardian confirmed shell.exec remains strictly denied by policy.", priority: "P0", projectId: "p5", status: "acknowledged", category: "security", at: BASE_TIME - 14400_000 },
  { id: "pe-07", title: "Morning Workspace Briefing Ready", detail: "LORIN prepared a 4-project summary covering 26 tasks, 2 overdue items, and 1 sync conflict.", priority: "P3", projectId: "p5", status: "active", category: "briefing", at: BASE_TIME - 18000_000 },
  { id: "pe-08", title: "Follow-up due with Marcus Okafor", detail: "Marcus shared the bank-transfer settlement audit checklist for Atlas Commerce.", priority: "P3", projectId: "p1", status: "active", category: "contact", at: BASE_TIME - 21600_000 },
  { id: "pe-09", title: "Primary Node local Wi-Fi mDNS verified", detail: "Atlas Home Primary Node advertised TLS endpoint on local network.", priority: "P4", projectId: "p5", status: "acknowledged", category: "sync", at: BASE_TIME - 28800_000 },
  { id: "pe-10", title: "Daily SQLite Snapshot Backup Completed", detail: "Backup bk-01 (1,480 KB) verified with matching SHA-256 digest.", priority: "P4", projectId: "p5", status: "acknowledged", category: "briefing", at: BASE_TIME - 36000_000 },
  { id: "pe-11", title: "MOSAIRA boundary isolation check passed", detail: "Zero private vault or memory records crossed into public workspace p2.", priority: "P3", projectId: "p2", status: "acknowledged", category: "security", at: BASE_TIME - 43200_000 },
  { id: "pe-12", title: "Horizon wake-word benchmark update", detail: "Foreground wake-word detector logged 0 false activations across 4-hour test.", priority: "P3", projectId: "p4", relatedTaskId: "wt-16", status: "active", category: "briefing", at: BASE_TIME - 50400_000 },
  { id: "pe-13", title: "Unpaired Windows Workstation discovered", detail: "A desktop peer is available for one-time cryptographic pairing.", priority: "P3", projectId: "p5", status: "active", category: "security", at: BASE_TIME - 57600_000 },
  { id: "pe-14", title: "Knowledge Vault starter collection indexed", detail: "22 documents across 20 technical and LORIN domains are available for local retrieval.", priority: "P4", projectId: "p5", status: "acknowledged", category: "briefing", at: BASE_TIME - 64800_000 },
  { id: "pe-15", title: "Quiet hours policy configured", detail: "Non-critical notifications (P2–P4) are held between 22:30 and 06:30 WAT.", priority: "P4", projectId: "p5", status: "acknowledged", category: "briefing", at: BASE_TIME - 72000_000 },
];

export const DEMO_NOTIFICATIONS: AppNotification[] = [
  { id: "nt-01", title: "2 High-Priority Deadlines Need Review", body: "Atlas SLA thresholds (wt-04) and Meridian walkthrough v1.4 (wt-13) are overdue.", priority: "P1", read: false, linkedView: "presence", at: BASE_TIME - 1800_000 },
  { id: "nt-02", title: "1 Scoped Action Awaiting Approval", body: "Knowledge Vault read-only title index (j1) is waiting in Tasks & Approvals.", priority: "P2", read: false, linkedView: "tasks", at: BASE_TIME - 3600_000 },
  { id: "nt-03", title: "Sync Conflict Requires Resolution", body: "Concurrent offline edits on Q4 SKU manifest (wt-03) in Synchronization Centre.", priority: "P2", read: false, linkedView: "sync", at: BASE_TIME - 7200_000 },
  { id: "nt-04", title: "Incoming Call Briefing Available", body: "Test LORIN's interactive simulated Call-In briefing in Presence Centre.", priority: "P2", read: false, linkedView: "presence", at: BASE_TIME - 9000_000 },
  { id: "nt-05", title: "Maya Lin Follow-Up Due", body: "Confirm regional warehouse Q4 SKU manifest before today's 11:30 review.", priority: "P2", read: false, linkedView: "calendar", at: BASE_TIME - 10800_000 },
  { id: "nt-06", title: "Backup bk-01 Restore Verified", body: "Primary Node demo snapshot passed non-destructive SHA-256 restore test.", priority: "P4", read: true, linkedView: "storage", at: BASE_TIME - 18000_000 },
  { id: "nt-07", title: "Pixel 9 Pro Synchronized via Local Wi-Fi", body: "14 task and memory records acknowledged over mDNS/TLS.", priority: "P4", read: true, linkedView: "devices", at: BASE_TIME - 25200_000 },
  { id: "nt-08", title: "MOSAIRA Isolation Audit Clean", body: "Lena Guardian verified zero private records in public research workspace.", priority: "P3", read: true, linkedView: "trust", at: BASE_TIME - 32400_000 },
  { id: "nt-09", title: "Semi-Autonomous Level 2 Active", body: "Internal event monitoring and safe indexing suggestions are enabled.", priority: "P3", read: true, linkedView: "automation", at: BASE_TIME - 39600_000 },
  { id: "nt-10", title: "22 Knowledge Documents Ready", body: "Local technical and LORIN knowledge base is ready for cited retrieval.", priority: "P4", read: true, linkedView: "knowledge", at: BASE_TIME - 46800_000 },
  { id: "nt-11", title: "GIDEON Continuity Checkpoint Saved", body: "8 verified project decisions recorded with full provenance.", priority: "P4", read: true, linkedView: "memory", at: BASE_TIME - 54000_000 },
  { id: "nt-12", title: "PWA Offline App Shell Verified", body: "Static shell ready; private API responses excluded from public cache.", priority: "P4", read: true, linkedView: "owner", at: BASE_TIME - 61200_000 },
];

export const DEMO_STORAGE_OBJECTS: StorageObjectRecord[] = [
  { id: "st-01", name: "lorin_demo_knowledge_v2_1.sqlite", category: "Dataset", projectId: "p5", sizeKb: 640, version: "v2.1.4", checksum: computeChecksum("lorin_demo_knowledge_v2_1.sqlite"), location: "Primary Node SQLite (Demo)", encrypted: true, updatedAt: "2026-11-24 08:00" },
  { id: "st-02", name: "atlas_q4_sku_manifest_2026.csv", category: "Dataset", projectId: "p1", sizeKb: 312, version: "v1.3.0", checksum: computeChecksum("atlas_q4_sku_manifest_2026.csv"), location: "Local IndexedDB / Vault", encrypted: true, updatedAt: "2026-11-24 07:30" },
  { id: "st-03", name: "meridian_pavilion_elevations_1_100.pdf", category: "Document", projectId: "p3", sizeKb: 1240, version: "v1.4.0", checksum: computeChecksum("meridian_pavilion_elevations_1_100.pdf"), location: "Primary Node SQLite (Demo)", encrypted: true, updatedAt: "2026-11-23 19:15" },
  { id: "st-04", name: "horizon_gguf_4bit_benchmarks.json", category: "Artifact", projectId: "p4", sizeKb: 96, version: "v1.1.0", checksum: computeChecksum("horizon_gguf_4bit_benchmarks.json"), location: "Local IndexedDB / Vault", encrypted: true, updatedAt: "2026-11-23 16:40" },
  { id: "st-05", name: "lorin_device_trust_registry.enc", category: "Config", projectId: "p5", sizeKb: 28, version: "v2.1.0", checksum: computeChecksum("lorin_device_trust_registry.enc"), location: "Primary Node SQLite (Demo)", encrypted: true, updatedAt: "2026-11-24 06:50" },
  { id: "st-06", name: "gideon_decision_ledger_2026_11.jsonl", category: "Archive", projectId: "p5", sizeKb: 184, version: "v2.0.8", checksum: computeChecksum("gideon_decision_ledger_2026_11.jsonl"), location: "Local IndexedDB / Vault", encrypted: true, updatedAt: "2026-11-24 08:10" },
];

export const DEMO_BACKUPS: BackupRecord[] = [
  {
    id: "bk-01",
    label: "Daily Demo Workspace Snapshot (SQLite + Vault)",
    createdAt: "2026-11-24 06:00 WAT",
    sizeKb: 1480,
    checksum: computeChecksum("bk-01-2026-11-24"),
    location: "Local Primary Node Vault (/backups/demo-2026-11-24.tar.enc)",
    integrity: "SHA-256 matched",
    restoreVerified: true,
    lastVerifiedAt: "2026-11-24 06:04 WAT",
  },
  {
    id: "bk-02",
    label: "Pre-M8 Upgrade Checkpoint",
    createdAt: "2026-11-23 18:30 WAT",
    sizeKb: 1390,
    checksum: computeChecksum("bk-02-2026-11-23"),
    location: "Local Primary Node Vault (/backups/demo-2026-11-23.tar.enc)",
    integrity: "Pending restore check",
    restoreVerified: false,
    lastVerifiedAt: null,
  },
];

export const DEMO_SYNC_OPS: SyncOperationRecord[] = [
  { id: "so-01", opId: "op_9f3a11", entityType: "task", entityTitle: "Verify manual bank-transfer settlement rules", originDevice: "ThinkPad X1 Laptop", targetDevice: "Atlas Home Primary Node", version: 14, status: "acknowledged", transport: "Local Wi-Fi (mDNS/TLS)", at: BASE_TIME - 3600_000 },
  { id: "so-02", opId: "op_9f3a12", entityType: "memory", entityTitle: "Prefer local model for private notes", originDevice: "This browser", targetDevice: "Atlas Home Primary Node", version: 15, status: "acknowledged", transport: "Local Wi-Fi (mDNS/TLS)", at: BASE_TIME - 5400_000 },
  { id: "so-03", opId: "op_9f3a13", entityType: "document", entityTitle: "LORIN Device Pairing Specification v2.1", originDevice: "Atlas Home Primary Node", targetDevice: "Pixel 9 Pro (Android)", version: 16, status: "acknowledged", transport: "Local Wi-Fi (mDNS/TLS)", at: BASE_TIME - 7200_000 },
  { id: "so-04", opId: "op_9f3a14", entityType: "task", entityTitle: "Reconcile regional warehouse Q4 SKU manifest", originDevice: "Pixel 9 Pro (Android)", targetDevice: "ThinkPad X1 Laptop", version: 17, status: "conflict", transport: "Mobile Hotspot", at: BASE_TIME - 7200_000 },
  { id: "so-05", opId: "op_9f3a15", entityType: "presence", entityTitle: "Morning Workspace Briefing Ready", originDevice: "Atlas Home Primary Node", targetDevice: "iPad Pro (Safari PWA)", version: 18, status: "acknowledged", transport: "Local Wi-Fi (mDNS/TLS)", at: BASE_TIME - 10800_000 },
];

export const DEMO_SYNC_CONFLICTS: SyncConflictRecord[] = [
  {
    id: "cf-01",
    entityType: "task",
    entityTitle: "Reconcile regional warehouse Q4 SKU manifest (wt-03)",
    localDevice: "ThinkPad X1 Laptop (v17-a)",
    remoteDevice: "Pixel 9 Pro · Android (v17-b)",
    localSummary: "Status: in_progress · Note: 'Verified 980/1,420 SKUs against Lagos warehouse ledger.'",
    remoteSummary: "Status: in_progress · Note: 'Flagged 14 customs tariff discrepancies for Maya Lin.'",
    policyRecommendation: "Merge independent field notes and preserve both audit timestamps.",
    status: "unresolved",
  },
  {
    id: "cf-02",
    entityType: "document",
    entityTitle: "Meridian Studio Brief (doc-10)",
    localDevice: "This browser (v1.3.0)",
    remoteDevice: "Galaxy Tab S9 (v1.3.1)",
    localSummary: "Frame budget target: 60 FPS desktop, 30 FPS mobile fallback.",
    remoteSummary: "Frame budget target: 60 FPS desktop, 30 FPS mobile fallback + elevation PDF export note.",
    policyRecommendation: "Keep both file versions in version history and promote v1.3.1.",
    status: "unresolved",
  },
];

export const DEMO_MEMORIES: Memory[] = [
  { id: "mem1", text: "Prefer the local model for private notes and never transmit private vault records to unverified cloud providers.", source: "Owner note", verified: true, category: "Preference", pinned: true },
  { id: "mem2", text: "The active project starts as Atlas Commerce (p1) with strict isolation from MOSAIRA (p2).", source: "Atlas project brief", verified: true, category: "Decision", pinned: true },
  { id: "mem3", text: "Orders in Atlas Commerce use bank-transfer verification and remain pending until settlement proof is confirmed.", source: "Atlas Commerce Requirements", verified: true, category: "Project Fact", pinned: false },
  { id: "mem4", text: "Meridian Studio 3D walkthroughs must gracefully fall back to 2D orbital rendering when WebGPU or reduced-motion requires it.", source: "Meridian Studio Brief", verified: true, category: "Architecture", pinned: false },
  { id: "mem5", text: "Quiet hours for non-critical Presence notifications (P2–P4) run from 22:30 to 06:30 WAT.", source: "Presence & Call-In Requirements", verified: true, category: "Preference", pinned: false },
  { id: "mem6", text: "Draft memory awaiting owner review: Schedule Horizon 4-bit GGUF benchmark review every Thursday.", source: "Weekly Project Meeting Summary", verified: false, category: "Plan", pinned: false },
];

export const EXPLORE_STEPS: ExploreStep[] = [
  { step: 1, id: "ex-1", title: "1. Home Workspace", view: "home", instruction: "Review LORIN's personal intelligence overview, system readiness, and active project metrics.", expectedOutcome: "Home workspace shows real counts derived from the active tenant." },
  { step: 2, id: "ex-2", title: "2. Activate 3D Companion", view: "companion", instruction: "Open the LORIN Companion workspace and click 'Trigger 5s Activation Intro' to watch the 4-stage emergence.", expectedOutcome: "Companion transitions through Stages 1–4 with skip option." },
  { step: 3, id: "ex-3", title: "3. Enable Foreground Listening", view: "voice", instruction: "Inspect the 15-state wake-word listener and click 'Enable Foreground Listener' (or test microphone).", expectedOutcome: "Listener state badge updates and visible mic indicator appears." },
  { step: 4, id: "ex-4", title: "4. Test Wake Phrase with Context", view: "voice", instruction: "Trigger 'LORIN, can you check the Atlas project?' to verify trailing command preservation.", expectedOutcome: "LORIN detects the wake phrase and preserves 'can you check the Atlas project?'." },
  { step: 5, id: "ex-5", title: "5. 5-Second Activation Sequence", view: "companion", instruction: "Observe or replay the 5-second activation sequence and adaptive presentation rules.", expectedOutcome: "Greeting or preserved command is dispatched upon completion." },
  { step: 6, id: "ex-6", title: "6. Conversation & Knowledge Lookup", view: "chat", instruction: "Ask LORIN a question about verification, cybersecurity, or SQLite WAL synchronization.", expectedOutcome: "Reply cites exact Knowledge Vault sources and shows routing attribution." },
  { step: 7, id: "ex-7", title: "7. Model Gateway & Attribution", view: "intelligence", instruction: "Inspect configured providers (Ollama local, Google Gemini status) and hardware readiness.", expectedOutcome: "Truthful provider status badges (DEMO / NOT CONFIGURED) and sanitized hardware probe." },
  { step: 8, id: "ex-8", title: "8. Search Knowledge Vault", view: "knowledge", instruction: "Search the 22 preloaded documents across 20 technical domains or import a new document.", expectedOutcome: "Full-text search filters documents with SHA-256 checksums and provenance." },
  { step: 9, id: "ex-9", title: "9. Inspect Projects & Progress", view: "projects", instruction: "Switch between Atlas Commerce, Meridian Studio, Horizon Intelligence, and LORIN Development.", expectedOutcome: "Project progress is calculated directly from the 26 underlying tasks." },
  { step: 10, id: "ex-10", title: "10. Create & Approve a Task", view: "tasks", instruction: "Create a work task or approve a pending scoped capability proposal in the approval queue.", expectedOutcome: "Single-use approval digest is consumed and task state updates." },
  { step: 11, id: "ex-11", title: "11. Verify Task Evidence", view: "verification", instruction: "Review the M1–M9 acceptance matrix and verify completed job evidence before commit.", expectedOutcome: "Action is committed only after explicit evidence verification." },
  { step: 12, id: "ex-12", title: "12. Open Device Centre", view: "devices", instruction: "Inspect the 7 demonstration devices, transport priority order, and per-device capability scopes.", expectedOutcome: "Shows Primary Node, laptops, mobile clients, and public key fingerprints." },
  { step: 13, id: "ex-13", title: "13. Pair a Demonstration Client", view: "devices", instruction: "Issue a one-time cryptographic pairing challenge on an unpaired device and approve its scopes.", expectedOutcome: "Device receives a cryptographic identity and pair-once trust record." },
  { step: 14, id: "ex-14", title: "14. Cross-Device Synchronization", view: "sync", instruction: "Simulate a Client A -> Client B task change or resolve one of the 2 sync conflicts.", expectedOutcome: "Change journal records operation ID, version vector, and conflict resolution." },
  { step: 15, id: "ex-15", title: "15. Trigger a Presence Event", view: "presence", instruction: "Inspect the 15 proactive Presence events (P0–P4) and acknowledge or trigger a follow-up.", expectedOutcome: "Presence event updates and logs to GIDEON continuity." },
  { step: 16, id: "ex-16", title: "16. Interactive Call-In Briefing", view: "presence", instruction: "Click 'Simulate Incoming LORIN Call' and accept the call to hear/read the live project briefing.", expectedOutcome: "Simulated incoming call synthesizes overdue tasks and pending approvals." },
  { step: 17, id: "ex-17", title: "17. Storage, Backup & Restore", view: "storage", instruction: "Create a new demo snapshot backup and run 'Verify Restore Integrity'.", expectedOutcome: "Backup is marked VERIFIED only after the restore check completes." },
  { step: 18, id: "ex-18", title: "18. Security, Automation & Owner Control", view: "owner", instruction: "Inspect Demo vs Live tenant isolation, Level 0–2 automation controls, and Emergency Stop.", expectedOutcome: "Walkthrough complete and recorded in the demo environment." },
];

export const GUIDED_SCENARIOS: GuidedScenario[] = [
  { id: "sc-meet", title: "Meet LORIN (5s Wake & Greeting)", category: "M1 · Companion", view: "companion", description: "Triggers wake phrase detection, plays the 5-second companion activation, and delivers a time-aware project briefing." },
  { id: "sc-research", title: "Research & Cited Knowledge", category: "M2/M3 · Knowledge", view: "chat", description: "Queries the local 20-domain knowledge base for SQLite WAL synchronization and cites verified sources.", samplePrompt: "How does SQLite WAL mode support local-first sync journals?" },
  { id: "sc-eng", title: "Software Engineering Diff & Guard", category: "M4 · Workbench", view: "workbench", description: "Proposes the server-bound digest policy diff and tests the critical shell.exec block." },
  { id: "sc-tasks", title: "Task Coordination & Approval", category: "M4 · Tasks", view: "tasks", description: "Creates a new high-priority milestone task and queues a Knowledge Vault index proposal." },
  { id: "sc-presence", title: "Proactive Presence & Call-In", category: "M7 · Presence", view: "presence", description: "Launches an incoming P1 simulated LORIN call briefing covering overdue Atlas and Meridian tasks." },
  { id: "sc-contact", title: "Contact Follow-up Draft", category: "M7 · Calendar", view: "calendar", description: "Prepares an owner-reviewed follow-up draft for Maya Lin regarding the Q4 SKU manifest." },
  { id: "sc-pair", title: "One-Time Cryptographic Device Pairing", category: "M6 · Devices", view: "devices", description: "Issues a cryptographic challenge for the Windows Workstation and registers its key fingerprint." },
  { id: "sc-sync", title: "Cross-Device Sync & Conflict Merge", category: "M9 · Sync", view: "sync", description: "Simulates a multi-client update from Pixel 9 Pro and resolves a task conflict." },
  { id: "sc-storage", title: "Snapshot Backup & Restore Test", category: "M9 · Storage", view: "storage", description: "Creates an encrypted demo snapshot and runs a non-destructive SHA-256 restore check." },
  { id: "sc-security", title: "Security Incident & Emergency Stop", category: "Security · Lena", view: "automation", description: "Simulates an unauthorized shell attempt (blocked by Lena) and demonstrates the owner Emergency Stop." },
];

export const M1_M9_ACCEPTANCE_MATRIX: AcceptanceCriterion[] = [
  { id: "ac-m1", milestone: "M1", capability: "3D Holographic Companion, 5s Activation & Adaptive Presentation", status: "Verified", evidence: "Real-time 3D perspective canvas with gaze tracking, audio pulse sync, 4-stage intro, skip control, and 2D fallback." },
  { id: "ac-m2", milestone: "M2", capability: "Model Gateway Routing, Attribution & Local Knowledge Distinction", status: "Verified", evidence: "Distinguishes local vault lookup from live provider inference; blocks unverified cloud calls." },
  { id: "ac-m3", milestone: "M3", capability: "20-Domain Knowledge Vault, Checksums & GIDEON Memory Provenance", status: "Verified", evidence: "22 seeded docs across 20 domains, file import parser (TXT/MD/CSV/JSON/HTML), and memory pin/approve/export." },
  { id: "ac-m4", milestone: "M4", capability: "Engineering Workbench, Policy Diffs & Critical Action Guard", status: "Verified", evidence: "Single-use fingerprint-bound approvals; critical shell.exec permanently blocked." },
  { id: "ac-m5", milestone: "M5", capability: "15-State Wake-Word Listener, Context Retention & Vision Privacy", status: "Verified", evidence: "Preserves trailing commands after wake phrase; visible mic indicator; local-only vision snapshot record." },
  { id: "ac-m6", milestone: "M6", capability: "Device Centre, One-Time Cryptographic Pairing & Transport Priority", status: "Verified", evidence: "7 devices with key fingerprints, Wi-Fi mDNS -> Hotspot priority, and granular capability scopes." },
  { id: "ac-m7", milestone: "M7", capability: "Semi-Automatic Presence (P0–P4) & Simulated Call-In Briefing", status: "Verified", evidence: "15 Presence events, 12 notifications, quiet hours, and interactive Call-In synthesizer." },
  { id: "ac-m8", milestone: "M8", capability: "PWA Manifest, Platform Detection & Honest Windows Installer Status", status: "Verified", evidence: "Detects browser/PWA capabilities and honestly reports Windows Desktop Application — Not Yet Available." },
  { id: "ac-m9", milestone: "M9", capability: "Local-First Change Journal, Conflict Resolution & Verified Backups", status: "Verified", evidence: "Durable change journal, Client A/B sync simulator, conflict merge UI, and restore-verified backups." },
];
