// Tampilan halaman "Struktur Admin - Lorevia Entertainment" (route: struktur).
// Data diambil dari tab "management" di Google Sheets lewat Apps Script Web App
// (API_URL didefinisikan di api.js, endpoint: `${API_URL}?type=management`).

// Urutan level di bagan struktur (dari tertinggi ke terendah) — SUMBER KEBENARAN TUNGGAL,
// juga dipakai admin-dashboard.js buat validasi pas nambah/edit data.
// Tiap level berisi ARRAY jabatan — semua jabatan dalam satu level tampil SEJAJAR di bagan.
// Ini menentukan level, BUKAN urutan baris di Sheet — jadi aman ditambah data kapan saja.
const URUTAN_JABATAN_ADMIN = [
    ['Founder', 'Co-Founder'],                           // Level 1: Executive & Founder
    ['CFO'],                                              // Level 2: C-Level / Direksi
    ['Manager'],                                          // Level 3: Management / Lead
    ['Sekretaris', 'Admin'],                              // Level 4: Support & Administrasi Inti
    ['Coach Vocal', 'Coach Rap', 'Coach Dance Team'],     // Level 5: Coach
    ['PJ Medpart', 'Editor Team', 'Wording'],             // Level 6: Editor
    ['Security Team']                                     // Level 7: Staf Lapangan / Support
];

let adminStructureLoaded = false;

// Dipanggil dari Dasbor Admin setelah tambah/edit/hapus, biar data ke-refresh dari Sheet
async function reloadAdminStructure() {
    adminStructureLoaded = false;
    await loadAdminStructure();
}

async function loadAdminStructure() {
    if (adminStructureLoaded) return; // udah pernah di-fetch, nggak usah ulang tiap render
    try {
        const res = await fetch(`${API_URL}?type=management`);
        const json = await res.json();
        if (!json.ok) throw new Error(json.error || 'Gagal ambil data management');

        // Kolom Sheet: id, Nama Panjang, Nama Panggung, Tanggal Lahir, Face Claim, Jabatan, Foto
        appData.adminStructure = json.data.map(row => ({
            id: row['id'],
            namaPanjang: row['Nama Panjang'] || '',
            name: row['Nama Panggung'] || row['Nama Panjang'] || '',
            tanggalLahir: row['Tanggal Lahir'] || '',
            faceClaim: row['Face Claim'] || '',
            role: row['Jabatan'] || '',
            img: row['Foto'] || ''
        })).filter(a => a.name);

        adminStructureLoaded = true;
    } catch (err) {
        console.error('Gagal load struktur admin:', err);
        appData.adminStructure = [];
    }
}

function renderView() {
    const content = document.getElementById('appContent');
    if (currentRoute !== 'toko') stopPromoBanner();
    if (currentRoute === 'struktur') {
        if (!adminStructureLoaded) {
            content.innerHTML = `
                <div class="max-w-6xl mx-auto py-8 space-y-8">
                    <div class="text-center">
                        <h2 class="font-serif text-3xl md:text-4xl font-bold gold-text">Struktur Admin</h2>
                        <p class="text-gray-300 mt-2">Memuat data struktur admin...</p>
                    </div>
                </div>
            `;
            loadAdminStructure().then(() => {
                if (currentRoute === 'struktur') renderView();
            });
            return;
        }

        // Setiap "level" sekarang berupa daftar jabatan yang tampil sejajar dalam satu baris
        const semuaJabatanTerdaftar = URUTAN_JABATAN_ADMIN.flat();
        const levelsAda = URUTAN_JABATAN_ADMIN
            .map(jabatanDalamLevel => appData.adminStructure.filter(a => jabatanDalamLevel.includes(a.role)))
            .filter(nodes => nodes.length > 0);

        // Jabatan yang ada di Sheet tapi belum masuk ke level manapun di URUTAN_JABATAN_ADMIN.
        // Ditaruh sebagai level tambahan paling bawah SEMENTARA, dan kalau yang buka halaman ini
        // admin yang lagi login, dikasih alert biar segera didaftarin ke level yang benar.
        const jabatanTakDikenal = [...new Set(appData.adminStructure.map(a => a.role))]
            .filter(j => !semuaJabatanTerdaftar.includes(j));
        const nodesTakDikenal = appData.adminStructure.filter(a => jabatanTakDikenal.includes(a.role));
        const semuaLevel = jabatanTakDikenal.length > 0 ? [...levelsAda, nodesTakDikenal] : levelsAda;

        if (jabatanTakDikenal.length > 0 && typeof isAdminLoggedIn !== 'undefined' && isAdminLoggedIn) {
            alert(
                'Perhatian: ada Jabatan di Sheet "management" yang belum terdaftar di level manapun:\n\n' +
                jabatanTakDikenal.join(', ') +
                '\n\nJabatan ini sementara ditampilkan sebagai level tambahan paling bawah di bagan. ' +
                'Tambahkan ke salah satu level di URUTAN_JABATAN_ADMIN di struktur.js supaya levelnya benar.'
            );
        }

        content.innerHTML = `
            <div class="max-w-6xl mx-auto py-8 space-y-8">
                <div class="text-center">
                    <h2 class="font-serif text-3xl md:text-4xl font-bold gold-text">Struktur Admin</h2>
                    <p class="text-gray-300 mt-2">Bagan kepengurusan inti Lorevia Entertainment, tersusun rapi dari level tertinggi hingga management.</p>
                </div>
                ${appData.adminStructure.length === 0 ? `
                    <div class="text-center py-16 bg-forest-800/40 rounded-2xl border border-forest-700">
                        <p class="text-gray-400">Belum ada data struktur admin.</p>
                    </div>
                ` : `
                <div class="flex flex-col items-center">
                    ${semuaLevel.map((nodes, levelIdx) => {
                        return `
                        <div class="flex flex-col items-center w-full">
                            ${levelIdx > 0 ? '<div class="tree-stub h-8"></div>' : ''}
                            <div class="tree-row flex flex-wrap justify-center gap-8 md:gap-10 pt-1 ${nodes.length > 1 ? 'border-t-2 border-gold-600/70 mt-1' : ''}">
                                ${nodes.map(admin => `
                                    <div class="flex flex-col items-center -mt-1">
                                        ${nodes.length > 1 ? '<div class="tree-stub h-4"></div>' : ''}
                                        <div class="admin-card rounded-2xl border-2 border-gold-600/60 p-5 relative overflow-hidden flex flex-col items-center text-center group w-44 md:w-48 transition-shadow duration-300">
                                            <div class="admin-avatar-glow w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-gold-400 overflow-hidden mb-3 group-hover:scale-105 transition duration-300">
                                                    <img src="${admin.img}" alt="${admin.name}" class="w-full h-full object-cover" onerror="this.onerror=null; this.classList.add('hidden'); this.nextElementSibling.classList.remove('hidden');">
                                                    <div class="hidden w-full h-full items-center justify-center bg-forest-700 text-gold-400 text-3xl font-bold">${(admin.name || '?').charAt(0).toUpperCase()}</div>
                                            </div>
                                            <p class="text-[11px] font-bold text-gray-300 uppercase tracking-widest">${admin.role}</p>
                                            <h3 class="font-serif text-lg font-bold gold-text leading-tight mt-0.5">${admin.name}</h3>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                        `;
                    }).join('')}
                </div>
                `}
            </div>
        `;
    }
    animatePageReveal();
}