import React, { useState } from 'react';
import { useLogger } from '../../hooks/useLogger';

const QUESTIONS = [
  { id: 1, text: "Explain the difference between useEffect and useLayoutEffect." },
  { id: 2, text: "What is the purpose of React.memo()?" },
  { id: 3, text: "How does the Virtual DOM improve web performance?" },
  { id: 4, text: "What are 'Keys' in React and why are they important?" },
  { id: 5, text: "Explain the concept of 'Lifting State Up' in React." },
  { id: 6, text: "What is the difference between a Controlled and Uncontrolled component?" },
  { id: 7, text: "Describe how the Secure Test Environment captures audit trails." },
  { id: 8, text: "How do you prevent 'Prop Drilling' in a large React application?" },
  { id: 9, text: "What is the benefit of using an Immutable data structure?" },
  { id: 10, text: "Explain why browser enforcement is critical for high-stakes tests." }
];

// Added setStudentAnswers to props
export default function MainTest({ attemptId, studentName, setStudentName, setStudentAnswers, onFinalSubmit }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isNameSubmitted, setIsNameSubmitted] = useState(false);
  const { logEvent } = useLogger(attemptId);

  const handleNameInput = (e) => {
    setStudentName(e.target.value); 
  };

  const handleStart = () => {
    if (!studentName.trim()) {
      alert("Please enter your name to begin.");
      return;
    }
    logEvent("TEST_STARTED_BY_USER", { studentName });
    setIsNameSubmitted(true);
  };

  // SYNC LOGIC: Updates local state AND parent state (App.jsx)
  const handleAnswerChange = (e) => {
    const val = e.target.value;
    const qId = QUESTIONS[currentIndex].id;
    
    setAnswers(prev => {
      const newAnswers = { ...prev, [qId]: val };
      // This ensures App.jsx (and SecureWrapper) always has the latest data
      if (setStudentAnswers) {
        setStudentAnswers(newAnswers);
      }
      return newAnswers;
    });
  };

  const handleNext = () => {
    logEvent("QUESTION_NAVIGATED", { from: currentIndex + 1, to: currentIndex + 2 });
    setCurrentIndex(prev => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentIndex(prev => prev - 1);
  };

  const handleSubmit = () => {
    const totalAnswered = Object.keys(answers).length;
    if (totalAnswered < QUESTIONS.length) {
      alert(`Please answer all ${QUESTIONS.length} questions.`);
      return;
    }
    else {
    // This is the "else" part you requested
    alert("✅ All questions answered! Kindly click the 'Final Submit Assessment' button at the bottom right to finish.");
  }

    logEvent("ASSESSMENT_SUBMITTED", { 
      studentName,
      totalQuestions: QUESTIONS.length,
      finalAnswers: answers 
    });

    // IMPORTANT: Tell the SecureWrapper to stop recording and upload
    if (onFinalSubmit) {
      onFinalSubmit(); 
    }
  };

  if (!isNameSubmitted) {
    return (
      <div style={containerStyle}>
        <div style={cardStyle}>
          <h2>Candidate Registration</h2>
          <p>Please enter your full name to start the secure assessment.</p>
          <input 
            type="text" 
            value={studentName} 
            onChange={handleNameInput} 
            placeholder="Enter Full Name" 
            style={inputStyle}
          />
          <button onClick={handleStart} style={submitBtn}>Proceed to Test</button>
        </div>
      </div>
    );
  }

  const currentQuestion = QUESTIONS[currentIndex];

  return (
    <div style={containerStyle} onCopy={(e) => {
    e.preventDefault();
    alert("Copying is disabled during the test!");
  }}>
      <header style={headerStyle}>
        <div>
          <h2 style={{margin: 0}}>Technical Assessment</h2>
          <small>Candidate: {studentName}</small>
        </div>
        <div style={badgeStyle}>Question {currentIndex + 1} of {QUESTIONS.length}</div>
      </header>

      <div style={cardStyle}>
        <p style={questionTextStyle}><b>Q{currentQuestion.id}:</b> {currentQuestion.text}</p>
       <textarea 
  style={textareaStyle}
  value={answers[currentQuestion.id] || ""}
  onChange={handleAnswerChange}
  placeholder="Type your answer here..."
  
  // ADD THESE LINES TO BLOCK COPY/PASTE
  onCopy={(e) => { e.preventDefault(); alert("Copying is disabled!"); }}
  onPaste={(e) => { e.preventDefault(); alert("Pasting is disabled!"); }}
  onContextMenu={(e) => { e.preventDefault(); }} 
/>
      </div>

      <footer style={footerStyle}>
        <button disabled={currentIndex === 0} onClick={handlePrevious} style={currentIndex === 0 ? disabledBtn : navBtn}>
          Previous
        </button>
        {currentIndex < QUESTIONS.length - 1 ? (
          <button onClick={handleNext} style={navBtn}>Next</button>
        ) : (
          <button onClick={handleSubmit} style={submitBtn}>Check All Questions Answered</button>
        )}
      </footer>
    </div>
  );
}

// STYLES
const inputStyle = { width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px', boxSizing: 'border-box' };
const containerStyle = { padding: '40px', maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', marginBottom: '20px' };
const badgeStyle = { background: '#007bff', color: 'white', padding: '5px 12px', borderRadius: '15px', fontSize: '14px' };
const cardStyle = { background: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' };
const questionTextStyle = { fontSize: '18px', marginBottom: '15px', color: '#333' };
const textareaStyle = { width: '100%', height: '150px', padding: '15px', borderRadius: '5px', border: '1px solid #ccc', fontSize: '16px', boxSizing: 'border-box' };
const footerStyle = { display: 'flex', justifyContent: 'space-between', marginTop: '30px' };
const navBtn = { padding: '10px 25px', cursor: 'pointer', background: '#6c757d', color: 'white', border: 'none', borderRadius: '5px' };
const disabledBtn = { ...navBtn, opacity: 0.5, cursor: 'not-allowed' };
const submitBtn = { ...navBtn, background: '#28a745' };
