import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div style={styles.container}>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes fadeInUp { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        @keyframes pulse { 
          0%, 100% { opacity: 1; } 
          50% { opacity: 0.7; } 
        }
        .hero-title { animation: fadeInUp 0.6s ease-out 0.1s backwards; }
        .hero-subtitle { animation: fadeInUp 0.6s ease-out 0.2s backwards; }
        .hero-btns { animation: fadeInUp 0.6s ease-out 0.3s backwards; }
        .about-card { animation: fadeInUp 0.6s ease-out 0.4s backwards; transition: all 0.3s ease; }
        .about-card:hover { border-color: #00d4ff33 !important; box-shadow: 0 10px 40px rgba(0,212,255,0.08); }
        .tech-item { transition: transform 0.3s ease; }
        .tech-item:hover { transform: translateY(-4px); }
        .btn-nav-link { transition: all 0.3s ease; }
        .btn-nav-link:hover { transform: translateY(-2px); }
        @media (max-width: 768px) {
          .nav-inner { padding: 16px 20px !important; }
          .nav-links { display: none !important; }
          .hero-wrap { flex-direction: column !important; padding: 40px 20px 32px !important; min-height: auto !important; gap: 32px !important; }
          .hero-left { max-width: 100% !important; text-align: center; }
          .hero-title { font-size: clamp(2rem, 9vw, 3.2rem) !important; }
          .hero-btns { justify-content: center !important; flex-wrap: wrap; }
          .hero-right { max-width: 100% !important; width: 100% !important; }
          .tech-bar { padding: 24px 20px !important; gap: 20px !important; flex-wrap: wrap !important; justify-content: center !important; }
          .footer-inner { padding: 20px 20px !important; }
        }
        @media (max-width: 480px) {
          .hero-title { font-size: clamp(1.8rem, 8vw, 2.6rem) !important; }
          .about-card { padding: 24px 20px !important; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={styles.nav} className="nav-inner">
        <Link to="/" style={styles.navLogo}>
          <div style={styles.logoIcon}>TF</div>
          <span>ToolForge</span>
        </Link>
        <div style={styles.navLinks} className="nav-links">
          {user ? (
            <Link to="/dashboard" style={styles.btnNav}>Dashboard →</Link>
          ) : (
            <>
              <Link to="/login" style={styles.link}>Login</Link>
              <Link to="/signup" style={styles.btnNav}>Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* HERO SECTION */}
      <section style={styles.hero} className="hero-wrap">
        <div style={styles.heroLeft} className="hero-left">
          <h1 style={styles.title} className="hero-title">
            LLM-Based<br />
            <span style={styles.highlight}>Agentic AI</span><br />
            Workflow<br />
            Automation
          </h1>
          <p style={styles.subtitle} className="hero-subtitle">
            Six specialized AI agents powered by{' '}
            <strong style={{color:'#00d4ff'}}>LangGraph.js</strong> and{' '}
            <strong style={{color:'#a78bfa'}}>Groq Llama 3.3</strong>{' '}
            — plan, reason, use tools, and execute tasks autonomously.
          </p>
          <div style={styles.heroBtns} className="hero-btns">
            <Link to="/signup" style={styles.btnCreate} className="btn-nav-link">Create Account →</Link>
            <Link to="/login" style={styles.btnLogin} className="btn-nav-link">Sign In</Link>
          </div>
        </div>

        <div style={styles.heroRight} className="hero-right">
          <div style={styles.aboutCard} className="about-card">
            <h2 style={styles.cardTitle}>About This Platform</h2>
            <p style={styles.cardText}>
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
                    <strong style={{color:'#fff', display:'block', marginBottom:2}}>{title}</strong>
                    <span style={{color:'#666', fontSize:13}}>{desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TECH BAR */}
      <div style={styles.techBar} className="tech-bar">
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
            <strong style={{color:'#fff', fontSize:13}}>{name}</strong>
            <span style={{color:'#555', fontSize:11}}>{label}</span>
          </div>
        ))}
      </div>

      <footer style={styles.footer} className="footer-inner">
        <p>© 2026 ToolForge — LLM-Based Agentic AI Platform.</p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0a0a0f',
    color: '#fff',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxWidth: '100vw',
    overflowX: 'hidden'
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '18px 60px',
    borderBottom: '1px solid #1e1e2e',
  },
  navLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '20px',
    fontWeight: '700',
    color: '#fff',
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
    color: '#aaa',
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
    fontSize: '14px'
  },
  hero: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '80px 60px',
    minHeight: '85vh',
    gap: '40px',
  },
  heroLeft: {
    flex: '1',
    maxWidth: '620px'
  },
  badge: {
    display: 'inline-block',
    background: '#00d4ff0d',
    border: '1px solid #00d4ff33',
    color: '#00d4ff',
    fontSize: '11px',
    fontWeight: '700',
    padding: '5px 14px',
    borderRadius: '20px',
    marginBottom: '20px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase'
  },
  title: {
    fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
    fontWeight: '900',
    lineHeight: '1.05',
    color: '#fff',
    marginBottom: '20px'
  },
  highlight: {
    background: 'linear-gradient(135deg, #00d4ff, #7b2ff7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  },
  subtitle: {
    fontSize: '16px',
    color: '#777',
    lineHeight: '1.8',
    marginBottom: '40px',
    maxWidth: '500px'
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
    background: 'transparent',
    color: '#ccc',
    padding: '14px 28px',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    textDecoration: 'none',
    border: '1.5px solid #333',
    transition: 'all 0.3s ease',
    display: 'inline-block',
  },
  heroRight: {
    flex: '1',
    maxWidth: '460px'
  },
  aboutCard: {
    background: '#0d0d1a',
    border: '1px solid #1e1e35',
    borderRadius: '16px',
    padding: '32px'
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#fff',
    marginBottom: '12px'
  },
  cardText: {
    color: '#666',
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
    background: '#0d0d18',
    borderTop: '1px solid #1a1a2e',
    padding: '24px 60px',
    display: 'flex',
    gap: '36px',
    alignItems: 'center',
    overflowX: 'auto'
  },
  techItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    flexShrink: 0
  },
  footer: {
    borderTop: '1px solid #1a1a2e',
    padding: '24px 60px',
    textAlign: 'center',
    color: '#444',
    fontSize: '13px',
  }
};
