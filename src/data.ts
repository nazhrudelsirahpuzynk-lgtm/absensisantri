import {
  Santri,
  SetoranHafalan,
  TargetHafalan,
  JurnalIbadah,
  JadwalPelajaran,
  JadwalNgaji,
  NilaiUjian,
  MateriKitab,
  TagihanSPP,
  Perizinan,
  KeuanganPondok,
  Notifikasi,
  PengumumanPondok,
  Ustadz,
  PenilaianJilid
} from './types';

export const initialSantri: Santri[] = [
  {
    id: 's1',
    nama: 'Ahmad Faiz Al-Fatih',
    nis: '1212001',
    kelas: 'TPQ Kelas Al-Qur\'an & Tahfidz',
    namaWali: 'Bapak H. Rahman Hakim',
    teleponWali: '081234567890',
    kehadiranPercent: 98,
    juzTerakhir: 3,
    catatanPelanggaran: ['Terlambat murojaah pagi (Teguran lisan)'],
    noKK: '3327123456780001',
    nisn: '0087654321',
    nik: '3327120101080001',
    tempatLahir: 'Pemalang',
    tanggalLahir: '2008-01-01',
    jenisKelamin: 'Laki-laki',
    alamatKK: 'Dusun Krajan, Desa Sima, Kec. Moga, Pemalang, Jawa Tengah',
    namaAyahKandung: 'Bapak H. Rahman Hakim',
    namaIbuKandung: 'Ibu Hj. Aminah Rahma'
  },
  {
    id: 's2',
    nama: 'Muhammad Yusuf An-Nabil',
    nis: '1212002',
    kelas: 'TPQ Kelas A (Jilid 1-2)',
    namaWali: 'Ibu Siti Khadijah',
    teleponWali: '081298765432',
    kehadiranPercent: 95,
    juzTerakhir: 1,
    catatanPelanggaran: [],
    noKK: '3327123456780209',
    nisn: '0091234567',
    nik: '3327121505100003',
    tempatLahir: 'Pemalang',
    tanggalLahir: '2010-05-15',
    jenisKelamin: 'Laki-laki',
    alamatKK: 'Desa Banyumudal, Kec. Moga, Pemalang, Jawa Tengah',
    namaAyahKandung: 'Bapak Yusuf Mansur',
    namaIbuKandung: 'Ibu Siti Khadijah'
  },
  {
    id: 's3',
    nama: 'Siti Aminah Zahra',
    nis: '1212003',
    kelas: 'TPQ Kelas B (Jilid 3-4)',
    namaWali: 'Bapak Ahmad Ridwan',
    teleponWali: '085712345678',
    kehadiranPercent: 100,
    juzTerakhir: 2,
    catatanPelanggaran: [],
    noKK: '3327123456780034',
    nisn: '0098765432',
    nik: '3327124408090002',
    tempatLahir: 'Semarang',
    tanggalLahir: '2009-08-04',
    jenisKelamin: 'Perempuan',
    alamatKK: 'Perumahan Sima Indah, Kec. Moga, Pemalang, Jawa Tengah',
    namaAyahKandung: 'Bapak Ahmad Ridwan',
    namaIbuKandung: 'Ibu Fatimah Az-Zahra'
  }
];

export const initialSetoran: SetoranHafalan[] = [
  {
    id: 'haf1',
    santriId: 's1',
    tanggal: '2026-05-24',
    juz: 3,
    surah: 'Surat Al-Insyiqaq',
    ayatMulai: 1,
    ayatSelesai: 25,
    tipe: 'Setoran Baru',
    statusPenilaian: 'Sangat Lancar',
    ustadzPenguji: 'Ustadz Ahmad Fauzi',
    catatan: 'Tajwid dan ketukan makhraj sangat konsisten. Lanjutkan ke surat berikutnya!'
  },
  {
    id: 'haf2',
    santriId: 's1',
    tanggal: '2026-05-23',
    juz: 3,
    surah: 'Surat Al-Mutaffifin',
    ayatMulai: 1,
    ayatSelesai: 36,
    tipe: 'Murojaah',
    statusPenilaian: 'Lancar',
    ustadzPenguji: 'Ustadz Abdul Somad, Lc.',
    catatan: 'Kelancaran bagus, harap perkuat makhraj huruf dhood.'
  },
  {
    id: 'haf3',
    santriId: 's1',
    tanggal: '2026-05-22',
    juz: 3,
    surah: 'Surat Al-Infitar',
    ayatMulai: 1,
    ayatSelesai: 19,
    tipe: 'Setoran Baru',
    statusPenilaian: 'Lancar',
    ustadzPenguji: 'Ustadz Hasan Basri',
    catatan: 'Sujud tilawah dipraktikkan dengan tertib.'
  },
  {
    id: 'haf4',
    santriId: 's2',
    tanggal: '2026-05-24',
    juz: 1,
    surah: 'Surat An-Naba',
    ayatMulai: 1,
    ayatSelesai: 20,
    tipe: 'Setoran Baru',
    statusPenilaian: 'Cukup',
    ustadzPenguji: 'Ustadz M. Syakir',
    catatan: 'Mulai lancar, mohon diulang murojaahnya di rumah.'
  },
  {
    id: 'haf5',
    santriId: 's3',
    tanggal: '2026-05-24',
    juz: 2,
    surah: 'Surat An-Naziat',
    ayatMulai: 1,
    ayatSelesai: 46,
    tipe: 'Setoran Baru',
    statusPenilaian: 'Sangat Lancar',
    ustadzPenguji: 'Ustadz Hasan Basri',
    catatan: 'Hafalan kokoh dan lancar dengan lagu Rost.'
  }
];

