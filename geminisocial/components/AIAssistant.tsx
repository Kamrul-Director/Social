
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, MicOff, MessageSquare, X, Volume2, Loader2, Sparkles } from 'lucide-react';
import { encode, decode, decodeAudioData } from '../services/geminiService';

const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking'>('idle');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const startLiveChat = async () => {
    setStatus('connecting');
    // FIX: Always use direct process.env.API_KEY for initialization as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            setStatus('listening');
            setIsActive(true);
            
            const source = audioContextRef.current!.createMediaStreamSource(stream);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const int16 = new Int16Array(inputData.length);
              for (let i = 0; i < inputData.length; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };
              
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            
            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
              setStatus('speaking');
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContextRef.current.currentTime);
              
              const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                outputAudioContextRef.current,
                24000,
                1
              );
              
              const source = outputAudioContextRef.current.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputAudioContextRef.current.destination);
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setStatus('listening');
              };
              
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Live API Error:', e);
            stopLiveChat();
          },
          onclose: () => {
            setIsActive(false);
            setStatus('idle');
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
          },
          systemInstruction: 'You are Gemini, a friendly AI social media companion on GeminiSocial. Chat casually with the user about their day, their posts, or anything on their mind.'
        }
      });
      
      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Failed to initialize live chat:', err);
      setStatus('idle');
    }
  };

  const stopLiveChat = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (audioContextRef.current) audioContextRef.current.close();
    if (outputAudioContextRef.current) outputAudioContextRef.current.close();
    setIsActive(false);
    setStatus('idle');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl w-72 md:w-80 overflow-hidden border border-blue-100 animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-blue-600 p-4 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-white/20 p-2 rounded-full">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-bold">Gemini AI Friend</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1 rounded-full transition">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 flex flex-col items-center text-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 mb-4 ${isActive ? 'bg-blue-100 scale-110 shadow-lg' : 'bg-gray-100'}`}>
              {status === 'connecting' ? (
                <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              ) : status === 'speaking' ? (
                <div className="flex items-end space-x-1 h-10">
                  <div className="w-1.5 bg-blue-500 rounded-full animate-[bounce_1s_infinite_0ms]" style={{ height: '60%' }}></div>
                  <div className="w-1.5 bg-blue-500 rounded-full animate-[bounce_1s_infinite_200ms]" style={{ height: '100%' }}></div>
                  <div className="w-1.5 bg-blue-500 rounded-full animate-[bounce_1s_infinite_400ms]" style={{ height: '70%' }}></div>
                  <div className="w-1.5 bg-blue-500 rounded-full animate-[bounce_1s_infinite_600ms]" style={{ height: '85%' }}></div>
                </div>
              ) : status === 'listening' ? (
                <Mic className="w-10 h-10 text-green-500 animate-pulse" />
              ) : (
                <Volume2 className="w-10 h-10 text-gray-400" />
              )}
            </div>

            <h3 className="font-bold text-gray-800 mb-1">
              {status === 'connecting' ? 'Connecting...' : status === 'idle' ? 'Start a conversation' : 'I\'m listening...'}
            </h3>
            <p className="text-sm text-gray-500 mb-6">Voice chat in real-time with your AI social companion.</p>

            {isActive ? (
              <button 
                onClick={stopLiveChat}
                className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold flex items-center justify-center space-x-2 transition"
              >
                <MicOff className="w-5 h-5" />
                <span>End Conversation</span>
              </button>
            ) : (
              <button 
                onClick={startLiveChat}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center space-x-2 transition shadow-lg shadow-blue-200"
              >
                <Mic className="w-5 h-5" />
                <span>Talk to Gemini</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-110 active:scale-95 group"
        >
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
          <MessageSquare className="w-7 h-7" />
        </button>
      )}
    </div>
  );
};

export default AIAssistant;
