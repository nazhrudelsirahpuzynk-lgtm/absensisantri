export type Role = 'Santri' | 'Wali' | 'Pengurus';

export interface Santri {
  id: string;
  nama: string;
  nis: string;
  kelas: string;
  namaWali: string;
  teleponWali: string;
  kehadiranPercent: number;
  juzTerakhir: number;
  catatanPelanggaran: string[];
}

export interface SetoranHafalan {
  id: string;
  santriId: string;
  tanggal: string;
  juz: number;
  surah: string;
  ayatMulai: number;
  ayatSelesai: number;
  tipe: 'Setoran Baru' | 'Murojaah';
  statusPenilaian: 'Sangat Lancar' | 'Lancar' | 'Cukup' | 'Perlu Mengulang';
  ustadzPenguji: string;
  catatan: string;
}

export interface TargetHafalan {
  id: string;
  santriId: string;
  tipeTarget: 'Mingguan' | 'Bulanan';
  targetJuz: string;
  deadline: string;
  status: 'Tercapai' | 'Sedang Berjalan' | 'Belum Tercapai';
}

export interface JurnalIbadah {
  id: string;
  santriId: string;
  tanggal: string;
  sholatBerjamaah: {
    subuh: boolean;
    dhuhur: boolean;
    ashar: boolean;
    maghrib: boolean;
    isya: boolean;
  };
  puasaSunnah: 'Tidak Puasa' | 'Puasa Senin' | 'Puasa Kamis' | 'Puasa Daud' | 'Puasa Ayyamul Bidh';
  tilawahLembar: number; // Jumlah halaman/lembar tilawah
  dzikirPagi: boolean;
  dzikirPetang: boolean;
  sholatTahajud: boolean;
  sholatDhuha: boolean;
}

export interface JadwalPelajaran {
  id: string;
  hari: string;
  jam: string;
  mataPelajaran: string;
  ustadz: string;
  kelas: string;
}

export interface JadwalNgaji {
  id: string;
  hari: string;
  jam: string;
  kitab: string;
  ustadz: string;
  lokasi: string;
}

export interface NilaiUjian {
  id: string;
  santriId: string;
  mataPelajaran: string;
  nilai: number;
  tipeUjian: 'PTS' | 'PAS' | 'Ujian Bulanan';
  catatan: string;
}

export interface MateriKitab {
  id: string;
  judul: string;
  pengarang: string;
  deskripsi: string;
  babAktif: string;
  linkReferensi?: string;
}

export interface TagihanSPP {
  id: string;
  santriId: string;
  bulan: string; // Misal: Mei 2026
  jumlah: number;
  status: 'Lunas' | 'Belum Bayar' | 'Menunggu Konfirmasi';
  tanggalBayar?: string;
  invoiceNumber: string;
  metodeBayar?: string;
}

export interface Perizinan {
  id: string;
  santriId: string;
  tipeIzin: 'Pulang' | 'Sakit';
  tanggalMulai: string;
  tanggalSelesai: string;
  alasan: string;
  status: 'Diajukan' | 'Disetujui' | 'Ditolak';
  disetujuiOleh?: string;
  tanggalPengajuan: string;
}

export interface KeuanganPondok {
  id: string;
  tipe: 'Pemasukan' | 'Pengeluaran';
  kategori: string;
  jumlah: number;
  tanggal: string;
  keterangan: string;
}

export interface Notifikasi {
  id: string;
  title: string;
  content: string;
  date: string;
  type: 'setoran' | 'pengumuman' | 'agenda';
  isRead: boolean;
}

export interface PengumumanPondok {
  id: string;
  judul: string;
  konten: string;
  tanggal: string;
  prioritas: 'Tinggi' | 'Sedang' | 'Rendah';
  penerbit: string;
}

export interface Ustadz {
  id: string;
  nama: string;
  nip: string;
  pesantrenSertifikasi: string; // misal Al-Azhar, Lirboyo, Sidogiri
  bidangKeahlian: string; // misal Nahwu, Shorof, Tahfidz, Fiqh
  noHp: string;
  tanggalMulaiTugas: string;
}

export interface PenilaianJilid {
  id: string;
  santriId: string;
  tanggal: string;
  tingkat: 'Jilid 1' | 'Jilid 2' | 'Jilid 3' | 'Jilid 4' | 'Jilid 5' | 'Al-Qur\'an 1' | 'Al-Qur\'an 2';
  halamanLama: string;
  halamanBaru: string;
  hafalanDoaHarian: string;
  hafalanFasholatan: string;
  ustadzPenguji: string;
  catatan: string;
}

