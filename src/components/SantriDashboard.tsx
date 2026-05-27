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
  ListFilter,
  Star,
  Sparkles
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
  const [activeTab, setActiveTab] = useState<'hafalan' | 'tpa' | 'notif'>('hafalan');

  // Dynamic study calculation based on Ustadz grades
  const baseSubjects = [
    { 
      studi: 'Membaca Al-Qur\'an & Kaidah Ghorib Tajwid', 
      nilai: 92, 
      predikat: 'Mumtaz (Istimewa)', 
      deskripsi: 'Sangat fasih melafalkan ayat Al-Qur’an serta menerapkan hukum nun mati dan mim mati dengan hukum makhraj yang kokoh.',
      color: 'emerald'
    },
    { 
      studi: 'Hafalan Surat Pendek / Juz \'Amma', 
      nilai: 88, 
      predikat: 'Jayyid Jiddan (Sangat Baik)', 
      deskripsi: 'Kelancaran hafalan sangat baik dari surat An-Nas s.d At-Takatsur tanpa terbata-bata.',
      color: 'teal'
    },
    { 
      studi: 'Doa-Doa Pilihan & Adab Harian Santri', 
      nilai: 95, 
      predikat: 'Mumtaz (Istimewa)', 
      deskripsi: 'Sanggup melafalkan doa-doa harian lengkap dengan adab keluar masuk masjid, makan, dan berbakti kepada orang tua.',
      color: 'amber'
    },
    { 
      studi: 'Praktik Gerakan Wudhu & Shalat Fardhu', 
      nilai: 90, 
      predikat: 'Mumtaz (Istimewa)', 
      deskripsi: 'Sempurna mempraktikkan rukun fi`liyah shalat serta tertib meratakan air wudhu sesuai rukun syar’i.',
      color: 'indigo'
    },
    { 
      studi: 'Dinul Islam (Aqidah Tauhid & Siroh Nabawiyah)', 
      nilai: 85, 
      predikat: 'Jayyid (Baik)', 
      deskripsi: 'Memiliki wawasan yang mantap mengenai silsilah keluarga Nabi Muhammad SAW dan dasar kesopanan akhlaqul karimah.',
      color: 'blue'
    }
  ];

  // Helper to compute predicate string based on score
  const getPredikatLabel = (score: number) => {
    if (score >= 90) return 'Mumtaz (Sangat Baik)';
    if (score >= 80) return 'Jayyid Jiddan (Sangat Baik)';
    if (score >= 70) return 'Jayyid (Baik)';
    if (score >= 60) return 'Maqbul (Cukup)';
    return 'Dhoif (Perlu Mengulang)';
  };

  const studentGrades = nilaiUjianList.filter(n => n.santriId === santri.id);

  const compiledSubjects = baseSubjects.map(base => {
    // Look for exact or partial name match in studentGrades
    const matchedGrade = studentGrades.find(g => 
      g.mataPelajaran.toLowerCase() === base.studi.toLowerCase() ||
      base.studi.toLowerCase().includes(g.mataPelajaran.toLowerCase()) ||
      g.mataPelajaran.toLowerCase().includes(base.studi.toLowerCase())
    );

    if (matchedGrade) {
      return {
        ...base,
        nilai: matchedGrade.nilai,
        predikat: getPredikatLabel(matchedGrade.nilai),
        deskripsi: matchedGrade.catatan || base.deskripsi,
        fromUstadz: true,
        tipeUjian: matchedGrade.tipeUjian
      };
    }
    return base;
  });

  // Now, find any studentGrades whose subjects were NOT matched with the base templates, 
  // and append them as secondary studies!
  studentGrades.forEach(g => {
    const isAlreadyMatched = baseSubjects.some(base => 
      g.mataPelajaran.toLowerCase() === base.studi.toLowerCase() ||
      base.studi.toLowerCase().includes(g.mataPelajaran.toLowerCase()) ||
      g.mataPelajaran.toLowerCase().includes(base.studi.toLowerCase())
    );

    if (!isAlreadyMatched) {
      compiledSubjects.push({
        studi: g.mataPelajaran,
        nilai: g.nilai,
        predikat: getPredikatLabel(g.nilai),
        deskripsi: g.catatan || 'Evaluasi hasil belajar tambahan disahkan oleh Ustadz pengampu.',
        color: 'indigo',
        fromUstadz: true,
        tipeUjian: g.tipeUjian
      } as any);
    }
  });

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
          id="santri-tab-tpa"
          onClick={() => setActiveTab('tpa')}
          className={`flex-1 py-2 text-center rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'tpa'
              ? 'bg-white text-emerald-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Hasil Belajar TPA
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
        <div className="max-w-4xl mx-auto space-y-6">
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
        )}

      {/* Tab B: Hasil Belajar Taman Pendidikan Al Qur'an (TPA) */}
      {activeTab === 'tpa' && (
        <div className="space-y-6 animate-fade-in">
          {/* TPA Welcome Banner */}
          <div className="bg-gradient-to-r from-emerald-800 to-teal-850 rounded-3xl text-white p-6 shadow-sm border border-emerald-700/35 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-[10px] font-bold text-amber-300 font-mono tracking-widest uppercase bg-emerald-900/60 px-2.5 py-1 rounded-full border border-emerald-600/30">Laporan Perkembangan Santri</span>
              <h3 className="text-xl font-bold font-sans mt-2.5 tracking-wide">Hasil Belajar Taman Pendidikan Al-Qur'an (TPA)</h3>
              <p className="text-xs text-slate-100 mt-1 max-w-2xl leading-normal font-medium">
                Sistematisasi perkembangan kompetensi membaca Al-Qur'an tartil jilid, kelancaran hafalan juz 'amma, hafalan doa harian beserta adab islamiyah, dan pembiasaan shalat.
              </p>
            </div>
            <div className="bg-emerald-900/40 shrink-0 px-4 py-3 rounded-2xl border border-emerald-500/20 text-right z-10">
              <div className="text-[10px] font-mono text-emerald-300 font-semibold uppercase">TAHUN AJARAN / SEMESTER</div>
              <div className="text-xs font-bold text-amber-300">2025/2026 &bull; Genap</div>
            </div>
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left & Middle: Rapor Capaian & Buku Kendali Jilid */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Rapor Nilai Akademik TPA/TPQ */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-500" />
                    <h3 className="font-bold text-slate-800 text-sm">Lembar Penilaian Keagamaan & Kompetensi TPA</h3>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 font-mono">Batas Lulus (KKM): 75</span>
                </div>

                <div className="space-y-4">
                  {compiledSubjects.map((sub: any, idx) => {
                    const barWidth = `${sub.nilai}%`;
                    return (
                      <div key={idx} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/25 hover:border-emerald-100 transition-all text-slate-800">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1.5 mb-2.5">
                          <div>
                            <h4 className="font-bold text-slate-800 text-xs sm:text-sm">{sub.studi}</h4>
                            <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                              <span className="text-[9px] font-bold text-slate-400 font-mono tracking-wider uppercase">Bidang Evaluasi TPQ</span>
                              {sub.fromUstadz && (
                                <span className="text-[8px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded-md border border-emerald-200">
                                  Official &bull; {sub.tipeUjian || 'Penilaian'}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xxs font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-lg">{sub.predikat}</span>
                            <span className="bg-emerald-600 text-white font-mono font-bold text-xs px-2.5 py-1 rounded-xl">{sub.nilai}</span>
                          </div>
                        </div>

                        {/* Custom visual progress bar */}
                        <div className="w-full bg-slate-150 h-2 rounded-full overflow-hidden mb-2">
                          <div 
                            className="bg-emerald-600 h-full rounded-full transition-all duration-550"
                            style={{ width: barWidth }}
                          />
                        </div>
                        <p className="text-xxs text-slate-650 font-medium leading-relaxed italic">{sub.deskripsi}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Buku Perkembangan Bacaan Jilid Harian */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-1.5">
                  <CheckSquare className="w-5 h-5 text-emerald-600" />
                  <h3 className="font-bold text-slate-800 text-sm">Riwayat Buku Kendali Jilid & Tartil TPA</h3>
                </div>
                <p className="text-xxs text-slate-450 mb-4 leading-normal">Data bimbingan individual mingguan, verifikasi penyematan kenaikan halaman iqra / Al-Qur'an oleh ustadz pengampu TPA.</p>
                
                {penilaianJilidList.filter(pj => pj.santriId === santri.id).length === 0 ? (
                  <div className="text-center py-8 text-slate-400 text-xs italic">Belum ada riwayat bimbingan berkas jilid/Al-Qur'an tercatat pada profil Anda.</div>
                ) : (
                  <div className="space-y-4">
                    {penilaianJilidList.filter(pj => pj.santriId === santri.id).map(pj => (
                      <div key={pj.id} className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all bg-slate-50/30">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <span className="text-xxs font-bold text-emerald-900 bg-emerald-50 border border-emerald-150 px-2.5 py-0.5 rounded-lg self-start uppercase tracking-wide">
                            {pj.tingkat}
                          </span>
                          <span className="text-xxxs font-mono text-slate-400">{pj.tanggal}</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 border-b border-dashed border-slate-200 pb-2 bg-white/50 p-3 rounded-xl">
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
                            <span className="font-semibold text-slate-705">{pj.hafalanFasholatan}</span>
                          </div>
                        </div>

                        <div className="p-2.5 bg-amber-50/20 rounded-xl text-xxs text-slate-650 border border-amber-200/40 flex items-start gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-amber-650 shrink-0 mt-0.5" />
                          <div>
                            <strong>Catatan Koreksi Guru TPA:</strong> {pj.catatan}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: TPA Statistics & Self Learner Planner */}
            <div className="space-y-6">
              {/* TPA Summary statistics badges */}
              <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                <h3 className="font-bold text-slate-800 text-sm mb-4 flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  Rangkuman Sikap & Keaktifan
                </h3>
                <div className="space-y-3.5">
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-emerald-50/35 border border-emerald-100">
                    <span className="text-xxs font-medium text-slate-650">Kerajinan Belajar</span>
                    <span className="text-xs font-bold text-emerald-800 font-mono">Mumtaz (Sangat Rajin)</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-teal-50/35 border border-teal-100">
                    <span className="text-xxs font-medium text-slate-650">Adab & Sopan Santun</span>
                    <span className="text-xs font-bold text-teal-805 font-mono">Mumtaz (Sangat Sopan)</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-indigo-50/35 border border-indigo-100">
                    <span className="text-xxs font-medium text-slate-650">Kerapian & Ketertiban</span>
                    <span className="text-xs font-bold text-indigo-808 font-mono">Jayyid Jiddan (Sesuai Syariat)</span>
                  </div>
                  <div className="flex justify-between items-center p-2.5 rounded-xl bg-amber-50/35 border border-amber-100">
                    <span className="text-xxs font-medium text-slate-650">Kehadiran Kelas TPA</span>
                    <span className="text-xs font-bold text-amber-805 font-mono">{santri.kehadiranPercent}%</span>
                  </div>
                </div>
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