export const initialTargets: TargetHafalan[] = [
  {
    id: 't1',
    santriId: 's1',
    tipeTarget: 'Mingguan',
    targetJuz: 'Surat Al-Ghasyiyah',
    deadline: '2026-05-28',
    status: 'Sedang Berjalan'
  },
  {
    id: 't2',
    santriId: 's1',
    tipeTarget: 'Bulanan',
    targetJuz: 'Surat An-Naba s.d Al-Infitar',
    deadline: '2026-06-15',
    status: 'Sedang Berjalan'
  },
  {
    id: 't3',
    santriId: 's2',
    tipeTarget: 'Mingguan',
    targetJuz: 'Surat Ad-Duha Selesai',
    deadline: '2026-05-28',
    status: 'Tercapai'
  }
];

export const initialJurnal: JurnalIbadah[] = [
  {
    id: 'j1',
    santriId: 's1',
    tanggal: '2026-05-24',
    sholatBerjamaah: {
      subuh: true,
      dhuhur: true,
      ashar: true,
      maghrib: true,
      isya: true
    },
    puasaSunnah: 'Tidak Puasa',
    tilawahLembar: 5,
    dzikirPagi: true,
    dzikirPetang: true,
    sholatTahajud: true,
    sholatDhuha: true
  },
  {
    id: 'j2',
    santriId: 's1',
    tanggal: '2026-05-25', // Hari ini
    sholatBerjamaah: {
      subuh: true,
      dhuhur: false,
      ashar: false,
      maghrib: false,
      isya: false
    },
    puasaSunnah: 'Puasa Senin',
    tilawahLembar: 2,
    dzikirPagi: true,
    dzikirPetang: false,
    sholatTahajud: true,
    sholatDhuha: true
  }
];

export const initialJadwalPelajaran: JadwalPelajaran[] = [
  { id: 'jp1', hari: 'Senin', jam: '16:00 - 17:30', mataPelajaran: 'Membaca Jilid & Al-Qur\'an', ustadz: 'Ustadz M. Syakir', kelas: 'TPQ Kelas A (Jilid 1-2)' },
  { id: 'jp2', hari: 'Senin', jam: '16:00 - 17:30', mataPelajaran: 'Hafalan Surat Pendek / Juz \'Amma', ustadz: 'Ustadz Ahmad Fauzi', kelas: 'TPQ Kelas Al-Qur\'an & Tahfidz' },
  { id: 'jp3', hari: 'Selasa', jam: '16:00 - 17:30', mataPelajaran: 'Doa-Doa Pilihan & Adab Harian Santri', ustadz: 'Ustadz Hasan Basri', kelas: 'TPQ Kelas B (Jilid 3-4)' },
  { id: 'jp4', hari: 'Selasa', jam: '16:00 - 17:30', mataPelajaran: 'Praktik Gerakan Wudhu & Shalat Fardhu', ustadz: 'Ustadz Hasan Basri', kelas: 'TPQ Kelas C (Jilid 5-6)' },
  { id: 'jp5', hari: 'Rabu', jam: '16:00 - 17:30', mataPelajaran: 'Dinul Islam (Aqidah Akhlaq & Siroh Nabawiyah)', ustadz: 'Ustadz Abdul Somad, Lc.', kelas: 'TPQ Kelas Al-Qur\'an & Tahfidz' },
  { id: 'jp6', hari: 'Kamis', jam: '16:00 - 17:30', mataPelajaran: 'Membaca Jilid & Al-Qur\'an', ustadz: 'Ustadz M. Syakir', kelas: 'TPQ Kelas C (Jilid 5-6)' }
];

