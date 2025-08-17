import React, { useState } from 'react';

export default function UploadForm({ apiBase, onGenerated }) {
  const [transcript, setTranscript] = useState('');
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/api/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript, prompt })
      });
      const j = await res.json();
      if (res.ok) {
        onGenerated({ id: j.id, summary: j.generatedSummary });
      } else {
        alert(j.error || 'Error generating summary');
      }
    } catch (err) {
      console.error(err);
      alert('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <div>
        <label>Transcript (paste text):</label><br/>
        <textarea value={transcript} onChange={e => setTranscript(e.target.value)} rows={8} cols={80} required/>
      </div>
      <div>
        <label>Instruction / Prompt (optional):</label><br/>
        <input type="text" value={prompt} onChange={e => setPrompt(e.target.value)} style={{ width: '80%' }} placeholder="e.g., bullet points for executives; list action items only" />
      </div>
      <div style={{ marginTop: 8 }}>
        <button type="submit" disabled={loading}>{loading ? 'Generating...' : 'Generate Summary'}</button>
      </div>
    </form>
  );
}
