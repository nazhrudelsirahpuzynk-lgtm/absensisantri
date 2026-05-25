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
    kelas: 'Kelas 3 Awaliyah',
    namaWali: 'Bapak H. Rahman Hakim',
    teleponWali: '081234567890',
    kehadiranPercent: 98,
    juzTerakhir: 3,
    catatanPelanggaran: ['Terlambat sholat jamaah Shubuh (Teguran lisan)'],
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
    kelas: 'Kelas 1 Awaliyah',
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
    kelas: 'Kelas 2 Awaliyah',
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
    surah: 'Fiqih (Safinatun Najah)',
    ayatMulai: 85,
    ayatSelesai: 92,
    tipe: 'Setoran Baru',
    statusPenilaian: 'Sangat Lancar',
    ustadzPenguji: 'Ustadz Ahmad Fauzi',
    catatan: 'Pemahaman rukun sholat dan thaharah sangat mumpuni. Pertahankan!'
  },
  {
    id: 'haf2',
    santriId: 's1',
    tanggal: '2026-05-23',
    juz: 3,
    surah: 'Tauhid (Aqidatul Awam)',
    ayatMulai: 80,
    ayatSelesai: 88,
    tipe: 'Murojaah',
    statusPenilaian: 'Lancar',
    ustadzPenguji: 'Ustadz Abdul Somad, Lc.',
    catatan: 'Hafalan nadhom sifat wajib Allah sangat lancar.'
  },
  {
    id: 'haf3',
    santriId: 's1',
    tanggal: '2026-05-22',
    juz: 3,
    surah: 'Akhlaq (Taysirul Kholaq)',
    ayatMulai: 78,
    ayatSelesai: 85,
    tipe: 'Setoran Baru',
    statusPenilaian: 'Lancar',
    ustadzPenguji: 'Ustadz Hasan Basri',
    catatan: 'Sifat adab kepada guru dan teman sangat baik.'
  },
  {
    id: 'haf4',
    santriId: 's2',
    tanggal: '2026-05-24',
    juz: 1,
    surah: 'Nahwu (Jurumiyyah)',
    ayatMulai: 75,
    ayatSelesai: 80,
    tipe: 'Setoran Baru',
    statusPenilaian: 'Cukup',
    ustadzPenguji: 'Ustadz M. Syakir',
    catatan: 'Perlu diperbanyak latihan i\'rab fi\'il dan isim.'
  },
  {
    id: 'haf5',
    santriId: 's3',
    tanggal: '2026-05-24',
    juz: 2,
    surah: 'Shorof (Amtsilah Tasrifiyyah)',
    ayatMulai: 90,
    ayatSelesai: 95,
    tipe: 'Setoran Baru',
    statusPenilaian: 'Sangat Lancar',
    ustadzPenguji: 'Ustadz Hasan Basri',
    catatan: 'Tasrif istilahi bab tsulatsi mujarrad sangat mantap.'
  }
];

