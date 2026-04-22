import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';

export default function Home() {
  const { user, logout } = useAuth();
  const { colors } = useTheme();

  return (
    <div style={{...styles.container, background: colors.bg.primary, color: colors.text.primary}}>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes fadeInUp { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes pulse {
          0% { opacity: 0.4; }
          50% { opacity: 0.7; }
          100% { opacity: 0.4; }
        }
        .hero-title { animation: fadeInUp 0.6s ease-out 0.1s backwards; }
        .hero-subtitle { animation: fadeInUp 0.6s ease-out 0.2s backwards; }
        .hero-btns { animation: fadeInUp 0.6s ease-out 0.3s backwards; }
        .about-card { 
          animation: fadeInUp 0.6s ease-out 0.4s backwards; 
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
          backdrop-filter: blur(10px);
        }
        .about-card:hover { 
          transform: translateY(-5px) scale(1.02);
          border-color: #00d4ff66 !important; 
          box-shadow: 0 20px 40px rgba(0,212,255,0.15); 
        }
        .tech-item { transition: transform 0.3s ease; }
        .tech-item:hover { transform: translateY(-4px); }
        .btn-nav-link { transition: all 0.3s ease; }
        .btn-nav-link:hover { transform: translateY(-2px); }
        .grid-bg {
          position: fixed;
          top: 0; left: 0; width: 100%; height: 100%;
          background-image: 
            linear-gradient(rgba(0, 212, 255, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          z-index: 0;
          pointer-events: none;
        }
        .glow {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(123, 47, 247, 0.15) 0%, transparent 70%);
          top: -10%;
          left: -10%;
          z-index: 0;
          filter: blur(100px);
          animation: pulse 10s infinite alternate;
        }
        .glow-right {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(0, 212, 255, 0.1) 0%, transparent 70%);
          bottom: -10%;
          right: -10%;
          z-index: 0;
          filter: blur(100px);
          animation: pulse 12s infinite alternate-reverse;
        }
        @media (max-width: 768px) {
          .nav-inner { padding: 16px 20px !important; }
          .nav-links { display: none !important; }
          .hero-wrap { flex-direction: column !important; padding: 40px 20px 32px !important; min-height: auto !important; gap: 32px !important; }
          .hero-left { max-width: 100% !important; text-align: center; }
          .hero-title { font-size: clamp(2.2rem, 10vw, 3.8rem) !important; }
          .hero-btns { justify-content: center !important; flex-wrap: wrap; }
          .hero-right { max-width: 100% !important; width: 100% !important; }
          .tech-bar { padding: 24px 20px !important; gap: 20px !important; flex-wrap: wrap !important; justify-content: center !important; }
          .footer-inner { padding: 20px 20px !important; }
          .stats-bar { justify-content: center !important; }
        }
      `}</style>

      <div className="grid-bg" />
      <div className="glow" />
      <div className="glow-right" />

      {/* NAVBAR */}
      <nav style={{...styles.nav, background: colors.bg.nav, borderBottomColor: colors.border.primary}}>
        <div style={styles.navInner} className="nav-inner">
          <Link to="/" style={{...styles.navLogo, color: colors.text.primary}}>
            <div style={styles.logoIcon}>TF</div>
            <span>ToolForge</span>
          </Link>
          <div style={styles.navLinks} className="nav-links">
            {user ? (
              <button onClick={logout} style={styles.btnNav}>Logout</button>
            ) : (
              <>
                <Link to="/login" style={{...styles.link, color: colors.text.secondary}}>Login</Link>
                <Link to="/signup" style={styles.btnNav}>Get Started</Link>
              </>
            )}
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section style={styles.hero}>
        <div style={styles.heroInner} className="hero-wrap">
          <div style={styles.heroContent}>
            <h1 style={{...styles.title, color: colors.text.primary}} className="hero-title">
              LLM-Based <span style={styles.highlight}>Agentic AI</span><br />
              Workflow Automation
            </h1>
            <p style={{...styles.subtitle, color: colors.text.secondary}} className="hero-subtitle">
              Six specialized AI agents powered by{' '}
              <strong style={{color:'#00d4ff'}}>LangGraph.js</strong> and{' '}
              <strong style={{color:'#a78bfa'}}>Groq Llama 3.3</strong>{' '}
              — plan, reason, use tools, and execute tasks autonomously.
            </p>
            <div style={styles.heroBtns} className="hero-btns">
              <Link to="/signup" style={styles.btnCreate} className="btn-nav-link">Create Account →</Link>
              <Link to="/login" style={{...styles.btnLogin, background: colors.bg.secondary, borderColor: colors.border.primary, color: colors.text.primary}} className="btn-nav-link">Sign In</Link>
            </div>
            
            {/* QUICK STATS MOVED HERE FOR BETTER FILL */}
            <div style={{...styles.statsBar, background: colors.bg.secondary, borderColor: colors.border.primary}} className="stats-bar">
              <div style={styles.statItem}>
                <span style={{...styles.statVal, color: colors.text.primary}}>6</span>
                <span style={{...styles.statLab, color: colors.text.tertiary}}>Agents</span>
              </div>
              <div style={{...styles.statDivider, background: colors.border.primary}} />
              <div style={styles.statItem}>
                <span style={{...styles.statVal, color: colors.text.primary}}>100%</span>
                <span style={{...styles.statLab, color: colors.text.tertiary}}>Autonomous</span>
              </div>
              <div style={{...styles.statDivider, background: colors.border.primary}} />
              <div style={styles.statItem}>
                <span style={{...styles.statVal, color: colors.text.primary}}>&lt;2s</span>
                <span style={{...styles.statLab, color: colors.text.tertiary}}>Latency</span>
              </div>
            </div>
          </div>

          <div style={styles.heroRight} className="hero-right">
            <div style={{...styles.aboutCard, background: colors.bg.secondary, borderColor: colors.border.primary}} className="about-card">
              <h2 style={{...styles.cardTitle, color: colors.text.primary}}>About This Platform</h2>
              <p style={{...styles.cardText, color: colors.text.secondary}}>
                ToolForge is a production-grade platform with native agentic AI reasoning.
                Six intelligent agents that actually execute tools, query live MongoDB, and search the web in real-time.
              </p>
              <div style={styles.featureList}>
                {[
                  ['🤖', 'ReAct Loop (LangGraph.js)', 'Think → Act → Observe using real tools, natively in Node.js'],
                  ['🔍', '6 Specialized Agents', 'Research, MongoDB, Code Review, Workflow, Prompt & API agents'],
                  ['🔒', 'JWT Authentication', 'Stateless JWT + Google OAuth 2.0, bcrypt password hashing'],
                  ['⚡', 'Full DevOps Pipeline', 'Docker + Jenkins CI/CD + Render cloud + LangSmith observability'],
                ].map(([icon, title, desc]) => (
                  <div style={styles.featureItem} key={title}>
                    <div style={styles.featureIcon}>{icon}</div>
                    <div style={styles.featureText}>
                      <strong style={{color: colors.text.primary, display:'block', marginBottom:2}}>{title}</strong>
                      <span style={{color: colors.text.tertiary, fontSize:13}}>{desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TECH BAR */}
      <div style={{...styles.techBar, background: colors.bg.secondary, borderTopColor: colors.border.primary}}>
        <div style={styles.techBarInner} className="tech-bar">
          {[
            ['🍃', 'MongoDB', 'Atlas Database'],
            ['⚡', 'Express', 'REST API'],
            ['⚛️', 'React', 'Vite Frontend'],
            ['🟢', 'Node.js', 'ESM Runtime'],
            ['🦜', 'LangGraph.js', 'ReAct Engine'],
            ['🤖', 'Groq', 'Llama 3.3 LLM'],
            ['🔵', 'LangSmith', 'Observability'],
            ['🐳', 'Docker', 'Containerized'],
            ['🔧', 'Jenkins', 'CI/CD'],
          ].map(([icon, name, label]) => (
            <div style={styles.techItem} className="tech-item" key={name}>
              <span style={{fontSize:18, marginBottom:4}}>{icon}</span>
              <strong style={{color: colors.text.primary, fontSize:13}}>{name}</strong>
              <span style={{color: colors.text.tertiary, fontSize:11}}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <footer style={{...styles.footer, borderTopColor: colors.border.primary}}>
        <div style={{...styles.footerInner, color: colors.text.tertiary}} className="footer-inner">
          <p>© 2026 ToolForge — LLM-Based Agentic AI Platform.</p>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
    maxWidth: '100vw',
    overflowX: 'hidden',
    position: 'relative'
  },
  nav: {
    borderBottom: '1px solid #1e1e2e',
    display: 'flex',
    justifyContent: 'center'
  },
  navInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 40px',
    width: '100%',
    maxWidth: '1300px'
  },
  navLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '20px',
    fontWeight: '700',
    textDecoration: 'none'
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    background: 'linear-gradient(135deg, #00d4ff, #7b2ff7)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '800',
    color: '#fff'
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  link: {
    textDecoration: 'none',
    fontSize: '15px',
    padding: '9px 20px',
    borderRadius: '8px'
  },
  btnNav: {
    background: 'linear-gradient(135deg, #00d4ff, #7b2ff7)',
    color: '#fff',
    fontWeight: '600',
    padding: '9px 22px',
    borderRadius: '8px',
    textDecoration: 'none',
    fontSize: '14px',
    border: 'none',
    cursor: 'pointer'
  },
  hero: {
    display: 'flex',
    justifyContent: 'center',
    padding: '60px 40px',
    minHeight: 'auto',
  },
  heroInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '100px',
    width: '100%',
    maxWidth: '1300px',
    padding: '40px 0'
  },
  heroContent: {
    flex: '0 1 auto',
    maxWidth: '650px',
    textAlign: 'left'
  },
  title: {
    fontSize: 'clamp(2.8rem, 5.5vw, 5rem)',
    fontWeight: '900',
    lineHeight: '1.0',
    letterSpacing: '-2px',
    marginBottom: '24px'
  },
  highlight: {
    background: 'linear-gradient(135deg, #00d4ff, #7b2ff7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subtitle: {
    fontSize: '18px',
    lineHeight: '1.6',
    marginBottom: '40px',
    maxWidth: '550px'
  },
  heroBtns: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center'
  },
  btnCreate: {
    background: 'linear-gradient(135deg, #00d4ff, #7b2ff7)',
    color: '#fff',
    padding: '14px 28px',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '700',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    display: 'inline-block',
  },
  btnLogin: {
    padding: '14px 28px',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    display: 'inline-block',
    backdropFilter: 'blur(10px)',
    border: '1px solid'
  },
  statsBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '30px',
    marginTop: '60px',
    padding: '24px 32px',
    borderRadius: '12px',
    width: 'fit-content',
    border: '1px solid'
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  statVal: {
    fontSize: '24px',
    fontWeight: '800'
  },
  statLab: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: '600'
  },
  statDivider: {
    width: '1px',
    height: '30px'
  },
  heroRight: {
    flex: '0 1 auto',
    maxWidth: '460px',
    display: 'flex',
    justifyContent: 'center'
  },
  aboutCard: {
    border: '1px solid',
    borderRadius: '16px',
    padding: '32px'
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '700',
    marginBottom: '12px'
  },
  cardText: {
    fontSize: '14px',
    lineHeight: '1.7',
    marginBottom: '20px'
  },
  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px'
  },
  featureItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px'
  },
  featureIcon: {
    width: '34px',
    height: '34px',
    background: 'linear-gradient(135deg, #00d4ff15, #7b2ff715)',
    border: '1px solid #00d4ff33',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '15px',
    flexShrink: 0
  },
  featureText: {
    flex: '1'
  },
  techBar: {
    borderTop: '1px solid',
    display: 'flex',
    justifyContent: 'center'
  },
  techBarInner: {
    padding: '24px 40px',
    display: 'flex',
    gap: '32px',
    alignItems: 'center',
    justifyContent: 'center',
    overflowX: 'auto',
    width: '100%',
    maxWidth: '1300px'
  },
  techItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    flexShrink: 0
  },
  footer: {
    borderTop: '1px solid',
    display: 'flex',
    justifyContent: 'center'
  },
  footerInner: {
    padding: '24px 40px',
    textAlign: 'center',
    fontSize: '13px',
    width: '100%',
    maxWidth: '1300px'
  }
};
