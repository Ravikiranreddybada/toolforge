import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

const API = import.meta.env.VITE_API_URL || 'https://toolforge-df1j.onrender.com';

// ─── Reusable Agent Component (Agentic 2.0) ──────────────────────────────────
function ReusableAgent({ id, icon, title, desc, color, badge, placeholder, type, extraFields }) {
  const { colors } = useTheme();
  const [msg, setMsg] = useState('');
  const [result, setResult] = useState('');
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(extraFields?.reduce((acc, f) => ({...acc, [f.name]: f.default}), {}) || {});

  const run = async () => {
    let finalMsg = msg;
    if (extraFields) {
      const fieldDetails = extraFields.map(f => `${f.label}: ${fields[f.name]}`).join('\n');
      finalMsg = `${fieldDetails}\n\nRequest: ${msg}`;
    }

    if (!finalMsg.trim()) return;
    setLoading(true); setResult(''); setSteps([]);
    try {
      const res = await fetch(`${API}/api/automate`, {
        method: 'POST', 
        headers: { 
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${localStorage.getItem('ap_token')}` 
        },
        body: JSON.stringify({ 
          message: finalMsg,
          agentType: type,
          threadId: `user-${id}-${type}`
        })
      });
      const data = await res.json();
      if (!res.ok) {
        setResult('❌ Error: ' + (data.error || `Server error ${res.status}`));
      } else {
        setResult(data.output || 'No response.');
        setSteps(data.steps || []);
      }
    } catch (e) { setResult('❌ Error: ' + e.message); }
    setLoading(false);
  };

  return (
    <AgentCard icon={icon} title={title} desc={desc} color={color} badge={badge}>
      {extraFields?.map(f => (
        <div k color={colors.text.secondary}>{f.label}</Lbl>
          {f.type === 'textarea' ? (
            <textarea 
              style={{...s.inp, background: colors.bg.primary, borderColor: colors.border.primary, color: colors.text.primary, height:60, resize:'vertical', fontFamily:'monospace', fontSize:12, width:'100%'}} 
              value={fields[f.name]} 
              onChange={e => setFields({...fields, [f.name]: e.target.value})} 
            />
          ) : (
            <input 
              style={{...s.inp, background: colors.bg.primary, borderColor: colors.border.primary, color: colors.text.primary, width:'100%'}} 
              value={fields[f.name]} 
              onChange={e => setFields({...fields, [f.name]: e.target.value})} 
            />
          )}
        </div>
      ))}
      
      <Lbl color={colors.text.secondary}>{extraFields ? 'Request' : 'Input'}</Lbl>
      <div style={s.row}>
        <input style={{...s.inp, background: colors.bg.primary, borderColor: colors.border.primary, color: colors.text.primary}
        <input style={s.inp} value={msg} onChange={e=>setMsg(e.target.value)} onKeyDown={e=>e.key==='Enter'&&run()} placeholder={placeholder} />
        <Btn onClick={run} disabled={loading} color={color}>{loading?'…':'Run Agent →'}</Btn>
      </div>
      
      {loading && <Loader color={color} />}

      {result && <Out text={result} color={color} type={type} />}
    </AgentCard>
  );
}

// ─── Task 1: Web Research Agent ──────────────────────────────────────────────
function WebResearchAgent() {
  return (
    <ReusableAgent 
      type="research" id="1" icon="🔍" title="Web Research Agent" 
      desc="Autonomously research any topic using real-time Tavily search" 
      color="#00d4ff" badge="Task 1" placeholder="e.g. Current status of SpaceX Starship?"
    />
  );
}

// ─── Task 2: MongoDB Query Generator ─────────────────────────────────────────
function SQLAgent() {
  return (
    <ReusableAgent 
      type="mongodb" id="2" icon="🗄️" title="MongoDB Query Generator" 
      desc="Generates and executes MQL/Mongoose queries against your live collections" 
      color="#a78bfa" badge="Task 2" placeholder="e.g. Find all users who joined this week"
      extraFields={[{ name: 'schema', label: 'Known Collections/Schema', default: 'users, orders, analytics', type: 'textarea' }]}
    />
  );
}

// ─── Task 3: Code Review Agent ───────────────────────────────────────────────
function CodeReviewAgent() {
  return (
    <ReusableAgent 
      type="codereview" id="3" icon="🔬" title="Code Review Agent" 
      desc="Analyzes code for bugs, security issues, and structural improvements" 
      color="#34d399" badge="Task 3" placeholder="Paste your code snippet here..."
      extraFields={[{ name: 'lang', label: 'Language', default: 'JavaScript' }]}
    />
  );
}

// ─── Task 4: Workflow Automation Planner ──────────────────────────────────────
function WorkflowPlannerAgent() {
  return (
    <ReusableAgent 
      type="workflow" id="4" icon="⚙️" title="Workflow Automation Planner" 
      desc="Plans complex multi-tool automation pipelines" 
      color="#fb923c" badge="Task 4" placeholder="e.g. Create a flow to backup MongoDB to AWS every night"
      extraFields={[{ name: 'tools', label: 'Available Tools', default: 'Gmail, Slack, MongoDB, REST API' }]}
    />
  );
}

// ─── Task 5: Prompt Engineering Agent ────────────────────────────────────────
function PromptEngineerAgent() {
  return (
    <ReusableAgent 
      type="prompt" id="5" icon="✍️" title="Prompt Engineering Agent" 
      desc="Optimizes prompts and validates them with live LLM testing" 
      color="#f472b6" badge="Task 5" placeholder="e.g. Write a product description for a gaming mouse"
    />
  );
}

// ─── Task 6: API Integration Agent ───────────────────────────────────────────
function APIIntegrationAgent() {
  return (
    <ReusableAgent 
      type="api" id="6" icon="📡" title="API Integration Agent" 
      desc="Generates and validates REST API integration patterns" 
      color="#fbbf24" badge="Task 6" placeholder="Describe the API goal..."
      extraFields={[{ name: 'api', label: 'API Endpoint/Spec', default: 'GET https://api.stripe.com/v1/charges', type: 'textarea' }]}
    />
  );
}

// ─── Shared UI Helpers ────────────────────────────────────────────────────────
const Lbl = ({children, color}) => <div style={{color: color || '#444',fontSize:11,fontWeight:700,letterSpacing:1,textTransform:'uppercase',marginBottom:6}}>{children}</div>;

const Btn = ({children, onClick, disabled, color, block}) => (
  <button onClick={onClick} disabled={disabled} style={{background:`linear-gradient(135deg, ${color}, ${color}aa)`,color:'#fff',border:'none',padding:'10px 18px',borderRadius:8,fontSize:13,fontWeight:700,cursor:disabled?'not-allowed':'pointer',fontFamily:'Syne,sans-serif',opacity:disabled?0.6:1,flexShrink:0,width:block?'100%':'auto'}}>
    {children}
  </button>
);

function AgentCard({ icon, title, desc, color, badge, children }) {
  const { colors } = useTheme();
  return (
    <div style={{background: colors.bg.secondary,border:`1px solid ${color}22`,borderRadius:16,overflow:'hidden'}}>
      <div style={{padding:'18px 24px',borderBottom:`1px solid ${colors.border.primary}`,display:'flex',alignItems:'center',gap:12}}>
        <div style={{width:44,height:44,borderRadius:10,background:`${color}18`,border:`1px solid ${color}33`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0}}>{icon}</div>
        <div style={{flex:1}}>
          <div style={{display:'flex',alignItems:'center',gap:8}}>
            <h3 style={{fontSize:16,fontWeight:800,color,fontFamily:'Syne,sans-serif',margin:0}}>{title}</h3>
            <span style={{fontSize:10,fontWeight:700,padding:'2px 8px',borderRadius:20,border:`1px solid ${color}44`,color,letterSpacing:0.5}}>{badge}</span>
          </div>
          <p style={{color: colors.text.tertiary,fontSize:12,margin:'2px 0 0'}}>{desc}</p>
        </div>
      </div>
      <div style={{padding:'20px 24px'}}>{children}</div>
    </div>
  );
}

function Loader({color}) {
  return (
    <div style={{display:'flex',alignItems:'center',gap:10,padding:'10px 14px',borderRadius:8,border:`1px solid ${color}33`,background:`${color}08`,marginTop:12}}>
      <style>{`@keyframes bnc{0%,80%,100%{transform:scale(0.5);opacity:0.5}40%{transform:scale(1);opacity:1}}`}</style>
      {[0,1,2].map(i => <span key={i} style={{width:6,height:6,borderRadius:'50%',background:color,display:'inline-block',animation:`bnc 1.2s ease-in-out ${i*0.2}s infinite`}} />)}
      <span style={{color,fontSize:13}}>Running agent...</span>
    </div>
  );
}

// ─── Smart section parser for Prompt Engineering Agent ─────────────────────
function parsePromptSections(text) {
  const sectionHeaders = [
    /^1[).:]\s*(analysis of original[:]?)/i,
    /^2[).:]\s*(optimized prompt[:]?)/i,
    /^3[).:]\s*(why it'?s better[:]?)/i,
    /^4[).:]\s*(variations?[:]?)/i,
    /^(analysis of original)[:\s]/i,
    /^(optimized prompt)[:\s]/i,
    /^(why it'?s better)[:\s]/i,
    /^(variations?)[:\s]/i,
  ];
  const lines = text.split('\n');
  const sections = [];
  let current = null;
  for (const line of lines) {
    let matched = false;
    for (const re of sectionHeaders) {
      if (re.test(line.trim())) {
        if (current) sections.push(current);
        const isOptimized = /optimized prompt/i.test(line);
        const isAnalysis = /analysis of original/i.test(line);
        current = { title: line.replace(/^[0-9][).:]\s*/,'').trim(), content: [], isOptimized, isAnalysis };
        matched = true;
        break;
      }
    }
    if (!matched && current) current.content.push(line);
    else if (!matched && !current) {
      if (!sections.length) sections.push({ title: null, content: [line], isOptimized: false, isAnalysis: false });
      else sections[0].content.push(line);
    }
  }
  if (current) sections.push(current);
  return sections;
}

function{ colors } = useTheme();
  const [copied, setCopied] = useState(false);
  const [copiedSection, setCopiedSection] = useState(null);
  const copyAll = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(()=>setCopied(false),2000); };
  const copySection = (content, idx) => {
    navigator.clipboard.writeText(content.join('\n').trim());
    setCopiedSection(idx); setTimeout(()=>setCopiedSection(null),2000);
  };

  // For Prompt Engineering Agent — render as separate cards
  if (type === 'prompt') {
    const sections = parsePromptSections(text);
    if (sections.length > 1) {
      return (
        <div style={{marginTop:14}}>
          {sections.map((sec, idx) => {
            const contentText = sec.content.join('\n').trim();
            if (!contentText && !sec.title) return null;
            if (sec.isOptimized) {
              // Highlighted box with copy button
              return (
                <div key={idx} style={{border:`1px solid ${color}55`,background:`${color}0d`,borderRadius:10,padding:16,marginBottom:12}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
                    <span style={{color,fontSize:11,fontWeight:800,letterSpacing:1,textTransform:'uppercase'}}>✨ {sec.title}</span>
                    <button onClick={()=>copySection(sec.content,idx)} style={{background:`${color}22`,border:`1px solid ${color}55`,borderRadius:6,padding:'4px 12px',fontSize:11,fontWeight:700,cursor:'pointer',color,fontFamily:'Syne,sans-serif'}}>
                      {copiedSection===idx?'✓ Copied':'📋 Copy Prompt'}
                    </button>
                  </div>
                  <div style={{fontFamily:'JetBrains Mono, monospace',color: colors.text.secondary,fontSize:13,lineHeight:1.8,whiteSpace:'pre-wrap'}}>{contentText}</div>
                </div>
              );
            }
            // Analysis and other sections — no copy, dimmer
            return (
              <div key={idx} style={{border:`1px solid ${colors.border.primary}`,background: colors.bg.secondary,borderRadius:10,padding:14,marginBottom:12}}>
                {sec.title && <div style={{color: colors.text.tertiary,fontSize:10,fontWeight:800,letterSpacing:1,textTransform:'uppercase',marginBottom:8}}>📋 {sec.title}</div>}
                <div style={{fontFamily:'JetBrains Mono, monospace',color: colors.text.secondary,fontSize:12,lineHeight:1.8,whiteSpace:'pre-wrap'}}>{contentText}</div>
              </div>
            );
          })}
        </div>
      );
    }
  }

  // Default output for all other agents
  const lines = text.split('\n');
  return (
    <div style={{border:`1px solid ${color}33`,background:`${color}06`,borderRadius:10,padding:16,marginTop:14,maxHeight:420,overflowY:'auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
        <span style={{color,fontSize:10,fontWeight:700,letterSpacing:1,textTransform:'uppercase'}}>✅ Agent Output</span>
        <button onClick={copyAll} style={{background:'transparent',border:`1px solid ${color}44`,borderRadius:6,padding:'2px 10px',fontSize:11,fontWeight:600,cursor:'pointer',color,fontFamily:'Syne,sans-serif'}}>{copied?'✓ Copied':'📋 Copy'}</button>
      </div>
      <div style={{fontFamily:'JetBrains Mono, monospace'}}>
        {lines.map((line,i) => {
          const isBold = line.startsWith('**') && line.includes('**');
          if (isBold) return <div key={i} style={{fontWeight:700,color: colors.text.secondary,marginTop:12,fontSize:13}}>{line.replace(/\*\*/g,'')}</div>;
          if (line.trim()==='') return <div key={i} style={{height:8}} />;
          return <div key={i} style={{color: colors.text.tertiary} style={{height:8}} />;
          return <div key={i} style={{color:'#999',fontSize:12,lineHeight:1.7}}>{line}</div>;
        })}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, logout } = useAuth();
  const { colors } = useTheme();
  const [tab, setTab] = useState('agents');

  const handleLogout = async () => { await logout(); window.location.href = '/login'; };

  return (
    <div style={{minHeight:'100vh',background: colors.bg.primary,color: colors.text.primary,fontFamily:'Syne,sans-serif'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Syne:wght@400;700;800;900&display=swap');
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#0d0d1a}::-webkit-scrollbar-thumb{background:#222;border-radius:3px}
        @keyframes gflow{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes sup{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        @media (max-width: 768px) {
          .dash-nav { padding: 10px 16px !important; flex-wrap: wrap; gap: 8px; }
          .dash-nav-tabs { gap: 0 !important; overflow-x: auto; }
          .dash-nav-tabs button { padding: 8px 10px !important; font-size: 11px !important; white-space: nowrap; }
          .dash-nav-user { gap: 6px !important; }
          .dash-nav-user span { display: none; }
          .dash-content { padding: 24px 16px !important; }
          .dash-hero h1 { font-size: 28px !important; }
          .agent-row { flex-direction: column !important; }
          .agent-row input { width: 100% !important; }
        }
      `}</style>

      {/* NAV */}
      <nav className="dash-nav" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'13px 48px',borderBottom:`1px solid ${colors.border.primary}`,background: colors.bg.nav,backdropFilter:'blur(10px)',position:'sticky',top:0,zIndex:100,flexWrap:'wrap',gap:8}}>
        <Link to="/" style={{display:'flex',alignItems:'center',gap:10,fontSize:18,fontWeight:800,color: colors.text.primary,textDecoration:'none',fontFamily:'Syne,sans-serif'}}>
          <div style={{width:32,height:32,borderRadius:8,background:'linear-gradient(135deg,#00d4ff,#7b2ff7)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:14,fontWeight:800}}>TF</div>
          ToolForge
        </Link>
        <div className="dash-nav-tabs" style={{display:'flex',gap:2}}>
          {['agents','profile','team'].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{background:'transparent',border:'none',borderBottom:`2px solid ${tab===t?'#00d4ff':'transparent'}`,padding:'8px 18px',fontSize:13,fontWeight:600,cursor:'pointer',color:tab===t? colors.text.primary: colors.text.tertiary,fontFamily:'Syne,sans-serif',transition:'all 0.2s'}}>
              {t==='agents'?'🤖 AI Agents':t==='profile'?'👤 Profile':'👥 Team'}
            </button>
          ))}
        </div>
        <div className="dash-nav-user" style={{display:'flex',alignItems:'center',gap:12}}>
          <span style={{color: colors.text.tertiary,fontSize:12,fontFamily:'JetBrains Mono,monospace'}}>@{user?.username}</span>
          <ThemeToggle />
          <button onClick={handleLogout} style={{background:'transparent',color:'#ff6b6b',border:'1px solid #ff6b6b33',padding:'7px 16px',borderRadius:8,fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'Syne,sans-serif'}}>Sign Out</button>
        </div>
      </nav>

      <div className="dash-content" style={{maxWidth:1080,margin:'0 auto',padding:'48px 32px'}}>

        {/* AGENTS TAB */}
        {tab==='agents' && (
          <div style={{animation:'sup 0.4s ease'}}>
            <div style={{textAlign:'center',marginBottom:48}}>
              <div style={{display:'inline-block',background:'#00d4ff0d',border:'1p, color: colors.text.primary}}>
                Agentic AI <span style={{background:'linear-gradient(135deg,#00d4ff,#a78bfa,#fb923c)',backgroundSize:'200% 200%',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',animation:'gflow 4s ease infinite'}}>Workflow Tasks</span>
              </h1>
              <p style={{color: colors.text.secondary
              <p style={{color:'#444',fontSize:15,maxWidth:520,margin:'0 auto 20px',lineHeight:1.7}}>Six intelligent agents that plan, reason, and execute tasks autonomously using large language models</p>
              <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:12,flexWrap:'wrap'}}>
                {[['6','#00d4ff','Active Agents'],['LLM','#a78bfa','Powered'],['Live','#34d399','Execution'],['Groq','#fb923c','Backend']].map(([v,c,l])=>(
                  <span key={l} style={{color:'#333',fontSize:13}}><span style={{color:c,fontWeight:700}}>{v}</span> {l}</span>
                ))}
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:24}}>
              <WebResearchAgent />
              <SQLAgent />
              <CodeReviewAgent />
              <WorkflowPlannerAgent />
              <PromptEngineerAgent />
              <APIIntegrationAgent />
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {tab==='profile' && (
          <div style={{animation:'sup 0.4s ease',maxWidth:580,margin:'0 auto'}}>, color: colors.text.primary}}>Your <span style={{color:'#00d4ff'}}>Profile</span></h1>
            <div style={{background: colors.bg.secondary,border:`1px solid ${colors.border.primary}`rginBottom:32}}>Your <span style={{color:'#00d4ff'}}>Profile</span></h1>
            <div style={{background:'#0d0d1a',border:'1px solid #1a1a2e',borderRadius:16,padding:40,textAlign:'center'}}>
              <div style={{width:88,height:88,borderRadius:'50%',background:'linear-gradient(135deg,#00d4ff,#7b2ff7)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:36,fontWeight:800,margin:'0 auto 16px',overflow:'hidden'}}>
                {user?.avatar?<img src={user.avatar} alt="" style={{width:'100%',height:'100%',objectFit:'cover'}}/>:user?.name?.charAt(0).toUpperCase()}
              </div>, color: colors.text.primary}}>{user?.name}</h2>
              <p style={{color: colors.text.tertiary,marginBottom:28,fontSize:13}}>ToolForge Member</p>
              {[['Full Name',user?.name, colors.text.secondary],['Username','@'+user?.username,'#00d4ff'],['Email',user?.email, colors.text.secondary],['Auth Method',user?.googleId?'Google OAuth 2.0':'Username & Password', colors.text.secondary]].map(([l,v,c])=>(
                <div key={l} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'13px 0',borderBottom:`1px solid ${colors.border.primary}`,textAlign:'left'}}>
                  <span style={{color: colors.text.tertiary:'flex',justifyContent:'space-between',alignItems:'center',padding:'13px 0',borderBottom:'1px solid #111',textAlign:'left'}}>
                  <span style={{color:'#444',fontSize:13}}>{l}</span>
                  <span style={{color:c,fontWeight:700,fontSize:13,fontFamily:'JetBrains Mono,monospace'}}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TEAM TAB */}
        {tab==='team' && (
          <div style={{animation:'sup 0.4s ease'}}>
            <div style={{textAlign:'center',marginBottom:40}}>
              <h1 style={{fontSize:38,fontWeight:900,marginBottom:8, color: colors.text.primary}}>Our <span style={{color:'#00d4ff'}}>Team</span></h1>
              <p style={{color: colors.text.secondary,fontSize:15}}>The engineers who built ToolForge</p>
            </div>
            <div style={{display:'flex',justifyContent:'center',gap:24,flexWrap:'wrap'}}>
              {[
                {i:'R',n:'Bada Ravi Kiran Reddy',r:'Full Stack & AI',c:'#34d399',d:'Designed and implemented the end-to-end ToolForge platform, including the AI reasoning engine, frontend UI, and backend architecture.'},
                {i:'T',n:'V.Tanish',r:'Frontend & UI/UX',c:'#00d4ff',d:'Specializes in frontend optimization and agentic workflow integration, ensuring a seamless user experience across the platform.'},
                {i:'E',n:'Kandunuri Eekshith Sai',r:'Backend & Database',c:'#fb923c',d:'Focuses on backend systems and API orchestration, building robust pipelines for autonomous agent execution.'},
              ].map(m=>(
                <div key={m.n} style={{background: colors.bg.secondary,border:`1px solid ${m.c}22`,borderRadius:16,padding:'32px 28px',textAlign:'center',maxWidth:320,flex:'1 1 300px'}}>
                  <div style={{width:72,height:72,borderRadius:'50%',background:`${m.c}18`,border:`2px solid ${m.c}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,fontWeight:800,color:m.c,margin:'0 auto 16px'}}>{m.i}</div>
                  <h3 style={{fontSize:17,fontWeight:800,marginBottom:8, color: colors.text.primary}}>{m.n}</h3>
                  <span style={{display:'inline-block',border:`1px solid ${m.c}44`,color:m.c,fontSize:11,fontWeight:700,padding:'3px 12px',borderRadius:20,marginBottom:14}}>{m.r}</span>
                  <p style={{color: colors.text.secondary,fontSize:13,lineHeight:1.7}}>{m.d}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <footer style={{borderTop:`1px solid ${colors.border.primary}`,padding:20,textAlign:'center',color: colors.text.tertiary,fontSize:12,fontFamily:'JetBrains Mono,monospace'}}>
        © 2026 ToolForge — LLM-Based Agentic AI for Tool-Using Reasoning Workflows
      </footer>
    </div>
  );
}

const s = {
  row: {display:'flex',gap:8,flexWrap:'wrap'},
  inp: {flex:1,minWidth:0,background:'#111',border:'1px solid #1e1e35',borderRadius:8,padding:'10px 14px',color:'#fff',fontSize:13,fontFamily:'JetBrains Mono,monospace',outline:'none',width:'100%'},
};

// Inject theme-aware scrollbar styles
const createThemeStyle = (colors) => `
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:${colors.bg.secondary}}
::-webkit-scrollbar-thumb{background:${colors.text.tertiary}33;border-radius:3px}
`;
