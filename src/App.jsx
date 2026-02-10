import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Common/Home';
import SecureWrapper from './components/Security/SecureWrapper';
import MainTest from './components/Assessment/MainTest';
import MentorDashboard from './components/Mentor/MentorDashboard';
import ReviewPage from './components/Mentor/ReviewPage';

// Import the new Guard
import MentorGuard from './components/Security/MentorGuard';

export default function App() {
  const [studentName, setStudentName] = useState("");
  const [studentAnswers, setStudentAnswers] = useState({});
  const attemptId = `SESSION_${Date.now()}`;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Student Route */}
        <Route path="/candidate" element={
          <SecureWrapper attemptId={attemptId} studentName={studentName} studentAnswers={studentAnswers}>
            <MainTest 
              attemptId={attemptId} 
              studentName={studentName} 
              setStudentName={setStudentName}
              setStudentAnswers={setStudentAnswers} 
            />
          </SecureWrapper>
        } />

        {/* Protected Mentor Routes */}
        <Route path="/mentor" element={
          <MentorGuard>
            <MentorDashboard />
          </MentorGuard>
        } />

        <Route path="/review/:id" element={
          <MentorGuard>
            <ReviewPage />
          </MentorGuard>
        } />
      </Routes>
    </BrowserRouter>
  );
}
