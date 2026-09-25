// Tampilan halaman "Pendaftaran management - Lorevia Entertainment" (route: pendaftaran-management).
// Markup disalin apa adanya dari versi satu file.
        function renderView() {
            const content = document.getElementById('appContent');
            if (currentRoute !== 'toko') stopPromoBanner();
            if (currentRoute === 'pendaftaran-management' && !appData.registrationOpen.management) {
                content.innerHTML = `
                    <div class="max-w-2xl mx-auto bg-forest-800/80 p-8 rounded-3xl gold-border backdrop-blur-md shadow-2xl my-8 text-center">
                        <span class="text-5xl">🔒</span>
                        <h2 class="font-serif text-3xl font-bold gold-text mt-4">Pendaftaran management Ditutup</h2>
                        <p class="text-sm text-gray-300 mt-3">Maaf, pendaftaran management saat ini sedang tidak dibuka. Silakan pantau terus pengumuman kami untuk info pembukaan pendaftaran berikutnya.</p>
                    </div>
                `;
            } else if (currentRoute === 'pendaftaran-management') {
                content.innerHTML = `
                    <div class="max-w-2xl mx-auto bg-forest-800/80 p-8 rounded-3xl gold-border backdrop-blur-md shadow-2xl my-8">
                        <div class="text-center mb-6">
                            <span class="text-4xl">🛡️</span>
                            <h2 class="font-serif text-3xl font-bold gold-text mt-2">Pendaftaran management</h2>
                            <p class="text-sm text-gray-300 mt-1">Bergabunglah bersama jajaran management profesional untuk mengelola Lorevia Entertainment.</p>
                        </div>
                        <form onsubmit="submitmanagement(event)" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gold-400 mb-1">Nama Panjang</label>
                                <input type="text" id="sName" required class="w-full px-4 py-3 rounded-xl bg-forest-900 border border-forest-600 focus:border-gold-500 text-white outline-none">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gold-400 mb-1">Nama Panggung</label>
                                <input type="text" id="sStageName" required class="w-full px-4 py-3 rounded-xl bg-forest-900 border border-forest-600 focus:border-gold-500 text-white outline-none">
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gold-400 mb-1">Line</label>
                                    <input type="text" id="sLine" placeholder="Contoh: 07L" pattern="[0-9]{2}[Ll]" title="Format: 2 digit terakhir tahun lahir + L, contoh 07L untuk kelahiran 2007" required class="w-full px-4 py-3 rounded-xl bg-forest-900 border border-forest-600 focus:border-gold-500 text-white outline-none">
                                    <p class="text-[11px] text-gray-400 mt-1">2 digit terakhir tahun lahir + L, contoh kelahiran 2007 = 07L.</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gold-400 mb-1">Divisi</label>
                                    <select id="sPos" onchange="togglemanagementFileSample()" class="w-full px-4 py-3 rounded-xl bg-forest-900 border border-forest-600 focus:border-gold-500 text-white outline-none">
                                        <option value="Manager">Manager</option>
                                        <option value="All Editor">All Editor</option>
                                        <option value="PJ Medpart">PJ Medpart</option>
                                        <option value="Coach Vocal">Coach Vocal</option>
                                        <option value="Rap">Rap</option>
                                        <option value="Dance">Dance</option>
                                        <option value="Wording">Wording</option>
                                        <option value="Security">Security</option>
                                    </select>
                                </div>
                            </div>
                            <div id="sFileSampleWrap" class="hidden">
                                <label class="block text-sm font-medium text-gold-400 mb-1">Sample Hasil Edit (Khusus All Editor)</label>
                                <input type="file" id="sFileSample" accept="image/*,video/*,.pdf" class="w-full px-4 py-3 rounded-xl bg-forest-900 border border-forest-600 focus:border-gold-500 text-white outline-none text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-gold-600 file:text-black file:font-semibold file:text-xs">
                                <p class="text-[11px] text-gray-400 mt-1">Unggah contoh hasil editan (foto/video/PDF) sebagai portofolio. Maks. 50MB.</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gold-400 mb-1">Alasan Masuk</label>
                                <textarea id="sReason" rows="3" required class="w-full px-4 py-3 rounded-xl bg-forest-900 border border-forest-600 focus:border-gold-500 text-white outline-none"></textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gold-400 mb-1">Niat / Minat</label>
                                <textarea id="sIntent" rows="3" required class="w-full px-4 py-3 rounded-xl bg-forest-900 border border-forest-600 focus:border-gold-500 text-white outline-none"></textarea>
                            </div>
                            <button type="submit" class="w-full py-3.5 rounded-xl bg-gold-600 hover:bg-gold-500 text-black font-bold transition shadow-lg text-lg">Kirim Pendaftaran management</button>
                        </form>
                    </div>
                `;
            }
            animatePageReveal();
        }
