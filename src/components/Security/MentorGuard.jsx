import React, { useState } from 'react';

const MentorGuard = ({ children }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const MENTOR_KEY = "admin123"; // Change this to your desired key

  const handleVerify = () => {
    if (input === MENTOR_KEY) {
      setIsUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (isUnlocked) {
    return children;
  }

  return (
    <div style={styles.overlay}>
      <div style={styles.card}>
        <h2 style={styles.title}>Interviewer Access</h2>
        <p style={styles.subtitle}>Please enter the security key to continue</p>
        
        <input 
          type="password" 
          placeholder="Security Key" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
          style={{
            ...styles.input,
            borderColor: error ? '#ff4d4d' : '#ccc'
          }}
        />
        
        {error && <p style={styles.errorText}>Invalid key. Please try again.</p>}
        
        <button onClick={handleVerify} style={styles.button}>
          Unlock Dashboard
        </button>
      </div>
    </div>
  );
};

// Inline CSS Styles
const styles = {
  overlay: {
    height: '100vh',
    width: '100vw',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f2f5',
    fontFamily: 'Arial, sans-serif'
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
    width: '100%',
    maxWidth: '400px'
  },
  title: {
    margin: '0 0 10px 0',
    color: '#333'
  },
  subtitle: {
    color: '#666',
    marginBottom: '20px'
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px',
    boxSizing: 'border-box',
    outline: 'none'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background 0.3s'
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: '14px',
    marginBottom: '10px'
  }
};

export default MentorGuard;
