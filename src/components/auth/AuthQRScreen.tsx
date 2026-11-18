import React, { useState, useEffect } from 'react';
import { useWhatsApp } from '../../context/WhatsAppContext';
import { MessageSquare, QrCode, Smartphone, ArrowRight, ShieldCheck, RefreshCw, Sun, Moon, KeyRound, UserPlus } from 'lucide-react';
import { api } from '../../services/api';

export const AuthQRScreen: React.FC = () => {
  const { login, theme, toggleTheme } = useWhatsApp();
  const [authMode, setAuthMode] = useState<'qr' | 'phone' | 'register'>('qr');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [staySignedIn, setStaySignedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [qrToken, setQrToken] = useState<string>('');

  // Fetch live QR token from server
  useEffect(() => {
    let interval: number;

    const fetchQR = async () => {
      try {
        const data = await api.generateQR();
        setQrToken(data.qrToken);
      } catch {
        setQrToken('demo_qr_token');
      }
    };

    fetchQR();

    // Poll QR status every 3 seconds
    interval = window.setInterval(async () => {
      if (!qrToken || qrToken === 'demo_qr_token') return;
      try {
        const res = await api.checkQRStatus(qrToken);
        if (res.status === 'confirmed' && res.token) {
          login(res.token, res.user);
        } else if (res.status === 'expired') {
          fetchQR();
        }
      } catch {}
    }, 3000);

    return () => clearInterval(interval);
  }, [login, qrToken]);

  // Handle Quick Login
  const handleQuickLogin = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await api.quickLogin();
      login(res.token, res.user);
    } catch {
      // Fallback
      login();
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Login form
  const handleFormLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setErrorMsg('Masukkan username atau nomor HP');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await api.login(identifier.trim(), password || 'password123');
      login(res.token, res.user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Login gagal. Cek kredensial Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Register form
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !displayName.trim() || !identifier.trim()) {
      setErrorMsg('Semua data wajib diisi');
      return;
    }
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await api.register({
        username: username.trim(),
        displayName: displayName.trim(),
        phone: identifier.trim(),
        password: password || 'password123',
      });
      login(res.token, res.user);
    } catch (err: any) {
      setErrorMsg(err.message || 'Pendaftaran gagal');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#f0f2f5] dark:bg-[#111b21] flex flex-col items-center justify-between font-sans text-[#111b21] dark:text-[#e9edef] select-none transition-colors duration-200">
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
        <div className="bg-white dark:bg-[#202c33] rounded-lg shadow-2xl p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-12 border border-[#e9edef] dark:border-[#313d45]">
          {/* Instructions Column */}
          <div className="flex-1 space-y-6">
            <h1 className="text-2xl md:text-3xl font-light text-[#111b21] dark:text-[#e9edef] tracking-tight">
              {authMode === 'register'
                ? 'Buat Akun WhatsApp Web Baru:'
                : authMode === 'phone'
                ? 'Masuk dengan Nomor / Username:'
                : 'To use WhatsApp on your computer:'}
            </h1>

            {errorMsg && (
              <div className="p-3 bg-red-500/15 border border-red-500/40 rounded text-red-500 text-sm">
                {errorMsg}
              </div>
            )}

            {authMode === 'qr' && (
              <ol className="space-y-4 text-[#54656f] dark:text-[#aebac1] text-[17px] leading-relaxed list-decimal list-inside marker:font-medium">
                <li className="pl-2">Open WhatsApp on your phone</li>
                <li className="pl-2">
                  Tap <span className="font-semibold text-[#111b21] dark:text-white">Menu</span> (Android) or{' '}
                  <span className="font-semibold text-[#111b21] dark:text-white">Settings</span> (iPhone)
                </li>
                <li className="pl-2">
                  Tap <span className="font-semibold text-[#111b21] dark:text-white">Linked devices</span> and then{' '}
                  <span className="font-semibold text-[#111b21] dark:text-white">Link a device</span>
                </li>
                <li className="pl-2">Point your phone at this screen to capture the code</li>
              </ol>
            )}

            {authMode === 'phone' && (
              <form onSubmit={handleFormLogin} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#54656f] dark:text-[#8696a0]">Username / Nomor Telepon</label>
                  <div className="flex items-center bg-[#f0f2f5] dark:bg-[#111b21] rounded-md border border-[#d1d7db] dark:border-[#313d45] px-3.5 py-2.5">
                    <input
                      type="text"
                      placeholder="mirza atau +6281234567890"
                      value={identifier}
                      onChange={e => setIdentifier(e.target.value)}
                      className="bg-transparent flex-1 text-[#111b21] dark:text-white placeholder-[#8696a0] outline-none text-base font-mono"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#54656f] dark:text-[#8696a0]">Password (Default: password123)</label>
                  <div className="flex items-center bg-[#f0f2f5] dark:bg-[#111b21] rounded-md border border-[#d1d7db] dark:border-[#313d45] px-3.5 py-2.5">
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="bg-transparent flex-1 text-[#111b21] dark:text-white placeholder-[#8696a0] outline-none text-base font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#00a884] hover:bg-[#008f70] text-[#111b21] font-semibold py-3 px-6 rounded-md transition-all cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>{isLoading ? 'Sedang Masuk...' : 'Masuk ke Akun'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {authMode === 'register' && (
              <form onSubmit={handleRegister} className="space-y-3 pt-1">
                <div>
                  <label className="text-xs font-semibold text-[#54656f] dark:text-[#8696a0]">Nama Tampilan</label>
                  <input
                    type="text"
                    placeholder="Nama Lengkap Anda"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    className="w-full bg-[#f0f2f5] dark:bg-[#111b21] rounded border border-[#d1d7db] dark:border-[#313d45] px-3 py-2 text-sm text-[#111b21] dark:text-white outline-none"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#54656f] dark:text-[#8696a0]">Username Unik</label>
                  <input
                    type="text"
                    placeholder="contoh: budi_santoso"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full bg-[#f0f2f5] dark:bg-[#111b21] rounded border border-[#d1d7db] dark:border-[#313d45] px-3 py-2 text-sm text-[#111b21] dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#54656f] dark:text-[#8696a0]">Nomor HP</label>
                  <input
                    type="tel"
                    placeholder="+628xxxxxxxxxx"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    className="w-full bg-[#f0f2f5] dark:bg-[#111b21] rounded border border-[#d1d7db] dark:border-[#313d45] px-3 py-2 text-sm text-[#111b21] dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#54656f] dark:text-[#8696a0]">Password</label>
                  <input
                    type="password"
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-[#f0f2f5] dark:bg-[#111b21] rounded border border-[#d1d7db] dark:border-[#313d45] px-3 py-2 text-sm text-[#111b21] dark:text-white outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#00a884] hover:bg-[#008f70] text-[#111b21] font-semibold py-2.5 px-6 rounded-md transition-all cursor-pointer flex items-center justify-center space-x-2 mt-2"
                >
                  <span>{isLoading ? 'Mendaftarkan...' : 'Daftar Akun Baru'}</span>
                  <UserPlus className="w-4 h-4" />
                </button>
              </form>
            )}

            <div className="pt-2 flex flex-col space-y-2">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'phone' ? 'qr' : 'phone')}
                  className="text-[#00a884] hover:underline text-[14px] font-medium cursor-pointer inline-flex items-center space-x-1"
                >
                  <KeyRound className="w-3.5 h-3.5 mr-1" />
                  <span>{authMode === 'phone' ? 'Pindai kode QR' : 'Masuk via Nomor / Password'}</span>
                </button>

                <span className="text-[#8696a0]">•</span>

                <button
                  type="button"
                  onClick={() => setAuthMode(authMode === 'register' ? 'qr' : 'register')}
                  className="text-[#00a884] hover:underline text-[14px] font-medium cursor-pointer"
                >
                  <span>{authMode === 'register' ? 'Kembali' : 'Daftar Akun Baru'}</span>
                </button>
              </div>

              <label className="flex items-center space-x-3 text-[#54656f] dark:text-[#aebac1] text-sm cursor-pointer select-none pt-1">
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
            <div
              className="relative p-4 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center group cursor-pointer border border-[#e9edef]"
              onClick={handleQuickLogin}
              title="Klik untuk langsung masuk ke akun Mirza"
            >
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
                <span className="font-semibold text-sm">Klik untuk Masuk Langsung (Akun Aktif)</span>
              </div>
            </div>

            {/* Quick Demo Login CTA Button */}
            <button
              onClick={handleQuickLogin}
              disabled={isLoading}
              className="w-full max-w-64 bg-[#00a884] hover:bg-[#029575] text-[#111b21] font-semibold py-2.5 px-4 rounded-md text-sm transition-colors shadow-md flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Smartphone className="w-4 h-4" />
              <span>{isLoading ? 'Menghubungkan...' : 'One-Click Scan & Enter'}</span>
            </button>
          </div>
        </div>

        {/* Video Tutorial Banner */}
        <div className="mt-8 flex items-center justify-center text-center space-x-2 text-sm text-[#54656f] dark:text-[#8696a0]">
          <ShieldCheck className="w-4 h-4 text-[#00a884]" />
          <span>Your personal messages are end-to-end encrypted</span>
        </div>
      </div>
    </div>
  );
};
