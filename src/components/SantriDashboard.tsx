import React, { useState } from 'react';
import {
  Santri,
  SetoranHafalan,
  TargetHafalan,
  JurnalIbadah,
  JadwalPelajaran,
  JadwalNgaji,
  NilaiUjian,
  MateriKitab,
  Notifikasi,
  PengumumanPondok,
  PenilaianJilid
} from '../types';
import {
  BookOpen,
  CheckCircle,
  Calendar,
  Award,
  Bell,
  Clock,
  Book,
  Moon,
  Sun,
  Plus,
  Send,
  MessageSquare,
  ClipboardList,
  CheckSquare,
  ListFilter
} from 'lucide-react';

interface SantriDashboardProps {
  santri: Santri;
  setoranList: SetoranHafalan[];
  targetsList: TargetHafalan[];
  jurnalList: JurnalIbadah[];
  jadwalPelajaranList: JadwalPelajaran[];
  jadwalNgajiList: JadwalNgaji[];
  nilaiUjianList: NilaiUjian[];
  materiKitabList: MateriKitab[];
  notifikasiList: Notifikasi[];
  pengumumanList: PengumumanPondok[];
  penilaianJilidList?: PenilaianJilid[];
  onAddSetoran: (newSetoran: Omit<SetoranHafalan, 'id'>) => void;
  onUpdateJurnal: (updatedJurnal: JurnalIbadah) => void;
}

