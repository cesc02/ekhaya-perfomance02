import React, { useState, useMemo } from "react";
import {
  LayoutDashboard, HeartPulse, Goal, ClipboardList, BarChart3,
  Users, Timer, Settings as SettingsIcon, Plus, X, ChevronRight,
  AlertTriangle, TrendingUp, TrendingDown, Minus, Activity,
  Calendar, MapPin, Shield, Star, Search
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  Radar, Cell
} from "recharts";

/* ---------------------------------------------------------
   EKHAYA FC — PERFORMANCE HUB
   Design tokens
   bg #0B0B0B · surface #141414 · surface2 #1C1C1C · border #2A2A2A
   gold #D4A843 · goldDim #B89038 · goldLight #F0D9A8 · danger #E4573D
   text #FFFFFF · muted #A0A0A0 · faint #6B6B60
--------------------------------------------------------- */

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');`;

const COLORS = {
  bg: "#0B0B0B",
  surface: "#141414",
  surface2: "#1C1C1C",
  border: "#2A2A2A",
  gold: "#D4A843",
  goldDim: "#B89038",
  goldLight: "#F0D9A8",
  white: "#FFFFFF",
  danger: "#E4573D",
  text: "#FFFFFF",
  muted: "#A0A0A0",
  faint: "#6B6B6B",
};

/* ---------------- seed data ---------------- */

const INITIAL_PLAYERS = [
  { id: 1, number: 1, name: "T. Mbewe", position: "GK", age: 24, status: "available", fitness: 92, goals: 0, assists: 0, apps: 14, minutes: 1260, yellow: 1, red: 0 },
  { id: 2, number: 4, name: "K. Phiri", position: "CB", age: 27, status: "available", fitness: 88, goals: 1, assists: 0, apps: 15, minutes: 1350, yellow: 3, red: 0 },
  { id: 3, number: 5, name: "L. Banda", position: "CB", age: 29, status: "doubtful", fitness: 74, goals: 0, assists: 1, apps: 12, minutes: 1080, yellow: 4, red: 1 },
  { id: 4, number: 2, name: "J. Chirwa", position: "RB", age: 22, status: "available", fitness: 95, goals: 0, assists: 3, apps: 15, minutes: 1300, yellow: 2, red: 0 },
  { id: 5, number: 3, name: "M. Gondwe", position: "LB", age: 25, status: "injured", fitness: 40, goals: 0, assists: 2, apps: 9, minutes: 760, yellow: 1, red: 0 },
  { id: 6, number: 6, name: "P. Nyirenda", position: "CDM", age: 26, status: "available", fitness: 90, goals: 2, assists: 4, apps: 15, minutes: 1330, yellow: 2, red: 0 },
  { id: 7, number: 8, name: "D. Kaunda", position: "CM", age: 23, status: "available", fitness: 86, goals: 4, assists: 5, apps: 14, minutes: 1190, yellow: 1, red: 0 },
  { id: 8, number: 10, name: "E. Zulu", position: "CAM", age: 24, status: "available", fitness: 91, goals: 7, assists: 6, apps: 15, minutes: 1260, yellow: 0, red: 0 },
  { id: 9, number: 7, name: "S. Tembo", position: "RW", age: 21, status: "available", fitness: 89, goals: 6, assists: 4, apps: 13, minutes: 1050, yellow: 1, red: 0 },
  { id: 10, number: 11, name: "A. Mvula", position: "LW", age: 22, status: "doubtful", fitness: 68, goals: 5, assists: 3, apps: 12, minutes: 940, yellow: 2, red: 0 },
  { id: 11, number: 9, name: "F. Chulu", position: "ST", age: 26, status: "available", fitness: 93, goals: 11, assists: 2, apps: 15, minutes: 1280, yellow: 1, red: 0 },
  { id: 12, number: 14, name: "R. Msiska", position: "ST", age: 20, status: "available", fitness: 84, goals: 3, assists: 1, apps: 8, minutes: 410, yellow: 0, red: 0 },
];

const INITIAL_INJURIES = [
  { id: 1, playerId: 5, type: "Hamstring strain", grade: "Grade 2", occurred: "2026-08-10", expectedReturn: "2026-09-05", severity: "moderate", status: "active", notes: "Sustained during away fixture, pulled up after sprint in 2nd half." },
  { id: 2, playerId: 3, type: "Ankle sprain", grade: "Grade 1", occurred: "2026-08-18", expectedReturn: "2026-08-30", severity: "minor", status: "active", notes: "Rolled ankle in training, swelling managed, light jogging started." },
  { id: 3, playerId: 10, type: "Groin tightness", grade: "Monitoring", occurred: "2026-08-19", expectedReturn: "2026-08-27", severity: "minor", status: "active", notes: "Flagged by player post-session, reduced load this week." },
];

