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
/* 3. Format rupiah */
function formatRupiah(nominal) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nominal);
}
/* 4. Format tanggal */
function formatTanggal(tanggal) {
  const date = new Date(tanggal + "T00:00:00");
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
/* 5. Escape HTML */
function escapeHTML(value) {
  const characters = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return String(value).replace(/[&<>"']/g, function (character) {
    return characters[character];
  });
}

/* 10. Reset form */
function resetEmployeeForm() {
  $("#employeeForm")[0].reset();
  clearValidation();
  editingNip = null;
  $("#employeeModalTitle").text("Tambah Karyawan");
  $("#saveEmployeeBtn").text("Simpan Karyawan");
}

/* 12. Render tabel */
function renderEmployeeTable() {
  // data hasil filter
  const displayedEmployees = getFilteredEmployees();
  let tableContent = "";
  // kalau kosong
  if (displayedEmployees.length === 0) {
    tableContent = `
<tr>
<td colspan="11" class="text-center py-4 text-muted">
<strong>Data karyawan tidak ditemukan.</strong>
<br>
<small>
Coba ubah kata pencarian atau filter yang digunakan.
</small>
</td>
</tr>
`;
  }
  // bikin baris tabel
  displayedEmployees.forEach(function (employee, index) {
    // badge status
    const statusBadge =
      employee.status === "aktif"
        ? '<span class="badge text-bg-success">Aktif</span>'
        : '<span class="badge text-bg-secondary">Nonaktif</span>';
    tableContent += `
<tr>
<td>${index + 1}</td>
<td>${escapeHTML(employee.nip)}</td>
<td class="fw-semibold">
${escapeHTML(employee.nama)}
</td>
<td>${escapeHTML(employee.email)}</td>
<td>${escapeHTML(employee.telepon)}</td>
<td>${escapeHTML(employee.jabatan)}</td>
<td>${escapeHTML(employee.departemen)}</td>
<td>${formatTanggal(employee.tanggal_masuk)}</td>
<td>${formatRupiah(employee.gaji)}</td>
<td>${statusBadge}</td>
<td>
<button
type="button"
class="btn btn-sm btn-outline-primary me-1"
data-action="edit"
data-id="${escapeHTML(employee.nip)}"
>
Edit
</button>
<button
type="button"
class="btn btn-sm btn-outline-danger"
data-action="delete"
data-id="${escapeHTML(employee.nip)}"
>
Hapus
</button>
</td>
</tr>
`;
  });
  // isi tabel
  $("#employeeTableBody").html(tableContent);
}

/* 13. Ringkasan dashboard */
function renderSummary() {
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(function (employee) {
    return employee.status === "aktif";
  });
  const inactiveEmployees = employees.filter(function (employee) {
    return employee.status === "nonaktif";
  });
  // total gaji aktif
  const totalSalary = activeEmployees.reduce(function (total, employee) {
    return total + Number(employee.gaji);
  }, 0);
  // update dashboard
  $("#totalEmployees").text(totalEmployees);
  $("#activeEmployees").text(activeEmployees.length);
  $("#inactiveEmployees").text(inactiveEmployees.length);
  $("#totalSalary").text(formatRupiah(totalSalary));
}

/* 14. Ambil data form */
function getEmployeeFormData() {
  return {
    nip: $.trim($("#employeeNip").val()),
    nama: $.trim($("#employeeName").val()),
    email: $.trim($("#employeeEmail").val()),
    telepon: $.trim($("#employeePhone").val()),
    jabatan: $.trim($("#employeePosition").val()),
    departemen: $("#employeeDepartment").val(),
    tanggal_masuk: $("#employeeJoinDate").val(),
    gaji: Number($("#employeeSalary").val()),
    status: $("#employeeStatus").val(),
  };
}

/* 15. Simpan data */
function saveEmployee() {
  // validasi dulu
  if (!validateEmployeeForm()) {
    $("#employeeForm .is-invalid").first().trigger("focus");
    showAppAlert("Periksa kembali data yang kamu masukkan.", "danger");
    return;
  }
  // ambil data form
  const employeeData = getEmployeeFormData();
  if (editingNip !== null) {
    // cari data yang diedit
    const employeeIndex = employees.findIndex(function (employee) {
      return employee.nip === editingNip;
    });
    if (employeeIndex === -1) {
      showAppAlert("Data karyawan tidak ditemukan.", "danger");
      return;
    }
    // update data
    employees[employeeIndex] = employeeData;
    // pesan sukses
    showAppAlert("Data karyawan berhasil diperbarui.", "success");
  } else {
    // tambah baru
    employees.push(employeeData);
    showAppAlert("Karyawan baru berhasil ditambahkan.", "success");
  }
  // refresh tabel dan ringkasan
  renderEmployeeTable();
  renderSummary();
  // tutup modal
  bootstrap.Modal.getOrCreateInstance(
    document.getElementById("employeeModal"),
  ).hide();
}


/* 6. Notifikasi */
function showAppAlert(message, type = "success") {
  $("#appAlert")
    .removeClass("d-none alert-success alert-danger alert-warning alert-info")
    .addClass("alert alert-" + type)
    .text(message);
}
