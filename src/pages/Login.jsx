import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { setAuthCredentials } from '../utils/auth';
import axios from 'axios';

export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError]=useState("");
  
  const [loading,setLoading]=useState(false);
  const navigate = useNavigate();

  const handleSubmit=async(e)=>{
    e.preventDefault();
    setError("");
    setLoading(true);


  try{
    const credentials=btoa(`${username}:${password}`);
    const response=await axios.get('http://localhost:8080/user/me',{
      headers:{
        'Authorization':`Basic ${credentials}`
      }
      
    });
    //if successsful
    if(response.data){
      setAuthCredentials(username,password);
      navigate('/dashboard');
    }
  }catch(err){
      setError("Invalid username or password");
      console.error('Login error:', err);
    }finally{
      setLoading(false);
    }
  };
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Welcome back</h1>
          <p style={styles.subtitle}>Sign in to continue to your dashboard</p>
          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Username</label>
              <input 
                type="text" 
                placeholder="Enter your username" 
                value={username}
                required
                onChange={(e)=>setUsername(e.target.value)}
                style={styles.input}
                autoComplete="username"
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input 
                type="password"
                placeholder="Enter your password"
                value={password}
                required
                onChange={(e)=>setPassword(e.target.value)}
                style={styles.input}
                autoComplete="current-password"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              style={{ ...styles.button, ...(loading ? styles.buttonDisabled : {}) }}
            >
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </form>

          <p style={styles.linkText}>
            Don’t have an account? <Link to="/register" style={styles.link}>Register</Link>
          </p>
        </div>
      </div>
    );
  }

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '24px'
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    background: '#fff',
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.25)'
  },
  title: {
    margin: 0,
    fontSize: '28px',
    lineHeight: 1.2,
    color: '#1f2937',
    textAlign: 'center'
  },
  subtitle: {
    marginTop: '8px',
    marginBottom: '24px',
    fontSize: '14px',
    color: '#6b7280',
    textAlign: 'center'
  },
  error: {
    background: '#fee2e2',
    color: '#991b1b',
    border: '1px solid #fecaca',
    padding: '10px 12px',
    borderRadius: '8px',
    marginBottom: '16px',
    textAlign: 'center'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    color: '#374151',
    fontWeight: 600
  },
  input: {
    padding: '12px 14px',
    fontSize: '16px',
    borderRadius: '10px',
    border: '2px solid #e5e7eb',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s'
  },
  button: {
    marginTop: '8px',
    padding: '12px 16px',
    background: '#667eea',
    color: '#fff',
    fontWeight: 700,
    fontSize: '16px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(102,126,234,0.35)'
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed'
  },
  linkText: {
    marginTop: '16px',
    textAlign: 'center',
    color: '#6b7280'
  },
  link: {
    color: '#667eea',
    fontWeight: 700,
    textDecoration: 'none'
  }
};