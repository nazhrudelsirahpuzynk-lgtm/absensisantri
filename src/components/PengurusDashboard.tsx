import React, { useState } from 'react';
import GoogleSheetsSync from './GoogleSheetsSync';
import {
  Santri,
  SetoranHafalan,
  TagihanSPP,
  KeuanganPondok,
  Perizinan,
  JadwalPelajaran,
  Ustadz,
  PenilaianJilid
} from '../types';
import {
  Shield,
  Users,
  Award,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Check,
  X,
  UserCheck,
  QrCode,
  FileText,
  BookOpen,
  Calendar,
  CheckCircle,
  HelpCircle,
  Clock,
  ListFilter,
  GraduationCap,
  Phone
} from 'lucide-react';


interface PengurusDashboardProps {
  allSantri: Santri[];
  setoranList: SetoranHafalan[];
  tagihanList: TagihanSPP[];
  keuanganList: KeuanganPondok[];
  perizinanList: Perizinan[];
  jadwalPelajaranList: JadwalPelajaran[];
  ustadzList: Ustadz[];
  penilaianJilidList: PenilaianJilid[];
  onAddSetoran: (newSetoran: Omit<SetoranHafalan, 'id'>) => void;
  onAddKeuangan: (newKeuangan: Omit<KeuanganPondok, 'id'>) => void;
  onUpdateTagihanStatus: (tagihanId: string, status: TagihanSPP['status']) => void;
  onApprovePerizinan: (perizinanId: string, approvedBy: string, approveStatus: 'Disetujui' | 'Ditolak') => void;
  onUpdateSantriKehadiran: (santriId: string, newKehadiran: number) => void;
  onAddSantri: (newSantri: Omit<Santri, 'id' | 'kehadiranPercent' | 'catatanPelanggaran'>) => void;
  onAddUstadz: (newUstadz: Omit<Ustadz, 'id'>) => void;
  onAddPenilaianJilid: (newPenilaian: Omit<PenilaianJilid, 'id'>) => void;
}

