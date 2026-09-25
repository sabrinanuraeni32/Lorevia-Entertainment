// Fungsi bersama: tema, sidebar, navigasi, keranjang, promo, playlist, modal, admin.

        // Preset jabatan struktur admin (Founder, Co-Founder, dst) agar level hierarki konsisten
        const ADMIN_ROLE_PRESETS = [
            { role: 'Founder', level: 1 },
            { role: 'Co-Founder', level: 2 },
            { role: 'Sekretaris', level: 3 },
            { role: 'Admin', level: 4 },
            { role: 'Manager', level: 4 },
            { role: 'CFO', level: 4 },
            { role: 'Coach Vocal', level: 5 },
            { role: 'Coach Rap', level: 5 },
            { role: 'Coach Dance Team', level: 5 },
            { role: 'PJ Medpart', level: 5 },
            { role: 'All Editor', level: 5 },
            { role: 'Editor Team', level: 5 },
            { role: 'Wording', level: 6 },
            { role: 'Security Team', level: 6 },
            { role: 'management Security Team', level: 7 },
            { role: 'management', level: 7 }
        ];

        function applyAdminRolePreset(value, roleInputId, levelInputId) {
            if (!value) return;
            const preset = ADMIN_ROLE_PRESETS.find(p => p.role === value);
            if (!preset) return;
            document.getElementById(roleInputId).value = preset.role;
            document.getElementById(levelInputId).value = preset.level;
        }

        // Ambil daftar nama generasi (Gen) yang sudah debut, berdasarkan groupName member berstatus 'group'.
        // Setiap generasi dianggap sebagai container terpisah (dipisah lewat nama group-nya sendiri).
        function getGenerations() {
            const names = [];
            appData.members.forEach(m => {
                if (m.status === 'group' && m.groupName && !names.includes(m.groupName)) {
                    names.push(m.groupName);
                }
            });
            return names;
        }

        function getGenerationMembers(genName) {
            return appData.members.filter(m => m.status === 'group' && m.groupName === genName);
        }

        function viewGeneration(genName) {
            selectedGeneration = genName;
            navigate('gen-members');
        }

        // Kartu edit member tunggal untuk Dasbor Admin (dipakai di dalam container per-generasi)
        function renderMemberCard(m, idx) {
            return `
                <div class="bg-forest-900 p-4 rounded-xl border border-forest-700 space-y-2 text-center">
                    <div class="w-16 h-16 mx-auto rounded-full overflow-hidden border border-forest-700">
                        <img src="${m.img}" alt="${m.stageName}" class="w-full h-full object-cover">
                    </div>
                    <input type="text" value="${m.stageName}" id="memStageName_${idx}" placeholder="Nama Panggung" class="w-full px-3 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white text-center">
                    <input type="date" value="${m.tanggalLahir || ''}" id="memTanggalLahir_${idx}" title="Tanggal Lahir" class="w-full px-3 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white text-center">
                    <input type="text" value="${m.divisi}" id="memDivisi_${idx}" placeholder="Divisi" class="w-full px-3 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white text-center">
                    <select id="memStatus_${idx}" onchange="toggleEditMemberGroupName(${idx})" class="w-full px-3 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white">
                        <option value="trainee" ${m.status !== 'group' ? 'selected' : ''}>Trainee</option>
                        <option value="group" ${m.status === 'group' ? 'selected' : ''}>Group / Gen</option>
                    </select>
                    <input type="text" value="${m.groupName || ''}" id="memGroupName_${idx}" placeholder="Nama Group (cth: Gen 1)" class="w-full px-3 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white text-center ${m.status === 'group' ? '' : 'hidden'}">
                    <input type="file" accept="image/*" id="memImg_${idx}" class="w-full px-3 py-1.5 rounded bg-forest-800 border border-forest-600 text-xs text-white file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gold-600 file:text-black file:text-xs file:font-bold">
                    <div class="flex gap-2">
                        <button type="button" onclick="updateMember(${idx})" class="flex-1 py-1.5 rounded bg-gold-600 hover:bg-gold-500 text-black text-xs font-bold transition">Simpan</button>
                        <button type="button" onclick="deleteMember(${idx})" class="px-3 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition">Hapus</button>
                    </div>
                </div>
            `;
        }

        function saveAppData() {
            try {
                localStorage.setItem('lorevia_app_data', JSON.stringify(appData));
            } catch (err) {
                console.warn('Tidak dapat menyimpan data:', err);
            }
        }

        // ===== Mode Terang / Gelap =====
        function applyThemeIcon() {
            const theme = document.documentElement.getAttribute('data-theme') || 'dark';
            const sun = document.getElementById('themeIconSun');
            const moon = document.getElementById('themeIconMoon');
            if (!sun || !moon) return;
            if (theme === 'light') {
                sun.classList.remove('hidden');
                moon.classList.add('hidden');
            } else {
                moon.classList.remove('hidden');
                sun.classList.add('hidden');
            }
        }

        function toggleTheme() {
            const html = document.documentElement;
            const current = html.getAttribute('data-theme') || 'dark';
            const next = current === 'light' ? 'dark' : 'light';
            html.setAttribute('data-theme', next);
            try { localStorage.setItem('lorevia_theme', next); } catch (e) {}
            applyThemeIcon();
        }

        function toggleSidebar() {
            const sidebar = document.getElementById('sidebar');
            const overlay = document.getElementById('sidebarOverlay');
            if (sidebar.classList.contains('translate-x-full')) {
                sidebar.classList.remove('translate-x-full');
                overlay.classList.remove('hidden');
                setTimeout(() => overlay.classList.remove('opacity-0'), 10);
            } else {
                sidebar.classList.add('translate-x-full');
                overlay.classList.add('opacity-0');
                setTimeout(() => overlay.classList.add('hidden'), 300);
            }
        }

        // Navigation Controller
        // Halaman kini terpisah menjadi file HTML masing-masing, jadi state yang dulu
        // hidup di memori disimpan sementara di sessionStorage supaya isi keranjang,
        // promo, status login admin, dan generasi terpilih tidak hilang saat pindah halaman.
        function loadState(key, fallback) {
            try {
                const raw = sessionStorage.getItem(key);
                return raw === null ? fallback : JSON.parse(raw);
            } catch (e) {
                return fallback;
            }
        }

        function persistState() {
            try {
                sessionStorage.setItem('lorevia_admin_login', JSON.stringify(isAdminLoggedIn));
                sessionStorage.setItem('lorevia_admin_tab', JSON.stringify(adminTab));
                sessionStorage.setItem('lorevia_selected_gen', JSON.stringify(selectedGeneration));
                sessionStorage.setItem('lorevia_cart', JSON.stringify(cart));
                sessionStorage.setItem('lorevia_promo', JSON.stringify(appliedPromo));
            } catch (e) {}
        }

        window.addEventListener('beforeunload', persistState);

        // Peta route -> file halaman
        const ROUTE_FILES = {
            'beranda': 'index.html',
            'gen-members': 'gen-members.html',
            'pendaftaran-trainee': 'pendaftaran-trainee.html',
            'pendaftaran-management': 'pendaftaran-management.html',
            'cek-hasil': 'cek-hasil.html',
            'about': 'about.html',
            'member': 'member.html',
            'toko': 'toko.html',
            'checkout': 'checkout.html',
            'pengumuman': 'pengumuman.html',
            'achievement': 'achievement.html',
            'struktur': 'struktur.html',
            'guestbox': 'guestbox.html',
            'video-playlist': 'video-playlist.html',
            'audio-playlist': 'audio-playlist.html',
            'admin-dashboard': 'admin-dashboard.html'
        };

        let currentRoute = window.PAGE_ROUTE || 'beranda';
        let isAdminLoggedIn = loadState('lorevia_admin_login', false);
        let adminTab = loadState('lorevia_admin_tab', 'management');
        let selectedGeneration = loadState('lorevia_selected_gen', null);
        let cart = loadState('lorevia_cart', []);
        let appliedPromo = loadState('lorevia_promo', null); // { code, type: 'percent'|'fixed', value, discount }
        let promoBannerIdx = 0;
        let promoBannerTimer = null;
        let productActiveImg = {};
        let currentVideoFilter = null;
        let currentAudioFilter = null;

        function setVideoFilter(id) {
            currentVideoFilter = id;
            renderView();
        }

        function setAudioFilter(id) {
            currentAudioFilter = id;
            renderView();
        }

        function switchAdminTab(tab) {
            adminTab = tab;
            renderView();
        }

        function toggleRegistration(type) {
            if (type !== 'trainee' && type !== 'management') return;
            appData.registrationOpen[type] = !appData.registrationOpen[type];
            saveAppData();
            renderView();
        }

        function setAnnounceDate(type, value) {
            if (type !== 'trainee' && type !== 'management') return;
            appData.resultsAnnounceDate[type] = value;
            saveAppData();
            renderView();
        }

        // Cek apakah hasil seleksi tipe tertentu sudah boleh dilihat pendaftar.
        // Kalau admin belum pernah set tanggalnya, dianggap belum digembok (perilaku lama tetap jalan).
        function isResultAnnounced(type) {
            const dateStr = appData.resultsAnnounceDate && appData.resultsAnnounceDate[type];
            if (!dateStr) return true;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const announceDate = new Date(dateStr + 'T00:00:00');
            return today >= announceDate;
        }

        function navigate(route) {
            if (route === 'admin-dashboard' && !isAdminLoggedIn) {
                triggerAdminModal();
                return;
            }
            if (route === 'pendaftaran-trainee' && !appData.registrationOpen.trainee) {
                alert('Maaf pendaftaran telah tutup, see you next time!');
            }
            if (route === 'pendaftaran-management' && !appData.registrationOpen.management) {
                alert('Maaf pendaftaran telah tutup, see you next time!');
            }
            // Kalau sudah berada di halaman yang sama, cukup render ulang seperti sebelumnya.
            if (route === currentRoute) {
                renderView();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
            const file = ROUTE_FILES[route];
            if (!file) return;
            persistState();
            window.location.href = file;
        }

        // Animasikan teks & gambar muncul satu per satu setiap kali halaman/tampilan berganti
        function animatePageReveal() {
            const content = document.getElementById('appContent');
            if (!content) return;
            const wrapper = content.firstElementChild;
            if (!wrapper) return;

            let targets = Array.from(wrapper.children);
            if (targets.length === 0) targets = [wrapper];

            // Kalau cuma ada 1-2 blok besar, turun satu level lagi supaya
            // animasinya benar-benar terasa "satu per satu", bukan sekali blok besar
            if (targets.length <= 2) {
                const nested = [];
                targets.forEach(t => nested.push(...Array.from(t.children)));
                if (nested.length > targets.length) targets = nested;
            }

            targets.forEach((el, i) => {
                el.classList.remove('reveal-item');
                void el.offsetWidth; // reset supaya animasi jalan lagi tiap ganti halaman
                el.classList.add('reveal-item');
                el.style.animationDelay = `${Math.min(i, 10) * 90}ms`;
            });

            // Gambar dianimasikan tersendiri (fade + scale) agar makin terasa hidup
            const imgs = wrapper.querySelectorAll('img');
            imgs.forEach((img, i) => {
                img.classList.remove('reveal-img');
                void img.offsetWidth;
                img.classList.add('reveal-img');
                img.style.animationDelay = `${Math.min(i, 12) * 80}ms`;
            });
        }

        // Render Views

        // Form Submission Handlers
        // Batas ukuran file upload (voice sample & sample hasil edit) — sejalan dengan
        // batas maksimal blob 50MB di Google Apps Script. Mengecek SEBELUM file
        // diproses jadi base64, supaya file kegedean tidak sampai bikin tab browser
        // kehabisan memori (base64 membengkakkan ukuran file sekitar 33%).
        const MAX_UPLOAD_SIZE_MB = 50;
        function isFileSizeOk(file) {
            if (!file) return true;
            return file.size <= MAX_UPLOAD_SIZE_MB * 1024 * 1024;
        }

        function readFileAsBase64(file) {
            return new Promise((resolve, reject) => {
                if (!file) { resolve(null); return; }
                const reader = new FileReader();
                reader.onload = () => resolve({ name: file.name, type: file.type, data: reader.result });
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        }

        // Baca banyak file gambar sekaligus (untuk foto produk toko) dan kembalikan array data URL
        async function readFilesAsBase64Array(fileList) {
            const files = Array.from(fileList || []);
            const results = [];
            for (const f of files) {
                const uploaded = await readFileAsBase64(f);
                if (uploaded) results.push(uploaded.data);
            }
            return results;
        }

        async function uploadMediaFiles(fileList, prefix) {
            const files = Array.from(fileList || []);
            if (files.length === 0) return [];
            const encodedFiles = [];
            for (const file of files) {
                const encoded = await readFileAsBase64(file);
                if (encoded) encodedFiles.push(encoded);
            }
            const result = await kirimKeSheet('media', { files: encodedFiles, prefix });
            if (!result.ok) throw new Error(result.error || 'Gagal mengunggah media ke Google Drive');
            return result.urls || [];
        }

        // ===== TOKO: format harga & keranjang belanja =====
        function formatRupiah(num) {
            const n = parseInt(num, 10) || 0;
            return 'Rp' + n.toLocaleString('id-ID');
        }

        function setProductImg(idx, imgIdx) {
            productActiveImg[idx] = imgIdx;
            renderView();
        }

        function updateCartBadge() {
            const btn = document.getElementById('cartFloatBtn');
            const count = document.getElementById('cartFloatCount');
            if (!btn || !count) return;
            const total = cart.reduce((a, c) => a + c.qty, 0);
            count.textContent = total;
            if (total > 0 && currentRoute !== 'checkout') {
                btn.classList.remove('hidden');
            } else {
                btn.classList.add('hidden');
            }
        }

        let stockPopupTimer = null;
        function showStockPopup(message) {
            const overlay = document.getElementById('stockPopupOverlay');
            const box = document.getElementById('stockPopupBox');
            const msg = document.getElementById('stockPopupMsg');
            if (!overlay || !box || !msg) return;
            msg.textContent = message;
            overlay.classList.remove('hidden');
            overlay.classList.add('flex');
            box.classList.remove('stock-popup-in', 'stock-popup-out');
            void box.offsetWidth;
            box.classList.add('stock-popup-in');
            if (stockPopupTimer) clearTimeout(stockPopupTimer);
            stockPopupTimer = setTimeout(closeStockPopup, 3000);
        }

        function closeStockPopup() {
            const overlay = document.getElementById('stockPopupOverlay');
            const box = document.getElementById('stockPopupBox');
            if (!overlay || !box) return;
            if (stockPopupTimer) { clearTimeout(stockPopupTimer); stockPopupTimer = null; }
            box.classList.remove('stock-popup-in');
            box.classList.add('stock-popup-out');
            setTimeout(() => {
                overlay.classList.add('hidden');
                overlay.classList.remove('flex');
            }, 180);
        }

        // Modal notifikasi bertema (pengganti alert() bawaan browser).
        // type: 'success' | 'error' | 'info' — nentuin ikon & judul default.
        // onClose (opsional): dipanggil sekali saat modal ditutup (klik Oke/backdrop).
        let notifOnClose = null;
        function showNotif(type, message, title, onClose) {
            const overlay = document.getElementById('notifModal');
            const icon = document.getElementById('notifIcon');
            const titleEl = document.getElementById('notifTitle');
            const msg = document.getElementById('notifMsg');
            if (!overlay || !icon || !titleEl || !msg) {
                alert(message);
                if (onClose) onClose();
                return;
            }

            const presets = {
                success: { icon: '🎉', title: 'Berhasil' },
                error: { icon: '⚠️', title: 'Gagal' },
                info: { icon: 'ℹ️', title: 'Info' }
            };
            const preset = presets[type] || presets.info;
            icon.textContent = preset.icon;
            titleEl.textContent = title || preset.title;
            msg.textContent = message;
            notifOnClose = onClose || null;

            overlay.classList.remove('hidden');
            overlay.classList.add('flex');
        }

        function closeNotif() {
            const overlay = document.getElementById('notifModal');
            if (!overlay) return;
            overlay.classList.add('hidden');
            overlay.classList.remove('flex');
            const cb = notifOnClose;
            notifOnClose = null;
            if (cb) cb();
        }


        function addToCart(idx) {
            const p = appData.products[idx];
            if (!p) return;
            const stock = parseInt(p.qty, 10) || 0;
            if (stock <= 0) { showStockPopup('Maaf anda telah melampaui stok penjualan kami, terima kasih'); return; }
            const qtyInput = document.getElementById(`prodQty_${idx}`);
            let qty = parseInt(qtyInput.value, 10) || 1;
            if (qty < 1) qty = 1;
            const existing = cart.find(c => c.productId === p.id);
            const currentCartQty = existing ? existing.qty : 0;
            if (currentCartQty + qty > stock) {
                showStockPopup('Maaf anda telah melampaui stok penjualan kami, terima kasih');
                return;
            }
            if (existing) {
                existing.qty += qty;
            } else {
                cart.push({ productId: p.id, name: p.name, price: parseInt(p.price, 10) || 0, qty, image: (p.images && p.images[0]) || '' });
            }
            updateCartBadge();
            alert(`${p.name} ditambahkan ke keranjang!`);
        }

        function changeCartQty(idx, delta) {
            if (!cart[idx]) return;
            if (delta > 0) {
                const product = appData.products.find(p => p.id === cart[idx].productId);
                const stock = product ? (parseInt(product.qty, 10) || 0) : Infinity;
                if (cart[idx].qty + delta > stock) {
                    showStockPopup('Maaf anda telah melampaui stok penjualan kami, terima kasih');
                    return;
                }
            }
            cart[idx].qty += delta;
            if (cart[idx].qty <= 0) {
                cart.splice(idx, 1);
            }
            renderView();
        }

        function removeFromCart(idx) {
            cart.splice(idx, 1);
            renderView();
        }

        function submitOrder(e) {
            e.preventDefault();
            if (cart.length === 0) return;
            const buyerName = document.getElementById('orderName').value;
            const buyerContact = document.getElementById('orderContact').value;
            const note = document.getElementById('orderNote').value;
            const subtotal = cart.reduce((a, c) => a + (c.price * c.qty), 0);
            const discount = getPromoDiscount(subtotal);
            const total = Math.max(0, subtotal - discount);

            // Kurangi stok produk sesuai jumlah yang dibeli
            cart.forEach(c => {
                const product = appData.products.find(p => p.id === c.productId);
                if (product) {
                    const currentStock = parseInt(product.qty, 10) || 0;
                    product.qty = Math.max(0, currentStock - c.qty);
                }
            });

            // Tambah jumlah pemakaian kode promo jika dipakai
            if (appliedPromo) {
                const promo = appData.promos.find(p => p.code === appliedPromo.code);
                if (promo) {
                    promo.usedCount = (promo.usedCount || 0) + 1;
                }
            }

            appData.orders.push({
                id: Date.now(),
                items: cart.map(c => ({ name: c.name, price: c.price, qty: c.qty })),
                subtotal,
                discount,
                promoCode: appliedPromo ? appliedPromo.code : null,
                total,
                buyerName,
                buyerContact,
                note,
                status: 'pending',
                date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
            });
            saveAppData();
            cart = [];
            appliedPromo = null;
            alert('Pesanan berhasil dikonfirmasi! Jangan lupa kirim bukti screenshot pembayaran ke admin kami yaa.');
            navigate('toko');
        }

        // ===== TOKO: kode promo / voucher =====
        function getActivePromos() {
            const now = new Date();
            return (appData.promos || []).filter(p => {
                if (!p.active) return false;
                if (p.expiry) {
                    const exp = new Date(p.expiry + 'T23:59:59');
                    if (now > exp) return false;
                }
                if (p.maxUses && (p.usedCount || 0) >= parseInt(p.maxUses, 10)) return false;
                return true;
            });
        }

        function getPromoDiscount(subtotal) {
            if (!appliedPromo) return 0;
            const promo = (appData.promos || []).find(p => p.code === appliedPromo.code);
            if (!promo || !promo.active) return 0;
            let discount = 0;
            if (promo.type === 'percent') {
                discount = Math.round(subtotal * (parseFloat(promo.value) || 0) / 100);
                if (promo.maxDiscount) discount = Math.min(discount, parseInt(promo.maxDiscount, 10));
            } else {
                discount = parseInt(promo.value, 10) || 0;
            }
            return Math.min(discount, subtotal);
        }

        function applyPromoCode(e) {
            e.preventDefault();
            const errBox = document.getElementById('promoErrorMsg');
            const input = document.getElementById('promoCodeInput');
            const codeRaw = input.value.trim();
            const code = codeRaw.toUpperCase();
            const showError = (msg) => {
                if (errBox) {
                    errBox.textContent = msg;
                    errBox.classList.remove('hidden');
                }
            };
            if (!code) { showError('Silakan masukkan kode promo terlebih dahulu.'); return; }

            const promo = (appData.promos || []).find(p => p.code.toUpperCase() === code);
            if (!promo) { showError('Kode promo tidak ditemukan.'); return; }
            if (!promo.active) { showError('Kode promo ini sudah tidak aktif.'); return; }
            if (promo.expiry) {
                const exp = new Date(promo.expiry + 'T23:59:59');
                if (new Date() > exp) { showError('Kode promo ini sudah kedaluwarsa.'); return; }
            }
            if (promo.maxUses && (promo.usedCount || 0) >= parseInt(promo.maxUses, 10)) {
                showError('Kode promo ini sudah mencapai batas pemakaian.');
                return;
            }
            const subtotal = cart.reduce((a, c) => a + (c.price * c.qty), 0);
            if (promo.minPurchase && subtotal < parseInt(promo.minPurchase, 10)) {
                showError(`Minimal belanja untuk kode ini adalah ${formatRupiah(promo.minPurchase)}.`);
                return;
            }

            appliedPromo = { code: promo.code, type: promo.type, value: promo.value };
            renderView();
        }

        function removePromoCode() {
            appliedPromo = null;
            renderView();
        }

        // ===== TOKO: banner promo geser otomatis =====
        function stopPromoBanner() {
            if (promoBannerTimer) {
                clearInterval(promoBannerTimer);
                promoBannerTimer = null;
            }
        }

        function renderPromoBannerSlide() {
            const track = document.getElementById('promoBannerTrack');
            if (!track) return;
            const promos = getActivePromos();
            if (promos.length === 0) return;
            if (promoBannerIdx >= promos.length) promoBannerIdx = 0;
            const p = promos[promoBannerIdx];
            const desc = p.type === 'percent'
                ? `Diskon ${parseFloat(p.value) || 0}%${p.maxDiscount ? ` (maks ${formatRupiah(p.maxDiscount)})` : ''}`
                : `Potongan ${formatRupiah(p.value)}`;
            track.innerHTML = `
                <div class="stock-popup-in absolute inset-0 flex items-center justify-between gap-3 px-4 md:px-5">
                    <div class="flex items-center gap-3 min-w-0">
                        <span class="text-xl flex-shrink-0">🎉</span>
                        <div class="min-w-0">
                            <p class="text-sm font-bold text-gold-400 truncate">Kode: ${p.code} — ${desc}</p>
                            <p class="text-[11px] text-gray-300 truncate">${p.description || 'Gunakan kode ini saat checkout untuk mendapatkan potongan harga!'}</p>
                        </div>
                    </div>
                    ${promos.length > 1 ? `<span class="text-[10px] text-gray-400 flex-shrink-0">${promoBannerIdx + 1}/${promos.length}</span>` : ''}
                </div>
            `;
        }

        function startPromoBanner() {
            stopPromoBanner();
            promoBannerIdx = 0;
            const promos = getActivePromos();
            if (promos.length === 0) return;
            renderPromoBannerSlide();
            if (promos.length > 1) {
                promoBannerTimer = setInterval(() => {
                    promoBannerIdx = (promoBannerIdx + 1) % promos.length;
                    renderPromoBannerSlide();
                }, 3500);
            }
        }

        // ===== ADMIN: kelola produk toko =====
        // ===== ADMIN: kelola kode promo / voucher =====
        function toggleNewPromoFields() {
            // Placeholder untuk pengembangan lanjutan (mis. sembunyikan field maks diskon jika tipe fixed)
        }

        function addPromo(e) {
            e.preventDefault();
            const codeInput = document.getElementById('newPromoCode');
            const code = codeInput.value.trim().toUpperCase();
            const type = document.getElementById('newPromoType').value;
            const value = parseFloat(document.getElementById('newPromoValue').value) || 0;
            const maxDiscount = parseInt(document.getElementById('newPromoMaxDiscount').value, 10) || 0;
            const minPurchase = parseInt(document.getElementById('newPromoMinPurchase').value, 10) || 0;
            const maxUses = parseInt(document.getElementById('newPromoMaxUses').value, 10) || 0;
            const expiry = document.getElementById('newPromoExpiry').value;
            const description = document.getElementById('newPromoDesc').value;

            if (!code) { alert('Kode promo tidak boleh kosong.'); return; }
            if (!appData.promos) appData.promos = [];
            if (appData.promos.some(p => p.code.toUpperCase() === code)) {
                alert('Kode promo ini sudah ada, gunakan kode lain.');
                return;
            }

            appData.promos.push({
                id: Date.now(),
                code,
                type,
                value,
                maxDiscount: type === 'percent' ? maxDiscount : 0,
                minPurchase,
                maxUses,
                expiry,
                description,
                active: true,
                usedCount: 0
            });
            saveAppData();
            alert('Kode promo baru berhasil dibuat!');
            renderView();
        }

        function togglePromoActive(idx) {
            if (!appData.promos[idx]) return;
            appData.promos[idx].active = !appData.promos[idx].active;
            saveAppData();
            renderView();
        }

        function deletePromo(idx) {
            if (confirm('Apakah Anda yakin ingin menghapus kode promo ini?')) {
                appData.promos.splice(idx, 1);
                saveAppData();
                renderView();
            }
        }

        async function addProduct(e) {
            e.preventDefault();
            const name = document.getElementById('newProdName').value;
            const description = document.getElementById('newProdDesc').value;
            const price = parseInt(document.getElementById('newProdPrice').value, 10) || 0;
            const qty = parseInt(document.getElementById('newProdQty').value, 10) || 0;
            const files = document.getElementById('newProdImgs').files;
            const btn = document.getElementById('newProdSubmitBtn');
            btn.disabled = true;
            btn.textContent = 'Mengunggah...';
            try {
                const images = await uploadMediaFiles(files, 'produk_' + Date.now());
                appData.products.push({ id: Date.now(), name, description, price, qty, images });
                saveAppData();
                alert('Produk baru berhasil ditambahkan!');
                renderView();
            } catch (err) {
                alert('Gagal mengunggah produk. Foto mungkin terlalu besar untuk disimpan.');
                btn.disabled = false;
                btn.textContent = 'Tambah Produk';
            }
        }

        async function updateProduct(idx) {
            const name = document.getElementById(`prodName_${idx}`).value;
            const description = document.getElementById(`prodDesc_${idx}`).value;
            const price = parseInt(document.getElementById(`prodPrice_${idx}`).value, 10) || 0;
            const qty = parseInt(document.getElementById(`prodQtyStock_${idx}`).value, 10) || 0;
            const files = document.getElementById(`prodImgs_${idx}`).files;
            let images = appData.products[idx].images || [];
            if (files && files.length > 0) {
                const newImages = await uploadMediaFiles(files, 'produk_' + Date.now());
                images = images.concat(newImages);
            }
            appData.products[idx] = { ...appData.products[idx], name, description, price, qty, images };
            saveAppData();
            alert('Produk berhasil diperbarui!');
            renderView();
        }

        function deleteProductImage(prodIdx, imgIdx) {
            appData.products[prodIdx].images.splice(imgIdx, 1);
            saveAppData();
            renderView();
        }

        function deleteProduct(idx) {
            if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
                appData.products.splice(idx, 1);
                saveAppData();
                renderView();
            }
        }

        function updateOrderStatus(idx, status) {
            appData.orders[idx].status = status;
            saveAppData();
            renderView();
        }

        function deleteOrder(idx) {
            if (confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) {
                appData.orders.splice(idx, 1);
                saveAppData();
                renderView();
            }
        }

        // Detect a video file's orientation (portrait/landscape) from its real dimensions
        function detectVideoOrientation(file) {
            return new Promise((resolve) => {
                const url = URL.createObjectURL(file);
                const vid = document.createElement('video');
                vid.preload = 'metadata';
                vid.onloadedmetadata = () => {
                    const orientation = vid.videoHeight > vid.videoWidth ? 'portrait' : 'landscape';
                    URL.revokeObjectURL(url);
                    resolve(orientation);
                };
                vid.onerror = () => {
                    URL.revokeObjectURL(url);
                    resolve('landscape');
                };
                vid.src = url;
            });
        }

        // ===== Playlist Modal (Video & Audio) =====
        let playlistModalType = null; // 'video' | 'audio'
        let showAddPlaylistForm = false;

        function openPlaylistModal(type) {
            playlistModalType = type;
            showAddPlaylistForm = false;
            renderPlaylistModal();
            document.getElementById('playlistModal').classList.remove('hidden');
        }

        function closePlaylistModal() {
            document.getElementById('playlistModal').classList.add('hidden');
            playlistModalType = null;
            showAddPlaylistForm = false;
        }

        function toggleAddPlaylistForm() {
            showAddPlaylistForm = !showAddPlaylistForm;
            renderPlaylistModal();
        }

        function renderPlaylistModal() {
            const type = playlistModalType;
            if (!type) return;
            const key = type === 'video' ? 'videoPlaylists' : 'audioPlaylists';
            const list = appData[key];
            const icon = type === 'video' ? '🎬' : '🎧';
            const label = type === 'video' ? 'Video' : 'Audio';
            const container = document.getElementById('playlistModalContent');
            container.innerHTML = `
                <h3 class="font-serif text-2xl font-bold gold-text mb-1 pr-8">${icon} Playlist ${label}</h3>
                <p class="text-xs text-gray-400 mb-4">Kelola koleksi playlist untuk ${label.toLowerCase()}.</p>

                ${!showAddPlaylistForm ? `
                    <button type="button" onclick="toggleAddPlaylistForm()" class="w-full mb-4 py-2.5 rounded-xl bg-gold-600 hover:bg-gold-500 text-black font-bold text-sm transition flex items-center justify-center gap-1.5">
                        <span class="text-lg leading-none">+</span> Tambah Playlist Baru
                    </button>
                ` : `
                    <form onsubmit="savePlaylist(event)" class="space-y-3 mb-5 bg-forest-800/80 p-4 rounded-xl border border-forest-700">
                        <input type="text" id="newPlaylistName" placeholder="Nama Playlist" required class="w-full px-3 py-2.5 rounded-lg bg-forest-900 border border-forest-600 text-white text-sm outline-none">
                        <textarea id="newPlaylistDesc" rows="2" placeholder="Deskripsi (opsional)" class="w-full px-3 py-2.5 rounded-lg bg-forest-900 border border-forest-600 text-white text-sm outline-none"></textarea>
                        <input type="file" accept="image/*" id="newPlaylistImg" class="w-full px-3 py-2 rounded-lg bg-forest-900 border border-forest-600 text-white text-xs outline-none file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-gold-600 file:text-black file:text-xs file:font-bold">
                        <div class="flex gap-2 pt-1">
                            <button type="button" onclick="toggleAddPlaylistForm()" class="flex-1 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-semibold transition">Batal</button>
                            <button type="submit" class="flex-1 py-2 rounded-lg bg-gold-600 hover:bg-gold-500 text-black text-xs font-bold transition">Simpan Playlist</button>
                        </div>
                    </form>
                `}

                <div class="space-y-2 max-h-72 overflow-y-auto pr-1">
                    ${list.length === 0 ? '<p class="text-sm text-gray-400 text-center py-6">Belum ada playlist.</p>' : list.map((p, idx) => `
                        <div class="flex items-center gap-3 bg-forest-800/80 p-3 rounded-xl border border-forest-700">
                            <div class="w-12 h-12 rounded-lg overflow-hidden bg-forest-900 border border-forest-700 flex-shrink-0 flex items-center justify-center text-gold-500">
                                ${p.image ? `<img src="${p.image}" class="w-full h-full object-cover" alt="${p.name}">` : icon}
                            </div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-semibold text-gold-400 truncate">${p.name}</p>
                                ${p.desc ? `<p class="text-[11px] text-gray-400 line-clamp-2">${p.desc}</p>` : ''}
                            </div>
                            <button type="button" onclick="deletePlaylist(${idx})" class="px-2.5 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400 text-[11px] font-semibold border border-red-600/40 flex-shrink-0">Hapus</button>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        async function savePlaylist(e) {
            e.preventDefault();
            const type = playlistModalType;
            if (!type) return;
            const key = type === 'video' ? 'videoPlaylists' : 'audioPlaylists';
            const name = document.getElementById('newPlaylistName').value.trim();
            const desc = document.getElementById('newPlaylistDesc').value.trim();
            const imgFile = document.getElementById('newPlaylistImg').files[0];
            if (!name) return;
            let image = '';
            let cover = null;
            if (imgFile) {
                cover = await readFileAsBase64(imgFile);
            }
            const playlistId = 'pl_' + Date.now();
            const result = await kirimKeSheet('playlist', {
                mediaType: type,
                recordType: 'playlist',
                id: playlistId,
                name,
                desc,
                cover
            });
            if (!result.ok) {
                alert('Playlist gagal disimpan ke database: ' + (result.error || 'error tidak diketahui'));
                return;
            }
            appData[key].push({ id: playlistId, name, desc, image: result.coverUrl || image });
            saveAppData();
            showAddPlaylistForm = false;
            renderPlaylistModal();
            renderView();
        }

        function deletePlaylist(idx) {
            const type = playlistModalType;
            if (!type) return;
            if (!confirm('Hapus playlist ini? Video/audio yang tergabung akan menjadi tanpa playlist.')) return;
            const key = type === 'video' ? 'videoPlaylists' : 'audioPlaylists';
            const removed = appData[key][idx];
            appData[key].splice(idx, 1);
            const itemsKey = type === 'video' ? 'videos' : 'audios';
            appData[itemsKey].forEach(item => { if (item.playlistId === removed.id) item.playlistId = null; });
            saveAppData();
            renderPlaylistModal();
            renderView();
        }

        async function addVideo(e) {
            e.preventDefault();
            const title = document.getElementById('vidTitle').value;
            const date = document.getElementById('vidDate').value;
            const playlistId = document.getElementById('vidPlaylist').value || null;
            const file = document.getElementById('vidFile').files[0];
            const thumbFile = document.getElementById('vidThumb').files[0];
            if (!file) return;
            const btn = document.getElementById('vidSubmitBtn');
            btn.disabled = true;
            btn.textContent = 'Mengunggah...';
            try {
                const orientation = await detectVideoOrientation(file);
                const uploaded = await readFileAsBase64(file);
                const uploadedThumb = thumbFile ? await readFileAsBase64(thumbFile) : null;
                const videoId = 'vid_' + Date.now();
                const result = await kirimKeSheet('playlist', {
                    mediaType: 'video',
                    recordType: 'item',
                    id: videoId,
                    title,
                    date,
                    playlistId,
                    orientation,
                    media: uploaded,
                    cover: uploadedThumb
                });
                if (!result.ok) throw new Error(result.error || 'Gagal menyimpan video ke database');
                appData.videos.unshift({ id: videoId, title, date, playlistId, orientation, data: result.mediaUrl, fileType: uploaded.type, thumbnail: result.coverUrl || '', views: 0, likes: 0, comments: [] });
                saveAppData();
                renderView();
            } catch (err) {
                alert('Gagal mengunggah video. File mungkin terlalu besar untuk disimpan.');
                btn.disabled = false;
                btn.textContent = 'Tambah Video';
            }
        }

        async function updateVideo(idx) {
            const title = document.getElementById(`vidTitleEdit_${idx}`).value;
            const date = document.getElementById(`vidDateEdit_${idx}`).value;
            const playlistId = document.getElementById(`vidPlaylistEdit_${idx}`).value || null;
            const thumbFile = document.getElementById(`vidThumbEdit_${idx}`).files[0];
            let thumbnail = appData.videos[idx].thumbnail || '';
            if (thumbFile) {
                const urls = await uploadMediaFiles([thumbFile], 'video_cover_' + Date.now());
                thumbnail = urls[0] || thumbnail;
            }
            appData.videos[idx] = { ...appData.videos[idx], title, date, playlistId, thumbnail };
            saveAppData();
            alert('Video berhasil diperbarui!');
            renderView();
        }

        function deleteVideo(idx) {
            if (confirm('Apakah Anda yakin ingin menghapus video ini?')) {
                appData.videos.splice(idx, 1);
                saveAppData();
                renderView();
            }
        }

        async function addAudio(e) {
            e.preventDefault();
            const title = document.getElementById('audTitle').value;
            const date = document.getElementById('audDate').value;
            const playlistId = document.getElementById('audPlaylist').value || null;
            const file = document.getElementById('audFile').files[0];
            const thumbFile = document.getElementById('audThumb').files[0];
            if (!file) return;
            const btn = document.getElementById('audSubmitBtn');
            btn.disabled = true;
            btn.textContent = 'Mengunggah...';
            try {
                const uploaded = await readFileAsBase64(file);
                const uploadedThumb = thumbFile ? await readFileAsBase64(thumbFile) : null;
                const audioId = 'aud_' + Date.now();
                const result = await kirimKeSheet('playlist', {
                    mediaType: 'audio',
                    recordType: 'item',
                    id: audioId,
                    title,
                    date,
                    playlistId,
                    media: uploaded,
                    cover: uploadedThumb
                });
                if (!result.ok) throw new Error(result.error || 'Gagal menyimpan audio ke database');
                appData.audios.unshift({ id: audioId, title, date, playlistId, data: result.mediaUrl, fileType: uploaded.type, cover: result.coverUrl || '', plays: 0, likes: 0, comments: [] });
                saveAppData();
                renderView();
            } catch (err) {
                alert('Gagal mengunggah audio. File mungkin terlalu besar untuk disimpan.');
                btn.disabled = false;
                btn.textContent = 'Tambah Audio';
            }
        }

        async function updateAudio(idx) {
            const title = document.getElementById(`audTitleEdit_${idx}`).value;
            const date = document.getElementById(`audDateEdit_${idx}`).value;
            const playlistId = document.getElementById(`audPlaylistEdit_${idx}`).value || null;
            const thumbFile = document.getElementById(`audThumbEdit_${idx}`).files[0];
            let cover = appData.audios[idx].cover || '';
            if (thumbFile) {
                const urls = await uploadMediaFiles([thumbFile], 'audio_cover_' + Date.now());
                cover = urls[0] || cover;
            }
            appData.audios[idx] = { ...appData.audios[idx], title, date, playlistId, cover };
            saveAppData();
            alert('Audio berhasil diperbarui!');
            renderView();
        }

        function deleteAudio(idx) {
            if (confirm('Apakah Anda yakin ingin menghapus audio ini?')) {
                appData.audios.splice(idx, 1);
                saveAppData();
                renderView();
            }
        }

        // ===== TikTok-style Video Feed =====
        let ttFeedList = [];
        let ttObserver = null;

        function ttSlideMarkup(idx) {
            const v = appData.videos[idx];
            return `
                <div class="tt-slide relative w-full bg-black flex items-center justify-center" data-idx="${idx}">
                    <video src="${v.data}" class="tt-video" loop playsinline webkit-playsinline="true"></video>
                    <div class="absolute inset-0" onclick="ttTogglePlay(${idx})"></div>
                    <button type="button" onclick="event.stopPropagation(); ttToggleMute(${idx})" id="ttMuteBtn_${idx}" class="absolute top-4 left-4 z-10 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center text-lg">🔊</button>
                    <div class="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none"></div>
                    <div class="absolute left-4 right-20 bottom-6 text-white pointer-events-none">
                        <p class="font-serif font-bold text-sm md:text-base drop-shadow">${v.title}</p>
                        ${v.date ? `<p class="text-[11px] text-gray-300 mt-0.5">🗓️ ${v.date}</p>` : ''}
                    </div>
                    <div class="absolute right-3 bottom-8 flex flex-col items-center gap-5 text-white">
                        <button type="button" onclick="event.stopPropagation(); ttToggleLike(${idx})" class="flex flex-col items-center gap-1">
                            <span id="ttLikeIcon_${idx}" class="text-2xl drop-shadow">${v._liked ? '❤️' : '🤍'}</span>
                            <span id="ttLikeCount_${idx}" class="text-[11px] font-semibold drop-shadow">${(v.likes || 0).toLocaleString('id-ID')}</span>
                        </button>
                        <button type="button" onclick="event.stopPropagation(); openComments('video', ${idx})" class="flex flex-col items-center gap-1">
                            <span class="text-2xl drop-shadow">💬</span>
                            <span class="text-[11px] font-semibold drop-shadow">${(v.comments && v.comments.length) || 0}</span>
                        </button>
                        <div class="flex flex-col items-center gap-1">
                            <span class="text-2xl drop-shadow">👁️</span>
                            <span id="ttViews_${idx}" class="text-[11px] font-semibold drop-shadow">${(v.views || 0).toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                </div>
            `;
        }

        function openVideoPlayer(idx) {
            if (!appData.videos[idx]) return;
            ttFeedList = appData.videos
                .map((v, i) => i)
                .filter(i => currentVideoFilter === null || appData.videos[i].playlistId === currentVideoFilter);
            if (ttFeedList.length === 0) ttFeedList = appData.videos.map((v, i) => i);

            const feed = document.getElementById('ttFeed');
            feed.innerHTML = ttFeedList.map(i => ttSlideMarkup(i)).join('');
            document.getElementById('videoPlayerModal').classList.remove('hidden');

            const target = feed.querySelector(`.tt-slide[data-idx="${idx}"]`);
            if (target) target.scrollIntoView({ behavior: 'auto', block: 'start' });

            if (ttObserver) ttObserver.disconnect();
            ttObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const video = entry.target.querySelector('video');
                    const slideIdx = parseInt(entry.target.dataset.idx, 10);
                    if (!video) return;
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
                        video.currentTime = video.currentTime || 0;
                        const playPromise = video.play();
                        if (playPromise && playPromise.catch) {
                            playPromise.catch(() => {
                                video.muted = true;
                                const btn = document.getElementById(`ttMuteBtn_${slideIdx}`);
                                if (btn) btn.textContent = '🔇';
                                video.play().catch(() => {});
                            });
                        }
                        ttCountView(slideIdx);
                    } else {
                        video.pause();
                    }
                });
            }, { threshold: [0, 0.6, 1] });

            feed.querySelectorAll('.tt-slide').forEach(slide => ttObserver.observe(slide));
        }

        function ttCountView(idx) {
            const v = appData.videos[idx];
            if (!v || v._counted) return;
            v.views = (v.views || 0) + 1;
            v._counted = true;
            saveAppData();
            const label = document.getElementById(`ttViews_${idx}`);
            if (label) label.textContent = v.views.toLocaleString('id-ID');
            const gridLabel = document.getElementById(`videoViews_${idx}`);
            if (gridLabel) gridLabel.textContent = `👁️ ${v.views.toLocaleString('id-ID')}`;
        }

        function ttTogglePlay(idx) {
            const slide = document.querySelector(`.tt-slide[data-idx="${idx}"]`);
            const video = slide ? slide.querySelector('video') : null;
            if (!video) return;
            if (video.paused) { video.play().catch(() => {}); } else { video.pause(); }
        }

        function ttToggleMute(idx) {
            const slide = document.querySelector(`.tt-slide[data-idx="${idx}"]`);
            const video = slide ? slide.querySelector('video') : null;
            const btn = document.getElementById(`ttMuteBtn_${idx}`);
            if (!video) return;
            video.muted = !video.muted;
            if (btn) btn.textContent = video.muted ? '🔇' : '🔊';
        }

        function ttToggleLike(idx) {
            toggleLike('video', idx);
            const v = appData.videos[idx];
            const icon = document.getElementById(`ttLikeIcon_${idx}`);
            const count = document.getElementById(`ttLikeCount_${idx}`);
            if (icon) icon.textContent = v._liked ? '❤️' : '🤍';
            if (count) count.textContent = (v.likes || 0).toLocaleString('id-ID');
        }

        function closeVideoPlayer() {
            if (ttObserver) { ttObserver.disconnect(); ttObserver = null; }
            document.querySelectorAll('#ttFeed video').forEach(v => v.pause());
            document.getElementById('videoPlayerModal').classList.add('hidden');
            document.getElementById('ttFeed').innerHTML = '';
            renderView();
        }

        // Mainkan audio dari banner playlist audio; hitung pendengar naik sekali per klik play
        function playAudio(idx) {
            const a = appData.audios[idx];
            if (!a) return;
            document.querySelectorAll('audio[id^="audioPlayer_"]').forEach((el, i) => {
                if (i !== idx) { el.pause(); }
            });
            document.querySelectorAll('button[id^="audioPlayBtn_"]').forEach((btn, i) => {
                if (i !== idx) btn.textContent = '▶';
            });
            document.querySelectorAll('.audio-card').forEach((card, i) => {
                if (i !== idx) card.classList.remove('playing');
            });
            document.querySelectorAll('.eq-bars').forEach((eq, i) => {
                if (i !== idx) eq.classList.remove('flex');
            });
            const player = document.getElementById(`audioPlayer_${idx}`);
            const btn = document.getElementById(`audioPlayBtn_${idx}`);
            const card = document.getElementById(`audioCard_${idx}`);
            const eq = document.getElementById(`audioEq_${idx}`);
            if (!player) return;
            if (player.paused) {
                player.play();
                btn.textContent = '❚❚';
                if (card) card.classList.add('playing');
                if (eq) eq.classList.add('flex');
                if (!a._counted) {
                    a.plays = (a.plays || 0) + 1;
                    a._counted = true;
                    saveAppData();
                    const label = document.getElementById(`audioPlays_${idx}`);
                    if (label) label.textContent = a.plays.toLocaleString('id-ID');
                }
            } else {
                player.pause();
                btn.textContent = '▶';
                if (card) card.classList.remove('playing');
                if (eq) eq.classList.remove('flex');
            }
            player.onended = () => {
                btn.textContent = '▶';
                if (card) card.classList.remove('playing');
                if (eq) eq.classList.remove('flex');
            };
        }

        // ===== LIKE & KOMENTAR (video & audio) =====
        function getPlaylistItem(type, idx) {
            return type === 'video' ? appData.videos[idx] : appData.audios[idx];
        }

        function toggleLike(type, idx) {
            const item = getPlaylistItem(type, idx);
            if (!item) return;
            if (item._liked) {
                item.likes = Math.max(0, (item.likes || 0) - 1);
                item._liked = false;
            } else {
                item.likes = (item.likes || 0) + 1;
                item._liked = true;
            }
            saveAppData();
            const icon = document.getElementById(`${type}LikeIcon_${idx}`);
            const count = document.getElementById(`${type}LikeCount_${idx}`);
            const btn = document.getElementById(`${type}LikeBtn_${idx}`);
            if (icon) icon.textContent = item._liked ? '❤️' : '🤍';
            if (count) count.textContent = item.likes.toLocaleString('id-ID');
            if (btn) {
                btn.classList.toggle('text-red-400', item._liked);
                btn.classList.toggle('text-gray-400', !item._liked);
            }
        }

        let commentTarget = null;

        function openComments(type, idx) {
            const item = getPlaylistItem(type, idx);
            if (!item) return;
            commentTarget = { type, idx };
            document.getElementById('commentsModalTitle').textContent = `💬 Komentar — ${item.title}`;
            document.getElementById('commentName').value = '';
            document.getElementById('commentText').value = '';
            renderCommentsList();
            const modal = document.getElementById('commentsModal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        function closeComments() {
            commentTarget = null;
            const modal = document.getElementById('commentsModal');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }

        function renderCommentsList() {
            if (!commentTarget) return;
            const item = getPlaylistItem(commentTarget.type, commentTarget.idx);
            const list = document.getElementById('commentsList');
            if (!item || !list) return;
            const comments = item.comments || [];
            list.innerHTML = comments.length === 0
                ? '<p class="text-sm text-gray-400 text-center py-8">Belum ada komentar. Jadilah yang pertama berkomentar!</p>'
                : comments.slice().reverse().map(c => `
                    <div class="bg-forest-900/70 rounded-xl p-3 border border-forest-700">
                        <div class="flex items-center justify-between gap-2">
                            <p class="text-sm font-semibold text-gold-400 truncate">${c.name}</p>
                            <p class="text-[10px] text-gray-500 flex-shrink-0">${c.date}</p>
                        </div>
                        <p class="text-sm text-gray-200 mt-1 break-words">${c.text}</p>
                    </div>
                `).join('');
        }

        function submitComment(e) {
            e.preventDefault();
            if (!commentTarget) return;
            const item = getPlaylistItem(commentTarget.type, commentTarget.idx);
            if (!item) return;
            const name = document.getElementById('commentName').value.trim();
            const text = document.getElementById('commentText').value.trim();
            if (!name || !text) return;
            if (!item.comments) item.comments = [];
            item.comments.push({ name, text, date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) });
            saveAppData();
            document.getElementById('commentText').value = '';
            renderCommentsList();
            renderView();
        }

        function togglemanagementFileSample() {
            const pos = document.getElementById('sPos').value;
            const wrap = document.getElementById('sFileSampleWrap');
            const input = document.getElementById('sFileSample');
            if (pos === 'All Editor') {
                wrap.classList.remove('hidden');
                input.setAttribute('required', 'required');
            } else {
                wrap.classList.add('hidden');
                input.removeAttribute('required');
                input.value = '';
            }
        }

        async function submitTrainee(e) {
            e.preventDefault();
            if (!appData.registrationOpen.trainee) {
                alert('Maaf pendaftaran telah tutup, see you next time!');
                navigate('beranda');
                return;
            }
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalLabel = submitBtn ? submitBtn.textContent : '';
            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '⏳ Mengirim, mohon tunggu...'; }

            const voiceFile = document.getElementById('tVoiceSample').files[0];
            if (!isFileSizeOk(voiceFile)) {
                showNotif('error', `Ukuran file sample suara maksimal ${MAX_UPLOAD_SIZE_MB}MB. File kamu terlalu besar, silakan kompres atau pilih file lain.`);
                if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalLabel; }
                return;
            }
            const voiceSample = await readFileAsBase64(voiceFile);
            const newT = {
                name: document.getElementById('tName').value,
                stageName: document.getElementById('tStageName').value,
                tanggalLahir: document.getElementById('tTanggalLahir').value,
                div: document.getElementById('tDiv').value,
                reason: document.getElementById('tReason').value,
                intent: document.getElementById('tIntent').value,
                voiceSample: voiceSample,
                status: 'pending',
                date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
            };

            const result = await kirimKeSheet('trainee', newT);

            // Tetap disimpan lokal juga untuk sementara, supaya Dasbor Admin
            // (yang masih baca dari appData) tidak kehilangan data selama
            // migrasi ke Google Sheets belum selesai untuk semua halaman.
            appData.traineeSubmissions.push(newT);
            saveAppData();

            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalLabel; }

            if (result.ok) {
                showNotif('success', 'Pendaftaran Trainee berhasil dikirim!', null, () => navigate('beranda'));
            } else {
                showNotif('error', 'Pendaftaran tersimpan di perangkat ini, tapi gagal dikirim ke database online (' + (result.error || 'tidak diketahui') + '). Hubungi admin jika ini terus terjadi.', null, () => navigate('beranda'));
            }
            e.target.reset();
        }

        async function submitmanagement(e) {
            e.preventDefault();
            if (!appData.registrationOpen.management) {
                alert('Maaf pendaftaran telah tutup, see you next time!');
                navigate('beranda');
                return;
            }
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const originalLabel = submitBtn ? submitBtn.textContent : '';
            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = '⏳ Mengirim, mohon tunggu...'; }

            const pos = document.getElementById('sPos').value;
            let fileSample = null;
            if (pos === 'All Editor') {
                const sampleFile = document.getElementById('sFileSample').files[0];
                if (!isFileSizeOk(sampleFile)) {
                    showNotif('error', `Ukuran file sample maksimal ${MAX_UPLOAD_SIZE_MB}MB. File kamu terlalu besar, silakan kompres atau pilih file lain.`);
                    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalLabel; }
                    return;
                }
                fileSample = await readFileAsBase64(sampleFile);
            }
            const newS = {
                name: document.getElementById('sName').value,
                stageName: document.getElementById('sStageName').value,
                line: document.getElementById('sLine').value,
                pos: pos,
                reason: document.getElementById('sReason').value,
                intent: document.getElementById('sIntent').value,
                fileSample: fileSample,
                status: 'pending',
                date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
            };

            const result = await kirimKeSheet('management', newS);

            // Sama seperti trainee: tetap disimpan lokal sementara untuk Dasbor Admin.
            appData.managementSubmissions.push(newS);
            saveAppData();

            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = originalLabel; }

            if (result.ok) {
                showNotif('success', 'Pendaftaran management berhasil dikirim!', null, () => navigate('beranda'));
            } else {
                showNotif('error', 'Pendaftaran tersimpan di perangkat ini, tapi gagal dikirim ke database online (' + (result.error || 'tidak diketahui') + '). Hubungi admin jika ini terus terjadi.', null, () => navigate('beranda'));
            }
            e.target.reset();
        }

        function checkSelectionResult(e) {
            e.preventDefault();
            const name = document.getElementById('cekName').value.trim().toLowerCase();
            const tanggalLahir = document.getElementById('cekTanggalLahir').value.trim();
            const divisi = document.getElementById('cekDivisi').value.trim().toLowerCase();
            const resultBox = document.getElementById('cekHasilResult');

            const foundTrainee = appData.traineeSubmissions.find(t =>
                (t.name || '').trim().toLowerCase() === name &&
                (t.tanggalLahir || '') === tanggalLahir &&
                (t.div || '').trim().toLowerCase() === divisi
            );
            const foundmanagement = !foundTrainee ? appData.managementSubmissions.find(s =>
                (s.name || '').trim().toLowerCase() === name &&
                (s.tanggalLahir || '') === tanggalLahir &&
                (s.pos || '').trim().toLowerCase() === divisi
            ) : null;

            const found = foundTrainee || foundmanagement;
            const statusMap = {
                pending: { label: 'Menunggu Seleksi', color: 'text-gray-300 bg-gray-700/40 border-gray-500', desc: 'Pendaftaranmu masih dalam antrian dan belum diproses oleh tim seleksi.' },
                consideration: { label: 'Pertimbangan', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/50', desc: 'Pendaftaranmu sedang dalam tahap pertimbangan lebih lanjut oleh tim.' },
                accepted: { label: 'Diterima 🎉', color: 'text-green-400 bg-green-500/10 border-green-500/50', desc: 'Selamat! Kamu telah resmi diterima bergabung di Lorevia Entertainment.' },
                rejected: { label: 'Tidak Lolos', color: 'text-red-400 bg-red-500/10 border-red-500/50', desc: 'Mohon maaf, pendaftaranmu belum berhasil kali ini. Jangan berkecil hati untuk mencoba lagi di kesempatan berikutnya.' }
            };

            if (!found) {
                resultBox.innerHTML = `
                    <div class="bg-forest-800/80 p-6 rounded-2xl border border-red-500/50 text-center">
                        <p class="text-red-400 font-semibold">Data tidak ditemukan.</p>
                        <p class="text-xs text-gray-400 mt-1">Pastikan Nama, Tanggal Lahir, dan Divisi diisi persis sama seperti saat mendaftar.</p>
                    </div>
                `;
                return;
            }

            const foundType = foundTrainee ? 'trainee' : 'management';
            if (!isResultAnnounced(foundType)) {
                const dateStr = appData.resultsAnnounceDate[foundType];
                const formattedDate = dateStr
                    ? new Date(dateStr + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                    : '';
                resultBox.innerHTML = `
                    <div class="bg-forest-800/80 p-8 rounded-3xl gold-border text-center">
                        <span class="text-5xl">🔒</span>
                        <h2 class="font-serif text-2xl font-bold gold-text mt-4">Hasil Belum Diumumkan</h2>
                        <p class="text-sm text-gray-300 mt-3">Pendaftaranmu sudah tercatat, tapi hasil seleksi ${foundType === 'trainee' ? 'Trainee' : 'management'} baru akan diumumkan pada <strong class="text-gold-400">${formattedDate}</strong>. Silakan cek kembali setelah tanggal tersebut.</p>
                    </div>
                `;
                return;
            }

            const st = statusMap[found.status || 'pending'];
            resultBox.innerHTML = `
                <div class="bg-forest-800/80 p-6 rounded-2xl gold-border text-center space-y-2">
                    <p class="text-sm text-gray-300">Halo, <strong class="text-gold-400">${found.name}</strong></p>
                    <span class="inline-block px-4 py-1.5 rounded-full border text-sm font-bold ${st.color}">${st.label}</span>
                    <p class="text-xs text-gray-300 mt-2">${st.desc}</p>
                </div>
            `;
        }

        async function submitGuest(e) {
            e.preventDefault();
            const submitBtn = e.target.querySelector('button[type="submit"]');
            const newG = {
                name: document.getElementById('gName').value.trim(),
                message: document.getElementById('gMsg').value.trim(),
                date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
            };
            if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Mengirim...'; }
            const result = await kirimKeSheet('guestbox', newG);
            if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Kirim Pesan'; }

            if (!result.ok) {
                alert('Pesan gagal dikirim ke database online: ' + (result.error || 'error tidak diketahui'));
                return;
            }

            appData.guestBoxes.push(newG);
            saveAppData();
            alert('Pesan Guest Box berhasil dikirim dan tampil publik!');
            e.target.reset();
            renderView();
        }

        // Admin Security & Actions
        let pendingAdminTab = null;
        function triggerAdminModal() {
            document.getElementById('adminModal').classList.remove('hidden');
        }

        function closeAdminModal() {
            document.getElementById('adminModal').classList.add('hidden');
            document.getElementById('adminPasswordInput').value = '';
        }

        function handleAdminLogin(e) {
            e.preventDefault();
            const pass = document.getElementById('adminPasswordInput').value;
            if (pass === 'lorevia2026') {
                isAdminLoggedIn = true;
                closeAdminModal();
                if (pendingAdminTab === 'video' || pendingAdminTab === 'audio') {
                    adminTab = pendingAdminTab;
                    pendingAdminTab = null;
                }
                navigate('admin-dashboard');
                alert('Berhasil masuk ke Dasbor Admin!');
            } else {
                alert('Password salah!');
            }
        }

        function handleAdminLogout() {
            isAdminLoggedIn = false;
            navigate('beranda');
            alert('Berhasil keluar dari Dasbor Admin.');
        }

        function updateGenLabel(e) {
            e.preventDefault();
            const val = document.getElementById('genLabelInput').value.trim();
            if (!val) return;
            appData.genLabel = val;
            saveAppData();
            alert('Nama generasi berhasil diperbarui menjadi: ' + val);
            renderView();
        }

        function deleteSubmission(type, index) {
            if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
                if (type === 'trainee') {
                    appData.traineeSubmissions.splice(index, 1);
                } else if (type === 'management') {
                    appData.managementSubmissions.splice(index, 1);
                }
                saveAppData();
                renderView();
            }
        }

        const SELEKSI_STATUS_LABEL = {
            pending: 'Menunggu',
            consideration: 'Pertimbangan',
            accepted: 'Diterima',
            rejected: 'Ditolak'
        };

        // Aksi utama dasbor admin untuk hasil seleksi: terima, tolak, atau pertimbangan.
        // Data pendaftar TIDAK langsung dihapus supaya pelamar tetap bisa cek status via menu "Cek Hasil Seleksi".
        function updateSubmissionStatus(type, idx, status) {
            const list = type === 'trainee' ? appData.traineeSubmissions : appData.managementSubmissions;
            const item = list[idx];
            if (!item) return;

            if (status === 'accepted' && !item.addedToDatabase) {
                if (type === 'trainee') {
                    appData.members.push({
                        id: Date.now(),
                        stageName: item.stageName,
                        tanggalLahir: item.tanggalLahir,
                        divisi: item.div,
                        status: 'trainee',
                        groupName: '',
                        img: item.voiceSample && item.voiceSample.type && item.voiceSample.type.startsWith('image/') ? item.voiceSample.data : ''
                    });
                } else {
                    appData.managementList.push({
                        id: Date.now(),
                        name: item.stageName || item.name,
                        posisi: item.pos,
                        tanggalLahir: item.tanggalLahir,
                        img: item.fileSample && item.fileSample.type && item.fileSample.type.startsWith('image/') ? item.fileSample.data : ''
                    });
                }
                item.addedToDatabase = true;
            }

            item.status = status;
            saveAppData();
            renderView();
            alert(`Status ${item.stageName || item.name} diubah menjadi: ${SELEKSI_STATUS_LABEL[status]}`);
        }

        async function addmanagementMember(e) {
            e.preventDefault();
            const name = document.getElementById('newmanagementName').value;
            const posisi = document.getElementById('newmanagementPosisi').value;
            const tanggalLahir = document.getElementById('newmanagementTanggalLahir').value;
            const imgFile = document.getElementById('newmanagementImg').files[0];
            const imageUrls = await uploadMediaFiles([imgFile], 'management_' + Date.now());
            appData.managementList.push({ id: Date.now(), name, posisi, tanggalLahir, img: imageUrls[0] || '' });
            saveAppData();
            alert('management baru berhasil ditambahkan!');
            renderView();
        }

        function deletemanagementMember(idx) {
            if (confirm('Apakah Anda yakin ingin menghapus management ini?')) {
                appData.managementList.splice(idx, 1);
                saveAppData();
                renderView();
            }
        }

        async function addAnnouncement(e) {
            e.preventDefault();
            const title = document.getElementById('annTitle').value;
            const date = document.getElementById('annDate').value;
            const content = document.getElementById('annContent').value;
            const photoFile = document.getElementById('annPhoto').files[0];
            const photoUrls = photoFile ? await uploadMediaFiles([photoFile], 'announcement_' + Date.now()) : [];
            appData.announcements.unshift({ id: Date.now(), title, date, content, photo: photoUrls[0] || null });
            saveAppData();
            renderView();
            alert('Pengumuman baru berhasil ditambahkan!');
        }

        function deleteAnnouncement(idx) {
            if (confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) {
                appData.announcements.splice(idx, 1);
                saveAppData();
                renderView();
            }
        }

        async function addAchievement(e) {
            e.preventDefault();
            const title = document.getElementById('achTitle').value;
            const year = document.getElementById('achYear').value;
            const desc = document.getElementById('achDesc').value;
            const achFile = document.getElementById('achFile').files[0];
            const fileUrls = achFile ? await uploadMediaFiles([achFile], 'achievement_' + Date.now()) : [];
            appData.achievements.unshift({ id: Date.now(), title, year, desc, file: fileUrls[0] || null, fileType: achFile ? achFile.type : null });
            saveAppData();
            renderView();
            alert('Penghargaan baru berhasil ditambahkan!');
        }

        function deleteAchievement(idx) {
            if (confirm('Apakah Anda yakin ingin menghapus penghargaan ini?')) {
                appData.achievements.splice(idx, 1);
                saveAppData();
                renderView();
            }
        }

        async function updateAdminMember(idx) {
            const name = document.getElementById(`admName_${idx}`).value;
            const role = document.getElementById(`admRole_${idx}`).value;
            const level = parseInt(document.getElementById(`admLevel_${idx}`).value, 10) || 1;
            const imgFile = document.getElementById(`admImg_${idx}`).files[0];
            let img = appData.adminStructure[idx].img;
            if (imgFile) {
                const imageUrls = await uploadMediaFiles([imgFile], 'admin_' + Date.now());
                img = imageUrls[0] || img;
            }
            appData.adminStructure[idx] = { ...appData.adminStructure[idx], name, role, level, img };
            saveAppData();
            alert('Struktur Admin berhasil diperbarui!');
            renderView();
        }

        async function addAdminMember(e) {
            e.preventDefault();
            const name = document.getElementById('newAdmName').value;
            const role = document.getElementById('newAdmRole').value;
            const level = parseInt(document.getElementById('newAdmLevel').value, 10) || 1;
            const imgFile = document.getElementById('newAdmImg').files[0];
            const uploaded = await readFileAsBase64(imgFile);
            const sheetResult = await kirimKeSheet('management_member', {
                namaPanjang: name,
                namaPanggung: name,
                tanggalLahir: '',
                faceClaim: '',
                jabatan: role,
                level,
                foto: uploaded ? uploaded : null
            });
            if (!sheetResult.ok) {
                alert('Data manajemen gagal disimpan ke Google Sheet: ' + (sheetResult.error || 'kesalahan tidak diketahui'));
                return;
            }
            appData.adminStructure.push({ id: Date.now(), name, role, level, img: sheetResult.photoUrl || '' });
            saveAppData();
            alert('Manajemen baru berhasil ditambahkan ke Google Sheet!');
            renderView();
        }

        function deleteAdminMember(idx) {
            if (confirm('Apakah Anda yakin ingin menghapus admin ini?')) {
                appData.adminStructure.splice(idx, 1);
                saveAppData();
                renderView();
            }
        }

function toggleMemberGroupName() {
            const status = document.getElementById('newMemStatus').value;
            const wrap = document.getElementById('newMemGroupName');
            if (status === 'group') {
                wrap.classList.remove('hidden');
                wrap.setAttribute('required', 'required');
            } else {
                wrap.classList.add('hidden');
                wrap.removeAttribute('required');
                wrap.value = '';
            }
        }

        async function addMember(e) {
            e.preventDefault();
            const stageName = document.getElementById('newMemStageName').value;
            const tanggalLahir = document.getElementById('newMemTanggalLahir').value;
            const divisi = document.getElementById('newMemDivisi').value;
            const status = document.getElementById('newMemStatus').value;
            const groupName = status === 'group' ? document.getElementById('newMemGroupName').value : '';
            const imgFile = document.getElementById('newMemImg').files[0];
            const imageUrls = await uploadMediaFiles([imgFile], 'member_' + Date.now());
            appData.members.push({ id: Date.now(), stageName, tanggalLahir, divisi, status, groupName, img: imageUrls[0] || '' });
            saveAppData();
            alert('Member baru berhasil ditambahkan!');
            renderView();
        }

        function deleteMember(idx) {
            if (confirm('Apakah Anda yakin ingin menghapus member ini?')) {
                appData.members.splice(idx, 1);
                saveAppData();
                renderView();
            }
        }

        function toggleEditMemberGroupName(idx) {
            const status = document.getElementById(`memStatus_${idx}`).value;
            const wrap = document.getElementById(`memGroupName_${idx}`);
            if (status === 'group') {
                wrap.classList.remove('hidden');
            } else {
                wrap.classList.add('hidden');
                wrap.value = '';
            }
        }

        async function updateMember(idx) {
            const stageName = document.getElementById(`memStageName_${idx}`).value;
            const tanggalLahir = document.getElementById(`memTanggalLahir_${idx}`).value;
            const divisi = document.getElementById(`memDivisi_${idx}`).value;
            const status = document.getElementById(`memStatus_${idx}`).value;
            const groupName = status === 'group' ? document.getElementById(`memGroupName_${idx}`).value : '';
            const imgFile = document.getElementById(`memImg_${idx}`).files[0];
            let img = appData.members[idx].img;
            if (imgFile) {
                const imageUrls = await uploadMediaFiles([imgFile], 'member_' + Date.now());
                img = imageUrls[0] || img;
            }
            appData.members[idx] = { ...appData.members[idx], stageName, tanggalLahir, divisi, status, groupName, img };
            saveAppData();
            alert('Data member berhasil diperbarui!');
            renderView();
        }


        // Highlight tombol menu di sidebar sesuai halaman yang lagi dibuka (currentRoute)
        function highlightSidebarNav() {
            const nav = document.querySelector('#sidebar nav');
            if (!nav) return;
            nav.querySelectorAll('button').forEach(btn => {
                const onclickAttr = btn.getAttribute('onclick') || '';
                const match = onclickAttr.match(/navigate\('([^']+)'\)/);
                const route = match ? match[1] : null;

                btn.classList.remove('bg-forest-800/50', 'text-gold-400', 'border', 'border-forest-600/50');

                if (route === currentRoute) {
                    btn.classList.add('bg-forest-800/50', 'text-gold-400', 'border', 'border-forest-600/50');
                }
            });
        }

        // Initial load
        window.onload = function() {
            // Dasbor admin hanya boleh tampil kalau sudah login (perilaku sama seperti versi satu file).
            if (currentRoute === 'admin-dashboard' && !isAdminLoggedIn) {
                triggerAdminModal();
            }
            if (currentRoute === 'pendaftaran-trainee' && !appData.registrationOpen.trainee) {
                alert('Maaf pendaftaran telah tutup, see you next time!');
            }
            if (currentRoute === 'pendaftaran-management' && !appData.registrationOpen.management) {
                alert('Maaf pendaftaran telah tutup, see you next time!');
            }
            renderView();
            highlightSidebarNav();
            updateCartBadge();
            applyThemeIcon();
        };