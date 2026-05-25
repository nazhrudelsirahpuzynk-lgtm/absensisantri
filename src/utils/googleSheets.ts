import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { Santri, Ustadz, KeuanganPondok, SetoranHafalan, Perizinan, TagihanSPP } from '../types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
// Request Google Sheets and Google Drive scope
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
provider.addScope('https://www.googleapis.com/auth/drive');

let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Initialize auth state listener. Call this on app load.
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Look in session or memory
        const savedToken = sessionStorage.getItem('miftah_sheets_token');
        if (savedToken) {
          cachedAccessToken = savedToken;
          if (onAuthSuccess) onAuthSuccess(user, savedToken);
        } else {
          cachedAccessToken = null;
          if (onAuthFailure) onAuthFailure();
        }
      }
    } else {
      cachedAccessToken = null;
      sessionStorage.removeItem('miftah_sheets_token');
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Must be called from a button click or user interaction
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Gagal mendapatkan token akses dari Google.');
    }

    cachedAccessToken = credential.accessToken;
    // We can save in sessionStorage for session robustness
    sessionStorage.setItem('miftah_sheets_token', cachedAccessToken);
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  if (cachedAccessToken) return cachedAccessToken;
  return sessionStorage.getItem('miftah_sheets_token');
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
  sessionStorage.removeItem('miftah_sheets_token');
};

/**
 * Creates a beautiful multi-tab spreadsheet for Pesantren Miftahul Ulum data.
 */