export default function SantriDashboard({
  santri,
  setoranList,
  targetsList,
  jurnalList,
  jadwalPelajaranList,
  jadwalNgajiList,
  nilaiUjianList,
  materiKitabList,
  notifikasiList,
  pengumumanList,
  penilaianJilidList = [],
  onAddSetoran,
  onUpdateJurnal
}: SantriDashboardProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'hafalan' | 'ibadah' | 'akademik' | 'notif'>('hafalan');

  // Input states for new setoran simulator (self report)
  const [formJuz, setFormJuz] = useState<number>(30);
  const [formSurah, setFormSurah] = useState<string>('');
  const [formAyatStart, setFormAyatStart] = useState<number>(1);
  const [formAyatEnd, setFormAyatEnd] = useState<number>(10);
  const [formTipe, setFormTipe] = useState<'Setoran Baru' | 'Murojaah'>('Setoran Baru');
  const [successMsg, setSuccessMsg] = useState<string>('');

  // Find or create today's journal
  const todayStr = new Date().toISOString().split('T')[0];
  const todayJurnal = jurnalList.find(j => j.santriId === santri.id && j.tanggal === todayStr) || {
    id: `j-temp-${Date.now()}`,
    santriId: santri.id,
    tanggal: todayStr,
    sholatBerjamaah: { subuh: false, dhuhur: false, ashar: false, maghrib: false, isya: false },
    puasaSunnah: 'Tidak Puasa',
    tilawahLembar: 0,
    dzikirPagi: false,
    dzikirPetang: false,
    sholatTahajud: false,
    sholatDhuha: false
  } as JurnalIbadah;

  // Filter lists for current student
  const filteredSetoran = setoranList.filter(s => s.santriId === santri.id);
  const filteredTargets = targetsList.filter(t => t.santriId === santri.id);
  const filteredNilai = nilaiUjianList.filter(n => n.santriId === santri.id);

  // Auto-calculated unique Juz progress based on setoran status
  const finishedJuzList = Array.from(new Set(filteredSetoran
    .filter(s => s.statusPenilaian === 'Sangat Lancar' || s.statusPenilaian === 'Lancar')
    .map(s => s.juz)
  )).sort((a, b) => a - b);

  // Handle setoran self report
  const handleSetoranSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formSurah.trim()) return;

    onAddSetoran({
      santriId: santri.id,
      tanggal: todayStr,
      juz: Number(formJuz),
      surah: formSurah,
      ayatMulai: Number(formAyatStart),
      ayatSelesai: Number(formAyatEnd),
      tipe: formTipe,
      statusPenilaian: 'Lancar', // Default approval grade
      ustadzPenguji: 'Ustadz Abdul Somad, Lc. (Mandiri)',
      catatan: 'Setoran mandiri terdaftar otomatis di sistem.'
    });

    setFormSurah('');
    setSuccessMsg('Alhamdulillah! Setoran hafalan berhasil dicatat.');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Helper to toggle sholat status
  const toggleSholat = (waktu: 'subuh' | 'dhuhur' | 'ashar' | 'maghrib' | 'isya') => {
    const updated = {
      ...todayJurnal,
      sholatBerjamaah: {
        ...todayJurnal.sholatBerjamaah,
        [waktu]: !todayJurnal.sholatBerjamaah[waktu]
      }
    };
    onUpdateJurnal(updated);
  };

  // Helper to toggle checklist item booleans
  const toggleChecklist = (field: 'dzikirPagi' | 'dzikirPetang' | 'sholatTahajud' | 'sholatDhuha') => {
    const updated = {
      ...todayJurnal,
      [field]: !todayJurnal[field]
    };
    onUpdateJurnal(updated);
  };

  // Helper to update custom inputs
  const updateTilawah = (amount: number) => {
    const updated = {
      ...todayJurnal,
      tilawahLembar: Math.max(0, todayJurnal.tilawahLembar + amount)
    };
    onUpdateJurnal(updated);
  };

  const updatePuasa = (val: JurnalIbadah['puasaSunnah']) => {
    const updated = {
      ...todayJurnal,
      puasaSunnah: val
    };
    onUpdateJurnal(updated);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Profile Banner */}
      <div id="santri-banner" className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xl font-sans border border-emerald-200">
            {santri.nama.split(' ').map(w => w[0]).slice(0, 2).join('')}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{santri.nama}</h2>
            <div className="flex flex-wrap gap-2 mt-1 text-slate-500 font-medium text-xs">
              <span className="bg-slate-100 px-2.5 py-1 rounded-full text-slate-700">NIS: {santri.nis}</span>
              <span className="bg-emerald-50 text-emerald-700 font-semibold px-2.5 py-1 rounded-full border border-emerald-100">Kelas: {santri.kelas}</span>
              <span className="bg-teal-50 text-teal-700 font-semibold px-2.5 py-1 rounded-full border border-teal-100">Wali: {santri.namaWali}</span>
            </div>
          </div>
        </div>

        {/* Rapid stats */}
        <div className="flex space-x-6 shrink-0 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
          <div className="text-center">
            <span className="block text-xxs font-mono text-slate-400 uppercase tracking-wider">Hafalan Saat Ini</span>
            <span className="text-lg font-bold text-emerald-700 font-sans">Juz {santri.juzTerakhir}</span>
          </div>
          <div className="w-px bg-slate-200 self-stretch" />
          <div className="text-center">
            <span className="block text-xxs font-mono text-slate-400 uppercase tracking-wider">Kehadiran Kelas</span>
            <span className="text-lg font-bold text-teal-700 font-sans">{santri.kehadiranPercent}%</span>
          </div>
          <div className="w-px bg-slate-200 self-stretch" />
          <div className="text-center">
            <span className="block text-xxs font-mono text-slate-400 uppercase tracking-wider">Juz Dihafal</span>
            <span className="text-lg font-bold text-blue-700 font-sans">{finishedJuzList.length || 1} Juz</span>
          </div>
        </div>
      </div>

      {/* 2. Horizontal Navigation for Santri Dashboard */}
      <div className="flex space-x-1 p-1 bg-slate-100 rounded-xl max-w-md">
        <button
          id="santri-tab-hafalan"
          onClick={() => setActiveTab('hafalan')}
          className={`flex-1 py-2 text-center rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'hafalan'
              ? 'bg-white text-emerald-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Hasil Belajar Diniyah
        </button>
        <button
          id="santri-tab-ibadah"
          onClick={() => setActiveTab('ibadah')}
          className={`flex-1 py-2 text-center rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'ibadah'
              ? 'bg-white text-emerald-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Status Jurnal Ibadah
        </button>
        <button
          id="santri-tab-akademik"
          onClick={() => setActiveTab('akademik')}
          className={`flex-1 py-2 text-center rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'akademik'
              ? 'bg-white text-emerald-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Akademik & Kitab
        </button>
        <button
          id="santri-tab-notif"
          onClick={() => setActiveTab('notif')}
          className={`flex-1 py-2 text-center rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'notif'
              ? 'bg-white text-emerald-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Pemberitahuan
          <span className="block w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
        </button>
      </div>

      {/* 3. Tab Contents */}

      {/* Tab A: Hafalan */}
      {activeTab === 'hafalan' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left + Middle Col: Hafalan Progress and Setoran Log */}
          <div className="lg:col-span-2 space-y-6">
            {/* Automatic Madrasah Diniyah progress bar */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-4">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Sifat Evaluasi Madrasah Diniyah Awaliyah
              </h3>
              <div className="mb-4">
                <div className="flex justify-between text-xs text-slate-500 mb-1.5 font-medium">
                  <span>Pencapaian Tingkat Kelas</span>
                  <span className="font-semibold text-emerald-700">{santri.kelas}</span>
                </div>
                <div className="w-full bg-slate-150 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-650 h-full rounded-full transition-all duration-550"
                    style={{
                      width: santri.kelas.includes('1') ? '25%' : santri.kelas.includes('2') ? '50%' : santri.kelas.includes('3') ? '75%' : '100%'
                    }}
                  />
                </div>
              </div>

              {/* Grid map of kelas Diniyah */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['Kelas 1 Awaliyah', 'Kelas 2 Awaliyah', 'Kelas 3 Awaliyah', 'Kelas 4 Awaliyah'].map((kls, index) => {
                  const classNum = index + 1;
                  const currentClassNum = santri.kelas.includes('1') ? 1 : santri.kelas.includes('2') ? 2 : santri.kelas.includes('3') ? 3 : santri.kelas.includes('4') ? 4 : 1;
                  const isFinished = classNum < currentClassNum;
                  const isCurrent = classNum === currentClassNum;
                  return (
                    <div
                      key={kls}
                      className={`text-center py-4 rounded-xl text-xs transition-all border font-bold ${
                        isFinished
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-150'
                          : isCurrent
                          ? 'bg-amber-50 text-amber-900 border-amber-300 ring-2 ring-amber-200'
                          : 'bg-slate-50 text-slate-400 border-slate-100'
                      }`}
                    >
                      <div>{kls}</div>
                      <div className="text-[10px] text-slate-450 font-normal mt-1">
                        {isFinished ? 'Selesai Lulus' : isCurrent ? 'Tingkat Aktif' : 'Belum Ditempuh'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Riwayat Setoran */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 text-sm mb-4">Hasil Nilai Pelajaran Madrasah Diniyah Awaliyah & Predikat</h3>
              {filteredSetoran.length === 0 ? (
                <div className="text-center py-8 text-slate-450 text-xs">Belum ada riwayat nilai pelajaran madrasah yang tercatat.</div>
              ) : (
                <div className="space-y-4">
                  {filteredSetoran.map(s => {
                    const gradeColors = {
                      'Sangat Lancar': 'bg-emerald-50 text-emerald-800 border-emerald-200',
                      'Lancar': 'bg-teal-50 text-teal-800 border-teal-200',
                      'Cukup': 'bg-blue-50 text-blue-800 border-blue-200',
                      'Perlu Mengulang': 'bg-rose-50 text-rose-800 border-rose-250',
                    }[s.statusPenilaian];

                    const predikatLabel = {
                      'Sangat Lancar': 'Mumtaz (Istimewa)',
                      'Lancar': 'Jayyid Jiddan (Sangat Baik)',
                      'Cukup': 'Jayyid (Baik)',
                      'Perlu Mengulang': 'Maqbul / Mengulang',
                    }[s.statusPenilaian] || s.statusPenilaian;

                    return (
                      <div key={s.id} className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all bg-slate-50/40">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <div>
                            <span className="text-xs font-semibold text-slate-750 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded mr-2 font-mono">
                              Kelas {s.juz} Awaliyah
                            </span>
                            <span className="font-bold text-slate-800 font-sans text-sm">
                              {s.surah}
                            </span>
                          </div>
                          <span className={`text-xxs font-bold px-2.5 py-1 rounded-full border text-right self-start sm:self-center ${gradeColors}`}>
                            {predikatLabel}
                          </span>
                        </div>

                        {/* Metadata setoran */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xxs font-mono text-slate-450 mb-3 border-b border-dashed border-slate-200/60 pb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3" /> {s.tanggal}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3" /> {s.tipe}
                          </span>
                          <span className="text-orange-700 font-semibold md:text-right">
                            Tugas: {s.ayatMulai}
                          </span>
                          <span className="text-teal-700 font-semibold md:text-right">
                            Ujian: {s.ayatSelesai}
                          </span>
                        </div>

                        <div className="p-2.5 bg-white rounded-xl text-xs text-slate-600 border border-slate-100 flex items-start gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <strong className="text-slate-700">Catatan Penguji:</strong> {s.catatan || 'Tidak ada catatan tambahn.'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Riwayat Kenaikan Jilid & Al-Qur'an */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 text-sm mb-1.5 flex items-center gap-1.5">
                <Award className="w-5 h-5 text-amber-605" />
                Buku Kendali Jilid (1-5) & Al-Qur'an (1-2)
              </h3>
              <p className="text-xxs text-slate-400 mb-4 leading-normal">Evaluasi kelulusan jilid, bimbingan tajwid tartil, hafalan doa harian, dan fasholatan oleh ustadz penguji.</p>
              
              {penilaianJilidList.filter(pj => pj.santriId === santri.id).length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs italic">Belum ada riwayat bimbingan berkas jilid/Al-Qur'an tercatat pada profil Anda.</div>
              ) : (
                <div className="space-y-4">
                  {penilaianJilidList.filter(pj => pj.santriId === santri.id).map(pj => (
                    <div key={pj.id} className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all bg-slate-50/45">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold text-amber-900 bg-amber-50 border border-amber-150 px-2.5 py-0.5 rounded-lg self-start uppercase tracking-wide">
                          Status: {pj.tingkat}
                        </span>
                        <span className="text-xxxs font-mono text-slate-400">{pj.tanggal}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 border-b border-dashed border-slate-200 pb-2 bg-white/50 p-2.5 rounded-xl">
                        <div className="text-xxs text-slate-500">
                          <strong className="text-slate-400 block font-mono uppercase tracking-wider text-[9px] mb-0.5">Transisi Bacaan:</strong>
                          <span className="font-bold text-slate-700">Halaman {pj.halamanLama} &rarr; Halaman {pj.halamanBaru}</span>
                        </div>
                        <div className="text-xxs text-slate-500">
                          <strong className="text-slate-400 block font-mono uppercase tracking-wider text-[9px] mb-0.5">Ustadz Penguji:</strong>
                          <span className="font-bold text-slate-700 text-xxs">{pj.ustadzPenguji}</span>
                        </div>
                        <div className="text-xxs text-slate-500">
                          <strong className="text-emerald-600 block font-mono uppercase tracking-wider text-[9px] mb-0.5">Hafalan Doa Harian:</strong>
                          <span className="font-semibold text-slate-700">{pj.hafalanDoaHarian}</span>
                        </div>
                        <div className="text-xxs text-slate-500">
                          <strong className="text-emerald-600 block font-mono uppercase tracking-wider text-[9px] mb-0.5">Hafalan Fasholatan:</strong>
                          <span className="font-semibold text-slate-700">{pj.hafalanFasholatan}</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-amber-50/20 rounded-xl text-xxs text-slate-600 border border-amber-200/40 flex items-start gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong>Catatan Koreksi Ustadz:</strong> {pj.catatan}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Col: Target and Interactive Setoran self reporting form */}
          <div className="space-y-6">
            {/* Target Hafalan Box */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-emerald-600" />
                Target Hafalan Mendatang
              </h3>
              <div className="space-y-3">
                {filteredTargets.map(t => (
                  <div key={t.id} className="p-3.5 rounded-2xl border border-slate-150 bg-slate-50/50">
                    <div className="flex justify-between items-start mb-1.5">
                      <div>
                        <span className="text-xxs font-semibold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-100">
                          Target {t.tipeTarget}
                        </span>
                        <h4 className="font-bold text-slate-800 text-sm mt-1">{t.targetJuz}</h4>
                      </div>
                      <span className={`text-xxs font-bold px-2 py-1 rounded ${
                        t.status === 'Tercapai'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {t.status}
                      </span>
                    </div>
                    <div className="text-xxs font-mono text-slate-400 mt-1">
                      Batas Waktu: {t.deadline}
                    </div>
                  </div>
                ))}
                {filteredTargets.length === 0 && (
                  <p className="text-xs text-slate-450 text-center py-4">Belum ada target terjadwal.</p>
                )}
              </div>
            </div>

            {/* Interactive Form: Target Pelajaran (Self-Simulate) */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 mb-1.5">
                <Plus className="w-4 h-4 text-emerald-600" />
                Daftar Mandiri Rencana Pelajaran
              </h3>
              <p className="text-xxs text-slate-450 mb-4">Input mata pelajaran & kitab baru yang akan diujikan atau dipresentasikan dalam KBM esok hari.</p>

              {successMsg && (
                <div className="bg-emerald-50 text-emerald-800 text-xs p-3 rounded-xl mb-4 border border-emerald-250 font-medium">
                  {successMsg}
                </div>
              )}

              <form onSubmit={handleSetoranSubmit} className="space-y-3">
                <div>
                  <label htmlFor="form-tipe" className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Sifat Belajar</label>
                  <select
                    id="form-tipe"
                    value={formTipe}
                    onChange={(e) => setFormTipe(e.target.value as any)}
                    className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-emerald-555 focus:border-emerald-555 bg-white"
                  >
                    <option value="Setoran Baru">Rencana Presentasi / Setor Kitab</option>
                    <option value="Murojaah">Persiapan Ulangan Harian</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="form-juz" className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Kelas Diniyah</label>
                    <select
                      id="form-juz"
                      value={formJuz}
                      onChange={(e) => setFormJuz(Number(e.target.value))}
                      className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-emerald-555 bg-white"
                      required
                    >
                      <option value={1}>Kelas 1 Awaliyah</option>
                      <option value={2}>Kelas 2 Awaliyah</option>
                      <option value={3}>Kelas 3 Awaliyah</option>
                      <option value={4}>Kelas 4 Awaliyah</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="form-surah" className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Mata Pelajaran</label>
                    <input
                      id="form-surah"
                      type="text"
                      placeholder="Contoh: Akhlaq, Fiqih"
                      value={formSurah}
                      onChange={(e) => setFormSurah(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-emerald-555"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="form-ayat-mulai" className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Target Mulai Bab/Hal</label>
                    <input
                      id="form-ayat-mulai"
                      type="number"
                      min={1}
                      value={formAyatStart}
                      onChange={(e) => setFormAyatStart(Number(e.target.value))}
                      className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-emerald-555"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="form-ayat-selesai" className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Target Selesai Bab/Hal</label>
                    <input
                      id="form-ayat-selesai"
                      type="number"
                      min={1}
                      value={formAyatEnd}
                      onChange={(e) => setFormAyatEnd(Number(e.target.value))}
                      className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-emerald-555"
                      required
                    />
                  </div>
                </div>

                <button
                  id="submit-hafalan-btn"
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 mt-2 shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Daftarkan Target Belajar</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Tab B: Jurnal Ibadah (Checklist harian) */}
      {activeTab === 'ibadah' && (
        <div className="space-y-6">
          <div className="bg-emerald-900 rounded-3xl text-white p-6 shadow-sm border border-emerald-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-xs text-emerald-300 font-mono">Lembar Kegiatan Harian</span>
              <h3 className="text-xl font-bold font-sans mt-0.5">Jurnal Ibadah & Amalan Sunnah Santri</h3>
              <p className="text-xs text-emerald-200 mt-1 max-w-xl">
                Amalkan dengan ikhlas, istiqomahkan setiap hari, dan laporkan kejujuran perkembangan spiritualmu di hadapan pembimbing.
              </p>
            </div>
            <div className="bg-emerald-800/80 px-4 py-2.5 rounded-2xl border border-emerald-700 text-xs font-mono">
              Tanggal Pelaporan: {todayJurnal.tanggal}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Checklist Sholat Jamaah */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-amber-500" />
                    Sholat Berjamaah 5 Waktu
                  </h4>
                  <span className="text-xxs bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded border border-emerald-100">Wajib Jamaah</span>
                </div>

                <div className="space-y-2.5">
                  {(Object.keys(todayJurnal.sholatBerjamaah) as Array<'subuh' | 'dhuhur' | 'ashar' | 'maghrib' | 'isya'>).map(waktu => {
                    const done = todayJurnal.sholatBerjamaah[waktu];
                    return (
                      <button
                        key={waktu}
                        id={`sholat-btn-${waktu}`}
                        onClick={() => toggleSholat(waktu)}
                        className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                          done
                            ? 'bg-emerald-55/65 border-emerald-150 text-emerald-900 font-semibold'
                            : 'bg-slate-50/50 hover:bg-slate-50 border-slate-100 text-slate-650'
                        }`}
                      >
                        <span className="capitalize text-xs font-medium">Shubuh {waktu === 'subuh' ? ' (Ba\'da Azan)' : waktu}</span>
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border font-sans text-xxs font-bold select-none ${
                          done ? 'bg-emerald-600 border-emerald-700 text-white' : 'border-slate-350 bg-white text-transparent'
                        }`}>
                          ✔
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="text-xxs text-slate-450 italic mt-4">
                *Ketuk tiap kotak sholat jika Anda telah menunaikan sholat wajib berjamaah di masjid.
              </div>
            </div>

            {/* Checklist Dzikir & Amalan Sunnah */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-indigo-500" />
                  Dzikir & Amalan Sunnah
                </h4>
                <span className="text-xxs bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded border border-indigo-100">Sunnah Muakkad</span>
              </div>

              <div className="space-y-3">
                {[
                  { field: 'dzikirPagi', label: 'Dzikir Pagi Ma\'tsurat', icon: '☀️' },
                  { field: 'dzikirPetang', label: 'Dzikir Petang Ma\'tsurat', icon: '🌙' },
                  { field: 'sholatTahajud', label: 'Sholat Qiyamul Lail (Tahajud)', icon: '✨' },
                  { field: 'sholatDhuha', label: 'Sholat Sunnah Dhuha', icon: '🌅' },
                ].map(item => {
                  const done = todayJurnal[item.field as 'dzikirPagi' | 'dzikirPetang' | 'sholatTahajud' | 'sholatDhuha'];
                  return (
                    <button
                      key={item.field}
                      id={`checklist-btn-${item.field}`}
                      onClick={() => toggleChecklist(item.field as any)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                        done
                          ? 'bg-indigo-50/50 border-indigo-200 text-indigo-900 font-semibold'
                          : 'bg-slate-50/50 hover:bg-slate-100 border-slate-100 text-slate-650'
                      }`}
                    >
                      <span className="text-xs font-medium flex items-center gap-2">
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </span>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border font-sans text-xxs font-bold select-none ${
                        done ? 'bg-indigo-600 border-indigo-700 text-white' : 'border-slate-350 bg-white text-transparent'
                      }`}>
                        ✔
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tilawah Tracking & Puasa Sunnah */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
              {/* Tilawah tracker */}
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                    📖 Tilawah Harian (Lembar)
                  </h4>
                </div>
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center">
                  <span className="text-xxs font-semibold text-slate-400 block mb-1">Halaman Terbaca</span>
                  <div className="text-3xl font-bold text-emerald-800 font-sans tracking-tight mb-3">
                    {todayJurnal.tilawahLembar} <span className="text-xs font-semibold text-slate-500">Lembar</span>
                  </div>
                  <div className="flex justify-center space-x-2">
                    <button
                      id="tilawah-minus"
                      onClick={() => updateTilawah(-1)}
                      className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 p-2 rounded-xl text-xs font-bold w-10 h-10 transition-all select-none"
                    >
                      -1
                    </button>
                    <button
                      id="tilawah-plus"
                      onClick={() => updateTilawah(1)}
                      className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 p-2 rounded-xl text-xs font-bold w-10 h-10 transition-all select-none"
                    >
                      +1
                    </button>
                    <button
                      id="tilawah-plus-5"
                      onClick={() => updateTilawah(5)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl text-xs font-bold px-4 h-10 transition-all inline-flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> +5 Lembar
                    </button>
                  </div>
                </div>
              </div>

              {/* Puasa Sunnah dropdown */}
              <div>
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                    ⭐ Puasa Sunnah
                  </h4>
                </div>
                <select
                  id="puasa-sunnah-select"
                  value={todayJurnal.puasaSunnah}
                  onChange={(e) => updatePuasa(e.target.value as any)}
                  className="w-full text-xs border border-slate-200 rounded-xl px-3 py-2.5 outline-none focus:ring-1 focus:ring-emerald-555 focus:border-emerald-555 bg-white"
                >
                  <option value="Tidak Puasa">Tidak Puasa / Hari Biasa</option>
                  <option value="Puasa Senin">Puasa Sunnah Senin</option>
                  <option value="Puasa Kamis">Puasa Sunnah Kamis</option>
                  <option value="Puasa Daud">Puasa Daud</option>
                  <option value="Puasa Ayyamul Bidh">Puasa Ayyamul Bidh (13,14,15 Hijriah)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab C: Akademik */}
      {activeTab === 'akademik' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Jadwal Diniyah & Jadwal Ngaji */}
          <div className="lg:col-span-2 space-y-6">
            {/* Jadwal Pelajaran Diniyah */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Book className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-slate-800 text-sm">Jadwal Pelajaran Madrasah Diniyah (MDT)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-450 uppercase font-bold tracking-wider">
                      <th className="py-2.5">Hari</th>
                      <th className="py-2.5">Jam</th>
                      <th className="py-2.5">Mata Pelajaran</th>
                      <th className="py-2.5">Ustadz Penyampai</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 font-medium">
                    {jadwalPelajaranList.map(j => (
                      <tr key={j.id} className="hover:bg-slate-50/50">
                        <td className="py-3 font-semibold text-emerald-800">{j.hari}</td>
                        <td className="py-3 font-mono text-slate-500">{j.jam}</td>
                        <td className="py-3 text-slate-800">{j.mataPelajaran}</td>
                        <td className="py-3 text-slate-500">{j.ustadz}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Jadwal Halaqah Mengaji */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-teal-700" />
                <h3 className="font-bold text-slate-800 text-sm">Jadwal Pengajian Kitab & Halaqah Quran</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {jadwalNgajiList.map(j => (
                  <div key={j.id} className="p-3.5 rounded-2xl border border-slate-100 hover:border-slate-150 transition-all bg-slate-50/40">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xxs font-mono text-slate-450 bg-slate-100 px-2 py-0.5 rounded">
                        {j.hari}
                      </span>
                      <span className="text-xxs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                        {j.jam}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm mt-2">{j.kitab}</h4>
                    <p className="text-xxs text-slate-520 mt-1">Pembimbing: {j.ustadz}</p>
                    <div className="text-xxs font-mono text-slate-400 mt-2 flex items-center gap-1">
                      <span>📍 Lokasi:</span> {j.lokasi}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Grades and Kitab kuning */}
          <div className="space-y-6">
            {/* Nilai Ujian */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-3.5">
                <Award className="w-5 h-5 text-indigo-700" />
                <h3 className="font-bold text-slate-800 text-sm">Nilai Hasil Ujian</h3>
              </div>
              <div className="space-y-2.5">
                {filteredNilai.map(n => (
                  <div key={n.id} className="p-3 rounded-2xl border border-slate-100 bg-slate-50/20 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs">{n.mataPelajaran}</h4>
                      <div className="text-xxs text-slate-450 mt-1">Jenis: {n.tipeUjian} &bull; {n.catatan}</div>
                    </div>
                    <div className="text-center shrink-0">
                      <span className={`block w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm border font-mono ${
                        n.nilai >= 85
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-150'
                          : 'bg-indigo-50 text-indigo-800 border-indigo-150'
                      }`}>
                        {n.nilai}
                      </span>
                    </div>
                  </div>
                ))}
                {filteredNilai.length === 0 && (
                  <p className="text-xs text-slate-450 text-center py-4">Belum ada nilai ujian terbit.</p>
                )}
              </div>
            </div>

            {/* Materi Kitab Kuning pegangan */}
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-5 h-5 text-amber-700" />
                <h3 className="font-bold text-slate-800 text-sm">Materi Kitab Yang Dipelajari</h3>
              </div>
              <div className="space-y-3.5">
                {materiKitabList.map(k => (
                  <div key={k.id} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <h4 className="font-semibold text-slate-800 text-xs">{k.judul}</h4>
                    <p className="text-xxs font-mono text-slate-450">{k.pengarang}</p>
                    <p className="text-xxxs text-slate-500 mt-1 lines-clamp-2">{k.deskripsi}</p>
                    <div className="mt-1.5 flex items-center justify-between text-xxs bg-amber-50 text-amber-900 border border-amber-100 p-1.5 rounded-lg">
                      <span>Bab Saat Ini:</span>
                      <strong className="font-semibold">{k.babAktif}</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab D: Notifications & Ticker */}
      {activeTab === 'notif' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notifications List */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Bell className="w-4 h-4 text-emerald-600" />
              Notifikasi Akun Santri
            </h3>
            {notifikasiList.map(n => (
              <div
                key={n.id}
                className={`p-4 rounded-3xl border transition-all ${
                  !n.isRead
                    ? 'bg-emerald-50/30 border-emerald-150'
                    : 'bg-white border-slate-100'
                }`}
              >
                <div className="flex justify-between items-start gap-2 mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className={`block w-2.5 h-2.5 rounded-full ${
                      !n.isRead ? 'bg-emerald-600' : 'bg-slate-300'
                    }`} />
                    <h4 className="font-bold text-slate-800 text-sm">{n.title}</h4>
                  </div>
                  <span className="text-xxs font-mono text-slate-400 shrink-0">{n.date}</span>
                </div>
                <p className="text-xs text-slate-600 ml-4.5">{n.content}</p>
              </div>
            ))}
          </div>

          {/* Announcements block (Pengumuman murni pondok) */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-emerald-600" />
              Pengumuman Pondok Pesantren
            </h3>
            {pengumumanList.map(p => (
              <div key={p.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-3 hover:border-slate-200 transition-all">
                <div className="flex justify-between items-center">
                  <span className={`text-xxs font-bold px-2 py-0.5 rounded ${
                    p.prioritas === 'Tinggi'
                      ? 'bg-rose-50 text-rose-800 border border-rose-100'
                      : 'bg-slate-100 text-slate-800'
                  }`}>
                    Penting: {p.prioritas}
                  </span>
                  <span className="text-xxs font-mono text-slate-400">{p.tanggal}</span>
                </div>
                <h4 className="font-bold text-slate-800 text-xs">{p.judul}</h4>
                <p className="text-xxs text-slate-600 leading-relaxed">{p.konten}</p>
                <div className="pt-2 border-t border-slate-50 text-right text-xxxs text-slate-450 uppercase font-semibold">
                  Humas: {p.penerbit}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
