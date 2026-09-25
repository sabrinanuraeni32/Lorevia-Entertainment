// Tampilan halaman "Cek Hasil Seleksi - Lorevia Entertainment" (route: cek-hasil).
// Markup disalin apa adanya dari versi satu file.
        function renderView() {
            const content = document.getElementById('appContent');
            if (currentRoute !== 'toko') stopPromoBanner();
            if (currentRoute === 'cek-hasil') {
                content.innerHTML = `
                    <div class="max-w-xl mx-auto py-8 space-y-6">
                        <div class="text-center">
                            <span class="text-4xl">🔍</span>
                            <h2 class="font-serif text-3xl font-bold gold-text mt-2">Cek Hasil Seleksi</h2>
                            <p class="text-gray-300 text-sm mt-1">Masukkan Nama, Tanggal Lahir, dan Divisi sesuai saat kamu mendaftar untuk melihat status seleksimu.</p>
                        </div>
                        <div class="bg-forest-800/80 p-6 rounded-2xl gold-border shadow-xl">
                            <form onsubmit="checkSelectionResult(event)" class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gold-400 mb-1">Nama</label>
                                    <input type="text" id="cekName" required class="w-full px-4 py-3 rounded-xl bg-forest-900 border border-forest-600 focus:border-gold-500 text-white outline-none">
                                </div>
                                <div>
                                   <label class="block text-sm font-medium text-gold-400 mb-1">Tanggal Lahir</label>
                                   <input type="date" id="cekTanggalLahir" required class="w-full px-4 py-3 rounded-xl bg-forest-900 border border-forest-600 focus:border-gold-500 text-white outline-none">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gold-400 mb-1">Divisi</label>
                                    <input type="text" id="cekDivisi" required placeholder="cth: Vocal, Dance, Manager, dst." class="w-full px-4 py-3 rounded-xl bg-forest-900 border border-forest-600 focus:border-gold-500 text-white outline-none">
                                </div>
                                <button type="submit" class="w-full py-3 rounded-xl bg-gold-600 hover:bg-gold-500 text-black font-bold transition shadow-lg">Cek Status</button>
                            </form>
                        </div>
                        <div id="cekHasilResult"></div>
                    </div>
                `;
            }
            animatePageReveal();
        }
