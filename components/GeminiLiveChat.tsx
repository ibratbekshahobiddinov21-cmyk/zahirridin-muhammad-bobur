
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import { encode, decode, decodeAudioData } from '../utils/audioUtils';
import { VoiceVisualizer } from './VoiceVisualizer';

const SYSTEM_INSTRUCTION = `
You are an advanced AI assistant taking the persona of a history expert and cultural guide dedicated to the life and legacy of Zahiriddin Muhammad Bobur (1483–1530).
Your goal is to provide insightful, accurate, and respectful information about Bobur Mirzo as a great commander, poet, and historian.

Key facts to keep in mind:
1. Born in Andijan, a descendant of Amir Timur (Tamerlane).
2. Founded the Mughal Empire (Boburiylar davlati) in India.
3. Author of "Baburnama" (Boburnoma), a unique historical and literary autobiography.
4. An accomplished poet who wrote in Chagatai (Old Uzbek) and Persian.
5. Known for themes of patriotism, longing for his homeland (Andijan/Fergana), and scientific observations of nature.

Guidelines:
- If asked in Uzbek, respond in modern literary Uzbek.
- If asked in English or other languages, respond accordingly but maintain a scholarly and appreciative tone towards Central Asian history.
- Be concise but descriptive. 
- You are conversational and engaging, as this is a Live Audio interaction.
`;

export const GeminiLiveChat: React.FC = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [inputTranscription, setInputTranscription] = useState('');
  const [outputTranscription, setOutputTranscription] = useState('');
  const [error, setError] = useState<string | null>(null);

  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());

  const stopConversation = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
    setInputTranscription('');
    setOutputTranscription('');
    nextStartTimeRef.current = 0;
  }, []);

  const startConversation = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: (process.env as any).API_KEY });
      
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = audioCtx;
      outputAudioContextRef.current = outputAudioCtx;

      const analyzer = audioCtx.createAnalyser();
      analyzer.fftSize = 256;
      analyzerRef.current = analyzer;

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
          },
          systemInstruction: SYSTEM_INSTRUCTION,
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setIsConnecting(false);
            
            const source = audioCtx.createMediaStreamSource(stream);
            const scriptProcessor = audioCtx.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              
              // Simple blob creation logic
              const l = inputData.length;
              const int16 = new Int16Array(l);
              for (let i = 0; i < l; i++) {
                int16[i] = inputData[i] * 32768;
              }
              const pcmBlob: Blob = {
                data: encode(new Uint8Array(int16.buffer)),
                mimeType: 'audio/pcm;rate=16000',
              };

              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(analyzer);
            analyzer.connect(scriptProcessor);
            scriptProcessor.connect(audioCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Transcriptions
            if (message.serverContent?.inputTranscription) {
              setInputTranscription(prev => prev + ' ' + message.serverContent?.inputTranscription?.text);
            }
            if (message.serverContent?.outputTranscription) {
              setOutputTranscription(prev => prev + ' ' + message.serverContent?.outputTranscription?.text);
            }
            if (message.serverContent?.turnComplete) {
              // Reset temporary strings for next turn if desired, but we keep history here
            }

            // Handle Audio
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && outputAudioContextRef.current) {
              const ctx = outputAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(decode(base64Audio), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              
              source.addEventListener('ended', () => {
                activeSourcesRef.current.delete(source);
              });
              
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              activeSourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              activeSourcesRef.current.forEach(s => s.stop());
              activeSourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onerror: (e) => {
            console.error('Gemini Live Error:', e);
            setError("Connection error occurred. Please try again.");
            stopConversation();
          },
          onclose: () => {
            stopConversation();
          }
        }
      });

      sessionRef.current = await sessionPromise;

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Could not start audio session.");
      setIsConnecting(false);
    }
  };

  useEffect(() => {
    return () => stopConversation();
  }, [stopConversation]);

  return (
    <div className="bg-slate-900 border-t border-slate-800 p-6 sticky bottom-0 z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
      <div className="max-w-4xl mx-auto space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 space-y-1">
            <h4 className="text-amber-500 font-serif font-bold text-lg flex items-center gap-2">
              <i className="fas fa-microphone-lines"></i>
              Bobur Mirzo bilan suhbat
            </h4>
            <p className="text-slate-400 text-sm">
              Live API yordamida tarix haqida real vaqtda suhbatlashing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isConnected ? (
              <button 
                onClick={stopConversation}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all transform hover:scale-105"
              >
                <i className="fas fa-stop"></i> Yakunlash
              </button>
            ) : (
              <button 
                onClick={startConversation}
                disabled={isConnecting}
                className="bg-amber-500 hover:bg-amber-600 disabled:bg-slate-700 text-slate-900 px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-amber-500/20"
              >
                {isConnecting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Bog'lanmoqda...
                  </>
                ) : (
                  <>
                    <i className="fas fa-play"></i> Suhbatni boshlash
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {isConnected && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <VoiceVisualizer isActive={isConnected} analyzer={analyzerRef.current} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 max-h-32 overflow-y-auto">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Siz:</span>
                <p className="text-slate-300 text-sm italic">
                  {inputTranscription || "Eshitilyapti..."}
                </p>
              </div>
              <div className="bg-amber-900/10 p-4 rounded-xl border border-amber-900/30 max-h-32 overflow-y-auto">
                <span className="text-[10px] uppercase font-bold text-amber-500 block mb-1">Bobur (AI):</span>
                <p className="text-amber-100 text-sm">
                  {outputTranscription || "Javob kutilmoqda..."}
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-500/30 text-red-400 p-3 rounded-lg text-center text-sm">
            <i className="fas fa-circle-exclamation mr-2"></i>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};
