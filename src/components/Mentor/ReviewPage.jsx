import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ReviewPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const sub = state?.sub;

  if (!sub) return <h2>No submission data found.</h2>;

  return (
    <div style={pageStyle}>
      <header style={headerStyle}>
        <button onClick={() => navigate('/mentor')} style={backBtn}>← Back to Dashboard</button>
        <h2> Review</h2>
      </header>

      <div style={mainLayout}>
        {/* LEFT SIDE: Student Info & Video */}
        <div style={leftPanel}>
          <div style={infoCard}>
            <h3>Candidate Details</h3>
            <p><b>Name:</b> {sub.studentName}</p>
            <p><b>Attempt ID:</b> {sub.attemptId}</p>
            <p><b>Final Score:</b> <span style={scoreBadge}>{sub.score || "N/A"}</span></p>
            <p><b>Submitted:</b> {new Date(sub.submittedAt).toLocaleString()}</p>
          </div>

          <div style={videoCard}>
            <h4>Audit Recording</h4>
            <video width="100%" controls style={{ borderRadius: '8px' }}>
              <source src={sub.videoUrl} type="video/webm" />
              Your browser does not support video playback.
            </video>
          </div>
        </div>

        {/* RIGHT SIDE: Evaluation Form */}
        <div style={rightPanel}>
          <h3>Question-wise Evaluation</h3>
          <hr />
          
          {sub.evaluatedAnswers ? (
            // Format for New Submissions (with evaluatedAnswers array)
            sub.evaluatedAnswers.map((item, idx) => (
              <div key={idx} style={{
                ...questionCard,
                borderLeft: `8px solid ${item.isCorrect ? '#28a745' : '#dc3545'}`,
                backgroundColor: item.isCorrect ? '#f6fff8' : '#fff5f5'
              }}>
                <p><b>Q{item.questionId}: {item.questionText}</b></p>
                <div style={answerBox}>
                  <p><b>Student Answer:</b> <span style={{ color: item.isCorrect ? 'green' : 'red' }}>
                    {item.studentAnswer} {item.isCorrect ? '✅' : '❌'}
                  </span></p>
                  {!item.isCorrect && (
                    <p style={correctHint}><b>Correct Answer:</b> {item.correctAnswer}</p>
                  )}
                </div>
              </div>
            ))
          ) : (
            // Fallback for Old Submissions (with raw answers object)
            Object.entries(sub.answers || {}).map(([key, val]) => (
              <div key={key} style={questionCard}>
                <p><b>Question ID: {key}</b></p>
                <p><b>Answer:</b> {val}</p>
                <p style={{color: 'orange'}}><i>Note: This was an old submission without auto-grading.</i></p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// --- Styles ---
const pageStyle = { padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' };
const headerStyle = { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' };
const mainLayout = { display: 'flex', gap: '30px', alignItems: 'flex-start' };
const leftPanel = { flex: '1', position: 'sticky', top: '20px' };
const rightPanel = { flex: '1.5', background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };
const infoCard = { background: '#fff', padding: '15px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '20px' };
const videoCard = { background: '#333', color: '#fff', padding: '15px', borderRadius: '12px' };
const questionCard = { padding: '15px', marginBottom: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };
const answerBox = { marginTop: '10px', padding: '10px', background: 'rgba(255,255,255,0.5)', borderRadius: '4px' };
const correctHint = { color: '#666', fontSize: '13px', borderTop: '1px solid #ddd', paddingTop: '5px', marginTop: '5px' };
const scoreBadge = { background: '#007bff', color: '#white', padding: '2px 10px', borderRadius: '4px' };
const backBtn = { padding: '8px 15px', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' };
