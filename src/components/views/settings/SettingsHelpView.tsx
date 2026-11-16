import React from 'react';
import { useWhatsApp } from '../../../context/WhatsAppContext';
import { ArrowLeft, HelpCircle, FileText, Shield, ExternalLink } from 'lucide-react';

export const SettingsHelpView: React.FC = () => {
  const { setSubView } = useWhatsApp();

  return (
    <div className="flex-1 flex flex-col h-full bg-[#111b21] select-none overflow-hidden animate-in slide-in-from-left duration-150">
      {/* Header */}
      <div className="h-[60px] px-4 flex items-center space-x-6 border-b border-[#222d34] shrink-0">
        <button
          onClick={() => setSubView('none')}
          className="text-[#aebac1] hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-medium text-[#e9edef]">Help and feedback</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#222d34]/60">
        <a
          href="https://faq.whatsapp.com/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between p-4 hover:bg-[#202c33] cursor-pointer transition-colors"
        >
          <div className="flex items-center space-x-4">
            <HelpCircle className="w-5 h-5 text-[#8696a0]" />
            <div>
              <h4 className="text-base text-[#e9edef]">Help Center</h4>
              <p className="text-xs text-[#8696a0]">Get help, contact support</p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-[#8696a0]" />
        </a>

        <a
          href="https://www.whatsapp.com/legal/terms-of-service"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between p-4 hover:bg-[#202c33] cursor-pointer transition-colors"
        >
          <div className="flex items-center space-x-4">
            <FileText className="w-5 h-5 text-[#8696a0]" />
            <div>
              <h4 className="text-base text-[#e9edef]">Terms and Privacy Policy</h4>
              <p className="text-xs text-[#8696a0]">Read our terms and policies</p>
            </div>
          </div>
          <ExternalLink className="w-4 h-4 text-[#8696a0]" />
        </a>

        <div className="flex items-center space-x-4 p-4 hover:bg-[#202c33] cursor-pointer transition-colors">
          <Shield className="w-5 h-5 text-[#8696a0]" />
          <div>
            <h4 className="text-base text-[#e9edef]">Channel licenses</h4>
            <p className="text-xs text-[#8696a0]">Open source software and licenses</p>
          </div>
        </div>

        <div className="p-6 text-center text-xs text-[#8696a0] space-y-1">
          <p className="font-semibold text-[#e9edef]">WhatsApp Web Clone v2.26.1</p>
          <p>End-to-end encrypted • Built with React & Vite</p>
        </div>
      </div>
    </div>
  );
};
