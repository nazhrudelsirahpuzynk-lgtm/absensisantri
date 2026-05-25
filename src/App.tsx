import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Role,
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
import {
  initialSantri,
  initialSetoran,
  initialTargets,
  initialJurnal,
  initialJadwalPelajaran,
  initialJadwalNgaji,
  initialNilaiUjian,
  initialMateriKitab,
  initialTagihanSPP,
  initialPerizinan,
  initialKeuangan,
  initialNotifikasi,
  initialPengumuman,
  initialUstadzList,
  initialPenilaianJilid
} from './data';
import RoleSelector from './components/RoleSelector';
import SantriDashboard from './components/SantriDashboard';
import WaliDashboard from './components/WaliDashboard';
import PengurusDashboard from './components/PengurusDashboard';
import AdminGate from './components/AdminGate';

export default function App() {
  // --- 1. State Hooks initialized with LocalStorage Fallbacks ---
  const [role, setRole] = useState<Role>(() => {
    const saved = localStorage.getItem('miftah_role');
    return (saved as Role) || 'Santri';
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    const saved = sessionStorage.getItem('miftah_admin_auth');
    return saved === 'true';
  });

  const [selectedSantriId, setSelectedSantriId] = useState<string>(() => {
    const saved = localStorage.getItem('miftah_selected_santri_id');
    return saved || 's1';
  });

  const [allSantri, setAllSantri] = useState<Santri[]>(() => {
    const saved = localStorage.getItem('miftah_all_santri');
    return saved ? JSON.parse(saved) : initialSantri;
  });

  const [setoranList, setSetoranList] = useState<SetoranHafalan[]>(() => {
    const saved = localStorage.getItem('miftah_setoran_list');
    return saved ? JSON.parse(saved) : initialSetoran;
  });

  const [targetsList, setTargetsList] = useState<TargetHafalan[]>(() => {
    const saved = localStorage.getItem('miftah_targets_list');
    return saved ? JSON.parse(saved) : initialTargets;
  });

  const [jurnalList, setJurnalList] = useState<JurnalIbadah[]>(() => {
    const saved = localStorage.getItem('miftah_jurnal_list');
    return saved ? JSON.parse(saved) : initialJurnal;
  });

  const [tagihanList, setTagihanList] = useState<TagihanSPP[]>(() => {
    const saved = localStorage.getItem('miftah_tagihan_list');
    return saved ? JSON.parse(saved) : initialTagihanSPP;
  });

  const [perizinanList, setPerizinanList] = useState<Perizinan[]>(() => {
    const saved = localStorage.getItem('miftah_perizinan_list');
    return saved ? JSON.parse(saved) : initialPerizinan;
  });

  const [keuanganList, setKeuanganList] = useState<KeuanganPondok[]>(() => {
    const saved = localStorage.getItem('miftah_keuangan_list');
    return saved ? JSON.parse(saved) : initialKeuangan;
  });

  const [notifikasiList, setNotifikasiList] = useState<Notifikasi[]>(() => {
    const saved = localStorage.getItem('miftah_notifikasi_list');
    return saved ? JSON.parse(saved) : initialNotifikasi;
  });

  const [ustadzList, setUstadzList] = useState<Ustadz[]>(() => {
    const saved = localStorage.getItem('miftah_ustadz_list');
    return saved ? JSON.parse(saved) : initialUstadzList;
  });

  const [penilaianJilidList, setPenilaianJilidList] = useState<PenilaianJilid[]>(() => {
    const saved = localStorage.getItem('miftah_penilaian_jilid_list');
    return saved ? JSON.parse(saved) : initialPenilaianJilid;
  });

  // Static datasets (no direct mutations required, but kept in code)
  const [jadwalPelajaranList] = useState<JadwalPelajaran[]>(initialJadwalPelajaran);
  const [jadwalNgajiList] = useState<JadwalNgaji[]>(initialJadwalNgaji);
  const [nilaiUjianList] = useState<NilaiUjian[]>(initialNilaiUjian);
  const [materiKitabList] = useState<MateriKitab[]>(initialMateriKitab);
  const [pengumumanList] = useState<PengumumanPondok[]>(initialPengumuman);

  // --- 2. Persistance Side Effects ---
  useEffect(() => {
    localStorage.setItem('miftah_role', role);
  }, [role]);

  useEffect(() => {
    sessionStorage.setItem('miftah_admin_auth', isAdminAuthenticated ? 'true' : 'false');
  }, [isAdminAuthenticated]);

  useEffect(() => {
    localStorage.setItem('miftah_selected_santri_id', selectedSantriId);
  }, [selectedSantriId]);

  useEffect(() => {
    localStorage.setItem('miftah_all_santri', JSON.stringify(allSantri));
  }, [allSantri]);

  useEffect(() => {
    localStorage.setItem('miftah_setoran_list', JSON.stringify(setoranList));
  }, [setoranList]);

  useEffect(() => {
    localStorage.setItem('miftah_targets_list', JSON.stringify(targetsList));
  }, [targetsList]);

  useEffect(() => {
    localStorage.setItem('miftah_jurnal_list', JSON.stringify(jurnalList));
  }, [jurnalList]);

  useEffect(() => {
    localStorage.setItem('miftah_tagihan_list', JSON.stringify(tagihanList));
  }, [tagihanList]);

  useEffect(() => {
    localStorage.setItem('miftah_perizinan_list', JSON.stringify(perizinanList));
  }, [perizinanList]);

  useEffect(() => {
    localStorage.setItem('miftah_keuangan_list', JSON.stringify(keuanganList));
  }, [keuanganList]);

  useEffect(() => {
    localStorage.setItem('miftah_notifikasi_list', JSON.stringify(notifikasiList));
  }, [notifikasiList]);

  useEffect(() => {
    localStorage.setItem('miftah_ustadz_list', JSON.stringify(ustadzList));
  }, [ustadzList]);

  useEffect(() => {
    localStorage.setItem('miftah_penilaian_jilid_list', JSON.stringify(penilaianJilidList));
  }, [penilaianJilidList]);

  // --- 3. Dynamic State Mutation Handlers ---

  // Handle adding new setoran & automatically calculate/advance student's total memorized Juz
  const handleAddSetoran = (newSetoran: Omit<SetoranHafalan, 'id'>) => {
    const id = `haf-${Date.now()}`;
    const entry: SetoranHafalan = { ...newSetoran, id };
    
    setSetoranList(prev => [entry, ...prev]);

    // If setoran status is 'Sangat Lancar' or 'Lancar', let's automatically update the student's juzTerakhir record
    if (newSetoran.statusPenilaian === 'Sangat Lancar' || newSetoran.statusPenilaian === 'Lancar') {
      setAllSantri(prev =>
        prev.map(s => {
          if (s.id === newSetoran.santriId) {
            // Only adjust if the setoran juz is greater or Equal (to avoid resetting on backwards murojaah)
            const updatedJuz = Math.max(s.juzTerakhir, newSetoran.juz);
            return {
              ...s,
              juzTerakhir: updatedJuz
            };
          }
          return s;
        })
      );
    }

    // Append notification banner
    const targetStudentName = allSantri.find(s => s.id === newSetoran.santriId)?.nama || 'Santri';
    const newNotif: Notifikasi = {
      id: `notif-${Date.now()}`,
      title: 'Setoran Baru Diterima',
      content: `Setoran Juz ${newSetoran.juz} untuk ${targetStudentName} telah masuk di lembar nilai ustadz & wali.`,
      date: new Date().toISOString().split('T')[0],
      type: 'setoran',
      isRead: false
    };
    setNotifikasiList(prev => [newNotif, ...prev]);
  };

  // Log daily spiritual checkboxes
  const handleUpdateJurnal = (updatedJurnal: JurnalIbadah) => {
    setJurnalList(prev => {
      const idx = prev.findIndex(
        j => j.santriId === updatedJurnal.santriId && j.tanggal === updatedJurnal.tanggal
      );
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = updatedJurnal;
        return copy;
      } else {
        return [...prev, updatedJurnal];
      }
    });
  };

  // Perform full SPP payment reconciliation loop
  const handlePaySPP = (tagihanId: string, metode: string) => {
    // 1. Set SPP Tagihan to Lunas
    setTagihanList(prev =>
      prev.map(t => {
        if (t.id === tagihanId) {
          return {
            ...t,
            status: 'Lunas',
            tanggalBayar: new Date().toISOString().split('T')[0],
            metodeBayar: metode
          };
        }
        return t;
      })
    );

    // Get specific invoice amount and student data
    const matchedTagihan = tagihanList.find(t => t.id === tagihanId);
    if (matchedTagihan) {
      const studentObj = allSantri.find(s => s.id === matchedTagihan.santriId);
      const studentName = studentObj ? studentObj.nama : 'Santri';

      // 2. Log credit entry in general financial book automatically
      const newKeuanganEntry: KeuanganPondok = {
        id: `keu-${Date.now()}`,
        tipe: 'Pemasukan',
        kategori: 'SPP Santri',
        jumlah: matchedTagihan.jumlah,
        tanggal: new Date().toISOString().split('T')[0],
        keterangan: `Bayar SPP ${matchedTagihan.bulan} - ${studentName} (${metode})`
      };
      setKeuanganList(prev => [...prev, newKeuanganEntry]);
    }
  };

  // Administrative invoice revision tool
  const handleUpdateTagihanStatus = (tagihanId: string, status: TagihanSPP['status']) => {
    setTagihanList(prev =>
      prev.map(t => {
        if (t.id === tagihanId) {
          return {
            ...t,
            status,
            tanggalBayar: status === 'Lunas' ? new Date().toISOString().split('T')[0] : t.tanggalBayar
          };
        }
        return t;
      })
    );

    // If marked as Lunas by administrator, log in general financial ledger
    if (status === 'Lunas') {
      const matched = tagihanList.find(t => t.id === tagihanId);
      if (matched) {
        const s = allSantri.find(san => san.id === matched.santriId);
        const newEntry: KeuanganPondok = {
          id: `keu-admin-${Date.now()}`,
          tipe: 'Pemasukan',
          kategori: 'SPP Santri',
          jumlah: matched.jumlah,
          tanggal: new Date().toISOString().split('T')[0],
          keterangan: `Setoran SPP ${matched.bulan} - ${s?.nama || 'Santri'} (Disahkan Admin)`
        };
        setKeuanganList(prev => [...prev, newEntry]);
      }
    }
  };

  // Submit leave requests
  const handleAddPerizinan = (newIzin: Omit<Perizinan, 'id'>) => {
    const id = `perm-${Date.now()}`;
    setPerizinanList(prev => [{ ...newIzin, id } as Perizinan, ...prev]);
  };

  // Confirm / Deny Leave Permits
  const handleApprovePerizinan = (
    perizinanId: string,
    approvedBy: string,
    approveStatus: 'Disetujui' | 'Ditolak'
  ) => {
    setPerizinanList(prev =>
      prev.map(p => {
        if (p.id === perizinanId) {
          return {
            ...p,
            status: approveStatus,
            disetujuiOleh: approvedBy
          };
        }
        return p;
      })
    );

    // Notify student account
    const matchedPermit = perizinanList.find(p => p.id === perizinanId);
    if (matchedPermit) {
      const label = matchedPermit.tipeIzin === 'Pulang' ? 'Izin Pulang' : 'Pemberitahuan Sakit';
      const newNotif: Notifikasi = {
        id: `notif-perm-${Date.now()}`,
        title: `Surat Izin ${approveStatus}`,
        content: `Permohonan ${label} Anda telah ${approveStatus.toLowerCase()} oleh ${approvedBy}.`,
        date: new Date().toISOString().split('T')[0],
        type: 'pengumuman',
        isRead: false
      };
      setNotifikasiList(prev => [newNotif, ...prev]);
    }
  };

  // Modify cumulative attendance metrics manually in real-time
  const handleUpdateSantriKehadiran = (santriId: string, newKehadiran: number) => {
    setAllSantri(prev =>
      prev.map(s => {
        if (s.id === santriId) {
          return { ...s, kehadiranPercent: newKehadiran };
        }
        return s;
      })
    );
  };

  // Enter operational cost ledger
  const handleAddKeuangan = (newKeuangan: Omit<KeuanganPondok, 'id'>) => {
    const entry: KeuanganPondok = {
      ...newKeuangan,
      id: `keu-${Date.now()}`
    };
    setKeuanganList(prev => [...prev, entry]);
  };

  // Update student (santri) details
  const handleUpdateSantri = (id: string, updatedFields: Partial<Santri>) => {
    setAllSantri(prev =>
      prev.map(s => {
        if (s.id === id) {
          return { ...s, ...updatedFields };
        }
        return s;
      })
    );
  };

  // Bulk promote students' grades or levels
  const handleBulkPromote = (targetLevel: string, nextLevel: string) => {
    setAllSantri(prev =>
      prev.map(s => {
        if (s.kelas === targetLevel) {
          return { ...s, kelas: nextLevel };
        }
        return s;
      })
    );

    const newNotif: Notifikasi = {
      id: `notif-bulk-${Date.now()}`,
      title: 'Kenaikan Kelas/Tingkat Massal',
      content: `Alhamdulillah! Seluruh santri di tingkat [${targetLevel}] berhasil dinaikkan ke tingkat [${nextLevel}].`,
      date: new Date().toISOString().split('T')[0],
      type: 'pengumuman',
      isRead: false
    };
    setNotifikasiList(prev => [newNotif, ...prev]);
  };

  // Delete student (santri) from directory
  const handleDeleteSantri = (id: string) => {
    const targetSantri = allSantri.find(s => s.id === id);
    setAllSantri(prev => {
      const filtered = prev.filter(s => s.id !== id);
      if (selectedSantriId === id) {
        if (filtered.length > 0) {
          setSelectedSantriId(filtered[0].id);
        } else {
          setSelectedSantriId('');
        }
      }
      return filtered;
    });

    const newNotif: Notifikasi = {
      id: `notif-del-${Date.now()}`,
      title: 'Santri Dihapus',
      content: `Siswa ${targetSantri?.nama || 'Santri'} (NIS: ${targetSantri?.nis || '-'}) berhasil dihapus dari database.`,
      date: new Date().toISOString().split('T')[0],
      type: 'pengumuman',
      isRead: false
    };
    setNotifikasiList(prev => [newNotif, ...prev]);
  };

  // Delete ustadz from directory
  const handleDeleteUstadz = (id: string) => {
    const targetUstadz = ustadzList.find(u => u.id === id);
    setUstadzList(prev => prev.filter(u => u.id !== id));

    const newNotif: Notifikasi = {
      id: `notif-del-ust-${Date.now()}`,
      title: 'Ustadz Dihapus',
      content: `Ustadz ${targetUstadz?.nama || 'Pengajar'} (NIP: ${targetUstadz?.nip || '-'}) telah dihentikan tugas khidmah mengajarnya.`,
      date: new Date().toISOString().split('T')[0],
      type: 'pengumuman',
      isRead: false
    };
    setNotifikasiList(prev => [newNotif, ...prev]);
  };

  // Register new student (santri)
  const handleRegisterSantri = (newSantri: Omit<Santri, 'id' | 'kehadiranPercent' | 'catatanPelanggaran'>) => {
    // Generate unique sequential id
    const newIdNum = allSantri.length > 0 
      ? Math.max(...allSantri.map(s => parseInt(s.id.replace('s', '')) || 0)) + 1 
      : 1;
    const id = `s${newIdNum}`;
    
    const entry: Santri = {
      ...newSantri,
      id,
      kehadiranPercent: 100, // Starts with 100% attendance
      catatanPelanggaran: []
    };
    setAllSantri(prev => [...prev, entry]);

    // Add a registration notification
    const newNotif: Notifikasi = {
      id: `notif-reg-${Date.now()}`,
      title: 'Pendaftaran Santri Baru',
      content: `Alhamdulillah, Ananda ${newSantri.nama} (NIS: ${newSantri.nis}) resmi terdaftar di kelas ${newSantri.kelas}.`,
      date: new Date().toISOString().split('T')[0],
      type: 'pengumuman',
      isRead: false
    };
    setNotifikasiList(prev => [newNotif, ...prev]);

    // Also automatically create an initial invoice for SPP Mei 2026
    const newTagihan: TagihanSPP = {
      id: `spp-${Date.now()}`,
      santriId: id,
      bulan: 'Mei 2026',
      jumlah: 250000,
      status: 'Belum Bayar',
      invoiceNumber: `INV/202605/${newSantri.nis}`
    };
    setTagihanList(prev => [newTagihan, ...prev]);
  };

  const handleAddUstadz = (newUstadz: Omit<Ustadz, 'id'>) => {
    const newIdNum = ustadzList.length > 0 
      ? Math.max(...ustadzList.map(u => parseInt(u.id.replace('u', '')) || 0)) + 1 
      : 1;
    const id = `u${newIdNum}`;
    const entry: Ustadz = { ...newUstadz, id };
    setUstadzList(prev => [...prev, entry]);

    const newNotif: Notifikasi = {
      id: `notif-ust-${Date.now()}`,
      title: 'Ustadz Baru Diposisikan',
      content: `Alhamdulillah, ustadz baru ${newUstadz.nama} (NIP: ${newUstadz.nip}) resmi khidmah mengajar bidang ${newUstadz.bidangKeahlian}.`,
      date: new Date().toISOString().split('T')[0],
      type: 'pengumuman',
      isRead: false
    };
    setNotifikasiList(prev => [newNotif, ...prev]);
  };

  const handleAddPenilaianJilid = (newPenilaian: Omit<PenilaianJilid, 'id'>) => {
    const id = `pj-${Date.now()}`;
    const entry: PenilaianJilid = { ...newPenilaian, id };
    setPenilaianJilidList(prev => [entry, ...prev]);

    const targetStudentName = allSantri.find(s => s.id === newPenilaian.santriId)?.nama || 'Santri';
    const newNotif: Notifikasi = {
      id: `notif-pj-${Date.now()}`,
      title: 'Penilaian Jilid Disahkan',
      content: `Evaluasi tingkat ${newPenilaian.tingkat} untuk ${targetStudentName} (pindah ke Halaman ${newPenilaian.halamanBaru}) telah dinilai.`,
      date: new Date().toISOString().split('T')[0],
      type: 'setoran',
      isRead: false
    };
    setNotifikasiList(prev => [newNotif, ...prev]);
  };

  // Active impersonated profile object
  const activeSantri = allSantri.find(s => s.id === selectedSantriId) || allSantri[0] || {
    id: 'empty-fallback-id',
    nama: 'Belum Ada Santri',
    nis: '00000',
    kelas: 'Jilid 1',
    namaWali: 'Orang Tua / Wali Contoh',
    teleponWali: '081234567890',
    kehadiranPercent: 100,
    juzTerakhir: 30,
    catatanPelanggaran: []
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 font-sans selection:bg-emerald-250 selection:text-emerald-900 pb-16">
      {/* 1. Global Role Switches Navigation Header */}
      <RoleSelector
        currentRole={role}
        onChangeRole={setRole}
        allSantri={allSantri}
        selectedSantriId={selectedSantriId}
        onSelectSantri={setSelectedSantriId}
        isAdminAuthenticated={isAdminAuthenticated}
        onAdminLogout={() => {
          setIsAdminAuthenticated(false);
          setRole('Santri');
        }}
      />

      {/* 2. Main Tab/Role Containers with Fade Transitions */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <motion.div
          key={role + selectedSantriId + isAdminAuthenticated} // Triggers elegant transition whenever role, student, or auth switches
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: 'easeOut' }}
        >
          {role === 'Santri' && (
            <SantriDashboard
              santri={activeSantri}
              setoranList={setoranList}
              targetsList={targetsList}
              jurnalList={jurnalList}
              jadwalPelajaranList={jadwalPelajaranList}
              jadwalNgajiList={jadwalNgajiList}
              nilaiUjianList={nilaiUjianList}
              materiKitabList={materiKitabList}
              notifikasiList={notifikasiList}
              pengumumanList={pengumumanList}
              penilaianJilidList={penilaianJilidList}
              onAddSetoran={handleAddSetoran}
              onUpdateJurnal={handleUpdateJurnal}
            />
          )}

          {role === 'Wali' && (
            <WaliDashboard
              santri={activeSantri}
              setoranList={setoranList}
              nilaiUjianList={nilaiUjianList}
              tagihanList={tagihanList}
              perizinanList={perizinanList}
              penilaianJilidList={penilaianJilidList}
              onAddPerizinan={handleAddPerizinan}
              onPaySPP={handlePaySPP}
              allSantri={allSantri}
              ustadzList={ustadzList}
            />
          )}

          {role === 'Pengurus' && (
            !isAdminAuthenticated ? (
              <AdminGate
                onSuccess={() => setIsAdminAuthenticated(true)}
                onCancel={() => setRole('Santri')}
              />
            ) : (
              <PengurusDashboard
                allSantri={allSantri}
                setoranList={setoranList}
                tagihanList={tagihanList}
                keuanganList={keuanganList}
                perizinanList={perizinanList}
                jadwalPelajaranList={jadwalPelajaranList}
                ustadzList={ustadzList}
                penilaianJilidList={penilaianJilidList}
                onAddSetoran={handleAddSetoran}
                onAddKeuangan={handleAddKeuangan}
                onUpdateTagihanStatus={handleUpdateTagihanStatus}
                onApprovePerizinan={handleApprovePerizinan}
                onUpdateSantriKehadiran={handleUpdateSantriKehadiran}
                onAddSantri={handleRegisterSantri}
                onDeleteSantri={handleDeleteSantri}
                onUpdateSantri={handleUpdateSantri}
                onBulkPromote={handleBulkPromote}
                onAddUstadz={handleAddUstadz}
                onDeleteUstadz={handleDeleteUstadz}
                onAddPenilaianJilid={handleAddPenilaianJilid}
              />
            )
          )}
        </motion.div>
      </main>
    </div>
  );
}
