import { Role, Santri } from '../types';
import { Shield, BookOpen, Users, User, ArrowRightLeft, Lock, Unlock } from 'lucide-react';

interface RoleSelectorProps {
  currentRole: Role;
  onChangeRole: (role: Role) => void;
  allSantri: Santri[];
  selectedSantriId: string;
  onSelectSantri: (id: string) => void;
  isAdminAuthenticated?: boolean;
  onAdminLogout?: () => void;
}

export default function RoleSelector({
  currentRole,
  onChangeRole,
  allSantri,
  selectedSantriId,
  onSelectSantri,
  isAdminAuthenticated = false,
  onAdminLogout,
}: RoleSelectorProps) {
  const activeSantri = allSantri.find(s => s.id === selectedSantriId) || allSantri[0];

  return (
    <div className="bg-gradient-to-r from-emerald-900 to-teal-980 text-white shadow-md border-b border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 space-y-4 md:space-y-0">
          {/* Brand header */}
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-600 p-2 rounded-xl text-emerald-55 shadow-md flex items-center justify-center">
              <BookOpen className="w-6 h-6" id="app-logo-icon" />
            </div>
            <div className="max-w-md">
              <h1 className="text-xs sm:text-sm font-bold font-sans tracking-tight text-emerald-100 flex items-center gap-1.5">
                TPQ AL ASYHAR & MADIN MIFTAHUL ULUM 1
                <span className="text-[9px] bg-emerald-500/35 text-emerald-300 font-medium px-1.5 py-0.2 rounded-full border border-emerald-500/20 whitespace-nowrap">TPQ & MADIN</span>
              </h1>
              <p className="text-[10px] text-emerald-300 font-mono tracking-tight leading-tight mt-0.5">SIMA MOGA PEMALANG JAWA TENGAH</p>
            </div>
          </div>

          {/* Role selector buttons */}
          <div className="flex flex-wrap gap-2 bg-emerald-950/60 p-1.5 rounded-2xl border border-emerald-800/40">
            <button
              id="role-btn-santri"
              onClick={() => onChangeRole('Santri')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                currentRole === 'Santri'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-emerald-300 hover:text-emerald-50 hover:bg-emerald-900/40'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Santri</span>
            </button>
            <button
              id="role-btn-wali"
              onClick={() => onChangeRole('Wali')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                currentRole === 'Wali'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-emerald-300 hover:text-emerald-50 hover:bg-emerald-900/40'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Wali Santri</span>
            </button>
            <button
              id="role-btn-pengurus"
              onClick={() => onChangeRole('Pengurus')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                currentRole === 'Pengurus'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-emerald-300 hover:text-emerald-50 hover:bg-emerald-900/40'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Pengurus & Ustadz</span>
              {isAdminAuthenticated && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" title="Akses Admin Terbuka" />
              )}
            </button>
            {isAdminAuthenticated && onAdminLogout && (
              <button
                id="role-btn-lock-admin"
                onClick={(e) => {
                  e.stopPropagation();
                  onAdminLogout();
                }}
                className="flex items-center gap-1 px-2.5 py-2 bg-emerald-950 hover:bg-rose-900 text-emerald-400 hover:text-rose-100 rounded-xl text-xs font-bold border border-emerald-800/60 hover:border-rose-800/65 transition-all"
                title="Kunci Kembali Akses Administrator"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sahkan Kunci</span>
              </button>
            )}
          </div>
        </div>

        {/* Impersonation / Active profile filter for Santri & Wali roles */}
        {(currentRole === 'Santri' || currentRole === 'Wali') && (
          <div className="py-2.5 px-4 bg-emerald-950/40 border-t border-emerald-800/25 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center space-x-2 text-emerald-200">
              <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-400" />
              <span>
                {currentRole === 'Santri' 
                  ? 'Simulasi Akun Santri Aktif:' 
                  : 'Simulasi Akun Wali dari Santri:'}
              </span>
              <strong className="text-white bg-emerald-800/60 px-2.5 py-0.5 rounded border border-emerald-700/40 font-medium">
                {currentRole === 'Santri' 
                  ? activeSantri.nama 
                  : `${activeSantri.namaWali} (Orang Tua ${activeSantri.nama})`}
              </strong>
            </div>

            {/* Profile switching dropdown */}
            <div className="flex items-center space-x-2">
              <label htmlFor="santri-switch-select" className="text-emerald-300">Ganti Akun Santri:</label>
              <select
                id="santri-switch-select"
                value={selectedSantriId}
                onChange={(e) => onSelectSantri(e.target.value)}
                className="bg-emerald-800/60 text-white border border-emerald-700 rounded-lg px-2 py-1 outline-none text-xs focus:ring-1 focus:ring-emerald-400 focus:border-emerald-400"
              >
                {allSantri.map(s => (
                  <option key={s.id} value={s.id} className="bg-emerald-900 text-white">
                    {s.nama} ({s.kelas})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