export const initialJadwalNgaji: JadwalNgaji[] = [
  { id: 'jn1', hari: 'Setiap Hari', jam: 'Ba\'da Shubuh', kitab: 'Halaqah Tahfidz Mandiri', ustadz: 'Ustadz Abdul Somad, Lc.', lokasi: 'Masjid Utama' },
  { id: 'jn2', hari: 'Setiap Hari', jam: 'Ba\'da Ashar', kitab: 'Simakan Jilid & Al-Qur\'an Berantai', ustadz: 'Ustadz M. Syakir', lokasi: 'Serambi Masjid' },
  { id: 'jn3', hari: 'Senin & Rabu', jam: 'Ba\'da Maghrib', kitab: 'Pengajian Tajwid Praktis', ustadz: 'KH. Miftah Al-Arifin', lokasi: 'Masjid Utama' },
  { id: 'jn4', hari: 'Selasa & Kamis', jam: 'Ba\'da Maghrib', kitab: 'Kisah Islami & Adab Nabawiyah', ustadz: 'KH. Miftah Al-Arifin', lokasi: 'Masjid Utama' }
];

export const initialNilaiUjian: NilaiUjian[] = [
  { id: 'nu1', santriId: 's1', mataPelajaran: 'Membaca Al-Qur\'an & Kaidah Ghorib Tajwid', nilai: 92, tipeUjian: 'PAS', catatan: 'Paham hukum makhraj dhood dan nun mati dengan kokoh.' },
  { id: 'nu2', santriId: 's1', mataPelajaran: 'Hafalan Surat Pendek / Juz \'Amma', nilai: 88, tipeUjian: 'PTS', catatan: 'Sangat lancar makhraj Surat Al-Insyirah s.d Al-Ma`un.' },
  { id: 'nu3', santriId: 's1', mataPelajaran: 'Doa-Doa Pilihan & Adab Harian Santri', nilai: 95, tipeUjian: 'PAS', catatan: 'Melafalkan doa harian lengkap beserta kesantunan adab islam harian.' },
  { id: 'nu4', santriId: 's1', mataPelajaran: 'Praktik Gerakan Wudhu & Shalat Fardhu', nilai: 90, tipeUjian: 'PTS', catatan: 'Ketertiban gerakan shalat fardhu subuh dengan doa qunut telah disimak.' },
  { id: 'nu5', santriId: 's2', mataPelajaran: 'Membaca Al-Qur\'an & Kaidah Ghorib Tajwid', nilai: 78, tipeUjian: 'PTS', catatan: 'Lulus evaluasi jilid dasar dengan makhraj huruf mad yang baik.' }
];

export const initialMateriKitab: MateriKitab[] = [
  {
    id: 'mk1',
    judul: 'Membaca Al-Qur\'an & Kaidah Ghorib Tajwid',
    pengarang: 'Lajnah Pentashih TPQ Al-Asyhar',
    deskripsi: 'Kaidah makharijul huruf, sifatul huruf, hukum nun mati, mim mati, mad aridl lissukun, dan tanda waqaf.',
    babAktif: 'Buku Jilid Tajwid Praktis - Bab Mad Lazim-Ghorib'
  },
  {
    id: 'mk2',
    judul: 'Hafalan Surat Pendek / Juz \'Amma',
    pengarang: 'Ustadz & Ustadzah TPQ',
    deskripsi: 'Kelancaran hafalan dari Surat An-Naas sampai Surat An-Naba’ beserta makhraj yang benar.',
    babAktif: 'Surat Al-Insyiqaq s.d Al-Mutaffifin'
  },
  {
    id: 'mk3',
    judul: 'Doa-Doa Pilihan & Adab Harian Santri',
    pengarang: 'Komisi Kurikulum TPQ',
    deskripsi: 'Melafalkan doa-doa harian lengkap beserta kesantunan adab islam harian.',
    babAktif: 'Doa Masuk Masjid & Doa Untuk Orang Tua'
  },
  {
    id: 'mk4',
    judul: 'Praktik Gerakan Wudhu & Shalat Fardhu',
    pengarang: 'Pengurus Syariah TPA',
    deskripsi: 'Ketertiban rukun fi\'liyah dan qauliyah shalat lima waktu serta kesempurnaan wudhu.',
    babAktif: 'Kaidah Tasyahhud Akhir & Doa Qunut'
  },
  {
    id: 'mk5',
    judul: 'Dinul Islam (Aqidah Akhlaq & Siroh Nabawiyah)',
    pengarang: 'Tim Dakwah TPQ',
    deskripsi: 'Dasar aqidah akhlaqul karimah serta meneladani rukun sejarah hidup nabi Muhammad SAW.',
    babAktif: 'Silsilah Keluarga & Sifat Siddiq Amanah'
  }
];

