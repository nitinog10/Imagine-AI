
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateImageFromPrompt } from './services/geminiService';
import { GeneratedImage, GenerationConfig, AspectRatio } from './types';
import { WandIcon, ImageIcon, SparkleIcon, HistoryIcon } from './components/Icons';
import LoadingShimmer from './components/LoadingShimmer';
import ImageCard from './components/ImageCard';

const ASPECT_RATIOS: AspectRatio[] = ['1:1', '4:3', '3:4', '16:9', '9:16'];

const SUGGESTIONS = [
  "A futuristic cyberpunk cityscape with neon lights reflecting in rainy streets, cinematic lighting, 8k",
  "Oil painting of a majestic white horse galloping through a field of lavender at sunset",
  "A high-tech laboratory inside a giant glass dome on Mars, scientific machinery, dusty atmosphere",
  "Macro photography of a mechanical butterfly with clockwork wings made of gold and crystals",
  "Surreal landscape where floating islands are connected by glowing waterfalls in a nebula sky"
];

function App() {
  const [prompt, setPrompt] = useState('');
  const [config, setConfig] = useState<GenerationConfig>({ aspectRatio: '1:1' });
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<GeneratedImage[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const historyEndRef = useRef<HTMLDivElement>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('imagine_ai_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('imagine_ai_history', JSON.stringify(history));
  }, [history]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setError(null);

    try {
      const imageUrl = await generateImageFromPrompt(prompt, config);
      
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: imageUrl,
        prompt: prompt,
        timestamp: Date.now(),
        config: { ...config }
      };

      setHistory(prev => [newImage, ...prev]);
      setPrompt('');
    } catch (err: any) {
      setError(err.message || 'Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDelete = (id: string) => {
    setHistory(prev => prev.filter(img => img.id !== id));
  };

  const applySuggestion = (text: string) => {
    setPrompt(text);
  };

  return (
    <div className="min-h-screen text-gray-100 flex flex-col md:flex-row bg-[#030712]">
      {/* Sidebar - Controls */}
      <aside className="w-full md:w-[380px] lg:w-[420px] bg-[#09090b] border-r border-white/5 p-6 md:h-screen overflow-y-auto sticky top-0 z-20">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.4)]">
            <SparkleIcon className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-outfit font-bold bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            ImagineAI
          </h1>
        </div>

        <div className="space-y-8">
          {/* Prompt Section */}
          <section>
            <label className="block text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
              <WandIcon className="w-4 h-4 text-indigo-400" />
              Creative Prompt
            </label>
            <div className="relative group">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your imagination in detail..."
                className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none group-hover:border-white/20"
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-600 w-full mb-1">Try These</span>
              {SUGGESTIONS.slice(0, 3).map((s, i) => (
                <button
                  key={i}
                  onClick={() => applySuggestion(s)}
                  className="text-[11px] bg-white/5 border border-white/5 px-2.5 py-1 rounded-full text-gray-400 hover:bg-indigo-500/10 hover:text-indigo-300 hover:border-indigo-500/30 transition-all truncate max-w-full"
                >
                  {s.slice(0, 40)}...
                </button>
              ))}
            </div>
          </section>

          {/* Settings Section */}
          <section>
            <label className="block text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-indigo-400" />
              Image Configuration
            </label>
            <div className="space-y-6">
              <div>
                <span className="text-xs text-gray-500 block mb-3 font-medium uppercase tracking-widest">Aspect Ratio</span>
                <div className="grid grid-cols-5 gap-2">
                  {ASPECT_RATIOS.map((ratio) => (
                    <button
                      key={ratio}
                      onClick={() => setConfig({ ...config, aspectRatio: ratio })}
                      className={`flex flex-col items-center justify-center py-3 rounded-xl border transition-all ${
                        config.aspectRatio === ratio
                          ? 'bg-indigo-600/20 border-indigo-500 text-white'
                          : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'
                      }`}
                    >
                      <div className={`border-2 rounded-sm mb-1.5 ${
                        config.aspectRatio === ratio ? 'border-white' : 'border-gray-500'
                      }`} style={{
                        width: ratio === '16:9' ? '20px' : ratio === '9:16' ? '12px' : ratio === '1:1' ? '16px' : ratio === '4:3' ? '18px' : '14px',
                        height: ratio === '16:9' ? '12px' : ratio === '9:16' ? '20px' : ratio === '1:1' ? '16px' : ratio === '4:3' ? '14px' : '18px',
                      }}></div>
                      <span className="text-[10px] font-bold">{ratio}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all ${
              isGenerating || !prompt.trim()
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_4px_20px_rgba(79,70,229,0.3)] active:scale-95'
            }`}
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Generating...
              </>
            ) : (
              <>
                <WandIcon className="w-5 h-5" />
                Generate Image
              </>
            )}
          </button>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
              <p className="text-xs text-red-400 font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Footer Credit */}
        <div className="mt-12 pt-8 border-t border-white/5 text-center">
          <p className="text-xs text-gray-600">
            Powered by <span className="text-gray-400 font-semibold">Gemini 2.5 Flash Image</span>
          </p>
        </div>
      </aside>

      {/* Main Content - Results */}
      <main className="flex-1 flex flex-col p-6 md:p-10 lg:p-12 overflow-y-auto">
        <header className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <HistoryIcon className="text-gray-500 w-5 h-5" />
            <h2 className="text-lg font-outfit font-semibold text-white">Generation History</h2>
            <span className="px-2 py-0.5 bg-white/5 rounded-full text-[10px] text-gray-500 font-bold border border-white/10 uppercase tracking-tighter">
              {history.length} Creations
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isGenerating && <LoadingShimmer />}
          
          {history.length === 0 && !isGenerating ? (
            <div className="col-span-full py-32 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6 border border-white/10">
                <ImageIcon className="w-10 h-10 text-gray-600" />
              </div>
              <h3 className="text-2xl font-outfit font-semibold text-white mb-2">No Images Yet</h3>
              <p className="text-gray-500 max-w-sm">
                Enter a descriptive prompt on the left to start generating unique AI-powered artwork.
              </p>
            </div>
          ) : (
            history.map((image) => (
              <ImageCard 
                key={image.id} 
                image={image} 
                onDelete={handleDelete} 
              />
            ))
          )}
        </div>
        
        <div ref={historyEndRef} />
      </main>
    </div>
  );
}

export default App;