const INITIAL_MATCHES = [
  { id: 1, opponent: "Silver Strikers", date: "2026-08-16", competition: "Super League", venue: "home", scoreFor: 3, scoreAgainst: 1, possession: 58, shots: 14, shotsOnTarget: 7, notes: "Dominant second half, Chulu brace." },
  { id: 2, opponent: "Nyasa Big Bullets", date: "2026-08-09", competition: "Super League", venue: "away", scoreFor: 1, scoreAgainst: 1, possession: 46, shots: 8, shotsOnTarget: 3, notes: "Backline missed Gondwe, disciplined draw." },
  { id: 3, opponent: "Mighty Wanderers", date: "2026-08-02", competition: "Super League", venue: "home", scoreFor: 2, scoreAgainst: 0, possession: 61, shots: 16, shotsOnTarget: 9, notes: "Clean sheet, Zulu ran the midfield." },
  { id: 4, opponent: "Civil Sporting Club", date: "2026-07-26", competition: "Cup R2", venue: "away", scoreFor: 0, scoreAgainst: 1, possession: 52, shots: 10, shotsOnTarget: 2, notes: "Cup exit, wasteful in the final third." },
  { id: 5, opponent: "Moyale Barracks", date: "2026-07-19", competition: "Super League", venue: "home", scoreFor: 4, scoreAgainst: 2, possession: 55, shots: 18, shotsOnTarget: 10, notes: "End to end, Tembo hat-trick assist chain." },
];

const INITIAL_SESSIONS = [
  { id: 1, date: "2026-08-22", type: "Recovery", focus: "Pool + mobility", duration: 45, intensity: "low", attendance: 20, squad: 24, notes: "Post-match recovery for those who played 60+ mins." },
  { id: 2, date: "2026-08-21", type: "Tactical", focus: "Pressing triggers", duration: 75, intensity: "medium", attendance: 22, squad: 24, notes: "Video review then walkthrough vs upcoming opponent shape." },
  { id: 3, date: "2026-08-20", type: "Gym", focus: "Lower-body strength", duration: 50, intensity: "high", attendance: 18, squad: 24, notes: "Squat/hinge block, injured players on modified circuit." },
  { id: 4, date: "2026-08-19", type: "Training", focus: "Small-sided possession", duration: 80, intensity: "high", attendance: 21, squad: 24, notes: "4v4+2 rondos, sharp intensity ahead of weekend." },
];

const FITNESS_TREND = [
  { week: "Wk1", avg: 81 }, { week: "Wk2", avg: 83 }, { week: "Wk3", avg: 79 },
  { week: "Wk4", avg: 85 }, { week: "Wk5", avg: 84 }, { week: "Wk6", avg: 87 }, { week: "Wk7", avg: 85 },
];

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "medical", label: "Medical", icon: HeartPulse },
  { key: "logmatch", label: "Log Match", icon: Goal },
  { key: "reports", label: "Match Reports", icon: ClipboardList },
  { key: "analysis", label: "Analysis", icon: BarChart3 },
  { key: "players", label: "Players", icon: Users },
  { key: "sessions", label: "Sessions", icon: Timer },
  { key: "settings", label: "Settings", icon: SettingsIcon },
];

const STATUS_META = {
  available: { color: COLORS.gold, label: "Available" },
  doubtful: { color: COLORS.goldLight, label: "Doubtful" },
  injured: { color: COLORS.danger, label: "Injured" },
};

/* ---------------- small building blocks ---------------- */

function Badge({ number, size = 34, color = COLORS.gold }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%",
        border: `2px solid ${color}`, color,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Oswald', sans-serif", fontWeight: 600,
        fontSize: size * 0.42, flexShrink: 0, background: "rgba(255,255,255,0.02)",
      }}
    >
      {number}
    </div>
  );
}

function StatusDot({ status }) {
  const m = STATUS_META[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: m.color, fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: m.color, boxShadow: `0 0 6px ${m.color}` }} />
      {m.label}
    </span>
  );
}

function Card({ children, style, title, eyebrow, right }) {
  return (
    <div style={{
      background: COLORS.surface, border: `1px solid ${COLORS.border}`,
      borderRadius: 10, padding: 18, ...style,
    }}>
      {(title || right) && (
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            {eyebrow && <div style={{ fontSize: 11, letterSpacing: "0.12em", color: COLORS.faint, fontFamily: "'JetBrains Mono', monospace", marginBottom: 4, textTransform: "uppercase" }}>{eyebrow}</div>}
            {title && <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 16, fontWeight: 600, color: COLORS.text, letterSpacing: "0.01em" }}>{title}</div>}
          </div>
          {right}
        </div>
      )}
      {children}
    </div>
  );
}

function ScoreDigit({ label, value, accent = COLORS.gold }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 30, fontWeight: 700,
        color: accent, textShadow: `0 0 18px ${accent}55`, lineHeight: 1,
      }}>{value}</div>
      <div style={{ fontSize: 10, color: COLORS.faint, marginTop: 6, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif" }}>{label}</div>
    </div>
  );
}

function Pill({ children, color = COLORS.gold, bg }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20,
      color, background: bg || `${color}1A`, border: `1px solid ${color}44`,
      fontFamily: "'Inter', sans-serif", whiteSpace: "nowrap",
    }}>{children}</span>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: COLORS.muted, fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>
      {label}
      {children}
    </label>
  );
}

const inputStyle = {
  background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 7,
  padding: "9px 11px", color: COLORS.text, fontSize: 13, fontFamily: "'Inter', sans-serif",
  outline: "none",
};

/* ================================================================
   MAIN APP
================================================================ */

