'use client';

import { useState } from 'react';

export default function ProfLynxAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I am Prof. Lynx, your AI assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Placeholder for Gemini API integration
  async function sendMessage() {
    if (!input.trim()) return;
    setMessages(msgs => [...msgs, { role: 'user', content: input }]);
    setLoading(true);
    setInput('');
    try {
      const res = await fetch('/api/ai/lynx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: input }] }),
      });
      if (!res.ok) throw new Error('AI error');
      const data = await res.json();
      setMessages(msgs => [...msgs, data]);
    } catch (err) {
      setMessages(msgs => [...msgs, { role: 'assistant', content: 'Sorry, Prof. Lynx could not answer right now.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        className="fixed bottom-6 right-6 z-50 bg-blue-600 text-white rounded-full shadow-lg p-4 hover:bg-blue-700 focus:outline-none"
        onClick={() => setOpen(o => !o)}
        aria-label="Open Prof. Lynx AI Assistant"
      >
        <span role="img" aria-label="AI">🦉</span>
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-lg shadow-2xl flex flex-col h-96">
          <div className="flex items-center justify-between p-3 border-b">
            <span className="font-bold text-blue-700">Prof. Lynx AI Assistant</span>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-700">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {(messages || []).map((msg, i) => (
              <div key={i} className={msg.role === 'assistant' ? 'text-left' : 'text-right'}>
                <span className={msg.role === 'assistant' ? 'bg-blue-100 text-blue-900 px-2 py-1 rounded' : 'bg-green-100 text-green-900 px-2 py-1 rounded'}>
                  {msg.content}
                </span>
              </div>
            ))}
            {loading && <div className="text-left text-gray-400">Prof. Lynx is thinking...</div>}
          </div>
          <form
            className="p-3 border-t flex gap-2"
            onSubmit={e => { e.preventDefault(); sendMessage(); }}
          >
            <input
              className="flex-1 input input-bordered"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask Prof. Lynx anything..."
              disabled={loading}
            />
            <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}
