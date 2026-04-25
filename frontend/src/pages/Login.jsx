import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      sessionStorage.setItem('token', data.accessToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#050508', display:'flex' }}>
      {/* Left Side */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'4rem', background:'linear-gradient(135deg, #0f0f1a 0%, #1a0533 100%)' }}>
        <div style={{ marginBottom:'3rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'1rem' }}>
            <div style={{ width:'40px', height:'40px', background:'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold', fontSize:'1.2rem' }}>M</div>
            <span style={{ fontSize:'1.5rem', fontWeight:'bold', color:'#fff' }}>MeterFlow</span>
          </div>
          <h2 style={{ fontSize:'2.5rem', fontWeight:'bold', color:'#fff', lineHeight:1.2, marginBottom:'1rem' }}>
            The API Billing<br /><span style={{ color:'#8b5cf6' }}>Platform</span>
          </h2>
          <p style={{ color:'#888', fontSize:'1rem', lineHeight:1.6 }}>Track usage, apply rate limits, and bill your users — all in one platform.</p>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {['API Gateway with request tracking', 'Usage-based billing engine', 'Real-time analytics dashboard'].map(f => (
            <div key={f} style={{ display:'flex', alignItems:'center', gap:'10px' }}>
              <div style={{ width:'20px', height:'20px', borderRadius:'50%', background:'#1a1a2e', border:'2px solid #6366f1', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', color:'#6366f1' }}>✓</div>
              <span style={{ color:'#aaa', fontSize:'0.9rem' }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Side */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
        <div style={{ width:'100%', maxWidth:'420px' }}>
          <h1 style={{ fontSize:'1.8rem', fontWeight:'bold', color:'#fff', marginBottom:'0.5rem' }}>Welcome back</h1>
          <p style={{ color:'#666', marginBottom:'2rem' }}>Sign in to your MeterFlow account</p>

          {error && (
            <div style={{ background:'#1a0505', border:'1px solid #5c1a1a', borderRadius:'8px', padding:'0.75rem 1rem', marginBottom:'1.5rem', color:'#f87171', fontSize:'0.9rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom:'1.25rem' }}>
              <label style={{ color:'#aaa', fontSize:'0.85rem', display:'block', marginBottom:'0.5rem' }}>Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                style={{ width:'100%', background:'#0f0f1a', color:'#fff', padding:'0.85rem 1rem', borderRadius:'10px', border:'1px solid #222', outline:'none', fontSize:'0.95rem', boxSizing:'border-box' }}
                placeholder="you@example.com" required />
            </div>
            <div style={{ marginBottom:'1.5rem' }}>
              <label style={{ color:'#aaa', fontSize:'0.85rem', display:'block', marginBottom:'0.5rem' }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                style={{ width:'100%', background:'#0f0f1a', color:'#fff', padding:'0.85rem 1rem', borderRadius:'10px', border:'1px solid #222', outline:'none', fontSize:'0.95rem', boxSizing:'border-box' }}
                placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading}
              style={{ width:'100%', background:'linear-gradient(135deg, #6366f1, #8b5cf6)', color:'#fff', padding:'0.85rem', borderRadius:'10px', border:'none', fontWeight:'600', fontSize:'1rem', cursor:'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p style={{ color:'#666', fontSize:'0.85rem', marginTop:'1.5rem', textAlign:'center' }}>
            Don't have an account? <Link to="/register" style={{ color:'#8b5cf6', textDecoration:'none', fontWeight:'500' }}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}