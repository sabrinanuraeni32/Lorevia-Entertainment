// Tampilan halaman "Dasbor Admin - Lorevia Entertainment" (route: admin-dashboard).
// Markup disalin apa adanya dari versi satu file.
        function renderView() {
            const content = document.getElementById('appContent');
            if (currentRoute !== 'toko') stopPromoBanner();
            if (currentRoute === 'admin-dashboard' && isAdminLoggedIn) {
                const tabs = [
                    { key: 'management', label: '🛡️ management' },
                    { key: 'member', label: '🌱 Trainee / Member' },
                    { key: 'announce', label: '📢 Pengumuman & Penghargaan' },
                    { key: 'video', label: '🎬 Video Playlist' },
                    { key: 'audio', label: '🎧 Audio Playlist' },
                    { key: 'store', label: '🛍️ Toko & Pesanan' },
                    { key: 'promo', label: '🎟️ Promo & Voucher' }
                ];
                content.innerHTML = `
                    <div class="max-w-6xl mx-auto py-8 space-y-6">
                        <div class="flex flex-col sm:flex-row justify-between items-center bg-forest-800/90 p-6 rounded-2xl gold-border gap-4">
                            <div>
                                <h2 class="font-serif text-2xl md:text-3xl font-bold gold-text">Dasbor Admin Tersembunyi</h2>
                                <p class="text-sm text-gray-300">Kelola pendaftaran, database, dan konten situs secara terstruktur.</p>
                            </div>
                            <button onclick="handleAdminLogout()" class="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-medium transition shadow-lg">Keluar Admin</button>
                        </div>

                        <!-- Kontrol Buka/Tutup Pendaftaran -->
                        <div class="bg-forest-800/80 p-6 rounded-2xl gold-border shadow-xl">
                            <h3 class="font-serif text-lg font-bold text-gold-400 mb-4">🔐 Kontrol Pendaftaran</h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div class="flex items-center justify-between bg-forest-900/80 p-4 rounded-xl border border-forest-700">
                                    <div>
                                        <p class="font-semibold text-sm text-white">🌱 Pendaftaran Trainee</p>
                                        <p class="text-xs ${appData.registrationOpen.trainee ? 'text-green-400' : 'text-red-400'} font-medium mt-0.5">${appData.registrationOpen.trainee ? 'Sedang Dibuka' : 'Sedang Ditutup'}</p>
                                    </div>
                                    <button onclick="toggleRegistration('trainee')" class="px-4 py-2 rounded-xl text-xs font-bold transition ${appData.registrationOpen.trainee ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-green-600 hover:bg-green-500 text-white'}">${appData.registrationOpen.trainee ? 'Tutup' : 'Buka'}</button>
                                </div>
                                <div class="flex items-center justify-between bg-forest-900/80 p-4 rounded-xl border border-forest-700">
                                    <div>
                                        <p class="font-semibold text-sm text-white">🛡️ Pendaftaran management</p>
                                        <p class="text-xs ${appData.registrationOpen.management ? 'text-green-400' : 'text-red-400'} font-medium mt-0.5">${appData.registrationOpen.management ? 'Sedang Dibuka' : 'Sedang Ditutup'}</p>
                                    </div>
                                    <button onclick="toggleRegistration('management')" class="px-4 py-2 rounded-xl text-xs font-bold transition ${appData.registrationOpen.management ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-green-600 hover:bg-green-500 text-white'}">${appData.registrationOpen.management ? 'Tutup' : 'Buka'}</button>
                                </div>
                            </div>
                        </div>

                        <!-- Kontrol Tanggal Pengumuman Hasil -->
                        <div class="bg-forest-800/80 p-6 rounded-2xl gold-border shadow-xl">
                            <h3 class="font-serif text-lg font-bold text-gold-400 mb-1">📅 Tanggal Pengumuman Hasil</h3>
                            <p class="text-xs text-gray-400 mb-4">Sebelum tanggal ini, halaman Cek Hasil Seleksi akan terkunci untuk tipe pendaftaran terkait, walau statusnya sudah dinilai.</p>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div class="bg-forest-900/80 p-4 rounded-xl border border-forest-700">
                                    <p class="font-semibold text-sm text-white mb-2">🌱 Hasil Trainee</p>
                                    <input type="date" value="${appData.resultsAnnounceDate.trainee || ''}" onchange="setAnnounceDate('trainee', this.value)" class="w-full px-3 py-2 rounded-lg bg-forest-800 border border-forest-600 text-white text-sm outline-none">
                                </div>
                                <div class="bg-forest-900/80 p-4 rounded-xl border border-forest-700">
                                    <p class="font-semibold text-sm text-white mb-2">🛡️ Hasil management</p>
                                    <input type="date" value="${appData.resultsAnnounceDate.management || ''}" onchange="setAnnounceDate('management', this.value)" class="w-full px-3 py-2 rounded-lg bg-forest-800 border border-forest-600 text-white text-sm outline-none">
                                </div>
                            </div>
                        </div>


                        <!-- Tab Navigation -->
                        <div class="flex flex-wrap gap-2 bg-forest-800/60 p-2 rounded-2xl border border-forest-700">
                            ${tabs.map(t => `
                                <button onclick="switchAdminTab('${t.key}')" class="px-4 py-2.5 rounded-xl text-sm font-semibold transition ${adminTab === t.key ? 'bg-gold-600 text-black shadow-lg' : 'text-gray-300 hover:bg-forest-700'}">${t.label}</button>
                            `).join('')}
                        </div>

                        ${adminTab === 'management' ? `
                        <!-- ===== TAB: management ===== -->
                        <div class="space-y-6">
                            <div class="bg-forest-800/80 p-6 rounded-2xl gold-border shadow-xl space-y-4">
                                <h3 class="font-serif text-xl font-bold text-gold-400 flex items-center justify-between">
                                    <span>🛡️ Pendaftaran management</span>
                                    <span class="text-xs bg-forest-900 px-2.5 py-1 rounded-full border border-forest-700">${appData.managementSubmissions.length} Data</span>
                                </h3>
                                <div class="space-y-3 max-h-96 overflow-y-auto pr-2">
                                    ${appData.managementSubmissions.length === 0 ? '<p class="text-sm text-gray-400 text-center py-6">Belum ada data pendaftar management.</p>' : appData.managementSubmissions.map((s, idx) => `
                                        <div class="bg-forest-900/80 p-4 rounded-xl border border-forest-700 space-y-2 text-sm">
                                            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 font-bold text-gold-400">
                                                <span>${s.name} (${s.stageName}) - ${s.pos}</span>
                                                <span class="inline-block w-fit px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${s.status === 'accepted' ? 'text-green-400 bg-green-500/10 border-green-500/50' : s.status === 'rejected' ? 'text-red-400 bg-red-500/10 border-red-500/50' : s.status === 'consideration' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/50' : 'text-gray-300 bg-gray-700/40 border-gray-500'}">${SELEKSI_STATUS_LABEL[s.status || 'pending']}</span>
                                            </div>
                                            <p class="text-xs text-gray-300"><strong>Tanggal Lahir:</strong> ${s.tanggalLahir || '-'}</p>
                                            <p class="text-xs text-gray-300"><strong>Alasan Masuk:</strong> ${s.reason}</p>
                                            <p class="text-xs text-gray-300"><strong>Niat/Minat:</strong> ${s.intent}</p>
                                            ${s.pos === 'All Editor' ? (s.fileSample ? `<div class="pt-1"><p class="text-xs text-gray-300 mb-1"><strong>Sample Editan:</strong> ${s.fileSample.name}</p>${s.fileSample.type.startsWith('image/') ? `<img src="${s.fileSample.data}" class="max-h-40 rounded-lg border border-forest-700">` : s.fileSample.type.startsWith('video/') ? `<video controls src="${s.fileSample.data}" class="w-full max-h-40 rounded-lg"></video>` : `<a href="${s.fileSample.data}" download="${s.fileSample.name}" class="text-gold-400 underline text-xs">Unduh File</a>`}</div>` : '<p class="text-xs text-gray-500 italic">Tidak ada sample editan.</p>') : ''}
                                            <div class="flex flex-wrap gap-2 pt-1 border-t border-forest-700/60">
                                                <button onclick="updateSubmissionStatus('management', ${idx}, 'accepted')" class="px-2.5 py-1 rounded-lg bg-green-600/20 hover:bg-green-600/40 text-green-400 text-xs font-semibold border border-green-600/40">Terima</button>
                                                <button onclick="updateSubmissionStatus('management', ${idx}, 'consideration')" class="px-2.5 py-1 rounded-lg bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400 text-xs font-semibold border border-yellow-600/40">Pertimbangan</button>
                                                <button onclick="updateSubmissionStatus('management', ${idx}, 'rejected')" class="px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400 text-xs font-semibold border border-red-600/40">Tolak</button>
                                                <button onclick="deleteSubmission('management', ${idx})" class="px-2.5 py-1 rounded-lg bg-gray-600/20 hover:bg-gray-600/40 text-gray-300 text-xs font-semibold border border-gray-600/40 ml-auto">Hapus</button>
                                            </div>
                                            <div class="text-[10px] text-gray-500 text-right">${s.date}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <div class="bg-forest-800/80 p-6 rounded-2xl gold-border shadow-xl space-y-4">
                                <h4 class="font-serif text-lg font-bold text-gold-400">management Semua (Database management)</h4>
                                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    ${appData.managementList.length === 0 ? '<p class="text-sm text-gray-400 col-span-full text-center py-4">Belum ada management di database.</p>' : appData.managementList.map((s, idx) => `
                                        <div class="bg-forest-900 p-4 rounded-xl border border-forest-700 space-y-2 text-center">
                                            <div class="w-16 h-16 mx-auto rounded-full overflow-hidden border border-forest-700">
                                                <img src="${s.img}" alt="${s.name}" class="w-full h-full object-cover">
                                            </div>
                                            <p class="text-xs font-bold text-gold-400">${s.name}</p>
                                            <p class="text-xs text-gray-300">${s.posisi}</p>
                                            <p class="text-xs text-gray-300">Tanggal Lahir: ${s.tanggalLahir || '-'}</p>
                                            <button type="button" onclick="deletemanagementMember(${idx})" class="w-full py-1.5 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition">Hapus</button>
                                        </div>
                                    `).join('')}
                                </div>
                                <div class="bg-forest-900 p-4 rounded-xl border border-gold-600/60 space-y-2 mt-2">
                                    <h5 class="text-xs font-bold text-gold-400 uppercase tracking-wide">+ Tambah management Baru</h5>
                                    <form onsubmit="addmanagementMember(event)" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <input type="text" id="newmanagementName" placeholder="Nama" required class="w-full px-3 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white sm:col-span-2">
                                        <input type="text" id="newmanagementPosisi" placeholder="Posisi / Divisi" required class="w-full px-3 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white">
                                        <input type="date" id="newmanagementTanggalLahir" title="Tanggal Lahir" required class="w-full px-3 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white">
                                        <input type="file" accept="image/*" id="newmanagementImg" required class="w-full px-3 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gold-600 file:text-black file:text-xs file:font-bold sm:col-span-2">
                                        <button type="submit" class="sm:col-span-2 py-2 rounded-xl bg-gold-600 hover:bg-gold-500 text-black text-xs font-bold transition">Tambah management</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        ` : ''}
                        ${adminTab === 'store' ? `
                        <!-- ===== TAB: TOKO & PESANAN ===== -->
                        <div class="space-y-6">
                            <div class="bg-forest-800/80 p-6 rounded-2xl gold-border shadow-xl space-y-4">
                                <h4 class="font-serif text-lg font-bold text-gold-400">Tambah Produk Baru</h4>
                                <p class="text-[11px] text-gray-400 -mt-2">Bisa unggah lebih dari satu foto sekaligus untuk satu produk (pilih beberapa file).</p>
                                <form onsubmit="addProduct(event)" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input type="text" id="newProdName" placeholder="Nama Produk (cth: Album Debut)" required class="sm:col-span-2 px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-sm outline-none">
                                    <textarea id="newProdDesc" placeholder="Deskripsi Produk" rows="2" class="sm:col-span-2 px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-sm outline-none"></textarea>
                                    <input type="number" id="newProdPrice" placeholder="Harga (Rp)" min="0" required class="px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-sm outline-none">
                                    <input type="number" id="newProdQty" placeholder="Stok / Qty" min="0" required class="px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-sm outline-none">
                                    <input type="file" accept="image/*" id="newProdImgs" multiple class="sm:col-span-2 px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-xs outline-none file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gold-600 file:text-black file:text-xs file:font-bold">
                                    <button type="submit" id="newProdSubmitBtn" class="sm:col-span-2 py-2.5 rounded-xl bg-gold-600 hover:bg-gold-500 text-black font-bold text-sm transition">Tambah Produk</button>
                                </form>
                            </div>

                            <div class="bg-forest-800/80 p-6 rounded-2xl gold-border shadow-xl space-y-4">
                                <h4 class="font-serif text-lg font-bold text-gold-400 flex items-center justify-between">
                                    <span>Daftar Produk</span>
                                    <span class="text-xs bg-forest-900 px-2.5 py-1 rounded-full border border-forest-700">${appData.products.length} Produk</span>
                                </h4>
                                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    ${appData.products.length === 0 ? '<p class="text-sm text-gray-400 col-span-full text-center py-4">Belum ada produk.</p>' : appData.products.map((p, idx) => `
                                        <div class="bg-forest-900 p-4 rounded-xl border border-forest-700 space-y-2">
                                            <div class="flex gap-1.5 overflow-x-auto">
                                                ${(p.images || []).map((im, i) => `
                                                    <div class="relative flex-shrink-0">
                                                        <img src="${im}" class="w-14 h-14 rounded-lg object-cover border border-forest-700">
                                                        <button type="button" onclick="deleteProductImage(${idx}, ${i})" class="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-600 hover:bg-red-500 text-white text-[10px] leading-4 font-bold">&times;</button>
                                                    </div>
                                                `).join('') || '<p class="text-[10px] text-gray-500">Belum ada foto</p>'}
                                            </div>
                                            <input type="text" value="${p.name}" id="prodName_${idx}" placeholder="Nama Produk" class="w-full px-3 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white">
                                            <textarea id="prodDesc_${idx}" rows="2" placeholder="Deskripsi" class="w-full px-3 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white">${p.description || ''}</textarea>
                                            <div class="grid grid-cols-2 gap-2">
                                                <input type="number" value="${p.price}" id="prodPrice_${idx}" placeholder="Harga" min="0" class="w-full px-3 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white">
                                                <input type="number" value="${p.qty}" id="prodQtyStock_${idx}" placeholder="Stok" min="0" class="w-full px-3 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white">
                                            </div>
                                            <input type="file" accept="image/*" id="prodImgs_${idx}" multiple class="w-full px-3 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gold-600 file:text-black file:text-[10px] file:font-bold">
                                            <p class="text-[10px] text-gray-500">Pilih foto baru untuk menambahkannya ke foto yang sudah ada.</p>
                                            <div class="flex gap-2">
                                                <button type="button" onclick="updateProduct(${idx})" class="flex-1 py-1.5 rounded bg-gold-600 hover:bg-gold-500 text-black text-xs font-bold transition">Simpan</button>
                                                <button type="button" onclick="deleteProduct(${idx})" class="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition">Hapus</button>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <div class="bg-forest-800/80 p-6 rounded-2xl gold-border shadow-xl space-y-4">
                                <h4 class="font-serif text-lg font-bold text-gold-400 flex items-center justify-between">
                                    <span>Pesanan Masuk</span>
                                    <span class="text-xs bg-forest-900 px-2.5 py-1 rounded-full border border-forest-700">${appData.orders.length} Pesanan</span>
                                </h4>
                                <div class="space-y-3 max-h-96 overflow-y-auto pr-2">
                                    ${appData.orders.length === 0 ? '<p class="text-sm text-gray-400 text-center py-6">Belum ada pesanan masuk.</p>' : appData.orders.slice().reverse().map((o) => {
                                        const idx = appData.orders.indexOf(o);
                                        return `
                                        <div class="bg-forest-900/80 p-4 rounded-xl border border-forest-700 space-y-2 text-sm">
                                            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 font-bold text-gold-400">
                                                <span>${o.buyerName} - ${o.buyerContact}</span>
                                                <span class="inline-block w-fit px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${o.status === 'selesai' ? 'text-green-400 bg-green-500/10 border-green-500/50' : 'text-yellow-400 bg-yellow-500/10 border-yellow-500/50'}">${o.status}</span>
                                            </div>
                                            <div class="text-xs text-gray-300 space-y-0.5">
                                                ${o.items.map(it => `<p>${it.qty}x ${it.name} - ${formatRupiah(it.price * it.qty)}</p>`).join('')}
                                            </div>
                                            ${o.note ? `<p class="text-xs text-gray-400"><strong>Catatan:</strong> ${o.note}</p>` : ''}
                                            <p class="text-sm font-bold text-white">Total: ${formatRupiah(o.total)}</p>
                                            <div class="flex flex-wrap gap-2 pt-1 border-t border-forest-700/60">
                                                <button onclick="updateOrderStatus(${idx}, 'selesai')" class="px-2.5 py-1 rounded-lg bg-green-600/20 hover:bg-green-600/40 text-green-400 text-xs font-semibold border border-green-600/40">Tandai Selesai</button>
                                                <button onclick="updateOrderStatus(${idx}, 'pending')" class="px-2.5 py-1 rounded-lg bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400 text-xs font-semibold border border-yellow-600/40">Tandai Pending</button>
                                                <button onclick="deleteOrder(${idx})" class="px-2.5 py-1 rounded-lg bg-gray-600/20 hover:bg-gray-600/40 text-gray-300 text-xs font-semibold border border-gray-600/40 ml-auto">Hapus</button>
                                            </div>
                                            <div class="text-[10px] text-gray-500 text-right">${o.date}</div>
                                        </div>
                                    `;}).join('')}
                                </div>
                            </div>
                        </div>
                        ` : ''}

                        ${adminTab === 'promo' ? `
                        <!-- ===== TAB: PROMO & VOUCHER ===== -->
                        <div class="space-y-6">
                            <div class="bg-forest-800/80 p-6 rounded-2xl gold-border shadow-xl space-y-4">
                                <h4 class="font-serif text-lg font-bold text-gold-400">Buat Kode Promo Baru</h4>
                                <p class="text-[11px] text-gray-400 -mt-2">Kode promo yang aktif akan otomatis muncul sebagai banner geser di halaman Toko, dan bisa dipakai pembeli saat checkout.</p>
                                <form onsubmit="addPromo(event)" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input type="text" id="newPromoCode" placeholder="Kode Promo (cth: LOREVIA10)" required class="sm:col-span-2 px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-sm outline-none uppercase">
                                    <select id="newPromoType" onchange="toggleNewPromoFields()" class="px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-sm outline-none">
                                        <option value="percent">Diskon Persen (%)</option>
                                        <option value="fixed">Potongan Nominal (Rp)</option>
                                    </select>
                                    <input type="number" id="newPromoValue" placeholder="Nilai Diskon" min="0" required class="px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-sm outline-none">
                                    <input type="number" id="newPromoMaxDiscount" placeholder="Maks. Potongan (Rp, khusus persen)" min="0" class="px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-sm outline-none">
                                    <input type="number" id="newPromoMinPurchase" placeholder="Minimal Belanja (Rp, opsional)" min="0" class="px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-sm outline-none">
                                    <input type="number" id="newPromoMaxUses" placeholder="Batas Pemakaian (opsional)" min="0" class="px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-sm outline-none">
                                    <input type="date" id="newPromoExpiry" class="px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-sm outline-none">
                                    <input type="text" id="newPromoDesc" placeholder="Deskripsi singkat (opsional)" class="sm:col-span-2 px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-sm outline-none">
                                    <button type="submit" class="sm:col-span-2 py-2.5 rounded-xl bg-gold-600 hover:bg-gold-500 text-black font-bold text-sm transition">Buat Kode Promo</button>
                                </form>
                            </div>

                            <div class="bg-forest-800/80 p-6 rounded-2xl gold-border shadow-xl space-y-4">
                                <h4 class="font-serif text-lg font-bold text-gold-400 flex items-center justify-between">
                                    <span>Daftar Kode Promo</span>
                                    <span class="text-xs bg-forest-900 px-2.5 py-1 rounded-full border border-forest-700">${(appData.promos || []).length} Kode</span>
                                </h4>
                                <div class="space-y-3">
                                    ${(appData.promos || []).length === 0 ? '<p class="text-sm text-gray-400 text-center py-6">Belum ada kode promo. Buat kode promo pertama kamu di atas!</p>' : appData.promos.map((p, idx) => {
                                        const isExpired = p.expiry && new Date() > new Date(p.expiry + 'T23:59:59');
                                        const isMaxedOut = p.maxUses && (p.usedCount || 0) >= parseInt(p.maxUses, 10);
                                        return `
                                        <div class="bg-forest-900 p-4 rounded-xl border border-forest-700 space-y-2">
                                            <div class="flex flex-wrap items-center justify-between gap-2">
                                                <span class="font-serif text-base font-bold text-gold-400">${p.code}</span>
                                                <div class="flex items-center gap-2">
                                                    ${isExpired ? '<span class="text-[10px] px-2 py-0.5 rounded-full border border-red-500/50 text-red-400 bg-red-500/10 font-bold uppercase">Kedaluwarsa</span>' : ''}
                                                    ${isMaxedOut ? '<span class="text-[10px] px-2 py-0.5 rounded-full border border-red-500/50 text-red-400 bg-red-500/10 font-bold uppercase">Habis Kuota</span>' : ''}
                                                    <span class="text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase ${p.active ? 'text-green-400 bg-green-500/10 border-green-500/50' : 'text-gray-400 bg-gray-500/10 border-gray-500/50'}">${p.active ? 'Aktif' : 'Nonaktif'}</span>
                                                </div>
                                            </div>
                                            <p class="text-xs text-gray-300">
                                                ${p.type === 'percent' ? `Diskon ${p.value}%${p.maxDiscount ? ` (maks ${formatRupiah(p.maxDiscount)})` : ''}` : `Potongan ${formatRupiah(p.value)}`}
                                                ${p.minPurchase ? ` &middot; Min. belanja ${formatRupiah(p.minPurchase)}` : ''}
                                            </p>
                                            <p class="text-[11px] text-gray-500">
                                                ${p.description ? `${p.description} &middot; ` : ''}
                                                Terpakai: ${p.usedCount || 0}${p.maxUses ? ` / ${p.maxUses}` : ''}
                                                ${p.expiry ? ` &middot; Berlaku sampai ${p.expiry}` : ''}
                                            </p>
                                            <div class="flex flex-wrap gap-2 pt-1 border-t border-forest-700/60">
                                                <button onclick="togglePromoActive(${idx})" class="px-2.5 py-1 rounded-lg ${p.active ? 'bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400 border-yellow-600/40' : 'bg-green-600/20 hover:bg-green-600/40 text-green-400 border-green-600/40'} text-xs font-semibold border">${p.active ? 'Nonaktifkan' : 'Aktifkan'}</button>
                                                <button onclick="deletePromo(${idx})" class="px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400 text-xs font-semibold border border-red-600/40 ml-auto">Hapus</button>
                                            </div>
                                        </div>
                                    `;}).join('')}
                                </div>
                            </div>
                        </div>
                        ` : ''}

                        ${adminTab === 'member' ? `
                        <!-- ===== TAB: TRAINEE / MEMBER ===== -->
                        <div class="space-y-6">
                            <div class="bg-forest-800/80 p-6 rounded-2xl gold-border shadow-xl space-y-3">
                                <h4 class="font-serif text-lg font-bold text-gold-400">✨ Pengaturan Nama Generasi (Gen)</h4>
                                <p class="text-xs text-gray-400">Nama generasi ini tampil sebagai label statistik di Beranda. Ganti sesuai generasi yang sedang aktif (mis. "Gen 1", "Gen 2", dst).</p>
                                <form onsubmit="updateGenLabel(event)" class="flex flex-col sm:flex-row gap-2">
                                    <input type="text" id="genLabelInput" value="${appData.genLabel}" required placeholder="cth: Gen 1" class="flex-1 px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-sm outline-none">
                                    <button type="submit" class="px-5 py-2.5 rounded-xl bg-gold-600 hover:bg-gold-500 text-black font-bold text-sm transition">Simpan</button>
                                </form>
                            </div>

                            <div class="bg-forest-800/80 p-6 rounded-2xl gold-border shadow-xl space-y-4">
                                <h3 class="font-serif text-xl font-bold text-gold-400 flex items-center justify-between">
                                    <span>🌱 Pendaftaran Trainee</span>
                                    <span class="text-xs bg-forest-900 px-2.5 py-1 rounded-full border border-forest-700">${appData.traineeSubmissions.length} Data</span>
                                </h3>
                                <div class="space-y-3 max-h-96 overflow-y-auto pr-2">
                                    ${appData.traineeSubmissions.length === 0 ? '<p class="text-sm text-gray-400 text-center py-6">Belum ada data pendaftar trainee.</p>' : appData.traineeSubmissions.map((t, idx) => `
                                        <div class="bg-forest-900/80 p-4 rounded-xl border border-forest-700 space-y-2 text-sm">
                                            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 font-bold text-gold-400">
                                                <span>${t.name} (${t.stageName}) - ${t.div}</span>
                                                <span class="inline-block w-fit px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${t.status === 'accepted' ? 'text-green-400 bg-green-500/10 border-green-500/50' : t.status === 'rejected' ? 'text-red-400 bg-red-500/10 border-red-500/50' : t.status === 'consideration' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/50' : 'text-gray-300 bg-gray-700/40 border-gray-500'}">${SELEKSI_STATUS_LABEL[t.status || 'pending']}</span>
                                            </div>
                                            <p class="text-xs text-gray-300"><strong>Tanggal Lahir:</strong> ${t.tanggalLahir || '-'}</p>
                                            <p class="text-xs text-gray-300"><strong>Alasan Masuk:</strong> ${t.reason}</p>
                                            <p class="text-xs text-gray-300"><strong>Niat/Minat:</strong> ${t.intent}</p>
                                            ${t.voiceSample ? `<div class="pt-1"><p class="text-xs text-gray-300 mb-1"><strong>Sample Suara:</strong> ${t.voiceSample.name}</p><audio controls src="${t.voiceSample.data}" class="w-full h-8"></audio></div>` : '<p class="text-xs text-gray-500 italic">Tidak ada sample suara.</p>'}
                                            <div class="flex flex-wrap gap-2 pt-1 border-t border-forest-700/60">
                                                <button onclick="updateSubmissionStatus('trainee', ${idx}, 'accepted')" class="px-2.5 py-1 rounded-lg bg-green-600/20 hover:bg-green-600/40 text-green-400 text-xs font-semibold border border-green-600/40">Terima</button>
                                                <button onclick="updateSubmissionStatus('trainee', ${idx}, 'consideration')" class="px-2.5 py-1 rounded-lg bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400 text-xs font-semibold border border-yellow-600/40">Pertimbangan</button>
                                                <button onclick="updateSubmissionStatus('trainee', ${idx}, 'rejected')" class="px-2.5 py-1 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400 text-xs font-semibold border border-red-600/40">Tolak</button>
                                                <button onclick="deleteSubmission('trainee', ${idx})" class="px-2.5 py-1 rounded-lg bg-gray-600/20 hover:bg-gray-600/40 text-gray-300 text-xs font-semibold border border-gray-600/40 ml-auto">Hapus</button>
                                            </div>
                                            <div class="text-[10px] text-gray-500 text-right">${t.date}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            ${getGenerations().map(genName => `
                            <div class="bg-forest-800/80 p-6 rounded-2xl gold-border shadow-xl space-y-4">
                                <h4 class="font-serif text-lg font-bold text-gold-400">✨ Container Generasi: ${genName}</h4>
                                <p class="text-xs text-gray-400">Member pada generasi ini terpisah dari generasi lain. Ubah "Nama Group" untuk memindahkan member ke generasi lain.</p>
                                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    ${appData.members.map((m, idx) => ({ m, idx })).filter(({ m }) => m.status === 'group' && m.groupName === genName).map(({ m, idx }) => renderMemberCard(m, idx)).join('')}
                                </div>
                            </div>
                            `).join('')}

                            <div class="bg-forest-800/80 p-6 rounded-2xl gold-border shadow-xl space-y-4">
                                <h4 class="font-serif text-lg font-bold text-gold-400">🌱 Container Trainee (Belum Debut)</h4>
                                <p class="text-xs text-gray-400">Ubah data lalu klik "Simpan" untuk memperbarui, atau isi "Nama Group" jika ingin memindahkan member ke Gen tertentu (akan otomatis membuat container generasi baru).</p>
                                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    ${appData.members.filter(m => m.status !== 'group').length === 0 ? '<p class="text-sm text-gray-400 col-span-full text-center py-4">Belum ada trainee.</p>' : appData.members.map((m, idx) => ({ m, idx })).filter(({ m }) => m.status !== 'group').map(({ m, idx }) => renderMemberCard(m, idx)).join('')}
                                </div>
                                <div class="bg-forest-900 p-4 rounded-xl border border-gold-600/60 space-y-2 mt-2">
                                    <h5 class="text-xs font-bold text-gold-400 uppercase tracking-wide">+ Tambah Member Baru</h5>
                                    <form onsubmit="addMember(event)" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        <input type="text" id="newMemStageName" placeholder="Nama Panggung" required class="w-full px-3 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white sm:col-span-2">
                                        <input type="date" id="newMemTanggalLahir" title="Tanggal Lahir" required class="w-full px-3 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white">
                                        <input type="text" id="newMemDivisi" placeholder="Divisi" required class="w-full px-3 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white">
                                        <select id="newMemStatus" onchange="toggleMemberGroupName()" class="w-full px-3 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white sm:col-span-2">
                                            <option value="trainee">Trainee</option>
                                            <option value="group">Group (mis. Gen 1)</option>
                                        </select>
                                        <input type="text" id="newMemGroupName" placeholder="Nama Group (cth: Gen 1)" class="w-full px-3 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white sm:col-span-2 hidden">
                                        <input type="file" accept="image/*" id="newMemImg" required class="w-full px-3 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gold-600 file:text-black file:text-xs file:font-bold sm:col-span-2">
                                        <button type="submit" class="sm:col-span-2 py-2 rounded-xl bg-gold-600 hover:bg-gold-500 text-black text-xs font-bold transition">Tambah Member</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        ` : ''}

                        ${adminTab === 'management' ? `
                        <!-- ===== DATA MANAJEMEN & STRUKTUR ===== -->
                        <div class="bg-forest-800/80 p-6 rounded-2xl gold-border shadow-xl space-y-4">
                            <h4 class="font-serif text-lg font-bold text-gold-400">Data Manajemen (Struktur & ID Card)</h4>
                            <p class="text-xs text-gray-400">Pilih "Jabatan Standar Struktur" agar Level bagan otomatis terisi sesuai hierarki resmi (Founder → Co-Founder → Manager/CFO → Coach/Editor, dst). Level 1 = paling atas, semakin besar semakin ke bawah. Yang memiliki level sama akan tampil sejajar. Bisa juga isi jabatan/level manual untuk posisi khusus lainnya.</p>
                            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                ${appData.adminStructure.map((adm, idx) => `
                                    <div class="bg-forest-900 p-4 rounded-xl border border-forest-700 space-y-2">
                                        <input type="text" value="${adm.name}" id="admName_${idx}" placeholder="Nama Admin" class="w-full px-3 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white">
                                        <select onchange="applyAdminRolePreset(this.value, 'admRole_${idx}', 'admLevel_${idx}')" class="w-full px-3 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white">
                                            <option value="">-- Pilih Jabatan Standar Struktur --</option>
                                            ${ADMIN_ROLE_PRESETS.map(p => `<option value="${p.role}">${p.role} (Level ${p.level})</option>`).join('')}
                                        </select>
                                        <input type="text" value="${adm.role}" id="admRole_${idx}" placeholder="Jabatan" class="w-full px-3 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white">
                                        <input type="number" min="1" max="9" value="${adm.level || 1}" id="admLevel_${idx}" placeholder="Level" class="w-full px-3 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white">
                                        <input type="file" accept="image/*" id="admImg_${idx}" class="w-full px-3 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gold-600 file:text-black file:text-xs file:font-bold">
                                        <div class="flex gap-2">
                                            <button type="button" onclick="updateAdminMember(${idx})" class="flex-1 py-1.5 rounded bg-gold-600 hover:bg-gold-500 text-black text-xs font-bold transition">Simpan</button>
                                            <button type="button" onclick="deleteAdminMember(${idx})" class="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition">Hapus</button>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                            <div class="bg-forest-900 p-4 rounded-xl border border-gold-600/60 space-y-2 mt-2">
                                <h5 class="text-xs font-bold text-gold-400 uppercase tracking-wide">+ Tambah Manajemen Baru</h5>
                                <form onsubmit="addAdminMember(event)" class="space-y-2">
                                    <input type="text" id="newAdmName" placeholder="Nama Admin" required class="w-full px-3 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white">
                                    <select onchange="applyAdminRolePreset(this.value, 'newAdmRole', 'newAdmLevel')" class="w-full px-3 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white">
                                        <option value="">-- Pilih Jabatan Standar Struktur --</option>
                                        ${ADMIN_ROLE_PRESETS.map(p => `<option value="${p.role}">${p.role} (Level ${p.level})</option>`).join('')}
                                    </select>
                                    <input type="text" id="newAdmRole" placeholder="Jabatan (otomatis terisi, atau isi manual)" required class="w-full px-3 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white">
                                    <input type="number" min="1" max="9" id="newAdmLevel" placeholder="Level (1 = teratas)" required class="w-full px-3 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white">
                                    <input type="file" accept="image/*" id="newAdmImg" required class="w-full px-3 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gold-600 file:text-black file:text-xs file:font-bold">
                                    <button type="submit" class="w-full py-2 rounded-xl bg-gold-600 hover:bg-gold-500 text-black text-xs font-bold transition">Tambah Manajemen</button>
                                </form>
                            </div>
                        </div>
                        ` : ''}

                        ${adminTab === 'announce' ? `
                        <!-- ===== TAB: PENGUMUMAN & PENGHARGAAN ===== -->
                        <div class="space-y-6">
                            <div class="bg-forest-800/80 p-6 rounded-2xl gold-border shadow-xl space-y-4">
                                <h4 class="font-serif text-lg font-bold text-gold-400">Pengumuman</h4>
                                <form onsubmit="addAnnouncement(event)" class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <input type="text" id="annTitle" placeholder="Judul Pengumuman" required class="px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-sm outline-none">
                                    <input type="text" id="annDate" placeholder="Tanggal (cth: 18 Mar 2026)" required class="px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-sm outline-none">
                                    <input type="text" id="annContent" placeholder="Isi Pengumuman" required class="px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-sm outline-none">
                                    <input type="file" accept="image/*" id="annPhoto" class="sm:col-span-3 px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-xs outline-none file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gold-600 file:text-black file:text-xs file:font-bold">
                                    <button type="submit" class="sm:col-span-3 py-2.5 rounded-xl bg-gold-600 hover:bg-gold-500 text-black font-bold text-sm transition">Tambah Pengumuman</button>
                                </form>
                                <div class="space-y-2 max-h-72 overflow-y-auto pr-2">
                                    ${appData.announcements.length === 0 ? '<p class="text-sm text-gray-400 text-center py-4">Belum ada pengumuman.</p>' : appData.announcements.map((ann, idx) => `
                                        <div class="bg-forest-900/80 p-3 rounded-xl border border-forest-700 flex justify-between items-center gap-3 text-sm">
                                            <div class="flex items-center gap-3">
                                                ${ann.photo ? `<img src="${ann.photo}" class="w-10 h-10 rounded object-cover">` : ''}
                                                <div>
                                                    <p class="font-bold text-gold-400">${ann.title}</p>
                                                    <p class="text-[10px] text-gray-400">${ann.date}</p>
                                                </div>
                                            </div>
                                            <button onclick="deleteAnnouncement(${idx})" class="text-red-400 hover:text-red-300 text-xs">Hapus</button>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <div class="bg-forest-800/80 p-6 rounded-2xl gold-border shadow-xl space-y-4">
                                <h4 class="font-serif text-lg font-bold text-gold-400">Penghargaan / Achievement</h4>
                                <form onsubmit="addAchievement(event)" class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <input type="text" id="achTitle" placeholder="Judul Penghargaan" required class="px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-sm outline-none">
                                    <input type="text" id="achYear" placeholder="Tahun (cth: 2026)" required class="px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-sm outline-none">
                                    <input type="text" id="achDesc" placeholder="Deskripsi" required class="px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-sm outline-none">
                                    <input type="file" accept="image/*,.pdf" id="achFile" class="sm:col-span-3 px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-xs outline-none file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gold-600 file:text-black file:text-xs file:font-bold">
                                    <p class="sm:col-span-3 text-[11px] text-gray-400 -mt-1">Unggah foto sertifikat/piala atau file bukti penghargaan (gambar/PDF).</p>
                                    <button type="submit" class="sm:col-span-3 py-2.5 rounded-xl bg-gold-600 hover:bg-gold-500 text-black font-bold text-sm transition">Tambah Penghargaan</button>
                                </form>
                                <div class="space-y-2 max-h-72 overflow-y-auto pr-2">
                                    ${appData.achievements.length === 0 ? '<p class="text-sm text-gray-400 text-center py-4">Belum ada penghargaan.</p>' : appData.achievements.map((ach, idx) => `
                                        <div class="bg-forest-900/80 p-3 rounded-xl border border-forest-700 flex justify-between items-center gap-3 text-sm">
                                            <div class="flex items-center gap-3">
                                                ${ach.file ? (ach.fileType && ach.fileType.startsWith('image/') ? `<img src="${ach.file}" class="w-10 h-10 rounded object-cover">` : `<span class="text-xl">📄</span>`) : ''}
                                                <div>
                                                    <p class="font-bold text-gold-400">${ach.title} <span class="text-[10px] text-gray-400">(${ach.year})</span></p>
                                                    <p class="text-xs text-gray-300">${ach.desc}</p>
                                                    ${ach.file && ach.fileType && !ach.fileType.startsWith('image/') ? `<a href="${ach.file}" download class="text-[10px] text-gold-400 underline">Unduh File</a>` : ''}
                                                </div>
                                            </div>
                                            <button onclick="deleteAchievement(${idx})" class="text-red-400 hover:text-red-300 text-xs">Hapus</button>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        ` : ''}

                        ${adminTab === 'video' ? `
                        <!-- ===== TAB: VIDEO PLAYLIST ===== -->
                        <div class="space-y-6">
                            <div class="bg-forest-800/80 p-6 rounded-2xl gold-border shadow-xl space-y-4">
                                <h4 class="font-serif text-lg font-bold text-gold-400 flex items-center justify-between flex-wrap gap-2">
                                    <span>Unggah Video Baru</span>
                                    <button type="button" onclick="openPlaylistModal('video')" class="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-forest-900 border border-gold-600/50 text-gold-400 hover:bg-forest-700 transition flex items-center gap-1">🎬 Kelola Playlist</button>
                                </h4>
                                <p class="text-[11px] text-gray-400 -mt-2">Unggah file video (bukan link). Orientasi (potrait/landscape) terdeteksi otomatis dari ukuran videonya.</p>
                                <form onsubmit="addVideo(event)" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input type="text" id="vidTitle" placeholder="Judul Video" required class="sm:col-span-2 px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-sm outline-none">
                                    <input type="text" id="vidDate" placeholder="Tanggal (cth: 18 Mar 2026, opsional)" class="px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-sm outline-none">
                                    <select id="vidPlaylist" class="sm:col-span-2 px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-sm outline-none">
                                        <option value="">Tanpa Playlist</option>
                                        ${appData.videoPlaylists.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
                                    </select>
                                    <input type="file" accept="video/*" id="vidFile" required class="px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-xs outline-none file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gold-600 file:text-black file:text-xs file:font-bold">
                                    <input type="file" accept="image/*" id="vidThumb" class="px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-xs outline-none file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gold-600 file:text-black file:text-xs file:font-bold" title="Thumbnail (opsional)">
                                    <button type="submit" id="vidSubmitBtn" class="sm:col-span-2 py-2.5 rounded-xl bg-gold-600 hover:bg-gold-500 text-black font-bold text-sm transition">Tambah Video</button>
                                </form>
                            </div>

                            <div class="bg-forest-800/80 p-6 rounded-2xl gold-border shadow-xl space-y-4">
                                <h4 class="font-serif text-lg font-bold text-gold-400 flex items-center justify-between">
                                    <span>Daftar Video</span>
                                    <span class="text-xs bg-forest-900 px-2.5 py-1 rounded-full border border-forest-700">${appData.videos.length} Video</span>
                                </h4>
                                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    ${appData.videos.length === 0 ? '<p class="text-sm text-gray-400 col-span-full text-center py-4">Belum ada video.</p>' : appData.videos.map((v, idx) => `
                                        <div class="bg-forest-900 rounded-xl border border-forest-700 overflow-hidden space-y-2">
                                            <div class="${v.orientation === 'portrait' ? 'aspect-[9/16]' : 'aspect-video'} bg-black">
                                                ${v.thumbnail ? `<img src="${v.thumbnail}" class="w-full h-full object-cover" alt="Thumbnail">` : `<video src="${v.data}" class="w-full h-full object-cover" muted preload="metadata"></video>`}
                                            </div>
                                            <div class="px-2 pb-2 space-y-1.5">
                                                <p class="text-[10px] text-gray-400 uppercase">${v.orientation}${v.thumbnail ? ' · Thumbnail ✓' : ''}</p>
                                                ${v.playlistId ? (() => { const pl = appData.videoPlaylists.find(p => p.id === v.playlistId); return pl ? `<span class="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full bg-gold-600/20 text-gold-400 border border-gold-600/40">🎬 ${pl.name}</span>` : ''; })() : ''}
                                                <input type="text" value="${v.title}" id="vidTitleEdit_${idx}" placeholder="Judul Video" class="w-full px-2 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white">
                                                <input type="text" value="${v.date || ''}" id="vidDateEdit_${idx}" placeholder="Tanggal" class="w-full px-2 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white">
                                                <select id="vidPlaylistEdit_${idx}" class="w-full px-2 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white">
                                                    <option value="">Tanpa Playlist</option>
                                                    ${appData.videoPlaylists.map(p => `<option value="${p.id}" ${v.playlistId === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}
                                                </select>
                                                <input type="file" accept="image/*" id="vidThumbEdit_${idx}" class="w-full px-2 py-1.5 rounded bg-forest-800 border border-forest-600 text-[10px] text-white file:mr-1 file:py-0.5 file:px-1.5 file:rounded file:border-0 file:bg-gold-600 file:text-black file:text-[10px] file:font-bold">
                                                <div class="flex gap-2">
                                                    <button type="button" onclick="updateVideo(${idx})" class="flex-1 py-1.5 rounded bg-gold-600 hover:bg-gold-500 text-black text-xs font-bold transition">Simpan</button>
                                                    <button type="button" onclick="deleteVideo(${idx})" class="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition">Hapus</button>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        ` : ''}

                        ${adminTab === 'audio' ? `
                        <!-- ===== TAB: AUDIO PLAYLIST ===== -->
                        <div class="space-y-6">
                            <div class="bg-forest-800/80 p-6 rounded-2xl gold-border shadow-xl space-y-4">
                                <h4 class="font-serif text-lg font-bold text-gold-400 flex items-center justify-between flex-wrap gap-2">
                                    <span>Unggah Audio Baru</span>
                                    <button type="button" onclick="openPlaylistModal('audio')" class="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-forest-900 border border-gold-600/50 text-gold-400 hover:bg-forest-700 transition flex items-center gap-1">🎧 Kelola Playlist</button>
                                </h4>
                                <p class="text-[11px] text-gray-400 -mt-2">Statistik jumlah pendengar akan tampil otomatis di banner audio, di dekat tombol play.</p>
                                <form onsubmit="addAudio(event)" class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input type="text" id="audTitle" placeholder="Judul Audio" required class="sm:col-span-2 px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-sm outline-none">
                                    <input type="text" id="audDate" placeholder="Tanggal (opsional)" class="px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-sm outline-none">
                                    <select id="audPlaylist" class="sm:col-span-2 px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-sm outline-none">
                                        <option value="">Tanpa Playlist</option>
                                        ${appData.audioPlaylists.map(p => `<option value="${p.id}">${p.name}</option>`).join('')}
                                    </select>
                                    <input type="file" accept="audio/*" id="audFile" required class="px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-xs outline-none file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gold-600 file:text-black file:text-xs file:font-bold">
                                    <input type="file" accept="image/*" id="audThumb" class="px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-xs outline-none file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gold-600 file:text-black file:text-xs file:font-bold" title="Thumbnail/Cover (opsional)">
                                    <button type="submit" id="audSubmitBtn" class="sm:col-span-2 py-2.5 rounded-xl bg-gold-600 hover:bg-gold-500 text-black font-bold text-sm transition">Tambah Audio</button>
                                </form>
                            </div>

                            <div class="bg-forest-800/80 p-6 rounded-2xl gold-border shadow-xl space-y-4">
                                <h4 class="font-serif text-lg font-bold text-gold-400 flex items-center justify-between">
                                    <span>Daftar Audio</span>
                                    <span class="text-xs bg-forest-900 px-2.5 py-1 rounded-full border border-forest-700">${appData.audios.length} Audio</span>
                                </h4>
                                <div class="space-y-3">
                                    ${appData.audios.length === 0 ? '<p class="text-sm text-gray-400 text-center py-4">Belum ada audio.</p>' : appData.audios.map((a, idx) => `
                                        <div class="bg-forest-900 rounded-xl border border-forest-700 p-3 space-y-2">
                                            <div class="flex flex-wrap items-center gap-3">
                                                <div class="w-12 h-12 rounded-lg overflow-hidden bg-forest-800 border border-forest-700 flex-shrink-0 flex items-center justify-center text-gold-500">
                                                    ${a.cover ? `<img src="${a.cover}" class="w-full h-full object-cover" alt="Cover">` : '🎧'}
                                                </div>
                                                <div class="flex-1 min-w-[140px]">
                                                    <p class="text-sm font-semibold text-gold-400 line-clamp-1">${a.title}</p>
                                                    <p class="text-[10px] text-gray-400">${(a.plays || 0).toLocaleString('id-ID')} pendengar${a.date ? ' · ' + a.date : ''}</p>
                                                    ${a.playlistId ? (() => { const pl = appData.audioPlaylists.find(p => p.id === a.playlistId); return pl ? `<span class="inline-block text-[9px] font-bold px-2 py-0.5 rounded-full bg-gold-600/20 text-gold-400 border border-gold-600/40 mt-1">🎧 ${pl.name}</span>` : ''; })() : ''}
                                                </div>
                                                <audio controls src="${a.data}" class="h-8 max-w-[220px] w-full sm:w-auto"></audio>
                                            </div>
                                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                <input type="text" value="${a.title}" id="audTitleEdit_${idx}" placeholder="Judul Audio" class="px-2 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white">
                                                <input type="text" value="${a.date || ''}" id="audDateEdit_${idx}" placeholder="Tanggal" class="px-2 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white">
                                                <input type="file" accept="image/*" id="audThumbEdit_${idx}" class="px-2 py-1.5 rounded bg-forest-800 border border-forest-600 text-[10px] text-white file:mr-1 file:py-0.5 file:px-1.5 file:rounded file:border-0 file:bg-gold-600 file:text-black file:text-[10px] file:font-bold">
                                            </div>
                                            <select id="audPlaylistEdit_${idx}" class="w-full px-2 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white">
                                                <option value="">Tanpa Playlist</option>
                                                ${appData.audioPlaylists.map(p => `<option value="${p.id}" ${a.playlistId === p.id ? 'selected' : ''}>${p.name}</option>`).join('')}
                                            </select>
                                            <div class="flex gap-2">
                                                <button type="button" onclick="updateAudio(${idx})" class="flex-1 py-1.5 rounded bg-gold-600 hover:bg-gold-500 text-black text-xs font-bold transition">Simpan</button>
                                                <button type="button" onclick="deleteAudio(${idx})" class="py-1.5 px-3 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition">Hapus</button>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                `;
            }
            animatePageReveal();
        }