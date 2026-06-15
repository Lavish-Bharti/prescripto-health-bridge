import React, { useState, useRef, useEffect } from 'react';

const REPLIES = {
  headache: "Headaches can be caused by stress or dehydration. I recommend seeing a Neurologist. Shall I help book one?",
  chest:    "Chest pain can be serious. If severe, seek emergency care. I can book you with a Cardiologist urgently.",
  recommend:"Describe your symptoms and I'll match you with the right specialist from our 50+ verified doctors!",
  skin:     "For skin concerns, consult a Dermatologist. Want me to show available ones?",
  default:  "Based on your query, I suggest consulting one of our specialists. Would you like a doctor recommendation?",
};

export default function AIChatbot() {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState([{ id:1, role:'bot', text:"Hello! I'm Prescripto AI 👋 How can I help you today?" }]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, loading]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages(p => [...p, { id: Date.now(), role:'user', text: msg }]);
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    const lower = msg.toLowerCase();
    let reply = REPLIES.default;
    if (lower.includes('headache') || lower.includes('head')) reply = REPLIES.headache;
    else if (lower.includes('chest'))  reply = REPLIES.chest;
    else if (lower.includes('recommend') || lower.includes('doctor')) reply = REPLIES.recommend;
    else if (lower.includes('skin') || lower.includes('rash')) reply = REPLIES.skin;
    setMessages(p => [...p, { id: Date.now()+1, role:'bot', text: reply }]);
    setLoading(false);
  };

  return (
    <>
      {/* Toggle button */}
      <button onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 hero-bg rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all duration-300">
        <span className="text-white text-2xl">{open ? '✕' : '💬'}</span>
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden" style={{ maxHeight:'460px' }}>
          {/* Header */}
          <div className="hero-bg p-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-lg">❤️</div>
            <div>
              <p className="text-white font-semibold text-sm">Prescripto AI</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                <span className="text-white/80 text-xs">Online · Health Assistant</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50" style={{ maxHeight:'240px' }}>
            {messages.map(m => (
              <div key={m.id} className={`flex items-end gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {m.role === 'bot' && <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-xs">❤️</div>}
                <div className={`max-w-xs px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${m.role === 'user' ? 'bg-primary text-white rounded-br-sm' : 'bg-white text-dark shadow-sm border border-slate-100 rounded-bl-sm'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-xs">❤️</div>
                <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1.5 shadow-sm border border-slate-100">
                  {[0,150,300].map(d => <span key={d} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay:`${d}ms` }}></span>)}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          <div className="px-3 py-2 flex gap-1.5 overflow-x-auto bg-white border-t border-slate-100">
            {['I have a headache','Chest pain','Find a doctor'].map(r => (
              <button key={r} onClick={() => send(r)}
                className="flex-shrink-0 text-xs bg-primary-light text-primary px-3 py-1.5 rounded-full hover:bg-primary hover:text-white transition-colors font-medium">
                {r}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-100 flex gap-2 bg-white">
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask about symptoms..."
              className="flex-1 text-sm border border-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" />
            <button onClick={() => send()} disabled={!input.trim() || loading}
              className="w-9 h-9 bg-primary hover:bg-primary-dark disabled:opacity-50 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 text-white text-sm">
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}