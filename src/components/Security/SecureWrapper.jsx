import React, { useEffect, useState, useRef } from 'react';
import { getBrowserInfo } from '../../utils/browserDetector';
import { useLogger } from '../../hooks/useLogger';
import BlockingScreen from './BlockingScreen';

const SecureWrapper = ({ children, attemptId, studentName, studentAnswers }) => {
  const [isLocked, setIsLocked] = useState(false);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [warning, setWarning] = useState("");
  const { logEvent } = useLogger(attemptId);
  
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);
  
  // Use Refs to ensure onstop gets the latest data without stale closures
  const nameRef = useRef(studentName);
  const answersRef = useRef(studentAnswers);

  useEffect(() => {
    nameRef.current = studentName;
    answersRef.current = studentAnswers;
  }, [studentName, studentAnswers]);

  const showIntimation = (msg) => {
    setWarning(msg);
    setTimeout(() => setWarning(""), 3000);
  };

  const uploadToBackend = async (blob) => {
    const formData = new FormData();
    formData.append('video', blob, `video_${attemptId}.webm`);
    formData.append('attemptId', attemptId);
    formData.append('studentName', nameRef.current); 
    formData.append('answers', JSON.stringify(answersRef.current));

    try {
      showIntimation("📤 Uploading to mentor...");
<<<<<<< HEAD
      const response = await fetch('https://techquestionbackend.onrender.com/api/submit-assessment', {
=======
      const response = await fetch('https://techquestionbackend.onrender.com/api/mentor/submissions', {
>>>>>>> 29f12239aaeb10a32d31efc6be8a2a77eb9729db
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert("✅ Submitted Successfully!");
        window.location.reload();
      }
    } catch (err) {
      alert("❌ Upload failed. Check server.");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: "monitor" },
        audio: true
      });

      if (stream.getVideoTracks()[0].getSettings().displaySurface !== 'monitor') {
        stream.getTracks().forEach(t => t.stop());
        alert("❌ Select ENTIRE SCREEN.");
        return;
      }

      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      mediaRecorderRef.current = recorder;
      recordedChunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) recordedChunks.current.push(e.data);
      };

      recorder.onstop = () => {
        const finalBlob = new Blob(recordedChunks.current, { type: 'video/webm' });
        uploadToBackend(finalBlob);
      };

      recorder.start();
      setIsTestStarted(true);
      logEvent("RECORDING_STARTED");
    } catch (err) {
      alert("Permission required.");
    }
  };

  useEffect(() => {
    const browser = getBrowserInfo();
    if (!browser.isChrome) setIsLocked(true);
  }, []);

  if (isLocked) return <BlockingScreen />;

   if (!isTestStarted) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'Arial, sans-serif', color: '#333' }}>
        
        {/* 1. Company Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
          <h1 style={{ color: '#007bff', margin: '0 0 10px 0' }}>Software Company</h1>
          <p style={{ fontSize: '18px', color: '#666' }}>Frontend Developer Role - Technical Assessment</p>
        </div>

        {/* 2. Company Description */}
        <div style={{ marginBottom: '30px', lineHeight: '1.6', fontSize: '15px' }}>
          <h3>About the Company</h3>
          <p>
            We are a high-growth technology firm specializing in AI-driven web applications. 
            This assessment helps us understand your problem-solving approach and coding standards. 
            We value clean code and logical thinking over speed.
          </p>
        </div>

        {/* 3. Dos and Don'ts Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          
          {/* Dos Card */}
          <div style={{ padding: '20px', borderRadius: '8px', backgroundColor: '#f4fff4', border: '1px solid #c3e6cb' }}>
            <h4 style={{ color: '#1e7e34', marginTop: '0' }}>✅ Dos</h4>
            <ul style={{ paddingLeft: '20px', fontSize: '14px' }}>
              <li>Ensure your webcam and screen sharing is active.</li>
              <li>Work in a quiet, well-lit environment.</li>
              <li>Read each question carefully before answering.</li>
              <li>Click "Final Submit" once you finish the test.</li>
            </ul>
          </div>

          {/* Don'ts Card */}
          <div style={{ padding: '20px', borderRadius: '8px', backgroundColor: '#fff5f5', border: '1px solid #f5c6cb' }}>
            <h4 style={{ color: '#bd2130', marginTop: '0' }}>❌ Don'ts</h4>
            <ul style={{ paddingLeft: '20px', fontSize: '14px' }}>
              <li><strong>Do not</strong> switch or minimize browser tabs.</li>
              <li><strong>Do not</strong> use any AI tools or external help.</li>
              <li><strong>Do not</strong> have other people in the room.</li>
              <li><strong>Do not</strong> stop the recording until finished.</li>
            </ul>
          </div>
        </div>

        {/* 4. Start Button Area */}
        <div style={{ textAlign: 'center', backgroundColor: '#f8f9fa', padding: '30px', borderRadius: '12px' }}>
          <p style={{ marginBottom: '20px', fontSize: '14px', color: '#777' }}>
            <b>Note:</b> You must select <b>"Entire Screen"</b> in the browser prompt to begin.
          </p>
          <button onClick={startRecording} style={btnStyle}>
            Start Assessment
          </button>
        </div>
      </div>
    );
  }


  return (
    <>
      {warning && <div style={toastStyle}>{warning}</div>}
      {children}
      <button 
        onClick={() => mediaRecorderRef.current?.stop()} 
        style={submitBtnStyle}
      >
        Final Submit Assessment
      </button>
    </>
  );
};

const toastStyle = { position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#ff4d4f', color: 'white', padding: '12px 24px', borderRadius: '8px', zIndex: 10000 };
const btnStyle = { padding: '15px 30px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const submitBtnStyle = { position: 'fixed', bottom: '20px', right: '20px', padding: '15px 30px', background: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' };

export default SecureWrapper;