export default function PengurusDashboard({
  allSantri,
  setoranList,
  tagihanList,
  keuanganList,
  perizinanList,
  jadwalPelajaranList,
  ustadzList,
  penilaianJilidList,
  onAddSetoran,
  onAddKeuangan,
  onUpdateTagihanStatus,
  onApprovePerizinan,
  onUpdateSantriKehadiran,
  onAddSantri,
  onAddUstadz,
  onAddPenilaianJilid
}: PengurusDashboardProps) {
  // Tabs
  const [activeTab, setActiveTab] = useState<'stats' | 'absensi' | 'keuangan' | 'kelas' | 'ustadz' | 'sheets'>('stats');
  const [kelasSubTab, setKelasSubTab] = useState<'tahfidz' | 'jilid'>('tahfidz');

  // Keuangan Form States
  const [keuanganTipe, setKeuanganTipe] = useState<'Pemasukan' | 'Pengeluaran'>('Pengeluaran');
  const [keuanganKategori, setKeuanganKategori] = useState<string>('Operasional');
  const [keuanganJumlah, setKeuanganJumlah] = useState<number>(150000);
  const [keuanganKet, setKeuanganKet] = useState<string>('');
  const [keuanganSuccess, setKeuanganSuccess] = useState<string>('');

  // Penilaian Hafalan Form States
  const [gradeSantriId, setGradeSantriId] = useState<string>(allSantri[0]?.id || '');
  const [gradeJuz, setGradeJuz] = useState<number>(1);
  const [gradeSurah, setGradeSurah] = useState<string>('');
  const [gradeAyatMulai, setGradeAyatMulai] = useState<number>(80);
  const [gradeAyatSelesai, setGradeAyatSelesai] = useState<number>(85);
  const [gradeTipe, setGradeTipe] = useState<'Setoran Baru' | 'Murojaah'>('Setoran Baru');
  const [gradeStatus, setGradeStatus] = useState<SetoranHafalan['statusPenilaian']>('Sangat Lancar');
  const [gradeCatatan, setGradeCatatan] = useState<string>('');
  const [gradeSuccess, setGradeSuccess] = useState<string>('');

  // Penilaian Jilid (1-5) & Al-Qur'an (1-2) Form States
  const [jilidSantriId, setJilidSantriId] = useState<string>(allSantri[0]?.id || '');
  const [jilidTingkat, setJilidTingkat] = useState<PenilaianJilid['tingkat']>('Jilid 1');
  const [jilidHalamanLama, setJilidHalamanLama] = useState<string>('1');
  const [jilidHalamanBaru, setJilidHalamanBaru] = useState<string>('2');
  const [jilidDoaHarian, setJilidDoaHarian] = useState<string>('');
  const [jilidFasholatan, setJilidFasholatan] = useState<string>('');
  const [jilidUstadz, setJilidUstadz] = useState<string>('Ustadz M. Syakir');
  const [jilidCatatan, setJilidCatatan] = useState<string>('');
  const [jilidSuccess, setJilidSuccess] = useState<string>('');

  // Attendance Simulator States
  const [todayAbsensiMap, setTodayAbsensiMap] = useState<Record<string, 'Hadir' | 'Sakit' | 'Izin' | 'Alpha'>>(() => {
    const initial: Record<string, 'Hadir' | 'Sakit' | 'Izin' | 'Alpha'> = {};
    allSantri.forEach(s => {
      initial[s.id] = s.id === 's1' ? 'Hadir' : 'Hadir'; // Default values
    });
    return initial;
  });
  const [scanMessage, setScanMessage] = useState<string>('');

  // Tambah Santri Form States
  const [newSantriNama, setNewSantriNama] = useState<string>('');
  const [newSantriNis, setNewSantriNis] = useState<string>('');
  const [newSantriKelas, setNewSantriKelas] = useState<string>('Kelas 1 Awaliyah');
  const [newSantriNamaWali, setNewSantriNamaWali] = useState<string>('');
  const [newSantriTeleponWali, setNewSantriTeleponWali] = useState<string>('');
  const [newSantriJuz, setNewSantriJuz] = useState<number>(30);
  const [santriSuccess, setSantriSuccess] = useState<string>('');

  // Tambah Ustadz Form States
  const [newUstNama, setNewUstNama] = useState<string>('');
  const [newUstNip, setNewUstNip] = useState<string>('');
  const [newUstSertifikasi, setNewUstSertifikasi] = useState<string>('');
  const [newUstBidang, setNewUstBidang] = useState<string>('');
  const [newUstNoHp, setNewUstNoHp] = useState<string>('');
  const [newUstTanggal, setNewUstTanggal] = useState<string>(new Date().toISOString().split('T')[0]);
  const [ustadzSuccess, setUstadzSuccess] = useState<string>('');

  // Financial Filter States
  const [sppFilter, setSppFilter] = useState<'Semua' | 'Lunas' | 'Belum Bayar' | 'Menunggu Konfirmasi'>('Semua');
  const [jilidSearch, setJilidSearch] = useState<string>('');
  const [jilidFilter, setJilidFilter] = useState<string>('Semua');

  // 1. Calculations
  const totalSantri = allSantri.length;
  const meanKehadiran = Math.round(allSantri.reduce((acc, s) => acc + s.kehadiranPercent, 0) / (totalSantri || 1));

  // Cashflow
  const totalIn = keuanganList.filter(k => k.tipe === 'Pemasukan').reduce((acc, k) => acc + k.jumlah, 0);
  const totalOut = keuanganList.filter(k => k.tipe === 'Pengeluaran').reduce((acc, k) => acc + k.jumlah, 0);
  const saldoSisa = totalIn - totalOut;

  // SPP payment progress counter
  const totalTagihanSpp = tagihanList.length;
  const lunasTagihanSpp = tagihanList.filter(t => t.status === 'Lunas').length;

  // Grade form submission
  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradeSurah.trim()) return;

    onAddSetoran({
      santriId: gradeSantriId,
      tanggal: new Date().toISOString().split('T')[0],
      juz: Number(gradeJuz),
      surah: gradeSurah,
      ayatMulai: Number(gradeAyatMulai),
      ayatSelesai: Number(gradeAyatSelesai),
      tipe: gradeTipe,
      statusPenilaian: gradeStatus,
      ustadzPenguji: 'Ustadz Abdul Somad, Lc. (Sistem)',
      catatan: gradeCatatan || 'Lulus penilaian evaluasi tatap muka.'
    });

    setGradeSurah('');
    setGradeCatatan('');
    setGradeSuccess(`Berhasil memberi nilai untuk santri ${allSantri.find(s => s.id === gradeSantriId)?.nama}!`);
    setTimeout(() => setGradeSuccess(''), 4000);
  };

  const handleJilidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPenilaianJilid({
      santriId: jilidSantriId,
      tanggal: new Date().toISOString().split('T')[0],
      tingkat: jilidTingkat,
      halamanLama: jilidHalamanLama,
      halamanBaru: jilidHalamanBaru,
      hafalanDoaHarian: jilidDoaHarian || 'Selesai disimak',
      hafalanFasholatan: jilidFasholatan || 'Selesai disimak',
      ustadzPenguji: jilidUstadz,
      catatan: jilidCatatan || 'Lulus evaluasi jilid/hal.'
    });

    setJilidSuccess(`Berhasil melisensi kelulusan ${jilidTingkat} santri!`);
    setTimeout(() => setJilidSuccess(''), 4000);

    // Auto increment pages
    setJilidHalamanLama(jilidHalamanBaru);
    const parsedNewPage = parseInt(jilidHalamanBaru);
    if (!isNaN(parsedNewPage)) {
      setJilidHalamanBaru((parsedNewPage + 1).toString());
    } else {
      setJilidHalamanBaru('');
    }
    setJilidDoaHarian('');
    setJilidFasholatan('');
    setJilidCatatan('');
  };

  // Keuangan ledger entry
  const handleKeuanganSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keuanganKet.trim()) return;

    onAddKeuangan({
      tipe: keuanganTipe,
      kategori: keuanganKategori,
      jumlah: Number(keuanganJumlah),
      tanggal: new Date().toISOString().split('T')[0],
      keterangan: keuanganKet
    });

    setKeuanganKet('');
    setKeuanganSuccess('Laporan transaksi berhasil diinput ke dalam kas pondok!');
    setTimeout(() => setKeuanganSuccess(''), 4000);
  };

  // Handle adding student submission
  const handleSantriSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSantriNama.trim() || !newSantriNis.trim() || !newSantriNamaWali.trim()) return;

    onAddSantri({
      nama: newSantriNama,
      nis: newSantriNis,
      kelas: newSantriKelas,
      namaWali: newSantriNamaWali,
      teleponWali: newSantriTeleponWali || '081234567890',
      juzTerakhir: Number(newSantriJuz)
    });

    setNewSantriNama('');
    setNewSantriNis('');
    setNewSantriNamaWali('');
    setNewSantriTeleponWali('');
    setNewSantriJuz(30);
    setSantriSuccess(`Alhamdulillah! Santri baru [${newSantriNama}] berhasil didaftarkan di kelas ${newSantriKelas}.`);
    setTimeout(() => setSantriSuccess(''), 4500);
  };

  // Handle adding ustadz submission
  const handleUstadzSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUstNama.trim() || !newUstNip.trim() || !newUstBidang.trim()) return;

    onAddUstadz({
      nama: newUstNama,
      nip: newUstNip,
      pesantrenSertifikasi: newUstSertifikasi || 'Pondok Pesantren Miftahul Huda',
      bidangKeahlian: newUstBidang,
      noHp: newUstNoHp || '081234567899',
      tanggalMulaiTugas: newUstTanggal
    });

    setNewUstNama('');
    setNewUstNip('');
    setNewUstSertifikasi('');
    setNewUstBidang('');
    setNewUstNoHp('');
    setNewUstTanggal(new Date().toISOString().split('T')[0]);
    setUstadzSuccess(`Barakallah! Ustadz baru [${newUstNama}] berhasil ditugaskan untuk khidmah pendidikan.`);
    setTimeout(() => setUstadzSuccess(''), 4500);
  };

  // QR Code Presence Simulator trigger
  const handleQRScanSimulation = () => {
    // Check-in a student
    const checkableSantri = allSantri.filter(s => todayAbsensiMap[s.id] !== 'Hadir');
    const targetSantri = checkableSantri.length > 0 ? checkableSantri[0] : allSantri[Math.floor(Math.random() * allSantri.length)];

    if (!targetSantri) return;

    // Set today presence to present
    setTodayAbsensiMap(prev => ({
      ...prev,
      [targetSantri.id]: 'Hadir'
    }));

    // Reward attendance point slightly
    const currentAtt = targetSantri.kehadiranPercent;
    const newAtt = Math.min(100, currentAtt + 1);
    onUpdateSantriKehadiran(targetSantri.id, newAtt);

    setScanMessage(`[SUCCESS] Barcode santri ${targetSantri.nama} (NIS: ${targetSantri.nis}) dipindai pukul ${new Date().toLocaleTimeString('id-ID')} &bull; Kehadiran diupdate!`);
    setTimeout(() => setScanMessage(''), 5500);
  };

  const handleUpdateTodayAbsensi = (studentId: string, status: 'Hadir' | 'Sakit' | 'Izin' | 'Alpha') => {
    setTodayAbsensiMap(prev => ({ ...prev, [studentId]: status }));

    // Recalculate presence factor slightly for demo mapping
    const santriObj = allSantri.find(s => s.id === studentId);
    if (santriObj) {
      const offset = status === 'Hadir' ? 1 : -2;
      const computed = Math.max(75, Math.min(100, santriObj.kehadiranPercent + offset));
      onUpdateSantriKehadiran(studentId, computed);
    }
  };

  // Filter SPP Tagihan list based on segment
  const filteredTagihan = tagihanList.filter(t => {
    if (sppFilter === 'Semua') return true;
    return t.status === sppFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div id="pengurus-banner" className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-xl font-sans border border-amber-200">
            PA
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xxs font-semibold bg-amber-600 text-white px-2 py-0.5 rounded uppercase font-sans">Panel Admin</span>
              <span className="text-xs text-slate-400 font-mono">Hak Akses: Pengurus Utama / Kepala Madrasah</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mt-1">Ustadz Abdul Somad, Lc.</h2>
            <p className="text-xs text-slate-500 font-medium">Selamat datang, Khidmah terbaik Anda mengalirkan ilmu yang berkah.</p>
          </div>
        </div>

        <div className="flex space-x-3 text-xxs font-mono shrink-0">
          <span className="bg-slate-100 px-3 py-1.5 rounded-xl text-slate-705 border border-slate-200">
            Tanggal Kerja: {new Date().toISOString().split('T')[0]}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 p-1 bg-slate-100 rounded-xl max-w-2xl overflow-x-auto scroller-hidden">
        <button
          id="pengurus-tab-stats"
          onClick={() => setActiveTab('stats')}
          className={`shrink-0 flex-1 px-3 py-2 text-center rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'stats'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Metrik & Statistik
        </button>
        <button
          id="pengurus-tab-absensi"
          onClick={() => setActiveTab('absensi')}
          className={`shrink-0 flex-1 px-3 py-2 text-center rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'absensi'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Absensi Digital
        </button>
        <button
          id="pengurus-tab-keuangan"
          onClick={() => setActiveTab('keuangan')}
          className={`shrink-0 flex-1 px-3 py-2 text-center rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'keuangan'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Akuntansi Kas
        </button>
        <button
          id="pengurus-tab-kelas"
          onClick={() => setActiveTab('kelas')}
          className={`shrink-0 flex-1 px-3 py-2 text-center rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'kelas'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Penilaian & Kelas
        </button>
        <button
          id="pengurus-tab-ustadz"
          onClick={() => setActiveTab('ustadz')}
          className={`shrink-0 flex-1 px-3 py-2 text-center rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'ustadz'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Manajemen Ustadz
        </button>
        <button
          id="pengurus-tab-sheets"
          onClick={() => setActiveTab('sheets')}
          className={`shrink-0 flex-1 px-3 py-2 text-center rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'sheets'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Workspace Cloud (Drive/Sheets)
        </button>
      </div>

      {/* Contents */}

      {/* 1. Dashboard Utama & Statistik */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          {/* Bento stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <span className="text-xxs font-mono text-slate-400 block uppercase mb-1 font-bold">Seluruh Santri Binaan</span>
              <div className="flex justify-between items-baseline">
                <span className="text-3xl font-extrabold text-slate-800">{totalSantri} Anak</span>
                <span className="text-xs text-slate-450 font-bold bg-slate-100 px-2 py-0.5 rounded">3 Kelas</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <span className="text-xxs font-mono text-slate-400 block uppercase mb-1 font-bold">Rata-rata Presensi Pondok</span>
              <div className="flex justify-between items-baseline">
                <span className="text-3xl font-extrabold text-emerald-700">{meanKehadiran}%</span>
                <span className="text-[10px] text-emerald-650 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-100">MUMTAZ</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <span className="text-xxs font-mono text-slate-400 block uppercase mb-1 font-bold">Penerimaan SPP Bulan Ini</span>
              <div className="flex justify-between items-baseline">
                <span className="text-2xl font-extrabold text-teal-800">{lunasTagihanSpp} / {totalTagihanSpp}</span>
                <span className="text-xxs text-slate-500 font-mono">lunas divalidasi</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <span className="text-xxs font-mono text-slate-400 block uppercase mb-1 font-bold">Saldo Sisa Dana Kas</span>
              <div className="flex justify-between items-baseline">
                <span className="text-xl font-bold text-slate-850">Rp {saldoSisa.toLocaleString('id-ID')}</span>
                <span className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded font-bold">Surplus</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Custom SVG memorization chart */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  Statistik Progress Hafalan Tingkat Juz Santri
                </h3>
                <span className="text-[10px] font-mono text-slate-400">Diagram Batang Pencapaian</span>
              </div>

              {/* Handcrafted precise responsive SVG representation chart and layout */}
              <div className="pt-2">
                <svg className="w-full h-56 text-slate-350" viewBox="0 0 500 220">
                  {/* Grid lines */}
                  <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="40" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="40" y1="100" x2="480" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="40" y1="140" x2="480" y2="140" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="40" y1="180" x2="480" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />

                  {/* Y Axis markings */}
                  <text x="12" y="24" className="text-[10px] font-mono fill-slate-400 font-bold">30 Juz</text>
                  <text x="12" y="64" className="text-[10px] font-mono fill-slate-400 font-bold">20 Juz</text>
                  <text x="12" y="104" className="text-[10px] font-mono fill-slate-400 font-bold">15 Juz</text>
                  <text x="12" y="144" className="text-[10px] font-mono fill-slate-400 font-bold">10 Juz</text>
                  <text x="12" y="184" className="text-[10px] font-mono fill-slate-400 font-bold">0</text>

                  {/* Bars representing each student's current memory status */}
                  {/* Bars: x start, height base, color */}
                  {/* 1. Ahmad (30 Juz) -> y val corresponds to 20 */}
                  <rect x="95" y="20" width="48" height="160" rx="6" fill="#059669" className="opacity-90 hover:opacity-100 transition-all cursor-pointer" />
                  {/* 2. Yusuf (15 Juz) -> halfway (y val corresponds to 100) */}
                  <rect x="225" y="100" width="48" height="80" rx="6" fill="#0d9488" className="opacity-90 hover:opacity-100 transition-all cursor-pointer" />
                  {/* 3. Siti Aminah (10 Juz) -> y val corresponds to 127 */}
                  <rect x="355" y="127" width="48" height="53" rx="6" fill="#4f46e5" className="opacity-90 hover:opacity-100 transition-all cursor-pointer" />

                  {/* Labels on bars */}
                  <text x="119" y="15" textAnchor="middle" className="text-[9px] font-mono font-bold fill-emerald-800">30 Juz</text>
                  <text x="249" y="95" textAnchor="middle" className="text-[9px] font-mono font-bold fill-teal-800">15 Juz</text>
                  <text x="379" y="122" textAnchor="middle" className="text-[9px] font-mono font-bold fill-indigo-800">10 Juz</text>

                  {/* X Axis Labels */}
                  <text x="119" y="202" textAnchor="middle" className="text-[10px] font-semibold fill-slate-700">Ahmad Faiz</text>
                  <text x="249" y="202" textAnchor="middle" className="text-[10px] font-semibold fill-slate-700">M. Yusuf</text>
                  <text x="379" y="202" textAnchor="middle" className="text-[10px] font-semibold fill-slate-700">Siti Aminah</text>
                </svg>
              </div>
            </div>

            {/* List of outstanding permissions waiting review */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <h3 className="font-bold text-slate-805 text-sm mb-4">Pengajuan Izin Masuk</h3>
              <div className="space-y-3">
                {perizinanList.filter(p => p.status === 'Diajukan').map(p => {
                  const s = allSantri.find(san => san.id === p.santriId) || allSantri[0];
                  return (
                    <div key={p.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-150 relative space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-800 text-xs">{s.nama}</h4>
                          <span className="text-xxs font-mono text-slate-400">{p.tipeIzin === 'Pulang' ? 'Izin Pulang' : 'Sakit'}</span>
                        </div>
                      </div>
                      <p className="text-xxs text-slate-520 italic leading-snug">" {p.alasan} "</p>

                      <div className="flex space-x-2 pt-1">
                        <button
                          id={`approve-btn-${p.id}`}
                          onClick={() => onApprovePerizinan(p.id, 'Ustadz Abdul', 'Disetujui')}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xxs py-1 rounded transition-all"
                        >
                          Setujui
                        </button>
                        <button
                          id={`reject-btn-${p.id}`}
                          onClick={() => onApprovePerizinan(p.id, 'Ustadz Abdul', 'Ditolak')}
                          className="flex-1 border border-rose-200 hover:bg-rose-50 text-rose-800 text-xxs py-1 rounded transition-all"
                        >
                          Tolak
                        </button>
                      </div>
                    </div>
                  );
                })}
                {perizinanList.filter(p => p.status === 'Diajukan').length === 0 && (
                  <p className="text-xs text-slate-400 text-center py-6 block font-medium">Bagus! Tidak ada permohonan izin yang menggantung.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Absensi Digital */}
      {activeTab === 'absensi' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Classroom Attendance list */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-sm">Rekap Absensi Harian Santri (Hari Ini)</h3>
              <span className="text-[10px] font-mono text-slate-400 uppercase">Input Langsung</span>
            </div>

            <div className="space-y-3.5">
              {allSantri.map(s => {
                const checked = todayAbsensiMap[s.id] || 'Hadir';

                return (
                  <div key={s.id} className="p-3.5 rounded-2xl border border-slate-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/20">
                    <div>
                      <h4 className="font-bold text-slate-805 text-sm">{s.nama}</h4>
                      <p className="text-xxs text-slate-450 font-medium font-mono">NIS: {s.nis} &bull; Kelas: {s.kelas} &bull; Kehadiran Kumulatif: <strong className="text-teal-700">{s.kehadiranPercent}%</strong></p>
                    </div>

                    {/* Attendance state switcher */}
                    <div className="flex gap-1.5 self-start sm:self-center">
                      {(['Hadir', 'Sakit', 'Izin', 'Alpha'] as const).map(opt => (
                        <button
                          key={opt}
                          id={`absensi-btn-${s.id}-${opt}`}
                          onClick={() => handleUpdateTodayAbsensi(s.id, opt)}
                          className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg transition-all ${
                            checked === opt
                              ? opt === 'Hadir' ? 'bg-emerald-600 text-white shadow-xs'
                                : opt === 'Sakit' ? 'bg-indigo-600 text-white shadow-xs'
                                : opt === 'Izin' ? 'bg-amber-600 text-white shadow-xs'
                                : 'bg-rose-600 text-white shadow-xs'
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* QR Code Scan Emulator widget */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm text-center">
              <h3 className="font-bold text-slate-800 text-sm flex items-center justify-center gap-1.5 mb-2">
                <QrCode className="w-5 h-5 text-emerald-650" />
                Simulasi Scanner QR Absensi
              </h3>
              <p className="text-xxs text-slate-450 mb-4 max-w-xs mx-auto">Gunakan barcode digital santri untuk mencatat kehadiran kilat di gerbang utama.</p>

              {/* Holographic simulated QR scanner vector */}
              <div className="w-40 h-40 mx-auto bg-slate-900 rounded-3xl border-4 border-slate-800 flex items-center justify-center relative overflow-hidden shadow-inner cursor-pointer" onClick={handleQRScanSimulation}>
                <div className="absolute top-2.5 inset-x-2.5 border border-dashed border-red-500/20 h-32" />
                {/* Horizontal scanner beam line */}
                <div className="absolute inset-x-0 bg-red-500 h-0.5 shadow-md shadow-red-500/50 animate-bounce" style={{ animationDuration: '3000ms' }} />
                <QrCode className="w-16 h-16 text-slate-600/40" />
              </div>

              {scanMessage && (
                <div className="text-xxs bg-emerald-50 text-emerald-800 font-mono p-3 rounded-2xl border border-emerald-250 mt-4 leading-relaxed text-left">
                  <div className="font-bold mb-1">✔ QR CODE DETRACTED:</div>
                  <div dangerouslySetInnerHTML={{ __html: scanMessage }} />
                </div>
              )}

              <button
                id="trigger-scan-simulate-btn"
                onClick={handleQRScanSimulation}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm mt-4 inline-flex items-center justify-center gap-1.5"
              >
                <span>Simulasi Pindai Barcode Santri</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Keuangan & Akuntansi */}
      {activeTab === 'keuangan' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* SPP Payment validation desk */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-sm">Validasi Pembayaran SPP Syahriah</h3>
                {/* Filters */}
                <div className="flex gap-1">
                  {(['Semua', 'Menunggu Konfirmasi', 'Lunas', 'Belum Bayar'] as const).map(f => (
                    <button
                      key={f}
                      id={`filter-spp-${f}`}
                      onClick={() => setSppFilter(f)}
                      className={`text-[9px] font-bold px-2 py-1 rounded transition-all ${
                        sppFilter === f
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-205'
                      }`}
                    >
                      {f === 'Menunggu Konfirmasi' ? 'Pending Rev' : f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredTagihan.map(t => {
                  const s = allSantri.find(san => san.id === t.santriId) || allSantri[0];
                  return (
                    <div key={t.id} className="p-3 rounded-2 shadow-xs border border-slate-150 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-slate-50/20 transition-all bg-slate-55/35">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-slate-800 text-xs">{s.nama}</h4>
                          <span className="text-xxs bg-emerald-50 text-emerald-800 border-emerald-100 border px-1.5 py-0.5 rounded-full">{t.bulan}</span>
                        </div>
                        <span className="text-xxxs font-mono text-slate-400 block mt-0.5">{t.invoiceNumber}</span>
                        <span className="text-xxs font-bold text-slate-650 block mt-1">Biaya: Rp {t.jumlah.toLocaleString('id-ID')}</span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          t.status === 'Lunas'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                            : t.status === 'Menunggu Konfirmasi'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-rose-50 text-rose-800 border border-rose-150'
                        }`}>
                          {t.status}
                        </span>

                        {t.status === 'Menunggu Konfirmasi' && (
                          <button
                            id={`verify-spp-btn-${t.id}`}
                            onClick={() => onUpdateTagihanStatus(t.id, 'Lunas')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xxs px-2.5 py-1 rounded transition-all flex items-center gap-1 shadow-sm"
                          >
                            <Check className="w-3" />
                            <span>Sahkan Lunas</span>
                          </button>
                        )}
                        {t.status === 'Belum Bayar' && (
                          <button
                            id={`manual-pay-spp-btn-${t.id}`}
                            onClick={() => onUpdateTagihanStatus(t.id, 'Lunas')}
                            className="bg-slate-880 hover:bg-slate-900 text-white font-bold text-xxs px-2.5 py-1 rounded transition-all flex items-center gap-1 shadow-sm"
                          >
                            <DollarSign className="w-3" />
                            <span>Setor Tunai</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* General Ledger Expense input form */}
            <div>
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                <h3 className="font-bold text-slate-801 text-sm flex items-center gap-1.5 mb-1.5">
                  <DollarSign className="w-4 h-4 text-amber-600" />
                  Registrasi Pengeluaran / Pemasukan
                </h3>
                <p className="text-xxs text-slate-450 mb-4 font-normal">Input rincian debet atau kredit baru untuk laporan neraca keuangan pondok.</p>

                {keuanganSuccess && (
                  <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-xl mb-4 text-xs font-semibold">
                    {keuanganSuccess}
                  </div>
                )}

                <form onSubmit={handleKeuanganSubmit} className="space-y-3">
                  <div>
                    <label htmlFor="keuangan-tipe" className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Klasifikasi</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        id="keuangan-tipe-in"
                        type="button"
                        onClick={() => setKeuanganTipe('Pemasukan')}
                        className={`py-1.5 text-xxs font-bold rounded-lg border transition-all ${
                          keuanganTipe === 'Pemasukan'
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-820'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        Pemasukan (Kredit)
                      </button>
                      <button
                        id="keuangan-tipe-out"
                        type="button"
                        onClick={() => setKeuanganTipe('Pengeluaran')}
                        className={`py-1.5 text-xxs font-bold rounded-lg border transition-all ${
                          keuanganTipe === 'Pengeluaran'
                            ? 'bg-rose-50 border-rose-250 text-rose-820'
                            : 'bg-white border-slate-200 text-slate-600'
                        }`}
                      >
                        Pengeluaran (Debet)
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="keuangan-kategori" className="block text-xxs font-bold text-slate-555 uppercase tracking-wider mb-1">Kategori Pos</label>
                    <select
                      id="keuangan-kategori"
                      value={keuanganKategori}
                      onChange={(e) => setKeuanganKategori(e.target.value)}
                      className="w-full text-xs border border-slate-20d rounded-xl px-3 py-2 bg-white"
                    >
                      <option value="Operasional">Operasional Gedung/Fasilitas</option>
                      <option value="Konsumsi">Bahan Makanan / Konsumsi Santri</option>
                      <option value="Gaji Ustadz">Honor / Mukafah Guru Ustadz</option>
                      <option value="Donasi/Infaq">Infaq / Hibah Masuk</option>
                      <option value="Kitab & Pendidikan">Pengadaan Kitab & Meja Belajar</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="keuangan-jumlah" className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Nominal Rupiah</label>
                    <input
                      id="keuangan-jumlah"
                      type="number"
                      value={keuanganJumlah}
                      onChange={(e) => setKeuanganJumlah(Number(e.target.value))}
                      className="w-full text-xs border border-slate-201 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="keuangan-keterangan" className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Deskripsi Transaksi</label>
                    <input
                      id="keuangan-keterangan"
                      type="text"
                      placeholder="Contoh: Belanja beras dapur santri"
                      value={keuanganKet}
                      onChange={(e) => setKeuanganKet(e.target.value)}
                      className="w-full text-xs border border-slate-201 rounded-xl px-3 py-2 outline-none"
                      required
                    />
                  </div>

                  <button
                    id="submit-keuangan-btn"
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 rounded-xl text-xs transition-all shadow-xs block text-center"
                  >
                    Simpan Riwayat Transaksi
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Detailed ledger log */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 text-sm mb-4">Mutasi Jurnal Kas Keuangan Pondok</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-450 uppercase font-bold tracking-wider">
                    <th className="py-2.5">Tanggal</th>
                    <th className="py-2.5">Jenis</th>
                    <th className="py-2.5">Kategori Pos</th>
                    <th className="py-2.5">Jumlah Nominal</th>
                    <th className="py-2.5">Keterangan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium">
                  {keuanganList.slice().reverse().map(j => (
                    <tr key={j.id} className="hover:bg-slate-50/50">
                      <td className="py-3 font-mono text-slate-500">{j.tanggal}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-xxs font-bold font-sans uppercase ${
                          j.tipe === 'Pemasukan'
                            ? 'bg-emerald-50 text-emerald-805 border border-emerald-110'
                            : 'bg-rose-50 text-rose-805 border border-rose-110'
                        }`}>
                          {j.tipe}
                        </span>
                      </td>
                      <td className="py-3 font-bold text-slate-700">{j.kategori}</td>
                      <td className={`py-3 font-mono font-bold ${
                        j.tipe === 'Pemasukan' ? 'text-emerald-700' : 'text-rose-700'
                      }`}>
                        {j.tipe === 'Pemasukan' ? '+' : '-'} Rp {j.jumlah.toLocaleString('id-ID')}
                      </td>
                      <td className="py-3 text-slate-500 italic text-xxs">{j.keterangan}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. Classroom Management & Appraisal */}
      {activeTab === 'kelas' && (
        <div className="space-y-6" id="kelas-and-appraisal-section">
          {/* Sub Tab Switcher with pristine styled buttons */}
          <div className="flex bg-slate-100 p-1 rounded-2xl max-w-md border border-slate-200">
            <button
              id="subtab-tahfidz-btn"
              onClick={() => setKelasSubTab('tahfidz')}
              className={`flex-1 py-1.5 px-4 text-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                kelasSubTab === 'tahfidz'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-650 hover:text-slate-900'
              }`}
            >
              Madrasah Diniyah Awaliyah
            </button>
            <button
              id="subtab-jilid-btn"
              onClick={() => setKelasSubTab('jilid')}
              className={`flex-1 py-1.5 px-4 text-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                kelasSubTab === 'jilid'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-655 hover:text-slate-900'
              }`}
            >
              Evaluasi Jilid & Al-Qur'an
            </button>
          </div>

          {kelasSubTab === 'tahfidz' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="tahfidz-content-panel">
              {/* Clasrooms split view */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
                <h3 className="font-bold text-slate-800 text-sm pb-2 border-b border-slate-100 flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-600" />
                  Pembagian Kelas Madrasah Diniyah Awaliyah & Pengampu
                </h3>

                {/* Split classrooms map */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['Kelas 1 Awaliyah', 'Kelas 2 Awaliyah', 'Kelas 3 Awaliyah', 'Kelas 4 Awaliyah'].map(kls => {
                    const classStudents = allSantri.filter(s => s.kelas === kls);
                    const waliKelasMap: Record<string, string> = {
                      'Kelas 1 Awaliyah': 'Ustadz M. Syakir',
                      'Kelas 2 Awaliyah': 'Ustadz Hasan Basri',
                      'Kelas 3 Awaliyah': 'Ustadz Ahmad Fauzi',
                      'Kelas 4 Awaliyah': 'Ustadz Abdul Somad, Lc.'
                    };
                    const waliKelas = waliKelasMap[kls] || 'Ustadz Pengampu';
                    return (
                      <div key={kls} className="p-4 rounded-3xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between hover:border-amber-300 transition-all">
                        <div>
                          <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider mb-2">{kls}</h4>
                          <span className="text-xxs font-mono text-slate-500 block mb-3">Kepala/Wali Kelas: {waliKelas}</span>
                          
                          <div className="space-y-1.5">
                            <span className="block text-xxxs text-slate-400 font-bold uppercase tracking-wider font-mono">Daftar Santri:</span>
                            {classStudents.map(cs => (
                              <div key={cs.id} className="text-xxs font-semibold text-slate-700 p-1 bg-white border border-slate-100 rounded">
                                &bull; {cs.nama}
                              </div>
                            ))}
                            {classStudents.length === 0 && (
                              <div className="text-xxs text-slate-400 italic">Belum ada santri terdaftar di kelas ini.</div>
                            )}
                          </div>
                        </div>

                        <div className="text-xxs font-mono text-slate-450 mt-4 pt-2 border-t border-slate-205/65">
                          Total: {classStudents.length} Santri
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Jadwal ustadz */}
                <div className="pt-2">
                  <h4 className="font-bold text-slate-755 text-xs mb-3 font-mono">JADWAL USTADZ PENGAJAR MADRASAH</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-2">
                    {jadwalPelajaranList.slice(0, 4).map(jp => (
                      <div key={jp.id} className="p-3 rounded-2xl border border-slate-150 bg-white shadow-xxs">
                        <div className="flex justify-between text-xxs font-semibold text-slate-400 mb-1">
                          <span>{jp.hari} &bull; {jp.jam}</span>
                          <span className="text-amber-700 bg-amber-50 px-1.5 rounded">{jp.kelas}</span>
                        </div>
                        <strong className="text-slate-800 text-xs block leading-tight">{jp.mataPelajaran}</strong>
                        <span className="block text-xxs text-slate-500 font-medium mt-0.5">Ustadz: {jp.ustadz}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Evaluation Forms */}
              <div>
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                  <h3 className="font-bold text-slate-803 text-sm flex items-center gap-1.5 mb-1">
                    <BookOpen className="w-5 h-5 text-amber-600" />
                    Penilaian Pelajaran Madrasah Diniyah Awaliyah
                  </h3>
                  <p className="text-xxs text-slate-450 mb-4 font-normal">Form resmi ustadz pengampu untuk mengesahkan nilai & predikat pelajaran madrasah awaliyah santri.</p>

                  {gradeSuccess && (
                    <div className="bg-emerald-50 text-emerald-800 border border-emerald-250 p-3 rounded-xl mb-4 text-xs font-semibold">
                      {gradeSuccess}
                    </div>
                  )}

                  <form onSubmit={handleGradeSubmit} className="space-y-3">
                    <div>
                      <label htmlFor="grade-santri" className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Pilih Nama Santri</label>
                      <select
                        id="grade-santri"
                        value={gradeSantriId}
                        onChange={(e) => setGradeSantriId(e.target.value)}
                        className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white"
                      >
                        {allSantri.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.nama} ({s.kelas})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="grade-juz" className="block text-xxs font-bold text-slate-555 uppercase tracking-wider mb-1">Kelas Madrasah</label>
                        <select
                          id="grade-juz"
                          value={gradeJuz}
                          onChange={(e) => setGradeJuz(Number(e.target.value))}
                          className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white"
                        >
                          <option value={1}>Kelas 1 Awaliyah</option>
                          <option value={2}>Kelas 2 Awaliyah</option>
                          <option value={3}>Kelas 3 Awaliyah</option>
                          <option value={4}>Kelas 4 Awaliyah</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="grade-surah" className="block text-xxs font-bold text-slate-555 uppercase tracking-wider mb-1">Mata Pelajaran</label>
                        <input
                          id="grade-surah"
                          type="text"
                          placeholder="Contoh: Fiqih, Nahwu, Tauhid"
                          value={gradeSurah}
                          onChange={(e) => setGradeSurah(e.target.value)}
                          className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-amber-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="grade-ayat-mulai" className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Nilai Tugas (Harian)</label>
                        <input
                          id="grade-ayat-mulai"
                          type="number"
                          min={0}
                          max={100}
                          value={gradeAyatMulai}
                          onChange={(e) => setGradeAyatMulai(Number(e.target.value))}
                          className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-amber-500"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="grade-ayat-selesai" className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Nilai Ujian Utama</label>
                        <input
                          id="grade-ayat-selesai"
                          type="number"
                          min={0}
                          max={100}
                          value={gradeAyatSelesai}
                          onChange={(e) => setGradeAyatSelesai(Number(e.target.value))}
                          className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-amber-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="grade-tipe" className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Sifat Ujian</label>
                        <select
                          id="grade-tipe"
                          value={gradeTipe}
                          onChange={(e) => setGradeTipe(e.target.value as any)}
                          className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white"
                        >
                          <option value="Penilaian Harian">Penilaian Harian</option>
                          <option value="Ujian Tengah Semester">Ujian Tengah Semester</option>
                          <option value="Ujian Akhir Semester">Ujian Akhir Semester</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="grade-status" className="block text-xxs font-bold text-slate-555 uppercase tracking-wider mb-1">Predikat Kelulusan</label>
                        <select
                          id="grade-status"
                          value={gradeStatus}
                          onChange={(e) => setGradeStatus(e.target.value as any)}
                          className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white"
                        >
                          <option value="Sangat Lancar">Mumtaz (Istimewa)</option>
                          <option value="Lancar">Jayyid Jiddan (Sangat Baik)</option>
                          <option value="Cukup">Jayyid (Baik)</option>
                          <option value="Perlu Mengulang">Maqbul (Cukup)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="grade-catatan" className="block text-xxs font-bold text-slate-555 uppercase tracking-wider mb-1">Catatan Guru Madrasah</label>
                      <input
                        id="grade-catatan"
                        type="text"
                        placeholder="Makhraj sudah pas, perbaiki Ghunnah..."
                        value={gradeCatatan}
                        onChange={(e) => setGradeCatatan(e.target.value)}
                        className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 outline-none"
                        required
                      />
                    </div>

                    <button
                      id="submit-grade-btn"
                      type="submit"
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-xs block text-center"
                    >
                      Sahkan Nilai Setoran Santri
                    </button>
                  </form>
                </div>

                {/* Form Tambah Santri Baru */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm mt-6">
                  <h3 className="font-bold text-slate-803 text-sm flex items-center gap-1.5 mb-1">
                    <Plus className="w-5 h-5 text-emerald-600 bg-emerald-50 rounded-lg p-0.5" />
                    Registrasi & Tambah Santri Baru
                  </h3>
                  <p className="text-xxs text-slate-450 mb-4 font-normal">Daftarkan santri baru ke dalam database pondok pesantren Miftahul Huda.</p>

                  {santriSuccess && (
                    <div className="bg-emerald-50 text-emerald-800 border border-emerald-250 p-3 rounded-xl mb-4 text-xs font-semibold">
                      {santriSuccess}
                    </div>
                  )}

                  <form onSubmit={handleSantriSubmit} className="space-y-3">
                    <div>
                      <label htmlFor="reg-nama" className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Nama Lengkap Santri</label>
                      <input
                        id="reg-nama"
                        type="text"
                        required
                        placeholder="Contoh: Muhammad Ilham"
                        value={newSantriNama}
                        onChange={(e) => setNewSantriNama(e.target.value)}
                        className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="reg-nis" className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">NIS (Nomor Induk)</label>
                        <input
                          id="reg-nis"
                          type="text"
                          required
                          placeholder="Contoh: 1212004"
                          value={newSantriNis}
                          onChange={(e) => setNewSantriNis(e.target.value)}
                          className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="reg-kelas" className="block text-xxs font-bold text-slate-555 uppercase tracking-wider mb-1">Pilih Kelas</label>
                        <select
                          id="reg-kelas"
                          value={newSantriKelas}
                          onChange={(e) => setNewSantriKelas(e.target.value)}
                          className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white"
                        >
                          <option value="Kelas 1 Awaliyah">Kelas 1 Awaliyah</option>
                          <option value="Kelas 2 Awaliyah">Kelas 2 Awaliyah</option>
                          <option value="Kelas 3 Awaliyah">Kelas 3 Awaliyah</option>
                          <option value="Kelas 4 Awaliyah">Kelas 4 Awaliyah</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label htmlFor="reg-wali" className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Nama Lengkap Wali</label>
                        <input
                          id="reg-wali"
                          type="text"
                          required
                          placeholder="Nama ayah / ibu"
                          value={newSantriNamaWali}
                          onChange={(e) => setNewSantriNamaWali(e.target.value)}
                          className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="reg-telp" className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">No. WhatsApp Wali</label>
                        <input
                          id="reg-telp"
                          type="tel"
                          required
                          placeholder="Contoh: 0812XXXXXXXX"
                          value={newSantriTeleponWali}
                          onChange={(e) => setNewSantriTeleponWali(e.target.value)}
                          className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="reg-juz" className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Juz Terakhir yang Dikuasai</label>
                      <input
                        id="reg-juz"
                        type="number"
                        min={0}
                        max={30}
                        required
                        value={newSantriJuz}
                        onChange={(e) => setNewSantriJuz(Number(e.target.value))}
                        className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                      />
                    </div>

                    <button
                      id="submit-register-santri-btn"
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-xs block text-center"
                    >
                      Sahkan Pendaftaran Santri
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="jilid-content-panel">
              {/* Left Column: history lists & curriculums */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* 1. Riwayat Penilaian Jilid List */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                        <Award className="w-5 h-5 text-amber-600" />
                        Riwayat Penilaian Jilid & Al-Qur'an
                      </h4>
                      <p className="text-xxs text-slate-400">Lembar kendali pindah halaman jilid, hafalan doa harian, dan fasholatan.</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Nama santri..."
                        value={jilidSearch}
                        onChange={(e) => setJilidSearch(e.target.value)}
                        className="text-xxs border border-slate-200 rounded-xl px-2.5 py-1.5 outline-none font-medium focus:ring-1 focus:ring-amber-500 bg-slate-50"
                      />
                      <select
                        value={jilidFilter}
                        onChange={(e) => setJilidFilter(e.target.value)}
                        className="text-xxs border border-slate-200 rounded-xl px-2 py-1.5 outline-none font-medium bg-slate-50"
                      >
                        <option value="Semua">Semua Tingkat</option>
                        <option value="Jilid 1">Jilid 1</option>
                        <option value="Jilid 2">Jilid 2</option>
                        <option value="Jilid 3">Jilid 3</option>
                        <option value="Jilid 4">Jilid 4</option>
                        <option value="Jilid 5">Jilid 5</option>
                        <option value="Al-Qur'an 1">Al-Qur'an 1</option>
                        <option value="Al-Qur'an 2">Al-Qur'an 2</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                          <th className="py-2.5">Santri</th>
                          <th className="py-2.5">Tingkatan</th>
                          <th className="py-2.5 text-center">Halaman Lama &rarr; Baru</th>
                          <th className="py-2.5">Hafalan Doa Harian</th>
                          <th className="py-2.5">Hafalan Fasholatan</th>
                          <th className="py-2.5">Ustadz Penguji</th>
                          <th className="py-2.5">Catatan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {penilaianJilidList
                          .filter(p => {
                            const student = allSantri.find(s => s.id === p.santriId);
                            const nameMatches = student?.nama.toLowerCase().includes(jilidSearch.toLowerCase());
                            const levelMatches = jilidFilter === 'Semua' || p.tingkat === jilidFilter;
                            return nameMatches && levelMatches;
                          })
                          .map((p) => {
                            const student = allSantri.find(s => s.id === p.santriId);
                            return (
                              <tr key={p.id} className="hover:bg-slate-50/55 transition-all font-sans text-xxs">
                                <td className="py-2.5 font-bold text-slate-800">{student?.nama || 'Santri'}</td>
                                <td className="py-2.5">
                                  <span className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 font-bold border border-amber-100">
                                    {p.tingkat}
                                  </span>
                                </td>
                                <td className="py-2.5 text-center font-mono font-bold text-slate-600">
                                  Halaman {p.halamanLama} &rarr; Halaman {p.halamanBaru}
                                </td>
                                <td className="py-2.5 font-medium text-slate-600">{p.hafalanDoaHarian}</td>
                                <td className="py-2.5 font-medium text-slate-600">{p.hafalanFasholatan}</td>
                                <td className="py-2.5 text-slate-500">{p.ustadzPenguji}</td>
                                <td className="py-2.5 text-slate-400 italic max-w-[140px] truncate" title={p.catatan}>{p.catatan}</td>
                              </tr>
                            );
                          })}
                        {penilaianJilidList.filter(p => {
                          const student = allSantri.find(s => s.id === p.santriId);
                          const nameMatches = student?.nama.toLowerCase().includes(jilidSearch.toLowerCase());
                          const levelMatches = jilidFilter === 'Semua' || p.tingkat === jilidFilter;
                          return nameMatches && levelMatches;
                        }).length === 0 && (
                          <tr>
                            <td colSpan={7} className="text-center py-8 text-slate-400 italic">
                              Belum ada penilaian berkas jilid yang terekam.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 2. Panduan Kurikulum Card */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5 pb-2 border-b border-slate-100">
                    📖 Standar Kurikulum Buku Qiraah & Jilid Miftahul Ulum
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xxs leading-relaxed">
                    <div className="space-y-2">
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-150">
                        <strong className="text-amber-805 block">Jilid 1 - Pengenalan Huruf Tunggal</strong>
                        <p className="text-slate-500 mt-0.5">Penekanan makhrojul huruf hijaiyah harakat fathah secara madzkur/pendek (tanpa mad).</p>
                        <span className="text-emerald-750 block font-bold mt-1">Hafalan Doa: Doa Sebelum Makan & Minum</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-150">
                        <strong className="text-amber-805 block">Jilid 2 - Huruf Sambung & Harakat Kasrah/Dhommah</strong>
                        <p className="text-slate-500 mt-0.5">Pelajaran huruf sambung dasar dengan variasi baris bawah dan depan lancar cepat.</p>
                        <span className="text-emerald-750 block font-bold mt-1">Hafalan Doa: Doa Sesudah Makan & Minum, Doa Masuk Kamar Mandi</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-150">
                        <strong className="text-amber-805 block">Jilid 3 - Mad, Tanwin & Huruf Panjang</strong>
                        <p className="text-slate-500 mt-0.5">Pengenalan ketukan alif-wawu-ya (mad thobi'i) serta baris dua/tanwin (fathatain, kasratain, dhommatain).</p>
                        <span className="text-emerald-750 block font-bold mt-1">Hafalan Doa: Doa Keluar Kamar Mandi, Doa Memakai Pakaian</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-150">
                        <strong className="text-amber-805 block">Jilid 4 - Sukun/Mati & Qalqalah</strong>
                        <p className="text-slate-500 mt-0.5">Latihan ketat mematikan huruf, makhraj mampat, hukum qalqalah kubro-sughro.</p>
                        <span className="text-emerald-750 block font-bold mt-1">Hafalan Doa: Doa Keluar Rumah, Doa Masuk Masjid</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-150">
                        <strong className="text-amber-805 block">Jilid 5 - Tasydid, Nun Sukun & Idgham</strong>
                        <p className="text-slate-500 mt-0.5">Penguasaan baris ganda (tasydid) lambang dobel serta hukum nun sukun/tanwin (Idgham/Ikhfa).</p>
                        <span className="text-emerald-750 block font-bold mt-1">Hafalan Doa: Doa Keluar Masjid, Doa Baik Kedua Orang Tua</span>
                      </div>
                      <div className="p-2.5 bg-amber-50/50 rounded-xl border border-amber-200">
                        <strong className="text-amber-900 block">Kelas Al-Qur'an 1 - Tartil & Waqaf Wal Ibtida'</strong>
                        <p className="text-amber-800 mt-0.5">Membaca langsung Al-Qur'an 30 Juz secara terbimbing dari Juz 1, penitikberatan nafas & waqaf.</p>
                        <span className="text-emerald-800 block font-bold mt-1">Hafalan Doa: Doa Ayat Kursi & Thaharah (Wudhu)</span>
                      </div>
                      <div className="p-2.5 bg-amber-50/50 rounded-xl border border-amber-200">
                        <strong className="text-amber-900 block">Kelas Al-Qur'an 2 - Tajwid Teoretis & Fasholatan Ghorib</strong>
                        <p className="text-amber-800 mt-0.5">Pendalaman makhraj tingkat ahli, pengenalan bacaan gharib (Saktah, Imalah, Isymam), tahsin Al-Qur'an lancar.</p>
                        <span className="text-emerald-800 block font-bold mt-1">Fasholatan Shalat: Qunut Shubuh, Bacaan Shalat Lengkap & Jamak-Qashar</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: borang penilaian/form */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm sticky top-6">
                  <h4 className="font-bold text-slate-802 text-sm flex items-center gap-1.5 mb-1">
                    <BookOpen className="w-5 h-5 text-amber-600 bg-amber-55 rounded-lg p-0.5" />
                    Lembar Penilaian Jilid & Al-Qur'an
                  </h4>
                  <p className="text-xxs text-slate-450 mb-4">Input progress kenaikan halaman jilid, fasholatan & doa harian santri.</p>

                  {jilidSuccess && (
                    <div className="bg-emerald-50 text-emerald-803 border border-emerald-250 p-3 rounded-xl mb-4 text-xs font-semibold animate-bounce">
                      {jilidSuccess}
                    </div>
                  )}

                  <form onSubmit={handleJilidSubmit} className="space-y-4">
                    {/* Pilih Santri */}
                    <div>
                      <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Nama Santri</label>
                      <select
                        value={jilidSantriId}
                        onChange={(e) => setJilidSantriId(e.target.value)}
                        className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white"
                        required
                      >
                        {allSantri.map(s => (
                          <option key={s.id} value={s.id}>
                            {s.nama} ({s.kelas})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Pilih Jilid / Kelas Al-Qur'an */}
                    <div>
                      <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Tingkatan / Jilid / Kelas</label>
                      <select
                        value={jilidTingkat}
                        onChange={(e) => setJilidTingkat(e.target.value as any)}
                        className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white"
                        required
                      >
                        <option value="Jilid 1">Jilid 1</option>
                        <option value="Jilid 2">Jilid 2</option>
                        <option value="Jilid 3">Jilid 3</option>
                        <option value="Jilid 4">Jilid 4</option>
                        <option value="Jilid 5">Jilid 5</option>
                        <option value="Al-Qur'an 1">Al-Qur'an 1</option>
                        <option value="Al-Qur'an 2">Al-Qur'an 2</option>
                      </select>
                    </div>

                    {/* Halaman Lama -> Baru */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Halaman Lama</label>
                        <input
                          type="text"
                          placeholder="e.g. 15"
                          value={jilidHalamanLama}
                          onChange={(e) => setJilidHalamanLama(e.target.value)}
                          className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white outline-none focus:ring-1 focus:ring-amber-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Pindah Hal.</label>
                        <input
                          type="text"
                          placeholder="e.g. 16"
                          value={jilidHalamanBaru}
                          onChange={(e) => setJilidHalamanBaru(e.target.value)}
                          className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white outline-none focus:ring-1 focus:ring-amber-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Doa Harian */}
                    <div>
                      <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Hafalan Doa Harian</label>
                      <input
                        type="text"
                        placeholder="Contoh: Doa Naik Kendaraan (Lancar)"
                        value={jilidDoaHarian}
                        onChange={(e) => setJilidDoaHarian(e.target.value)}
                        className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    {/* Fasholatan */}
                    <div>
                      <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Hafalan Fasholatan</label>
                      <input
                        type="text"
                        placeholder="Contoh: Doa Qunut Shubuh (Mumtaz)"
                        value={jilidFasholatan}
                        onChange={(e) => setJilidFasholatan(e.target.value)}
                        className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    {/* Guru Penguji */}
                    <div>
                      <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Guru Penguji (Ustadz)</label>
                      <select
                        value={jilidUstadz}
                        onChange={(e) => setJilidUstadz(e.target.value)}
                        className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white"
                        required
                      >
                        {ustadzList.map(u => (
                          <option key={u.id} value={u.nama}>{u.nama}</option>
                        ))}
                      </select>
                    </div>

                    {/* Catatan / Koreksi */}
                    <div>
                      <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Koreksi & Bimbingan</label>
                      <textarea
                        placeholder="Makhraj pada huruf tebal diperhatikan, tajwid diperbaiki..."
                        value={jilidCatatan}
                        onChange={(e) => setJilidCatatan(e.target.value)}
                        className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white outline-none focus:ring-1 focus:ring-amber-500 h-20"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs transition-with-shadow shadow-sm"
                    >
                      Sahkan Nilai & Kenaikan Jilid
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Manajemen Ustadz Tab */}
      {activeTab === 'ustadz' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="panel-ustadz-section">
          {/* List of Ustadz (Col span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <Shield className="w-5 h-5 text-amber-600" />
                    Daftar Khidmah Dewan Asatidzah
                  </h3>
                  <p className="text-xxs text-slate-400 mt-0.5">Ustadz & pengajar resmi yang aktif mendidik santri di lingkungan pondok.</p>
                </div>
                <span className="bg-amber-50 text-amber-800 border border-amber-200 text-xxs font-bold px-2.5 py-1 rounded-xl">
                  {ustadzList.length} Pengajar Aktif
                </span>
              </div>

              {/* Ustadz Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ustadzList.map((ust) => (
                  <div
                    key={ust.id}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-150 hover:border-amber-200/60 transition-all shadow-3xs hover:shadow-2xs space-y-3"
                    id={`ustadz-card-${ust.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center text-xs font-sans">
                        {ust.nama.split(' ').filter(n => !['Ustadz','Ustadzah','KH.','KH','H.','H'].includes(n)).slice(0, 2).map(n => n[0]).join('') || 'US'}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-800">{ust.nama}</h4>
                        <p className="text-[10px] font-mono text-slate-400">NIP: {ust.nip}</p>
                      </div>
                    </div>

                    <div className="space-y-1 text-xxs text-slate-600 pt-1.5 border-t border-slate-200/60">
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">Sertifikasi: <strong className="font-semibold text-slate-700">{ust.pesantrenSertifikasi}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate">Keahlian: <strong className="font-semibold text-slate-700">{ust.bidangKeahlian}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>Telepon: <strong className="font-semibold text-slate-750 font-mono">{ust.noHp}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>Khidmah Sejak: <strong className="font-semibold text-slate-700">{ust.tanggalMulaiTugas}</strong></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Registrasi Ustadz */}
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 mb-1">
                <Plus className="w-5 h-5 text-amber-600 bg-amber-50 rounded-lg p-0.5" />
                Registrasi Ustadz Baru
              </h3>
              <p className="text-xxs text-slate-450 mb-4">Tambahkan ustadz / pendidik baru untuk mengampu pengajaran baru.</p>

              {ustadzSuccess && (
                <div id="ustadz-success-msg" className="bg-emerald-50 text-emerald-800 border border-emerald-250 p-3 rounded-xl mb-4 text-xs font-semibold animate-fade-in">
                  {ustadzSuccess}
                </div>
              )}

              <form onSubmit={handleUstadzSubmit} className="space-y-3" id="add-ustadz-form">
                <div>
                  <label htmlFor="ust-nama" className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Nama Lengkap & Gelar</label>
                  <input
                    id="ust-nama"
                    type="text"
                    required
                    placeholder="Contoh: Ustadzah Nur Layla, S.Ag."
                    value={newUstNama}
                    onChange={(e) => setNewUstNama(e.target.value)}
                    className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="ust-nip" className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">NIP (Nomor Induk Pegawai)</label>
                  <input
                    id="ust-nip"
                    type="text"
                    required
                    placeholder="Contoh: 1996xxxx-xxx"
                    value={newUstNip}
                    onChange={(e) => setNewUstNip(e.target.value)}
                    className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="ust-sertifikasi" className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Alumni / Sertifikasi Pesantren</label>
                  <input
                    id="ust-sertifikasi"
                    type="text"
                    required
                    placeholder="Contoh: Pondok Pesantren Langitan"
                    value={newUstSertifikasi}
                    onChange={(e) => setNewUstSertifikasi(e.target.value)}
                    className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="ust-bidang" className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Spesialisasi Bidang Keahlian</label>
                  <input
                    id="ust-bidang"
                    type="text"
                    required
                    placeholder="Contoh: Fiqh Nisa, Hadits Bukhari"
                    value={newUstBidang}
                    onChange={(e) => setNewUstBidang(e.target.value)}
                    className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="ust-no-hp" className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">No. WhatsApp / HP</label>
                    <input
                      id="ust-no-hp"
                      type="tel"
                      required
                      placeholder="Contoh: 0852xxxxxx"
                      value={newUstNoHp}
                      onChange={(e) => setNewUstNoHp(e.target.value)}
                      className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                    />
                  </div>
                  <div>
                    <label htmlFor="ust-tgl" className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Mulai Ditugaskan</label>
                    <input
                      id="ust-tgl"
                      type="date"
                      required
                      value={newUstTanggal}
                      onChange={(e) => setNewUstTanggal(e.target.value)}
                      className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                    />
                  </div>
                </div>

                <button
                  id="submit-register-ustadz-btn"
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-xs block text-center mt-4"
                >
                  Sahkan Pendaftaran Ustadz
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 6. Google Sheets Sync Panel */}
      {activeTab === 'sheets' && (
        <div className="animate-fade-in" id="panel-sheets-section">
          <GoogleSheetsSync
            allSantri={allSantri}
            ustadzList={ustadzList}
            keuanganList={keuanganList}
            setoranList={setoranList}
            perizinanList={perizinanList}
            tagihanList={tagihanList}
          />
        </div>
      )}
    </div>
  );
}
