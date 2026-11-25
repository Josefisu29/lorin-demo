import { i as __toESM } from "../_runtime.mjs";
import { Bt as require_react, y as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { $ as ArrowUpRight, A as HardDrive, B as CodeXml, C as Menu, D as KeyRound, E as Keyboard, F as Eye, G as Check, H as CloudOff, I as Download, J as Battery, K as BrainCircuit, L as Database, M as FolderKanban, N as FileText, O as House, P as FileCheck2, Q as AudioLines, R as Cpu, S as MessageSquare, T as Laptop, U as CircleAlert, V as Cloud, W as ChevronRight, X as BatteryCharging, Y as BatteryWarning, Z as BadgeCheck, _ as Plus, a as Upload, b as MonitorSmartphone, c as Sparkles, d as ShieldCheck, et as ArrowRight, f as Settings, g as Plug, h as RefreshCw, i as WifiOff, j as Folder, k as History, l as SlidersHorizontal, m as Search, n as X, o as TriangleAlert, p as Server, q as BookOpen, r as Workflow, s as Terminal, t as Zap, tt as Activity, u as Shield, v as PanelRight, w as Lock, x as Mic, y as Network, z as Command } from "../_libs/lucide-react.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
// node_modules/.nitro/vite/services/ssr/assets/routes-X6lPSrix.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var NAVIGATION_SHORTCUTS = [
	{
		chord: "g h",
		secondKey: "h",
		view: "home",
		label: "Go to Today / Home"
	},
	{
		chord: "g c",
		secondKey: "c",
		view: "chat",
		label: "Go to Conversation"
	},
	{
		chord: "g p",
		secondKey: "p",
		view: "projects",
		label: "Go to Projects"
	},
	{
		chord: "g t",
		secondKey: "t",
		view: "tasks",
		label: "Go to Tasks & approvals"
	},
	{
		chord: "g w",
		secondKey: "w",
		view: "workbench",
		label: "Go to Workbench"
	},
	{
		chord: "g x",
		secondKey: "x",
		view: "sandbox",
		label: "Go to Sandbox"
	},
	{
		chord: "g k",
		secondKey: "k",
		view: "knowledge",
		label: "Go to Knowledge vault"
	},
	{
		chord: "g v",
		secondKey: "v",
		view: "vault",
		label: "Go to Private vault"
	},
	{
		chord: "g m",
		secondKey: "m",
		view: "memory",
		label: "Go to Memory"
	},
	{
		chord: "g g",
		secondKey: "g",
		view: "gideon",
		label: "Go to Continuity (GIDEON)"
	},
	{
		chord: "g i",
		secondKey: "i",
		view: "intelligence",
		label: "Go to Intelligence studio"
	},
	{
		chord: "g n",
		secondKey: "n",
		view: "connections",
		label: "Go to Connected services"
	},
	{
		chord: "g d",
		secondKey: "d",
		view: "devices",
		label: "Go to Devices"
	},
	{
		chord: "g r",
		secondKey: "r",
		view: "trust",
		label: "Go to Security & trust"
	},
	{
		chord: "g s",
		secondKey: "s",
		view: "settings",
		label: "Go to Settings"
	}
];
var SHORTCUT_MAP = new Map(NAVIGATION_SHORTCUTS.map((item) => [item.secondKey, item.view]));
/**
* Resolves the second key of a "g <key>" navigation chord to a LORIN View.
*/
function resolveNavigationShortcut(key) {
	if (!key) return null;
	return SHORTCUT_MAP.get(key.toLowerCase()) ?? null;
}
/**
* Returns true if the event target is an editable form control where single-key
* navigation chords should not hijack text entry.
*/
function isEditableTarget(target) {
	if (!target || typeof target !== "object") return false;
	const el = target;
	if (el.isContentEditable) return true;
	const tag = (el.tagName ?? "").toUpperCase();
	if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
	if (typeof el.getAttribute === "function" && el.getAttribute("role") === "textbox") return true;
	return false;
}
/**
* Handles global LORIN keyboard shortcuts:
* - Cmd+K / Ctrl+K: Toggle Command Palette (works even while focused in inputs)
* - Escape: Close Command Palette
* - "g" followed by a navigation key (e.g. "g" then "h" -> Home, "g" then "s" -> Settings)
*/
function useGlobalShortcuts({ onNavigate, onTogglePalette, onClosePalette, paletteOpen, chordTimeoutMs = 1e3 }) {
	const [pendingPrefix, setPendingPrefix] = (0, import_react.useState)(null);
	const prefixRef = (0, import_react.useRef)(null);
	const timerRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const clearChord = () => {
			prefixRef.current = null;
			setPendingPrefix(null);
			if (timerRef.current !== null) {
				window.clearTimeout(timerRef.current);
				timerRef.current = null;
			}
		};
		const onKeyDown = (event) => {
			const keyLower = event.key.toLowerCase();
			if ((event.metaKey || event.ctrlKey) && !event.altKey && keyLower === "k") {
				event.preventDefault();
				clearChord();
				onTogglePalette();
				return;
			}
			if (keyLower === "escape") {
				if (paletteOpen) {
					event.preventDefault();
					onClosePalette();
				}
				clearChord();
				return;
			}
			if (paletteOpen || event.metaKey || event.ctrlKey || event.altKey) return;
			if (isEditableTarget(event.target)) return;
			if (prefixRef.current === "g") {
				const destination = resolveNavigationShortcut(keyLower);
				clearChord();
				if (destination) {
					event.preventDefault();
					onNavigate(destination);
				}
				return;
			}
			if (keyLower === "g") {
				prefixRef.current = "g";
				setPendingPrefix("g");
				if (timerRef.current !== null) window.clearTimeout(timerRef.current);
				timerRef.current = window.setTimeout(() => {
					clearChord();
				}, chordTimeoutMs);
			}
		};
		window.addEventListener("keydown", onKeyDown);
		return () => {
			window.removeEventListener("keydown", onKeyDown);
			clearChord();
		};
	}, [
		onNavigate,
		onTogglePalette,
		onClosePalette,
		paletteOpen,
		chordTimeoutMs
	]);
	return { pendingPrefix };
}
var current = null;
async function captureMic() {
	releaseMic();
	if (!navigator.mediaDevices?.getUserMedia) throw new Error("Microphone API is unavailable.");
	const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
	current = stream;
	return stream;
}
function releaseMic() {
	current?.getTracks().forEach((t) => t.stop());
	current = null;
}
function startMeter(stream, onLevel) {
	const ctx = new AudioContext();
	ctx.resume();
	const source = ctx.createMediaStreamSource(stream);
	const analyser = ctx.createAnalyser();
	analyser.fftSize = 256;
	source.connect(analyser);
	const data = new Uint8Array(analyser.frequencyBinCount);
	let raf = 0;
	const tick = () => {
		analyser.getByteTimeDomainData(data);
		let sum = 0;
		for (let i = 0; i < data.length; i++) {
			const v = (data[i] - 128) / 128;
			sum += v * v;
		}
		onLevel(Math.min(1, Math.sqrt(sum / data.length) * 4));
		raf = requestAnimationFrame(tick);
	};
	tick();
	return () => {
		cancelAnimationFrame(raf);
		source.disconnect();
		ctx.close();
	};
}
function silence() {
	if (typeof window === "undefined" || !window.speechSynthesis) return;
	window.speechSynthesis.cancel();
}
function speak(text, hooks) {
	if (typeof window === "undefined" || !window.speechSynthesis) return false;
	window.speechSynthesis.cancel();
	const utterance = new SpeechSynthesisUtterance(text);
	utterance.rate = 1;
	utterance.onstart = hooks.onstart;
	utterance.onend = hooks.onend;
	utterance.onerror = hooks.onerror;
	window.speechSynthesis.speak(utterance);
	return true;
}
var CAPABILITIES = [
	{
		id: "vault.index",
		title: "Index knowledge vault",
		risk: "read",
		schema: "No arguments. Reads knowledge titles only."
	},
	{
		id: "knowledge.append",
		title: "Append knowledge document",
		risk: "write",
		schema: "Title and body. Knowledge vault only."
	},
	{
		id: "private.append",
		title: "Append private note",
		risk: "write",
		schema: "Title and body. Private vault only."
	},
	{
		id: "memory.store",
		title: "Store memory",
		risk: "write",
		schema: "One sentence. Kept only after verification."
	},
	{
		id: "policy.apply",
		title: "Apply policy diff",
		risk: "write",
		schema: "The one workbench diff. No shell."
	},
	{
		id: "shell.exec",
		title: "Run a shell command",
		risk: "critical",
		schema: "Denied. No command is accepted."
	}
];
var SPECIALISTS = [
	{
		name: "Lena",
		role: "Refuses anything outside policy."
	},
	{
		name: "Owen",
		role: "Research routing. Not a second assistant."
	},
	{
		name: "Riley",
		role: "Workspace and project context."
	},
	{
		name: "Iris",
		role: "Vault passages and citations."
	},
	{
		name: "Nolan",
		role: "Engineering diffs. No shell."
	},
	{
		name: "GIDEON",
		role: "Continuity log. Not a chat identity."
	}
];
var POLICY_BEFORE = `function allow(flag: boolean) {\n  return flag;\n}`;
var POLICY_AFTER = `function allow(digest: string) {\n  return registry.consume(digest);\n}`;
function uid(prefix) {
	return `${prefix}_${Math.random().toString(36).slice(2, 8)}${Date.now().toString(36).slice(-3)}`;
}
function fingerprint(capability, scope, args) {
	const s = `${capability}\n${scope}\n${args}`;
	let h = 2166136261;
	for (let i = 0; i < s.length; i++) {
		h ^= s.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return `fp_${(h >>> 0).toString(16).padStart(8, "0")}`;
}
function capabilityById(id) {
	return CAPABILITIES.find((c) => c.id === id);
}
function splitArgs(args) {
	const idx = args.indexOf("::");
	if (idx === -1) return {
		title: args.trim() || "Untitled",
		body: ""
	};
	return {
		title: args.slice(0, idx).trim() || "Untitled",
		body: args.slice(idx + 2).trim()
	};
}
var PRIVATE_RE = /\b(private|owner note|password|secret|credential|credentials)\b/i;
var RESEARCH_RE = /\b(research|compare|web|latest|papers|public)\b/i;
var MEMORY_RE = /\b(remember|memory|memories)\b/i;
var CODE_RE = /\b(code|diff|policy|implement|digest)\b/i;
function routeDecision(input) {
	const research = RESEARCH_RE.test(input.query);
	const coding = CODE_RE.test(input.query);
	const { route, geminiVerified, online, privateIntent } = input;
	if (privateIntent) return {
		model: "ollama-local",
		reason: "Private intent stays on this device. Cloud routing was not used.",
		specialists: ["Lena", "Iris"],
		character: "idle"
	};
	if (route === "local-only") return {
		model: "ollama-local",
		reason: "Local-only lock is on. No cloud call was made.",
		specialists: ["Riley", "Iris"],
		character: "idle"
	};
	if (route === "ollama") return {
		model: "ollama-local",
		reason: "Routing preference is the local model.",
		specialists: coding ? ["Nolan", "Iris"] : ["Iris"],
		character: coding ? "coding" : "idle"
	};
	const wantsGemini = route === "gemini" || route === "auto" && research;
	if (route === "gemini" && !geminiVerified) return {
		model: "blocked",
		reason: "Gemini is configured, not verified. Nothing was sent, and the vault was not used as a stand-in.",
		specialists: ["Lena"],
		character: "error"
	};
	if (route === "gemini" && !online) return {
		model: "offline",
		reason: "Gemini was requested while offline. No cloud reply was invented.",
		specialists: ["Lena"],
		character: "offline"
	};
	if (wantsGemini && route === "auto" && (!online || !geminiVerified)) return {
		model: "ollama-local",
		reason: !online ? "Offline, so automatic routing stayed on the local vault." : "Research would use Gemini, but that provider is not verified. Answered from the local vault.",
		specialists: ["Iris", "Lena"],
		character: "idle"
	};
	if (wantsGemini && geminiVerified && online) return {
		model: "gemini",
		reason: "Routing selected Gemini. This demo did not call it. Sentences below are copied from the vault.",
		specialists: ["Owen", "Iris"],
		character: "researching"
	};
	return {
		model: "ollama-local",
		reason: "Automatic routing stayed local. No cloud call was made.",
		specialists: coding ? ["Nolan", "Iris"] : ["Riley", "Iris"],
		character: coding ? "coding" : "idle"
	};
}
function answerQuestion(input) {
	const query = input.query.trim();
	const privateIntent = PRIVATE_RE.test(query);
	const memoryIntent = MEMORY_RE.test(query);
	if (input.projectId === "p2" && (privateIntent || memoryIntent)) return {
		text: "MOSAIRA cannot read the private vault, memories, or devices. Switch to Atlas for that.",
		model: "ollama-local",
		reason: "Project boundary refused private retrieval.",
		specialists: ["Lena"],
		sources: [],
		character: "idle"
	};
	if (memoryIntent && input.projectId !== "p2") {
		const kept = input.memories.filter((m) => m.verified);
		if (!kept.length) return {
			text: "No approved memory matches. I will not invent one.",
			model: "ollama-local",
			reason: "Memory intent, and the approved list is empty.",
			specialists: ["GIDEON"],
			sources: [],
			character: "idle"
		};
		return {
			text: kept.map((m) => m.text).join(" "),
			model: "ollama-local",
			reason: "Answered only from memories you already verified.",
			specialists: ["GIDEON"],
			sources: kept.map((m) => `Memory · ${m.source}`),
			character: "idle"
		};
	}
	const decision = routeDecision({
		query,
		route: input.route,
		geminiVerified: input.geminiVerified,
		online: input.online,
		privateIntent
	});
	if (decision.model === "blocked" || decision.model === "offline") return {
		...decision,
		text: decision.reason,
		sources: []
	};
	const pool = input.docs.filter((d) => {
		if (privateIntent) return d.vault === "private";
		if (d.vault !== "knowledge") return false;
		if (input.projectId === "p2") return d.scope === "public";
		return true;
	});
	const terms = query.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3);
	const hits = pool.map((d) => {
		const hay = `${d.title} ${d.body} ${d.tags.join(" ")}`.toLowerCase();
		return {
			d,
			score: terms.reduce((n, w) => n + (hay.includes(w) ? 1 : 0), 0)
		};
	}).filter((x) => x.score > 0).sort((a, b) => b.score - a.score).map((x) => x.d);
	if (!hits.length) return {
		...decision,
		text: "No vault passage matches that. I will not fill the gap with an unsourced claim.",
		sources: [],
		specialists: ["Iris"],
		character: "idle"
	};
	return {
		...decision,
		text: hits.map((d) => `${d.title} — ${d.body}`).join("\n\n"),
		sources: hits.map((d) => d.title)
	};
}
function evidenceFor(job, docs) {
	if (job.capability === "vault.index") {
		const titles = docs.filter((d) => d.vault === "knowledge").map((d) => d.title);
		return `Prepared an index of ${titles.length} knowledge titles: ${titles.join(", ")}. Private vault was not scanned. Nothing is marked indexed until you verify.`;
	}
	if (job.capability === "knowledge.append" || job.capability === "private.append") {
		const { title } = splitArgs(job.args);
		return `Draft “${title}” is ready. It is not written into the vault until you verify.`;
	}
	if (job.capability === "memory.store") return "Memory draft is ready. It is not kept until you verify.";
	if (job.capability === "policy.apply") return "Diff is prepared. The workbench still shows the old policy until you verify.";
	return `${job.title} finished. The result is not verified.`;
}
var timers = /* @__PURE__ */ new Set();
function later(fn, ms) {
	const id = window.setTimeout(() => {
		timers.delete(id);
		fn();
	}, ms);
	timers.add(id);
}
function clearTimers() {
	timers.forEach((id) => window.clearTimeout(id));
	timers.clear();
}
function pushAudit(audit, text) {
	return [{
		id: uid("a"),
		text,
		at: Date.now()
	}, ...audit].slice(0, 40);
}
function pushEvent(events, title, detail) {
	return [{
		id: uid("e"),
		title,
		detail,
		at: Date.now()
	}, ...events].slice(0, 40);
}
var opened = Date.now();
function fresh() {
	const docs = [
		{
			id: "d1",
			vault: "knowledge",
			title: "Atlas project brief",
			body: "Atlas is the private intelligence shell. It routes locally first, cites vault sources, and never treats a finished process as verification.",
			tags: ["project", "atlas"],
			indexed: false,
			scope: "atlas"
		},
		{
			id: "d2",
			vault: "knowledge",
			title: "Permission model",
			body: "Capabilities are closed schemas. Critical operations are denied. A write requires a single-use approval bound to the action fingerprint.",
			tags: ["security"],
			indexed: false,
			scope: "atlas"
		},
		{
			id: "d4",
			vault: "knowledge",
			title: "MOSAIRA public boundary",
			body: "MOSAIRA publishes research. It does not receive private notes, memories, credentials, or device permissions from Atlas.",
			tags: ["mosaira", "public"],
			indexed: false,
			scope: "public"
		},
		{
			id: "d3",
			vault: "private",
			title: "Owner note",
			body: "Keep private notes off cloud models. The working timezone is WAT. Do not copy this note into MOSAIRA.",
			tags: ["private"],
			indexed: false,
			scope: "atlas"
		}
	];
	const indexScope = "Read-only scan of Knowledge Vault titles. No private vault access.";
	return {
		mode: "workspace",
		view: "home",
		drawer: false,
		inspector: true,
		commandPaletteOpen: false,
		projectId: "p1",
		route: "auto",
		syncProfile: "balanced",
		geminiVerified: false,
		online: true,
		micGranted: false,
		voice: "idle",
		voiceSource: "none",
		voiceSession: "",
		transcript: "",
		character: "idle",
		messages: [{
			id: "m0",
			role: "lorin",
			text: "Workspace is on this device. I cite the vault, I propose scoped actions, and I do not call a result verified until you check it.",
			model: "ollama-local",
			specialists: ["Riley"],
			at: opened - 36e5
		}],
		jobs: [{
			id: "j1",
			capability: "vault.index",
			title: "Index knowledge vault",
			scope: indexScope,
			args: "",
			risk: "read",
			fingerprint: fingerprint("vault.index", indexScope, ""),
			state: "awaiting",
			at: opened - 72e5
		}, {
			id: "j0",
			capability: "memory.store",
			title: "Record Atlas decision",
			scope: "Append one continuity event: local-first routing is the default.",
			args: "Local-first routing is the default.",
			risk: "write",
			fingerprint: fingerprint("memory.store", "Append one continuity event: local-first routing is the default.", "Local-first routing is the default."),
			approvalId: "ap_seed01",
			state: "verified",
			evidence: "Continuity already contains the routing decision.",
			at: opened - 864e5
		}],
		docs,
		memories: [{
			id: "mem1",
			text: "Prefer the local model for private notes.",
			source: "Owner note",
			verified: true
		}, {
			id: "mem2",
			text: "The active project starts as Atlas.",
			source: "Atlas project brief",
			verified: true
		}],
		events: [{
			id: "e1",
			title: "Routing policy set",
			detail: "Local-first is the default. Cloud only when the provider is verified and the content is not private.",
			at: opened - 864e5
		}, {
			id: "e2",
			title: "Vaults separated",
			detail: "Knowledge and the private vault are different stores. MOSAIRA cannot read the private one.",
			at: opened - 5e7
		}],
		projects: [{
			id: "p1",
			name: "Atlas",
			status: "Active",
			note: "Personal intelligence shell. Local-first routing, cited answers, gated actions."
		}, {
			id: "p2",
			name: "MOSAIRA",
			status: "Separate",
			note: "Public research surface. It does not inherit private memory, notes, or device permissions."
		}],
		devices: [{
			id: "dev1",
			name: "This browser",
			kind: "Web",
			phase: "session",
			paired: true,
			online: true,
			note: "The session you are using. It is not a desktop agent."
		}, {
			id: "dev2",
			name: "Windows companion",
			kind: "Desktop",
			phase: "unpaired",
			paired: false,
			online: false,
			note: "No desktop agent is installed in this demo. Pairing only records a handshake."
		}],
		audit: [{
			id: "a0",
			text: "Demo session opened. No live cloud call was made.",
			at: opened
		}],
		policyApplied: false,
		epoch: 1,
		lastDecision: null
	};
}
function commitJob(job, data) {
	if (job.capability === "vault.index") return { docs: data.docs.map((d) => d.vault === "knowledge" ? {
		...d,
		indexed: true
	} : d) };
	if (job.capability === "knowledge.append" || job.capability === "private.append") {
		const { title, body } = splitArgs(job.args);
		return { docs: [{
			id: uid("d"),
			vault: job.capability === "private.append" ? "private" : "knowledge",
			title,
			body: body || title,
			tags: [job.capability === "private.append" ? "private" : "project"],
			indexed: false,
			scope: "atlas"
		}, ...data.docs] };
	}
	if (job.capability === "memory.store") return { memories: [{
		id: uid("mem"),
		text: job.args.trim(),
		source: "Verified in this session",
		verified: true
	}, ...data.memories] };
	if (job.capability === "policy.apply") return { policyApplied: true };
	return {};
}
var useLorin = create()(persist((set, get) => ({
	...fresh(),
	setMode: (mode) => set({
		mode,
		drawer: false,
		view: mode === "compact" ? "chat" : get().view
	}),
	setView: (view) => set({
		view,
		drawer: false
	}),
	setDrawer: (drawer) => set({ drawer }),
	setInspector: (inspector) => set({ inspector }),
	setCommandPaletteOpen: (commandPaletteOpen) => set({ commandPaletteOpen }),
	setProject: (projectId) => {
		const name = get().projects.find((p) => p.id === projectId)?.name ?? projectId;
		set((s) => ({
			projectId,
			audit: pushAudit(s.audit, `Active project is ${name}.`)
		}));
	},
	setRoute: (route) => set({ route }),
	setSyncProfile: (syncProfile) => set((s) => ({
		syncProfile,
		audit: pushAudit(s.audit, `Sync profile preference set to ${syncProfile}.`)
	})),
	verifyGemini: () => set((s) => ({
		geminiVerified: false,
		audit: pushAudit(s.audit, "Gemini verification unavailable in this demo. No credentials were checked and cloud routing remains blocked.")
	})),
	setOnline: (online) => set({
		online,
		character: online ? "idle" : "offline"
	}),
	noteMic: (micGranted, detail) => set((s) => ({
		micGranted,
		character: micGranted ? s.character : "error",
		transcript: micGranted ? s.transcript : detail || "Microphone permission was denied or is unavailable.",
		audit: pushAudit(s.audit, micGranted ? "Microphone permission granted." : "Microphone permission was not granted.")
	})),
	send: (text, opts) => {
		const t = text.trim();
		if (!t) return;
		const s = get();
		const user = {
			id: uid("u"),
			role: "user",
			text: t,
			at: Date.now()
		};
		const a = answerQuestion({
			query: t,
			docs: s.docs,
			memories: s.memories,
			projectId: s.projectId,
			route: s.route,
			geminiVerified: s.geminiVerified,
			online: s.online
		});
		const reply = {
			id: uid("l"),
			role: "lorin",
			text: a.text,
			model: a.model,
			sources: a.sources,
			specialists: a.specialists,
			at: Date.now() + 1
		};
		const decision = {
			model: a.model,
			reason: a.reason,
			specialists: a.specialists,
			sources: a.sources,
			character: a.character
		};
		set({
			messages: [
				...s.messages,
				user,
				reply
			].slice(-80),
			lastDecision: decision,
			character: opts?.fromVoice ? "processing" : a.character,
			view: opts?.fromVoice ? s.view : s.view === "home" ? "chat" : s.view,
			events: a.sources.length ? pushEvent(s.events, "Cited reply", a.sources.join(", ")) : s.events,
			audit: pushAudit(s.audit, `Routed via ${a.model}. ${a.reason}`)
		});
	},
	propose: (capabilityId, scope, args = "") => {
		const cap = capabilityById(capabilityId);
		if (!cap) return;
		if ((cap.risk === "write" || capabilityId.endsWith(".append") || capabilityId === "memory.store") && capabilityId !== "policy.apply" && capabilityId !== "vault.index" && !args.trim()) return;
		const fp = fingerprint(cap.id, scope, args);
		if (cap.risk === "critical") {
			const job = {
				id: uid("j"),
				capability: cap.id,
				title: cap.title,
				scope,
				args,
				risk: cap.risk,
				fingerprint: fp,
				state: "blocked",
				evidence: "Critical risk is denied. No approval can override that.",
				at: Date.now()
			};
			set((s) => ({
				jobs: [job, ...s.jobs],
				view: "tasks",
				character: "error",
				audit: pushAudit(s.audit, `Blocked ${cap.id}.`),
				events: pushEvent(s.events, "Action blocked", cap.title)
			}));
			return;
		}
		const job = {
			id: uid("j"),
			capability: cap.id,
			title: cap.title,
			scope,
			args,
			risk: cap.risk,
			fingerprint: fp,
			state: "awaiting",
			at: Date.now()
		};
		set((s) => ({
			jobs: [job, ...s.jobs],
			view: "tasks",
			audit: pushAudit(s.audit, `Proposed ${cap.risk} action ${cap.id} · ${fp}.`)
		}));
	},
	decide: (id, allow) => {
		const job = get().jobs.find((j) => j.id === id);
		if (!job || job.state !== "awaiting" || job.risk === "critical") return;
		if (fingerprint(job.capability, job.scope, job.args) !== job.fingerprint) {
			set((s) => ({
				jobs: s.jobs.map((j) => j.id === id ? {
					...j,
					state: "failed",
					evidence: "Fingerprint no longer matches the proposal. Approval refused."
				} : j),
				audit: pushAudit(s.audit, `Fingerprint mismatch on ${job.title}.`)
			}));
			return;
		}
		if (!allow) {
			set((s) => ({
				jobs: s.jobs.map((j) => j.id === id ? {
					...j,
					state: "cancelled",
					evidence: "Denied. Nothing ran."
				} : j),
				audit: pushAudit(s.audit, `Denied ${job.title}.`)
			}));
			return;
		}
		const approvalId = uid("ap");
		const epoch = get().epoch;
		set((s) => ({
			jobs: s.jobs.map((j) => j.id === id ? {
				...j,
				state: "running",
				approvalId,
				evidence: void 0
			} : j),
			character: job.capability === "policy.apply" ? "coding" : "processing",
			audit: pushAudit(s.audit, `Single-use approval ${approvalId} consumed for ${job.fingerprint}.`)
		}));
		later(() => {
			if (get().epoch !== epoch) return;
			const current = get().jobs.find((j) => j.id === id);
			if (!current || current.state !== "running") return;
			const evidence = evidenceFor(current, get().docs);
			set((s) => ({
				jobs: s.jobs.map((j) => j.id === id ? {
					...j,
					state: "completed",
					evidence
				} : j),
				character: s.voice === "idle" ? "idle" : s.character,
				events: pushEvent(s.events, "Awaiting verification", current.title)
			}));
		}, 900);
	},
	verify: (id) => {
		const s = get();
		const job = s.jobs.find((j) => j.id === id);
		if (!job || job.state !== "completed") return;
		set({
			...commitJob(job, s),
			jobs: s.jobs.map((j) => j.id === id ? {
				...j,
				state: "verified",
				evidence: "Verified. The scoped change is now committed in this demo."
			} : j),
			events: pushEvent(s.events, "Verified", job.title),
			audit: pushAudit(s.audit, `Verified ${job.title}.`),
			character: "idle"
		});
	},
	rejectEvidence: (id) => {
		const job = get().jobs.find((j) => j.id === id);
		if (!job || job.state !== "completed") return;
		set((s) => ({
			jobs: s.jobs.map((j) => j.id === id ? {
				...j,
				state: "failed",
				evidence: "Evidence rejected. Nothing was committed."
			} : j),
			audit: pushAudit(s.audit, `Evidence rejected for ${job.title}.`),
			character: "idle"
		}));
	},
	cancel: (id) => set((s) => ({
		jobs: s.jobs.map((j) => j.id === id && (j.state === "awaiting" || j.state === "running") ? {
			...j,
			state: "cancelled",
			evidence: "Cancelled before commit."
		} : j),
		character: s.voice === "idle" ? "idle" : s.character,
		audit: pushAudit(s.audit, "Job cancelled.")
	})),
	beginListen: (source) => set({
		voice: "listening",
		voiceSource: source,
		voiceSession: uid("vs"),
		character: "listening",
		view: get().view === "home" ? "voice" : get().view,
		transcript: source === "microphone" ? "Microphone open. Audio is not transcribed." : "Scripted listen. The microphone is not open."
	}),
	finishUtterance: (text, source) => {
		const clean = text.trim();
		if (!clean) return;
		if (get().voice !== "listening") return;
		const session = uid("vs");
		const epoch = get().epoch;
		set({
			voice: "processing",
			voiceSource: source,
			voiceSession: session,
			character: "processing",
			transcript: source === "script" ? `Scripted line: ${clean}` : `Utterance: ${clean}`
		});
		get().send(clean, { fromVoice: true });
		if (!speak(([...get().messages].reverse().find((m) => m.role === "lorin")?.text ?? clean).replace(/\s+/g, " ").slice(0, 220), {
			onstart: () => {
				if (get().voiceSession === session && get().voice === "processing") set({
					voice: "speaking",
					character: "speaking"
				});
			},
			onend: () => {
				if (get().voiceSession === session) set({
					voice: "idle",
					character: "idle"
				});
			},
			onerror: () => {
				if (get().voiceSession === session) set({
					voice: "idle",
					character: "idle",
					transcript: `${get().transcript} Speech output did not play. The reply is in Conversation.`
				});
			}
		}) && get().voiceSession === session) set({
			voice: "idle",
			character: "idle",
			transcript: `${get().transcript} This browser has no speech output. The reply is in Conversation.`
		});
		later(() => {
			if (get().epoch !== epoch || get().voiceSession !== session) return;
			if (get().voice === "processing") set({
				voice: "idle",
				character: "idle",
				transcript: `${get().transcript} Speech did not start. The reply is in Conversation.`
			});
		}, 1200);
	},
	interrupt: () => {
		clearTimers();
		silence();
		set({
			voice: "idle",
			voiceSource: "none",
			voiceSession: uid("vs"),
			character: "idle",
			transcript: get().transcript ? `${get().transcript} (interrupted)` : ""
		});
	},
	snapshot: (fileName) => set((s) => ({
		view: "vision",
		character: "vision",
		messages: [...s.messages, {
			id: uid("l"),
			role: "lorin",
			text: `Snapshot noted: ${fileName}. The file stays on this device. No vision model was called, and nothing is watched in the background.`,
			model: "ollama-local",
			specialists: ["Iris"],
			at: Date.now()
		}].slice(-80),
		audit: pushAudit(s.audit, `Snapshot noted (${fileName}). Not analyzed by a model.`),
		events: pushEvent(s.events, "Snapshot noted", fileName)
	})),
	issuePairCode: (id) => {
		const code = Math.random().toString(36).slice(2, 8).toUpperCase();
		set((s) => ({
			devices: s.devices.map((d) => d.id === id && d.phase !== "session" ? {
				...d,
				phase: "code",
				paired: false,
				online: false,
				code,
				note: "Code issued. Confirming it does not start a Windows process."
			} : d),
			audit: pushAudit(s.audit, `Pairing code issued for ${id}.`)
		}));
	},
	confirmHandshake: (id) => set((s) => ({
		devices: s.devices.map((d) => d.id === id && d.phase === "code" ? {
			...d,
			phase: "paired",
			paired: true,
			online: true,
			note: "Demo handshake recorded. No Windows companion is running."
		} : d),
		audit: pushAudit(s.audit, "Device handshake recorded locally."),
		events: pushEvent(s.events, "Device handshake", "Windows companion marked paired in this demo only.")
	})),
	revokeDevice: (id) => set((s) => ({
		devices: s.devices.map((d) => d.id === id && d.phase !== "session" ? {
			...d,
			phase: "unpaired",
			paired: false,
			online: false,
			code: void 0,
			note: "Pairing revoked. No desktop agent was contacted."
		} : d),
		audit: pushAudit(s.audit, "Device pairing revoked.")
	})),
	reset: () => {
		clearTimers();
		silence();
		set({
			...fresh(),
			epoch: get().epoch + 1
		});
	}
}), {
	name: "lorin-m0-m6",
	skipHydration: true,
	partialize: (state) => {
		const { commandPaletteOpen: _commandPaletteOpen, ...rest } = state;
		return rest;
	}
}));
var GROUPS = [
	{
		label: "Workspace",
		items: [
			{
				id: "home",
				label: "Today",
				icon: House
			},
			{
				id: "chat",
				label: "Conversation",
				icon: MessageSquare
			},
			{
				id: "projects",
				label: "Projects",
				icon: FolderKanban
			},
			{
				id: "tasks",
				label: "Tasks & approvals",
				icon: Activity
			},
			{
				id: "workbench",
				label: "Workbench",
				icon: Cpu
			},
			{
				id: "sandbox",
				label: "Sandbox",
				icon: Terminal,
				hint: "Planned runtime"
			}
		]
	},
	{
		label: "Knowledge & memory",
		items: [
			{
				id: "knowledge",
				label: "Knowledge vault",
				icon: BookOpen
			},
			{
				id: "vault",
				label: "Private vault",
				icon: Lock
			},
			{
				id: "memory",
				label: "Memory",
				icon: Sparkles
			},
			{
				id: "gideon",
				label: "Continuity",
				icon: History
			}
		]
	},
	{
		label: "Senses",
		items: [{
			id: "voice",
			label: "Voice",
			icon: Mic
		}, {
			id: "vision",
			label: "Vision",
			icon: Eye
		}]
	},
	{
		label: "Infrastructure",
		items: [
			{
				id: "intelligence",
				label: "Intelligence studio",
				icon: BrainCircuit
			},
			{
				id: "connections",
				label: "Connected services",
				icon: Plug
			},
			{
				id: "devices",
				label: "Devices",
				icon: MonitorSmartphone
			},
			{
				id: "trust",
				label: "Security & trust",
				icon: ShieldCheck
			},
			{
				id: "settings",
				label: "Settings",
				icon: Settings
			}
		]
	}
];
var VIEW_META = {
	home: {
		title: "Today",
		subtitle: "Your personal intelligence workspace"
	},
	chat: {
		title: "Conversation",
		subtitle: "One assistant. Context-aware, private by default."
	},
	projects: {
		title: "Projects",
		subtitle: "Keep work, context and decisions together."
	},
	tasks: {
		title: "Tasks & approvals",
		subtitle: "Review proposed actions before they are committed."
	},
	workbench: {
		title: "Workbench",
		subtitle: "Review controlled changes and their evidence."
	},
	sandbox: {
		title: "Sandbox",
		subtitle: "Isolated execution workspace — runtime setup pending."
	},
	knowledge: {
		title: "Knowledge vault",
		subtitle: "Approved documents and connected knowledge sources."
	},
	vault: {
		title: "Private vault",
		subtitle: "Private notes remain separate from shared knowledge."
	},
	memory: {
		title: "Memory",
		subtitle: "Owner-controlled memories with clear provenance."
	},
	gideon: {
		title: "Continuity",
		subtitle: "A reliable record of decisions and important events."
	},
	voice: {
		title: "Voice",
		subtitle: "Voice interaction with visible microphone and speech states."
	},
	vision: {
		title: "Vision",
		subtitle: "Owner-selected visual inputs, with transparent processing status."
	},
	intelligence: {
		title: "Intelligence studio",
		subtitle: "Models, providers, downloads and local hardware readiness."
	},
	connections: {
		title: "Connected services",
		subtitle: "Manage trusted sources and their permissions."
	},
	devices: {
		title: "Devices",
		subtitle: "Approved devices and companion connectivity."
	},
	trust: {
		title: "Security & trust",
		subtitle: "Permissions, policy boundaries and the audit trail."
	},
	settings: {
		title: "Settings",
		subtitle: "Hardware diagnostics, privacy defaults and keyboard shortcuts."
	}
};
var MODES = [
	"workspace",
	"companion",
	"compact",
	"immersive",
	"ambient"
];
function faceCaption(state, voice, source) {
	if (voice === "listening" && source === "microphone") return "Listening · microphone";
	if (voice === "listening" && source === "script") return "Listening · scripted input";
	if (voice === "speaking") return "Speaking · browser speech";
	if (voice === "processing") return "Processing";
	return state.charAt(0).toUpperCase() + state.slice(1);
}
function Face({ state, caption, size = "normal" }) {
	const live = state === "listening" || state === "speaking";
	const busy = state === "processing" || state === "researching" || state === "coding";
	const warn = state === "error" || state === "offline";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `lorin-presence flex flex-col items-center ${size === "large" ? "gap-5" : "gap-3"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `lorin-orbital ${size === "large" ? "lorin-orbital-large" : ""} ${live ? "is-live" : ""} ${busy ? "is-busy" : ""} ${warn ? "is-warning" : ""}`,
			"aria-label": `LORIN status: ${caption}`,
			role: "img",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "orbital-ring orbital-ring-one" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "orbital-ring orbital-ring-two" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "orbital-core",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "orbital-core-mark",
						children: "L"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "orbital-spark orbital-spark-one" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "orbital-spark orbital-spark-two" })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "flex items-center gap-2 text-xs font-medium tracking-wide text-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `status-dot ${live ? "status-dot-live" : warn ? "status-dot-warning" : ""}` }), caption]
		})]
	});
}
function BrandMark() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "brand-mark",
		"aria-hidden": "true",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "L" })
	});
}
function Shell({ children }) {
	const s = useLorin();
	const project = s.projects.find((p) => p.id === s.projectId) ?? s.projects[0];
	const pending = s.jobs.filter((j) => j.state === "awaiting").length;
	const iconOnly = s.mode === "companion";
	const showNav = s.mode !== "compact";
	const meta = VIEW_META[s.view];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "lorin-app-shell flex min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#main",
				className: "skip-link",
				children: "Skip to workspace"
			}),
			s.drawer && showNav && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "nav-backdrop md:hidden",
				"aria-label": "Close navigation",
				onClick: () => s.setDrawer(false)
			}),
			showNav && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: `lorin-sidebar ${s.drawer ? "is-open" : ""} ${iconOnly ? "is-collapsed" : ""}`,
				"aria-label": "Main navigation",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sidebar-top",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: iconOnly ? "hidden" : "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-[15px] font-semibold tracking-[0.16em]",
									children: "LORIN"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-[11px] text-muted",
									children: "Personal intelligence"
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "icon-button md:hidden",
							onClick: () => s.setDrawer(false),
							"aria-label": "Close navigation",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `sidebar-project ${iconOnly ? "justify-center" : ""}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "project-avatar",
								children: (project?.name ?? "L").slice(0, 1).toUpperCase()
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: iconOnly ? "hidden" : "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium",
									children: project?.name ?? "Workspace"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted",
									children: "Active workspace"
								})]
							}),
							!iconOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
								size: 14,
								className: "text-muted"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "sidebar-nav",
						children: GROUPS.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "nav-group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: `nav-group-label ${iconOnly ? "sr-only" : ""}`,
								children: group.label
							}), group.items.map((item) => {
								const Icon = item.icon;
								const active = s.view === item.id;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => s.setView(item.id),
									"aria-current": active ? "page" : void 0,
									title: iconOnly ? item.label : void 0,
									className: `nav-item ${active ? "is-active" : ""} ${iconOnly ? "is-icon-only" : ""}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
											size: 17,
											strokeWidth: 1.8
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: iconOnly ? "sr-only" : "nav-item-label",
											children: item.label
										}),
										item.id === "tasks" && pending > 0 && !iconOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "nav-count",
											children: pending
										}),
										item.hint && !iconOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "nav-hint",
											children: "Preview"
										})
									]
								}, item.id);
							})]
						}, group.label))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `sidebar-bottom ${iconOnly ? "hidden" : ""}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sidebar-status-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-medium",
										children: "Runtime status"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "status-pill status-pill-neutral",
										children: "Demo"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-[11px] leading-relaxed text-muted",
									children: "Live model, Drive and sandbox services are not connected in this build."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "sidebar-status-link",
									onClick: () => s.setView("intelligence"),
									children: ["Review infrastructure ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { size: 13 })]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between px-2 pt-3 text-[10px] text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Owner-controlled workspace" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 13 })]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "lorin-topbar",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 items-center gap-3",
							children: [showNav && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "icon-button md:hidden",
								onClick: () => s.setDrawer(true),
								"aria-label": "Open navigation",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { size: 19 })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm font-semibold",
											children: meta.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "hidden text-muted sm:inline",
											children: "/"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "hidden truncate text-xs text-muted sm:block",
											children: project?.name
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-[11px] text-muted",
									children: meta.subtitle
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "topbar-actions",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "runtime-chip hidden sm:inline-flex",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "status-dot" }), " Demo runtime"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "topbar-button",
									onClick: () => s.setCommandPaletteOpen(true),
									"aria-label": "Open command palette (Cmd+K)",
									title: "Open command palette (Cmd+K / Ctrl+K)",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { size: 14 }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "hidden sm:inline",
											children: "Commands"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
											className: "kbd-key hidden md:inline-flex",
											children: "⌘K"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "sr-only",
									htmlFor: "route",
									children: "Model routing preference"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									id: "route",
									className: "topbar-select",
									value: s.route,
									onChange: (e) => s.setRoute(e.target.value),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "auto",
											children: "Automatic routing"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "ollama",
											children: "Prefer local"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "gemini",
											children: "Request Gemini"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "local-only",
											children: "Local only"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: `topbar-button ${s.online ? "" : "is-selected"}`,
									onClick: () => s.setOnline(!s.online),
									title: "This changes the demo's simulated network state only",
									children: s.online ? "Simulate offline" : "End offline simulation"
								}),
								s.mode === "workspace" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: `icon-button hidden md:grid ${s.inspector ? "is-selected" : ""}`,
									onClick: () => s.setInspector(!s.inspector),
									"aria-pressed": s.inspector,
									"aria-label": "Toggle context inspector",
									title: "Context inspector",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelRight, { size: 17 })
								})
							]
						})]
					}),
					s.mode !== "compact" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mode-bar",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mode-switcher",
							role: "group",
							"aria-label": "Workspace presentation mode",
							children: MODES.map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => s.setMode(mode),
								"aria-pressed": s.mode === mode,
								className: `mode-option ${s.mode === mode ? "is-active" : ""}`,
								children: mode
							}, mode))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden items-center gap-2 text-[11px] text-muted lg:flex",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [pending, " pending approvals"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mode-bar-divider" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s.online ? "Online simulation" : "Offline simulation" })
							]
						})]
					}),
					s.projectId === "p2" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "system-banner system-banner-info",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 15 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "MOSAIRA is isolated. Private notes, memories and devices remain with Atlas." })]
					}),
					s.route === "gemini" && !s.geminiVerified && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "system-banner system-banner-warning",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { size: 15 }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Gemini is not live-verified in this demo. No request will be sent to a cloud provider." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => s.setView("intelligence"),
								children: "View setup"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-h-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
							id: "main",
							className: "lorin-main min-w-0 flex-1 overflow-auto",
							children
						}), s.inspector && s.mode === "workspace" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
							className: "context-inspector hidden xl:block",
							"aria-label": "Workspace context",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inspector-heading",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold",
										children: "Context"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-0.5 text-[11px] text-muted",
										children: "Current session details"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, {
										size: 16,
										className: "text-muted"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inspector-section",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "inspector-label",
											children: "Active project"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-medium",
											children: project?.name ?? "None"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-muted",
											children: project?.note
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inspector-section",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "inspector-label",
											children: "Routing preference"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-medium capitalize",
											children: s.route.replace("-", " ")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs leading-relaxed text-muted",
											children: s.lastDecision?.reason ?? "No inference request has been made in this session."
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inspector-section",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "inspector-label",
											children: "Last response source"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm",
											children: s.lastDecision?.model ?? "No model selected"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-muted",
											children: s.lastDecision?.sources?.length ? s.lastDecision.sources.join(", ") : "No sources retrieved"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inspector-section",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "inspector-label",
										children: "Specialist capabilities"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm",
										children: s.lastDecision?.specialists?.join(", ") || "Not invoked"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inspector-section",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "inspector-label",
											children: "Voice & microphone"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm",
											children: faceCaption(s.character, s.voice, s.voiceSource)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-1 text-xs text-muted",
											children: ["Microphone ", s.micGranted ? "permission granted" : "not granted"]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inspector-footnote",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { size: 14 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cloud providers remain disabled until a real connection is configured and verified." })]
								})
							]
						})]
					})
				]
			})
		]
	});
}
function CommandPalette() {
	const open = useLorin((s) => s.commandPaletteOpen);
	const setOpen = useLorin((s) => s.setCommandPaletteOpen);
	const setView = useLorin((s) => s.setView);
	const setMode = useLorin((s) => s.setMode);
	const setProject = useLorin((s) => s.setProject);
	const setRoute = useLorin((s) => s.setRoute);
	const setOnline = useLorin((s) => s.setOnline);
	const setInspector = useLorin((s) => s.setInspector);
	const propose = useLorin((s) => s.propose);
	const projects = useLorin((s) => s.projects);
	const online = useLorin((s) => s.online);
	const inspector = useLorin((s) => s.inspector);
	const [query, setQuery] = (0, import_react.useState)("");
	const [selectedIndex, setSelectedIndex] = (0, import_react.useState)(0);
	const inputRef = (0, import_react.useRef)(null);
	const commands = (0, import_react.useMemo)(() => {
		const closeAnd = (fn) => () => {
			fn();
			setOpen(false);
		};
		const nav = (view, label, detail, icon, shortcut) => ({
			id: `nav-${view}`,
			group: "Navigation",
			label,
			detail,
			shortcut,
			icon,
			keywords: `${label} ${detail} ${view} ${shortcut ?? ""}`.toLowerCase(),
			run: closeAnd(() => {
				if (useLorin.getState().mode === "ambient" || useLorin.getState().mode === "immersive" || useLorin.getState().mode === "compact") setMode("workspace");
				setView(view);
			})
		});
		return [
			nav("home", "Today / Home", "Overview, readiness and pending approvals", House, "g h"),
			nav("chat", "Conversation", "Chat with LORIN across internal capabilities", MessageSquare, "g c"),
			nav("projects", "Projects", "Switch isolated workspaces (Atlas / MOSAIRA)", FolderKanban, "g p"),
			nav("tasks", "Tasks & approvals", "Review, approve and verify scoped actions", Activity, "g t"),
			nav("workbench", "Workbench", "Inspect policy diffs and controlled changes", Cpu, "g w"),
			nav("sandbox", "Sandbox", "Isolated execution environments and policies", Terminal, "g x"),
			nav("knowledge", "Knowledge vault", "Approved project documents and indexing", BookOpen, "g k"),
			nav("vault", "Private vault", "Isolated private owner notes", Lock, "g v"),
			nav("memory", "Memory", "Approved memories with provenance", Sparkles, "g m"),
			nav("gideon", "Continuity (GIDEON)", "Chronological decisions and events", History, "g g"),
			nav("voice", "Voice", "Microphone permission and speech controls", Mic),
			nav("vision", "Vision", "User-selected local image snapshots", Eye),
			nav("intelligence", "Intelligence studio", "Models, downloads, providers and hardware", BrainCircuit, "g i"),
			nav("connections", "Connected services", "Google Drive and local folder governance", Plug, "g n"),
			nav("devices", "Devices", "Companion enrollment and revocation", MonitorSmartphone, "g d"),
			nav("trust", "Security & trust", "Capabilities, policies and audit trail", ShieldCheck, "g r"),
			nav("settings", "Settings", "Hardware status, privacy defaults and shortcuts", Settings, "g s"),
			...[
				{
					id: "workspace",
					label: "Workspace mode",
					detail: "Full navigation, tools and optional inspector"
				},
				{
					id: "companion",
					label: "Companion mode",
					detail: "Icon rail navigation with companion presence"
				},
				{
					id: "compact",
					label: "Compact mode",
					detail: "Focused conversation without sidebar"
				},
				{
					id: "immersive",
					label: "Immersive mode",
					detail: "Full-screen visual presence and voice"
				},
				{
					id: "ambient",
					label: "Ambient mode",
					detail: "Low-distraction standby surface"
				}
			].map((m) => ({
				id: `mode-${m.id}`,
				group: "Workspace mode",
				label: m.label,
				detail: m.detail,
				icon: Sparkles,
				keywords: `mode ${m.id} ${m.label} ${m.detail}`.toLowerCase(),
				run: closeAnd(() => setMode(m.id))
			})),
			...projects.map((p) => ({
				id: `project-${p.id}`,
				group: "Projects",
				label: `Switch project to ${p.name}`,
				detail: p.note,
				icon: FolderKanban,
				keywords: `project switch workspace ${p.name} ${p.note}`.toLowerCase(),
				run: closeAnd(() => setProject(p.id))
			})),
			{
				id: "act-local-only",
				group: "Quick actions",
				label: "Enforce Local-only routing",
				detail: "Block all cloud routing preferences",
				icon: Lock,
				keywords: "local only private route model security",
				run: closeAnd(() => setRoute("local-only"))
			},
			{
				id: "act-auto-route",
				group: "Quick actions",
				label: "Use Automatic model routing",
				detail: "Local-first with verified cloud routing where allowed",
				icon: BrainCircuit,
				keywords: "auto automatic route model",
				run: closeAnd(() => setRoute("auto"))
			},
			{
				id: "act-toggle-offline",
				group: "Quick actions",
				label: online ? "Simulate offline mode" : "End offline simulation",
				detail: "Toggle simulated network availability",
				icon: WifiOff,
				keywords: "offline online network simulation",
				run: closeAnd(() => setOnline(!online))
			},
			{
				id: "act-toggle-inspector",
				group: "Quick actions",
				label: inspector ? "Hide context inspector" : "Show context inspector",
				detail: "Toggle the right-hand session context panel",
				icon: PanelRight,
				keywords: "inspector sidebar panel context",
				run: closeAnd(() => setInspector(!inspector))
			},
			{
				id: "act-propose-index",
				group: "Quick actions",
				label: "Propose Knowledge Vault index",
				detail: "Queue a read-only scan of Knowledge Vault titles",
				icon: Database,
				keywords: "index knowledge vault scan propose",
				run: closeAnd(() => propose("vault.index", "Read-only scan of Knowledge Vault titles. No private vault access."))
			}
		];
	}, [
		projects,
		online,
		inspector,
		setOpen,
		setMode,
		setView,
		setProject,
		setRoute,
		setOnline,
		setInspector,
		propose
	]);
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		if (!q) return commands;
		return commands.filter((cmd) => cmd.keywords.includes(q));
	}, [commands, query]);
	(0, import_react.useEffect)(() => {
		if (open) {
			setQuery("");
			setSelectedIndex(0);
			const id = window.requestAnimationFrame(() => inputRef.current?.focus());
			return () => window.cancelAnimationFrame(id);
		}
	}, [open]);
	(0, import_react.useEffect)(() => {
		setSelectedIndex(0);
	}, [query]);
	if (!open) return null;
	const grouped = filtered.reduce((acc, item) => {
		if (!acc[item.group]) acc[item.group] = [];
		acc[item.group].push(item);
		return acc;
	}, {});
	const handleKeyDown = (event) => {
		if (event.key === "ArrowDown") {
			event.preventDefault();
			setSelectedIndex((prev) => filtered.length ? (prev + 1) % filtered.length : 0);
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			setSelectedIndex((prev) => filtered.length ? (prev - 1 + filtered.length) % filtered.length : 0);
		} else if (event.key === "Enter") {
			event.preventDefault();
			const activeItem = filtered[selectedIndex];
			if (activeItem) activeItem.run();
		} else if (event.key === "Escape") {
			event.preventDefault();
			setOpen(false);
		}
	};
	let runningIndex = -1;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "command-palette-backdrop",
		role: "presentation",
		onClick: (event) => {
			if (event.target === event.currentTarget) setOpen(false);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "command-palette-dialog",
			role: "dialog",
			"aria-modal": "true",
			"aria-label": "Command palette",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "command-palette-header",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
							size: 16,
							className: "shrink-0 text-muted",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: inputRef,
							type: "text",
							className: "command-palette-input",
							value: query,
							onChange: (event) => setQuery(event.target.value),
							onKeyDown: handleKeyDown,
							placeholder: "Jump to a workspace, switch mode, or run an action…",
							"aria-label": "Search commands",
							"aria-autocomplete": "list"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "icon-button",
							onClick: () => setOpen(false),
							"aria-label": "Close command palette",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 16 })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "command-palette-list",
					role: "listbox",
					"aria-label": "Available commands",
					children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-6 text-center text-sm text-muted",
						children: [
							"No command matches “",
							query,
							"”."
						]
					}) : Object.entries(grouped).map(([groupName, items]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "command-palette-group",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "command-palette-group-label",
							children: groupName
						}), items.map((item) => {
							runningIndex += 1;
							const idx = runningIndex;
							const Icon = item.icon;
							const active = idx === selectedIndex;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								role: "option",
								"aria-selected": active,
								className: `command-palette-item ${active ? "is-active" : ""}`,
								onMouseEnter: () => setSelectedIndex(idx),
								onClick: () => item.run(),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "command-palette-icon",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 15 })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0 flex-1 text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate text-sm font-medium",
											children: item.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block truncate text-xs text-muted",
											children: item.detail
										})]
									}),
									item.shortcut && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex shrink-0 items-center gap-1",
										"aria-hidden": "true",
										children: item.shortcut.split(" ").map((keyPart, keyIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
											className: "kbd-key",
											children: keyPart
										}, `${item.id}-${keyIdx}-${keyPart}`))
									})
								]
							}, item.id);
						})]
					}, groupName))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "command-palette-footer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
							className: "kbd-key",
							children: "↑"
						}),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
							className: "kbd-key",
							children: "↓"
						}),
						" navigate · ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
							className: "kbd-key",
							children: "↵"
						}),
						" select · ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
							className: "kbd-key",
							children: "Esc"
						}),
						" close"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Shortcuts: g then h (Home) · g then s (Settings)" })]
				})
			]
		})
	});
}
var DEFAULT_PRESSURE_THRESHOLDS = {
	warning: 75,
	critical: 90
};
/**
* Classifies a numeric utilization percentage into a semantic pressure tier.
* Values >= critical (default 90%) trigger critical alert styling;
* values >= warning (default 75%) trigger elevated/warning styling.
*/
function classifyPressure(percent, thresholds = DEFAULT_PRESSURE_THRESHOLDS) {
	if (typeof percent !== "number" || !Number.isFinite(percent)) return "unknown";
	const clamped = Math.max(0, Math.min(100, percent));
	if (clamped >= thresholds.critical) return "critical";
	if (clamped >= thresholds.warning) return "elevated";
	return "normal";
}
/**
* Safely computes a bounded 0..100 integer percentage from byte figures.
*/
function computeMemoryPressurePct(usedBytes, limitBytes) {
	if (typeof usedBytes !== "number" || typeof limitBytes !== "number" || !Number.isFinite(usedBytes) || !Number.isFinite(limitBytes) || limitBytes <= 0 || usedBytes < 0) return null;
	return Math.max(0, Math.min(100, Math.round(usedBytes / limitBytes * 100)));
}
/**
* Formats a sanitized OS family label without exposing raw User-Agent strings
* or fingerprinting identifiers.
*/
function sanitizePlatformLabel(rawPlatform) {
	if (!rawPlatform) return "Unknown";
	const lower = rawPlatform.toLowerCase();
	if (lower.includes("win")) return "Windows";
	if (lower.includes("mac")) return "macOS";
	if (lower.includes("linux")) return "Linux";
	if (lower.includes("android")) return "Android";
	if (lower.includes("iphone") || lower.includes("ipad") || lower.includes("ios")) return "iOS";
	if (lower.includes("cros")) return "ChromeOS";
	return "Unknown";
}
/**
* Formats BatteryInfo into a clear human-readable status string.
*/
function formatBatteryStatus(battery) {
	if (!battery.supported || battery.levelPct === null) return "Unavailable";
	const state = battery.charging === true ? "Charging" : battery.charging === false ? "On battery" : "Detected";
	return `${battery.levelPct}% · ${state}`;
}
function createUnavailableBattery() {
	return {
		supported: false,
		levelPct: null,
		charging: null,
		chargingTimeSec: null,
		dischargingTimeSec: null
	};
}
function readSafeMemoryMetrics() {
	const nav = typeof navigator !== "undefined" ? navigator : void 0;
	const deviceMem = nav && typeof nav.deviceMemory === "number" && Number.isFinite(nav.deviceMemory) && nav.deviceMemory > 0 ? nav.deviceMemory : "Unknown";
	const heap = (typeof performance !== "undefined" ? performance : void 0)?.memory;
	if (heap && heap.jsHeapSizeLimit > 0 && heap.usedJSHeapSize >= 0) return {
		ramTotalGb: deviceMem,
		ramUsedMb: Math.round(heap.usedJSHeapSize / 1048576),
		ramLimitMb: Math.round(heap.jsHeapSizeLimit / 1048576),
		ramUsagePct: computeMemoryPressurePct(heap.usedJSHeapSize, heap.jsHeapSizeLimit)
	};
	return {
		ramTotalGb: deviceMem,
		ramUsedMb: null,
		ramLimitMb: null,
		ramUsagePct: null
	};
}
/**
* Returns sanitized hardware information safe for frontend UI consumption.
* Uses only privacy-safe browser APIs (hardwareConcurrency, coarse deviceMemory,
* WebGPU feature presence, sanitized OS family, optional JS heap bounds).
* Avoids sensitive device identifiers and never invents companion-only telemetry.
*/
function getHardwareInfo(battery = createUnavailableBattery()) {
	const nav = typeof navigator !== "undefined" ? navigator : void 0;
	const rawCores = nav?.hardwareConcurrency;
	const cpuCores = typeof rawCores === "number" && Number.isFinite(rawCores) && rawCores > 0 ? Math.floor(rawCores) : null;
	const memory = readSafeMemoryMetrics();
	const gpuAvailable = Boolean(nav && "gpu" in nav);
	const platformRaw = nav?.userAgentData?.platform || nav?.platform;
	return {
		cpu: cpuCores ? `${cpuCores} logical cores` : "Unknown",
		cpuCores,
		cpuUsagePct: null,
		ramTotalGb: memory.ramTotalGb,
		ramFreeGb: "Unknown",
		ramUsedMb: memory.ramUsedMb,
		ramLimitMb: memory.ramLimitMb,
		ramUsagePct: memory.ramUsagePct,
		gpuAvailable,
		gpuName: gpuAvailable ? "WebGPU API detected" : "Unavailable / Unverified",
		vramGb: "Unknown",
		diskTotalGb: "Unknown",
		diskFreeGb: "Unknown",
		os: sanitizePlatformLabel(platformRaw),
		runtimeVersion: "Browser sandbox (Companion disconnected)",
		battery,
		verified: false,
		source: "browser-safe",
		lastCheckedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
/**
* Safely queries the Battery Status API if supported by the current browser.
* Never throws or exposes hardware identifiers.
*/
async function getBatteryInfo() {
	if (typeof navigator === "undefined") return createUnavailableBattery();
	const nav = navigator;
	if (typeof nav.getBattery !== "function") return createUnavailableBattery();
	try {
		const manager = await nav.getBattery();
		if (!manager || typeof manager.level !== "number" || !Number.isFinite(manager.level)) return createUnavailableBattery();
		return {
			supported: true,
			levelPct: Math.max(0, Math.min(100, Math.round(manager.level * 100))),
			charging: typeof manager.charging === "boolean" ? manager.charging : null,
			chargingTimeSec: Number.isFinite(manager.chargingTime) ? manager.chargingTime : null,
			dischargingTimeSec: Number.isFinite(manager.dischargingTime) ? manager.dischargingTime : null
		};
	} catch {
		return createUnavailableBattery();
	}
}
/**
* Safe SSR-friendly initial snapshot so server and client first paint match
* identically before client-side probe hydration runs.
*/
var INITIAL_SSR_HARDWARE_INFO = {
	cpu: "Unknown",
	cpuCores: null,
	cpuUsagePct: null,
	ramTotalGb: "Unknown",
	ramFreeGb: "Unknown",
	ramUsedMb: null,
	ramLimitMb: null,
	ramUsagePct: null,
	gpuAvailable: false,
	gpuName: "Unknown",
	vramGb: "Unknown",
	diskTotalGb: "Unknown",
	diskFreeGb: "Unknown",
	os: "Unknown",
	runtimeVersion: "Browser sandbox (Companion disconnected)",
	battery: createUnavailableBattery(),
	verified: false,
	source: "browser-safe",
	lastCheckedAt: ""
};
/**
* React hook that safely probes browser hardware capabilities and Battery Status API
* on mount and subscribes to live battery updates where supported.
*/
function useHardwareInfo() {
	const [info, setInfo] = (0, import_react.useState)(INITIAL_SSR_HARDWARE_INFO);
	const [isRefreshing, setIsRefreshing] = (0, import_react.useState)(false);
	const refresh = (0, import_react.useCallback)(async () => {
		setIsRefreshing(true);
		try {
			const battery = await getBatteryInfo();
			setInfo(getHardwareInfo(battery));
		} finally {
			setIsRefreshing(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		let batteryManager = null;
		const readFromManager = (manager) => ({
			supported: true,
			levelPct: Math.max(0, Math.min(100, Math.round(manager.level * 100))),
			charging: typeof manager.charging === "boolean" ? manager.charging : null,
			chargingTimeSec: Number.isFinite(manager.chargingTime) ? manager.chargingTime : null,
			dischargingTimeSec: Number.isFinite(manager.dischargingTime) ? manager.dischargingTime : null
		});
		const handleBatteryChange = () => {
			if (cancelled || !batteryManager) return;
			setInfo(getHardwareInfo(readFromManager(batteryManager)));
		};
		setInfo(getHardwareInfo());
		const nav = typeof navigator !== "undefined" ? navigator : void 0;
		if (nav && typeof nav.getBattery === "function") nav.getBattery().then((manager) => {
			if (cancelled || !manager) return;
			batteryManager = manager;
			setInfo(getHardwareInfo(readFromManager(manager)));
			manager.addEventListener("levelchange", handleBatteryChange);
			manager.addEventListener("chargingchange", handleBatteryChange);
		}).catch(() => {});
		return () => {
			cancelled = true;
			if (batteryManager) {
				batteryManager.removeEventListener("levelchange", handleBatteryChange);
				batteryManager.removeEventListener("chargingchange", handleBatteryChange);
			}
		};
	}, []);
	return {
		info,
		refresh,
		isRefreshing
	};
}
function pressureCellClass(level) {
	if (level === "critical") return "hardware-cell hardware-cell-critical";
	if (level === "elevated") return "hardware-cell hardware-cell-warning";
	return "hardware-cell";
}
function pressureMeterClass(level) {
	if (level === "critical") return "audio-meter audio-meter-critical";
	if (level === "elevated") return "audio-meter audio-meter-warning";
	return "audio-meter";
}
function pressureLabel(level) {
	if (level === "critical") return "Critical pressure (≥ 90%)";
	if (level === "elevated") return "High pressure (≥ 75%)";
	return null;
}
function HardwareStatus({ overrideInfo, compact = false }) {
	const { info: detectedInfo, refresh, isRefreshing } = useHardwareInfo();
	const info = overrideInfo ?? detectedInfo;
	const cpuPressure = classifyPressure(info.cpuUsagePct, DEFAULT_PRESSURE_THRESHOLDS);
	const ramPressure = classifyPressure(info.ramUsagePct, DEFAULT_PRESSURE_THRESHOLDS);
	const batteryLow = info.battery.supported && info.battery.levelPct !== null && info.battery.levelPct <= 20 && info.battery.charging !== true;
	const highAlerts = [];
	if (cpuPressure === "critical" || cpuPressure === "elevated") highAlerts.push({
		label: "CPU",
		level: cpuPressure,
		detail: `CPU load at ${info.cpuUsagePct}% (${cpuPressure === "critical" ? "exceeds 90% critical threshold" : "exceeds 75% warning threshold"}).`
	});
	if (ramPressure === "critical" || ramPressure === "elevated") highAlerts.push({
		label: "RAM",
		level: ramPressure,
		detail: `Memory pressure at ${info.ramUsagePct}% (${ramPressure === "critical" ? "exceeds 90% critical threshold" : "exceeds 75% warning threshold"}).`
	});
	const hasCritical = highAlerts.some((a) => a.level === "critical");
	const ramDisplayValue = info.ramTotalGb !== "Unknown" ? `${info.ramTotalGb} GB (approx.)` : info.ramUsedMb !== null && info.ramLimitMb !== null ? `${info.ramUsedMb} / ${info.ramLimitMb} MB heap` : "Unknown";
	const ramMeterRatio = info.ramUsagePct !== null ? Math.max(.02, Math.min(1, info.ramUsagePct / 100)) : 0;
	const cpuMeterRatio = info.cpuUsagePct !== null ? Math.max(.02, Math.min(1, info.cpuUsagePct / 100)) : 0;
	const batteryMeterRatio = info.battery.supported && info.battery.levelPct !== null ? Math.max(.02, Math.min(1, info.battery.levelPct / 100)) : 0;
	const BatteryIcon = info.battery.charging ? BatteryCharging : batteryLow ? BatteryWarning : Battery;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		"data-testid": "hardware-status",
		children: [
			highAlerts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				role: "alert",
				className: `hardware-alert-banner ${hasCritical ? "is-critical" : "is-warning"}`,
				children: [hasCritical ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, {
					size: 16,
					className: "shrink-0"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					size: 16,
					className: "shrink-0"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold",
						children: hasCritical ? "Critical resource pressure detected" : "Elevated resource pressure detected"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-xs opacity-90",
						children: highAlerts.map((item) => item.detail).join(" ")
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hardware-grid",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: pressureCellClass(cpuPressure),
						"data-pressure": cpuPressure,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, {
									size: 16,
									className: cpuPressure === "critical" ? "text-danger" : cpuPressure === "elevated" ? "text-signal" : "text-muted"
								}), cpuPressure !== "unknown" && cpuPressure !== "normal" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `hardware-status-tag ${cpuPressure === "critical" ? "is-critical" : "is-warning"}`,
									children: [cpuPressure === "critical" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { size: 11 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { size: 11 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: pressureLabel(cpuPressure) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs text-muted",
								children: "Processor (CPU)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm font-semibold tabular-nums",
								children: info.cpu
							}),
							info.cpuUsagePct !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-[11px] text-muted tabular-nums",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "CPU utilization" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [info.cpuUsagePct, "%"] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `${pressureMeterClass(cpuPressure)} mt-1.5`,
									role: "progressbar",
									"aria-label": "CPU utilization",
									"aria-valuenow": info.cpuUsagePct,
									"aria-valuemin": 0,
									"aria-valuemax": 100,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { transform: `scaleX(${cpuMeterRatio})` } })
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-[11px] text-muted",
								children: "Live CPU load requires trusted companion probe."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: pressureCellClass(ramPressure),
						"data-pressure": ramPressure,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Database, {
									size: 16,
									className: ramPressure === "critical" ? "text-danger" : ramPressure === "elevated" ? "text-signal" : "text-muted"
								}), ramPressure !== "unknown" && ramPressure !== "normal" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `hardware-status-tag ${ramPressure === "critical" ? "is-critical" : "is-warning"}`,
									children: [ramPressure === "critical" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { size: 11 }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { size: 11 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: pressureLabel(ramPressure) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs text-muted",
								children: "System memory (RAM)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm font-semibold tabular-nums",
								children: ramDisplayValue
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between text-[11px] text-muted tabular-nums",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Memory pressure" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: info.ramUsagePct !== null ? `${info.ramUsagePct}%${info.ramUsedMb !== null && info.ramLimitMb !== null ? ` · ${info.ramUsedMb}/${info.ramLimitMb} MB` : ""}` : "Unmeasured" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: `${pressureMeterClass(ramPressure)} mt-1.5`,
									role: "progressbar",
									"aria-label": "Memory pressure",
									"aria-valuenow": info.ramUsagePct ?? 0,
									"aria-valuemin": 0,
									"aria-valuemax": 100,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { transform: `scaleX(${ramMeterRatio})` } })
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hardware-cell",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Laptop, {
								size: 16,
								className: info.gpuAvailable ? "text-teal" : "text-muted"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs text-muted",
								children: "Graphics (GPU)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm font-semibold",
								children: info.gpuName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1.5 text-[11px] text-muted",
								children: ["VRAM: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums",
									children: info.vramGb === "Unknown" ? "Unknown" : `${info.vramGb} GB`
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hardware-cell",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardDrive, {
								size: 16,
								className: "text-muted"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs text-muted",
								children: "Platform & Storage"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm font-semibold",
								children: info.os
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1.5 text-[11px] text-muted",
								children: ["Free disk: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums",
									children: info.diskFreeGb === "Unknown" ? "Unknown (companion required)" : `${info.diskFreeGb} GB`
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `hardware-cell hardware-cell-full ${batteryLow ? "hardware-cell-warning" : ""}`,
						"data-testid": "hardware-battery-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BatteryIcon, {
									size: 16,
									className: batteryLow ? "text-signal" : info.battery.charging ? "text-teal" : "text-muted"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted",
									children: "Battery & Power"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-semibold tabular-nums",
								children: formatBatteryStatus(info.battery)
							})]
						}), info.battery.supported && info.battery.levelPct !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `audio-meter ${batteryLow ? "audio-meter-warning" : ""}`,
								role: "progressbar",
								"aria-label": "Battery charge level",
								"aria-valuenow": info.battery.levelPct,
								"aria-valuemin": 0,
								"aria-valuemax": 100,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { transform: `scaleX(${batteryMeterRatio})` } })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1.5 text-[11px] text-muted",
								children: batteryLow ? "Low battery charge — heavy local model inference may throttle." : info.battery.charging ? "Connected to power via browser Battery Status API." : "Running on battery power via browser Battery Status API."
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-[11px] text-muted",
							children: "Battery Status API is not exposed by this browser or device."
						})]
					})
				]
			}),
			!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 pt-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2 text-xs text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: info.verified ? "Verified companion probe" : "Sanitized browser probe · No device identifiers" }), info.lastCheckedAt && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						"aria-hidden": "true",
						children: "·"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "tabular-nums",
						suppressHydrationWarning: true,
						children: ["Checked ", new Date(info.lastCheckedAt).toLocaleTimeString()]
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "action-button action-button-secondary",
					onClick: () => void refresh(),
					disabled: isRefreshing,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
						size: 14,
						className: isRefreshing ? "animate-spin" : ""
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isRefreshing ? "Probing…" : "Refresh probe" })]
				})]
			})
		]
	});
}
var SCRIPT = "What does the Atlas brief say about verification?";
function useVoiceSession() {
	const beginListen = useLorin((s) => s.beginListen);
	const finishUtterance = useLorin((s) => s.finishUtterance);
	const interruptStore = useLorin((s) => s.interrupt);
	const noteMic = useLorin((s) => s.noteMic);
	const micGranted = useLorin((s) => s.micGranted);
	const [level, setLevel] = (0, import_react.useState)(0);
	const [draft, setDraft] = (0, import_react.useState)(SCRIPT);
	const stopMeter = (0, import_react.useRef)(null);
	const draftRef = (0, import_react.useRef)(draft);
	const ending = (0, import_react.useRef)(false);
	const heard = (0, import_react.useRef)(false);
	const quietSince = (0, import_react.useRef)(null);
	draftRef.current = draft;
	function stopAudio() {
		stopMeter.current?.();
		stopMeter.current = null;
		releaseMic();
		setLevel(0);
		heard.current = false;
		quietSince.current = null;
	}
	(0, import_react.useEffect)(() => () => {
		stopAudio();
		silence();
	}, []);
	async function grant() {
		try {
			(await captureMic()).getTracks().forEach((t) => t.stop());
			noteMic(true);
		} catch {
			noteMic(false, "Microphone permission was denied or is unavailable. You can still run a scripted line.");
		}
	}
	function finish(source) {
		if (ending.current) return;
		const text = source === "script" ? SCRIPT : draftRef.current.trim();
		if (!text) return;
		ending.current = true;
		stopAudio();
		finishUtterance(text, source);
		ending.current = false;
	}
	async function listen(source) {
		stopAudio();
		ending.current = false;
		if (source === "microphone") {
			if (!micGranted) {
				noteMic(false, "Grant the microphone before a live listen.");
				return;
			}
			try {
				const stream = await captureMic();
				beginListen("microphone");
				stopMeter.current = startMeter(stream, (n) => {
					setLevel(n);
					if (n > .12) {
						heard.current = true;
						quietSince.current = null;
						return;
					}
					if (!heard.current || !draftRef.current.trim()) return;
					const now = performance.now();
					if (quietSince.current == null) quietSince.current = now;
					else if (now - quietSince.current > 700) finish("typed");
				});
				return;
			} catch {
				noteMic(false, "The microphone closed before listening started.");
				return;
			}
		}
		beginListen("script");
	}
	function interrupt() {
		ending.current = true;
		stopAudio();
		interruptStore();
		ending.current = false;
	}
	return {
		level,
		draft,
		setDraft,
		grant,
		listen,
		finish,
		interrupt,
		script: SCRIPT
	};
}
function Badge({ children, tone = "neutral" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `lorin-badge lorin-badge-${tone}`,
		children
	});
}
function Page({ title, eyebrow, lede, actions, children, width = "wide" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: `lorin-page ${width === "reading" ? "max-w-4xl" : "max-w-screen-2xl"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "page-heading",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					eyebrow && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "page-eyebrow",
						children: eyebrow
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "page-title",
						children: title
					}),
					lede && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "page-lede",
						children: lede
					})
				]
			}), actions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "page-actions",
				children: actions
			})]
		}), children]
	});
}
function Panel({ children, className = "", title, description, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: `lorin-panel ${className}`,
		children: [(title || description || action) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel-heading",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "panel-title",
					children: title
				}), description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "panel-description",
					children: description
				})]
			}), action]
		}), children]
	});
}
function ActionButton({ children, onClick, icon: Icon, variant = "secondary", disabled = false, type = "button" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		className: `action-button action-button-${variant}`,
		type,
		onClick,
		disabled,
		children: [Icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 15 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children })]
	});
}
function MetricCard({ label, value, detail, icon: Icon, onClick }) {
	const content = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "metric-icon",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 17 })
		}), onClick && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
			size: 15,
			className: "text-muted"
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "metric-value",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm font-medium",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted",
				children: detail
			})
		]
	})] });
	return onClick ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: "metric-card text-left",
		onClick,
		children: content
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "metric-card",
		children: content
	});
}
function EmptyState({ icon: Icon, title, description, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "empty-state",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "empty-state-icon",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 21 })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-medium",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm leading-relaxed text-muted",
				children: description
			}),
			action
		]
	});
}
function HomeView() {
	const s = useLorin();
	const project = s.projects.find((p) => p.id === s.projectId);
	const pending = s.jobs.filter((j) => j.state === "awaiting");
	const verified = s.jobs.filter((j) => j.state === "verified").length;
	const knowledge = s.docs.filter((d) => d.vault === "knowledge").length;
	const turns = s.messages.filter((m) => m.role === "user").length;
	const latestEvent = s.events[0];
	const stats = [
		{
			label: "Conversations",
			n: turns,
			detail: "Your messages in this session",
			icon: MessageSquare,
			view: "chat"
		},
		{
			label: "Projects",
			n: s.projects.length,
			detail: "Available workspaces",
			icon: FolderKanban,
			view: "projects"
		},
		{
			label: "Pending approvals",
			n: pending.length,
			detail: "Actions awaiting your review",
			icon: ShieldCheck,
			view: "tasks"
		},
		{
			label: "Knowledge records",
			n: knowledge,
			detail: "Current session records",
			icon: BookOpen,
			view: "knowledge"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		title: "Your intelligence workspace",
		eyebrow: "PERSONAL INTELLIGENCE · EVERYWHERE",
		lede: `A clear view of ${project?.name ?? "your workspace"}, recent activity and the capabilities available in this build.`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "lorin-hero",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lorin-hero-copy",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									tone: "teal",
									children: "Owner-controlled"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Local-first design" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "hero-title",
								children: [
									"Think clearly.",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Get things done." })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "hero-description",
								children: "LORIN brings your conversations, projects, knowledge and approved actions into one private workspace."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-6 flex flex-wrap gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
									variant: "primary",
									icon: AudioLines,
									onClick: () => s.setView("chat"),
									children: "Start a conversation"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
									icon: FolderKanban,
									onClick: () => s.setView("projects"),
									children: "Open projects"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "lorin-hero-presence",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hero-orbit-caption",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "status-dot" }), " LORIN CORE"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Face, {
								state: s.character,
								caption: faceCaption(s.character, s.voice, s.voiceSource),
								size: "large"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "hero-presence-note",
								children: "One assistant. Specialist capabilities work behind the scenes."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hero-grid-lines",
						"aria-hidden": "true"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4",
				children: stats.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
					label: item.label,
					value: item.n,
					detail: item.detail,
					icon: item.icon,
					onClick: () => s.setView(item.view)
				}, item.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 2xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.8fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						title: "System readiness",
						description: "Live integrations are distinguished from prototype capabilities.",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "readiness-list",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadinessRow, {
									icon: Cpu,
									title: "Model inference",
									detail: "Local and cloud model calls are not connected in this demo.",
									badge: "Not connected",
									tone: "amber"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadinessRow, {
									icon: Cloud,
									title: "Google Drive",
									detail: "No Google account or Drive files are connected.",
									badge: "Not connected",
									tone: "amber"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadinessRow, {
									icon: Terminal,
									title: "Secure sandbox",
									detail: "The workbench is a proposal demo, not an isolated execution runtime.",
									badge: "Not provisioned",
									tone: "neutral"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadinessRow, {
									icon: Database,
									title: "Knowledge vault",
									detail: `${knowledge} session records are available for local demo retrieval.`,
									badge: "Session data",
									tone: "teal"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
									variant: "quiet",
									icon: BrainCircuit,
									onClick: () => s.setView("intelligence"),
									children: "Intelligence studio"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
									variant: "quiet",
									icon: Plug,
									onClick: () => s.setView("connections"),
									children: "Connected services"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
									variant: "quiet",
									icon: Terminal,
									onClick: () => s.setView("sandbox"),
									children: "Sandbox plan"
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Recent continuity",
						description: "GIDEON keeps a record of important changes in this session.",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ActionButton, {
							variant: "quiet",
							onClick: () => s.setView("gideon"),
							children: ["View history ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })]
						}),
						children: latestEvent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "activity-entry",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "activity-marker",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { size: 15 })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: latestEvent.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-muted",
										children: latestEvent.detail
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-[11px] text-muted",
										suppressHydrationWarning: true,
										children: new Date(latestEvent.at).toLocaleString()
									})
								]
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							icon: History,
							title: "No continuity records",
							description: "Verified activity will appear here."
						})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Approval queue",
						description: "Review proposed actions before they are committed.",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							tone: pending.length ? "amber" : "teal",
							children: [pending.length, " waiting"]
						}),
						children: pending.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-3",
							children: [pending.slice(0, 2).map((job) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "approval-preview",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: job.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										tone: job.risk === "critical" ? "red" : job.risk === "write" ? "amber" : "teal",
										children: job.risk
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs leading-relaxed text-muted",
									children: job.scope
								})]
							}, job.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ActionButton, {
								variant: "primary",
								onClick: () => s.setView("tasks"),
								children: ["Review approvals ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })]
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							icon: BadgeCheck,
							title: "You're all caught up",
							description: "There are no actions waiting for your approval."
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						title: "Current workspace",
						description: "Your selected project and session context.",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "project-avatar project-avatar-large",
								children: (project?.name ?? "L").slice(0, 1)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold",
										children: project?.name ?? "No project selected"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										tone: project?.status === "Active" ? "teal" : "neutral",
										children: project?.status ?? "Unavailable"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-sm leading-relaxed text-muted",
										children: project?.note
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid grid-cols-2 gap-2 border-t border-line pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: "Verified actions"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xl font-semibold tabular-nums",
								children: verified
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: "Approved memories"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xl font-semibold tabular-nums",
								children: s.memories.filter((m) => m.verified).length
							})] })]
						})]
					})]
				})]
			})
		]
	});
}
function ReadinessRow({ icon: Icon, title, detail, badge, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "readiness-row",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "readiness-icon",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 17 })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-xs leading-relaxed text-muted",
					children: detail
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				tone,
				children: badge
			})
		]
	});
}
function ChatView() {
	const s = useLorin();
	const [draft, setDraft] = (0, import_react.useState)("");
	const prompts = [
		"What does the Atlas brief say about verification?",
		"Summarize the permission model",
		"What is in the owner note?",
		"What do you remember?",
		"Research the latest public boundary"
	];
	const submit = (event) => {
		event.preventDefault();
		if (!draft.trim()) return;
		s.send(draft);
		setDraft("");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, {
		title: "Conversation",
		eyebrow: "LORIN COMPANION",
		lede: "A single conversational interface across LORIN's internal specialist capabilities.",
		width: "wide",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 2xl:grid-cols-[minmax(0,1fr)_300px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "chat-context-strip",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "status-dot" }), " Session conversation"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: s.route === "local-only" ? "Local-only preference" : `${s.route} routing preference`
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-col gap-3",
						children: s.messages.map((message) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
							className: `chat-message ${message.role === "user" ? "chat-message-user" : "chat-message-lorin"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold tracking-wide",
										children: message.role === "user" ? "YOU" : "LORIN"
									}), message.model && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										tone: message.model === "blocked" || message.model === "offline" ? "amber" : "neutral",
										children: message.model
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed",
									children: message.text
								}),
								message.sources && message.sources.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 flex flex-wrap gap-2",
									children: message.sources.map((source) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										tone: "indigo",
										children: source
									}, source))
								}),
								message.specialists && message.specialists.length > 0 && message.role === "lorin" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 text-[11px] text-muted",
									children: [
										"Internal capabilities consulted: ",
										message.specialists.join(" · "),
										". One assistant identity."
									]
								})
							]
						}, message.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "chat-composer",
						onSubmit: submit,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "ask",
								className: "sr-only",
								children: "Ask LORIN"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								id: "ask",
								rows: 2,
								value: draft,
								onChange: (event) => setDraft(event.target.value),
								placeholder: "Message LORIN…",
								className: "chat-input"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted",
									children: "Demo responses use session records. Live model inference is not connected."
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "action-button action-button-primary",
									type: "submit",
									disabled: !draft.trim(),
									children: ["Send ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: prompts.map((prompt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "prompt-chip",
							onClick: () => setDraft(prompt),
							children: prompt
						}, prompt))
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "flex flex-col gap-4",
				children: [
					s.mode === "companion" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						className: "items-center text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Face, {
							state: s.character,
							caption: faceCaption(s.character, s.voice, s.voiceSource),
							size: "large"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-muted",
							children: "LORIN's visual presence adapts to the current interaction state."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						title: "Conversation context",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "context-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Project" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: s.projects.find((p) => p.id === s.projectId)?.name })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "context-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Model route" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "capitalize",
									children: s.route.replace("-", " ")
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "context-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Last decision" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: s.lastDecision?.model ?? "None" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "context-row",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sources" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: s.lastDecision?.sources.length ?? 0 })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Scoped actions",
						description: "Proposals are reviewed in Tasks before any demo state is committed.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
									icon: Database,
									onClick: () => s.propose("vault.index", "Read-only scan of Knowledge Vault titles. No private vault access."),
									children: "Propose knowledge index"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
									icon: FileText,
									onClick: () => s.propose("knowledge.append", "Add one knowledge note about verification.", "Verification note :: A finished job is not verified until the evidence is checked."),
									children: "Propose knowledge note"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
									icon: Shield,
									onClick: () => s.propose("shell.exec", "Unrestricted shell on this device.", "rm -rf /"),
									children: "Test critical-action guard"
								})
							]
						})
					})
				]
			})]
		})
	});
}
function ProjectsView() {
	const s = useLorin();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		title: "Projects",
		eyebrow: "WORKSPACES",
		lede: "Separate project contexts keep information, decisions and permissions within their intended boundaries.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: [s.projects.length, " workspaces"] }),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 xl:grid-cols-2",
			children: s.projects.map((project) => {
				const active = project.id === s.projectId;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: `project-card ${active ? "is-active" : ""}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "project-avatar project-avatar-large",
								children: project.name.slice(0, 1)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: active ? "teal" : "neutral",
								children: active ? "Active workspace" : project.status
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl font-semibold",
								children: project.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted",
								children: project.note
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex items-center justify-between gap-3 border-t border-line pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted",
								children: project.id === "p2" ? "Public project boundary" : "Private owner workspace"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
								variant: active ? "quiet" : "primary",
								disabled: active,
								onClick: () => s.setProject(project.id),
								children: active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { size: 14 }), " Selected"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Switch workspace ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })] })
							})]
						})
					]
				}, project.id);
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			title: "Workspace separation",
			description: "Project switching changes retrieval boundaries; it does not copy private content between workspaces.",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadinessRow, {
					icon: Lock,
					title: "Atlas",
					detail: "Private owner context, vault and memory.",
					badge: "Private",
					tone: "teal"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadinessRow, {
					icon: Network,
					title: "MOSAIRA",
					detail: "Separate public research surface. No private memory or device access.",
					badge: "Isolated",
					tone: "indigo"
				})]
			})
		})]
	});
}
function TasksView() {
	const s = useLorin();
	const pending = s.jobs.filter((job) => job.state === "awaiting");
	const active = s.jobs.filter((job) => [
		"running",
		"completed",
		"proposed"
	].includes(job.state));
	const closed = s.jobs.filter((job) => [
		"verified",
		"blocked",
		"failed",
		"cancelled"
	].includes(job.state));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		title: "Tasks & approvals",
		eyebrow: "ACTION CONTROL",
		lede: "An action is not complete when it finishes. It is complete only when its evidence is reviewed and verified.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
			tone: pending.length ? "amber" : "teal",
			children: [pending.length, " awaiting review"]
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
					label: "Awaiting approval",
					value: pending.length,
					detail: "Needs your decision",
					icon: Shield
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
					label: "In progress",
					value: active.length,
					detail: "Proposed or running",
					icon: Activity
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
					label: "Closed records",
					value: closed.length,
					detail: "Verified or stopped",
					icon: FileCheck2
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-3",
			children: s.jobs.map((job) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "task-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold uppercase tracking-wider text-muted",
								children: job.capability
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-1 font-display text-lg font-semibold",
								children: job.title
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								tone: job.risk === "critical" ? "red" : job.risk === "write" ? "amber" : "teal",
								children: [job.risk, " risk"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: job.state === "verified" ? "teal" : job.state === "blocked" || job.state === "failed" ? "red" : job.state === "awaiting" ? "amber" : "neutral",
								children: job.state
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed",
						children: job.scope
					}),
					job.args && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 break-words rounded-control bg-bg px-3 py-2 font-mono text-xs text-muted",
						children: job.args
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Fingerprint: ", job.fingerprint] }),
							job.approvalId && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Approval: ", job.approvalId] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								suppressHydrationWarning: true,
								children: new Date(job.at).toLocaleString()
							})
						]
					}),
					job.evidence && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 rounded-control border border-line bg-elevated p-3 text-sm text-muted",
						children: job.evidence
					}),
					job.state === "awaiting" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
							variant: "primary",
							icon: Check,
							onClick: () => s.decide(job.id, true),
							children: "Approve scoped action"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
							icon: X,
							onClick: () => s.decide(job.id, false),
							children: "Deny"
						})]
					}),
					job.state === "running" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
							icon: X,
							onClick: () => s.cancel(job.id),
							children: "Cancel action"
						})
					}),
					job.state === "completed" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
							variant: "primary",
							icon: BadgeCheck,
							onClick: () => s.verify(job.id),
							children: "Verify evidence"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
							icon: X,
							onClick: () => s.rejectEvidence(job.id),
							children: "Reject evidence"
						})]
					})
				]
			}, job.id))
		})]
	});
}
function VaultView({ which }) {
	const s = useLorin();
	const [title, setTitle] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const [query, setQuery] = (0, import_react.useState)("");
	const docs = (0, import_react.useMemo)(() => s.docs.filter((doc) => doc.vault === which && `${doc.title} ${doc.body} ${doc.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())), [
		s.docs,
		which,
		query
	]);
	const capability = which === "private" ? "private.append" : "knowledge.append";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		title: which === "private" ? "Private vault" : "Knowledge vault",
		eyebrow: which === "private" ? "PRIVATE OWNER DATA" : "APPROVED KNOWLEDGE",
		lede: which === "private" ? "Private notes remain separate from general knowledge. Retrieval is local-only in this demo." : "A searchable collection of approved project information. Indexing does not include the private vault.",
		children: [
			which === "knowledge" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "drive-summary-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "drive-summary-icon",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { size: 20 })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: "Google Drive knowledge source"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted",
							children: "Not connected · No files imported · OAuth integration pending"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ActionButton, {
						onClick: () => s.setView("connections"),
						children: ["Manage source ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })]
					})
				]
			}),
			which === "private" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "privacy-note",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { size: 16 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Private vault boundary active in the demo. MOSAIRA cannot retrieve these records." })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Add a knowledge note",
				description: "Notes are proposals. The demo writes them only after you approve and verify the task.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "grid gap-3",
					onSubmit: (event) => {
						event.preventDefault();
						if (!title.trim() || !body.trim()) return;
						s.propose(capability, `Append “${title.trim()}” into the ${which} vault.`, `${title.trim()} :: ${body.trim()}`);
						setTitle("");
						setBody("");
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "field-label",
							htmlFor: `${which}-title`,
							children: "Title"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: `${which}-title`,
							value: title,
							onChange: (event) => setTitle(event.target.value),
							placeholder: "Give this note a clear title",
							className: "field-input"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "field-label",
							htmlFor: `${which}-body`,
							children: "Content"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							id: `${which}-body`,
							value: body,
							onChange: (event) => setBody(event.target.value),
							rows: 3,
							placeholder: "Write the information LORIN should retain…",
							className: "field-input field-textarea"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: [
									"Stored in the ",
									which === "private" ? "private" : "knowledge",
									" session vault after verification."
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
								variant: "primary",
								icon: Plus,
								type: "submit",
								disabled: !title.trim() || !body.trim(),
								children: "Propose note"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Documents",
				description: `${docs.length} record${docs.length === 1 ? "" : "s"} in this session`,
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "search-field",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { size: 14 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						"aria-label": "Search documents",
						placeholder: "Search documents",
						value: query,
						onChange: (event) => setQuery(event.target.value)
					})]
				}),
				children: docs.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "document-list",
					children: docs.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "document-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "document-icon",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { size: 17 })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-medium",
										children: doc.title
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										tone: doc.indexed ? "teal" : "neutral",
										children: doc.indexed ? "Indexed" : "Not indexed"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 line-clamp-2 text-xs leading-relaxed text-muted",
									children: doc.body
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-2 text-[10px] text-muted",
									children: [
										doc.tags.join(" · "),
										" · ",
										doc.scope
									]
								})
							]
						})]
					}, doc.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					icon: Folder,
					title: "No matching documents",
					description: "Try another search or add a new note to this vault."
				})
			}),
			which === "knowledge" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Indexing",
				description: "The current demo indexes session records only; it does not crawl Google Drive or local folders.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: "Knowledge title index"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted",
						children: "Read-only scan · Private vault excluded"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
						variant: "primary",
						icon: RefreshCw,
						onClick: () => s.propose("vault.index", "Read-only scan of Knowledge Vault titles. No private vault access."),
						children: "Propose index refresh"
					})]
				})
			})
		]
	});
}
function MemoryView() {
	const s = useLorin();
	const [text, setText] = (0, import_react.useState)("");
	const [query, setQuery] = (0, import_react.useState)("");
	const memories = s.memories.filter((memory) => memory.text.toLowerCase().includes(query.toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		title: "Memory",
		eyebrow: "OWNER-CONTROLLED CONTEXT",
		lede: "Only verified memory records are used as memory answers. Each entry retains its source and verification status.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
			tone: "teal",
			children: [s.memories.filter((memory) => memory.verified).length, " approved"]
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Propose a memory",
				description: "A new memory is saved only after its task is approved and verified.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "flex flex-col gap-3 sm:flex-row",
					onSubmit: (event) => {
						event.preventDefault();
						if (!text.trim()) return;
						s.propose("memory.store", "Store one approved memory.", text.trim());
						setText("");
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: text,
						onChange: (event) => setText(event.target.value),
						placeholder: "What should LORIN remember?",
						className: "field-input min-w-0 flex-1"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
						variant: "primary",
						icon: Plus,
						type: "submit",
						disabled: !text.trim(),
						children: "Propose memory"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Approved memories",
				description: "Edit and deletion controls are planned for the persistent memory service.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "search-field",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { size: 14 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						"aria-label": "Search memories",
						placeholder: "Search memories",
						value: query,
						onChange: (event) => setQuery(event.target.value)
					})]
				}),
				children: memories.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-col gap-2",
					children: memories.map((memory) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "memory-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm leading-relaxed",
								children: memory.text
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: memory.verified ? "teal" : "amber",
								children: memory.verified ? "Verified" : "Unverified"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-[11px] text-muted",
							children: ["Source: ", memory.source]
						})]
					}, memory.id))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					icon: Sparkles,
					title: "No matching memories",
					description: "No memory matched this search. Try a broader term."
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "privacy-note",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { size: 16 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Memory review, export and deletion must be supported by the persistent memory service before production release." })]
			})
		]
	});
}
function GideonView() {
	const s = useLorin();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, {
		title: "Continuity",
		eyebrow: "GIDEON · PROJECT HISTORY",
		lede: "GIDEON maintains the history of important events. It is an internal capability, not a second conversational assistant.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			title: "Recent events",
			description: `${s.events.length} recorded event${s.events.length === 1 ? "" : "s"} in this session`,
			children: s.events.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "timeline-list",
				children: s.events.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "timeline-item",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "timeline-dot" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: event.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("time", {
								className: "text-[11px] text-muted",
								suppressHydrationWarning: true,
								children: new Date(event.at).toLocaleString()
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm leading-relaxed text-muted",
							children: event.detail
						})]
					})]
				}, event.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
				icon: History,
				title: "No events recorded",
				description: "Verified activities will appear here."
			})
		})
	});
}
function VoiceView() {
	const s = useLorin();
	const voice = useVoiceSession();
	const listening = s.voice === "listening";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, {
		title: "Voice",
		eyebrow: "SPEECH INTERACTION",
		lede: "Microphone permission, listening, transcription and speech output are shown as separate states. This demo does not provide continuous wake-word listening.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 xl:grid-cols-[minmax(0,0.8fr)_minmax(320px,1.2fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "items-center text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Face, {
						state: s.character,
						caption: faceCaption(s.character, s.voice, s.voiceSource),
						size: "large"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Audio activity" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [Math.round(voice.level * 100), "%"] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "audio-meter mt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { style: { transform: `scaleX(${voice.level})` } })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap justify-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							tone: s.micGranted ? "teal" : "amber",
							children: ["Microphone ", s.micGranted ? "permitted" : "not granted"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: s.voice })]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: "Voice controls",
				description: "Choose exactly when LORIN listens. The microphone is never opened without your action.",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "field-label",
						htmlFor: "utterance",
						children: "Test utterance / recognized text"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						id: "utterance",
						value: voice.draft,
						onChange: (event) => voice.setDraft(event.target.value),
						className: "field-input",
						placeholder: "Type a phrase to test the voice flow"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 min-h-10 rounded-control bg-bg p-3 text-xs leading-relaxed text-muted",
						children: s.transcript || "No active voice session."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [
							!s.micGranted && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
								variant: "primary",
								icon: Mic,
								onClick: () => void voice.grant(),
								children: "Request microphone permission"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
								icon: AudioLines,
								onClick: () => void voice.listen("script"),
								disabled: listening,
								children: "Start scripted session"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
								icon: Mic,
								onClick: () => void voice.listen("microphone"),
								disabled: !s.micGranted || listening,
								children: "Listen on microphone"
							}),
							listening && s.voiceSource === "script" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
								variant: "primary",
								onClick: () => voice.finish("script"),
								children: "Use scripted phrase"
							}),
							listening && s.voiceSource === "microphone" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
								variant: "primary",
								onClick: () => voice.finish("typed"),
								children: "End utterance"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
								icon: X,
								onClick: () => voice.interrupt(),
								children: "Interrupt"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs leading-relaxed text-muted",
						children: "Speech recognition is not guaranteed by this demo. A typed phrase is not represented as audio transcription, and browser speech synthesis can fail independently."
					})
				]
			})]
		})
	});
}
function VisionView() {
	const s = useLorin();
	const [fileName, setFileName] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, {
		title: "Vision",
		eyebrow: "VISUAL INPUT",
		lede: "Choose one image for a local session record. The image is not uploaded and no vision model is called by this demo.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: "Image input",
				description: "A user-selected file is acknowledged locally; it is not analyzed automatically.",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "file-dropzone",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "file-dropzone-icon",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { size: 22 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: "Choose an image"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted",
							children: "PNG, JPG, WEBP or another browser-supported image type"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "image/*",
							className: "sr-only",
							onChange: (event) => {
								const file = event.target.files?.[0];
								if (file) {
									setFileName(file.name);
									s.snapshot(file.name);
								}
								event.target.value = "";
							}
						})
					]
				}), fileName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm text-muted",
					children: ["Selected: ", fileName]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				title: "Privacy status",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadinessRow, {
						icon: Lock,
						title: "File handling",
						detail: "Local acknowledgement only.",
						badge: "Local",
						tone: "teal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadinessRow, {
						icon: Eye,
						title: "Live camera",
						detail: "No background camera access.",
						badge: "Off",
						tone: "neutral"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadinessRow, {
						icon: BrainCircuit,
						title: "Vision inference",
						detail: "No image model is connected.",
						badge: "Unavailable",
						tone: "amber"
					})
				]
			})]
		})
	});
}
function WorkbenchView() {
	const applied = useLorin((state) => state.policyApplied);
	const propose = useLorin((state) => state.propose);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		title: "Workbench",
		eyebrow: "CONTROLLED ENGINEERING",
		lede: "Review a scoped change before proposing it. The workbench is not a general-purpose shell or a live coding sandbox.",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			title: "Policy change proposal",
			description: "The example highlights why a client-controlled boolean is weaker than a server-bound, single-use digest.",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: applied ? "teal" : "amber",
						children: applied ? "Verified in demo state" : "Not applied"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted",
						children: "Illustrative policy diff"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 xl:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs font-semibold uppercase tracking-wider text-muted",
						children: "Before"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "code-panel",
						children: POLICY_BEFORE
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs font-semibold uppercase tracking-wider text-muted",
						children: "Proposed"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "code-panel",
						children: POLICY_AFTER
					})] })]
				}),
				!applied && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 rounded-control border border-line bg-elevated p-3 font-mono text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-danger",
						children: "- trust the client flag"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-teal",
						children: "+ require a server-bound digest"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-xl text-xs leading-relaxed text-muted",
						children: "The demo records a proposal and verifies an illustrative change. It does not modify a production policy file or run a shell command."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
						variant: "primary",
						icon: Check,
						disabled: applied,
						onClick: () => propose("policy.apply", "Replace the client flag with a server-bound digest check.", "policy.ts"),
						children: applied ? "Already verified" : "Propose this change"
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
			title: "Execution boundary",
			description: "Code execution will be added through the separate, isolated Sandbox runtime.",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadinessRow, {
				icon: Terminal,
				title: "Shell execution",
				detail: "Not exposed in this demo. Critical shell capability remains denied.",
				badge: "Blocked",
				tone: "red"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ActionButton, {
					icon: Terminal,
					onClick: () => useLorin.getState().setView("sandbox"),
					children: ["View sandbox workspace ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })]
				})
			})]
		})]
	});
}
function DevicesView() {
	const s = useLorin();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Page, {
		title: "Devices",
		eyebrow: "DEVICE CONNECTIONS",
		lede: "This browser is the current session. Pairing codes and handshakes in this demo do not install or start a Windows companion.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 xl:grid-cols-2",
			children: s.devices.map((device) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "device-card",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "metric-icon",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Laptop, { size: 18 })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: device.paired && device.phase === "session" ? "teal" : device.phase === "paired" ? "amber" : "neutral",
							children: device.phase === "session" ? "Current session" : device.paired ? "Demo handshake" : "Not paired"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-4 font-display text-lg font-semibold",
						children: device.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted",
						children: [
							device.kind,
							" · ",
							device.online ? "session available" : "offline",
							" · ",
							device.phase
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted",
						children: device.note
					}),
					device.code && device.phase === "code" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 rounded-control bg-bg p-3 font-mono text-sm",
						children: ["Pairing code: ", device.code]
					}),
					device.phase !== "session" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [
							device.phase === "unpaired" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
								variant: "primary",
								onClick: () => s.issuePairCode(device.id),
								children: "Issue demo pairing code"
							}),
							device.phase === "code" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
								variant: "primary",
								onClick: () => s.confirmHandshake(device.id),
								children: "Record demo handshake"
							}),
							device.phase !== "unpaired" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
								onClick: () => s.revokeDevice(device.id),
								children: "Revoke demo pairing"
							})
						]
					})
				]
			}, device.id))
		})
	});
}
function TrustView() {
	const s = useLorin();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		title: "Security & trust",
		eyebrow: "OWNER CONTROL",
		lede: "Provider labels in this demo are routing decisions, not verified network connections. The security model is deliberately conservative.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadinessRow, {
						icon: KeyRound,
						title: "Identity",
						detail: "This is a browser session. No owner account or remote identity is configured here.",
						badge: "Demo session",
						tone: "neutral"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadinessRow, {
						icon: CloudOff,
						title: "Gemini provider",
						detail: "A provider has not been contacted. The demo verification toggle does not verify credentials.",
						badge: "Not live",
						tone: "amber"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadinessRow, {
						icon: ShieldCheck,
						title: "Critical actions",
						detail: "Critical capabilities are denied even if an approval is attempted.",
						badge: "Blocked",
						tone: "teal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadinessRow, {
						icon: FileCheck2,
						title: "Policy changes",
						detail: `Policy state: ${s.policyApplied ? "illustrative change verified in demo" : "original demo flag"}.`,
						badge: "Demo state",
						tone: "neutral"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Capability registry",
				description: "Each operation has a fixed scope and risk tier.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "registry-list",
					children: CAPABILITIES.map((capability) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "registry-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: capability.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 font-mono text-[11px] text-muted",
									children: capability.id
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted",
									children: capability.schema
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: capability.risk === "critical" ? "red" : capability.risk === "write" ? "amber" : "teal",
							children: capability.risk
						})]
					}, capability.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Internal specialist capabilities",
				description: "Specialists contribute internally. LORIN remains the only conversational identity.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-2 sm:grid-cols-2 xl:grid-cols-3",
					children: SPECIALISTS.map((specialist) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "specialist-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "specialist-avatar",
							children: specialist.name.slice(0, 1)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: specialist.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs leading-relaxed text-muted",
							children: specialist.role
						})] })]
					}, specialist.name))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Audit trail",
				description: `${s.audit.length} local audit event${s.audit.length === 1 ? "" : "s"}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "audit-list",
					children: s.audit.slice(0, 16).map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "audit-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "audit-dot" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm",
								children: entry.text
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[11px] text-muted",
								suppressHydrationWarning: true,
								children: new Date(entry.at).toLocaleString()
							})]
						})]
					}, entry.id))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 rounded-panel border border-danger/30 bg-danger/5 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "Reset local demo data"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted",
					children: "This clears the browser's persisted LORIN demo session."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
					onClick: () => s.reset(),
					icon: RefreshCw,
					children: "Reset demo"
				})]
			})
		]
	});
}
function IntelligenceView() {
	const s = useLorin();
	const [tab, setTab] = (0, import_react.useState)("models");
	const [query, setQuery] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		title: "Intelligence studio",
		eyebrow: "MODEL INFRASTRUCTURE",
		lede: "A single control surface for private models, cloud providers, model downloads and local hardware readiness.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "intelligence-hero",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: "amber",
							children: "Runtime integration pending"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 font-display text-2xl font-semibold",
							children: "Build your private intelligence layer."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 max-w-2xl text-sm leading-relaxed text-muted",
							children: "The current demo contains routing decisions, not a live inference gateway. Downloading or activating models will remain unavailable until the local runtime is installed and verified."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "intelligence-hero-icon",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrainCircuit, { size: 34 })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "studio-tabs",
				role: "tablist",
				"aria-label": "Intelligence studio sections",
				children: [
					{
						id: "models",
						label: "Model library",
						icon: BrainCircuit
					},
					{
						id: "downloads",
						label: "Downloads",
						icon: Download
					},
					{
						id: "providers",
						label: "Providers",
						icon: Network
					},
					{
						id: "hardware",
						label: "Hardware",
						icon: Cpu
					}
				].map((item) => {
					const Icon = item.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						role: "tab",
						"aria-selected": tab === item.id,
						className: `studio-tab ${tab === item.id ? "is-active" : ""}`,
						onClick: () => setTab(item.id),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 15 }), item.label]
					}, item.id);
				})
			}),
			tab === "models" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-3 md:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
								label: "Installed models",
								value: "Unknown",
								detail: "Needs local runtime inventory",
								icon: Database
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
								label: "Available disk",
								value: "Unknown",
								detail: "Needs Windows hardware probe",
								icon: HardDrive
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetricCard, {
								label: "Active inference",
								value: "None",
								detail: "No model request executed",
								icon: Activity
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Model library",
						description: "The live model catalogue will be loaded from the configured provider or registry.",
						action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "search-field",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { size: 14 }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								"aria-label": "Search model library",
								placeholder: "Search models",
								value: query,
								onChange: (event) => setQuery(event.target.value)
							})]
						}),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							icon: BrainCircuit,
							title: query ? "No live catalogue results" : "Model catalogue not connected",
							description: query ? `No result can be confirmed for “${query}” because no model registry is connected.` : "Once Ollama or the private model registry is connected, this area will show model families, context size, parameter count, quantization options, licenses, hardware requirements and verified download sources.",
							action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ActionButton, {
								variant: "primary",
								onClick: () => setTab("providers"),
								children: ["Configure a model provider ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Model profiles",
						description: "These are planned selection profiles, not downloadable model packages.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid gap-3 md:grid-cols-2 xl:grid-cols-4",
							children: [
								{
									name: "Fast local assistant",
									detail: "Small footprint · quick responses",
									icon: Zap
								},
								{
									name: "Balanced general model",
									detail: "Daily reasoning · broader context",
									icon: BrainCircuit
								},
								{
									name: "Coding specialist",
									detail: "Code generation · debugging",
									icon: CodeXml
								},
								{
									name: "Knowledge models",
									detail: "Embeddings · reranking",
									icon: Database
								}
							].map((item) => {
								const Icon = item.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "profile-card",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "metric-icon",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 17 })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-4 text-sm font-medium",
											children: item.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs text-muted",
											children: item.detail
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-3 text-[10px] uppercase tracking-wider text-muted",
											children: "Hardware check required"
										})
									]
								}, item.name);
							})
						})
					})
				]
			}),
			tab === "downloads" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "Model download manager",
					description: "The installation flow is designed but the download worker is not connected.",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "download-steps",
						children: [
							[
								"01",
								"Choose a model",
								"Select provider, model version and licence."
							],
							[
								"02",
								"Check compatibility",
								"Confirm RAM, VRAM, disk and quantization requirements."
							],
							[
								"03",
								"Choose storage",
								"Select an approved local model directory."
							],
							[
								"04",
								"Download & verify",
								"Track progress, validate checksums and inspect the manifest."
							],
							[
								"05",
								"Install & activate",
								"Register the model and run a local inference health check."
							]
						].map(([number, title, description]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "download-step",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "download-step-number",
								children: number
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs leading-relaxed text-muted",
								children: description
							})] })]
						}, number))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 rounded-control border border-line bg-bg p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, {
								size: 15,
								className: "text-signal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: "Download service unavailable"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs leading-relaxed text-muted",
							children: "No download has started. The app does not yet have a trusted local model manager or hardware probe."
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
						title: "Download queue",
						description: "Actual jobs will appear here after the model manager is connected.",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							icon: Download,
							title: "Queue is empty",
							description: "No model downloads have been submitted by this application."
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
						title: "Storage location",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadinessRow, {
							icon: HardDrive,
							title: "Model directory",
							detail: "Not detected. A Windows companion must report the configured location.",
							badge: "Unknown",
							tone: "neutral"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadinessRow, {
								icon: ShieldCheck,
								title: "Integrity verification",
								detail: "Checksum verification is required before activation.",
								badge: "Required",
								tone: "teal"
							})
						})]
					})]
				})]
			}),
			tab === "providers" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 xl:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProviderCard, {
						icon: Server,
						name: "Ollama local",
						category: "Private inference runtime",
						status: "Not connected",
						description: "The intended first local model runtime. LORIN must verify the endpoint and enumerate actual installed models before displaying ready status."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProviderCard, {
						icon: Cloud,
						name: "Google Gemini",
						category: "Approved cloud provider",
						status: "Not live-verified",
						description: "The demo contains a routing preference only. No Gemini API call or credential validation occurs here."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProviderCard, {
						icon: Network,
						name: "OpenAI-compatible endpoint",
						category: "Future external provider",
						status: "Not configured",
						description: "A future adapter can support approved remote inference endpoints through the central model gateway."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProviderCard, {
						icon: Workflow,
						name: "vLLM private server",
						category: "Future self-hosted inference",
						status: "Not configured",
						description: "For dedicated GPU infrastructure after local model serving and privacy controls are established."
					})
				]
			}),
			tab === "hardware" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(300px,0.75fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Device capability report",
					description: "Sanitized browser capabilities are reported live; companion-only specs remain Unknown until a trusted local probe is paired.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardwareStatus, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "Why hardware matters",
					description: "Model selection will be based on measured capacity.",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "principle-list",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "RAM determines how much model data can be loaded when using system memory." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "VRAM affects GPU-resident model size and inference speed." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Disk space must account for downloads, quantized variants and temporary files." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Compatibility checks must use the selected model's actual requirements." })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
							icon: Plug,
							onClick: () => s.setView("devices"),
							children: "View device connections"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
							variant: "quiet",
							icon: SlidersHorizontal,
							onClick: () => s.setView("settings"),
							children: "Open Settings"
						})]
					})]
				})]
			})
		]
	});
}
function ProviderCard({ icon: Icon, name, category, status, description }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "provider-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "metric-icon",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 19 })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					tone: "amber",
					children: status
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs uppercase tracking-wider text-muted",
				children: category
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-1 font-display text-lg font-semibold",
				children: name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed text-muted",
				children: description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 border-t border-line pt-3 text-xs text-muted",
				children: "No live connection test has been performed."
			})
		]
	});
}
function ConnectionsView() {
	const s = useLorin();
	const [driveDetails, setDriveDetails] = (0, import_react.useState)(false);
	const [localDetails, setLocalDetails] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		title: "Connected services",
		eyebrow: "KNOWLEDGE & PROVIDERS",
		lede: "Control which external sources LORIN may use. Each connection must be authenticated, scoped and independently revocable.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "connection-hero",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "connection-hero-icon",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plug, { size: 25 })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: "amber",
						children: "No external account connected"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-xl font-semibold",
						children: "Your data stays under your control."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-2xl text-sm leading-relaxed text-muted",
						children: "Connections shown here are setup surfaces. They do not imply that LORIN has access to your Google account, files or cloud services."
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 xl:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "Google Drive",
					description: "External knowledge source · OAuth integration pending",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: "amber",
						children: "Not connected"
					}),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "drive-brand-mark",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { size: 22 })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: "Connect selected Drive files"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs leading-relaxed text-muted",
									children: "The planned integration uses Google OAuth and a file picker. The initial design requests per-file access rather than unrestricted access to all Drive content."
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid grid-cols-2 gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "connection-stat",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: "Imported files"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-lg font-semibold",
									children: "0"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "connection-stat",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: "Last synchronization"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm font-semibold",
									children: "Never"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
								variant: "primary",
								icon: KeyRound,
								onClick: () => setDriveDetails((value) => !value),
								children: driveDetails ? "Hide setup details" : "Review connection setup"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
								icon: Shield,
								onClick: () => s.setView("trust"),
								children: "Security policy"
							})]
						}),
						driveDetails && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "connection-detail",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold",
									children: "Google Drive setup requirements"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
									className: "mt-3 list-decimal space-y-2 pl-5 text-xs leading-relaxed text-muted",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Configure a Google Cloud project and enable the Drive API." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Register the OAuth client and approved redirect URI on the backend." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Use Google Picker for user-selected files and the narrowest compatible scope." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Store refresh tokens encrypted on the server; never in browser storage." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Implement file metadata, content export/download, change tracking and re-indexing." }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Provide disconnect, revocation and deletion propagation." })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 rounded-control bg-bg p-3 text-xs text-muted",
									children: "Not configured in this build. No OAuth redirect has been started and no Google data has been accessed."
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "Local folders",
					description: "Windows knowledge-folder watcher · Companion integration pending",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Not connected" }),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "metric-icon",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { size: 20 })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: "LORIN_KNOWLEDGE"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs leading-relaxed text-muted",
								children: "A dedicated local folder can act as an offline-first source after a trusted Windows companion is installed and granted read-only access."
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 flex flex-wrap gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
								icon: Folder,
								onClick: () => setLocalDetails((value) => !value),
								children: localDetails ? "Hide details" : "View folder setup"
							})
						}),
						localDetails && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "connection-detail",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold",
									children: "Recommended folder structure"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
									className: "code-panel mt-2",
									children: `LORIN_KNOWLEDGE/\n  Personal/\n  Projects/\n  Research/\n  Reference/`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs text-muted",
									children: "The browser cannot watch arbitrary Windows folders. The local companion must own this permission and synchronization process."
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Connection governance",
				description: "The same permissions must apply to retrieval, indexing, exports and agent tools.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 md:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadinessRow, {
							icon: Lock,
							title: "Default access",
							detail: "Selected files, read-only",
							badge: "Restricted",
							tone: "teal"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadinessRow, {
							icon: ShieldCheck,
							title: "Write operations",
							detail: "Separate approval required",
							badge: "Approval",
							tone: "amber"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadinessRow, {
							icon: History,
							title: "Synchronization",
							detail: "Auditable change history",
							badge: "Required",
							tone: "indigo"
						})
					]
				})
			})
		]
	});
}
function SandboxView() {
	const s = useLorin();
	const [tab, setTab] = (0, import_react.useState)("overview");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		title: "Sandbox workspace",
		eyebrow: "SECURE EXECUTION",
		lede: "LORIN's future execution layer will work in isolated, temporary environments with explicit resource and network policies.",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "sandbox-hero",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: "amber",
						children: "Runtime not provisioned"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-display text-2xl font-semibold",
						children: "Work safely before changing the real world."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-2xl text-sm leading-relaxed text-muted",
						children: "This demo's Workbench can propose an illustrative policy change. It cannot execute arbitrary code, launch containers or inspect your computer."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
							variant: "primary",
							icon: CodeXml,
							onClick: () => s.setView("workbench"),
							children: "Open Workbench"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
							icon: ShieldCheck,
							onClick: () => s.setView("tasks"),
							children: "Review approvals"
						})]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sandbox-hero-icon",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Terminal, { size: 34 })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "studio-tabs",
				role: "tablist",
				"aria-label": "Sandbox sections",
				children: [
					{
						id: "overview",
						label: "Overview"
					},
					{
						id: "workspaces",
						label: "Environments"
					},
					{
						id: "policies",
						label: "Security policies"
					}
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					role: "tab",
					"aria-selected": tab === item.id,
					className: `studio-tab ${tab === item.id ? "is-active" : ""}`,
					onClick: () => setTab(item.id),
					children: item.label
				}, item.id))
			}),
			tab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
					title: "Execution activity",
					description: "Only real sandbox jobs will appear here.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						icon: Terminal,
						title: "No sandbox jobs",
						description: "No isolated execution worker is provisioned. Existing Tasks are approval demonstrations and are not sandbox executions."
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "Runtime status",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadinessRow, {
							icon: Server,
							title: "Sandbox worker",
							detail: "Container or microVM runner unavailable.",
							badge: "Offline",
							tone: "amber"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadinessRow, {
								icon: Activity,
								title: "Job streaming",
								detail: "No execution logs are being streamed.",
								badge: "Unavailable",
								tone: "neutral"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReadinessRow, {
								icon: HardDrive,
								title: "Artifact storage",
								detail: "No isolated artifact store is configured.",
								badge: "Unavailable",
								tone: "neutral"
							})
						})
					]
				})]
			}),
			tab === "workspaces" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-3 md:grid-cols-2 xl:grid-cols-4",
				children: [
					{
						name: "Code environment",
						icon: CodeXml,
						description: "Project copy, editor, terminal and test runner."
					},
					{
						name: "Data environment",
						icon: Database,
						description: "Validated files, analysis tools and exportable results."
					},
					{
						name: "Browser environment",
						icon: Cloud,
						description: "Isolated research and browser automation."
					},
					{
						name: "Application preview",
						icon: Laptop,
						description: "Build servers and preview URLs scoped to a job."
					}
				].map((item) => {
					const Icon = item.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "environment-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "metric-icon",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 18 })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-4 text-sm font-semibold",
								children: item.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs leading-relaxed text-muted",
								children: item.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Not provisioned" })
							})
						]
					}, item.name);
				})
			}),
			tab === "policies" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Execution policy baseline",
				description: "These are required controls for a future runtime. They are not yet enforced by an actual container worker.",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "policy-grid",
					children: [
						[
							"Filesystem",
							"Temporary working copy only",
							"No host home directory or broad Drive mount."
						],
						[
							"Secrets",
							"No inherited credentials",
							"Secrets are injected through scoped broker APIs."
						],
						[
							"Network",
							"Default deny",
							"Per-job allowlists for approved endpoints."
						],
						[
							"Resources",
							"Bounded CPU, RAM and disk",
							"Execution timeout and process-count caps."
						],
						[
							"Isolation",
							"Rootless container or microVM",
							"Never expose the Docker socket to an agent job."
						],
						[
							"Delivery",
							"Review and explicit approval",
							"Diffs, tests and artifacts inspected before apply."
						]
					].map(([title, value, detail]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "policy-item",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted",
								children: title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm font-semibold",
								children: value
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs leading-relaxed text-muted",
								children: detail
							})
						]
					}, title))
				})
			})
		]
	});
}
var SYNC_PROFILES = [
	{
		id: "balanced",
		label: "Balanced",
		detail: "Sync approved project context and preferences when a trusted backend is connected."
	},
	{
		id: "privacy-first",
		label: "Privacy-first",
		detail: "Keep private notes and local memories strictly on-device unless explicitly exported."
	},
	{
		id: "full-approved",
		label: "Full approved",
		detail: "Synchronize all owner-approved records across paired devices."
	},
	{
		id: "manual",
		label: "Manual only",
		detail: "Hold all remote synchronization until explicitly triggered by the owner."
	}
];
function SettingsView() {
	const s = useLorin();
	const activeSync = SYNC_PROFILES.find((item) => item.id === s.syncProfile) ?? SYNC_PROFILES[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		title: "Settings",
		eyebrow: "WORKSPACE CONFIGURATION",
		lede: "Inspect sanitized local hardware readiness, configure routing and synchronization defaults, and review global keyboard shortcuts.",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
			variant: "primary",
			icon: Command,
			onClick: () => s.setCommandPaletteOpen(true),
			children: "Command palette"
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
				title: "Hardware & system status",
				description: "Sanitized browser capabilities (CPU, RAM pressure, GPU availability and battery). Sensitive device identifiers are never collected.",
				action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					tone: "teal",
					children: "Sanitized probe"
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardwareStatus, {})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "Privacy, routing & sync defaults",
					description: "These preferences govern how LORIN routes inference and prepares synchronization boundaries.",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "field-label",
								htmlFor: "settings-route",
								children: "Default model routing"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								id: "settings-route",
								className: "field-input mt-1.5",
								value: s.route,
								onChange: (event) => s.setRoute(event.target.value),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "auto",
										children: "Automatic routing (local-first)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "ollama",
										children: "Prefer local (Ollama)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "gemini",
										children: "Request Gemini (requires verified backend)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "local-only",
										children: "Local only (block cloud routing)"
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "field-label",
									htmlFor: "settings-sync",
									children: "Synchronization profile"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									id: "settings-sync",
									className: "field-input mt-1.5",
									value: s.syncProfile,
									onChange: (event) => s.setSyncProfile(event.target.value),
									children: SYNC_PROFILES.map((profile) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: profile.id,
										children: profile.label
									}, profile.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1.5 text-xs leading-relaxed text-muted",
									children: activeSync.detail
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "field-label",
								htmlFor: "settings-project",
								children: "Active workspace boundary"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								id: "settings-project",
								className: "field-input mt-1.5",
								value: s.projectId,
								onChange: (event) => s.setProject(event.target.value),
								children: s.projects.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: project.id,
									children: [
										project.name,
										" (",
										project.id === "p2" ? "Public isolated" : "Private owner",
										")"
									]
								}, project.id))
							})] })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "privacy-note mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
							size: 15,
							className: "shrink-0"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cloud sync and remote inference remain inactive in this demo build until explicitly configured and verified." })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
					title: "Presentation & session",
					description: "Switch workspace density or reset local browser demo state.",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: MODES.map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
							variant: s.mode === mode ? "primary" : "secondary",
							onClick: () => s.setMode(mode),
							children: mode.charAt(0).toUpperCase() + mode.slice(1)
						}, mode))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
							variant: "secondary",
							onClick: () => s.setInspector(!s.inspector),
							children: s.inspector ? "Hide context inspector" : "Show context inspector"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
							icon: RefreshCw,
							onClick: () => s.reset(),
							children: "Reset local session"
						})]
					})]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
			title: "Keyboard shortcuts & command palette",
			description: "Press Cmd+K (or Ctrl+K) anywhere to search commands, or type a two-key navigation chord outside text fields.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
				icon: Keyboard,
				onClick: () => s.setCommandPaletteOpen(true),
				children: "Open palette"
			}),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "shortcut-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium",
						children: "Open Command Palette"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
							className: "kbd-key",
							children: "⌘/Ctrl"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
							className: "kbd-key",
							children: "K"
						})]
					})]
				}), NAVIGATION_SHORTCUTS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "shortcut-row text-left transition-colors hover:border-teal/40",
					onClick: () => s.setView(item.view),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate text-xs font-medium",
						children: item.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex shrink-0 items-center gap-1",
						children: item.chord.split(" ").map((keyPart, keyIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
							className: "kbd-key",
							children: keyPart
						}, `${item.chord}-${keyIdx}-${keyPart}`))
					})]
				}, item.chord))]
			})
		})]
	});
}
function MainView() {
	const mode = useLorin((state) => state.mode);
	const view = useLorin((state) => state.view);
	if (mode === "compact") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatView, {});
	if (view === "home") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeView, {});
	if (view === "chat") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChatView, {});
	if (view === "projects") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectsView, {});
	if (view === "tasks") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TasksView, {});
	if (view === "knowledge") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VaultView, { which: "knowledge" });
	if (view === "vault") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VaultView, { which: "private" });
	if (view === "memory") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MemoryView, {});
	if (view === "gideon") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GideonView, {});
	if (view === "voice") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VoiceView, {});
	if (view === "vision") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VisionView, {});
	if (view === "workbench") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WorkbenchView, {});
	if (view === "devices") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DevicesView, {});
	if (view === "trust") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrustView, {});
	if (view === "intelligence") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IntelligenceView, {});
	if (view === "connections") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConnectionsView, {});
	if (view === "sandbox") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SandboxView, {});
	if (view === "settings") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsView, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HomeView, {});
}
function Ambient() {
	const s = useLorin();
	const project = s.projects.find((p) => p.id === s.projectId);
	const pending = s.jobs.filter((job) => job.state === "awaiting").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "ambient-screen",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "ambient-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandPresence, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Face, {
					state: s.online ? s.character : "offline",
					caption: s.online ? faceCaption(s.character, s.voice, s.voiceSource) : "Offline simulation",
					size: "large"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl font-semibold",
					children: project?.name ?? "LORIN"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [pending, " approvals waiting · Demo runtime · No live model connection"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ActionButton, {
					variant: "primary",
					onClick: () => s.setMode("workspace"),
					children: ["Open workspace ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { size: 14 })]
				})
			]
		})
	});
}
function BrandPresence() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "brand-mark brand-mark-small",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "L" })
		}), "LORIN"]
	});
}
function Immersive() {
	const s = useLorin();
	const voice = useVoiceSession();
	const last = [...s.messages].reverse().find((message) => message.role === "lorin");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "immersive-screen",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "immersive-content",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandPresence, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Face, {
					state: s.character,
					caption: faceCaption(s.character, s.voice, s.voiceSource),
					size: "large"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-xl text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-semibold uppercase tracking-[0.2em] text-muted",
						children: "Latest response"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-base leading-relaxed",
						children: last?.text ?? "LORIN is ready when you are."
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "min-h-6 text-center text-sm text-muted",
					children: s.transcript
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap justify-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
							variant: "primary",
							icon: AudioLines,
							onClick: () => void voice.listen("script"),
							children: "Start scripted listen"
						}),
						s.voice === "listening" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
							onClick: () => voice.finish("script"),
							children: "Use script"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
							icon: X,
							onClick: () => voice.interrupt(),
							children: "Interrupt"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionButton, {
							onClick: () => s.setMode("workspace"),
							children: "Workspace"
						})
					]
				})
			]
		})
	});
}
function LorinApp() {
	const mode = useLorin((s) => s.mode);
	const paletteOpen = useLorin((s) => s.commandPaletteOpen);
	const setCommandPaletteOpen = useLorin((s) => s.setCommandPaletteOpen);
	(0, import_react.useEffect)(() => {
		useLorin.persist.rehydrate().then(() => {
			const s = useLorin.getState();
			const hot = s.character === "listening" || s.character === "processing" || s.character === "speaking" || s.voice !== "idle";
			const patch = {};
			if (hot) Object.assign(patch, {
				voice: "idle",
				voiceSource: "none",
				character: "idle",
				voiceSession: ""
			});
			if (s.geminiVerified) patch.geminiVerified = false;
			if (Object.keys(patch).length) useLorin.setState(patch);
		});
	}, []);
	const { pendingPrefix } = useGlobalShortcuts({
		onNavigate: (0, import_react.useCallback)((view) => {
			const state = useLorin.getState();
			if (state.mode === "ambient" || state.mode === "immersive" || state.mode === "compact") state.setMode("workspace");
			state.setView(view);
		}, []),
		onTogglePalette: (0, import_react.useCallback)(() => {
			setCommandPaletteOpen(!useLorin.getState().commandPaletteOpen);
		}, [setCommandPaletteOpen]),
		onClosePalette: (0, import_react.useCallback)(() => {
			setCommandPaletteOpen(false);
		}, [setCommandPaletteOpen]),
		paletteOpen
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		mode === "ambient" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ambient, {}) : mode === "immersive" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Immersive, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MainView, {}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandPalette, {}),
		pendingPrefix && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "chord-indicator",
			role: "status",
			"aria-live": "polite",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted",
					children: "Shortcut"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
					className: "kbd-key",
					children: pendingPrefix
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-muted",
					children: "then h / s / c / i …"
				})
			]
		})
	] });
}
var SplitComponent = LorinApp;
export { SplitComponent as component };
