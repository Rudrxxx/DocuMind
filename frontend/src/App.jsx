import { useState, useRef, useEffect } from "react"
import axios from "axios"
import { useDropzone } from "react-dropzone"
import ReactMarkdown from "react-markdown"

const API = "https://documind-ai-7t3o.onrender.com/"

const G = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --black: #0a0a0a; --white: #f5f0e8; --cream: #ede8dc;
      --accent: #ff4d00; --accent2: #00c896; --accent3: #3d5afe;
      --muted: #666; --border: #1e1e1e; --card: #111;
    }
    html { scroll-behavior: smooth; }
    body { background: var(--black); color: var(--white); font-family: 'DM Sans', sans-serif; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 3px; }
    ::-webkit-scrollbar-track { background: var(--black); }
    ::-webkit-scrollbar-thumb { background: var(--accent); }
    .syne { font-family: 'Syne', sans-serif; }
    .mono { font-family: 'Space Mono', monospace; }
    nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      display: flex; align-items: center; justify-content: space-between;
      padding: 1.2rem 3rem; border-bottom: 1px solid var(--border);
      background: rgba(10,10,10,0.95); backdrop-filter: blur(12px);
    }
    .nav-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.3rem; letter-spacing: -0.5px; cursor: pointer; }
    .nav-logo span { color: var(--accent); }
    .nav-links { display: flex; gap: 2rem; align-items: center; }
    .nav-link { font-family: 'Space Mono', monospace; font-size: 0.72rem; color: var(--muted); cursor: pointer; letter-spacing: 0.05em; text-transform: uppercase; transition: color 0.2s; background: none; border: none; }
    .nav-link:hover, .nav-link.active { color: var(--white); }
    .nav-cta { font-family: 'Space Mono', monospace; font-size: 0.72rem; background: var(--accent); color: var(--black); border: none; padding: 0.5rem 1.2rem; cursor: pointer; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; transition: background 0.15s; }
    .nav-cta:hover { background: var(--white); }
    .hero { min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-end; padding: 8rem 3rem 4rem; border-bottom: 1px solid var(--border); position: relative; overflow: hidden; }
    .hero-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(255,77,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,77,0,0.04) 1px, transparent 1px); background-size: 60px 60px; }
    .hero-tag { font-family: 'Space Mono', monospace; font-size: 0.7rem; color: var(--accent); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; }
    .hero-tag::before { content: ''; display: block; width: 24px; height: 1px; background: var(--accent); }
    .hero-title { font-family: 'Syne', sans-serif; font-size: clamp(3.5rem, 9vw, 8rem); font-weight: 800; line-height: 0.92; letter-spacing: -2px; margin-bottom: 2rem; }
    .hero-title .outline { -webkit-text-stroke: 1px var(--white); color: transparent; }
    .hero-title .accent-txt { color: var(--accent); }
    .hero-sub { max-width: 520px; font-size: 1rem; color: var(--muted); line-height: 1.7; margin-bottom: 2.5rem; }
    .hero-actions { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
    .btn-primary { font-family: 'Space Mono', monospace; font-size: 0.78rem; font-weight: 700; background: var(--accent); color: var(--black); border: none; padding: 0.9rem 2rem; cursor: pointer; letter-spacing: 0.05em; text-transform: uppercase; transition: all 0.15s; }
    .btn-primary:hover { background: var(--white); }
    .btn-outline { font-family: 'Space Mono', monospace; font-size: 0.78rem; font-weight: 700; background: transparent; color: var(--white); border: 1px solid var(--border); padding: 0.9rem 2rem; cursor: pointer; letter-spacing: 0.05em; text-transform: uppercase; transition: all 0.15s; }
    .btn-outline:hover { border-color: var(--white); }
    .hero-stats { display: flex; gap: 3rem; margin-top: 4rem; padding-top: 2rem; border-top: 1px solid var(--border); }
    .hero-stat-num { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; }
    .hero-stat-label { font-family: 'Space Mono', monospace; font-size: 0.65rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; }
    .marquee-wrap { overflow: hidden; border-bottom: 1px solid var(--border); background: var(--accent); padding: 0.75rem 0; }
    .marquee-inner { display: flex; gap: 3rem; width: max-content; animation: marquee 20s linear infinite; }
    @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    .marquee-item { font-family: 'Space Mono', monospace; font-size: 0.72rem; font-weight: 700; color: var(--black); text-transform: uppercase; letter-spacing: 0.1em; white-space: nowrap; }
    .section { padding: 6rem 3rem; border-bottom: 1px solid var(--border); }
    .section-label { font-family: 'Space Mono', monospace; font-size: 0.65rem; color: var(--accent); text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 1rem; }
    .section-title { font-family: 'Syne', sans-serif; font-size: clamp(2rem, 4vw, 3.5rem); font-weight: 800; letter-spacing: -1px; line-height: 1; margin-bottom: 3rem; }
    .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); border: 1px solid var(--border); }
    .feature-card { padding: 2.5rem; border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); transition: background 0.2s; }
    .feature-card:hover { background: #141414; }
    .feature-card:nth-child(3n) { border-right: none; }
    .feature-num { font-family: 'Space Mono', monospace; font-size: 0.65rem; color: var(--accent); letter-spacing: 0.1em; margin-bottom: 1.5rem; }
    .feature-icon { font-size: 1.8rem; margin-bottom: 1rem; display: block; }
    .feature-title { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; }
    .feature-desc { font-size: 0.85rem; color: var(--muted); line-height: 1.7; }
    .steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); border: 1px solid var(--border); }
    .step { padding: 2.5rem; border-right: 1px solid var(--border); }
    .step:last-child { border-right: none; }
    .step-num { font-family: 'Syne', sans-serif; font-size: 3rem; font-weight: 800; color: transparent; -webkit-text-stroke: 1px var(--border); line-height: 1; margin-bottom: 1rem; }
    .step-title { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; }
    .step-desc { font-size: 0.82rem; color: var(--muted); line-height: 1.6; }
    .tech-grid { display: grid; grid-template-columns: repeat(5, 1fr); border: 1px solid var(--border); }
    .tech-item { padding: 2rem; border-right: 1px solid var(--border); text-align: center; }
    .tech-item:last-child { border-right: none; }
    .tech-name { font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 700; margin-bottom: 0.3rem; }
    .tech-role { font-family: 'Space Mono', monospace; font-size: 0.6rem; color: var(--muted); text-transform: uppercase; }
    .app-layout { display: grid; grid-template-columns: 280px 1fr; min-height: 100vh; padding-top: 65px; }
    .app-sidebar { border-right: 1px solid var(--border); padding: 2rem 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; position: sticky; top: 65px; height: calc(100vh - 65px); overflow-y: auto; }
    .sidebar-label { font-family: 'Space Mono', monospace; font-size: 0.6rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.75rem; }
    .level-badge { background: var(--card); border: 1px solid var(--border); padding: 1.25rem; }
    .level-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.75rem; }
    .level-num { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; }
    .level-lbl { font-family: 'Space Mono', monospace; font-size: 0.62rem; color: var(--muted); }
    .xp-bg { height: 3px; background: var(--border); }
    .xp-fill { height: 100%; background: var(--accent); transition: width 0.5s ease; }
    .xp-txt { font-family: 'Space Mono', monospace; font-size: 0.6rem; color: var(--muted); margin-top: 0.4rem; }
    .stat-row { display: flex; justify-content: space-between; padding: 0.6rem 0; border-bottom: 1px solid var(--border); font-family: 'Space Mono', monospace; font-size: 0.7rem; }
    .stat-row:last-child { border-bottom: none; }
    .stat-val { color: var(--white); font-weight: 700; }
    .stat-key { color: var(--muted); }
    .ach { display: flex; gap: 0.75rem; align-items: center; padding: 0.75rem; background: var(--card); border: 1px solid var(--border); margin-bottom: 0.5rem; opacity: 0.35; transition: opacity 0.3s; }
    .ach.unlocked { opacity: 1; border-color: var(--accent2); }
    .ach-icon { font-size: 1.1rem; flex-shrink: 0; }
    .ach-name { font-family: 'Syne', sans-serif; font-size: 0.78rem; font-weight: 700; }
    .ach-desc { font-family: 'Space Mono', monospace; font-size: 0.58rem; color: var(--muted); }
    .chat-area { display: flex; flex-direction: column; height: calc(100vh - 65px); }
    .chat-topbar { padding: 1.25rem 2rem; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
    .chat-doc { font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 700; }
    .chat-meta { font-family: 'Space Mono', monospace; font-size: 0.62rem; color: var(--muted); }
    .chat-msgs { flex: 1; overflow-y: auto; padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
    .msg-user { align-self: flex-end; max-width: 70%; background: var(--white); color: var(--black); padding: 0.8rem 1.1rem; font-size: 0.9rem; line-height: 1.6; }
    .msg-ai { align-self: flex-start; max-width: 82%; display: flex; gap: 0.75rem; }
    .ai-av { width: 28px; height: 28px; flex-shrink: 0; background: var(--accent); color: var(--black); font-family: 'Syne', sans-serif; font-weight: 800; font-size: 0.6rem; display: flex; align-items: center; justify-content: center; margin-top: 2px; }
    .ai-bub { background: var(--card); border: 1px solid var(--border); padding: 0.85rem 1.1rem; font-size: 0.88rem; line-height: 1.75; }
    .ai-bub p { margin-bottom: 0.4rem; }
    .ai-bub p:last-child { margin-bottom: 0; }
    .src-btn { font-family: 'Space Mono', monospace; font-size: 0.6rem; color: var(--accent); cursor: pointer; background: none; border: none; padding: 0.35rem 0; text-transform: uppercase; letter-spacing: 0.05em; }
    .src-chip { font-family: 'Space Mono', monospace; font-size: 0.63rem; color: var(--muted); border-left: 2px solid var(--accent); padding: 0.35rem 0.6rem; margin-top: 0.25rem; background: #0d0d0d; line-height: 1.5; }
    .sys-msg { text-align: center; font-family: 'Space Mono', monospace; font-size: 0.7rem; color: var(--accent2); border: 1px solid rgba(0,200,150,0.2); padding: 0.6rem 1rem; background: rgba(0,200,150,0.04); }
    .dots { display: flex; gap: 4px; padding: 0.5rem 0; }
    .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--muted); animation: blink 1.2s ease infinite; }
    .dot:nth-child(2) { animation-delay: 0.2s; }
    .dot:nth-child(3) { animation-delay: 0.4s; }
    @keyframes blink { 0%,80%,100%{opacity:0.2} 40%{opacity:1} }
    .upload-zone { border: 1px dashed var(--border); margin: 2rem; padding: 3rem; text-align: center; cursor: pointer; transition: all 0.2s; }
    .upload-zone:hover, .upload-zone.drag { border-color: var(--accent); background: rgba(255,77,0,0.03); }
    .upload-zone.done { border-color: var(--accent2); border-style: solid; }
    .upload-title { font-family: 'Syne', sans-serif; font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem; }
    .upload-sub { font-family: 'Space Mono', monospace; font-size: 0.65rem; color: var(--muted); }
    .prog-bg { height: 2px; background: var(--border); margin-top: 1.5rem; }
    .prog-fill { height: 100%; background: var(--accent); transition: width 0.2s; }
    .input-bar { padding: 1.25rem 2rem; border-top: 1px solid var(--border); display: flex; gap: 0.75rem; }
    .chat-in { flex: 1; background: var(--card); border: 1px solid var(--border); color: var(--white); padding: 0.8rem 1rem; font-size: 0.9rem; font-family: 'DM Sans', sans-serif; transition: border-color 0.2s; }
    .chat-in:focus { outline: none; border-color: var(--accent); }
    .chat-in::placeholder { color: #444; }
    .send-btn { font-family: 'Space Mono', monospace; font-size: 0.72rem; font-weight: 700; background: var(--accent); color: var(--black); border: none; padding: 0.8rem 1.5rem; cursor: pointer; text-transform: uppercase; letter-spacing: 0.05em; transition: background 0.15s; }
    .send-btn:disabled { opacity: 0.3; cursor: not-allowed; }
    .send-btn:not(:disabled):hover { background: var(--white); }
    .sug-row { display: flex; flex-wrap: wrap; gap: 0.5rem; padding: 0 2rem 1rem; }
    .sug-chip { font-family: 'Space Mono', monospace; font-size: 0.63rem; color: var(--muted); border: 1px solid var(--border); background: none; padding: 0.35rem 0.75rem; cursor: pointer; transition: all 0.15s; }
    .sug-chip:hover { color: var(--white); border-color: #444; }
    .hist-page { padding: 2rem; padding-top: calc(65px + 2rem); min-height: 100vh; max-width: 860px; margin: 0 auto; }
    .hist-title { font-family: 'Syne', sans-serif; font-size: 2rem; font-weight: 800; margin-bottom: 0.5rem; }
    .hist-empty { font-family: 'Space Mono', monospace; font-size: 0.78rem; color: var(--muted); text-align: center; padding: 4rem; border: 1px dashed var(--border); }
    .hist-item { border: 1px solid var(--border); padding: 1.25rem; margin-bottom: 0.75rem; transition: background 0.15s; }
    .hist-item:hover { background: var(--card); }
    .hist-q { font-family: 'Syne', sans-serif; font-weight: 700; margin-bottom: 0.4rem; font-size: 0.95rem; }
    .hist-a { font-size: 0.82rem; color: var(--muted); line-height: 1.6; }
    .hist-meta { font-family: 'Space Mono', monospace; font-size: 0.6rem; color: #333; margin-top: 0.5rem; }
    .xp-toast { position: fixed; top: 80px; right: 2rem; z-index: 999; background: var(--white); color: var(--black); font-family: 'Space Mono', monospace; font-weight: 700; font-size: 0.72rem; padding: 0.6rem 1rem; animation: toastIn 2.5s ease forwards; }
    @keyframes toastIn { 0%{opacity:0;transform:translateX(20px)} 15%{opacity:1;transform:translateX(0)} 75%{opacity:1} 100%{opacity:0;transform:translateX(20px)} }
    .err-bar { font-family: 'Space Mono', monospace; font-size: 0.68rem; color: var(--accent); border: 1px solid var(--accent); padding: 0.75rem 1rem; margin: 0 2rem; }
  `}</style>
)

const FEATURES = [
  { icon: "⚡", title: "Instant RAG Pipeline", desc: "Upload any PDF and watch it get chunked, embedded, and indexed in seconds using FAISS vector search." },
  { icon: "🧠", title: "LLaMA 70B Intelligence", desc: "Powered by Groq's LLaMA 3.3 70B — answers are grounded in your document, never hallucinated." },
  { icon: "🎯", title: "Semantic Search", desc: "Not keyword matching. Real semantic understanding using sentence-transformers and cosine similarity." },
  { icon: "📌", title: "Source Citations", desc: "Every answer shows exactly which chunks of the document were used. Full transparency." },
  { icon: "🏆", title: "Gamified XP System", desc: "Earn XP, level up, unlock achievements as you explore. Document research shouldn't be boring." },
  { icon: "📜", title: "Query History", desc: "Every question and answer is saved in session so you can revisit and compare insights." },
]

const SUGGESTED = [
  "What is this document about?",
  "Summarize the key points",
  "What are the main conclusions?",
  "List the most important facts",
  "Explain the technical concepts",
  "What problems does this solve?",
]

const ACHIEVEMENTS = [
  { icon: "📄", name: "First Upload", desc: "Upload your first PDF", key: "firstUpload" },
  { icon: "❓", name: "Curious Mind", desc: "Ask your first question", key: "firstQ" },
  { icon: "🔥", name: "On Fire", desc: "Ask 5 questions", key: "fiveQ" },
  { icon: "⚡", name: "Speed Runner", desc: "Ask 10 questions", key: "tenQ" },
  { icon: "🏆", name: "Expert", desc: "Reach Level 5", key: "lv5" },
]

export default function App() {
  const [page, setPage] = useState("home")
  const [messages, setMessages] = useState([])
  const [question, setQuestion] = useState("")
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [chunks, setChunks] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState(null)
  const [xp, setXp] = useState(0)
  const [xpToast, setXpToast] = useState(null)
  const [history, setHistory] = useState([])
  const [showSrc, setShowSrc] = useState({})
  const [ach, setAch] = useState({})
  const chatRef = useRef(null)

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight
  }, [messages, loading])

  const level = Math.floor(xp / 200) + 1
  const xpInLevel = xp % 200
  const badge = level >= 5 ? "EXPERT" : level >= 3 ? "ADVANCED" : level >= 2 ? "RISING" : "BEGINNER"

  const addXp = (amt, msg) => {
    setXp(p => p + amt)
    setXpToast(`+${amt} XP — ${msg}`)
    setTimeout(() => setXpToast(null), 2500)
  }
  const unlock = (key) => setAch(p => p[key] ? p : { ...p, [key]: true })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (files) => {
      const file = files[0]; if (!file) return
      setUploading(true); setError(null); setUploadProgress(0)
      const iv = setInterval(() => setUploadProgress(p => Math.min(p + 10, 88)), 180)
      try {
        const fd = new FormData(); fd.append("file", file)
        const res = await axios.post(`${API}/upload`, fd)
        clearInterval(iv); setUploadProgress(100)
        setUploadedFile(res.data.filename); setChunks(res.data.chunks_created)
        addXp(100, "Document indexed!")
        unlock("firstUpload")
        setMessages([{ role: "system", content: `"${res.data.filename}" ready — ${res.data.chunks_created} chunks indexed.` }])
        setTimeout(() => setUploadProgress(0), 800)
      } catch { clearInterval(iv); setError("Upload failed. Is the backend running on port 8000?") }
      finally { setUploading(false) }
    }
  })

  const send = async (q) => {
    const text = q || question
    if (!text.trim() || loading) return
    setMessages(p => [...p, { role: "user", content: text }])
    setQuestion(""); setLoading(true); setError(null)
    try {
      const res = await axios.post(`${API}/query`, { question: text })
      setMessages(p => [...p, { role: "assistant", content: res.data.answer, sources: res.data.sources }])
      const h = { q: text, a: res.data.answer, time: new Date().toLocaleTimeString(), file: uploadedFile }
      setHistory(p => [h, ...p])
      addXp(50, "Question answered!")
      unlock("firstQ")
      if (history.length + 1 >= 5) unlock("fiveQ")
      if (history.length + 1 >= 10) unlock("tenQ")
      if (level >= 5) unlock("lv5")
    } catch { setError("Query failed. Try again.") }
    finally { setLoading(false) }
  }

  return (
    <>
      <G />
      {xpToast && <div className="xp-toast">{xpToast}</div>}

      <nav>
        <div className="nav-logo syne" onClick={() => setPage("home")}>DOCU<span>MIND</span></div>
        <div className="nav-links">
          {["home","app","history"].map(p => (
            <button key={p} className={`nav-link ${page === p ? "active" : ""}`} onClick={() => setPage(p)}>
              {p === "home" ? "Home" : p === "app" ? "App" : "History"}
            </button>
          ))}
          <button className="nav-cta" onClick={() => setPage("app")}>Launch →</button>
        </div>
      </nav>

      {/* HOME */}
      {page === "home" && (
        <div>
          <section className="hero">
            <div className="hero-grid" />
            <div className="hero-tag mono">RAG · Vector Search · LLaMA 70B</div>
            <h1 className="hero-title syne">
              YOUR DOCS.<br />
              <span className="outline">ACTUALLY</span><br />
              <span className="accent-txt">ANSWER.</span>
            </h1>
            <p className="hero-sub">Upload any PDF and have a real conversation with it. DocuMind uses RAG pipelines, FAISS vector search and Groq's LLaMA 70B to give you grounded, cited answers — not hallucinations.</p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={() => setPage("app")}>Start for free →</button>
              <button className="btn-outline" onClick={() => document.getElementById("how").scrollIntoView()}>See how it works</button>
            </div>
            <div className="hero-stats">
              {[["70B","Model params"],["< 2s","Avg response"],["100%","Source-grounded"],["Free","Groq API"]].map(([n,l]) => (
                <div key={l}><div className="hero-stat-num syne">{n}</div><div className="hero-stat-label mono">{l}</div></div>
              ))}
            </div>
          </section>

          <div className="marquee-wrap">
            <div className="marquee-inner">
              {Array(2).fill(["RAG Pipeline","FAISS Vector DB","LLaMA 70B","LangChain","Semantic Search","Source Citations","FastAPI","Groq Inference","Embeddings","Chunking"]).flat().map((t,i) => (
                <span key={i} className="marquee-item">{t} <span style={{color:"rgba(0,0,0,0.4)"}}>✦</span></span>
              ))}
            </div>
          </div>

          <section className="section">
            <div className="section-label mono">What it does</div>
            <div className="section-title syne">Built for real<br/>document work.</div>
            <div className="features-grid">
              {FEATURES.map((f,i) => (
                <div className="feature-card" key={i}>
                  <div className="feature-num mono">0{i+1}</div>
                  <span className="feature-icon">{f.icon}</span>
                  <div className="feature-title syne">{f.title}</div>
                  <div className="feature-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="section" id="how">
            <div className="section-label mono">Under the hood</div>
            <div className="section-title syne">How it works.</div>
            <div className="steps-grid">
              {[["Upload","Drop any PDF. The backend saves it and starts processing immediately."],["Chunk","Split into overlapping 500-char segments using LangChain's recursive text splitter."],["Embed","Each chunk becomes a 384-dim vector via sentence-transformers all-MiniLM-L6-v2."],["Answer","Your question is embedded, top-5 chunks retrieved via FAISS cosine similarity, sent to LLaMA 70B."]].map(([t,d],i) => (
                <div className="step" key={i}>
                  <div className="step-num syne">0{i+1}</div>
                  <div className="step-title syne">{t}</div>
                  <div className="step-desc">{d}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="section">
            <div className="section-label mono">Tech stack</div>
            <div className="section-title syne">What's inside.</div>
            <div className="tech-grid">
              {[["LangChain","RAG Orchestration"],["FAISS","Vector Search"],["Groq","LLM Inference"],["FastAPI","REST Backend"],["React","Frontend"]].map(([n,r]) => (
                <div className="tech-item" key={n}><div className="tech-name syne">{n}</div><div className="tech-role mono">{r}</div></div>
              ))}
            </div>
          </section>

          <section className="section" style={{textAlign:"center",borderBottom:"none"}}>
            <div className="section-title syne" style={{marginBottom:"1.5rem"}}>Ready to try it?</div>
            <button className="btn-primary" style={{fontSize:"0.9rem",padding:"1.1rem 3rem"}} onClick={() => setPage("app")}>Launch DocuMind →</button>
          </section>
        </div>
      )}

      {/* APP */}
      {page === "app" && (
        <div className="app-layout">
          <aside className="app-sidebar">
            <div>
              <div className="sidebar-label mono">Progress</div>
              <div className="level-badge">
                <div className="level-row">
                  <div><div className="level-num syne">LV{level}</div><div className="level-lbl mono">{badge}</div></div>
                  <div style={{textAlign:"right"}}><div style={{fontFamily:"Syne",fontWeight:800,fontSize:"1.1rem"}}>{xp}</div><div className="level-lbl mono">total xp</div></div>
                </div>
                <div className="xp-bg"><div className="xp-fill" style={{width:`${(xpInLevel/200)*100}%`}} /></div>
                <div className="xp-txt mono">{xpInLevel}/200 XP to LV{level+1}</div>
              </div>
            </div>

            <div>
              <div className="sidebar-label mono">Session</div>
              {[["Questions",history.length],["Chunks indexed",chunks],["XP earned",xp],["Level",level]].map(([k,v]) => (
                <div className="stat-row" key={k}><span className="stat-key mono">{k}</span><span className="stat-val mono">{v}</span></div>
              ))}
            </div>

            <div>
              <div className="sidebar-label mono">Achievements</div>
              {ACHIEVEMENTS.map(a => (
                <div className={`ach ${ach[a.key] ? "unlocked" : ""}`} key={a.key}>
                  <span className="ach-icon">{a.icon}</span>
                  <div><div className="ach-name syne">{a.name}</div><div className="ach-desc mono">{a.desc}</div></div>
                </div>
              ))}
            </div>
          </aside>

          <div className="chat-area">
            <div className="chat-topbar">
              <div>
                <div className="chat-doc syne">{uploadedFile || "No document loaded"}</div>
                <div className="chat-meta mono">{chunks > 0 ? `${chunks} chunks · LLaMA 3.3 70B · FAISS` : "Upload a PDF to begin"}</div>
              </div>
              {uploadedFile && <span style={{fontFamily:"Space Mono",fontSize:"0.62rem",color:"var(--accent2)"}}>● READY</span>}
            </div>

            {!uploadedFile ? (
              <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <div style={{width:"100%",maxWidth:520}}>
                  <div {...getRootProps()} className={`upload-zone ${isDragActive?"drag":""}`}>
                    <input {...getInputProps()} />
                    {uploading ? (
                      <><div className="upload-title syne">Ingesting document...</div><div className="prog-bg"><div className="prog-fill" style={{width:`${uploadProgress}%`}}/></div></>
                    ) : (
                      <><div style={{fontSize:"2.5rem",marginBottom:"1rem"}}>📄</div><div className="upload-title syne">{isDragActive?"Drop it":"Drop your PDF"}</div><div className="upload-sub mono">or click to browse · any PDF works</div></>
                    )}
                  </div>
                  {error && <div className="err-bar">{error}</div>}
                </div>
              </div>
            ) : (
              <>
                <div ref={chatRef} className="chat-msgs">
                  {messages.map((m,i) => (
                    <div key={i}>
                      {m.role==="system" && <div className="sys-msg mono">{m.content}</div>}
                      {m.role==="user" && <div className="msg-user">{m.content}</div>}
                      {m.role==="assistant" && (
                        <div className="msg-ai">
                          <div className="ai-av syne">DM</div>
                          <div>
                            <div className="ai-bub"><ReactMarkdown>{m.content}</ReactMarkdown></div>
                            {m.sources?.length > 0 && (
                              <div>
                                <button className="src-btn mono" onClick={() => setShowSrc(p=>({...p,[i]:!p[i]}))}>
                                  {showSrc[i]?"▼":"▶"} {m.sources.length} sources
                                </button>
                                {showSrc[i] && m.sources.map((s,j) => (
                                  <div className="src-chip mono" key={j}>[{j+1}] {s}...</div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {loading && (
                    <div className="msg-ai">
                      <div className="ai-av syne">DM</div>
                      <div className="ai-bub"><div className="dots">{[0,1,2].map(i=><div key={i} className="dot"/>)}</div></div>
                    </div>
                  )}
                </div>

                {messages.length <= 1 && (
                  <div className="sug-row">
                    {SUGGESTED.map((s,i) => <button key={i} className="sug-chip mono" onClick={() => send(s)}>{s}</button>)}
                  </div>
                )}

                {error && <div className="err-bar">{error}</div>}

                <div className="input-bar">
                  <input className="chat-in" value={question} onChange={e=>setQuestion(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Ask anything about your document..." disabled={loading}/>
                  <button className="send-btn mono" onClick={()=>send()} disabled={loading||!question.trim()}>Send →</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* HISTORY */}
      {page === "history" && (
        <div className="hist-page">
          <div className="hist-title syne">Query History</div>
          <div style={{fontFamily:"Space Mono",fontSize:"0.7rem",color:"var(--muted)",marginBottom:"2rem"}}>{history.length} queries this session</div>
          {history.length === 0
            ? <div className="hist-empty mono">No queries yet. Go ask some questions in the App.</div>
            : history.map((h,i) => (
              <div className="hist-item" key={i}>
                <div className="hist-q syne">{h.q}</div>
                <div className="hist-a">{h.a.slice(0,220)}{h.a.length>220?"...":""}</div>
                <div className="hist-meta mono">{h.time} · {h.file}</div>
              </div>
            ))
          }
        </div>
      )}
    </>
  )
}