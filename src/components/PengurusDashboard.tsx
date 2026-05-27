import React, { useState, useEffect } from 'react';
import GoogleSheetsSync from './GoogleSheetsSync';
import {
  Santri,
  SetoranHafalan,
  TagihanSPP,
  KeuanganPondok,
  Perizinan,
  JadwalPelajaran,
  Ustadz,
  PenilaianJilid,
  NilaiUjian,
  MateriKitab
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
  Phone,
  Search,
  Trash2,
  Edit,
  MapPin,
  UserPlus
} from 'lucide-react';


const LEVEL_ORDER = [
  "Jilid 1",
  "Jilid 2",
  "Jilid 3",
  "Jilid 4",
  "Jilid 5",
  "Jilid 6",
  "Al-Qur'an 1",
  "Al-Qur'an 2",
  "TPQ Kelas A (Jilid 1-2)",
  "TPQ Kelas B (Jilid 3-4)",
  "TPQ Kelas C (Jilid 5-6)",
  "TPQ Kelas Al-Qur'an & Tahfidz"
];

const getNextLevel = (currentLevel: string): string => {
  const currentIndex = LEVEL_ORDER.indexOf(currentLevel);
  if (currentIndex === -1) {
    return "Jilid 1";
  }
  if (currentIndex === LEVEL_ORDER.length - 1) {
    return "Alumni / Lulus";
  }
  return LEVEL_ORDER[currentIndex + 1];
};


