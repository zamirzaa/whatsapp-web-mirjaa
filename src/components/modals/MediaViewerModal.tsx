import React from 'react';
import { X, Download } from 'lucide-react';

interface MediaViewerModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export const MediaViewerModal: React.FC<MediaViewerModalProps> = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between items-center p-4 backdrop-blur-md select-none animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between text-white px-4 py-2">
        <span className="text-sm font-medium">Photo preview</span>
        <div className="flex items-center space-x-4">
          <a
            href={imageUrl}
            download="whatsapp-image.jpg"
            className="p-2 hover:bg-white/10 rounded-full cursor-pointer transition-colors"
            title="Download"
          >
            <Download className="w-5 h-5" />
          </a>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full cursor-pointer transition-colors"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Image */}
      <div className="flex-1 flex items-center justify-center p-4 max-h-[85vh]">
        <img
          src={imageUrl}
          alt="Full view"
          className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
        />
      </div>

      {/* Footer space */}
      <div className="h-8" />
    </div>
  );
};
