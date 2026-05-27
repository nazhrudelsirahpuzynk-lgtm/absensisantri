import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Key, Eye, EyeOff, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';

interface AdminGateProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AdminGate({ onSuccess, onCancel }: AdminGateProps) {
  const [authMode, setAuthMode] = useState<'pin' | 'password'>('pin');
  const [pin, setPin] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [shake, setShake] = useState<boolean>(false);
  const [showHelp, setShowHelp] = useState<boolean>(true);

  const MASTER_PIN = '2525';
  const MASTER_PASSWORD = 'admin123';

  const triggerError = (msg: string) => {
    setErrorMsg(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');

    if (authMode === 'pin') {
      if (pin === MASTER_PIN) {
        proceedSuccess();
      } else {
        triggerError('PIN Keamanan salah! Silakan coba lagi.');
        setPin('');
      }
    } else {
      if (password === MASTER_PASSWORD) {
        proceedSuccess();
      } else {
        triggerError('Kata Sandi salah! Silakan coba lagi.');
        setPassword('');
      }
    }
  };

  const proceedSuccess = () => {
    setIsSuccess(true);
    setTimeout(() => {
      onSuccess();
    }, 750);
  };

  const handleKeypadPress = (num: string) => {
    setErrorMsg('');
    if (pin.length < 6) {
      const updated = pin + num;
      setPin(updated);
      // Auto-submit PIN if it reaches 4 digits (the master PIN is 4 digits)
      if (updated === MASTER_PIN) {
        setIsSuccess(true);
        setTimeout(() => {
          onSuccess();
        }, 700);
      } else if (updated.length === 4 && updated !== MASTER_PIN) {
        setTimeout(() => {
          triggerError('PIN Keamanan tidak sesuai.');
          setPin('');
        }, 150);
      }
    }
  };

  const handleKeypadDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div className="max-w-md mx-auto my-12" id="admin-security-gate">
      <motion.div
        className="bg-white rounded-[2.2rem] border border-slate-100 shadow-xl overflow-hidden"
        animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        {/* Top header badge */}
        <div className="bg-[#023f30] p-8 text-center text-white relative">
          <button
            onClick={onCancel}
            className="absolute top-8 left-6 text-emerald-200 hover:text-white transition-all hover:scale-105"
            title="Kembali ke Dashboard Santri"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="bg-[#045d47] border border-[#05785a]/40 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-4 relative shadow-sm">
            {isSuccess ? (
              <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} className="text-emerald-300">
                <CheckCircle2 className="w-10 h-10" />
              </motion.div>
            ) : (
              <Key className="w-10 h-10 text-emerald-300 animate-pulse" />
            )}
          </div>
          <h2 className="text-xl font-bold font-sans tracking-wide">Verifikasi Sandi Pengurus</h2>
          <p className="text-xs text-emerald-200/80 mt-2 font-normal">Area khusus ustadz, pimpinan, dan pengurus pondok pesantren</p>
        </div>

        

        {/* View Switches */}
        <div className="flex px-6 pt-4 border-b border-slate-100">
          <button
            onClick={() => { setAuthMode('pin'); setErrorMsg(''); }}
            className={`flex-1 pb-3 text-xs font-bold border-b-2 transition-all ${
              authMode === 'pin' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-400'
            }`}
          >
            Numeric PIN
          </button>
          <button
            onClick={() => { setAuthMode('password'); setErrorMsg(''); }}
            className={`flex-1 pb-3 text-xs font-bold border-b-2 transition-all ${
              authMode === 'password' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-400'
            }`}
          >
            Kata Sandi
          </button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-rose-50 text-rose-800 border border-rose-200 p-3 rounded-2xl mb-4 text-xs flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {authMode === 'pin' ? (
            <div className="space-y-6">
              {/* PIN circles indicator */}
              <div className="flex justify-center gap-4 py-2">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-150 ${
                      isSuccess
                        ? 'bg-emerald-550 border-emerald-550 scale-110'
                        : index < pin.length
                        ? 'bg-emerald-700 border-emerald-700 scale-105'
                        : 'border-slate-300'
                    }`}
                  />
                ))}
              </div>

              {/* Pin keypad */}
              <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleKeypadPress(num)}
                    className="w-14 h-14 bg-slate-50 hover:bg-emerald-50 active:scale-95 text-slate-800 hover:text-emerald-800 font-bold rounded-2xl flex items-center justify-center text-lg shadow-2xs border border-transparent hover:border-emerald-200/50 transition-all mx-auto"
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPin('')}
                  className="w-14 h-14 text-slate-400 hover:text-rose-600 text-xs font-bold bg-slate-50 hover:bg-rose-50 active:scale-95 rounded-2xl flex items-center justify-center mx-auto transition-all"
                >
                  Ciri
                </button>
                <button
                  type="button"
                  onClick={() => handleKeypadPress('0')}
                  className="w-14 h-14 bg-slate-50 hover:bg-emerald-50 active:scale-95 text-slate-800 font-bold rounded-2xl flex items-center justify-center text-lg border border-transparent mx-auto transition-all"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleKeypadDelete}
                  className="w-14 h-14 text-slate-400 hover:text-slate-600 text-xs font-bold bg-slate-50 hover:bg-slate-100 active:scale-95 rounded-2xl flex items-center justify-center mx-auto transition-all"
                  title="Hapus digit terakhir"
                >
                  Hapus
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label htmlFor="gate-pass-input" className="block text-xxs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Kata Sandi Pengurus</label>
                <div className="relative">
                  <input
                    id="gate-pass-input"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan sandi khusus ustadz..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs font-medium border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:ring-1 focus:ring-emerald-500 bg-white shadow-2xs pr-11"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold py-2.5 rounded-xl text-xs transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-emerald-650 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-xs"
                >
                  Masuk Area Admin
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 flex flex-col items-center gap-1.5 justify-center">
            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="text-xxs font-bold text-slate-450 hover:text-emerald-700 hover:underline transition-colors uppercase tracking-wider"
            >
              {showHelp ? "Sembunyikan Kunci Demo" : "Butuh Bantuan Kunci Akses?"}
            </button>

            <button
              onClick={proceedSuccess}
              type="button"
              className="mt-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-bold px-4 py-2.5 rounded-xl text-xxs transition-all tracking-wider uppercase flex items-center justify-center gap-1.5 w-full cursor-pointer shadow-2xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" /> Masuk Instan (Bypass Demo)
            </button>

            <div className="text-[10px] text-slate-400 text-center uppercase tracking-wider font-semibold mt-2">
              Kemanan TPQ AL ASYHAR & MADIN MIFTAHUL ULUM 1
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