interface PengurusDashboardProps {
  allSantri: Santri[];
  setoranList: SetoranHafalan[];
  tagihanList: TagihanSPP[];
  keuanganList: KeuanganPondok[];
  perizinanList: Perizinan[];
  jadwalPelajaranList: JadwalPelajaran[];
  ustadzList: Ustadz[];
  penilaianJilidList: PenilaianJilid[];
  nilaiUjianList: NilaiUjian[];
  materiKitabList: MateriKitab[];
  onAddSetoran: (newSetoran: Omit<SetoranHafalan, 'id'>) => void;
  onAddKeuangan: (newKeuangan: Omit<KeuanganPondok, 'id'>) => void;
  onUpdateTagihanStatus: (tagihanId: string, status: TagihanSPP['status']) => void;
  onApprovePerizinan: (perizinanId: string, approvedBy: string, approveStatus: 'Disetujui' | 'Ditolak') => void;
  onUpdateSantriKehadiran: (santriId: string, newKehadiran: number) => void;
  onAddSantri: (newSantri: Omit<Santri, 'id' | 'kehadiranPercent' | 'catatanPelanggaran'>) => void;
  onDeleteSantri: (id: string) => void;
  onUpdateSantri: (id: string, updatedFields: Partial<Santri>) => void;
  onBulkPromote: (targetLevel: string, nextLevel: string) => void;
  onAddUstadz: (newUstadz: Omit<Ustadz, 'id'>) => void;
  onDeleteUstadz: (id: string) => void;
  onAddPenilaianJilid: (newPenilaian: Omit<PenilaianJilid, 'id'>) => void;
  onAddJadwalPelajaran: (newJadwal: Omit<JadwalPelajaran, 'id'>) => void;
  onDeleteJadwalPelajaran: (id: string) => void;
  onAddNilaiUjian: (newNilai: Omit<NilaiUjian, 'id'>) => void;
  onDeleteNilaiUjian: (id: string) => void;
  onAddMateriKitab: (newMateri: Omit<MateriKitab, 'id'>) => void;
  onDeleteMateriKitab: (id: string) => void;
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
  nilaiUjianList,
  materiKitabList,
  onAddSetoran,
  onAddKeuangan,
  onUpdateTagihanStatus,
  onApprovePerizinan,
  onUpdateSantriKehadiran,
  onAddSantri,
  onDeleteSantri,
  onUpdateSantri,
  onBulkPromote,
  onAddUstadz,
  onDeleteUstadz,
  onAddPenilaianJilid,
  onAddJadwalPelajaran,
  onDeleteJadwalPelajaran,
  onAddNilaiUjian,
  onDeleteNilaiUjian,
  onAddMateriKitab,
  onDeleteMateriKitab
}: PengurusDashboardProps) {

  // Schedule Form States
  const [showAddJadwalForm, setShowAddJadwalForm] = useState(false);
  const [newJadwalHari, setNewJadwalHari] = useState('Senin');
  const [newJadwalJam, setNewJadwalJam] = useState('07:30 - 09:00');
  const [newJadwalPelajaran, setNewJadwalPelajaran] = useState('');

  // Material Form States
  const [newMateriJudul, setNewMateriJudul] = useState('');
  const [newMateriPengarang, setNewMateriPengarang] = useState('');
  const [newMateriDeskripsi, setNewMateriDeskripsi] = useState('');
  const [newMateriBabAktif, setNewMateriBabAktif] = useState('');
  const [materiSuccess, setMateriSuccess] = useState('');
  const [newJadwalKelas, setNewJadwalKelas] = useState('TPQ Kelas A (Jilid 1-2)');
  const [newJadwalUstadz, setNewJadwalUstadz] = useState('Ustadz Abdul Somad, Lc.');
  // Tabs
  const [activeTab, setActiveTab] = useState<'stats' | 'santri' | 'absensi' | 'kelas' | 'ustadz' | 'sheets'>('stats');
  const [kelasSubTab, setKelasSubTab] = useState<'kurikulum' | 'jilid' | 'tahfidz' | 'akademik'>('kurikulum');

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
  const [gradeTipe, setGradeTipe] = useState<string>('Penilaian Harian');
  const [gradeStatus, setGradeStatus] = useState<string>('Sangat Lancar');
  const [gradeCatatan, setGradeCatatan] = useState<string>('');
  const [gradeSuccess, setGradeSuccess] = useState<string>('');

  // Custom states for Tahfidz setoran
  const [tahfidzSantriId, setTahfidzSantriId] = useState<string>(allSantri[0]?.id || '');
  const [tahfidzJuz, setTahfidzJuz] = useState<number>(30);
  const [tahfidzSurah, setTahfidzSurah] = useState<string>('An-Naba');
  const [tahfidzAyatMulai, setTahfidzAyatMulai] = useState<number>(1);
  const [tahfidzAyatSelesai, setTahfidzAyatSelesai] = useState<number>(40);
  const [tahfidzTipe, setTahfidzTipe] = useState<'Setoran Baru' | 'Murojaah'>('Setoran Baru');
  const [tahfidzStatus, setTahfidzStatus] = useState<SetoranHafalan['statusPenilaian']>('Sangat Lancar');
  const [tahfidzUstadz, setTahfidzUstadz] = useState<string>(ustadzList[0]?.nama || 'Ustadz M. Syakir');
  const [tahfidzCatatan, setTahfidzCatatan] = useState<string>('');
  const [tahfidzSuccess, setTahfidzSuccess] = useState<string>('');
  const [tahfidzSearch, setTahfidzSearch] = useState<string>('');
  const [tahfidzFilterJuz, setTahfidzFilterJuz] = useState<string>('Semua');

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

  // Sychronize drop selections on mount & changes
  useEffect(() => {
    if (allSantri.length > 0) {
      if (!gradeSantriId) setGradeSantriId(allSantri[0].id);
      if (!jilidSantriId) setJilidSantriId(allSantri[0].id);
      if (!tahfidzSantriId) setTahfidzSantriId(allSantri[0].id);
    }
  }, [allSantri, gradeSantriId, jilidSantriId, tahfidzSantriId]);

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
  const [newSantriKelas, setNewSantriKelas] = useState<string>('TPQ Kelas A (Jilid 1-2)');
  const [newSantriNamaWali, setNewSantriNamaWali] = useState<string>('');
  const [newSantriTeleponWali, setNewSantriTeleponWali] = useState<string>('');
  const [newSantriJuz, setNewSantriJuz] = useState<number>(30);
  const [santriSuccess, setSantriSuccess] = useState<string>('');

  // Expanded Santri Biodata States for Family Card, NIK, & NISN
  const [newSantriNoKK, setNewSantriNoKK] = useState<string>('');
  const [newSantriNisn, setNewSantriNisn] = useState<string>('');
  const [newSantriNik, setNewSantriNik] = useState<string>('');
  const [newSantriTempatLahir, setNewSantriTempatLahir] = useState<string>('');
  const [newSantriTanggalLahir, setNewSantriTanggalLahir] = useState<string>('');
  const [newSantriJenisKelamin, setNewSantriJenisKelamin] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [newSantriAlamatKK, setNewSantriAlamatKK] = useState<string>('');
  const [newSantriNamaAyah, setNewSantriNamaAyah] = useState<string>('');
  const [newSantriNamaIbu, setNewSantriNamaIbu] = useState<string>('');

  const [manajemenSearch, setManajemenSearch] = useState<string>('');
  const [editingSantri, setEditingSantri] = useState<Santri | null>(null);
  const [showFormModal, setShowFormModal] = useState<boolean>(false);
  const [expandedSantriId, setExpandedSantriId] = useState<string | null>(null);

  // Bulk levels promotion states
  const [bulkSrcLevel, setBulkSrcLevel] = useState<string>('');
  const [bulkDestLevel, setBulkDestLevel] = useState<string>('');

  // Tambah Ustadz Form States
  const [newUstNama, setNewUstNama] = useState<string>('');
  const [newUstNip, setNewUstNip] = useState<string>('');
  const [newUstSertifikasi, setNewUstSertifikasi] = useState<string>('');
  const [newUstBidang, setNewUstBidang] = useState<string>('');
  const [newUstNoHp, setNewUstNoHp] = useState<string>('');
  const [newUstTanggal, setNewUstTanggal] = useState<string>(new Date().toISOString().split('T')[0]);
  const [ustadzSuccess, setUstadzSuccess] = useState<string>('');

  // Custom confirmation dialog states
  const [deleteConfirmUst, setDeleteConfirmUst] = useState<Ustadz | null>(null);
  const [deleteConfirmSantri, setDeleteConfirmSantri] = useState<Santri | null>(null);
  const [promoteConfirmSantri, setPromoteConfirmSantri] = useState<{ santri: Santri; currentLevel: string; nextLevel: string } | null>(null);
  const [bulkPromoteConfirm, setBulkPromoteConfirm] = useState<{ srcLevel: string; destLevel: string; count: number } | null>(null);

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

  // Grade form submission for TPQ Academic Appraisal
  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalMataPelajaran = gradeSurah || (materiKitabList[0]?.judul || 'Membaca Al-Qur\'an & Kaidah Ghorib Tajwid');

    // Map string values to NilaiUjian limits
    const mappedTipeUjian = (val: string): 'PTS' | 'PAS' | 'Ujian Bulanan' => {
      if (val === 'Ujian Tengah Semester' || val === 'PTS') return 'PTS';
      if (val === 'Ujian Akhir Semester' || val === 'PAS') return 'PAS';
      return 'Ujian Bulanan';
    };

    const calculatedAvgNilai = Math.min(100, Math.max(0, Math.round((Number(gradeAyatMulai) + Number(gradeAyatSelesai)) / 2)));

    onAddNilaiUjian({
      santriId: gradeSantriId,
      mataPelajaran: finalMataPelajaran,
      nilai: calculatedAvgNilai,
      tipeUjian: mappedTipeUjian(gradeTipe),
      catatan: `Nilai Tugas: ${gradeAyatMulai}, Nilai Ujian: ${gradeAyatSelesai}. Predikat: ${gradeStatus}. ${gradeCatatan || 'Lulus evaluasi mata pelajaran.'}`
    });

    const targetSubjectName = finalMataPelajaran;
    setGradeCatatan('');
    setGradeSuccess(`Berhasil mengesahkan nilai mata pelajaran [${targetSubjectName}] untuk santri ${allSantri.find(s => s.id === gradeSantriId)?.nama}!`);
    setTimeout(() => setGradeSuccess(''), 4000);
  };

  const handleMateriSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMateriJudul.trim()) return;
    onAddMateriKitab({
      judul: newMateriJudul,
      pengarang: newMateriPengarang || 'Komisi Akademik TPQ',
      deskripsi: newMateriDeskripsi || 'materi pelajaran harian dasar',
      babAktif: newMateriBabAktif || 'Bab 1'
    });
    setNewMateriJudul('');
    setNewMateriPengarang('');
    setNewMateriDeskripsi('');
    setNewMateriBabAktif('');
    setMateriSuccess(`Berhasil menambahkan materi: "${newMateriJudul}"`);
    setTimeout(() => setMateriSuccess(''), 4000);
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

  const handleTahfidzSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSantriId = tahfidzSantriId || allSantri[0]?.id;
    if (!finalSantriId) return;

    onAddSetoran({
      santriId: finalSantriId,
      tanggal: new Date().toISOString().split('T')[0],
      juz: Number(tahfidzJuz),
      surah: tahfidzSurah,
      ayatMulai: Number(tahfidzAyatMulai),
      ayatSelesai: Number(tahfidzAyatSelesai),
      tipe: tahfidzTipe,
      statusPenilaian: tahfidzStatus,
      ustadzPenguji: tahfidzUstadz,
      catatan: tahfidzCatatan || 'Lancar menyetorkan hafalan.'
    });

    const targetStudentName = allSantri.find(s => s.id === finalSantriId)?.nama || 'Santri';
    setTahfidzCatatan('');
    setTahfidzSuccess(`Alhamdulillah! Berhasil mengesahkan hafalan Juz ${tahfidzJuz} (${tahfidzSurah} ayat ${tahfidzAyatMulai}-${tahfidzAyatSelesai}) untuk santri ${targetStudentName}.`);
    setTimeout(() => setTahfidzSuccess(''), 4000);
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

  const handleJadwalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJadwalPelajaran.trim()) return;
    onAddJadwalPelajaran({
      hari: newJadwalHari,
      jam: newJadwalJam,
      mataPelajaran: newJadwalPelajaran,
      kelas: newJadwalKelas,
      ustadz: newJadwalUstadz
    });
    setNewJadwalPelajaran('');
    setShowAddJadwalForm(false);
    setGradeSuccess(`Alhamdulillah! Jadwal pelajaran baru berhasil dibuat.`);
    setTimeout(() => setGradeSuccess(''), 4000);
  };

  // Expanded state initiators for complete Santri Management
  const handleStartEditSantri = (s: Santri) => {
    setEditingSantri(s);
    setNewSantriNama(s.nama);
    setNewSantriNis(s.nis);
    setNewSantriKelas(s.kelas);
    setNewSantriNamaWali(s.namaWali);
    setNewSantriTeleponWali(s.teleponWali);
    setNewSantriJuz(s.juzTerakhir);
    setNewSantriNoKK(s.noKK || '');
    setNewSantriNisn(s.nisn || '');
    setNewSantriNik(s.nik || '');
    setNewSantriTempatLahir(s.tempatLahir || '');
    setNewSantriTanggalLahir(s.tanggalLahir || '');
    setNewSantriJenisKelamin(s.jenisKelamin || 'Laki-laki');
    setNewSantriAlamatKK(s.alamatKK || '');
    setNewSantriNamaAyah(s.namaAyahKandung || '');
    setNewSantriNamaIbu(s.namaIbuKandung || '');
    setShowFormModal(true);
  };

  const handleStartAddNewSantri = () => {
    setEditingSantri(null);
    setNewSantriNama('');
    setNewSantriNis('');
    setNewSantriKelas('Kelas 1 Awaliyah');
    setNewSantriNamaWali('');
    setNewSantriTeleponWali('');
    setNewSantriJuz(30);
    setNewSantriNoKK('');
    setNewSantriNisn('');
    setNewSantriNik('');
    setNewSantriTempatLahir('');
    setNewSantriTanggalLahir('');
    setNewSantriJenisKelamin('Laki-laki');
    setNewSantriAlamatKK('');
    setNewSantriNamaAyah('');
    setNewSantriNamaIbu('');
    setShowFormModal(true);
  };

  // Handle adding or updating student submission with Full KK details, NIK, NIS, & NISN
  const handleSantriSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSantriNama.trim() || !newSantriNis.trim() || !newSantriNamaWali.trim()) return;

    const payload = {
      nama: newSantriNama,
      nis: newSantriNis,
      kelas: newSantriKelas,
      namaWali: newSantriNamaWali,
      teleponWali: newSantriTeleponWali || '081234567890',
      juzTerakhir: Number(newSantriJuz),
      noKK: newSantriNoKK || undefined,
      nisn: newSantriNisn || undefined,
      nik: newSantriNik || undefined,
      tempatLahir: newSantriTempatLahir || undefined,
      tanggalLahir: newSantriTanggalLahir || undefined,
      jenisKelamin: newSantriJenisKelamin,
      alamatKK: newSantriAlamatKK || undefined,
      namaAyahKandung: newSantriNamaAyah || undefined,
      namaIbuKandung: newSantriNamaIbu || undefined,
    };

    if (editingSantri) {
      onUpdateSantri(editingSantri.id, payload);
      setSantriSuccess(`Alhamdulillah! Biodata santri [${newSantriNama}] berhasil diperbarui.`);
    } else {
      onAddSantri(payload);
      setSantriSuccess(`Alhamdulillah! Santri baru [${newSantriNama}] berhasil didaftarkan di kelas ${newSantriKelas}.`);
    }

    // Reset fields
    setNewSantriNama('');
    setNewSantriNis('');
    setNewSantriKelas('Kelas 1 Awaliyah');
    setNewSantriNamaWali('');
    setNewSantriTeleponWali('');
    setNewSantriJuz(30);
    setNewSantriNoKK('');
    setNewSantriNisn('');
    setNewSantriNik('');
    setNewSantriTempatLahir('');
    setNewSantriTanggalLahir('');
    setNewSantriJenisKelamin('Laki-laki');
    setNewSantriAlamatKK('');
    setNewSantriNamaAyah('');
    setNewSantriNamaIbu('');
    setEditingSantri(null);
    setShowFormModal(false);

    setTimeout(() => setSantriSuccess(''), 4500);
  };

  // Handle adding ustadz submission
  const handleUstadzSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUstNama.trim() || !newUstNip.trim() || !newUstBidang.trim()) return;

    onAddUstadz({
      nama: newUstNama,
      nip: newUstNip,
      pesantrenSertifikasi: newUstSertifikasi || 'TPQ AL ASYHAR & MADIN MIFTAHUL ULUM 1',
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
      {/* ----------------- MODAL CONFIRMATIONS ----------------- */}

      {/* 1. Modal Hapus Ustadz */}
      {deleteConfirmUst && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 max-w-md w-full shadow-xl space-y-4 animate-fade-in text-slate-800">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-2xl shrink-0">
                <Trash2 className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 text-sm">Hapus Ustadz Permanen?</h3>
                <p className="text-xxs text-slate-500 leading-relaxed">
                  Apakah Anda yakin ingin menghapus <strong>{deleteConfirmUst.nama}</strong> dari daftar pengajar pondok secara permanen? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xxs font-mono text-slate-600">
              <span className="font-bold text-slate-850 block mb-0.5">{deleteConfirmUst.nama}</span>
              <span>NIP: {deleteConfirmUst.nip} &bull; Pengampu: {deleteConfirmUst.bidangKeahlian}</span>
            </div>

            <div className="flex gap-2.5 justify-end">
              <button
                onClick={() => setDeleteConfirmUst(null)}
                className="px-4 py-2 text-xxs font-bold text-slate-550 border border-slate-200 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onDeleteUstadz(deleteConfirmUst.id);
                  setDeleteConfirmUst(null);
                  setUstadzSuccess(`Alhamdulillah! Ustadz berhasil dihapus dari daftar khidmah.`);
                }}
                className="px-4 py-2 text-xxs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Ya, Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Modal Hapus Santri */}
      {deleteConfirmSantri && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 max-w-md w-full shadow-xl space-y-4 animate-fade-in text-slate-800">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-50 text-red-600 rounded-2xl shrink-0">
                <Trash2 className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 text-sm">Hapus Santri Permanen?</h3>
                <p className="text-xxs text-slate-500 leading-relaxed">
                  Apakah Anda yakin ingin menghapus santri bernama <strong>{deleteConfirmSantri.nama}</strong> dari database secara permanen?
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xxs font-mono text-slate-600">
              <span className="font-bold text-slate-850 block mb-0.5">{deleteConfirmSantri.nama}</span>
              <span>NIS: {deleteConfirmSantri.nis} &bull; Kelas: {deleteConfirmSantri.kelas}</span>
            </div>

            <div className="flex gap-2.5 justify-end">
              <button
                onClick={() => setDeleteConfirmSantri(null)}
                className="px-4 py-2 text-xxs font-bold text-slate-550 border border-slate-200 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onDeleteSantri(deleteConfirmSantri.id);
                  setDeleteConfirmSantri(null);
                  setSantriSuccess(`Alhamdulillah! Santri berhasil dihapus secara permanen.`);
                }}
                className="px-4 py-2 text-xxs font-bold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Ya, Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal Kenaikan Tingkat Santri Tunggal */}
      {promoteConfirmSantri && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 max-w-md w-full shadow-xl space-y-4 animate-fade-in text-slate-800">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 text-sm">Konfirmasi Kenaikan Tingkat</h3>
                <p className="text-xxs text-slate-500 leading-relaxed">
                  Apakah Anda yakin ingin menaikkan tingkat/kelas untuk santri berikut ini?
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 leading-relaxed text-xs">
              <span className="font-bold text-slate-800 block mb-1 text-sm">{promoteConfirmSantri.santri.nama}</span>
              <div className="flex items-center gap-2 mt-2 font-mono text-xxs text-slate-500">
                <span className="px-2 py-1 bg-slate-150 rounded text-slate-705">{promoteConfirmSantri.currentLevel}</span>
                <span>&rarr;</span>
                <span className="px-2 py-1 bg-emerald-100 text-emerald-800 font-bold rounded">{promoteConfirmSantri.nextLevel}</span>
              </div>
            </div>

            <div className="flex gap-2.5 justify-end">
              <button
                onClick={() => setPromoteConfirmSantri(null)}
                className="px-4 py-2 text-xxs font-bold text-slate-550 border border-slate-200 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onUpdateSantri(promoteConfirmSantri.santri.id, { kelas: promoteConfirmSantri.nextLevel });
                  setPromoteConfirmSantri(null);
                  setSantriSuccess(`Alhamdulillah! Tingkat ${promoteConfirmSantri.santri.nama} berhasil dinaikkan ke [${promoteConfirmSantri.nextLevel}].`);
                }}
                className="px-4 py-2 text-xxs font-bold text-white bg-emerald-600 hover:bg-emerald-750 active:bg-emerald-800 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Sahkan Kenaikan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Modal Kenaikan Tingkat/Kelas Massal */}
      {bulkPromoteConfirm && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-100 p-6 max-w-md w-full shadow-xl space-y-4 animate-fade-in text-slate-800">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shrink-0">
                <GraduationCap className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-800 text-sm">Konfirmasi Kenaikan Massal</h3>
                <p className="text-xxs text-slate-500 leading-relaxed">
                  Apakah Anda yakin ingin menaikkan <strong>{bulkPromoteConfirm.count} santri</strong> sekaligus dari tingkat saat ini?
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 leading-relaxed text-xs space-y-1.5">
              <div className="flex justify-between items-center text-slate-650">
                <span>Tingkat Asal:</span>
                <strong className="text-slate-800 px-2 py-0.5 rounded bg-slate-200 text-xxs font-mono">{bulkPromoteConfirm.srcLevel}</strong>
              </div>
              <div className="flex justify-between items-center text-slate-650">
                <span>Tingkat Baru:</span>
                <strong className="text-emerald-800 px-2 py-0.5 rounded bg-emerald-100 text-xxs font-mono">{bulkPromoteConfirm.destLevel}</strong>
              </div>
              <div className="flex justify-between items-center text-slate-650 pt-1.5 border-t border-slate-200">
                <span>Jumlah Santri Terdampak:</span>
                <strong className="text-slate-800 text-sm font-bold font-mono">{bulkPromoteConfirm.count} Santri</strong>
              </div>
            </div>

            <div className="flex gap-2.5 justify-end">
              <button
                onClick={() => setBulkPromoteConfirm(null)}
                className="px-4 py-2 text-xxs font-bold text-slate-550 border border-slate-200 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onBulkPromote(bulkPromoteConfirm.srcLevel, bulkPromoteConfirm.destLevel);
                  setBulkPromoteConfirm(null);
                  setBulkSrcLevel('');
                  setBulkDestLevel('');
                  setSantriSuccess(`Alhamdulillah! ${bulkPromoteConfirm.count} santri dari kelas [${bulkPromoteConfirm.srcLevel}] berhasil dinaikkan ke tingkat [${bulkPromoteConfirm.destLevel}].`);
                }}
                className="px-4 py-2 text-xxs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Sahkan Kenaikan Massal
              </button>
            </div>
          </div>
        </div>
      )}

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
            <h2 className="text-xl font-bold text-slate-800 mt-1">
              {ustadzList.some(u => u.nama === 'Ustadz Abdul Somad, Lc.') 
                ? 'Ustadz Abdul Somad, Lc.' 
                : (ustadzList[0]?.nama || 'Pengurus Utama / Kepala Madrasah')}
            </h2>
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
      <div className="flex space-x-1 p-1 bg-slate-100 rounded-xl max-w-4xl overflow-x-auto scroller-hidden">
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
          id="pengurus-tab-santri"
          onClick={() => setActiveTab('santri')}
          className={`shrink-0 flex-1 px-3 py-2 text-center rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'santri'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Manajemen Santri
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
      )}      {/* 4. Classroom Management & Appraisal */}
      {activeTab === 'kelas' && (
        <div className="space-y-6" id="kelas-and-appraisal-section">
          {/* Sub Tab Switcher with 4 premium styled buttons */}
          <div className="flex flex-wrap bg-slate-100 p-1 rounded-2xl max-w-2xl border border-slate-200">
            <button
              id="subtab-kurikulum-btn"
              onClick={() => setKelasSubTab('kurikulum')}
              className={`flex-1 py-1.5 px-3 text-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                kelasSubTab === 'kurikulum'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Kurikulum & Jadwal
            </button>
            <button
              id="subtab-jilid-btn"
              onClick={() => setKelasSubTab('jilid')}
              className={`flex-1 py-1.5 px-3 text-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                kelasSubTab === 'jilid'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Bimbingan Jilid
            </button>
            <button
              id="subtab-tahfidz-btn"
              onClick={() => setKelasSubTab('tahfidz')}
              className={`flex-1 py-1.5 px-3 text-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                kelasSubTab === 'tahfidz'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Setoran Tahfidz
            </button>
            <button
              id="subtab-akademik-btn"
              onClick={() => setKelasSubTab('akademik')}
              className={`flex-1 py-1.5 px-3 text-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                kelasSubTab === 'akademik'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Nilai Akademik
            </button>
          </div>

          {/* Subtabs rendering */}
          {kelasSubTab === 'kurikulum' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="kurikulum-management-panel">
              {/* Left Column: Materials list & Schedules List */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* 1. Materials/Materi Kitab of the Madrasah */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm pb-2 border-b border-slate-100 flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-amber-600" />
                        Kurikulum & Materi Cetak Utama TPQ Al-Asyhar
                      </span>
                      <span className="text-xxs font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg font-bold">
                        {materiKitabList.length} Materi Terdaftar
                      </span>
                    </h3>
                    <p className="text-xxs text-slate-500 mt-2">Daftar buku panduan tajwid, bacaan ghorib, kitab aqidah akhlaq, serta buku bimbingan cetak yang resmi diajarkan.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {materiKitabList.map((m) => (
                      <div key={m.id} className="p-4 rounded-3xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between hover:border-amber-300 hover:shadow-2xs transition-all">
                        <div>
                          <div className="flex justify-between items-start mb-2 gap-1">
                            <h4 className="font-bold text-amber-900 text-xs uppercase tracking-wider">{m.judul}</h4>
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteMateriKitab(m.id);
                                setMateriSuccess(`Berhasil menghapus materi "${m.judul}".`);
                                setTimeout(() => setMateriSuccess(''), 4000);
                              }}
                              className="p-1 text-slate-350 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                              title="Hapus Materi"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <span className="text-[10px] font-mono text-slate-500 block mb-2">Penyusun: {m.pengarang}</span>
                          <p className="text-xxs text-slate-600 font-medium mb-3 leading-relaxed">{m.deskripsi}</p>
                        </div>

                        <div className="text-[10px] font-mono text-slate-800 bg-amber-50/40 p-2 rounded-xl border border-amber-100 mt-2">
                          Fokus Progress: <strong>{m.babAktif}</strong>
                        </div>
                      </div>
                    ))}

                    {materiKitabList.length === 0 && (
                      <div className="col-span-2 text-center py-10 border border-dashed border-slate-200 bg-slate-50 rounded-2xl italic text-slate-400 text-xxs">
                        Belum ada materi kurikulum terdaftar. Tambahkan di form sebelah kanan.
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Scheduling Timetable (Jadwal Mengajar) */}
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
                  <div className="pb-3 border-b border-slate-100 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                        <Calendar className="w-5 h-5 text-amber-600" />
                        Jadwal Belajar Mengajar Harian TPQ & Madin
                      </h4>
                      <p className="text-xxs text-slate-450 mt-1">Siar pembagian ustadz pengampu kelas, jam belajar, dan hari tugas resmi.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddJadwalForm(!showAddJadwalForm)}
                      className="text-xxs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                    >
                      {showAddJadwalForm ? 'Sembunyikan Form' : '⚙ Kelola Sesi Jadwal'}
                    </button>
                  </div>

                  {/* Add Schedule collapsible container form */}
                  {showAddJadwalForm && (
                    <form onSubmit={handleJadwalSubmit} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 shrink-0 animate-fade-in text-slate-800">
                      <h5 className="font-bold text-xs text-slate-700 flex items-center gap-1">✍ Input Jadwal Tatap Muka Mengajar</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Hari</label>
                          <select
                            value={newJadwalHari}
                            onChange={(e) => setNewJadwalHari(e.target.value)}
                            className="w-full text-xxs border border-slate-250 rounded-lg p-2 bg-white"
                          >
                            <option value="Senin">Senin</option>
                            <option value="Selasa">Selasa</option>
                            <option value="Rabu">Rabu</option>
                            <option value="Kamis">Kamis</option>
                            <option value="Jumat">Jumat</option>
                            <option value="Sabtu">Sabtu</option>
                            <option value="Ahad">Ahad</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tingkatan / Kelas</label>
                          <select
                            value={newJadwalKelas}
                            onChange={(e) => setNewJadwalKelas(e.target.value)}
                            className="w-full text-xxs border border-slate-250 rounded-lg p-2 bg-white"
                          >
                            <option value="TPQ Kelas A (Jilid 1-2)">TPQ Kelas A (Jilid 1-2)</option>
                            <option value="TPQ Kelas B (Jilid 3-4)">TPQ Kelas B (Jilid 3-4)</option>
                            <option value="TPQ Kelas C (Jilid 5-Qur'an 1)">TPQ Kelas C (Jilid 5-Qur'an 1)</option>
                            <option value="Madin Miftahul Ulum Awaliyah">Madin Miftahul Ulum Awaliyah</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Mata Pelajaran</label>
                          <input
                            type="text"
                            placeholder="e.g. Kaidah Tajwid Praktis"
                            value={newJadwalPelajaran}
                            onChange={(e) => setNewJadwalPelajaran(e.target.value)}
                            className="w-full text-xxs border border-slate-250 rounded-lg p-2 bg-white"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Rentang Jam</label>
                          <input
                            type="text"
                            placeholder="e.g. 16:00 - 17:30"
                            value={newJadwalJam}
                            onChange={(e) => setNewJadwalJam(e.target.value)}
                            className="w-full text-xxs border border-slate-250 rounded-lg p-2 bg-white"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Ustadz Pengawas</label>
                          <select
                            value={newJadwalUstadz}
                            onChange={(e) => setNewJadwalUstadz(e.target.value)}
                            className="w-full text-xxs border border-slate-250 rounded-lg p-2 bg-white"
                          >
                            {ustadzList.map(u => (
                              <option key={u.id} value={u.nama}>{u.nama}</option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-end">
                          <button
                            type="submit"
                            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 rounded-lg text-xxs transition-all cursor-pointer shadow-xs"
                          >
                            Simpan Sesi Jadwal
                          </button>
                        </div>
                      </div>
                    </form>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                          <th className="py-2.5">Hari</th>
                          <th className="py-2.5">Kelas / Madrasah</th>
                          <th className="py-2.5">Kategori Pelajaran</th>
                          <th className="py-2.5">Jam Belajar</th>
                          <th className="py-2.5">Ustadz Pengampu</th>
                          <th className="py-2.5 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {jadwalPelajaranList.map(j => (
                          <tr key={j.id} className="hover:bg-slate-50/55 text-xxs font-medium font-sans">
                            <td className="py-2 font-bold text-amber-900">{j.hari}</td>
                            <td className="py-2 text-slate-700">{j.kelas}</td>
                            <td className="py-2">
                              <span className="bg-slate-105 text-slate-700 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide border border-slate-200">
                                {j.mataPelajaran}
                              </span>
                            </td>
                            <td className="py-2 text-slate-500 font-mono">{j.jam}</td>
                            <td className="py-2 text-slate-700">{j.ustadz}</td>
                            <td className="py-2 text-center">
                              <button
                                type="button"
                                onClick={() => onDeleteJadwalPelajaran(j.id)}
                                className="p-1 text-slate-350 hover:text-red-500 hover:bg-red-50 rounded-md transition-all cursor-pointer"
                                title="Hapus Sesi Jadwal"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                        {jadwalPelajaranList.length === 0 && (
                          <tr>
                            <td colSpan={6} className="text-center py-6 text-slate-350 italic">Belum ada sesi jadwal diinput pengurus.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column: Add Materi Form */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm sticky top-6">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 mb-1">
                    <Plus className="w-5 h-5 text-amber-600 bg-amber-50 rounded-lg p-0.5" />
                    Tambah Kurikulum Baru
                  </h4>
                  <p className="text-xxs text-slate-450 mb-4 font-medium">Sahkan kitab atau materi studi baru ke kurikulum resmi TPQ Al-Asyhar.</p>

                  {materiSuccess && (
                     <div className="bg-emerald-50 text-emerald-850 border border-emerald-200 p-3 rounded-xl mb-4 text-xxs font-bold">
                       {materiSuccess}
                     </div>
                  )}

                  <form onSubmit={handleMateriSubmit} className="space-y-4 text-slate-800">
                    <div>
                      <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Nama Materi / Kitab</label>
                      <input
                        type="text"
                        placeholder="Contoh: Bacaan Ghorib & Tajwid Praktis"
                        value={newMateriJudul}
                        onChange={(e) => setNewMateriJudul(e.target.value)}
                        className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white outline-none focus:ring-1 focus:ring-amber-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Penyusun / Pengarang</label>
                      <input
                        type="text"
                        placeholder="Contoh: Lajnah Pentashih Al-Asyhar"
                        value={newMateriPengarang}
                        onChange={(e) => setNewMateriPengarang(e.target.value)}
                        className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white outline-none focus:ring-1 focus:ring-amber-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Fokus Bab Aktif Saat Ini</label>
                      <input
                        type="text"
                        placeholder="Contoh: Bab Mad Lazim Selesai"
                        value={newMateriBabAktif}
                        onChange={(e) => setNewMateriBabAktif(e.target.value)}
                        className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white outline-none focus:ring-1 focus:ring-amber-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Cakupan Pembelajaran (Deskripsi)</label>
                      <textarea
                        rows={3}
                        placeholder="Deskripsikan garis besar kompetensi..."
                        value={newMateriDeskripsi}
                        onChange={(e) => setNewMateriDeskripsi(e.target.value)}
                        className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white outline-none focus:ring-1 focus:ring-amber-500"
                        required
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-sm block text-center cursor-pointer"
                    >
                      Sahkan Kurikulum Baru
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Subtab 2: Jilid Rendering (Bimbingan Kenaikan Jilid) */}
          {kelasSubTab === 'jilid' && (
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
                        className="text-xxs border border-slate-200 rounded-xl px-2.5 py-1.5 outline-none font-medium focus:ring-1 focus:ring-amber-500 bg-slate-50 whitespace-nowrap"
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
                          <th className="py-2.5 text-right font-bold">Catatan</th>
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
                                <td className="py-2.5 text-slate-400 italic max-w-[140px] truncate text-right font-mono" title={p.catatan}>{p.catatan}</td>
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
                    📖 Standar Kurikulum Buku Qiraah & Jilid TPQ Al Asyhar & Madin Miftahul Ulum 1
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xxs leading-relaxed">
                    <div className="space-y-2">
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-105">
                        <strong className="text-amber-805 block">Jilid 1 - Pengenalan Huruf Tunggal</strong>
                        <p className="text-slate-500 mt-0.5">Penekanan makhrojul huruf hijaiyah harakat fathah secara madzkur/pendek (tanpa mad).</p>
                        <span className="text-emerald-750 block font-bold mt-1">Hafalan Doa: Doa Sebelum Makan & Minum</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-105">
                        <strong className="text-amber-805 block">Jilid 2 - Huruf Sambung & Harakat Kasrah/Dhommah</strong>
                        <p className="text-slate-500 mt-0.5">Pelajaran huruf sambung dasar dengan variasi baris bawah dan depan lancar cepat.</p>
                        <span className="text-emerald-750 block font-bold mt-1">Hafalan Doa: Doa Sesudah Makan & Minum, Doa Masuk Kamar Mandi</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-105">
                        <strong className="text-amber-805 block">Jilid 3 - Mad, Tanwin & Huruf Panjang</strong>
                        <p className="text-slate-500 mt-0.5">Pengenalan ketukan alif-wawu-ya (mad thobi'i) serta baris dua/tanwin (fathatain, kasratain, dhommatain).</p>
                        <span className="text-emerald-750 block font-bold mt-1">Hafalan Doa: Doa Keluar Kamar Mandi, Doa Memakai Pakaian</span>
                      </div>
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-105">
                        <strong className="text-amber-805 block">Jilid 4 - Sukun/Mati & Qalqalah</strong>
                        <p className="text-slate-500 mt-0.5">Latihan ketat mematikan huruf, makhraj mampat, hukum qalqalah kubro-sughro.</p>
                        <span className="text-emerald-750 block font-bold mt-1">Hafalan Doa: Doa Keluar Rumah, Doa Masuk Masjid</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-105">
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

              {/* Right Column: form */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm sticky top-6 text-slate-800">
                  <h4 className="font-bold text-slate-802 text-sm flex items-center gap-1.5 mb-1">
                    <BookOpen className="w-5 h-5 text-amber-600 bg-amber-55 rounded-lg p-0.5" />
                    Lembar Penilaian Jilid & Al-Qur'an
                  </h4>
                  <p className="text-xxs text-slate-450 mb-4 font-medium">Input progress kenaikan halaman jilid, fasholatan & doa harian santri.</p>

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

          {/* Subtab 3: Setoran Tahfidz / Hafalan */}
          {kelasSubTab === 'tahfidz' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="tahfidz-content-panel">
              {/* Left Column: history lists & filters */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-805 text-sm flex items-center gap-1.5">
                        <Award className="w-5 h-5 text-emerald-600" />
                        Kendali Surat Setoran & Progres Tahfidz Al-Qur'an
                      </h4>
                      <p className="text-xxs text-slate-400">Arsip digital setoran hafalan surah, nomor juz, ayat, dan catatan kelancaran tahfidz santri.</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Cari santri..."
                        value={tahfidzSearch}
                        onChange={(e) => setTahfidzSearch(e.target.value)}
                        className="text-xxs border border-slate-200 rounded-xl px-2.5 py-1.5 outline-none font-medium focus:ring-1 focus:ring-amber-500 bg-slate-50"
                      />
                      <select
                        value={tahfidzFilterJuz}
                        onChange={(e) => setTahfidzFilterJuz(e.target.value)}
                        className="text-xxs border border-slate-200 rounded-xl px-2 py-1.5 outline-none font-medium bg-slate-50"
                      >
                        <option value="Semua">Semua Juz</option>
                        {Array.from({ length: 30 }, (_, i) => (
                          <option key={i + 1} value={String(i + 1)}>Juz {i + 1}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-405 font-bold text-[10px] uppercase tracking-wider">
                          <th className="py-2.5">Santri</th>
                          <th className="py-2.5">Tanggal</th>
                          <th className="py-2.5">Juz</th>
                          <th className="py-2.5">Surah & Ayat</th>
                          <th className="py-2.5">Kategori</th>
                          <th className="py-2.5 text-center">Hasil/Predikat</th>
                          <th className="py-2.5">Ustadz Penguji</th>
                          <th className="py-2.5 text-right font-mono">Catatan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {setoranList
                          .filter(s => {
                            const student = allSantri.find(st => st.id === s.santriId);
                            const nameMatches = student?.nama.toLowerCase().includes(tahfidzSearch.toLowerCase());
                            const juzMatches = tahfidzFilterJuz === 'Semua' || String(s.juz) === tahfidzFilterJuz;
                            return nameMatches && juzMatches;
                          })
                          .map((s) => {
                            const student = allSantri.find(st => st.id === s.santriId);
                            const categoryTheme = s.tipe === 'Murojaah'
                              ? 'bg-indigo-50 text-indigo-850 hover:bg-indigo-100'
                              : 'bg-emerald-50 text-emerald-850 hover:bg-emerald-100';
                            
                            const ratingTheme = {
                              'Sangat Lancar': 'bg-teal-50 text-teal-800 border-teal-200',
                              'Lancar': 'bg-emerald-50 text-emerald-800 border-emerald-150',
                              'Cukup': 'bg-amber-50 text-amber-800 border-amber-200',
                              'Perlu Mengulang': 'bg-rose-50 text-rose-800 border-rose-200'
                            }[s.statusPenilaian] || 'bg-slate-50 text-slate-600';

                            return (
                              <tr key={s.id} className="hover:bg-slate-50/50 transition-all font-sans text-xxs">
                                <td className="py-2.5 font-bold text-slate-800">{student?.nama || 'Santri'}</td>
                                <td className="py-2.5 text-slate-450 font-mono">{s.tanggal}</td>
                                <td className="py-2.5 font-bold text-slate-600">Juz {s.juz}</td>
                                <td className="py-2.5 font-bold text-slate-700">
                                  QS. {s.surah} <span className="font-mono font-medium text-slate-400">({s.ayatMulai}-{s.ayatSelesai})</span>
                                </td>
                                <td className="py-2.5">
                                  <span className={`px-1.5 py-0.5 rounded-md font-bold text-[9px] uppercase font-mono ${categoryTheme}`}>
                                    {s.tipe}
                                  </span>
                                </td>
                                <td className="py-2.5 text-center">
                                  <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold ${ratingTheme}`}>
                                    {s.statusPenilaian}
                                  </span>
                                </td>
                                <td className="py-2.5 font-medium text-slate-650">{s.ustadzPenguji.split(',')[0]}</td>
                                <td className="py-2.5 text-slate-400 italic font-medium text-right" title={s.catatan}>{s.catatan}</td>
                              </tr>
                            );
                          })}

                        {setoranList.filter(s => {
                          const student = allSantri.find(st => st.id === s.santriId);
                          const nameMatches = student?.nama.toLowerCase().includes(tahfidzSearch.toLowerCase());
                          const juzMatches = tahfidzFilterJuz === 'Semua' || String(s.juz) === tahfidzFilterJuz;
                          return nameMatches && juzMatches;
                        }).length === 0 && (
                          <tr>
                            <td colSpan={8} className="text-center py-8 text-slate-400 italic text-xxs">
                              Tidak ada rekaman setoran hafalan yang cocok.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column: Tahfidz Form Submit */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm sticky top-6 text-slate-850">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 mb-1">
                    <Award className="w-5 h-5 text-emerald-600 bg-emerald-50 rounded-lg p-0.5" />
                    Lembar Pengesahan Setoran Tahfidz
                  </h4>
                  <p className="text-xxs text-slate-450 mb-4 font-normal">Gunakan kolom ini untuk mengesahkan hafalan setoran baru secara real-time.</p>

                  {tahfidzSuccess && (
                     <div className="bg-emerald-50 text-emerald-805 border border-emerald-200 p-3 rounded-2xl mb-4 text-xxs font-bold animate-bounce whitespace-normal">
                       {tahfidzSuccess}
                     </div>
                  )}

                  <form onSubmit={handleTahfidzSubmit} className="space-y-3.5">
                    {/* Santri select */}
                    <div>
                      <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Santri Penguji</label>
                      <select
                        value={tahfidzSantriId}
                        onChange={(e) => setTahfidzSantriId(e.target.value)}
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

                    {/* Juz Selection */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Juz Al-Qur'an</label>
                        <input
                          type="number"
                          min={1}
                          max={30}
                          value={tahfidzJuz}
                          onChange={(e) => setTahfidzJuz(Number(e.target.value))}
                          className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white outline-none focus:ring-1 focus:ring-emerald-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Kategori Sesi</label>
                        <select
                          value={tahfidzTipe}
                          onChange={(e) => setTahfidzTipe(e.target.value as any)}
                          className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white"
                          required
                        >
                          <option value="Setoran Baru">Setoran Baru</option>
                          <option value="Murojaah">Murojaah (Mengulang)</option>
                        </select>
                      </div>
                    </div>

                    {/* Surah Combo Selection & verses */}
                    <div>
                      <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Nama Surah</label>
                      <select
                        value={tahfidzSurah}
                        onChange={(e) => setTahfidzSurah(e.target.value)}
                        className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white select-none"
                      >
                        {[
                          'An-Naba', 'An-Nazi\'at', 'Abasa', 'At-Takwir', 'Al-Infitar', 'Al-Mutaffifin', 'Al-Inshiqaq', 'Al-Buruj', 'At-Tariq', 'Al-A\'la', 'Al-Ghashiyah', 'Al-Fajr', 'Al-Balad', 'Ash-Shams', 'Al-Layl', 'Ad-Duha', 'Ash-Sharh', 'At-Tin', 'Al-Alaq', 'Al-Qadr', 'Al-Bayyinah', 'Az-Zalzalah', 'Al-Adiyat', 'Al-Qari\'ah', 'At-Takathur', 'Al-Asr', 'Al-Humazah', 'Al-Fil', 'Quraysh', 'Al-Ma\'un', 'Al-Kawthar', 'Al-Kafirun', 'An-Nasr', 'Al-Masad', 'Al-Ikhlas', 'Al-Falaq', 'An-Nas', 'Al-Fatihah', 'Al-Baqarah', 'Yasin', 'Al-Mulk', 'Al-Waqi\'ah', 'Ar-Rahman'
                        ].map(sur => (
                          <option key={sur} value={sur}>{sur}</option>
                        ))}
                      </select>
                    </div>

                    {/* Verses range */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Ayat Mulai</label>
                        <input
                          type="number"
                          min={1}
                          value={tahfidzAyatMulai}
                          onChange={(e) => setTahfidzAyatMulai(Number(e.target.value))}
                          className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white outline-none focus:ring-1 focus:ring-emerald-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Ayat Selesai</label>
                        <input
                          type="number"
                          min={1}
                          value={tahfidzAyatSelesai}
                          onChange={(e) => setTahfidzAyatSelesai(Number(e.target.value))}
                          className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white outline-none focus:ring-1 focus:ring-emerald-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Quality */}
                    <div>
                      <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Kualitas Kelancaran Setoran</label>
                      <select
                        value={tahfidzStatus}
                        onChange={(e) => setTahfidzStatus(e.target.value as any)}
                        className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white"
                        required
                      >
                        <option value="Sangat Lancar">Sangat Lancar (Mumtaz)</option>
                        <option value="Lancar">Lancar (Jayyid Jiddan)</option>
                        <option value="Cukup">Cukup Lancar (Jayyid)</option>
                        <option value="Perlu Mengulang">Perlu Mengulang (Maqbul/Dhoif)</option>
                      </select>
                    </div>

                    {/* Guru Select */}
                    <div>
                      <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Ustadz Penyimak</label>
                      <select
                        value={tahfidzUstadz}
                        onChange={(e) => setTahfidzUstadz(e.target.value)}
                        className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white"
                        required
                      >
                        {ustadzList.map(u => (
                          <option key={u.id} value={u.nama}>{u.nama}</option>
                        ))}
                      </select>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Catatan Evaluasi / Makhroj</label>
                      <textarea
                        rows={2}
                        placeholder="Tajwid makhraj bagus, dengung ghunnah dipertahankan..."
                        value={tahfidzCatatan}
                        onChange={(e) => setTahfidzCatatan(e.target.value)}
                        className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white outline-none focus:ring-1 focus:ring-emerald-500 resize-none h-16"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-sm block text-center cursor-pointer"
                    >
                      Sahkan Dokumen Setoran Hafalan
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Subtab 4: Nilai Ujian Akademik */}
          {kelasSubTab === 'akademik' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="akademik-content-panel">
              {/* Left Column: Grade history list */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-801 text-sm flex items-center gap-1.5">
                        <GraduationCap className="w-5 h-5 text-amber-600" />
                        Transkrip E-Rapor Akademik & Ujian Santri
                      </h4>
                      <p className="text-xxs text-slate-400">Lembar kendali hasil Penilaian Tengah Semester (PTS), Akhir Semester (PAS), dan ujian bulanan resmi.</p>
                    </div>

                    <span className="text-xxs font-mono text-slate-400 bg-slate-50 px-2.5 py-1 rounded-xl">
                      {nilaiUjianList.length} Rapor Terbit
                    </span>
                  </div>

                  <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left text-xs border-collapse font-sans">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                          <th className="py-2.5">Santri</th>
                          <th className="py-2.5">Mata Pelajaran Buku (Kitab)</th>
                          <th className="py-2.5">Sesi Ujian</th>
                          <th className="py-2.5 text-center">Skor Akhir (0-100)</th>
                          <th className="py-2.5">Keterangan Catatan</th>
                          <th className="py-2.5 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {nilaiUjianList.map((n) => {
                          const student = allSantri.find(s => s.id === n.santriId);
                          const ratingLabel = n.nilai >= 85 ? 'Istimewa' : n.nilai >= 75 ? 'Baik' : n.nilai >= 60 ? 'Cukup' : 'Kurang';
                          const ratingColor = n.nilai >= 85 ? 'text-teal-800 bg-teal-50 border border-teal-150'
                            : n.nilai >= 75 ? 'text-emerald-800 bg-emerald-50 border border-emerald-150'
                            : n.nilai >= 60 ? 'text-amber-800 bg-amber-50 border border-amber-150'
                            : 'text-rose-800 bg-rose-50 border border-rose-150';

                          return (
                            <tr key={n.id} className="hover:bg-slate-55/60 transition-all text-xxs font-medium text-slate-700">
                              <td className="py-2.5 font-bold text-slate-800">{student?.nama || 'Santri'}</td>
                              <td className="py-2.5 font-bold text-amber-900">{n.mataPelajaran}</td>
                              <td className="py-2.5">
                                <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[9px] font-mono tracking-wide font-bold uppercase">
                                  {n.tipeUjian}
                                </span>
                              </td>
                              <td className="py-2.5 text-center">
                                <span className={`px-2 py-0.5 rounded-lg font-bold font-mono ${ratingColor}`}>
                                  {n.nilai} — {ratingLabel}
                                </span>
                              </td>
                              <td className="py-2.5 text-slate-450 italic max-w-xs truncate" title={n.catatan}>{n.catatan}</td>
                              <td className="py-2.5 text-center">
                                <button
                                  type="button"
                                  onClick={() => onDeleteNilaiUjian(n.id)}
                                  className="p-1 text-slate-350 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                  title="Gugurkan Nilai Ujian"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}

                        {nilaiUjianList.length === 0 && (
                          <tr>
                            <td colSpan={6} className="text-center py-6 text-slate-400 italic text-xxs">Belum ada nilai ujian terdaftar.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column: Add Grade Form */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm sticky top-6 text-slate-800">
                  <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 mb-1">
                    <GraduationCap className="w-5 h-5 text-amber-600 bg-amber-50 rounded-lg p-0.5" />
                    Sahkan Nilai Rapor Akademik
                  </h4>
                  <p className="text-xxs text-slate-450 mb-4 font-normal">Sahkan hasil lembar ujian, mid, semester ke dalam buku rapor digital santri.</p>

                  {gradeSuccess && (
                     <div className="bg-emerald-50 text-emerald-805 border border-emerald-200 p-3 rounded-2xl mb-4 text-xxs font-bold">
                       {gradeSuccess}
                     </div>
                  )}

                  <form onSubmit={handleGradeSubmit} className="space-y-4">
                    {/* Select Student */}
                    <div>
                      <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Santri</label>
                      <select
                        value={gradeSantriId}
                        onChange={(e) => setGradeSantriId(e.target.value)}
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

                    {/* Sesi Ujian */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Tipe Sesi Ujian</label>
                        <select
                          value={gradeTipe}
                          onChange={(e) => setGradeTipe(e.target.value)}
                          className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white"
                          required
                        >
                          <option value="Ujian Tengah Semester">Mid Semester (PTS)</option>
                          <option value="Ujian Akhir Semester">Ujian Akhir (PAS)</option>
                          <option value="Ujian Bulanan">Ujian Bulanan (Imtihan)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Pelajaran Ujian</label>
                        <select
                          value={gradeSurah}
                          onChange={(e) => setGradeSurah(e.target.value)}
                          className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white"
                        >
                          <option value="">-- Pilih Buku Kitab --</option>
                          {materiKitabList.map((m) => (
                            <option key={m.id} value={m.judul}>{m.judul}</option>
                          ))}
                          <option value="Bacaan Ghorib & Musyarakat">Bacaan Ghorib & Musyarakat</option>
                          <option value="Kaidah Ghorib & Tajwid Praktis">Kaidah Ghorib & Tajwid Praktis</option>
                          <option value="Imla' Khat Arab & Tulis Menulis">Imla' Khat Arab & Tulis Menulis</option>
                        </select>
                      </div>
                    </div>

                    {/* Scores */}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Skor Tugas (0-100)</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          placeholder="e.g. 85"
                          value={gradeAyatMulai}
                          onChange={(e) => setGradeAyatMulai(Number(e.target.value))}
                          className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white outline-none focus:ring-1 focus:ring-amber-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Skor Ujian (0-100)</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          placeholder="e.g. 90"
                          value={gradeAyatSelesai}
                          onChange={(e) => setGradeAyatSelesai(Number(e.target.value))}
                          className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white outline-none focus:ring-1 focus:ring-amber-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Predikat */}
                    <div>
                      <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Hasil Kelulusan Predikat</label>
                      <select
                        value={gradeStatus}
                        onChange={(e) => setGradeStatus(e.target.value)}
                        className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white"
                        required
                      >
                        <option value="Sangat Lancar">Mumtaz (Istimewa)</option>
                        <option value="Lancar">Jayyid Jid. (Baik Sekali)</option>
                        <option value="Cukup">Jayyid (Cukup Baik)</option>
                        <option value="Perlu Mengulang">Maqbul/Dhoif (Mengulang)</option>
                      </select>
                    </div>

                    {/* Catatan Area */}
                    <div>
                      <label className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Catatan Evaluasi / Rekomendasi</label>
                      <textarea
                        rows={2}
                        placeholder="Naik ke tahap materi berikutnya, thaharah diperbaiki..."
                        value={gradeCatatan}
                        onChange={(e) => setGradeCatatan(e.target.value)}
                        className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white outline-none focus:ring-1 focus:ring-amber-500 resize-none h-16"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-sm block text-center cursor-pointer"
                    >
                      Sahkan Rapor Nilai Akademik
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
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center text-xs font-sans shrink-0">
                        {ust.nama.split(' ').filter(n => !['Ustadz','Ustadzah','KH.','KH','H.','H'].includes(n)).slice(0, 2).map(n => n[0]).join('') || 'US'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-slate-800 truncate">{ust.nama}</h4>
                        <p className="text-[10px] font-mono text-slate-400">NIP: {ust.nip}</p>
                      </div>
                      <button
                        onClick={() => {
                          setDeleteConfirmUst(ust);
                        }}
                        className="p-1.5 hover:bg-red-50 text-red-500 hover:text-red-700 rounded-xl transition-all cursor-pointer shrink-0"
                        title="Hapus Ustadz"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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

      {/* 1.5. Manajemen Santri Tab */}
      {activeTab === 'santri' && (() => {
        const filteredSantriList = allSantri.filter(s => {
          const q = manajemenSearch.toLowerCase().trim();
          if (!q) return true;
          return (
            s.nama.toLowerCase().includes(q) ||
            s.nis.toLowerCase().includes(q) ||
            (s.nisn && s.nisn.toLowerCase().includes(q)) ||
            (s.nik && s.nik.toLowerCase().includes(q)) ||
            (s.noKK && s.noKK.toLowerCase().includes(q)) ||
            s.kelas.toLowerCase().includes(q) ||
            s.namaWali.toLowerCase().includes(q)
          );
        });

        return (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </span>
                    Direktori & Manajemen Santri
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 font-normal">
                    Kelola data induk kependudukan santri, nomor kartu keluarga (KK), NISN, Wali santri, dan rekam mutasi santri TPQ & Madin.
                  </p>
                </div>
                <button
                  id="manajemen-add-santri-btn"
                  onClick={handleStartAddNewSantri}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <UserPlus className="w-4 h-4" />
                  Registrasi Santri Baru
                </button>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row gap-2 max-w-lg mb-6">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari Nama, NIS, NISN, NIK, KK, atau Wali..."
                    value={manajemenSearch}
                    onChange={(e) => setManajemenSearch(e.target.value)}
                    className="w-full text-xs pl-9 pr-4 py-2 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-amber-500 bg-white"
                  />
                </div>
                {manajemenSearch && (
                  <button
                    onClick={() => setManajemenSearch('')}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl px-3 py-2 text-xs font-semibold shrink-0 transition-all"
                  >
                    Reset
                  </button>
                )}
              </div>

              {/* Success messaging inside tab too */}
              {santriSuccess && (
                <div className="bg-emerald-50 text-emerald-800 border border-emerald-250 p-4 rounded-xl mb-6 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 bg-emerald-100 p-0.5 rounded-full" />
                  {santriSuccess}
                </div>
              )}

              {/* Fitur Kenaikan Tingkat/Kelas Massal */}
              <div className="bg-emerald-50/20 border border-emerald-100/65 rounded-3xl p-5 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <GraduationCap className="w-4.5 h-4.5" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">Kenaikan Jilid, Al-Qur'an & Kelas Massal</h4>
                    <p className="text-[10px] text-slate-500 font-normal">Naikkan tingkat seluruh Jilid, Al-Qur'an, maupun Kelas Awaliyah santri secara sekaligus.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                  <div>
                    <label htmlFor="bulk-src-selector" className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Pilih Kelas / Tingkat Asal</label>
                    <select
                      id="bulk-src-selector"
                      value={bulkSrcLevel}
                      onChange={(e) => {
                        const src = e.target.value;
                        setBulkSrcLevel(src);
                        setBulkDestLevel(getNextLevel(src));
                      }}
                      className="w-full text-xs border border-emerald-100/80 rounded-xl px-3 py-2 bg-white text-slate-800 outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="">-- Pilih Tingkat Asal --</option>
                      {LEVEL_ORDER.map(lvl => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="bulk-dest-selector" className="block text-[9px] font-bold text-slate-500 uppercase mb-1">Tingkat Tujuan Baru</label>
                    <select
                      id="bulk-dest-selector"
                      value={bulkDestLevel}
                      onChange={(e) => setBulkDestLevel(e.target.value)}
                      className="w-full text-xs border border-emerald-100/80 rounded-xl px-3 py-2 bg-white text-slate-800 outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="">-- Pilih Tingkat Tujuan --</option>
                      {LEVEL_ORDER.map(lvl => (
                        <option key={lvl} value={lvl}>{lvl}</option>
                      ))}
                      <option value="Alumni / Lulus">Alumni / Lulus</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      if (!bulkSrcLevel || !bulkDestLevel) {
                        setSantriSuccess("⚠️ Harap pilih tingkat asal dan tingkat tujuan terlebih dahulu.");
                        return;
                      }
                      const count = allSantri.filter(s => s.kelas === bulkSrcLevel).length;
                      if (count === 0) {
                        setSantriSuccess(`⚠️ Tidak ada santri yang terdaftar di tingkat [${bulkSrcLevel}].`);
                        return;
                      }
                      setBulkPromoteConfirm({ srcLevel: bulkSrcLevel, destLevel: bulkDestLevel, count });
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1 h-9 cursor-pointer"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-100" />
                    <span>Lakukan Kenaikan Massal</span>
                  </button>
                </div>
              </div>

              {/* Students grid list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSantriList.map((s) => {
                  const isExpanded = expandedSantriId === s.id;
                  return (
                    <div
                      key={s.id}
                      id={`santri-card-${s.id}`}
                      className={`bg-slate-50/50 rounded-2xl border transition-all p-5 flex flex-col justify-between ${
                        isExpanded ? 'border-amber-500 bg-amber-50/10 shadow-sm' : 'border-slate-100 hover:border-slate-205'
                      }`}
                    >
                      <div>
                        {/* Card Header Info */}
                        <div className="flex justify-between items-start">
                          <div className="flex gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-200/50 flex items-center justify-center font-bold text-amber-800 text-xs shrink-0 font-sans">
                              {s.nama.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-xs leading-snug">{s.nama}</h4>
                              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase">
                                  NIS: {s.nis}
                                </span>
                                {s.nisn && (
                                  <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold uppercase">
                                    NISN: {s.nisn}
                                  </span>
                                )}
                                <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded uppercase font-bold">
                                  {s.kelas}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Top-right performance quick gauges */}
                          <div className="text-right flex flex-col items-end shrink-0">
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                              Presensi {s.kehadiranPercent}%
                            </span>
                            <span className="text-[9px] text-slate-400 mt-1 font-mono uppercase font-bold text-right block">
                              Al-Qur'an: Juz {s.juzTerakhir}
                            </span>
                          </div>
                        </div>

                        {/* Brief Bio Preview */}
                        <div className="mt-4 grid grid-cols-2 gap-2 text-xxs border-t border-slate-100 pt-3">
                          <div>
                            <span className="text-slate-400 font-medium block uppercase tracking-wider">NIK</span>
                            <span className="font-semibold text-slate-700">{s.nik || '—'}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 font-medium block uppercase tracking-wider">Nama Wali</span>
                            <span className="font-semibold text-slate-700">{s.namaWali}</span>
                          </div>
                        </div>

                        {/* Collapsible Expanded Kartu Keluarga Detail Panel */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-slate-200/50 space-y-4 animate-fade-in text-xxs font-sans">
                            {/* Section: Catatan KK */}
                            <div className="bg-white rounded-xl p-3 border border-slate-100 space-y-2">
                              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-800 block mb-1">
                                Informasi Kartu Keluarga (KK) & Tempat Tinggal
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                  <span className="text-slate-400">Nomor Kartu Keluarga:</span>
                                  <p className="font-semibold text-slate-800 font-mono">{s.noKK || '—'}</p>
                                </div>
                                <div>
                                  <span className="text-slate-400">NIK Santri:</span>
                                  <p className="font-semibold text-slate-800 font-mono">{s.nik || '—'}</p>
                                </div>
                                <div>
                                  <span className="text-slate-400">Tempat, Tanggal Lahir:</span>
                                  <p className="font-semibold text-slate-800">
                                    {s.tempatLahir || '—'}, {s.tanggalLahir || '—'}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-slate-400">Jenis Kelamin:</span>
                                  <p className="font-semibold text-slate-800">{s.jenisKelamin || '—'}</p>
                                </div>
                              </div>
                              <div className="pt-2 border-t border-slate-50">
                                <span className="text-slate-400 flex items-center gap-0.5">
                                  <MapPin className="w-3 h-3 text-slate-400" /> Alamat KK Lengkap:
                                </span>
                                <p className="font-semibold text-slate-800 mt-0.5 leading-relaxed">{s.alamatKK || '—'}</p>
                              </div>
                            </div>

                            {/* Section: Silsilah Orang Tua Kandung */}
                            <div className="bg-white rounded-xl p-3 border border-slate-100 space-y-2">
                              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-800 block mb-1">
                                Nama Orang Tua Kandung & Wali
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                  <span className="text-slate-400">Nama Ayah Kandung:</span>
                                  <p className="font-semibold text-slate-800">{s.namaAyahKandung || '—'}</p>
                                </div>
                                <div>
                                  <span className="text-slate-400">Nama Ibu Kandung:</span>
                                  <p className="font-semibold text-slate-800">{s.namaIbuKandung || '—'}</p>
                                </div>
                                <div>
                                  <span className="text-slate-400">Nama Wali:</span>
                                  <p className="font-semibold text-slate-800">{s.namaWali}</p>
                                </div>
                                <div>
                                  <span className="text-slate-400 flex items-center gap-0.5">
                                    <Phone className="w-3 h-3 text-slate-400" /> WhatsApp Wali:
                                  </span>
                                  <p className="font-semibold text-slate-800">{s.teleponWali}</p>
                                </div>
                              </div>
                            </div>

                            {/* Section: Catatan Pelanggaran */}
                            <div className="bg-white rounded-xl p-3 border border-slate-100">
                              <span className="text-[10px] uppercase tracking-wider font-bold text-amber-800 block mb-1">
                                Rekam Kedisiplinan / Ta'zir
                              </span>
                              {s.catatanPelanggaran.length > 0 ? (
                                <ul className="list-disc pl-4 space-y-1 mt-1 text-slate-700 font-medium">
                                  {s.catatanPelanggaran.map((pel, i) => (
                                    <li key={i}>{pel}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-slate-400 italic">Belum ada catatan pelanggaran disiplin.</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Expand and Action Section */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setExpandedSantriId(isExpanded ? null : s.id)}
                          className="text-amber-800 bg-amber-50 hover:bg-amber-100 font-bold px-3 py-1.5 rounded-xl text-[10px] transition-all"
                        >
                          {isExpanded ? 'Sembunyikan Biodata KK' : 'Tampilkan Biodata Lengkap KK'}
                        </button>

                        <div className="flex items-center gap-1">
                          {/* Kenaikan Tingkat button */}
                          {(() => {
                            const currentLevel = s.kelas;
                            const nextLevel = getNextLevel(currentLevel);
                            const canPromote = nextLevel !== currentLevel;

                            return (
                              <button
                                onClick={() => {
                                  setPromoteConfirmSantri({ santri: s, currentLevel, nextLevel });
                                }}
                                disabled={!canPromote || nextLevel === "Alumni / Lulus"}
                                id={`santri-promote-${s.id}`}
                                title={`Naikkan ke ${nextLevel}`}
                                className="bg-emerald-50 hover:bg-emerald-100 disabled:opacity-40 text-emerald-800 font-bold px-2.5 py-1.5 rounded-xl text-[10px] flex items-center gap-1 transition-all mr-1 cursor-pointer"
                              >
                                <GraduationCap className="w-3.5 h-3.5" />
                                <span>Naik ke {nextLevel}</span>
                              </button>
                            );
                          })()}
                          <button
                            onClick={() => handleStartEditSantri(s)}
                            id={`santri-edit-${s.id}`}
                            title="Edit Biodata"
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-800 transition-all shrink-0"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteConfirmSantri(s);
                            }}
                            id={`santri-delete-${s.id}`}
                            title="Hapus Santri"
                            className="p-1.5 hover:bg-red-50 rounded-lg text-red-550 hover:text-red-700 transition-all shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredSantriList.length === 0 && (
                  <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-8 text-center col-span-2">
                    <p className="text-slate-450 font-normal text-xs mb-1">
                      Tidak ditemukan data santri dengan kata kunci tersebut.
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Silakan ganti kata kunci atau tambahkan santri baru dengan mengklik tombol "Registrasi Santri Baru".
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Global Form Modal for Adding / Editing Santri */}
      {showFormModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs font-sans">
          <div className="bg-white rounded-3xl border border-slate-105 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div>
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                  <UserPlus className="w-5 h-5 text-amber-600" />
                  {editingSantri ? 'Perbarui Biodata Lengkap Santri' : 'Registrasi & Tambah Santri Baru'}
                </h3>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Lengkapi seluruh isian formulir sesuai dengan dokumen Kartu Keluarga (KK) resmi.
                </p>
              </div>
              <button
                onClick={() => setShowFormModal(false)}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-650 rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSantriSubmit} className="p-6 space-y-4 text-left">
              {/* BAGIAN 1: Identitas Pokok */}
              <div>
                <h4 className="text-[10px] uppercase font-extrabold text-amber-800 tracking-wider mb-2 pb-1 border-b border-amber-100 flex items-center gap-1">
                  <span>I. Identitas Pokok Pendidikan</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Nama Lengkap Santri <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Muhammad Faiz Al-Fatih"
                      value={newSantriNama}
                      onChange={(e) => setNewSantriNama(e.target.value)}
                      className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-amber-500 bg-white text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Pilih Kelas</label>
                    <select
                      value={newSantriKelas}
                      onChange={(e) => setNewSantriKelas(e.target.value)}
                      className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white text-slate-800"
                    >
                      <option value="Jilid 1">Jilid 1</option>
                      <option value="Jilid 2">Jilid 2</option>
                      <option value="Jilid 3">Jilid 3</option>
                      <option value="Jilid 4">Jilid 4</option>
                      <option value="Jilid 5">Jilid 5</option>
                      <option value="Al-Qur'an 1">Al-Qur'an 1</option>
                      <option value="Al-Qur'an 2">Al-Qur'an 2</option>
                      <option value="Kelas 1 Awaliyah">Kelas 1 Awaliyah</option>
                      <option value="Kelas 2 Awaliyah">Kelas 2 Awaliyah</option>
                      <option value="Kelas 3 Awaliyah">Kelas 3 Awaliyah</option>
                      <option value="Kelas 4 Awaliyah">Kelas 4 Awaliyah</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">NIS (Nomor Induk) <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: 1212001"
                      value={newSantriNis}
                      onChange={(e) => setNewSantriNis(e.target.value)}
                      className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-amber-500 bg-white text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">NISN (10 Digit)</label>
                    <input
                      type="text"
                      maxLength={10}
                      placeholder="Contoh: 0087654321"
                      value={newSantriNisn}
                      onChange={(e) => setNewSantriNisn(e.target.value.replace(/\D/g, ''))}
                      className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-amber-500 bg-white text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* BAGIAN 2: Data Kependudukan Sesuai Kartu Keluarga */}
              <div>
                <h4 className="text-[10px] uppercase font-extrabold text-amber-800 tracking-wider mb-2 pb-1 border-b border-amber-100 flex items-center gap-1">
                  <span>II. Data Kependudukan (Sesuai Kartu Keluarga)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1 font-sans">Nomor Kartu Keluarga (KK)</label>
                    <input
                      type="text"
                      maxLength={16}
                      placeholder="Nomor KK (16 digit)"
                      value={newSantriNoKK}
                      onChange={(e) => setNewSantriNoKK(e.target.value.replace(/\D/g, ''))}
                      className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-amber-500 bg-white text-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">NIK Santri</label>
                    <input
                      type="text"
                      maxLength={16}
                      placeholder="NIK Santri (16 digit)"
                      value={newSantriNik}
                      onChange={(e) => setNewSantriNik(e.target.value.replace(/\D/g, ''))}
                      className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-amber-500 bg-white text-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Tempat Lahir</label>
                    <input
                      type="text"
                      placeholder="Contoh: Pemalang"
                      value={newSantriTempatLahir}
                      onChange={(e) => setNewSantriTempatLahir(e.target.value)}
                      className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-amber-500 bg-white text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Tanggal Lahir</label>
                    <input
                      type="date"
                      value={newSantriTanggalLahir}
                      onChange={(e) => setNewSantriTanggalLahir(e.target.value)}
                      className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-amber-500 bg-white text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Jenis Kelamin</label>
                    <select
                      value={newSantriJenisKelamin}
                      onChange={(e) => setNewSantriJenisKelamin(e.target.value as 'Laki-laki' | 'Perempuan')}
                      className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 bg-white text-slate-800"
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Juz Hafalan Terakhir</label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={newSantriJuz}
                      onChange={(e) => setNewSantriJuz(Number(e.target.value))}
                      className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-amber-500 bg-white text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* BAGIAN 3: Kelompok Silsilah & Wali */}
              <div>
                <h4 className="text-[10px] uppercase font-extrabold text-amber-800 tracking-wider mb-2 pb-1 border-b border-amber-100 flex items-center gap-1">
                  <span>III. Silsilah Rumah Tangga & Wali Terdaftar</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Nama Ayah Kandung</label>
                    <input
                      type="text"
                      placeholder="Nama Lengkap Ayah"
                      value={newSantriNamaAyah}
                      onChange={(e) => setNewSantriNamaAyah(e.target.value)}
                      className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-amber-500 bg-white text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Nama Ibu Kandung</label>
                    <input
                      type="text"
                      placeholder="Nama Lengkap Ibu"
                      value={newSantriNamaIbu}
                      onChange={(e) => setNewSantriNamaIbu(e.target.value)}
                      className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-amber-500 bg-white text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Nama Lengkap Wali <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Bapak H. Rahman Hakim"
                      value={newSantriNamaWali}
                      onChange={(e) => setNewSantriNamaWali(e.target.value)}
                      className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-amber-500 bg-white text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">No. WhatsApp Wali <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      required
                      placeholder="Contoh: 081234567890"
                      value={newSantriTeleponWali}
                      onChange={(e) => setNewSantriTeleponWali(e.target.value)}
                      className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-amber-500 bg-white text-slate-800"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-xxs font-bold text-slate-550 uppercase tracking-wider mb-1">Alamat Lengkap Sesuai KK</label>
                  <textarea
                    rows={2}
                    placeholder="Tuliskan alamat lengkap mulai dari Jalan, No. Rumah, RT/RW, Dusun/Desa, Kecamatan, Kabupaten..."
                    value={newSantriAlamatKK}
                    onChange={(e) => setNewSantriAlamatKK(e.target.value)}
                    className="w-full text-xs border border-slate-205 rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-amber-500 bg-white text-slate-800 resize-none font-sans"
                  />
                </div>
              </div>

              {/* Action Rows */}
              <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowFormModal(false)}
                  className="bg-slate-150 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  id="modal-submit-santri-btn"
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-2 rounded-xl text-xs transition-all shadow-sm"
                >
                  {editingSantri ? 'Simpan Perubahan' : 'Sahkan Pendaftaran'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