export const createSheetsReport = async (
  accessToken: string,
  data: {
    allSantri: Santri[];
    ustadzList: Ustadz[];
    keuanganList: KeuanganPondok[];
    setoranList: SetoranHafalan[];
    perizinanList: Perizinan[];
    tagihanList: TagihanSPP[];
  }
): Promise<{ id: string; url: string }> => {
  const timestamp = new Date().toLocaleString('id-ID', {
    timeZone: 'Asia/Jakarta',
    dateStyle: 'medium',
    timeStyle: 'short'
  });

  const bodyData = {
    properties: {
      title: `Miftahul Ulum - Laporan Administrasi Pesantren (${timestamp})`
    },
    sheets: [
      { properties: { title: 'Laporan Ringkasan' } },
      { properties: { title: 'Data Santri' } },
      { properties: { title: 'Dewan Asatidzah' } },
      { properties: { title: 'Setoran Hafalan' } },
      { properties: { title: 'Buku Kas Keuangan' } },
      { properties: { title: 'Laporan Perizinan' } },
      { properties: { title: 'Tagihan SPP' } }
    ]
  };

  // 1. Create Spreadsheet
  const createResponse = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(bodyData)
  });

  if (!createResponse.ok) {
    const errorJson = await createResponse.json();
    throw new Error(errorJson?.error?.message || 'Gagal membuat Google Sheets baru.');
  }

  const sheetResult = await createResponse.json();
  const spreadsheetId = sheetResult.spreadsheetId;
  const spreadsheetUrl = sheetResult.spreadsheetUrl;

  // 2. Format & Map range values
  const { allSantri, ustadzList, keuanganList, setoranList, perizinanList, tagihanList } = data;

  // Let's build values
  // A. Ringkasan tab
  const totalDanaMasuk = keuanganList
    .filter(k => k.tipe === 'Pemasukan')
    .reduce((sum, k) => sum + k.jumlah, 0);
  const totalDanaKeluar = keuanganList
    .filter(k => k.tipe === 'Pengeluaran')
    .reduce((sum, k) => sum + k.jumlah, 0);
  const nKas = totalDanaMasuk - totalDanaKeluar;

  const ringkasanValues = [
    ['SINKRONISASI DATA ADMINISTRASI PESANTREN MITFAHUL ULUM'],
    [`Tanggal Pembaruan: ${timestamp}`],
    [],
    ['METRIK UTAMA', 'NILAI', 'KETERANGAN'],
    ['Total Santri Aktif', allSantri.length, 'Santri terdaftar di sistem'],
    ['Dewan Asatidzah', ustadzList.length, 'Guru & ustadz yang berkhidmah'],
    ['Rata-Rata Kehadiran Santri', `${(allSantri.reduce((sum, s) => sum + s.kehadiranPercent, 0) / (allSantri.length || 1)).toFixed(1)}%`, 'Toleransi minimal 75%'],
    ['Total Setoran Hafalan', setoranList.length, 'Riwayat setoran hafalan santri'],
    ['Saldo Buku Kas', `Rp ${nKas.toLocaleString('id-ID')}`, `Masuk: Rp ${totalDanaMasuk.toLocaleString('id-ID')} | Keluar: Rp ${totalDanaKeluar.toLocaleString('id-ID')}`],
    ['Tagihan SPP Terbayar', tagihanList.filter(t => t.status === 'Lunas').length, `Dari total ${tagihanList.length} tagihan terbit`],
    ['Surat Izin Diajukan', perizinanList.filter(p => p.status === 'Diajukan').length, 'Menunggu persetujuan pengurus'],
    [],
    ['Sistem administrasi pesantren Miftahul Ulum Kediri terintegrasi langsung dengan database local cloud.']
  ];

  // B. Data Santri
  const santriValues = [
    ['ID', 'NIS', 'Nama Santri', 'Kelas/Mudarros', 'Nama Wali', 'Telepon Wali', 'Rata Kehadiran', 'Juz Terakhir Memori'],
    ...allSantri.map(s => [
      s.id,
      s.nis,
      s.nama,
      s.kelas,
      s.namaWali,
      s.teleponWali,
      `${s.kehadiranPercent}%`,
      s.juzTerakhir
    ])
  ];

  // C. Dewan Asatidzah
  const ustadzValues = [
    ['ID', 'NIP', 'Nama Lengkap', 'Pendidikan/Sertifikasi', 'Spesialisasi Keahlian', 'No Telepon', 'Mulai Tugas'],
    ...ustadzList.map(u => [
      u.id,
      u.nip,
      u.nama,
      u.pesantrenSertifikasi,
      u.bidangKeahlian,
      u.noHp,
      u.tanggalMulaiTugas
    ])
  ];

  // D. Setoran Hafalan
  const setoranValues = [
    ['ID', 'ID Santri', 'Tanggal Setor', 'Juz', 'Nama Surah', 'Ayat Mulai', 'Ayat Selesai', 'Jenis', 'Status Kelancaran', 'Ustadz Penguji', 'Catatan'],
    ...setoranList.map(s => [
      s.id,
      s.santriId,
      s.tanggal,
      s.juz,
      s.surah,
      s.ayatMulai,
      s.ayatSelesai,
      s.tipe,
      s.statusPenilaian,
      s.ustadzPenguji,
      s.catatan
    ])
  ];

  // E. Buku Kas Keuangan
  const keuanganValues = [
    ['ID', 'Jenis Arus', 'Kategori Pos', 'Jumlah Anggaran', 'Tanggal Buku', 'Uraian Kas'],
    ...keuanganList.map(k => [
      k.id,
      k.tipe,
      k.kategori,
      k.jumlah,
      k.tanggal,
      k.keterangan
    ])
  ];

  // F. Laporan Perizinan
  const perizinanValues = [
    ['ID', 'ID Santri', 'Jenis Izin', 'Mulai Sakit/Masa Pulang', 'Selesai Izin', 'Alasan / Maslahat', 'Status Pengajuan', 'Disahkan Oleh', 'Tanggal Pengajuan'],
    ...perizinanList.map(p => [
      p.id,
      p.santriId,
      p.tipeIzin,
      p.tanggalMulai,
      p.tanggalSelesai,
      p.alasan,
      p.status,
      p.disetujuiOleh || '-',
      p.tanggalPengajuan
    ])
  ];

  // G. Tagihan SPP
  const tagihanValues = [
    ['ID', 'ID Santri', 'Bulan Iuran', 'Jumlah Tagihan', 'Metode Bayar', 'Faktur SPP', 'Status Pembayaran', 'Tanggal Setor Tunai'],
    ...tagihanList.map(t => [
      t.id,
      t.santriId,
      t.bulan,
      t.jumlah,
      t.metodeBayar || '-',
      t.invoiceNumber,
      t.status,
      t.tanggalBayar || '-'
    ])
  ];

  // 3. Batch Update spreadsheet ranges
  const batchData = {
    valueInputOption: 'USER_ENTERED',
    data: [
      { range: "'Laporan Ringkasan'!A1", values: ringkasanValues },
      { range: "'Data Santri'!A1", values: santriValues },
      { range: "'Dewan Asatidzah'!A1", values: ustadzValues },
      { range: "'Setoran Hafalan'!A1", values: setoranValues },
      { range: "'Buku Kas Keuangan'!A1", values: keuanganValues },
      { range: "'Laporan Perizinan'!A1", values: perizinanValues },
      { range: "'Tagihan SPP'!A1", values: tagihanValues }
    ]
  };

  const updateResponse = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(batchData)
  });

  if (!updateResponse.ok) {
    const errorJson = await updateResponse.json();
    throw new Error(errorJson?.error?.message || 'Gagal mengisi data ke Google Sheets.');
  }

  return { id: spreadsheetId, url: spreadsheetUrl };
};
