import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  FileSpreadsheet, 
  RefreshCw, 
  CheckCircle, 
  ExternalLink, 
  LogOut, 
  AlertCircle,
  Database,
  Users,
  ShieldCheck,
  Calendar,
  Wallet,
  Folder,
  FolderOpen,
  FolderPlus,
  UploadCloud,
  Trash2,
  FileImage,
  FileText,
  File,
  Plus,
  ArrowUpCircle
} from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  initAuth, 
  googleSignIn, 
  logout, 
  createSheetsReport, 
  getAccessToken 
} from '../utils/googleSheets';
import { 
  fetchDriveFiles, 
  createDriveFolder, 
  uploadFileToDrive, 
  deleteDriveFile 
} from '../utils/googleDrive';
import { Santri, Ustadz, KeuanganPondok, SetoranHafalan, Perizinan, TagihanSPP } from '../types';

interface GoogleSheetsSyncProps {
  allSantri: Santri[];
  ustadzList: Ustadz[];
  keuanganList: KeuanganPondok[];
  setoranList: SetoranHafalan[];
  perizinanList: Perizinan[];
  tagihanList: TagihanSPP[];
}

export default function GoogleSheetsSync({
  allSantri,
  ustadzList,
  keuanganList,
  setoranList,
  perizinanList,
  tagihanList
}: GoogleSheetsSyncProps) {
  // Authentication states
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [needsAuth, setNeedsAuth] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sub-tabs
  const [subTab, setSubTab] = useState<'sheets' | 'drive'>('sheets');

  // Sheets Sync states
  const [syncResult, setSyncResult] = useState<{ id: string; url: string } | null>(() => {
    const saved = localStorage.getItem('miftah_last_sync_sheet');
    return saved ? JSON.parse(saved) : null;
  });
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(() => {
    return localStorage.getItem('miftah_last_sync_time');
  });

  // Google Drive states
  const [driveFiles, setDriveFiles] = useState<any[]>([]);
  const [isDriveLoading, setIsDriveLoading] = useState<boolean>(false);
  const [miftahFolderId, setMiftahFolderId] = useState<string | null>(() => {
    return localStorage.getItem('miftah_drive_folder_id');
  });
  const [isCreatingFolder, setIsCreatingFolder] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track Auth state
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
        setNeedsAuth(false);
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
        setNeedsAuth(true);
      }
    );

    return () => unsubscribe();
  }, []);

  // Fetch Drive Files if Sub-Tab is Drive and authenticated
  useEffect(() => {
    if (!needsAuth && accessToken && subTab === 'drive') {
      loadDriveContent(accessToken);
    }
  }, [needsAuth, accessToken, subTab, miftahFolderId]);

  const loadDriveContent = async (token: string) => {
    setIsDriveLoading(true);
    setErrorMsg(null);
    try {
      // If we don't have miftahFolderId cached, scan drive folders to look for it
      let activeFolderId = miftahFolderId;
      if (!activeFolderId) {
        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
            "mimeType = 'application/vnd.google-apps.folder' and name = 'TPQ AL ASYHAR DAN MADIN MIFTAHUL ULUM 1' and trashed = false"
          )}&fields=files(id,name)`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        if (response.ok) {
          const resJson = await response.json();
          if (resJson.files && resJson.files.length > 0) {
            const foundId = resJson.files[0].id;
            setMiftahFolderId(foundId);
            localStorage.setItem('miftah_drive_folder_id', foundId);
            activeFolderId = foundId;
          }
        }
      }

      // Load files inside our folder, or general files if folder isn't created yet
      const filesList = await fetchDriveFiles(token, activeFolderId || undefined);
      setDriveFiles(filesList);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Gagal menyambungkan arsip Google Drive.');
    } finally {
      setIsDriveLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setAccessToken(res.accessToken);
        setNeedsAuth(false);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Login gagal. Pastikan koneksi internet stabil & izinkan folder popup.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      setCurrentUser(null);
      setAccessToken(null);
      setNeedsAuth(true);
      setMiftahFolderId(null);
      localStorage.removeItem('miftah_drive_folder_id');
      setErrorMsg(null);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Google Sheets Export helper
  const handleExportData = async () => {
    const token = accessToken || await getAccessToken();
    if (!token) {
      setNeedsAuth(true);
      setErrorMsg('Token autentikasi tidak tersedia. Silakan masuk kembali.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const report = await createSheetsReport(token, {
        allSantri,
        ustadzList,
        keuanganList,
        setoranList,
        perizinanList,
        tagihanList
      });

      setSyncResult(report);
      const now = new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }) + ', ' + new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      setLastSyncTime(now);
      localStorage.setItem('miftah_last_sync_sheet', JSON.stringify(report));
      localStorage.setItem('miftah_last_sync_time', now);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Proses ekspor gagal. Periksa izin akun Google Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  // Google Drive Folder Creation
  const handleCreateRootFolder = async () => {
    const token = accessToken || await getAccessToken();
    if (!token) return;

    setIsCreatingFolder(true);
    setErrorMsg(null);
    try {
      const folderId = await createDriveFolder(token, 'TPQ AL ASYHAR DAN MADIN MIFTAHUL ULUM 1');
      setMiftahFolderId(folderId);
      localStorage.setItem('miftah_drive_folder_id', folderId);
      await loadDriveContent(token);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Gagal menginisialisasi folder baru.');
    } finally {
      setIsCreatingFolder(false);
    }
  };

  // File Upload handling
  const handleUploadFile = async (file: File) => {
    const token = accessToken || await getAccessToken();
    if (!token) return;

    setIsUploading(true);
    setErrorMsg(null);
    try {
      await uploadFileToDrive(token, file, miftahFolderId || undefined);
      await loadDriveContent(token);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Gagal mengunggah berkas.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUploadFile(e.target.files[0]);
    }
  };

  // Drag and drop event handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  // File Deletion with Confirmation dialog
  const handleDeleteFile = async (fileId: string, fileName: string) => {
    // Explicit confirmation warning to prevent accidental deletions (Mandatory under Workspace Integrations)
    const confirmed = window.confirm(
      `Peringatan Keamanan Google Drive:\n\nApakah Anda yakin ingin menghapus berkas "${fileName}" secara permanen dari penyimpanan Google Drive Anda? Tindakan ini tidak dapat dibatalkan.`
    );
    if (!confirmed) return;

    const token = accessToken || await getAccessToken();
    if (!token) return;

    setIsDriveLoading(true);
    setErrorMsg(null);
    try {
      await deleteDriveFile(token, fileId);
      // Update local state directly to be fast.
      setDriveFiles(prev => prev.filter(f => f.id !== fileId));
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'Gagal menghapus berkas terpilih.');
    } finally {
      setIsDriveLoading(false);
    }
  };

  // Helper formatting size
  const formatBytes = (bytesStr: string | undefined) => {
    if (!bytesStr) return '-';
    const bytes = parseInt(bytesStr);
    if (isNaN(bytes)) return '-';
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Get file icon styling based on mime type
  const getFileIcon = (mimeType: string) => {
    if (mimeType === 'application/vnd.google-apps.folder') {
      return <Folder className="w-5 h-5 text-amber-500 shrink-0" />;
    }
    if (mimeType.startsWith('image/')) {
      return <FileImage className="w-5 h-5 text-blue-500 shrink-0" />;
    }
    if (mimeType.includes('pdf')) {
      return <FileText className="w-5 h-5 text-red-500 shrink-0" />;
    }
    if (mimeType.includes('spreadsheet') || mimeType.includes('sheet')) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-500 shrink-0" />;
    }
    if (mimeType.includes('document') || mimeType.includes('word') || mimeType.includes('rtf')) {
      return <FileText className="w-5 h-5 text-indigo-500 shrink-0" />;
    }
    return <File className="w-5 h-5 text-slate-500 shrink-0" />;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-8 max-w-4xl mx-auto" id="sheets-sync-container">
      {/* Upper header block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-slate-100">
        <div>
          <span className="bg-emerald-50 text-emerald-805 border border-emerald-250 text-[10px] font-bold px-2 py-0.5 rounded-lg inline-flex items-center gap-1 mb-2 font-sans animate-pulse">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Integrasi Google Drive & Workspace Cloud
          </span>
          <h3 className="font-sans font-bold text-slate-800 text-lg flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-emerald-600" />
            Pusat Awansistem TPQ AL ASYHAR & MADIN MIFTAHUL ULUM 1
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Ekspor laporan administrasi ke Google Sheets dan kelola seluruh arsip digital, surat izin, serta dokumen penting di Google Drive.
          </p>
        </div>

        {/* Auth Status Badge */}
        {!needsAuth && currentUser && (
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-150 px-3.5 py-1.5 rounded-2xl shrink-0">
            <img 
              src={currentUser.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'} 
              alt={currentUser.displayName || 'Google Member'} 
              className="w-8 h-8 rounded-full border border-emerald-400"
              referrerPolicy="no-referrer"
            />
            <div className="text-left">
              <p className="text-xxs font-bold text-slate-700 leading-tight truncate max-w-[130px]">{currentUser.displayName}</p>
              <p className="text-[9px] font-mono text-slate-400 leading-none truncate max-w-[130px]">{currentUser.email}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1 px-2 rounded-lg bg-red-50 text-red-650 hover:bg-red-100 transition-all font-sans text-[10px] font-extrabold cursor-pointer ml-1 inline-flex items-center gap-1"
              title="Keluar Akun Google"
            >
              <LogOut className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3 text-red-900 animate-fade-in" id="sheets-error-alert">
          <AlertCircle className="w-5 h-5 text-red-650 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold font-sans">Koneksi Bermasalah</p>
            <p className="text-xxs text-red-800 mt-1">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Main Core Area depending on Auth condition */}
      {needsAuth ? (
        <div className="text-center py-12 px-4 space-y-6" id="googlesignin-prompt">
          <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-55/35 text-emerald-800 mx-auto flex items-center justify-center relative">
            <Folder className="w-9 h-9 text-emerald-600 animate-pulse" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h4 className="font-bold text-slate-800 text-sm">Masuk Google Workspace</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Koneksikan akun Google Anda untuk mengizinkan aplikasi melakukan sinkronisasi dengan Google Sheets dan Google Drive Anda. Data administrasi pondok terintegrasi secara aman.
            </p>
          </div>

          {/* Styled Official Sign-in with Google button from guidelines */}
          <div className="flex justify-center">
            <button 
              onClick={handleLogin}
              disabled={isLoading}
              className="gsi-material-button shadow-md hover:shadow-lg transition-all focus:ring-2 focus:ring-emerald-500 rounded-xl"
              style={{ padding: '2px', cursor: 'pointer' }}
            >
              <div className="gsi-material-button-state"></div>
              <div className="gsi-material-button-content-wrapper">
                <div className="gsi-material-button-icon">
                  <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={{ display: 'block' }}>
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                    <svg viewBox="0 0 48 48"></svg>
                  </svg>
                </div>
                <span className="gsi-material-button-contents" style={{ fontSize: '13px', fontWeight: 'bold' }}>
                  {isLoading ? 'Menghubungkan...' : 'Hubungkan Akun Google'}
                </span>
              </div>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Sub Tab Navigation */}
          <div className="flex border-b border-slate-100 pb-px">
            <button
              onClick={() => setSubTab('sheets')}
              className={`pb-4 px-4 font-sans text-xs font-bold border-b-2 transition-all ${
                subTab === 'sheets' 
                  ? 'border-emerald-600 text-emerald-800' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4" />
                Laporan Google Sheets
              </div>
            </button>
            <button
              onClick={() => setSubTab('drive')}
              className={`pb-4 px-4 font-sans text-xs font-bold border-b-2 transition-all ${
                subTab === 'drive' 
                  ? 'border-emerald-600 text-emerald-800' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <FolderOpen className="w-4 h-4" />
                Arsip Penyimpanan Google Drive
              </div>
            </button>
          </div>

          {/* Sub-Tab 1: Google Sheets Sync */}
          {subTab === 'sheets' && (
            <div className="space-y-6 animate-fade-in" id="sheets-action-dashboard">
              {/* Statistics Grid */}
              <div>
                <h4 className="text-xxs font-bold text-slate-450 uppercase tracking-widest mb-3 font-sans">
                  Data yang siap diekspor ke Google Sheets:
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                    <Users className="w-5 h-5 text-amber-650 mx-auto mb-1.5" />
                    <p className="text-[10px] font-medium text-slate-500">Santri</p>
                    <p className="text-sm font-bold text-slate-800 font-sans mt-0.5">{allSantri.length}</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                    <ShieldCheck className="w-5 h-5 text-indigo-650 mx-auto mb-1.5" />
                    <p className="text-[10px] font-medium text-slate-500">Asatidzah</p>
                    <p className="text-sm font-bold text-slate-800 font-sans mt-0.5">{ustadzList.length}</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                    <Database className="w-5 h-5 text-emerald-650 mx-auto mb-1.5" />
                    <p className="text-[10px] font-medium text-slate-500">Hafalan</p>
                    <p className="text-sm font-bold text-slate-800 font-sans mt-0.5">{setoranList.length}</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                    <Wallet className="w-5 h-5 text-teal-650 mx-auto mb-1.5" />
                    <p className="text-[10px] font-medium text-slate-500">Jurnal Kas</p>
                    <p className="text-sm font-bold text-slate-800 font-sans mt-0.5">{keuanganList.length}</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                    <Calendar className="w-5 h-5 text-blue-650 mx-auto mb-1.5" />
                    <p className="text-[10px] font-medium text-slate-500">Perizinan</p>
                    <p className="text-sm font-bold text-slate-800 font-sans mt-0.5">{perizinanList.length}</p>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-center">
                    <FileSpreadsheet className="w-5 h-5 text-rose-650 mx-auto mb-1.5" />
                    <p className="text-[10px] font-medium text-slate-500">Tagihan SPP</p>
                    <p className="text-sm font-bold text-slate-800 font-sans mt-0.5">{tagihanList.length}</p>
                  </div>
                </div>
              </div>

              {/* Sync Button */}
              <div className="p-6 rounded-3xl bg-emerald-55/20 border border-emerald-100 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center md:text-left">
                  <h5 className="font-bold text-slate-800 text-sm">Mulai Sinkronisasi Berkas</h5>
                  <p className="text-xxs text-slate-500 leading-relaxed max-w-lg">
                    Sistem akan memvalidasi data administrasi kemudian menyusun tabel multi-tab secara serentak di Google Drive Anda. Laporan yang sudah dibuat sebelumnya tidak akan ditimpa, sistem akan membuat berkas baru dengan cap waktu.
                  </p>
                  {lastSyncTime && (
                    <p className="text-[10px] text-emerald-800 font-medium pt-1">
                      Sinkronisasi Terakhir: <strong className="font-bold">{lastSyncTime}</strong>
                    </p>
                  )}
                </div>

                <button
                  onClick={handleExportData}
                  disabled={isLoading}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-2xl text-xs shadow-md shadow-emerald-200/55 transition-all inline-flex items-center gap-2 cursor-pointer shrink-0"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileSpreadsheet className="w-4 h-4" />
                  )}
                  {isLoading ? 'Sedang Menyusun...' : 'Ekspor ke Google Sheets'}
                </button>
              </div>

              {/* Success output block */}
              {syncResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-emerald-250 bg-white shadow-xs rounded-3xl p-6"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-850 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-800 text-sm">Alhamdulillah, Spreadsheet Berhasil Dibuat!</h5>
                        <p className="text-xxs text-slate-500 mt-0.5">Berkas laporan administrasi telah selesai diproduksi dan disimpan.</p>
                      </div>
                    </div>

                    <a
                      href={syncResult.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xxs inline-flex items-center gap-1.5 hover:bg-black transition-all shadow-xs shrink-0 cursor-pointer"
                    >
                      Buka Google Sheets
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xxs font-mono text-slate-500">
                    <div className="truncate">
                      ID: <span className="text-slate-800 font-semibold">{syncResult.id}</span>
                    </div>
                    <div className="sm:text-right">
                      Penyedia Awan: <span className="text-[#15803d] font-bold">Google Sheets V4 API</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}

          {/* Sub-Tab 2: Google Drive Arsip */}
          {subTab === 'drive' && (
            <div className="space-y-6 animate-fade-in" id="drive-action-dashboard">
              {/* Folder Configuration state */}
              {!miftahFolderId ? (
                <div className="p-8 border border-amber-200 bg-amber-50 rounded-3xl text-center space-y-4">
                  <FolderPlus className="w-12 h-12 text-amber-600 mx-auto" />
                  <div className="max-w-md mx-auto space-y-2">
                    <h5 className="font-sans font-bold text-slate-800 text-sm">Inisialisasi Direktori Arsip TPQ Al Asyhar & Madin</h5>
                    <p className="text-xxs text-slate-500 leading-relaxed">
                      Sistem belum mendeteksi Folder Khusus untuk penyimpanan TPQ / Madin di Google Drive Anda. Kami menyarankan untuk membuat Folder terpusat agar tidak mencampuri dokumen pribadi Anda.
                    </p>
                  </div>
                  <button
                    onClick={handleCreateRootFolder}
                    disabled={isCreatingFolder}
                    className="px-5 py-2.5 bg-amber-600 text-white font-semibold rounded-2xl text-xxs hover:bg-amber-700 transition-all cursor-pointer inline-flex items-center gap-1.5"
                  >
                    {isCreatingFolder ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                    {isCreatingFolder ? 'Mempersiapkan...' : 'Buat Folder "TPQ AL ASYHAR DAN MADIN MIFTAHUL ULUM 1"'}
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-155 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800 font-extrabold text-xs">
                      📁
                    </div>
                    <div>
                      <p className="text-xxs font-bold text-emerald-900 font-sans uppercase tracking-wider">Direktori Aktif Google Drive</p>
                      <p className="text-xs font-semibold text-slate-750">TPQ AL ASYHAR DAN MADIN MIFTAHUL ULUM 1</p>
                    </div>
                  </div>
                  <a
                    href={`https://drive.google.com/drive/folders/${miftahFolderId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xxs text-emerald-850 hover:text-emerald-950 font-bold flex items-center gap-1 bg-white border border-emerald-250 px-3 py-1.5 rounded-xl cursor-copy shrink-0"
                  >
                    Buka Folder Utama
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}

              {/* Drag-n-Drop File Uploader */}
              {miftahFolderId && (
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all space-y-3 ${
                    dragActive 
                      ? 'border-emerald-500 bg-emerald-50/40' 
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100/60'
                  }`}
                  id="drag-file-uploader"
                >
                  <input 
                    type="file" 
                    id="drive-file-input"
                    ref={fileInputRef}
                    className="hidden" 
                    onChange={handleFileChange}
                  />
                  
                  {isUploading ? (
                    <div className="space-y-2">
                      <RefreshCw className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />
                      <p className="text-xs font-bold text-slate-800">Sedang Mengirim ke Google Drive...</p>
                      <p className="text-[10px] text-slate-400">Harap tunggu, berkas sedang diproses oleh API</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <UploadCloud className="w-10 h-10 text-emerald-600 mx-auto" />
                      <div>
                        <p className="text-xs font-bold text-slate-800">Tarik & Letakkan Berkas di Sini</p>
                        <p className="text-xxs text-slate-400 mt-1">atau klik untuk menelusuri dari perangkat Anda (Surat, Foto, PDF)</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* List of Files in Drive */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800 text-xs font-sans uppercase tracking-wider flex items-center gap-1.5">
                    Berkas Tersimpan ({driveFiles.length})
                  </h4>
                  <button 
                    onClick={() => loadDriveContent(accessToken || '')}
                    disabled={isDriveLoading}
                    className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 font-sans text-[10px] font-bold text-slate-655 rounded-xl transition-all cursor-pointer inline-flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isDriveLoading ? 'animate-spin' : ''}`} />
                    Segarkan
                  </button>
                </div>

                {isDriveLoading && driveFiles.length === 0 ? (
                  <div className="text-center py-10 space-y-2">
                    <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
                    <p className="text-xxs text-slate-400">Sedang mengambil daftar arsip berkas...</p>
                  </div>
                ) : driveFiles.length === 0 ? (
                  <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-xs text-slate-400 italic">Belum ada berkas terunggah di Direktori Pondok Pesantren.</p>
                    <p className="text-xxs text-slate-400 mt-1">Gunakan dropzone di atas untuk mengunggah arsip pertama Anda.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-3xs" id="drive-files-list">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100 text-[10px] uppercase tracking-wider">
                            <th className="p-4">Nama Berkas</th>
                            <th className="p-4 text-center">Ukuran</th>
                            <th className="p-4">Tanggal Unggah</th>
                            <th className="p-4 text-right">Tindakan</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {driveFiles.map((file) => (
                            <tr key={file.id} className="hover:bg-slate-50/50 transition-all" id={`drive-file-${file.id}`}>
                              <td className="p-4 flex items-center gap-3">
                                {getFileIcon(file.mimeType)}
                                <span className="font-semibold text-slate-750 truncate max-w-[200px] sm:max-w-xs block" title={file.name}>
                                  {file.name}
                                </span>
                              </td>
                              <td className="p-4 text-center font-mono text-slate-500 text-xxs">
                                {formatBytes(file.size)}
                              </td>
                              <td className="p-4 text-slate-500 text-xxs font-sans">
                                {new Date(file.createdTime).toLocaleDateString('id-ID', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <a 
                                    href={file.webViewLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-lg transition-all"
                                    title="Buka Berkas Google Drive"
                                  >
                                    <ExternalLink className="w-4 h-4" />
                                  </a>
                                  <button
                                    onClick={() => handleDeleteFile(file.id, file.name)}
                                    className="p-1.5 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-700 rounded-lg transition-all"
                                    title="Hapus Berkas dari Drive"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