export const initialTagihanSPP: TagihanSPP[] = [
  { id: 'spp1', santriId: 's1', bulan: 'Mei 2026', jumlah: 50000, status: 'Lunas', tanggalBayar: '2026-05-10', invoiceNumber: 'INV/202605/023', metodeBayar: 'QRIS Gopay' },
  { id: 'spp2', santriId: 's1', bulan: 'Juni 2026', jumlah: 50000, status: 'Belum Bayar', invoiceNumber: 'INV/202606/001' },
  { id: 'spp3', santriId: 's2', bulan: 'Mei 2026', jumlah: 50000, status: 'Lunas', tanggalBayar: '2026-05-12', invoiceNumber: 'INV/202605/054', metodeBayar: 'QRIS OVO' },
  { id: 'spp4', santriId: 's2', bulan: 'Juni 2026', jumlah: 50000, status: 'Menunggu Konfirmasi', tanggalBayar: '2026-05-24', invoiceNumber: 'INV/202606/002', metodeBayar: 'QRIS Shopee' }
];

export const initialPerizinan: Perizinan[] = [
  {
    id: 'p1',
    santriId: 's1',
    tipeIzin: 'Sakit',
    tanggalMulai: '2026-05-12',
    tanggalSelesai: '2026-05-14',
    alasan: 'Demam tinggi dan disarankan istirahat oleh klinik pondok',
    status: 'Disetujui',
    disetujuiOleh: 'Ustadz Ahmad Fauzi',
    tanggalPengajuan: '2026-05-12'
  },
  {
    id: 'p2',
    santriId: 's1',
    tipeIzin: 'Pulang',
    tanggalMulai: '2026-06-05',
    tanggalSelesai: '2026-06-08',
    alasan: 'Menghadiri pernikahan kakak kandung di kampung halaman',
    status: 'Diajukan',
    tanggalPengajuan: '2026-05-24'
  }
];

export const initialKeuangan: KeuanganPondok[] = [
  { id: 'k1', tipe: 'Pemasukan', kategori: 'SPP Santri', jumlah: 14500000, tanggal: '2026-05-20', keterangan: 'Pembayaran SPP lunas kolektif Mei' },
  { id: 'k2', tipe: 'Pengeluaran', kategori: 'Konsumsi', jumlah: 4500000, tanggal: '2026-05-22', keterangan: 'Belanja bahan pokok dapur santri seminggu' },
  { id: 'k3', tipe: 'Pemasukan', kategori: 'Donasi/Infaq', jumlah: 2500000, tanggal: '2026-05-23', keterangan: 'Infaq dari Bapak H. Sujono (Wali Alumni)' },
  { id: 'k4', tipe: 'Pengeluaran', kategori: 'Operasional', jumlah: 1200000, tanggal: '2026-05-24', keterangan: 'Pembelian Kitab Suci & Kitab Kuning pegangan kelas ula' }
];

export const initialNotifikasi: Notifikasi[] = [
  { id: 'n1', title: 'Jadwal Setoran Hafalan', content: 'Setoran hafalan Juz 29 akan dilaksanakan besok pagi Ba\'da Shubuh dengan Ustadz Abdul.', date: '2026-05-24', type: 'setoran', isRead: false },
  { id: 'n2', title: 'Pengumuman Libur Hari Raya', content: 'Pengumuman resmi mengenai masa libur santri menjelang Idul Adha dan ketentuan perizinan pulang.', date: '2026-05-23', type: 'pengumuman', isRead: true },
  { id: 'n3', title: 'Imtihan Akhir Sanah', content: 'Agenda ujian lisan dan tulis kitab kuning dimulai pada awal bulan depan. Persiapkan hafalan bait Jurumiyyah.', date: '2026-05-22', type: 'agenda', isRead: false }
];