export const initialTargets: TargetHafalan[] = [
  {
    id: 't1',
    santriId: 's1',
    tipeTarget: 'Mingguan',
    targetJuz: 'Juz 29',
    deadline: '2026-05-28',
    status: 'Sedang Berjalan'
  },
  {
    id: 't2',
    santriId: 's1',
    tipeTarget: 'Bulanan',
    targetJuz: 'Juz 29 & 28',
    deadline: '2026-06-15',
    status: 'Sedang Berjalan'
  },
  {
    id: 't3',
    santriId: 's2',
    tipeTarget: 'Mingguan',
    targetJuz: 'Juz 15 Selesai',
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
      dhuhur: false, // Belum berjalan penuh/masih pagi-siang
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
  { id: 'jp1', hari: 'Senin', jam: '07:30 - 09:00', mataPelajaran: 'Tauhid & Aqidah Khomsin', ustadz: 'Ustadz Ahmad Fauzi', kelas: 'Kelas 3 Awaliyah' },
  { id: 'jp2', hari: 'Senin', jam: '09:15 - 10:45', mataPelajaran: 'Nahwu (Jurumiyyah)', ustadz: 'Ustadz M. Syakir', kelas: 'Kelas 1 Awaliyah' },
  { id: 'jp3', hari: 'Selasa', jam: '07:30 - 09:00', mataPelajaran: 'Shorof (Amtsilah Tasrifiyyah)', ustadz: 'Ustadz Abdul Somad, Lc.', kelas: 'Kelas 2 Awaliyah' },
  { id: 'jp4', hari: 'Selasa', jam: '09:15 - 10:45', mataPelajaran: 'Fadhilah Amal', ustadz: 'Ustadz Hasan Basri', kelas: 'Kelas 3 Awaliyah' },
  { id: 'jp5', hari: 'Rabu', jam: '07:30 - 09:00', mataPelajaran: 'Fiqh (Safinatun Najah)', ustadz: 'Ustadz Ahmad Fauzi', kelas: 'Kelas 1 Awaliyah' },
  { id: 'jp6', hari: 'Kamis', jam: '07:30 - 09:00', mataPelajaran: 'Akhlaq (Taysirul Kholaq)', ustadz: 'Ustadz Hasan Basri', kelas: 'Kelas 2 Awaliyah' }
];

export const initialJadwalNgaji: JadwalNgaji[] = [
  { id: 'jn1', hari: 'Setiap Hari', jam: 'Ba\'da Shubuh', kitab: 'Hifdzul Quran (Setoran)', ustadz: 'Ustadz Abdul Somad, Lc.', lokasi: 'Masjid Utama' },
  { id: 'jn2', hari: 'Setiap Hari', jam: 'Ba\'da Ashar', kitab: 'Murojaah & Halaqah Tajwid', ustadz: 'Ustadz M. Syakir', lokasi: 'Serambi Masjid' },
  { id: 'jn3', hari: 'Senin & Rabu', jam: 'Ba\'da Maghrib', kitab: 'Kitab Riyadhus Shalihin', ustadz: 'KH. Miftah Al-Arifin', lokasi: 'Masjid Utama' },
  { id: 'jn4', hari: 'Selasa & Kamis', jam: 'Ba\'da Maghrib', kitab: 'Kitab Ta\'limul Muta\'allim', ustadz: 'KH. Miftah Al-Arifin', lokasi: 'Masjid Utama' }
];

export const initialNilaiUjian: NilaiUjian[] = [
  { id: 'nu1', santriId: 's1', mataPelajaran: 'Nahwu Jurumiyyah', nilai: 88, tipeUjian: 'PTS', catatan: 'Paham konsep kalam dan i\'rab dengan baik.' },
  { id: 'nu2', santriId: 's1', mataPelajaran: 'Fiqh Safinah', nilai: 95, tipeUjian: 'PTS', catatan: 'Sangat menguasai bab bersuci dan rukun sholat.' },
  { id: 'nu3', santriId: 's1', mataPelajaran: 'Tauhid Aqidatul Awam', nilai: 90, tipeUjian: 'PAS', catatan: 'Mumtaz hafalan nadhom silsilah nabi.' },
  { id: 'nu4', santriId: 's2', mataPelajaran: 'Nahwu Jurumiyyah', nilai: 75, tipeUjian: 'PTS', catatan: 'Tingkatkan latihan i\'rab fi\'il.' }
];

export const initialMateriKitab: MateriKitab[] = [
  {
    id: 'mk1',
    judul: 'Kitab Safinatun Najah',
    pengarang: 'Syeikh Salim bin Sumair Al-Hadhrami',
    deskripsi: 'Kitab ringkas fiqih ibadah madzhab Syafi\'i meliputi rukun islam, rukun iman, thaharah, dan sholat.',
    babAktif: 'Fasal Ketentuan Bersuci & Macam-Macam Air',
    linkReferensi: 'https://archive.org/details/safinatun-najah'
  },
  {
    id: 'mk2',
    judul: 'Kitab Matan Al-Jurumiyyah',
    pengarang: 'Ibnu Ajurrum',
    deskripsi: 'Kitab dasar ilmu alat bahasa Arab (Nahwu) yang mutlak dipelajari santri pemula pesantren.',
    babAktif: 'Bab Al-I\'rab (Perubahan Akhir Kalimah)',
    linkReferensi: 'https://archive.org/details/matan-al-jurumiyyah'
  },
  {
    id: 'mk3',
    judul: 'Kitab Ta\'limul Muta\'allim',
    pengarang: 'Syeikh Al-Zarnuji',
    deskripsi: 'Kitab panduan akhlak dan adab penuntut ilmu agar memperoleh ilmu yang berkah dan bermanfaat.',
    babAktif: 'Fasal Memilih Ilmu, Ustadz, Sahabat dan Istiqomah',
    linkReferensi: 'https://archive.org/details/talimul-mutaallim'
  }
];

export const initialTagihanSPP: TagihanSPP[] = [
  { id: 'spp1', santriId: 's1', bulan: 'Mei 2026', jumlah: 350000, status: 'Lunas', tanggalBayar: '2026-05-10', invoiceNumber: 'INV/202605/023', metodeBayar: 'Transfer Mandiri' },
  { id: 'spp2', santriId: 's1', bulan: 'Juni 2026', jumlah: 350000, status: 'Belum Bayar', invoiceNumber: 'INV/202606/001' },
  { id: 'spp3', santriId: 's2', bulan: 'Mei 2026', jumlah: 350000, status: 'Lunas', tanggalBayar: '2026-05-12', invoiceNumber: 'INV/202605/054', metodeBayar: 'QRIS Gopay' },
  { id: 'spp4', santriId: 's2', bulan: 'Juni 2026', jumlah: 350000, status: 'Menunggu Konfirmasi', tanggalBayar: '2026-05-24', invoiceNumber: 'INV/202606/002', metodeBayar: 'QRIS' }
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


