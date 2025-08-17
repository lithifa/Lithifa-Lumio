import React, { useState } from 'react';
import UploadForm from './UploadForm';
import SummaryEditor from './SummaryEditor';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App() {
  const [summaryData, setSummaryData] = useState(null);

  return (
    <div style={{ padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h2>AI Meeting Summarizer</h2>
      <UploadForm apiBase={API_BASE} onGenerated={setSummaryData} />
      {summaryData && <SummaryEditor apiBase={API_BASE} data={summaryData} />}
    </div>
  );
}

export default App;
