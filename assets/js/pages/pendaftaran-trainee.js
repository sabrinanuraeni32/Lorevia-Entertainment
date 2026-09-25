        function renderView() {
            const content = document.getElementById('appContent');
            if (currentRoute !== 'toko') stopPromoBanner();
            if (currentRoute === 'pendaftaran-trainee' && !appData.registrationOpen.trainee) {
                content.innerHTML = `
                    <div class="max-w-2xl mx-auto bg-forest-800/80 p-8 rounded-3xl gold-border backdrop-blur-md shadow-2xl my-8 text-center">
                        <span class="text-5xl">🔒</span>
                        <h2 class="font-serif text-3xl font-bold gold-text mt-4">Pendaftaran Trainee Ditutup</h2>
                        <p class="text-sm text-gray-300 mt-3">Maaf, pendaftaran trainee saat ini sedang tidak dibuka. Silakan pantau terus pengumuman kami untuk info pembukaan pendaftaran berikutnya.</p>
                    </div>
                `;
            } else if (currentRoute === 'pendaftaran-trainee') {
                content.innerHTML = `
                    <div class="max-w-2xl mx-auto bg-forest-800/80 p-8 rounded-3xl gold-border backdrop-blur-md shadow-2xl my-8">
                        <div class="text-center mb-6">
                            <span class="text-4xl">🌱</span>
                            <h2 class="font-serif text-3xl font-bold gold-text mt-2">Pendaftaran Trainee</h2>
                            <p class="text-sm text-gray-300 mt-1">Isi formulir di bawah ini untuk mendaftarkan diri sebagai Trainee resmi Lorevia Entertainment.</p>
                        </div>
                        <form onsubmit="submitTrainee(event)" class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gold-400 mb-1">Nama Panjang</label>
                                <input type="text" id="tName" required class="w-full px-4 py-3 rounded-xl bg-forest-900 border border-forest-600 focus:border-gold-500 text-white outline-none">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gold-400 mb-1">Nama Panggung</label>
                                <input type="text" id="tStageName" required class="w-full px-4 py-3 rounded-xl bg-forest-900 border border-forest-600 focus:border-gold-500 text-white outline-none">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gold-400 mb-1">Face Claim</label>
                                <input type="text" id="tFaceClaim" required placeholder="Contoh: Jisoo Blackpink" class="w-full px-4 py-3 rounded-xl bg-forest-900 border border-forest-600 focus:border-gold-500 text-white outline-none">
                                <p class="text-[11px] text-gray-400 mt-1">Contoh: Jisoo Blackpink</p>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gold-400 mb-1">Tanggal Lahir</label>
                                    <input type="date" id="tTanggalLahir" required class="w-full px-4 py-3 rounded-xl bg-forest-900 border border-forest-600 focus:border-gold-500 text-white outline-none">
                                    <p class="text-[11px] text-gray-400 mt-1">Dipakai juga untuk mengecek hasil seleksi.</p>
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gold-400 mb-1">Divisi</label>
                                    <select id="tDiv" class="w-full px-4 py-3 rounded-xl bg-forest-900 border border-forest-600 focus:border-gold-500 text-white outline-none">
                                        <option value="Vocal">Vocal</option>
                                        <option value="Vocrap">Vocrap</option>
                                        <option value="Rap">Rap</option>
                                        <option value="Dance">Dance</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gold-400 mb-1">Sample Suara (Audio/Video)</label>
                                <input type="file" id="tVoiceSample" accept="audio/*,video/*" required class="w-full px-4 py-3 rounded-xl bg-forest-900 border border-forest-600 focus:border-gold-500 text-white outline-none text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-gold-600 file:text-black file:font-semibold file:text-xs">
                                <p class="text-[11px] text-gray-400 mt-1">Unggah file audio (mp3/wav/m4a) atau video (mp4/mov) berisi contoh suara/vokal kamu. Maks. 50MB.</p>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gold-400 mb-1">Alasan Masuk</label>
                                <textarea id="tReason" rows="3" required class="w-full px-4 py-3 rounded-xl bg-forest-900 border border-forest-600 focus:border-gold-500 text-white outline-none"></textarea>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gold-400 mb-1">Niat / Minat</label>
                                <textarea id="tIntent" rows="3" required class="w-full px-4 py-3 rounded-xl bg-forest-900 border border-forest-600 focus:border-gold-500 text-white outline-none"></textarea>
                            </div>
                            <button type="submit" class="w-full py-3.5 rounded-xl bg-gold-600 hover:bg-gold-500 text-black font-bold transition shadow-lg text-lg">Kirim Pendaftaran Trainee</button>
                        </form>
                    </div>
                `;
            }
            animatePageReveal();
        }