/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Trash2, Volume2, VolumeX, Ghost, Flame, Skull } from 'lucide-react';
import { getRoast } from './services/gemini';

interface Message {
  role: 'user' | 'model';
  text: string;
  id: string;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const speak = (text: string) => {
    if (isMuted) return;
    
    // Stop any current speech
    window.speechSynthesis.cancel();

    // Browser's SpeechSynthesis
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a Bengali voice if text contains Bengali characters
    const isBengali = /[\u0980-\u09FF]/.test(text);
    if (isBengali) {
      const voices = window.speechSynthesis.getVoices();
      const bnVoice = voices.find(v => v.lang.includes('bn') || v.lang.includes('IN') || v.lang.includes('BD'));
      if (bnVoice) utterance.voice = bnVoice;
    }

    utterance.rate = 0.75; // Even slower for maximum terror
    utterance.pitch = 0.5; // Very deep/demonic pitch
    window.speechSynthesis.speak(utterance);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      text: input,
      id: Date.now().toString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const roast = await getRoast(input, history);
    
    const botMessage: Message = {
      role: 'model',
      text: roast,
      id: (Date.now() + 1).toString(),
    };

    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
    speak(roast);
  };

  const clearChat = () => {
    setMessages([]);
    window.speechSynthesis.cancel();
  };

  return (
    <div className="min-h-screen bg-[#020202] text-white flex flex-col font-sans selection:bg-red-900 selection:text-white">
      {/* Header */}
      <header className="p-6 border-b border-red-950 flex justify-between items-center bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-950 rounded-lg animate-ping absolute opacity-40 shadow-[0_0_30px_rgba(220,38,38,1)]">
            <Skull className="w-6 h-6 text-red-600" />
          </div>
          <div className="p-2 bg-red-900 rounded-lg relative z-10 border border-red-500/50">
            <Skull className="w-6 h-6 text-white" />
          </div>
          <div>
            <motion.h1 
              animate={{ color: ["#dc2626", "#450a0a", "#dc2626"] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="text-2xl font-black tracking-tighter uppercase italic"
            >
              রক্তচিমটি রোস্ট মাস্টার
            </motion.h1>
            <p className="text-[10px] text-red-600 font-mono tracking-widest uppercase font-bold">Lethal Toxicity Mode Active</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`p-3 rounded-full transition-all border ${isMuted ? 'bg-red-900/20 border-red-900/50 text-red-500' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <button 
            onClick={clearChat}
            className="p-3 bg-white/5 hover:bg-red-900 rounded-full transition-all border border-white/10 hover:border-red-600 group"
            title="Clear Chat"
          >
            <Trash2 className="w-5 h-5 transition-transform group-hover:scale-110" />
          </button>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-hidden relative flex flex-col pt-4">
        {/* Decorative Background */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 animate-pulse duration-[5000ms]">
            <Flame className="w-96 h-96 text-red-950" />
          </div>
          <div className="absolute bottom-1/4 right-1/4 animate-bounce duration-[8000ms]">
            <Ghost className="w-72 h-72 text-red-950" />
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 md:px-8 space-y-8 pb-32 scroll-smooth relative z-10"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto mt-20">
              <div className="w-24 h-24 bg-red-900/20 rounded-full flex items-center justify-center border border-red-900/40 shadow-[0_0_50px_rgba(153,27,27,0.2)]">
                <Skull className="w-12 h-12 text-red-700 animate-pulse" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-black uppercase text-red-600 tracking-tighter">মৃত্যুর মুখ থেকে ফিরে এলি?</h2>
                <p className="text-gray-500 font-medium text-sm leading-relaxed">
                  আমি "বিষাক্ত রোস্ট মাস্টার"। আমার কাছে দয়া আশা করিস না। কিছু লিখে দেখ, তোর জীবন নরক বানিয়ে দেবো।
                </p>
              </div>
              <div className="flex flex-wrap gap-2 justify-center italic text-[10px] font-mono opacity-40">
                <span className="px-3 py-1 bg-red-950/30 rounded-full border border-red-900/20">NO MERCY</span>
                <span className="px-3 py-1 bg-red-950/30 rounded-full border border-red-900/20">EXTREME TOXICITY</span>
                <span className="px-3 py-1 bg-red-950/30 rounded-full border border-red-900/20">ভয়ংকর রোস্টিং</span>
              </div>
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {messages.map((m) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                layout
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`
                  max-w-[85%] md:max-w-[70%] p-6 rounded-2xl relative overflow-hidden group
                  ${m.role === 'user' 
                    ? 'bg-[#111] border border-white/5 rounded-tr-none text-gray-300' 
                    : 'bg-gradient-to-br from-red-950/80 to-black border border-red-900/50 rounded-tl-none text-red-50 shadow-[0_10px_40px_rgba(153,27,27,0.15)]'
                  }
                `}>
                  {/* Subtle blood drip effect for model messages */}
                  {m.role === 'model' && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]" />
                  )}
                  
                  <div className="flex flex-col gap-1">
                    <span className={`text-[9px] font-black uppercase tracking-[0.3em] mb-2 ${m.role === 'user' ? 'text-gray-500' : 'text-red-600 animate-pulse'}`}>
                      {m.role === 'user' ? 'Bechara Insaan' : 'The Executioner'}
                    </span>
                    <p className="text-lg leading-relaxed font-semibold italic">
                      "{m.content || m.text}"
                    </p>
                    {m.role === 'model' && (
                      <div className="mt-4 flex items-center justify-end border-t border-red-900/20 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => speak(m.text)}
                          className="text-red-500 p-1 hover:bg-red-500/10 rounded flex items-center gap-1 text-[10px]"
                        >
                          <Volume2 className="w-3 h-3" /> Re-Hear the Horror
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-red-950/20 border border-red-900/30 p-5 rounded-2xl rounded-tl-none">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-bounce shadow-[0_0_10px_rgba(220,38,38,0.5)]" style={{ animationDelay: '0ms' }} />
                  <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-bounce shadow-[0_0_10px_rgba(220,38,38,0.5)]" style={{ animationDelay: '150ms' }} />
                  <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-bounce shadow-[0_0_10px_rgba(220,38,38,0.5)]" style={{ animationDelay: '300ms' }} />
                </div>
                <p className="text-[10px] uppercase font-black mt-3 text-red-600 tracking-widest">Preparing your humiliation...</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Dock */}
        <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black via-black/95 to-transparent z-50">
          <form 
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto relative"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="গালি খাওয়ার সৎ সাহস থাকলে কিছু লিখ..."
              className="w-full bg-[#0a0a0a] border border-red-900/40 rounded-2xl py-5 px-6 pr-16 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600/30 transition-all text-lg placeholder:text-red-950 font-medium"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-red-700 hover:bg-red-600 disabled:bg-gray-900 disabled:text-gray-700 rounded-xl transition-all shadow-[0_0_20px_rgba(153,27,27,0.3)] active:scale-95 flex items-center justify-center"
            >
              <Flame className="w-6 h-6 text-white" />
            </button>
          </form>
          <div className="flex justify-center gap-8 mt-4 text-[9px] text-red-900 font-bold uppercase tracking-[0.4em]">
            <span>No Mercy</span>
            <span>No Regrets</span>
            <span>Only Pain</span>
          </div>
        </div>
      </main>
    </div>
  );
}
