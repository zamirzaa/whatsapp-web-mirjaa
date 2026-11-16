import React, { useState } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { MessageSquare, QrCode, Smartphone, ArrowRight, ShieldCheck, RefreshCw, Sun, Moon } from 'lucide-react';

export const AuthQRScreen: React.FC = () => {
  const { login, theme, toggleTheme } = useWhatsApp();
  const [usePhoneLogin, setUsePhoneLogin] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [staySignedIn, setStaySignedIn] = useState(true);

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim().length > 5) {
      login();
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#111b21] flex flex-col items-center justify-between font-sans text-[#e9edef] select-none">
      {/* Top Green Background Banner */}
      <div className="absolute top-0 left-0 w-full h-[220px] bg-[#00a884] z-0" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[1040px] px-6 pt-8 pb-12 flex flex-col flex-1">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3.5">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#00a884] shadow-sm">
              <MessageSquare className="w-5 h-5 fill-current" />
            </div>
            <span className="text-sm font-semibold tracking-wider text-white uppercase">
              WHATSAPP WEB
            </span>
          </div>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-black/10 text-white transition-colors cursor-pointer"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        {/* Card Box */}
        <div className="bg-[#202c33] dark:bg-[#202c33] rounded-lg shadow-2xl p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-12 border border-[#313d45]">
          {/* Instructions Column */}
          <div className="flex-1 space-y-6">
            <h1 className="text-2xl md:text-3xl font-light text-[#e9edef] tracking-tight">
              To use WhatsApp on your computer:
            </h1>

            {!usePhoneLogin ? (
              <ol className="space-y-4 text-[#aebac1] text-[17px] leading-relaxed list-decimal list-inside marker:font-medium">
                <li className="pl-2">Open WhatsApp on your phone</li>
                <li className="pl-2">
                  Tap <span className="font-semibold text-white">Menu</span> (Android) or{' '}
                  <span className="font-semibold text-white">Settings</span> (iPhone)
                </li>
                <li className="pl-2">
                  Tap <span className="font-semibold text-white">Linked devices</span> and then{' '}
                  <span className="font-semibold text-white">Link a device</span>
                </li>
                <li className="pl-2">Point your phone at this screen to capture the code</li>
              </ol>
            ) : (
              <form onSubmit={handlePhoneSubmit} className="space-y-5 pt-2">
                <p className="text-[#aebac1] text-base">
                  Enter your phone number to receive a 8-digit linking code on WhatsApp.
                </p>
                <div className="flex items-center bg-[#111b21] rounded-md border border-[#313d45] px-4 py-3">
                  <span className="text-white font-medium mr-3">+62</span>
                  <input
                    type="tel"
                    placeholder="812-3456-7890"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    className="bg-transparent flex-1 text-white placeholder-[#8696a0] outline-none text-base font-mono"
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#00a884] hover:bg-[#008f70] text-[#111b21] font-semibold py-3 px-6 rounded-md transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>Generate Linking Code</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            <div className="pt-2 flex flex-col space-y-3">
              <button
                type="button"
                onClick={() => setUsePhoneLogin(!usePhoneLogin)}
                className="text-[#00a884] hover:underline text-[15px] font-medium text-left cursor-pointer inline-flex items-center space-x-1.5"
              >
                <span>{usePhoneLogin ? 'Link with QR code instead' : 'Link with phone number'}</span>
              </button>

              <label className="flex items-center space-x-3 text-[#aebac1] text-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={staySignedIn}
                  onChange={e => setStaySignedIn(e.target.checked)}
                  className="w-4 h-4 rounded text-[#00a884] accent-[#00a884] cursor-pointer"
                />
                <span>Stay signed in on this browser</span>
              </label>
            </div>
          </div>

          {/* QR Code Column */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative p-4 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center group cursor-pointer" onClick={login}>
              {/* QR Canvas / Visual */}
              <div className="w-64 h-64 border-4 border-slate-900 rounded-lg p-2 flex flex-col justify-between relative bg-white">
                <div className="flex justify-between">
                  <div className="w-14 h-14 border-4 border-slate-900 rounded-md flex items-center justify-center">
                    <div className="w-6 h-6 bg-slate-900 rounded-sm" />
                  </div>
                  <div className="w-14 h-14 border-4 border-slate-900 rounded-md flex items-center justify-center">
                    <div className="w-6 h-6 bg-slate-900 rounded-sm" />
                  </div>
                </div>

                {/* Center WhatsApp icon badge */}
                <div className="absolute inset-0 m-auto w-14 h-14 bg-white border-2 border-[#00a884] rounded-full flex items-center justify-center shadow-md">
                  <MessageSquare className="w-8 h-8 text-[#00a884] fill-current" />
                </div>

                {/* QR Matrix Pattern Simulation */}
                <div className="w-full h-full flex flex-wrap items-center justify-center gap-1.5 opacity-90 p-2">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-3.5 h-3.5 rounded-xs ${
                        i % 2 === 0 || i % 5 === 0 ? 'bg-slate-900' : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex justify-between">
                  <div className="w-14 h-14 border-4 border-slate-900 rounded-md flex items-center justify-center">
                    <div className="w-6 h-6 bg-slate-900 rounded-sm" />
                  </div>
                  <div className="w-10 h-10 flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-slate-800" />
                  </div>
                </div>
              </div>

              {/* Hover overlay hint */}
              <div className="absolute inset-0 bg-black/75 rounded-xl opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white text-center p-4">
                <RefreshCw className="w-8 h-8 mb-2 animate-spin text-[#00a884]" />
                <span className="font-semibold text-sm">Click to Instantly Link Demo Account</span>
              </div>
            </div>

            {/* Quick Demo Login CTA Button */}
            <button
              onClick={login}
              className="w-full max-w-64 bg-[#00a884] hover:bg-[#029575] text-[#111b21] font-semibold py-2.5 px-4 rounded-md text-sm transition-colors shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>One-Click Scan & Enter</span>
            </button>
          </div>
        </div>

        {/* Video Tutorial Banner */}
        <div className="mt-8 flex items-center justify-center text-center space-x-2 text-sm text-[#8696a0]">
          <ShieldCheck className="w-4 h-4 text-[#00a884]" />
          <span>Your personal messages are end-to-end encrypted</span>
        </div>
      </div>
    </div>
  );
};
