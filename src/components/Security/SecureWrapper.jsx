import React, { useEffect, useState, useRef } from 'react';
import { getBrowserInfo } from '../../utils/browserDetector';
import { useLogger } from '../../hooks/useLogger';
import BlockingScreen from './BlockingScreen';

const SecureWrapper = ({ children, attemptId, studentName, studentAnswers }) => {
  const [isLocked, setIsLocked] = useState(false);
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [warning, setWarning] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { logEvent } = useLogger(attemptId);

  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

  // keep latest values
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
      showIntimation("📤 Uploading assessment...");
      const response = await fetch(
        'https://techquestionbackend.onrender.com/api/submit-assessment',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (response.ok) {
        logEvent("ASSESSMENT_SUBMITTED");
        setSubmitted(true);
        showIntimation("✅ Assessment submitted successfully");
      } else {
        alert("❌ Submission failed");
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
        alert("❌ Please select ENTIRE SCREEN.");
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
      alert("Screen permission required.");
    }
  };

  useEffect(() => {
    const browser = getBrowserInfo();
    if (!browser.isChrome) setIsLocked(true);
  }, []);

  // BLOCK NON-CHROME
  if (isLocked) return <BlockingScreen />;

  // SUCCESS SCREEN AFTER SUBMIT
  if (submitted) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial',
        background: '#f0fff4',
        color: '#065f46'
      }}>
        <h2>✅ Assessment Submitted</h2>
        <p>Your answers and screen recording were sent successfully.</p>
        <p>You may now safely close this tab.</p>
      </div>
    );
  }

  // START SCREEN
  if (!isTestStarted) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'Arial' }}>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#007bff' }}>Software Company</h1>
          <p>Frontend Developer – Technical Assessment</p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>About the Company</h3>
          <p>
            We are a high-growth technology firm. This assessment evaluates
            problem-solving, logic, and clean coding practices.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: '#f4fff4', padding: '15px', borderRadius: '8px' }}>
            <h4>✅ Dos</h4>
            <ul>
              <li>Share entire screen</li>
              <li>Quiet environment</li>
              <li>Read questions carefully</li>
            </ul>
          </div>

          <div style={{ background: '#fff5f5', padding: '15px', borderRadius: '8px' }}>
            <h4>❌ Don’ts</h4>
            <ul>
              <li>Do not switch tabs</li>
              <li>No AI tools</li>
              <li>No external help</li>
            </ul>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button onClick={startRecording} style={btnStyle}>
            Start Assessment
          </button>
        </div>
      </div>
    );
  }

  // TEST RUNNING SCREEN
  return (
    <>
      {warning && <div style={toastStyle}>{warning}</div>}

      {children}

      {!submitted && (
        <button
          onClick={() => {
            if (mediaRecorderRef.current?.state === "recording") {
              mediaRecorderRef.current.stop();
            }
          }}
          style={submitBtnStyle}
        >
          Final Submit Assessment
        </button>
      )}
    </>
  );
};

const toastStyle = {
  position: 'fixed',
  top: '20px',
  left: '50%',
  transform: 'translateX(-50%)',
  backgroundColor: '#ff4d4f',
  color: 'white',
  padding: '12px 24px',
  borderRadius: '8px',
  zIndex: 10000
};

const btnStyle = {
  padding: '15px 30px',
  background: '#28a745',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

const submitBtnStyle = {
  position: 'fixed',
  bottom: '20px',
  right: '20px',
  padding: '15px 30px',
  background: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

export default SecureWrapper;
