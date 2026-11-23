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


/* 7. Hapus pesan validasi */
function clearValidation() {
  $("#employeeForm .is-invalid")
    .removeClass("is-invalid")
    .removeAttr("aria-invalid");
  $("#employeeForm .invalid-feedback").remove();
}

/* 8. Pesan error input */
function setFieldError(fieldId, message) {
  const field = $("#" + fieldId);
  field.addClass("is-invalid").attr("aria-invalid", "true");

  let feedback = field.next(".invalid-feedback");
  if (!feedback.length) {
    feedback = $("<div>", {
      class: "invalid-feedback",
    });
    field.after(feedback);
  }

  feedback.text(message);
}

/* 9. Validasi form */
function validateEmployeeForm() {
  clearValidation();
  let isValid = true;

  // ambil nilai input
  const nip = $.trim($("#employeeNip").val());
  const nama = $.trim($("#employeeName").val());
  const email = $.trim($("#employeeEmail").val());
  const telepon = $.trim($("#employeePhone").val());
  const jabatan = $.trim($("#employeePosition").val());
  const departemen = $("#employeeDepartment").val();
  const tanggalMasuk = $("#employeeJoinDate").val();
  const gaji = $("#employeeSalary").val();
  const status = $("#employeeStatus").val();

  // nip
  if (!/^[0-9]{8}$/.test(nip)) {
    setFieldError("employeeNip", "NIP harus terdiri dari tepat 8 digit angka.");
    isValid = false;
  } else {
    // cek duplikat
    const duplicateNip = employees.some(function (employee) {
      return employee.nip === nip && employee.nip !== editingNip;
    });

    if (duplicateNip) {
      setFieldError("employeeNip", "NIP tersebut sudah terdaftar.");
      isValid = false;
    }
  }

  // nama
  if (nama === "") {
    setFieldError("employeeName", "Nama lengkap wajib diisi.");
    isValid = false;
  }

  // email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    setFieldError(
      "employeeEmail",
      "Masukkan alamat email dengan format yang valid.",
    );
    isValid = false;
  }

  // telepon
  if (!/^[0-9]{10,13}$/.test(telepon)) {
    setFieldError(
      "employeePhone",
      "Nomor telepon harus terdiri dari 10 sampai 13 digit.",
    );
    isValid = false;
  }

  // jabatan
  if (jabatan === "") {
    setFieldError("employeePosition", "Jabatan wajib diisi.");
    isValid = false;
  }

  // departemen
  const departments = ["IT", "HRD", "Keuangan", "Marketing", "Operasional"];
  if (!departments.includes(departemen)) {
    setFieldError("employeeDepartment", "Silakan pilih departemen.");
    isValid = false;
  }

  // tanggal masuk
  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  let validDate = false;
  if (datePattern.test(tanggalMasuk)) {
    const parts = tanggalMasuk.split("-").map(Number);
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    validDate =
      date.getFullYear() === parts[0] &&
      date.getMonth() === parts[1] - 1 &&
      date.getDate() === parts[2];
  }

  if (!validDate) {
    setFieldError(
      "employeeJoinDate",
      "Tanggal masuk wajib diisi dengan tanggal yang valid.",
    );
    isValid = false;
  }

  // gaji
  const salaryNumber = Number(gaji);
  if (
    $.trim(gaji) === "" ||
    !Number.isFinite(salaryNumber) ||
    salaryNumber <= 0
  ) {
    setFieldError(
      "employeeSalary",
      "Gaji harus berupa angka yang lebih besar dari 0.",
    );
    isValid = false;
  }

  // status
  if (!["aktif", "nonaktif"].includes(status)) {
    setFieldError("employeeStatus", "Silakan pilih status karyawan.");
    isValid = false;
  }

  return isValid;
}


/* 10. Reset form */
function resetEmployeeForm() {
  $("#employeeForm")[0].reset();
  clearValidation();
  editingNip = null;
  $("#employeeModalTitle").text("Tambah Karyawan");
  $("#saveEmployeeBtn").text("Simpan Karyawan");
}
