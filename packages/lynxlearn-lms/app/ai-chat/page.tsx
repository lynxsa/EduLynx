'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '../../components/ui/button';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { sender: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text }),
      });
      const data = await res.json();
      const aiMsg: ChatMessage = { sender: 'ai', text: data.reply };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: 'Error: unable to get response.' }]);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen pt-20 bg-slate-50 dark:bg-slate-900 p-6 flex flex-col">
      <div className="max-w-3xl mx-auto flex-1 flex flex-col bg-white dark:bg-slate-800 rounded-lg shadow">
        <div className="p-4 border-b dark:border-slate-700 font-bold text-lg">ProfLynx AI Chat</div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={msg.sender === 'user' ? 'text-right' : 'text-left'}>
              <div
                className={`${msg.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800'} inline-block p-3 rounded-lg max-w-[80%]`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t dark:border-slate-700 flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask ProfLynx anything..."
            onKeyDown={e => {
              if (e.key === 'Enter') sendMessage();
            }}
            className="block w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500"
          />
          <Button onClick={sendMessage} disabled={loading || !input.trim()}>
            {loading ? '...' : 'Send'}
          </Button>
        </div>
      </div>
    </main>
  );
}
