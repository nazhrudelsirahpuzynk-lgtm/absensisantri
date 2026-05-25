import React, { useState } from 'react';
import {
  Santri,
  SetoranHafalan,
  NilaiUjian,
  TagihanSPP,
  Perizinan,
  PenilaianJilid
} from '../types';
import {
  Briefcase,
  Calendar,
  AlertTriangle,
  QrCode,
  FileCheck,
  Plane,
  X,
  CreditCard,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  Award,
  CheckCircle,
  FileText,
  UserCheck,
  Send
} from 'lucide-react';

interface WaliDashboardProps {
  santri: Santri;
  setoranList: SetoranHafalan[];
  nilaiUjianList: NilaiUjian[];
  tagihanList: TagihanSPP[];
  perizinanList: Perizinan[];
  penilaianJilidList?: PenilaianJilid[];
  onAddPerizinan: (newIzin: Omit<Perizinan, 'id'>) => void;
  onPaySPP: (tagihanId: string, metode: string) => void;
  allSantri: Santri[];
}

export default function WaliDashboard({
  santri,
  setoranList,
  nilaiUjianList,
  tagihanList,
  perizinanList,
  penilaianJilidList = [],
  onAddPerizinan,
  onPaySPP,
  allSantri
}: WaliDashboardProps) {
  // Tabs
  const [activeTab, setActiveTab] = useState<'monitor' | 'spp' | 'perizinan' | 'chat'>('monitor');

  // Leave Form Input States
  const [formIzinType, setFormIzinType] = useState<'Pulang' | 'Sakit'>('Pulang');
  const [formIzinMulai, setFormIzinMulai] = useState<string>('');
  const [formIzinSelesai, setFormIzinSelesai] = useState<string>('');
  const [formIzinAlasan, setFormIzinAlasan] = useState<string>('');
  const [izinSuccess, setIzinSuccess] = useState<string>('');

  // Payment Modal States
  const [activePaymentTagihan, setActivePaymentTagihan] = useState<TagihanSPP | null>(null);
  const [paymentStep, setPaymentStep] = useState<'select' | 'qris' | 'success'>('select');
  const [selectedMetode, setSelectedMetode] = useState<string>('QRIS Gopay');

  // Simulated Chat Box States
  const [chats, setChats] = useState<Array<{ sender: 'Wali' | 'Pengurus'; text: string; time: string }>>([
    { sender: 'Pengurus', text: 'Assalamualaikum Bapak/Ibu Wali Santri. Ada yang bisa kami bantu mengenai perkembangan makhraj ananda?', time: '08:15' },
    { sender: 'Wali', text: 'Waalaikumussalam. Apakah jadwal pembagian rapot santri untuk ujian PTS bulan ini sudah keluar ustadz?', time: '08:30' },
    { sender: 'Pengurus', text: 'Sudah bapak. Rapot PTS sudah kami unggah secara digital di menu Akademik. Silakan ditinjau nilainya.', time: '08:35' },
  ]);
  const [chatInput, setChatInput] = useState<string>('');

  // Filter child-specific items
  const childSetoran = setoranList.filter(s => s.santriId === santri.id);
  const childNilai = nilaiUjianList.filter(n => n.santriId === santri.id);
  const childTagihan = tagihanList.filter(t => t.santriId === santri.id);
  const childPerizinan = perizinanList.filter(p => p.santriId === santri.id);

  // Form submit leave permit block
  const handleIzinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formIzinMulai || !formIzinSelesai || !formIzinAlasan.trim()) return;

    onAddPerizinan({
      santriId: santri.id,
      tipeIzin: formIzinType,
      tanggalMulai: formIzinMulai,
      tanggalSelesai: formIzinSelesai,
      alasan: formIzinAlasan,
      status: 'Diajukan',
      tanggalPengajuan: new Date().toISOString().split('T')[0]
    });

    setFormIzinAlasan('');
    setFormIzinMulai('');
    setFormIzinSelesai('');
    setIzinSuccess('Alhamdulillah, permohonan surat izin berhasil diajukan kepada Pengurus!');
    setTimeout(() => setIzinSuccess(''), 4000);
  };

  // Process simulation of payment
  const handleFinalizePayment = () => {
    if (!activePaymentTagihan) return;
    onPaySPP(activePaymentTagihan.id, selectedMetode);
    setPaymentStep('success');
  };

  // Sending simulated chat
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newChat = {
      sender: 'Wali' as const,
      text: chatInput,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
    setChats(prev => [...prev, newChat]);
    setChatInput('');

    // Trigger auto-reply from Ustadz in 1.5 seconds!
    setTimeout(() => {
      setChats(prev => [
        ...prev,
        {
          sender: 'Pengurus',
          text: 'Rahmatullah wa barakatuh. Pesan telah kami terima, ustadz pengampu akan segera menghubungi kembali. Syukran.',
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Profile Parent-Child info */}
      <div id="wali-banner" className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-xl font-sans border border-teal-200">
            {santri.namaWali.split(' ').map(w => w[0]).slice(0, 2).join('')}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xxs font-semibold bg-teal-600 text-teal-50 px-2 py-0.5 rounded uppercase">Wali Santri</span>
              <span className="text-xs text-slate-400 font-mono">ID Pendamping: W-{santri.nis}</span>
            </div>
            <h2 className="text-xl font-bold text-slate-800 mt-1">{santri.namaWali}</h2>
            <p className="text-xs text-slate-500 font-medium">Orang tua / Wali dari santri: <strong className="text-emerald-700">{santri.nama}</strong> ({santri.kelas})</p>
          </div>
        </div>

        {/* Contact direct link */}
        <div className="flex items-center space-x-3 bg-teal-50/50 px-4 py-3 rounded-2xl border border-teal-100">
          <div className="text-right">
            <span className="block text-xxxs font-mono text-teal-600 uppercase tracking-wider font-semibold">HP Terdaftar</span>
            <span className="text-xs font-bold text-slate-700 font-mono">{santri.teleponWali}</span>
          </div>
        </div>
      </div>

      {/* 2. Navigation */}
      <div className="flex space-x-1 p-1 bg-slate-100 rounded-xl max-w-md">
        <button
          id="wali-tab-monitor"
          onClick={() => { setActiveTab('monitor'); }}
          className={`flex-1 py-2 text-center rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'monitor'
              ? 'bg-white text-teal-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Monitor Santri
        </button>
        <button
          id="wali-tab-spp"
          onClick={() => { setActiveTab('spp'); }}
          className={`flex-1 py-2 text-center rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'spp'
              ? 'bg-white text-teal-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Keuangan & SPP
        </button>
        <button
          id="wali-tab-izin"
          onClick={() => { setActiveTab('perizinan'); }}
          className={`flex-1 py-2 text-center rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'perizinan'
              ? 'bg-white text-teal-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Form Perizinan
        </button>
        <button
          id="wali-tab-chat"
          onClick={() => { setActiveTab('chat'); }}
          className={`flex-1 py-2 text-center rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
            activeTab === 'chat'
              ? 'bg-white text-teal-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Hubungi Pengurus
          <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-ping" />
        </button>
      </div>

      {/* 3. Render Area */}

      {/* Monitor Anak View */}
      {activeTab === 'monitor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Monitor columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Kehadiran & Catatan Pelanggaran */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-slate-400 font-mono text-xxs uppercase tracking-wider mb-2">Presensi Kehadiran Kelas</h3>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-extrabold text-teal-800 font-sans tracking-tight">{santri.kehadiranPercent}%</span>
                    <span className="text-xs text-slate-500 font-medium font-sans">kehadiran madrasah</span>
                  </div>
                  <p className="text-xxs text-slate-450 mt-2">
                    Persentase kehadiran santri dihitung otomatis berdasarkan absensi harian kelas digital ustadz pengampu.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-50">
                  <div className="flex justify-between text-xxs font-mono font-medium text-slate-500">
                    <span>Sakit: 0 hari</span>
                    <span>Izin: 2 hari</span>
                    <span>Alpha: 0 hari</span>
                  </div>
                </div>
              </div>

              {/* Behavior alerts / Pelanggaran */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-slate-400 font-mono text-xxs uppercase tracking-wider mb-2">Laporan Disiplin & Pelanggaran</h3>
                  {santri.catatanPelanggaran.length === 0 ? (
                    <div className="flex items-center space-x-2.5 text-emerald-805 mt-2 bg-emerald-50/50 p-3 rounded-2xl border border-emerald-110">
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="text-xs font-medium text-emerald-850">Alhamdulillah! Tidak ada catatan pelanggaran ananda.</span>
                    </div>
                  ) : (
                    <div className="space-y-2 mt-2">
                      {santri.catatanPelanggaran.map((p, index) => (
                        <div key={index} className="flex items-start space-x-2 p-3 rounded-2xl bg-rose-50 border border-rose-100 text-rose-905">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          <span className="text-xs font-semibold leading-tight">{p}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-xxxs text-slate-400 italic mt-3">*Catatan disiplin diinput langsung oleh Lurah Keamanan Pondok.</p>
              </div>
            </div>

            {/* Academic tracker list */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 text-sm mb-4">Nilai Akademik Madrasah Ananda</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-450 uppercase font-bold tracking-wider">
                      <th className="py-2">Mata Pelajaran</th>
                      <th className="py-2">Ujian</th>
                      <th className="py-2 text-center">Nilai</th>
                      <th className="py-2">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium">
                    {childNilai.map(n => (
                      <tr key={n.id} className="hover:bg-slate-55/60">
                        <td className="py-3 font-semibold text-slate-800">{n.mataPelajaran}</td>
                        <td className="py-3">
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono text-xxs uppercase">
                            {n.tipeUjian}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <span className="font-bold text-teal-800 bg-teal-50 px-2 py-1 rounded font-mono border border-teal-100">
                            {n.nilai}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500 italic text-xxs">{n.catatan}</td>
                      </tr>
                    ))}
                    {childNilai.length === 0 && (
                      <tr>
                        <td colSpan={4} className="text-center py-6 text-slate-400 text-xs">Belum ada nilai ujian terbit.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Latest hafalan list summary for wali */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-150">
                <h3 className="font-bold text-slate-805 text-sm flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-teal-600" />
                  Pelajaran Madrasah Diniyah Ananda
                </h3>
              </div>
              <div className="space-y-3.5">
                {childSetoran.slice(0, 3).map(s => {
                  const predikatLabel = {
                    'Sangat Lancar': 'Mumtaz',
                    'Lancar': 'Jayyid Jid.',
                    'Cukup': 'Jayyid',
                    'Perlu Mengulang': 'Maqbul',
                  }[s.statusPenilaian] || s.statusPenilaian;

                  return (
                    <div key={s.id} className="border-l-2 border-teal-600 pl-3 py-0.5">
                      <span className="text-xxs font-mono text-slate-400">{s.tanggal} &bull; Kelas {s.juz} Awaliyah</span>
                      <h4 className="font-bold text-slate-800 text-xs mt-0.5 leading-snug">
                        {s.surah} (Tugas {s.ayatMulai} | Ujian {s.ayatSelesai})
                      </h4>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xxxs text-slate-500">Ustadz: {s.ustadzPenguji.split(',')[0]}</span>
                        <strong className="text-xxs font-semibold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded uppercase">
                          {predikatLabel}
                        </strong>
                      </div>
                    </div>
                  );
                })}
                {childSetoran.length === 0 && (
                  <p className="text-xs text-slate-450 text-center py-4">Belum ada nilai pelajaran dicatat.</p>
                )}
              </div>
            </div>

            {/* Hasil Penilaian Jilid & Al-Qur'an */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-amber-100">
                <h3 className="font-bold text-slate-850 text-sm flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-600" />
                  Bimbingan Jilid & Al-Qur'an
                </h3>
              </div>
              
              {penilaianJilidList.filter(pj => pj.santriId === santri.id).length === 0 ? (
                <p className="text-xxs text-slate-400 text-center py-4 italic">Belum ada progres jilid/Al-Qur'an.</p>
              ) : (
                <div className="space-y-4">
                  {penilaianJilidList.filter(pj => pj.santriId === santri.id).map(pj => (
                    <div key={pj.id} className="text-xs bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100">
                      <div className="flex justify-between items-center mb-1.5 font-sans">
                        <span className="font-bold text-amber-900 bg-amber-50 text-[9px] uppercase px-2 py-0.5 rounded border border-amber-150 font-mono tracking-wide">
                          {pj.tingkat}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono">{pj.tanggal}</span>
                      </div>
                      
                      <div className="space-y-1 text-xxs mb-2 text-slate-600 leading-normal">
                        <div>
                          <span className="text-slate-400 font-medium">Halaman Berpindah:</span>{" "}
                          <strong className="text-slate-700">Hal. {pj.halamanLama} &rarr; Hal. {pj.halamanBaru}</strong>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Doa Harian:</span>{" "}
                          <span className="font-semibold text-emerald-700">{pj.hafalanDoaHarian || "-"}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-medium">Fasholatan:</span>{" "}
                          <span className="font-semibold text-emerald-700">{pj.hafalanFasholatan || "-"}</span>
                        </div>
                      </div>

                      <div className="p-2 bg-white rounded-xl text-[10px] text-slate-500 border border-slate-100 italic leading-snug">
                        <strong>Ustadz ({pj.ustadzPenguji.split(',')[0]}):</strong> {pj.catatan}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick action helper card */}
            <div className="bg-emerald-900 text-emerald-50 rounded-3xl p-6 border border-emerald-800 shadow-sm">
              <h4 className="text-sm font-bold font-sans">Kunjungan Wali Santri & Sambang</h4>
              <p className="text-xxs text-emerald-200 mt-2 leading-relaxed">
                Jadwal berkunjung (Sambangan) santri diselenggarakan pada hari Ahad ke-2 dan ke-4 setiap bulannya. Dilarang membawa makanan instan berlebih.
              </p>
              <div className="mt-4 pt-3 border-t border-emerald-800/60 flex justify-between items-center text-xxs font-mono text-emerald-300">
                <span>Minggu Ini:</span>
                <span className="bg-emerald-800 text-white px-2 py-0.5 rounded font-bold">TUTUP</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SPP & Pembayaran View */}
      {activeTab === 'spp' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* SPP Summary Cards */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <span className="text-xxs font-mono text-slate-400 block uppercase tracking-wider mb-1">Total Tagihan Belum Bayar</span>
              <div className="text-2xl font-bold font-sans text-rose-600 tracking-tight">
                Rp {childTagihan.filter(t => t.status === 'Belum Bayar').reduce((acc, t) => acc + t.jumlah, 0).toLocaleString('id-ID')}
              </div>
              <p className="text-xxs text-slate-450 mt-1">Estimasi biaya SPP bulanan wajib.</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <span className="text-xxs font-mono text-slate-400 block uppercase tracking-wider mb-1">Status Lunas Mei 2026</span>
              <div className="flex items-center space-x-2 text-emerald-700 mt-1 text-lg font-bold">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span>LUNAS SYAHRIAH</span>
              </div>
              <p className="text-xxs text-slate-450 mt-1">Syukran jazakumullah khairan katsir.</p>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-center">
              <span className="text-xxs font-mono text-slate-400 block uppercase tracking-wider">Metode Pembayaran Mandiri</span>
              <div className="text-xs font-semibold text-slate-700 mt-1 flex items-center gap-1.5 p-1.5 bg-slate-50 border border-slate-100 rounded-lg">
                <QrCode className="w-4 h-4 text-teal-600" />
                <span>Simulasi Integrasi Kode QRIS Instan</span>
              </div>
            </div>
          </div>

          {/* SPP Invoice list */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
            <h3 className="font-bold text-slate-805 text-sm mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-teal-600" />
              Daftar Tagihan SPP Bulanan (Syahriah)
            </h3>

            <div className="space-y-3.5">
              {childTagihan.map(t => {
                const statusTheme = {
                  'Lunas': { bg: 'bg-emerald-50 text-emerald-800 border-emerald-150', text: 'Lunas' },
                  'Belum Bayar': { bg: 'bg-rose-50 text-rose-800 border-rose-200', text: 'Bayar Sekarang' },
                  'Menunggu Konfirmasi': { bg: 'bg-amber-50 text-amber-800 border-amber-200', text: 'Diproses' }
                }[t.status];

                return (
                  <div key={t.id} className="p-4 rounded-2xl border border-slate-150 flex flex-col sm:flex-row justify-between sm:items-center gap-3 hover:bg-slate-50/20 transition-all">
                    <div>
                      <span className="text-xxs font-mono text-slate-400">{t.invoiceNumber}</span>
                      <h4 className="font-bold text-slate-800 text-sm mt-0.5">SPP Bulanan Pesantren &bull; {t.bulan}</h4>
                      <div className="flex items-center gap-4 mt-2 text-xxs text-slate-500 font-mono">
                        <span className="font-bold text-slate-705">Biaya: Rp {t.jumlah.toLocaleString('id-ID')}</span>
                        {t.tanggalBayar && <span>Metode: {t.metodeBayar || 'QRIS'} &bull; Selesai {t.tanggalBayar}</span>}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center shrink-0">
                      <span className={`text-xxs font-bold px-2.5 py-1 rounded-full border mb-1.5 ${statusTheme.bg}`}>
                        {t.status === 'Lunas' ? 'Lunas' : t.status === 'Menunggu Konfirmasi' ? 'Menunggu Review' : 'Belum Dibayar'}
                      </span>
                      {t.status === 'Belum Bayar' && (
                        <button
                          id={`pay-btn-${t.id}`}
                          onClick={() => {
                            setActivePaymentTagihan(t);
                            setPaymentStep('select');
                          }}
                          className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xxs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Klik Bayar</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Perizinan View */}
      {activeTab === 'perizinan' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Leave permits */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-slate-801 text-sm flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-teal-600" />
              Surat Perizinan & Riwayat Keluar Pondok
            </h3>

            {childPerizinan.map(p => (
              <div key={p.id} className="p-4 rounded-3xl border border-slate-160 bg-white shadow-xs space-y-3 hover:border-slate-200 transition-all">
                <div className="flex justify-between items-center">
                  <span className={`text-xxs font-bold px-2 py-0.5 rounded ${
                    p.status === 'Disetujui'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                      : p.status === 'Ditolak'
                      ? 'bg-rose-50 text-rose-800 border border-rose-100'
                      : 'bg-amber-50 text-amber-800 border border-amber-100'
                  }`}>
                    Permohonan {p.status}
                  </span>
                  <span className="text-xxs font-mono text-slate-400">Pengajuan: {p.tanggalPengajuan}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div>
                    <span className="text-xxs text-slate-400 block font-mono">Tipe Izin</span>
                    <strong className="text-slate-800 font-semibold">{p.tipeIzin === 'Pulang' ? 'Izin Pulang (Mudik)' : 'Izin Sakit'}</strong>
                  </div>
                  <div>
                    <span className="text-xxs text-slate-400 block font-mono">Durasi Tanggal</span>
                    <strong className="text-slate-850 font-semibold font-mono text-xxs">{p.tanggalMulai} s/d {p.tanggalSelesai}</strong>
                  </div>
                </div>

                <div className="text-xs text-slate-600 p-2.5 bg-slate-50 border border-slate-100 rounded-xl leading-relaxed">
                  <strong className="text-slate-700">Alasan:</strong> {p.alasan}
                </div>

                {p.disetujuiOleh && (
                  <div className="text-xxs font-mono text-slate-400 text-right mt-1.5 flex items-center justify-end gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Disahkan oleh: <strong className="text-slate-700">{p.disetujuiOleh}</strong></span>
                  </div>
                )}
              </div>
            ))}

            {childPerizinan.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-6">Belum ada riwayat perizinan santri.</p>
            )}
          </div>

          {/* Leave request form */}
          <div>
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <h3 className="font-bold text-slate-805 text-sm flex items-center gap-1.5 mb-1.5">
                <Plane className="w-4 h-4 text-teal-650" />
                Ajukan Surat Izin Baru
              </h3>
              <p className="text-xxs text-slate-400 mb-4 font-normal">Buat surat permohonan kepulangan atau pemberitahuan sakit untuk ananda kepada pengurus.</p>

              {izinSuccess && (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-xl mb-4 text-xs font-semibold">
                  {izinSuccess}
                </div>
              )}

              <form onSubmit={handleIzinSubmit} className="space-y-3">
                <div>
                  <label htmlFor="izin-type" className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Jenis Izin</label>
                  <select
                    id="izin-type"
                    value={formIzinType}
                    onChange={(e) => setFormIzinType(e.target.value as any)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                  >
                    <option value="Pulang">Izin Pulang ke Rumah (Mudik acara khidmat)</option>
                    <option value="Sakit">Sakit (Klinik / Dokter)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label htmlFor="izin-mulai" className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Mulai Tanggal</label>
                    <input
                      id="izin-mulai"
                      type="date"
                      value={formIzinMulai}
                      onChange={(e) => setFormIzinMulai(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="izin-selesai" className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Selesai Tanggal</label>
                    <input
                      id="izin-selesai"
                      type="date"
                      value={formIzinSelesai}
                      onChange={(e) => setFormIzinSelesai(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="izin-alasan" className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Alasan Pengajuan</label>
                  <textarea
                    id="izin-alasan"
                    rows={3}
                    placeholder="Sebutkan alasan detail dan penanggung jawab di rumah..."
                    value={formIzinAlasan}
                    onChange={(e) => setFormIzinAlasan(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-teal-500 bg-white"
                    required
                  />
                </div>

                <button
                  id="submit-izin-btn"
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 rounded-xl text-xs transition-all shadow-xs block text-center"
                >
                  Ajukan Permohonan Izin
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Communications View */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
          <div className="border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <MessageSquare className="w-5 h-5 text-teal-600" />
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Wali liaison - Hubungi Pengurus & Humas</h3>
                <span className="text-xxs text-emerald-600 font-medium whitespace-nowrap flex items-center gap-1">
                  <span className="block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Ustadz Pembina Online (Siap Merespon)
                </span>
              </div>
            </div>
            <span className="text-xxs font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">Hub: Humas Putri/Putra</span>
          </div>

          {/* Secure chat display logs */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 h-80 overflow-y-auto space-y-3.5 mb-4 flex flex-col justify-end">
            <div className="text-center text-xxs text-slate-400 font-mono my-2 border-b border-slate-150 pb-2">
              Keamanan Terenkripsi &bull; Pesan Anda dikirim ke Pengurus Asrama Santri
            </div>
            {chats.map((c, index) => {
              const fromMe = c.sender === 'Wali';
              return (
                <div key={index} className={`flex flex-col ${fromMe ? 'items-end' : 'items-start'}`}>
                  <div className={`p-3 max-w-sm rounded-2xl text-xs font-medium leading-relaxed ${
                    fromMe
                      ? 'bg-teal-600 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-150 rounded-bl-none'
                  }`}>
                    {c.text}
                  </div>
                  <span className="text-xxs font-mono text-slate-400 mt-1">{c.time}</span>
                </div>
              );
            })}
          </div>

          {/* Composers */}
          <form onSubmit={handleSendChat} className="flex gap-2.5">
            <input
              id="chat-input-box"
              type="text"
              placeholder="Tulis pesan pertanyaan perkembangan / kendala ananda..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              className="flex-1 border border-slate-205 rounded-xl px-4 py-2 text-xs outline-none focus:ring-1 focus:ring-teal-500 bg-white"
            />
            <button
              id="send-chat-btn"
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white p-2.5 rounded-xl transition-all shadow-sm shrink-0 flex items-center justify-center w-10.5 h-10.5"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* 4. Payment QRIS Simulator Modal Popup */}
      {activePaymentTagihan && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-105 p-6 space-y-6 shadow-2xl animate-fade-in">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-xxs font-mono text-teal-600 uppercase font-bold">Gerbang Pembayaran Instan</span>
                <h3 className="font-bold text-slate-800 text-sm mt-0.5">Metode Pembayaran SPP</h3>
              </div>
              <button
                id="close-payment-modal"
                onClick={() => setActivePaymentTagihan(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {paymentStep === 'select' && (
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <span className="text-xxxs font-mono text-slate-450 uppercase">Tagihan Yang Dipilih</span>
                  <p className="text-xs font-bold text-slate-800 mt-1">SPP Bulanan &bull; {activePaymentTagihan.bulan}</p>
                  <p className="text-lg font-bold text-teal-800 font-sans tracking-tight mt-1">
                    Rp {activePaymentTagihan.jumlah.toLocaleString('id-ID')}
                  </p>
                </div>

                <div>
                  <label htmlFor="metode-select" className="block text-xxs font-bold text-slate-550 uppercase tracking-widest mb-1.5">Pilih Saluran Pembayaran</label>
                  <select
                    id="metode-select"
                    value={selectedMetode}
                    onChange={(e) => setSelectedMetode(e.target.value)}
                    className="w-full text-xs border border-slate-20d rounded-xl px-3 py-2.5 bg-white outline-none focus:ring-1 focus:ring-teal-500"
                  >
                    <option value="QRIS Gopay">QRIS - Gopay / OVO / Dana / LinkAja</option>
                    <option value="Transfer Bank Mandiri">Transfer Bank Mandiri (VA)</option>
                    <option value="Transfer Bank Syariah Indonesia">Transfer Bank Syariah Indonesia (BSI)</option>
                    <option value="Simpanan Tunai Pengurus">Simpanan Tunai (Melalui Kantor)</option>
                  </select>
                </div>

                <div className="p-2.5 bg-teal-50 rounded-xl text-xxs text-teal-850 leading-relaxed border border-teal-100 flex items-start gap-2">
                  <FileText className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <span>Sistem kami memicu kode bayar otomatis. Membayar via QRIS akan langsung divalidasi oleh sistem keuangan pondok.</span>
                </div>

                <button
                  id="next-payment-step-btn"
                  onClick={() => setPaymentStep('qris')}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Dapatkan QRIS / Kode Bayar</span>
                </button>
              </div>
            )}

            {paymentStep === 'qris' && (
              <div className="space-y-4 text-center">
                <span className="text-xs text-slate-500 block">Pindai kode QRIS di bawah menggunakan aplikasi dompet digital Anda</span>

                {/* Simulated QR Code displaying details */}
                <div className="mx-auto border-4 border-teal-700 p-2.5 w-48 h-48 rounded-2xl bg-white flex flex-col items-center justify-center relative shadow-md">
                  <div className="absolute top-1 left-2.5 text-[7px] font-mono text-teal-700 font-bold uppercase tracking-wider">Al Asyhar & Madin QRIS</div>
                  {/* QR Core placeholder vector */}
                  <div className="w-36 h-36 border-2 border-slate-700 bg-slate-90 rounded p-1 flex flex-col justify-between overflow-hidden">
                    <div className="flex justify-between h-8">
                      <div className="w-8 h-8 bg-slate-900 border-2 border-white rounded" />
                      <div className="w-8 h-8 bg-slate-900 border-2 border-white rounded" />
                    </div>
                    {/* Fake QRIS pattern lines */}
                    <div className="flex-1 my-1.5 flex flex-wrap gap-0.5 overflow-hidden justify-center items-center">
                      {Array.from({ length: 48 }).map((_, idx) => (
                        <div key={idx} className={`w-2.5 h-2.5 ${idx % 3 === 0 || idx % 5 === 1 ? 'bg-slate-900' : 'bg-transparent'}`} />
                      ))}
                    </div>
                    <div className="flex justify-between h-8">
                      <div className="w-8 h-8 bg-slate-900 border-2 border-white rounded" />
                      <div className="w-2 h-2" />
                    </div>
                  </div>
                  <div className="absolute bottom-1 right-2.5 text-[7px] font-mono text-slate-500 font-bold">GPN INDONESIA</div>
                </div>

                <div className="bg-slate-100 p-3 rounded-2xl text-center">
                  <p className="text-xxs text-slate-450">Nominal Transfer</p>
                  <strong className="text-md text-slate-800 font-mono">Rp {activePaymentTagihan.jumlah.toLocaleString('id-ID')}</strong>
                </div>

                <div className="flex space-x-2">
                  <button
                    id="back-to-select"
                    onClick={() => setPaymentStep('select')}
                    className="w-1/3 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs py-2 rounded-xl transition-all"
                  >
                    Kembali
                  </button>
                  <button
                    id="simulate-success-btn"
                    onClick={handleFinalizePayment}
                    className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-xl transition-all shadow-sm"
                  >
                    Simulasikan Sukses Bayar
                  </button>
                </div>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="space-y-4 text-center py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 font-bold mx-auto flex items-center justify-center text-lg shadow-sm">
                  ✔
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Alhamdulillah, Pembayaran Berhasil!</h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    Pembayaran SPP untuk bulan <strong className="text-slate-700">{activePaymentTagihan.bulan}</strong> sebesar <strong className="text-slate-700">Rp {activePaymentTagihan.jumlah.toLocaleString('id-ID')}</strong> telah divalidasi lunas.
                  </p>
                </div>
                <button
                  id="close-success-btn"
                  onClick={() => setActivePaymentTagihan(null)}
                  className="w-full bg-slate-800 hover:bg-slate-900 text-white text-xs py-2 rounded-xl transition-all font-bold"
                >
                  Selesai
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
