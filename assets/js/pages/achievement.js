// Tampilan halaman "Achievement - Lorevia Entertainment" (route: achievement).
// Markup disalin apa adanya dari versi satu file.
        function renderView() {
            const content = document.getElementById('appContent');
            if (currentRoute !== 'toko') stopPromoBanner();
            if (currentRoute === 'achievement') {
                content.innerHTML = `
                    <div class="max-w-4xl mx-auto py-8 space-y-6">
                        <div class="text-center mb-8">
                            <h2 class="font-serif text-3xl font-bold gold-text">Achievement & Penghargaan</h2>
                            <p class="text-gray-300 mt-1">Jejak prestasi gemilang Lorevia Entertainment dari masa ke masa.</p>
                        </div>
                        <div class="space-y-4">
                            ${appData.achievements.length === 0 ? `
                                <div class="text-center py-16 bg-forest-800/40 rounded-2xl border border-forest-700">
                                    <span class="text-4xl">🏆</span>
                                    <p class="text-gray-400 mt-3">Belum ada penghargaan yang ditambahkan.</p>
                                </div>
                            ` : appData.achievements.map(ach => `
                                <div class="bg-forest-800/80 p-6 rounded-2xl gold-border shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div class="space-y-1 flex-1">
                                        <span class="text-xs font-bold text-gold-400 bg-forest-900 px-3 py-1 rounded-full border border-forest-700">${ach.year}</span>
                                        <h3 class="font-serif text-xl font-bold text-white mt-2">${ach.title}</h3>
                                        <p class="text-sm text-gray-300">${ach.desc}</p>
                                        ${ach.file ? (ach.fileType && ach.fileType.startsWith('image/') ? `<img src="${ach.file}" alt="${ach.title}" class="w-full max-w-sm max-h-72 object-cover rounded-xl mt-3 gold-border">` : `<a href="${ach.file}" download class="inline-block mt-2 text-xs text-gold-400 underline">📄 Unduh Bukti Penghargaan</a>`) : ''}
                                    </div>
                                    <span class="text-3xl">🏆</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
            animatePageReveal();
        }
