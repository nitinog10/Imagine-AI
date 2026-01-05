
import React from 'react';
import { GeneratedImage } from '../types';
import { DownloadIcon, TrashIcon } from './Icons';

interface ImageCardProps {
  image: GeneratedImage;
  onDelete: (id: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onDelete }) => {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `imagine-ai-${image.id}.png`;
    link.click();
  };

  return (
    <div className="group relative rounded-xl overflow-hidden bg-gray-900 border border-white/10 transition-all duration-300 hover:border-indigo-500/50 hover:shadow-[0_0_20px_rgba(99,102,241,0.2)]">
      <div className={`relative w-full aspect-[${image.config.aspectRatio.replace(':', '/')}] overflow-hidden`}>
        <img 
          src={image.url} 
          alt={image.prompt}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <p className="text-sm text-white line-clamp-2 mb-3 font-medium">
            {image.prompt}
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-2 rounded-lg font-semibold text-xs hover:bg-gray-200 transition-colors"
            >
              <DownloadIcon className="w-3.5 h-3.5" />
              Download
            </button>
            <button 
              onClick={() => onDelete(image.id)}
              className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors border border-red-500/20"
              title="Delete from history"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Label for aspect ratio */}
      <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-md rounded text-[10px] text-gray-300 border border-white/10">
        {image.config.aspectRatio}
      </div>
    </div>
  );
};

export default ImageCard;
