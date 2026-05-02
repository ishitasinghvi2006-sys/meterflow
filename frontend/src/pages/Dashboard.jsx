import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import api from '../services/api';

const generateChartData = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      day: d.toLocaleDateString('en', { weekday: 'short' }),
      requests: Math.floor(Math.random() * 100) + 10,
      latency: Math.floor(Math.random() * 200) + 50
    });
  }
  return days;
};

const StatCard = ({ label, value, sub, color, icon }) => (
  <div style={{ background:'#0f0f1a', borderRadius:'14px', border:'1px solid #1a1a2e', padding:'1.5rem', position:'relative', overflow:'hidden' }}>
    <div style={{ position:'absolute', top:'1rem', right:'1rem', fontSize:'1.5rem', opacity:0.3 }}>{icon}</div>
    <p style={{ color:'#666', fontSize:'0.8rem', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.5rem' }}>{label}</p>
    <p style={{ fontSize:'2.2rem', fontWeight:'bold', color: color || '#fff', marginBottom:'0.25rem' }}>{value}</p>
    {sub && <p style={{ color:'#555', fontSize:'0.8rem' }}>{sub}</p>}
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [billing, setBilling] = useState(null);
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newApi, setNewApi] = useState({ name:'', baseUrl:'' });
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [chartData] = useState(generateChartData());
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [s, b, a] = await Promise.all([
        api.get('/usage/stats'),
        api.get('/billing/current'),
        api.get('/apis')
      ]);
      setStats(s.data);
      setBilling(b.data.billing);
      setApis(a.data.apis);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  const createApi = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await api.post('/apis', newApi);
      setNewApi({ name:'', baseUrl:'' });
      setShowForm(false);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally { setCreating(false); }
  };

  const scrollToSection = (section) => {
    setActiveSection(section);
    const el = document.getElementById(section.toLowerCase());
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#050508', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <p style={{ color:'#666' }}>Loading dashboard...</p>
    </div>
  );

  return (
    <div style={{ minHeight:'100vh', background:'#050508', color:'#fff', display:'flex' }}>

      {/* Sidebar */}
      <div style={{ position:'fixed', left:0, top:0, bottom:0, width:'220px', background:'#0a0a12', borderRight:'1px solid #111', padding:'1.5rem', display:'flex', flexDirection:'column', zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'2.5rem' }}>
          <div style={{ width:'32px', height:'32px', background:'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'bold' }}>M</div>
          <span style={{ fontWeight:'bold' }}>MeterFlow</span>
        </div>

        {['Dashboard', 'APIs', 'Usage', 'Billing'].map(item => (
          <div key={item}
            onClick={() => scrollToSection(item)}
            style={{
              padding:'0.65rem 0.75rem',
              borderRadius:'8px',
              marginBottom:'0.25rem',
              color: activeSection === item ? '#fff' : '#aaa',
              background: activeSection === item ? '#1a1a2e' : 'transparent',
              fontSize:'0.9rem',
              cursor:'pointer',
              display:'flex',
              alignItems:'center',
              gap:'10px',
              transition:'all 0.2s'
            }}>
            <span style={{ color:'#6366f1', fontSize:'0.6rem' }}>●</span>
            {item}
          </div>
        ))}

        <div style={{ marginTop:'auto' }}>
          <button onClick={() => { sessionStorage.removeItem('token'); navigate('/login'); }}
            style={{ width:'100%', background:'none', border:'1px solid #1a1a2e', color:'#666', padding:'0.65rem', borderRadius:'8px', fontSize:'0.85rem', cursor:'pointer' }}>
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft:'220px', padding:'2rem', flex:1 }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem' }}>
          <div>
            <h1 style={{ fontSize:'1.5rem', fontWeight:'bold' }}>Overview</h1>
            <p style={{ color:'#555', fontSize:'0.85rem' }}>Welcome back! Here's what's happening.</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            style={{ background:'linear-gradient(135deg, #6366f1, #8b5cf6)', color:'#fff', border:'none', padding:'0.65rem 1.25rem', borderRadius:'10px', fontWeight:'600', fontSize:'0.9rem', cursor:'pointer' }}>
            + New API
          </button>
        </div>

        {/* Stat Cards */}
        <div id="dashboard" style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:'1rem', marginBottom:'2rem' }}>
          <StatCard label="Total Requests" value={stats?.totalRequests || 0} sub="All time" color="#6366f1" icon="⬡" />
          <StatCard label="Avg Latency" value={(stats?.avgLatency || 0) + 'ms'} sub="Response time" color="#10b981" icon="⬡" />
          <StatCard label="Error Rate" value={stats?.errorRate || '0%'} sub="This month" color="#f59e0b" icon="⬡" />
          <StatCard label="Current Bill" value={'₹' + (billing?.amount || 0)} sub={(billing?.totalRequests || 0) + ' requests'} color="#8b5cf6" icon="⬡" />
        </div>

        {/* Create API Form */}
        {showForm && (
          <div style={{ background:'#0f0f1a', border:'1px solid #1a1a2e', borderRadius:'14px', padding:'1.5rem', marginBottom:'2rem' }}>
            <h3 style={{ marginBottom:'1rem', fontSize:'1rem' }}>Create New API</h3>
            <form onSubmit={createApi} style={{ display:'flex', gap:'1rem', alignItems:'flex-end' }}>
              <div style={{ flex:1 }}>
                <label style={{ color:'#666', fontSize:'0.8rem', display:'block', marginBottom:'0.4rem' }}>API Name</label>
                <input value={newApi.name} onChange={e => setNewApi({...newApi, name:e.target.value})}
                  style={{ width:'100%', background:'#050508', color:'#fff', padding:'0.7rem', borderRadius:'8px', border:'1px solid #1a1a2e', outline:'none', boxSizing:'border-box' }}
                  placeholder="Weather API" required />
              </div>
              <div style={{ flex:2 }}>
                <label style={{ color:'#666', fontSize:'0.8rem', display:'block', marginBottom:'0.4rem' }}>Base URL</label>
                <input value={newApi.baseUrl} onChange={e => setNewApi({...newApi, baseUrl:e.target.value})}
                  style={{ width:'100%', background:'#050508', color:'#fff', padding:'0.7rem', borderRadius:'8px', border:'1px solid #1a1a2e', outline:'none', boxSizing:'border-box' }}
                  placeholder="https://api.example.com" required />
              </div>
              <button type="submit" disabled={creating}
                style={{ background:'#6366f1', color:'#fff', border:'none', padding:'0.7rem 1.5rem', borderRadius:'8px', fontWeight:'600', cursor:'pointer', whiteSpace:'nowrap', opacity: creating ? 0.7 : 1 }}>
                {creating ? 'Creating...' : 'Create API'}
              </button>
            </form>
          </div>
        )}

        {/* Charts */}
        <div id="usage" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', marginBottom:'2rem' }}>
          <div style={{ background:'#0f0f1a', borderRadius:'14px', border:'1px solid #1a1a2e', padding:'1.5rem' }}>
            <h3 style={{ fontSize:'0.9rem', fontWeight:'600', marginBottom:'0.25rem' }}>Requests (Last 7 days)</h3>
            <p style={{ color:'#555', fontSize:'0.8rem', marginBottom:'1.5rem' }}>Daily API request volume</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="reqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#111" />
                <XAxis dataKey="day" stroke="#444" fontSize={12} />
                <YAxis stroke="#444" fontSize={12} />
                <Tooltip contentStyle={{ background:'#0a0a12', border:'1px solid #222', borderRadius:'8px', color:'#fff' }} />
                <Area type="monotone" dataKey="requests" stroke="#6366f1" fill="url(#reqGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div style={{ background:'#0f0f1a', borderRadius:'14px', border:'1px solid #1a1a2e', padding:'1.5rem' }}>
            <h3 style={{ fontSize:'0.9rem', fontWeight:'600', marginBottom:'0.25rem' }}>Latency (Last 7 days)</h3>
            <p style={{ color:'#555', fontSize:'0.8rem', marginBottom:'1.5rem' }}>Average response time in ms</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#111" />
                <XAxis dataKey="day" stroke="#444" fontSize={12} />
                <YAxis stroke="#444" fontSize={12} />
                <Tooltip contentStyle={{ background:'#0a0a12', border:'1px solid #222', borderRadius:'8px', color:'#fff' }} />
                <Line type="monotone" dataKey="latency" stroke="#10b981" strokeWidth={2} dot={{ fill:'#10b981', r:4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* APIs Table */}
        <div id="apis" style={{ background:'#0f0f1a', borderRadius:'14px', border:'1px solid #1a1a2e', overflow:'hidden', marginBottom:'1.5rem' }}>
          <div style={{ padding:'1.25rem 1.5rem', borderBottom:'1px solid #111', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <h3 style={{ fontSize:'1rem', fontWeight:'600' }}>My APIs</h3>
            <span style={{ color:'#555', fontSize:'0.8rem' }}>{apis.length} total</span>
          </div>
          {apis.length === 0 ? (
            <div style={{ padding:'3rem', textAlign:'center' }}>
              <p style={{ color:'#555' }}>No APIs yet — click "+ New API" to get started</p>
            </div>
          ) : (
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:'0.9rem' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid #111' }}>
                  <th style={{ textAlign:'left', padding:'0.85rem 1.5rem', color:'#555', fontWeight:'500', fontSize:'0.8rem' }}>NAME</th>
                  <th style={{ textAlign:'left', padding:'0.85rem 1.5rem', color:'#555', fontWeight:'500', fontSize:'0.8rem' }}>BASE URL</th>
                  <th style={{ textAlign:'left', padding:'0.85rem 1.5rem', color:'#555', fontWeight:'500', fontSize:'0.8rem' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {apis.map((a, i) => (
                  <tr key={a._id} style={{ borderBottom: i < apis.length-1 ? '1px solid #0a0a12' : 'none' }}>
                    <td style={{ padding:'1rem 1.5rem', fontWeight:'500' }}>{a.name}</td>
                    <td style={{ padding:'1rem 1.5rem', color:'#555', fontFamily:'monospace', fontSize:'0.85rem' }}>{a.baseUrl}</td>
                    <td style={{ padding:'1rem 1.5rem' }}>
                      <span style={{ background:'#052e16', color:'#4ade80', padding:'0.25rem 0.75rem', borderRadius:'20px', fontSize:'0.75rem', fontWeight:'500' }}>● Active</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Billing Summary */}
        <div id="billing" style={{ background:'linear-gradient(135deg, #0f0520, #1a0533)', borderRadius:'14px', border:'1px solid #2d1b4e', padding:'1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <p style={{ color:'#a78bfa', fontSize:'0.8rem', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.5rem' }}>This Month's Usage</p>
            <p style={{ fontSize:'1.8rem', fontWeight:'bold' }}>{billing?.totalRequests || 0} <span style={{ fontSize:'1rem', color:'#666' }}>requests</span></p>
            <p style={{ color:'#666', fontSize:'0.85rem', marginTop:'0.25rem' }}>First 1,000 requests are free</p>
          </div>
          <div style={{ textAlign:'right' }}>
            <p style={{ color:'#666', fontSize:'0.85rem' }}>Amount due</p>
            <p style={{ fontSize:'2rem', fontWeight:'bold', color:'#8b5cf6' }}>₹{billing?.amount || 0}</p>
          </div>
        </div>

      </div>
    </div>
  );
}