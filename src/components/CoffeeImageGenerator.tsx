import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleGenAI } from "@google/genai";
import { Sparkles, Image as ImageIcon, Download, RefreshCw, AlertCircle, Wand2 } from 'lucide-react';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

export function CoffeeImageGenerator() {
  const [prompt, setPrompt] = useState('A cinematic macro shot of a single roasted coffee bean floating in a dark, atmospheric space with golden sunlight highlights and subtle coffee dust particles, 8k resolution, hyper-realistic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    if (window.aistudio) {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected);
    }
  };

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  const generateImage = async () => {
    if (!hasKey) {
      setError("Please select an API key first.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Create a new instance right before the call as per guidelines
      const ai = new GoogleGenAI({ apiKey: (process.env as any).API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image-preview',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1",
            imageSize: "1K"
          }
        },
      });

      let imageUrl = null;
      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      if (imageUrl) {
        setGeneratedImage(imageUrl);
      } else {
        throw new Error("No image was generated in the response.");
      }
    } catch (err: any) {
      console.error("Generation error:", err);
      if (err.message?.includes("Requested entity was not found")) {
        setError("API Key error. Please try selecting your key again.");
        setHasKey(false);
      } else {
        setError(err.message || "An unexpected error occurred during generation.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (!hasKey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-coffee-dark p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full glass p-10 rounded-3xl text-center border border-white/10"
        >
          <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Sparkles className="text-gold w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-4 tracking-tight">Caffeina Studio</h2>
          <p className="text-cream/60 mb-10 leading-relaxed">
            To use our AI-powered 3D bean generator, you need to select a Google Cloud API key with billing enabled.
          </p>
          <button 
            onClick={handleSelectKey}
            className="w-full py-4 bg-gold text-coffee-dark font-bold rounded-xl hover:bg-caramel transition-all shadow-[0_10px_30px_rgba(212,175,55,0.3)]"
          >
            Select API Key
          </button>
          <p className="mt-6 text-[10px] text-cream/30 uppercase tracking-widest">
            Requires a paid Google Cloud project
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-coffee-dark">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Controls */}
          <div className="w-full md:w-1/3 space-y-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tighter mb-4">Bean Studio</h1>
              <p className="text-cream/60 text-sm leading-relaxed">
                Use AI to generate hyper-realistic 3D coffee beans for your collection.
              </p>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.3em] text-gold font-bold">Prompt</label>
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-cream focus:border-gold outline-none transition-all resize-none"
                placeholder="Describe your perfect coffee bean..."
              />
            </div>

            <button 
              onClick={generateImage}
              disabled={isGenerating}
              className="w-full py-5 bg-gold text-coffee-dark font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_15px_40px_rgba(212,175,55,0.2)]"
            >
              {isGenerating ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Wand2 className="w-5 h-5" />
              )}
              {isGenerating ? 'Generating Art...' : 'Generate 3D Bean'}
            </button>

            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3"
              >
                <AlertCircle className="text-red-500 w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-xs text-red-200/80 leading-relaxed">{error}</p>
              </motion.div>
            )}
          </div>

          {/* Preview */}
          <div className="w-full md:w-2/3">
            <div className="aspect-square w-full glass rounded-[40px] border border-white/5 relative overflow-hidden flex items-center justify-center group">
              <AnimatePresence mode="wait">
                {generatedImage ? (
                  <motion.div 
                    key="image"
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full h-full"
                  >
                    <img 
                      src={generatedImage} 
                      alt="Generated Coffee Bean" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <a 
                        href={generatedImage} 
                        download="caffeina-bean.png"
                        className="p-4 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all"
                      >
                        <Download className="w-6 h-6 text-white" />
                      </a>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center gap-6 text-cream/20"
                  >
                    {isGenerating ? (
                      <div className="relative">
                        <div className="w-24 h-24 border-2 border-gold/20 rounded-full animate-ping absolute inset-0" />
                        <div className="w-24 h-24 border-2 border-gold rounded-full animate-spin border-t-transparent" />
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="w-20 h-20" />
                        <p className="text-sm font-medium tracking-widest uppercase">Preview Canvas</p>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
