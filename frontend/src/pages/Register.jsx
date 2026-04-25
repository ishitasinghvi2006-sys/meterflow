import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      sessionStorage.setItem('token', data.accessToken);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0a0a0f' }}>
      <div style={{ background:'#111118', padding:'2rem', borderRadius:'16px', width:'100%', maxWidth:'400px', border:'1px solid #222' }}>
        <h1 style={{ fontSize:'1.8rem', fontWeight:'bold', color:'white', marginBottom:'0.5rem' }}>Create Account</h1>
        <p style={{ color:'#888', marginBottom:'2rem' }}>Join MeterFlow today</p>

        {error && <p style={{ color:'#f87171', marginBottom:'1rem', fontSize:'0.9rem' }}>{error}</p>}

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom:'1rem' }}>
            <label style={{ color:'#888', fontSize:'0.85rem' }}>Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)}
              style={{ width:'100%', marginTop:'0.3rem', background:'#1a1a25', color:'#fff', padding:'0.75rem', borderRadius:'8px', border:'1px solid #333', outline:'none', display:'block', boxSizing:'border-box' }}
              placeholder="Your name" required />
          </div>
          <div style={{ marginBottom:'1rem' }}>
            <label style={{ color:'#888', fontSize:'0.85rem' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              style={{ width:'100%', marginTop:'0.3rem', background:'#1a1a25', color:'#fff', padding:'0.75rem', borderRadius:'8px', border:'1px solid #333', outline:'none', display:'block', boxSizing:'border-box' }}
              placeholder="you@example.com" required />
          </div>
          <div style={{ marginBottom:'1.5rem' }}>
            <label style={{ color:'#888', fontSize:'0.85rem' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              style={{ width:'100%', marginTop:'0.3rem', background:'#1a1a25', color:'#fff', padding:'0.75rem', borderRadius:'8px', border:'1px solid #333', outline:'none', display:'block', boxSizing:'border-box' }}
              placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={loading}
            style={{ width:'100%', background:'#2563eb', color:'#fff', padding:'0.75rem', borderRadius:'8px', border:'none', fontWeight:'600', fontSize:'1rem', cursor:'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p style={{ color:'#888', fontSize:'0.85rem', marginTop:'1rem', textAlign:'center' }}>
          Have account? <Link to="/login" style={{ color:'#60a5fa' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}