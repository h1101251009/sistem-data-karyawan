/* Sistem Data Karyawan - UAS PPWD K8 */
/* 1. Data awal */
const employees = [
  {
    nip: "20260001",
    nama: "Andi Saputra",
    email: "andi.saputra@email.com",
    telepon: "081234567890",
    jabatan: "Staff IT",
    departemen: "IT",
    tanggal_masuk: "2026-01-10",
    gaji: 5000000,
    status: "aktif",
  },
  {
    nip: "20260002",
    nama: "Siti Rahma",
    email: "siti.rahma@email.com",
    telepon: "081234567891",
    jabatan: "HR Staff",
    departemen: "HRD",
    tanggal_masuk: "2026-02-15",
    gaji: 4500000,
    status: "aktif",
  },
  {
    nip: "20260003",
    nama: "Budi Santoso",
    email: "budi.santoso@email.com",
    telepon: "081234567892",
    jabatan: "Finance Staff",
    departemen: "Keuangan",
    tanggal_masuk: "2025-11-20",
    gaji: 6000000,
    status: "aktif",
  },
  {
    nip: "20260004",
    nama: "Dewi Lestari",
    email: "dewi.lestari@email.com",
    telepon: "081234567893",
    jabatan: "Marketing Staff",
    departemen: "Marketing",
    tanggal_masuk: "2025-09-05",
    gaji: 4800000,
    status: "nonaktif",
  },
  {
    nip: "20260005",
    nama: "Rizky Pratama",
    email: "rizky.pratama@email.com",
    telepon: "081234567894",
    jabatan: "Operations Staff",
    departemen: "Operasional",
    tanggal_masuk: "2026-03-01",
    gaji: 5500000,
    status: "aktif",
  },
];
/* 2. Variabel penanda */
// NIP yang lagi diedit
let editingNip = null;
// NIP yang mau dihapus
let deletingNip = null;
