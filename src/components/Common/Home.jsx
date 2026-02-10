import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={styles.fullPage}>
      <div style={styles.overlay}>
        <h1 style={styles.mainTitle}>Secure Assessment Portal</h1>
        <p style={styles.subTitle}>Select your role to continue</p>
        
        <div style={styles.grid}>
          {/* Student Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Candidate</h3>
            <p style={styles.cardText}>
              Start your exam. Browser lock and screen recording will be activated.
            </p>
            <button onClick={() => navigate('/candidate')} style={styles.studentBtn}>
              Start Assessment
            </button>
          </div>

          {/* Mentor Card */}
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Interviewer</h3>
            <p style={styles.cardText}>
              Review submissions, audit behavioral logs, and grade results.
            </p>
            <button onClick={() => navigate('/mentor')} style={styles.mentorBtn}>
              Review Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  // 1. Makes the background cover the ENTIRE screen
  fullPage: {
    width: '100vw',
    height: '100vh',
    margin: 0,
    padding: 0,
    backgroundColor: '#f0f2f5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    overflow: 'hidden' // Prevents scrolling on the landing page
  },
  overlay: {
    textAlign: 'center',
    width: '100%',
    maxWidth: '1000px',
    padding: '20px'
  },
  mainTitle: {
    fontSize: '3rem',
    color: '#1a1a1a',
    marginBottom: '10px',
    fontWeight: '700'
  },
  subTitle: {
    fontSize: '1.2rem',
    color: '#666',
    marginBottom: '50px'
  },
  grid: {
    display: 'flex',
    justifyContent: 'center',
    gap: '40px',
    flexWrap: 'wrap' // Allows cards to stack on small mobile screens
  },
  card: {
    background: '#ffffff',
    padding: '40px 30px',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
    width: '350px',
    transition: 'transform 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  icon: {
    fontSize: '50px',
    marginBottom: '20px'
  },
  cardTitle: {
    fontSize: '1.8rem',
    marginBottom: '15px',
    color: '#333'
  },
  cardText: {
    color: '#777',
    fontSize: '1rem',
    lineHeight: '1.5',
    marginBottom: '30px',
    minHeight: '60px'
  },
  studentBtn: {
    width: '100%',
    padding: '14px',
    background: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    boxShadow: '0 4px 6px rgba(40, 167, 69, 0.2)'
  },
  mentorBtn: {
    width: '100%',
    padding: '14px',
    background: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    boxShadow: '0 4px 6px rgba(0, 123, 255, 0.2)'
  }
};
