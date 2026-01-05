
import React from 'react';

const LoadingShimmer: React.FC = () => {
  return (
    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-900 border border-white/5 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_2s_infinite] -skew-x-12 transform"></div>
      <div className="text-center z-10 px-6">
        <div className="inline-block p-4 rounded-full bg-indigo-500/10 mb-4">
          <svg className="w-10 h-10 text-indigo-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="text-xl font-outfit text-white font-semibold mb-2">Generating Masterpiece</h3>
        <p className="text-gray-400 text-sm max-w-xs mx-auto">
          Our AI model is interpreting your vision and crafting the details...
        </p>
      </div>
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingShimmer;
