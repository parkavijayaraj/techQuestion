import React from 'react';

const BlockingScreen = () => (
  <div style={overlay}>
    <div style={card}>
      <h2 style={{ color: '#d9534f' }}>🚫 Access Restricted</h2>
      <p>This assessment requires <b>Google Chrome</b> to ensure a secure environment.</p>
      
      <div style={infoBox}>
        <p><b>Detected Browser:</b> {navigator.userAgent.split(' ').pop()}</p>
        <p><b>Required:</b> Google Chrome (Version 100+)</p>
      </div>

      <p>Please follow these steps:</p>
      <ol style={{ textAlign: 'left', display: 'inline-block' }}>
        <li>Install <a href="https://www.google.com" target="_blank">Google Chrome</a>.</li>
        <li>Copy the assessment link.</li>
        <li>Open Chrome and paste the link to start.</li>
      </ol>
    </div>
  </div>
);

const overlay = { position: 'fixed', inset: 0, background: '#f0f2f5', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 };
const card = { padding: '40px', background: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '500px' };
const infoBox = { background: '#fff5f5', padding: '15px', borderRadius: '8px', margin: '20px 0', border: '1px solid #feb2b2' };

export default BlockingScreen;