export default function EkhayaPerformanceHub() {
  const [tab, setTab] = useState("dashboard");
  const [players] = useState(INITIAL_PLAYERS);
  const [injuries, setInjuries] = useState(INITIAL_INJURIES);
  const [matches, setMatches] = useState(INITIAL_MATCHES);
  const [sessions, setSessions] = useState(INITIAL_SESSIONS);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const playerMap = useMemo(() => Object.fromEntries(players.map(p => [p.id, p])), [players]);

  const activeInjuries = injuries.filter(i => i.status === "active");
  const available = players.filter(p => p.status === "available").length;
  const avgFitness = Math.round(players.reduce((s, p) => s + p.fitness, 0) / players.length);
  const nextMatch = { opponent: "Karonga United", date: "2026-08-30", competition: "Super League", venue: "away" };

  return (
    <div style={{
      display: "flex", height: "100%", minHeight: 640, background: COLORS.bg,
      color: COLORS.text, fontFamily: "'Inter', sans-serif", borderRadius: 12, overflow: "hidden",
      border: `1px solid ${COLORS.border}`,
    }}>
      <style>{FONT_IMPORT}{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 8px; }
        ::-webkit-scrollbar-track { background: transparent; }
        button { cursor: pointer; font-family: 'Inter', sans-serif; }
        table { border-collapse: collapse; width: 100%; }
      `}</style>

      {/* SIDEBAR */}
      <div style={{
        width: 210, flexShrink: 0, background: COLORS.surface,
        borderRight: `1px solid ${COLORS.border}`, display: "flex", flexDirection: "column",
        padding: "20px 12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 8px 20px 8px", borderBottom: `1px solid ${COLORS.border}`, marginBottom: 16 }}>
          <img
            src="https://owinna.com/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBdkFtIiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--4d6f2d26151247cb834c9b4fb0e8090980d6f0ad/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaDdCem9MWm05eWJXRjBTU0lJYW5CbkJqb0dSVlE2QzNKbGMybDZaVWtpRERNd01IZ3pNREFHT3daVSIsImV4cCI6bnVsbCwicHVyIjoidmFyaWF0aW9uIn19--03c7c270d26484af6a246d56d605625277ecb7bc/ekhaya.jpg"
            alt="Ekhaya FC"
            style={{ width: 36, height: 36, borderRadius: 9, objectFit: "cover" }}
          />
          <div>
            <div style={{ fontFamily: "'Oswald', sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: "0.02em", color: COLORS.gold }}>EKHAYA FC</div>
            <div style={{ fontSize: 10, color: COLORS.faint, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.08em" }}>PERFORMANCE HUB</div>
          </div>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: 3, flex: 1 }}>
          {NAV.map(({ key, label, icon: Icon }) => {
            const activeItem = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "9px 11px",
                  borderRadius: 7, border: "none", textAlign: "left",
                  background: activeItem ? COLORS.surface2 : "transparent",
                  color: activeItem ? COLORS.gold : COLORS.muted,
                  fontSize: 13, fontWeight: activeItem ? 600 : 500,
                  borderLeft: activeItem ? `2px solid ${COLORS.gold}` : "2px solid transparent",
                  transition: "background .15s, color .15s",
                }}
              >
                <Icon size={16} strokeWidth={2} />
                {label}
              </button>
            );
          })}
        </nav>

        <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 12, marginTop: 12 }}>
          <div style={{ fontSize: 10, color: COLORS.faint, fontFamily: "'JetBrains Mono', monospace" }}>2026/27 SEASON</div>
          <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 3 }}>Malawi Super League</div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
        {tab === "dashboard" && (
          <Dashboard players={players} injuries={activeInjuries} matches={matches}
            available={available} avgFitness={avgFitness} nextMatch={nextMatch} playerMap={playerMap} />
        )}
        {tab === "medical" && (
          <Medical players={players} injuries={injuries} setInjuries={setInjuries} playerMap={playerMap} />
        )}
        {tab === "logmatch" && (
          <LogMatch players={players} setMatches={setMatches} onLogged={() => setTab("reports")} />
        )}
        {tab === "reports" && (
          <MatchReports matches={matches} selectedMatch={selectedMatch} setSelectedMatch={setSelectedMatch} />
        )}
        {tab === "analysis" && (
          <Analysis players={players} matches={matches} />
        )}
        {tab === "players" && (
          <Players players={players} injuries={injuries} />
        )}
        {tab === "sessions" && (
          <Sessions sessions={sessions} setSessions={setSessions} />
        )}
        {tab === "settings" && <SettingsPanel />}
      </div>
    </div>
  );
}

/* ================================================================
   DASHBOARD
================================================================ */

function Dashboard({ players, injuries, matches, available, avgFitness, nextMatch, playerMap }) {
  const lastMatch = matches[0];
  const form = matches.slice(0, 5).map(m => m.scoreFor > m.scoreAgainst ? "W" : m.scoreFor === m.scoreAgainst ? "D" : "L");
  const formColor = { W: COLORS.gold, D: COLORS.goldLight, L: COLORS.danger };
  const topScorer = [...players].sort((a, b) => b.goals - a.goals)[0];

  return (
    <div>
      <Header eyebrow="Overview" title="Squad Dashboard" subtitle={`Matchday snapshot · ${available}/${players.length} players available`} />

      {/* scoreboard strip */}
      <Card style={{ marginBottom: 18, background: `linear-gradient(160deg, ${COLORS.surface}, ${COLORS.surface2})` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div style={{ display: "flex", gap: 34 }}>
            <ScoreDigit label="Available" value={available} />
            <ScoreDigit label="Doubtful" value={players.filter(p => p.status === "doubtful").length} accent={COLORS.goldLight} />
            <ScoreDigit label="Injured" value={players.filter(p => p.status === "injured").length} accent={COLORS.danger} />
            <ScoreDigit label="Avg Fitness" value={`${avgFitness}%`} />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {form.map((r, i) => (
              <div key={i} style={{
                width: 26, height: 26, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
                color: COLORS.bg, background: formColor[r],
              }}>{r}</div>
            ))}
          </div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 18, marginBottom: 18 }}>
        <Card eyebrow="Next Fixture" title={`vs ${nextMatch.opponent}`} right={<Pill>{nextMatch.venue === "home" ? "HOME" : "AWAY"}</Pill>}>
          <div style={{ display: "flex", gap: 22, color: COLORS.muted, fontSize: 13 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><Calendar size={14} /> {nextMatch.date}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6 }}><MapPin size={14} /> {nextMatch.competition}</span>
          </div>
          {lastMatch && (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${COLORS.border}`, fontSize: 12, color: COLORS.faint }}>
              Last result: <span style={{ color: COLORS.text }}>Ekhaya {lastMatch.scoreFor} – {lastMatch.scoreAgainst} {lastMatch.opponent}</span>
            </div>
          )}
        </Card>

        <Card eyebrow="Top Scorer" title={topScorer.name} right={<Badge number={topScorer.number} />}>
          <div style={{ display: "flex", gap: 20 }}>
            <div><div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22, color: COLORS.gold }}>{topScorer.goals}</div><div style={{ fontSize: 10, color: COLORS.faint }}>GOALS</div></div>
            <div><div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22 }}>{topScorer.assists}</div><div style={{ fontSize: 10, color: COLORS.faint }}>ASSISTS</div></div>
            <div><div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22 }}>{topScorer.apps}</div><div style={{ fontSize: 10, color: COLORS.faint }}>APPS</div></div>
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <Card eyebrow="Medical" title="Active Injuries" right={<AlertTriangle size={16} color={COLORS.goldLight} />}>
          {injuries.length === 0 ? (
            <EmptyNote text="No active injuries — full squad fit." />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {injuries.map(inj => {
                const p = playerMap[inj.playerId];
                return (
                  <div key={inj.id} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
                    <Badge number={p.number} size={28} color={COLORS.danger} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: COLORS.faint }}>{inj.type} · back {inj.expectedReturn}</div>
                    </div>
                    <Pill color={inj.severity === "moderate" ? COLORS.goldLight : COLORS.danger}>{inj.severity}</Pill>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        <Card eyebrow="Recent Form" title="Last 5 Matches">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {matches.slice(0, 5).map(m => (
              <div key={m.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: COLORS.muted }}>
                <span>{m.date} · {m.opponent}</span>
                <span style={{ color: COLORS.text, fontFamily: "'JetBrains Mono', monospace" }}>{m.scoreFor}-{m.scoreAgainst}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ================================================================
   MEDICAL
================================================================ */

function Medical({ players, injuries, setInjuries, playerMap }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ playerId: players[0].id, type: "", grade: "Grade 1", occurred: "", expectedReturn: "", severity: "minor", notes: "" });

  const active = injuries.filter(i => i.status === "active");
  const resolved = injuries.filter(i => i.status === "recovered");

  function submit(e) {
    e.preventDefault();
    if (!form.type || !form.occurred) return;
    setInjuries(list => [{ id: Date.now(), ...form, playerId: Number(form.playerId), status: "active" }, ...list]);
    setShowForm(false);
    setForm({ playerId: players[0].id, type: "", grade: "Grade 1", occurred: "", expectedReturn: "", severity: "minor", notes: "" });
  }

  function markRecovered(id) {
    setInjuries(list => list.map(i => i.id === id ? { ...i, status: "recovered" } : i));
  }

  return (
    <div>
      <Header eyebrow="Medical" title="Injury & Health Tracker" subtitle={`${active.length} active case${active.length === 1 ? "" : "s"} on the treatment table`}
        action={<ActionButton onClick={() => setShowForm(s => !s)} label={showForm ? "Close" : "Log Injury"} icon={showForm ? X : Plus} />} />

      {showForm && (
        <Card style={{ marginBottom: 18 }} title="New Injury Record">
          <form onSubmit={submit} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            <Field label="Player">
              <select style={inputStyle} value={form.playerId} onChange={e => setForm({ ...form, playerId: e.target.value })}>
                {players.map(p => <option key={p.id} value={p.id}>#{p.number} {p.name}</option>)}
              </select>
            </Field>
            <Field label="Injury type">
              <input style={inputStyle} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} placeholder="e.g. Hamstring strain" />
            </Field>
            <Field label="Grade / note">
              <input style={inputStyle} value={form.grade} onChange={e => setForm({ ...form, grade: e.target.value })} />
            </Field>
            <Field label="Date occurred">
              <input type="date" style={inputStyle} value={form.occurred} onChange={e => setForm({ ...form, occurred: e.target.value })} />
            </Field>
            <Field label="Expected return">
              <input type="date" style={inputStyle} value={form.expectedReturn} onChange={e => setForm({ ...form, expectedReturn: e.target.value })} />
            </Field>
            <Field label="Severity">
              <select style={inputStyle} value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })}>
                <option value="minor">Minor</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
            </Field>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Notes">
                <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </Field>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <ActionButton type="submit" label="Save Record" icon={Plus} />
            </div>
          </form>
        </Card>
      )}

      <Card title="Active Cases" eyebrow="Treatment table" style={{ marginBottom: 18 }}>
        {active.length === 0 ? <EmptyNote text="No active injuries." /> : (
          <table>
            <thead>
              <tr style={{ textAlign: "left", fontSize: 11, color: COLORS.faint, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <th style={th}>Player</th><th style={th}>Injury</th><th style={th}>Occurred</th><th style={th}>Expected Return</th><th style={th}>Severity</th><th style={th}></th>
              </tr>
            </thead>
            <tbody>
              {active.map(inj => {
                const p = playerMap[inj.playerId];
                return (
                  <tr key={inj.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                    <td style={td}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><Badge number={p.number} size={26} color={COLORS.danger} />{p.name}</div></td>
                    <td style={td}>{inj.type} <span style={{ color: COLORS.faint }}>({inj.grade})</span></td>
                    <td style={td}>{inj.occurred}</td>
                    <td style={td}>{inj.expectedReturn}</td>
                    <td style={td}><Pill color={inj.severity === "severe" ? COLORS.danger : inj.severity === "moderate" ? COLORS.goldLight : COLORS.gold}>{inj.severity}</Pill></td>
                    <td style={td}><button onClick={() => markRecovered(inj.id)} style={linkBtn}>Mark recovered</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>

      <Card title="Squad Fitness" eyebrow="Load status">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {players.map(p => (
            <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 130, fontSize: 12.5, display: "flex", alignItems: "center", gap: 8 }}>
                <Badge number={p.number} size={24} color={STATUS_META[p.status].color} />{p.name}
              </div>
              <div style={{ flex: 1, height: 6, background: COLORS.surface2, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ width: `${p.fitness}%`, height: "100%", background: STATUS_META[p.status].color }} />
              </div>
              <div style={{ width: 38, fontSize: 12, fontFamily: "'JetBrains Mono', monospace", textAlign: "right" }}>{p.fitness}%</div>
              <div style={{ width: 90 }}><StatusDot status={p.status} /></div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ================================================================
   LOG MATCH
================================================================ */

function LogMatch({ players, setMatches, onLogged }) {
  const [form, setForm] = useState({
    opponent: "", date: "", competition: "Super League", venue: "home",
    scoreFor: 0, scoreAgainst: 0, possession: 50, shots: 0, shotsOnTarget: 0, notes: "",
  });
  const [saved, setSaved] = useState(false);

  function update(field, value) { setForm({ ...form, [field]: value }); }

  function submit(e) {
    e.preventDefault();
    if (!form.opponent || !form.date) return;
    setMatches(list => [{ id: Date.now(), ...form, scoreFor: Number(form.scoreFor), scoreAgainst: Number(form.scoreAgainst), possession: Number(form.possession), shots: Number(form.shots), shotsOnTarget: Number(form.shotsOnTarget) }, ...list]);
    setSaved(true);
    setTimeout(() => { setSaved(false); onLogged(); }, 700);
  }

  return (
    <div>
      <Header eyebrow="Matchday" title="Log Match" subtitle="Record the result and key match data" />
      <Card style={{ maxWidth: 720 }}>
        <form onSubmit={submit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Opponent">
            <input style={inputStyle} value={form.opponent} onChange={e => update("opponent", e.target.value)} placeholder="e.g. Karonga United" />
          </Field>
          <Field label="Date">
            <input type="date" style={inputStyle} value={form.date} onChange={e => update("date", e.target.value)} />
          </Field>
          <Field label="Competition">
            <select style={inputStyle} value={form.competition} onChange={e => update("competition", e.target.value)}>
              <option>Super League</option><option>Cup R1</option><option>Cup R2</option><option>Friendly</option>
            </select>
          </Field>
          <Field label="Venue">
            <select style={inputStyle} value={form.venue} onChange={e => update("venue", e.target.value)}>
              <option value="home">Home</option><option value="away">Away</option>
            </select>
          </Field>
          <Field label="Ekhaya FC score">
            <input type="number" min="0" style={inputStyle} value={form.scoreFor} onChange={e => update("scoreFor", e.target.value)} />
          </Field>
          <Field label="Opponent score">
            <input type="number" min="0" style={inputStyle} value={form.scoreAgainst} onChange={e => update("scoreAgainst", e.target.value)} />
          </Field>
          <Field label="Possession %">
            <input type="number" min="0" max="100" style={inputStyle} value={form.possession} onChange={e => update("possession", e.target.value)} />
          </Field>
          <Field label="Shots (on target)">
            <div style={{ display: "flex", gap: 8 }}>
              <input type="number" min="0" style={inputStyle} value={form.shots} onChange={e => update("shots", e.target.value)} placeholder="Total" />
              <input type="number" min="0" style={inputStyle} value={form.shotsOnTarget} onChange={e => update("shotsOnTarget", e.target.value)} placeholder="On target" />
            </div>
          </Field>
          <div style={{ gridColumn: "1 / -1" }}>
            <Field label="Match notes">
              <textarea style={{ ...inputStyle, minHeight: 70, resize: "vertical" }} value={form.notes} onChange={e => update("notes", e.target.value)} placeholder="Key moments, standout performers, tactical notes..." />
            </Field>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <ActionButton type="submit" label={saved ? "Saved ✓" : "Save Match"} icon={saved ? undefined : Plus} />
          </div>
        </form>
      </Card>
    </div>
  );
}

/* ================================================================
   MATCH REPORTS
================================================================ */

function MatchReports({ matches, selectedMatch, setSelectedMatch }) {
  const detail = matches.find(m => m.id === selectedMatch) || matches[0];

  return (
    <div>
      <Header eyebrow="Reports" title="Match Reports" subtitle={`${matches.length} matches logged this season`} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 18 }}>
        <Card title="Fixture List" eyebrow="Select a match" style={{ padding: 8, maxHeight: 560, overflowY: "auto" }}>
          {matches.map(m => {
            const res = m.scoreFor > m.scoreAgainst ? "W" : m.scoreFor === m.scoreAgainst ? "D" : "L";
            const active = detail?.id === m.id;
            return (
              <button key={m.id} onClick={() => setSelectedMatch(m.id)} style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
                padding: "10px 10px", borderRadius: 7, border: "none",
                background: active ? COLORS.surface2 : "transparent", color: COLORS.text,
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: 5, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700, color: COLORS.bg,
                  background: res === "W" ? COLORS.gold : res === "D" ? COLORS.goldLight : COLORS.danger,
                }}>{res}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{m.opponent}</div>
                  <div style={{ fontSize: 11, color: COLORS.faint }}>{m.date} · {m.competition}</div>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13 }}>{m.scoreFor}-{m.scoreAgainst}</div>
                <ChevronRight size={14} color={COLORS.faint} />
              </button>
            );
          })}
        </Card>

        {detail && (
          <Card eyebrow={`${detail.competition} · ${detail.venue === "home" ? "Home" : "Away"}`} title={`Ekhaya FC ${detail.scoreFor} – ${detail.scoreAgainst} ${detail.opponent}`}>
            <div style={{ fontSize: 12, color: COLORS.faint, marginBottom: 16 }}>{detail.date}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 18 }}>
              <StatBlock label="Possession" value={`${detail.possession}%`} />
              <StatBlock label="Shots" value={detail.shots} />
              <StatBlock label="On Target" value={detail.shotsOnTarget} />
            </div>
            <div style={{ borderTop: `1px solid ${COLORS.border}`, paddingTop: 14 }}>
              <div style={{ fontSize: 11, color: COLORS.faint, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>Match Notes</div>
              <div style={{ fontSize: 13.5, color: COLORS.muted, lineHeight: 1.6 }}>{detail.notes || "No notes recorded."}</div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function StatBlock({ label, value }) {
  return (
    <div style={{ background: COLORS.surface2, borderRadius: 8, padding: "12px 14px", textAlign: "center" }}>
      <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 22, color: COLORS.gold }}>{value}</div>
      <div style={{ fontSize: 10, color: COLORS.faint, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
    </div>
  );
}

/* ================================================================
   ANALYSIS
================================================================ */

function Analysis({ players, matches }) {
  const goalData = [...players].sort((a, b) => b.goals - a.goals).slice(0, 8).map(p => ({ name: p.name.split(" ")[1] || p.name, goals: p.goals, assists: p.assists }));
  const minutesData = [...players].sort((a, b) => b.minutes - a.minutes).slice(0, 8).map(p => ({ name: p.name.split(" ")[1] || p.name, minutes: p.minutes }));
  const radarData = [
    { metric: "Possession", value: Math.round(matches.reduce((s, m) => s + m.possession, 0) / matches.length) },
    { metric: "Shots/Match", value: Math.round((matches.reduce((s, m) => s + m.shots, 0) / matches.length) * 5) },
    { metric: "Accuracy", value: Math.round((matches.reduce((s, m) => s + m.shotsOnTarget, 0) / Math.max(1, matches.reduce((s, m) => s + m.shots, 0))) * 100) },
    { metric: "Fitness", value: Math.round(players.reduce((s, p) => s + p.fitness, 0) / players.length) },
    { metric: "Discipline", value: 100 - players.reduce((s, p) => s + p.yellow * 4 + p.red * 12, 0) },
  ];

  return (
    <div>
      <Header eyebrow="Analysis" title="Performance Analytics" subtitle="Squad and match trends across the season" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
        <Card title="Goal Contributions" eyebrow="Top 8 players">
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={goalData}>
              <CartesianGrid stroke={COLORS.border} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: COLORS.faint, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} tickLine={false} />
              <YAxis tick={{ fill: COLORS.faint, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 12 }} labelStyle={{ color: COLORS.text }} />
              <Bar dataKey="goals" fill={COLORS.gold} radius={[4, 4, 0, 0]} />
              <Bar dataKey="assists" fill={COLORS.goldDim} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Fitness Trend" eyebrow="Weekly squad average">
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={FITNESS_TREND}>
              <CartesianGrid stroke={COLORS.border} vertical={false} />
              <XAxis dataKey="week" tick={{ fill: COLORS.faint, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: COLORS.faint, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 12 }} labelStyle={{ color: COLORS.text }} />
              <Line type="monotone" dataKey="avg" stroke={COLORS.gold} strokeWidth={2.5} dot={{ fill: COLORS.gold, r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <Card title="Minutes Played" eyebrow="Top 8 players">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={minutesData} layout="vertical">
              <CartesianGrid stroke={COLORS.border} horizontal={false} />
              <XAxis type="number" tick={{ fill: COLORS.faint, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" tick={{ fill: COLORS.faint, fontSize: 11 }} axisLine={false} tickLine={false} width={60} />
              <Tooltip contentStyle={{ background: COLORS.surface2, border: `1px solid ${COLORS.border}`, borderRadius: 8, fontSize: 12 }} labelStyle={{ color: COLORS.text }} />
              <Bar dataKey="minutes" fill={COLORS.goldLight} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Team Profile" eyebrow="Season averages">
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData} outerRadius={80}>
              <PolarGrid stroke={COLORS.border} />
              <PolarAngleAxis dataKey="metric" tick={{ fill: COLORS.faint, fontSize: 11 }} />
              <Radar dataKey="value" stroke={COLORS.gold} fill={COLORS.gold} fillOpacity={0.28} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

/* ================================================================
   PLAYERS
================================================================ */

function Players({ players, injuries }) {
  const [query, setQuery] = useState("");
  const [posFilter, setPosFilter] = useState("all");
  const positions = ["all", ...Array.from(new Set(players.map(p => p.position)))];

  const filtered = players.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) &&
    (posFilter === "all" || p.position === posFilter)
  );

  return (
    <div>
      <Header eyebrow="Squad" title="Players" subtitle={`${players.length} registered players`} />

      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 7, padding: "8px 12px", flex: 1, maxWidth: 280 }}>
          <Search size={14} color={COLORS.faint} />
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search players..." style={{ background: "transparent", border: "none", outline: "none", color: COLORS.text, fontSize: 13, width: "100%" }} />
        </div>
        <select value={posFilter} onChange={e => setPosFilter(e.target.value)} style={inputStyle}>
          {positions.map(pos => <option key={pos} value={pos}>{pos === "all" ? "All positions" : pos}</option>)}
        </select>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 14 }}>
        {filtered.map(p => (
          <Card key={p.id} style={{ padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <Badge number={p.number} size={40} color={STATUS_META[p.status].color} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</div>
                <div style={{ fontSize: 11, color: COLORS.faint }}>{p.position} · Age {p.age}</div>
              </div>
            </div>
            <div style={{ marginBottom: 10 }}><StatusDot status={p.status} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, fontSize: 12, textAlign: "center" }}>
              <div><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, color: COLORS.text }}>{p.goals}</div><div style={{ color: COLORS.faint, fontSize: 10 }}>G</div></div>
              <div><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, color: COLORS.text }}>{p.assists}</div><div style={{ color: COLORS.faint, fontSize: 10 }}>A</div></div>
              <div><div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 15, color: COLORS.text }}>{p.apps}</div><div style={{ color: COLORS.faint, fontSize: 10 }}>APP</div></div>
            </div>
            <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", fontSize: 11, color: COLORS.faint }}>
              <span>{p.minutes} mins</span>
              <span>{p.yellow > 0 && <Pill color={COLORS.goldLight}>{p.yellow} YC</Pill>} {p.red > 0 && <Pill color={COLORS.danger}>{p.red} RC</Pill>}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   SESSIONS
================================================================ */

const INTENSITY_COLOR = { low: COLORS.gold, medium: COLORS.goldLight, high: COLORS.danger };

function Sessions({ sessions, setSessions }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: "", type: "Training", focus: "", duration: 60, intensity: "medium", attendance: 20, squad: 24, notes: "" });

  function submit(e) {
    e.preventDefault();
    if (!form.date || !form.focus) return;
    setSessions(list => [{ id: Date.now(), ...form, duration: Number(form.duration), attendance: Number(form.attendance), squad: Number(form.squad) }, ...list]);
    setShowForm(false);
    setForm({ date: "", type: "Training", focus: "", duration: 60, intensity: "medium", attendance: 20, squad: 24, notes: "" });
  }

  return (
    <div>
      <Header eyebrow="Training" title="Sessions" subtitle={`${sessions.length} sessions logged`}
        action={<ActionButton onClick={() => setShowForm(s => !s)} label={showForm ? "Close" : "Log Session"} icon={showForm ? X : Plus} />} />

      {showForm && (
        <Card style={{ marginBottom: 18 }} title="New Session">
          <form onSubmit={submit} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            <Field label="Date"><input type="date" style={inputStyle} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></Field>
            <Field label="Type">
              <select style={inputStyle} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option>Training</option><option>Recovery</option><option>Tactical</option><option>Gym</option>
              </select>
            </Field>
            <Field label="Focus"><input style={inputStyle} value={form.focus} onChange={e => setForm({ ...form, focus: e.target.value })} placeholder="e.g. Set pieces" /></Field>
            <Field label="Duration (mins)"><input type="number" style={inputStyle} value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} /></Field>
            <Field label="Intensity">
              <select style={inputStyle} value={form.intensity} onChange={e => setForm({ ...form, intensity: e.target.value })}>
                <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
              </select>
            </Field>
            <Field label="Attendance"><input type="number" style={inputStyle} value={form.attendance} onChange={e => setForm({ ...form, attendance: e.target.value })} /></Field>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Notes"><textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></Field>
            </div>
            <div style={{ gridColumn: "1 / -1" }}><ActionButton type="submit" label="Save Session" icon={Plus} /></div>
          </form>
        </Card>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {sessions.map(s => (
          <Card key={s.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 4, height: 34, borderRadius: 3, background: INTENSITY_COLOR[s.intensity] }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{s.type} · {s.focus}</div>
                  <div style={{ fontSize: 11, color: COLORS.faint }}>{s.date} · {s.duration} mins</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <Pill color={INTENSITY_COLOR[s.intensity]}>{s.intensity} intensity</Pill>
                <div style={{ fontSize: 12, color: COLORS.muted, display: "flex", alignItems: "center", gap: 6 }}>
                  <Activity size={13} /> {s.attendance}/{s.squad}
                </div>
              </div>
            </div>
            {s.notes && <div style={{ marginTop: 10, fontSize: 12.5, color: COLORS.muted, borderTop: `1px solid ${COLORS.border}`, paddingTop: 10 }}>{s.notes}</div>}
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ================================================================
   SETTINGS
================================================================ */

function SettingsPanel() {
  const [club, setClub] = useState({ name: "Ekhaya FC", season: "2026/27", ground: "Ekhaya Grounds, Lilongwe", formation: "4-3-3" });
  const [toggles, setToggles] = useState({ injuryAlerts: true, matchReminders: true, weeklyReport: false });

  return (
    <div>
      <Header eyebrow="Configuration" title="Settings" subtitle="Club details and notification preferences" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <Card title="Club Profile" eyebrow="Identity">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Field label="Club name"><input style={inputStyle} value={club.name} onChange={e => setClub({ ...club, name: e.target.value })} /></Field>
            <Field label="Season"><input style={inputStyle} value={club.season} onChange={e => setClub({ ...club, season: e.target.value })} /></Field>
            <Field label="Home ground"><input style={inputStyle} value={club.ground} onChange={e => setClub({ ...club, ground: e.target.value })} /></Field>
            <Field label="Default formation">
              <select style={inputStyle} value={club.formation} onChange={e => setClub({ ...club, formation: e.target.value })}>
                <option>4-3-3</option><option>4-2-3-1</option><option>4-4-2</option><option>3-5-2</option>
              </select>
            </Field>
          </div>
        </Card>

        <Card title="Notifications" eyebrow="Alerts">
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Toggle label="Injury status alerts" desc="Notify staff when a player's status changes" value={toggles.injuryAlerts} onChange={v => setToggles({ ...toggles, injuryAlerts: v })} />
            <Toggle label="Match day reminders" desc="Reminder 24 hours before each fixture" value={toggles.matchReminders} onChange={v => setToggles({ ...toggles, matchReminders: v })} />
            <Toggle label="Weekly performance report" desc="Auto-summary sent every Monday" value={toggles.weeklyReport} onChange={v => setToggles({ ...toggles, weeklyReport: v })} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function Toggle({ label, desc, value, onChange }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 11, color: COLORS.faint, marginTop: 2 }}>{desc}</div>
      </div>
      <button onClick={() => onChange(!value)} style={{
        width: 40, height: 22, borderRadius: 20, border: "none", position: "relative", flexShrink: 0,
        background: value ? COLORS.gold : COLORS.surface2,
      }}>
        <span style={{
          position: "absolute", top: 2, left: value ? 20 : 2, width: 18, height: 18, borderRadius: "50%",
          background: value ? COLORS.bg : COLORS.faint, transition: "left .15s",
        }} />
      </button>
    </div>
  );
}

/* ================================================================
   shared bits
================================================================ */

function Header({ eyebrow, title, subtitle, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
      <div>
        <div style={{ fontSize: 11, letterSpacing: "0.14em", color: COLORS.gold, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", marginBottom: 4 }}>{eyebrow}</div>
        <div style={{ fontFamily: "'Oswald', sans-serif", fontSize: 26, fontWeight: 600, letterSpacing: "0.01em" }}>{title}</div>
        {subtitle && <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 4 }}>{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

function ActionButton({ onClick, label, icon: Icon, type = "button" }) {
  return (
    <button type={type} onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 8, background: COLORS.gold, color: COLORS.bg,
      border: "none", borderRadius: 7, padding: "10px 16px", fontSize: 13, fontWeight: 700,
      fontFamily: "'Inter', sans-serif",
    }}>
      {Icon && <Icon size={15} />} {label}
    </button>
  );
}

function EmptyNote({ text }) {
  return <div style={{ fontSize: 13, color: COLORS.faint, padding: "10px 0" }}>{text}</div>;
}

const th = { padding: "8px 10px" };
const td = { padding: "10px 10px", fontSize: 13 };
const linkBtn = { background: "none", border: "none", color: COLORS.gold, fontSize: 12, fontWeight: 600, padding: 0 };
