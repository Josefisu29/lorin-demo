import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as PanelRight, c as Menu, d as History, f as FolderKanban, g as AudioLines, h as BookOpen, i as Shield, l as Lock, m as Cpu, o as MonitorSmartphone, p as Eye, r as Square, s as Mic, t as X, u as House } from "../_libs/lucide-react.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D_olckjP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var now = Date.now();
var seed = {
	mode: "workspace",
	view: "home",
	drawer: false,
	inspector: true,
	projectId: "p1",
	route: "auto",
	geminiVerified: false,
	online: true,
	micGranted: false,
	voice: "idle",
	transcript: "",
	character: "idle",
	messages: [{
		id: "m0",
		role: "lorin",
		text: "Workspace is local. I can search the Knowledge Vault, propose scoped actions, and I will not claim success until you verify the result.",
		model: "ollama-local",
		specialists: ["Riley"],
		at: now - 36e5
	}],
	jobs: [{
		id: "j1",
		title: "Index Knowledge Vault",
		scope: "Read-only scan of Knowledge Vault documents. No private vault access.",
		risk: "read",
		state: "awaiting",
		at: now - 72e5
	}, {
		id: "j0",
		title: "Record Atlas decision",
		scope: "Append one GIDEON event: local-first routing is the default.",
		risk: "write",
		state: "verified",
		evidence: "Event present in continuity log.",
		at: now - 864e5
	}],
	docs: [
		{
			id: "d1",
			vault: "knowledge",
			title: "Atlas project brief",
			body: "Atlas is the private intelligence shell. It routes locally first, cites vault sources, and never treats a process exit code as verification.",
			tags: ["project", "atlas"]
		},
		{
			id: "d2",
			vault: "knowledge",
			title: "Permission model",
			body: "Capabilities are server-owned. Critical operations are denied. Write actions require a single-use approval bound to the exact scope.",
			tags: ["security"]
		},
		{
			id: "d3",
			vault: "private",
			title: "Owner note",
			body: "Keep private notes off cloud models unless local-first fallback is explicitly approved. Time zone is WAT.",
			tags: ["private"]
		}
	],
	memories: [{
		id: "mem1",
		text: "Prefer local models for private notes.",
		source: "Owner note",
		verified: true
	}, {
		id: "mem2",
		text: "Active project is Atlas.",
		source: "Atlas project brief",
		verified: true
	}],
	events: [{
		id: "e1",
		title: "Routing policy set",
		detail: "Local-first is the default. Cloud only when verified and permitted.",
		at: now - 864e5
	}, {
		id: "e2",
		title: "Vault separated",
		detail: "Knowledge Vault and Private Vault stay distinct.",
		at: now - 5e7
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
		note: "Public research platform. Must not inherit private memory, credentials, or device permissions."
	}],
	devices: [{
		id: "dev1",
		name: "This browser",
		kind: "Web",
		paired: true,
		online: true
	}, {
		id: "dev2",
		name: "Windows companion",
		kind: "Desktop",
		paired: false,
		online: false
	}],
	audit: [{
		id: "a0",
		text: "Demo session opened. No live cloud calls.",
		at: now
	}],
	pendingMemory: ""
};
function uid(p) {
	return `${p}-${Math.random().toString(36).slice(2, 8)}`;
}
function answer(text, docs, route, geminiVerified, online) {
	const q = text.toLowerCase();
	const privateHit = /private|owner note|password|secret/.test(q);
	const research = /research|compare|web|latest/.test(q);
	if (!online && (route === "gemini" || route === "auto" && research && !privateHit)) return {
		text: "Cloud routing is unavailable while offline. Local vault search still works. I did not invent a cloud reply.",
		model: "offline",
		sources: [],
		specialists: ["Lena"],
		character: "offline"
	};
	if (route === "gemini" && !geminiVerified) return {
		text: "Gemini is configured but not verified. I will not send this request until you verify the provider in the command bar.",
		model: "blocked",
		sources: [],
		specialists: ["Lena"],
		character: "error"
	};
	let model = "ollama-local";
	if (route === "gemini" && geminiVerified && online && !privateHit) model = "gemini";
	if (route === "auto" && research && geminiVerified && online && !privateHit) model = "gemini";
	if (route === "local-only" || privateHit) model = "ollama-local";
	const pool = privateHit ? docs.filter((d) => d.vault === "private") : docs.filter((d) => d.vault === "knowledge");
	const hits = pool.filter((d) => q.split(/\s+/).some((w) => w.length > 3 && (d.title + d.body).toLowerCase().includes(w)));
	const used = hits.length ? hits : q.includes("atlas") || q.includes("permission") || q.includes("vault") ? pool.slice(0, 1) : [];
	if (!used.length) return {
		text: "I do not have a vault source for that. I will not fill the gap with an unsourced claim. Add a document or ask about Atlas, permissions, or the owner note.",
		model,
		sources: [],
		specialists: ["Iris"],
		character: "idle"
	};
	return {
		text: used.map((d) => `${d.title}: ${d.body}`).join(" "),
		model,
		sources: used.map((d) => d.title),
		specialists: model === "gemini" ? ["Iris", "Owen"] : ["Iris"],
		character: research ? "researching" : "idle"
	};
}
var useLorin = create()(persist((set, get) => ({
	...seed,
	setMode: (mode) => set({
		mode,
		character: mode === "immersive" ? get().character : get().character
	}),
	setView: (view) => set({
		view,
		drawer: false
	}),
	setDrawer: (drawer) => set({ drawer }),
	setInspector: (inspector) => set({ inspector }),
	setProject: (projectId) => set({ projectId }),
	setRoute: (route) => set({ route }),
	verifyGemini: () => set((s) => ({
		geminiVerified: !s.geminiVerified,
		audit: [{
			id: uid("a"),
			text: s.geminiVerified ? "Gemini marked unverified." : "Gemini health check passed in this demo.",
			at: Date.now()
		}, ...s.audit]
	})),
	setOnline: (online) => set({
		online,
		character: online ? "idle" : "offline"
	}),
	grantMic: () => set({ micGranted: true }),
	send: (text) => {
		const t = text.trim();
		if (!t) return;
		const s = get();
		const user = {
			id: uid("u"),
			role: "user",
			text: t,
			at: Date.now()
		};
		const a = answer(t, s.docs, s.route, s.geminiVerified, s.online);
		const reply = {
			id: uid("l"),
			role: "lorin",
			text: a.text,
			model: a.model,
			sources: a.sources,
			specialists: a.specialists,
			at: Date.now() + 1
		};
		const events = [...s.events];
		if (a.sources.length) events.unshift({
			id: uid("e"),
			title: "Cited reply",
			detail: a.sources.join(", "),
			at: Date.now()
		});
		set({
			messages: [
				...s.messages,
				user,
				reply
			],
			character: a.character,
			view: s.view === "home" ? "chat" : s.view,
			events,
			voice: "idle"
		});
	},
	propose: (title, scope, risk) => {
		if (risk === "critical") {
			const job = {
				id: uid("j"),
				title,
				scope,
				risk,
				state: "blocked",
				evidence: "Critical-risk operations are denied.",
				at: Date.now()
			};
			set((s) => ({
				jobs: [job, ...s.jobs],
				view: "tasks",
				audit: [{
					id: uid("a"),
					text: `Blocked critical action: ${title}`,
					at: Date.now()
				}, ...s.audit]
			}));
			return;
		}
		const state = risk === "read" ? "awaiting" : "awaiting";
		const job = {
			id: uid("j"),
			title,
			scope,
			risk,
			state,
			at: Date.now()
		};
		set((s) => ({
			jobs: [job, ...s.jobs],
			view: "tasks",
			audit: [{
				id: uid("a"),
				text: `Proposed ${risk} action: ${title}`,
				at: Date.now()
			}, ...s.audit]
		}));
	},
	decide: (id, allow) => {
		const job = get().jobs.find((j) => j.id === id);
		if (!job || job.state !== "awaiting") return;
		if (!allow) {
			set((s) => ({
				jobs: s.jobs.map((j) => j.id === id ? {
					...j,
					state: "cancelled"
				} : j),
				audit: [{
					id: uid("a"),
					text: `Denied: ${job.title}`,
					at: Date.now()
				}, ...s.audit]
			}));
			return;
		}
		set((s) => ({
			jobs: s.jobs.map((j) => j.id === id ? {
				...j,
				state: "running"
			} : j),
			character: job.title.toLowerCase().includes("code") ? "coding" : "processing",
			audit: [{
				id: uid("a"),
				text: `Approved and started: ${job.title}`,
				at: Date.now()
			}, ...s.audit]
		}));
		window.setTimeout(() => {
			const current = get().jobs.find((j) => j.id === id);
			if (!current || current.state !== "running") return;
			set((s) => ({
				jobs: s.jobs.map((j) => j.id === id ? {
					...j,
					state: "completed",
					evidence: "Executor finished. Result is not verified yet."
				} : j),
				character: "idle",
				events: [{
					id: uid("e"),
					title: "Job completed",
					detail: `${job.title} awaits verification.`,
					at: Date.now()
				}, ...s.events]
			}));
		}, 900);
	},
	verify: (id) => {
		const job = get().jobs.find((j) => j.id === id);
		if (!job || job.state !== "completed") return;
		set((s) => ({
			jobs: s.jobs.map((j) => j.id === id ? {
				...j,
				state: "verified",
				evidence: "Independent check matched the requested scope."
			} : j),
			events: [{
				id: uid("e"),
				title: "Verified",
				detail: job.title,
				at: Date.now()
			}, ...s.events],
			audit: [{
				id: uid("a"),
				text: `Verified: ${job.title}`,
				at: Date.now()
			}, ...s.audit]
		}));
	},
	cancel: (id) => set((s) => ({
		jobs: s.jobs.map((j) => j.id === id && (j.state === "awaiting" || j.state === "running") ? {
			...j,
			state: "cancelled"
		} : j),
		character: "idle"
	})),
	startVoice: () => {
		if (!get().micGranted) {
			set({
				view: "voice",
				character: "error",
				transcript: "Microphone permission is not granted."
			});
			return;
		}
		set({
			voice: "listening",
			character: "listening",
			view: "voice",
			transcript: ""
		});
		window.setTimeout(() => {
			if (get().voice !== "listening") return;
			const line = "What does the Atlas brief say about verification?";
			set({
				voice: "processing",
				character: "processing",
				transcript: line
			});
			window.setTimeout(() => {
				if (get().voice !== "processing") return;
				get().send(line);
				set({
					voice: "speaking",
					character: "speaking"
				});
				window.setTimeout(() => {
					if (get().voice === "speaking") set({
						voice: "idle",
						character: "idle"
					});
				}, 1600);
			}, 700);
		}, 1200);
	},
	interrupt: () => set({
		voice: "idle",
		character: "idle",
		transcript: get().transcript ? `${get().transcript} (interrupted)` : ""
	}),
	snapshot: () => set((s) => ({
		view: "vision",
		character: "vision",
		messages: [...s.messages, {
			id: uid("l"),
			role: "lorin",
			text: "Snapshot received. This is a single image analysis, not continuous monitoring. No live video session is open.",
			model: "ollama-local",
			specialists: ["Iris"],
			at: Date.now()
		}]
	})),
	toggleDevice: (id) => set((s) => ({
		devices: s.devices.map((d) => d.id === id ? {
			...d,
			paired: !d.paired,
			online: !d.paired
		} : d),
		audit: [{
			id: uid("a"),
			text: `Device pairing changed: ${id}`,
			at: Date.now()
		}, ...s.audit]
	})),
	setPending: (pendingMemory) => set({ pendingMemory }),
	approveMemory: () => {
		const text = get().pendingMemory.trim();
		if (!text) return;
		set((s) => ({
			memories: [{
				id: uid("mem"),
				text,
				source: "Approved in this session",
				verified: true
			}, ...s.memories],
			pendingMemory: "",
			audit: [{
				id: uid("a"),
				text: "Memory stored after approval.",
				at: Date.now()
			}, ...s.audit]
		}));
	},
	dropMemory: (id) => set((s) => ({ memories: s.memories.filter((m) => m.id !== id) })),
	reset: () => set({
		...seed,
		messages: seed.messages.map((m) => ({ ...m })),
		jobs: seed.jobs.map((j) => ({ ...j }))
	})
}), { name: "lorin-living-workspace" }));
var NAV = [
	{
		id: "home",
		label: "Today",
		icon: House
	},
	{
		id: "chat",
		label: "Conversation",
		icon: AudioLines
	},
	{
		id: "projects",
		label: "Projects",
		icon: FolderKanban
	},
	{
		id: "tasks",
		label: "Tasks",
		icon: Cpu
	},
	{
		id: "knowledge",
		label: "Knowledge",
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
		icon: Shield
	},
	{
		id: "gideon",
		label: "Continuity",
		icon: History
	},
	{
		id: "voice",
		label: "Voice",
		icon: Mic
	},
	{
		id: "vision",
		label: "Vision",
		icon: Eye
	},
	{
		id: "workbench",
		label: "Workbench",
		icon: Cpu
	},
	{
		id: "devices",
		label: "Devices",
		icon: MonitorSmartphone
	},
	{
		id: "trust",
		label: "Trust",
		icon: Shield
	}
];
var MODES = [
	"workspace",
	"companion",
	"compact",
	"immersive",
	"ambient"
];
function Face({ state }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid size-28 place-items-center rounded-full border border-line bg-elevated",
			style: { boxShadow: state === "listening" || state === "speaking" ? "0 0 0 6px color-mix(in srgb, var(--color-teal) 35%, transparent)" : void 0 },
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-14 rounded-full bg-teal" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-sm tracking-wide text-muted capitalize",
			children: state
		})]
	});
}
function LorinApp() {
	const s = useLorin();
	const [draft, setDraft] = (0, import_react.useState)("");
	const project = s.projects.find((p) => p.id === s.projectId) ?? s.projects[0];
	const last = [...s.messages].reverse().find((m) => m.role === "lorin");
	const pending = s.jobs.filter((j) => j.state === "awaiting").length;
	const shell = (body) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#main",
				className: "sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:bg-teal focus:px-3 focus:py-2 focus:text-teal-ink",
				children: "Skip to workspace"
			}),
			s.mode !== "compact" && s.mode !== "ambient" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: `${s.drawer ? "fixed inset-y-0 left-0 z-40 flex" : "hidden"} w-64 shrink-0 flex-col border-r border-line bg-surface p-3 md:flex`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center justify-between px-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-lg",
						children: "LORIN"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Personal intelligence"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "md:hidden",
						onClick: () => s.setDrawer(false),
						"aria-label": "Close navigation",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex flex-1 flex-col gap-1 overflow-auto",
					children: NAV.map((item) => {
						const Icon = item.icon;
						const on = s.view === item.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => s.setView(item.id),
							className: `flex min-h-11 items-center gap-2 rounded-control px-3 text-left text-sm ${on ? "bg-teal text-teal-ink" : "text-fg hover:bg-elevated"}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { size: 16 }),
								" ",
								item.label
							]
						}, item.id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "flex flex-wrap items-center gap-2 border-b border-line bg-surface px-3 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "grid size-11 place-items-center md:hidden",
								onClick: () => s.setDrawer(true),
								"aria-label": "Open navigation",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm",
									children: project?.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "truncate text-xs text-muted",
									children: [
										"Route ",
										s.route,
										" · Gemini ",
										s.geminiVerified ? "verified" : "configured, not verified",
										" · ",
										s.online ? "online" : "offline",
										pending ? ` · ${pending} approval${pending > 1 ? "s" : ""}` : ""
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: "min-h-11 rounded-control border border-line bg-bg px-2 text-sm",
								value: s.route,
								onChange: (e) => s.setRoute(e.target.value),
								"aria-label": "Model routing",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "auto",
										children: "Automatic"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "ollama",
										children: "Ollama local"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "gemini",
										children: "Gemini"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "local-only",
										children: "Local only"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "min-h-11 rounded-control border border-line px-3 text-xs",
								onClick: () => s.verifyGemini(),
								children: s.geminiVerified ? "Mark unverified" : "Verify Gemini"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "min-h-11 rounded-control border border-line px-3 text-xs",
								onClick: () => s.setOnline(!s.online),
								children: s.online ? "Go offline" : "Go online"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "hidden min-h-11 items-center gap-1 rounded-control border border-line px-3 text-xs md:flex",
								onClick: () => s.setInspector(!s.inspector),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelRight, { size: 14 }), " Inspector"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1 overflow-auto border-b border-line px-3 py-2",
						children: MODES.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => s.setMode(m),
							className: `min-h-10 rounded-control px-3 text-xs capitalize ${s.mode === m ? "bg-indigo text-bg" : "bg-elevated"}`,
							children: m
						}, m))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-h-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
							id: "main",
							className: "min-w-0 flex-1 overflow-auto p-4",
							children: body
						}), s.inspector && s.mode === "workspace" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
							className: "hidden w-72 shrink-0 border-l border-line bg-surface p-4 lg:block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-sm",
								children: "Context"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "mt-3 space-y-2 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted",
										children: "Project"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: project?.name })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted",
										children: "Model last used"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: last?.model ?? "none" })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted",
										children: "Sources"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: last?.sources?.join(", ") || "none retrieved" })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted",
										children: "Specialists"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: last?.specialists?.join(", ") || "none" })] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted",
										children: "Voice"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "capitalize",
										children: s.voice
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted",
										children: "Mic"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: s.micGranted ? "granted" : "not granted" })] })
								]
							})]
						})]
					})
				]
			})
		]
	});
	if (s.mode === "ambient") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-screen place-items-center bg-bg p-6 text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm rounded-panel border border-line bg-surface p-6 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Face, { state: s.online ? s.character : "offline" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 font-display",
					children: project?.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						pending,
						" pending approval",
						pending === 1 ? "" : "s",
						" · ",
						s.online ? "online" : "local only"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "mt-4 min-h-11 rounded-control bg-teal px-4 text-teal-ink",
					onClick: () => s.setMode("workspace"),
					children: "Open workspace"
				})
			]
		})
	});
	if (s.mode === "immersive") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-screen place-items-center bg-bg p-6 text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex w-full max-w-lg flex-col items-center gap-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Face, { state: s.character }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "max-w-md text-center text-sm text-muted",
					children: last?.text
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap justify-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "min-h-11 rounded-control bg-teal px-4 text-teal-ink",
							onClick: () => s.startVoice(),
							children: "Speak"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "min-h-11 rounded-control border border-line px-4",
							onClick: () => s.interrupt(),
							children: "Interrupt"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "min-h-11 rounded-control border border-line px-4",
							onClick: () => s.setMode("workspace"),
							children: "Workspace"
						})
					]
				})
			]
		})
	});
	let body = null;
	if (s.view === "home") body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-widest text-muted",
				children: "Today"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "What are we working on?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-xl text-muted",
				children: "Real records only. Counts below come from this session, not a score."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid gap-3 sm:grid-cols-2",
				children: [
					[
						"Conversations",
						String(s.messages.filter((m) => m.role === "user").length),
						"chat"
					],
					[
						"Projects",
						String(s.projects.length),
						"projects"
					],
					[
						"Approvals",
						String(pending),
						"tasks"
					],
					[
						"Knowledge",
						String(s.docs.filter((d) => d.vault === "knowledge").length),
						"knowledge"
					]
				].map(([label, n, view]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => s.setView(view),
					className: "rounded-panel border border-line bg-surface p-4 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl",
						children: n
					})]
				}, label))
			})
		]
	});
	if (s.view === "chat" || s.mode === "compact") body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto flex max-w-3xl flex-col gap-3",
		children: [
			s.messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: `rounded-panel border border-line p-4 ${m.role === "user" ? "bg-elevated" : "bg-surface"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-wide text-muted",
						children: m.role === "user" ? "You" : `LORIN · ${m.model ?? ""}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1",
						children: m.text
					}),
					m.sources && m.sources.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-indigo",
						children: ["Sources: ", m.sources.join(", ")]
					})
				]
			}, m.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "sticky bottom-0 flex gap-2 rounded-panel border border-line bg-surface p-2",
				onSubmit: (e) => {
					e.preventDefault();
					s.send(draft);
					setDraft("");
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: draft,
					onChange: (e) => setDraft(e.target.value),
					placeholder: "Ask about Atlas, permissions, or the owner note",
					className: "min-h-11 flex-1 bg-transparent px-2 outline-none"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "min-h-11 rounded-control bg-teal px-4 text-teal-ink",
					type: "submit",
					children: "Send"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "min-h-11 rounded-control border border-line px-3 text-sm",
						onClick: () => s.propose("Index Knowledge Vault", "Read titles and bodies in Knowledge Vault only.", "read"),
						children: "Propose index"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "min-h-11 rounded-control border border-line px-3 text-sm",
						onClick: () => s.propose("Edit Atlas note", "Rewrite the Atlas brief in the knowledge vault.", "write"),
						children: "Propose edit"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "min-h-11 rounded-control border border-line px-3 text-sm",
						onClick: () => s.propose("Wipe devices", "Unrestricted device control.", "critical"),
						children: "Propose critical"
					})
				]
			})
		]
	});
	if (s.view === "projects") body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto grid max-w-3xl gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl",
			children: "Projects"
		}), s.projects.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => s.setProject(p.id),
			className: `rounded-panel border p-4 text-left ${p.id === s.projectId ? "border-teal bg-surface" : "border-line bg-surface"}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display",
					children: p.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-signal",
					children: p.status
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: p.note
				})
			]
		}, p.id))]
	});
	if (s.view === "tasks") body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl",
				children: "Tasks"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Completed is not verified. Critical actions stay blocked."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-3",
				children: s.jobs.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-panel border border-line bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display",
								children: j.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-control bg-elevated px-2 py-1 text-xs uppercase",
								children: j.state
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: j.scope
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-signal",
							children: ["Risk: ", j.risk]
						}),
						j.evidence && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm",
							children: j.evidence
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [
								j.state === "awaiting" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "min-h-11 rounded-control bg-teal px-3 text-teal-ink",
									onClick: () => s.decide(j.id, true),
									children: "Approve"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "min-h-11 rounded-control border border-line px-3",
									onClick: () => s.decide(j.id, false),
									children: "Deny"
								})] }),
								j.state === "running" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: "min-h-11 rounded-control border border-line px-3",
									onClick: () => s.cancel(j.id),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, {
										size: 14,
										className: "inline"
									}), " Cancel"]
								}),
								j.state === "completed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "min-h-11 rounded-control bg-indigo px-3 text-bg",
									onClick: () => s.verify(j.id),
									children: "Verify result"
								})
							]
						})
					]
				}, j.id))
			})
		]
	});
	if (s.view === "knowledge" || s.view === "vault") {
		const vault = s.view === "vault" ? "private" : "knowledge";
		const docs = s.docs.filter((d) => d.vault === vault);
		body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl",
					children: vault === "private" ? "Private vault" : "Knowledge vault"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "These stores stay separate. Private notes force local routing."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-3",
					children: docs.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-panel border border-line bg-surface p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display",
								children: d.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm",
								children: d.body
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted",
								children: d.tags.join(" · ")
							})
						]
					}, d.id))
				})
			]
		});
	}
	if (s.view === "memory") body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl",
				children: "Memory"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-3 flex gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					s.approveMemory();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: s.pendingMemory,
					onChange: (e) => s.setPending(e.target.value),
					placeholder: "Remember only after you approve",
					className: "min-h-11 flex-1 rounded-control border border-line bg-surface px-3"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "min-h-11 rounded-control bg-teal px-3 text-teal-ink",
					type: "submit",
					children: "Approve"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-2",
				children: s.memories.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-start justify-between gap-3 rounded-panel border border-line bg-surface p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: m.text }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs text-muted",
						children: [
							m.source,
							" · ",
							m.verified ? "verified" : "unverified"
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "min-h-11 text-sm text-danger",
						onClick: () => s.dropMemory(m.id),
						children: "Remove"
					})]
				}, m.id))
			})
		]
	});
	if (s.view === "gideon") body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-3xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl",
			children: "GIDEON continuity"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "mt-4 space-y-3",
			children: s.events.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-panel border border-line bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display",
						children: e.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: e.detail
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: new Date(e.at).toLocaleString()
					})
				]
			}, e.id))
		})]
	});
	if (s.view === "voice") body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto flex max-w-lg flex-col items-center gap-4 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Face, { state: s.character }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl",
				children: "Voice"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Permission is not transcription. Speaking animation runs only while a reply is playing."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "min-h-6 text-sm",
				children: s.transcript
			}),
			!s.micGranted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "min-h-11 rounded-control bg-teal px-4 text-teal-ink",
				onClick: () => s.grantMic(),
				children: "Grant microphone"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "min-h-11 rounded-control bg-teal px-4 text-teal-ink",
					onClick: () => s.startVoice(),
					children: "Hold to demo"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "min-h-11 rounded-control border border-line px-4",
					onClick: () => s.interrupt(),
					children: "Interrupt"
				})]
			})
		]
	});
	if (s.view === "vision") body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-lg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl",
				children: "Vision"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "A snapshot is not a live video session. Nothing is watched in the background."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "mt-4 min-h-11 rounded-control bg-teal px-4 text-teal-ink",
				onClick: () => s.snapshot(),
				children: "Analyze one snapshot"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Face, { state: s.character === "vision" ? "vision" : "idle" })
		]
	});
	if (s.view === "workbench") body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl",
				children: "Engineering workbench"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "No shell is exposed. The sample below is a proposed diff, not an applied change."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
				className: "mt-4 overflow-auto rounded-panel border border-line bg-surface p-4 text-sm",
				children: `src/policy.ts
- trust client approval flags
+ require server-bound action digest`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "mt-3 min-h-11 rounded-control border border-line px-3",
				onClick: () => s.propose("Apply policy diff", "Replace client-trusted flags with a server digest check in src/policy.ts.", "write"),
				children: "Propose this change"
			})
		]
	});
	if (s.view === "devices") body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-3xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-2xl",
			children: "Devices"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-4 space-y-3",
			children: s.devices.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-center justify-between rounded-panel border border-line bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display",
					children: d.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs text-muted",
					children: [
						d.kind,
						" · ",
						d.paired ? "paired" : "not paired",
						" · ",
						d.online ? "online" : "offline"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "min-h-11 rounded-control border border-line px-3",
					onClick: () => s.toggleDevice(d.id),
					children: d.paired ? "Revoke" : "Pair"
				})]
			}, d.id))
		})]
	});
	if (s.view === "trust" || s.view === "settings") body = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-3xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl",
				children: "Trust centre"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-4 space-y-2 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-panel border border-line bg-surface p-3",
						children: "Identity: local demo owner. No account server."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-panel border border-line bg-surface p-3",
						children: [
							"Cloud: Gemini ",
							s.geminiVerified ? "verified for this demo" : "not verified",
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "rounded-panel border border-line bg-surface p-3",
						children: "Critical capabilities: denied."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-6 font-display text-lg",
				children: "Audit"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 space-y-2",
				children: s.audit.slice(0, 8).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "text-sm text-muted",
					children: [
						new Date(a.at).toLocaleTimeString(),
						" — ",
						a.text
					]
				}, a.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				className: "mt-4 min-h-11 rounded-control border border-line px-3",
				onClick: () => s.reset(),
				children: "Reset demo data"
			})
		]
	});
	return shell(body);
}
var SplitComponent = LorinApp;
//#endregion
export { SplitComponent as component };