export const initialPengumuman: PengumumanPondok[] = [
  {
    id: 'pn1',
    judul: 'Ketentuan Perizinan Mudik Wali Santri',
    konten: 'Bagi seluruh Wali Santri yang hendak mengajukan perizinan kepulangan santri untuk acara Liburan Semester, harap mengirimkan permohonan melalui aplikasi minimal 7 hari sebelum jadwal penjemputan. Penjemputan wajib menyertakan kartu Wali Santri.',
    tanggal: '2026-05-24',
    prioritas: 'Tinggi',
    penerbit: 'Humas Pondok'
  },
  {
    id: 'pn2',
    judul: 'Gotong Royong & Kerja bakti Kompleks Pesantren',
    konten: 'Akan dilaksanakan kegiatan kebersihan massal di lingkungan TPQ Al Asyhar & Madin Miftahul Ulum 1 Sima Moga Pemalang pada hari Ahad, guna menjaga kesehatan lingkungan khususnya menghadapi musim pancaroba.',
    tanggal: '2026-05-20',
    prioritas: 'Sedang',
    penerbit: 'Lurah Pondok'
  }
];

export const initialUstadzList: Ustadz[] = [
  {
    id: 'u1',
    nama: 'Ustadz Abdul Somad, Lc.',
    nip: '19840520-001',
    pesantrenSertifikasi: 'Universitas Al-Azhar, Kairo',
    bidangKeahlian: 'Tafsir & Hadits, Bahasa Arab',
    noHp: '081234567801',
    tanggalMulaiTugas: '2020-08-15'
  },
  {
    id: 'u2',
    nama: 'Ustadz Ahmad Fauzi',
    nip: '19891012-002',
    pesantrenSertifikasi: 'Pondok Pesantren Lirboyo',
    bidangKeahlian: 'Fiqh & Ushul Fiqh, Nahwu',
    noHp: '081234567802',
    tanggalMulaiTugas: '2021-03-10'
  },
  {
    id: 'u3',
    nama: 'Ustadz M. Syakir',
    nip: '19920704-003',
    pesantrenSertifikasi: 'Pondok Pesantren Sidogiri',
    bidangKeahlian: 'Shorof, Tajwid & Qiraah',
    noHp: '081234567803',
    tanggalMulaiTugas: '2022-01-05'
  },
  {
    id: 'u4',
    nama: 'Ustadz Hasan Basri',
    nip: '19951123-004',
    pesantrenSertifikasi: 'Pondok Pesantren Modern Gontor',
    bidangKeahlian: 'Akhlaq, Muhadatsah, Imla\'',
    noHp: '081234567804',
    tanggalMulaiTugas: '2023-07-20'
  }
];

export const initialPenilaianJilid: PenilaianJilid[] = [
  {
    id: 'pj1',
    santriId: 's1',
    tanggal: '2026-05-24',
    tingkat: 'Jilid 4',
    halamanLama: '15',
    halamanBaru: '20',
    hafalanDoaHarian: 'Doa Masuk Masjid (Lancar Syukur)',
    hafalanFasholatan: 'Niat Shalat Jamak Qashar (Lancar)',
    ustadzPenguji: 'Ustadz M. Syakir',
    catatan: 'Halaman 15-20 lulus dengan lancar sekali. Harap dipertahankan konsentrasi membacanya.'
  },
  {
    id: 'pj2',
    santriId: 's2',
    tanggal: '2026-05-23',
    tingkat: 'Al-Qur\'an 1',
    halamanLama: 'Juz 1 Halaman 5',
    halamanBaru: 'Juz 1 Halaman 12',
    hafalanDoaHarian: 'Doa Keluar Rumah (Sangat Lancar)',
    hafalanFasholatan: 'Membaca Ayat Kursi (Cukup Lancar)',
    ustadzPenguji: 'Ustadz Abdul Somad, Lc.',
    catatan: 'Kecepatan membaca sudah baik, hanya hukum idgham bighunnah perlu diperketat lagi.'
  },
  {
    id: 'pj3',
    santriId: 's3',
    tanggal: '2026-05-22',
    tingkat: 'Al-Qur\'an 2',
    halamanLama: 'Juz 10 Halaman 1',
    halamanBaru: 'Juz 10 Halaman 8',
    hafalanDoaHarian: 'Doa Setelah Berwudhu (Lancar)',
    hafalanFasholatan: 'Membaca Doa Qunut Subuh (Sangat Lancar)',
    ustadzPenguji: 'Ustadz Hasan Basri',
    catatan: 'Tartil luar biasa bagus, waqaf wal ibtida sudah istimewa.'
  }
];


