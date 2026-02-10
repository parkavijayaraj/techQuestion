import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MentorDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const navigate = useNavigate();

  // Step 1: Fetch data from your backend URL
  useEffect(() => {
    fetch('https://techquestionbackend.onrender.com/api/mentor/submissions')
      .then((res) => res.json())
      .then((data) => {
        setSubmissions(data); // Step 2: Save the JSON data into state
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h2 style={{ borderBottom: '2px solid #333', paddingBottom: '10px' }}>
        Review Dashboard
      </h2>
      
      {submissions.length === 0 ? (
        <p>No submissions found. Students need to complete the test first.</p>
      ) : (
        <table border="1" width="100%" style={{ borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr style={{ background: '#f4f4f4', textAlign: 'left' }}>
              <th style={cellStyle}>Candidate Name</th>
              <th style={cellStyle}>Score</th>
              <th style={cellStyle}>Submission Date</th>
              <th style={cellStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr key={sub.attemptId}>
                <td style={cellStyle}>{sub.studentName}</td>
                <td style={cellStyle}><b>{sub.score || "N/A"}</b></td>
                <td style={cellStyle}>{new Date(sub.submittedAt).toLocaleString()}</td>
                <td style={cellStyle}>
                  {/* Step 3: Pass the specific student data to the Review Page */}
                  <button 
                    onClick={() => navigate(`/review/${sub.attemptId}`, { state: { sub } })}
                    style={btnStyle}
                  >
                    Review Assessment
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Styles
const cellStyle = { padding: '12px', border: '1px solid #ddd' };
const btnStyle = { 
  background: '#007bff', color: 'white', border: 'none', 
  padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' 
};
