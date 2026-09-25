// Tampilan halaman "Pengumuman - Lorevia Entertainment" (route: pengumuman).
// Markup disalin apa adanya dari versi satu file.
        function renderView() {
            const content = document.getElementById('appContent');
            if (currentRoute !== 'toko') stopPromoBanner();
            if (currentRoute === 'pengumuman') {
                content.innerHTML = `
                    <div class="max-w-3xl mx-auto py-8 space-y-6">
                        <div class="text-center mb-8">
                            <h2 class="font-serif text-3xl font-bold gold-text">Pengumuman Resmi</h2>
                            <p class="text-gray-300 mt-1">Informasi terbaru seputar audisi, kebijakan, dan agenda agensi.</p>
                        </div>
                        <div class="space-y-4">
                            ${appData.announcements.length === 0 ? `
                                <div class="text-center py-12 bg-forest-800/40 rounded-2xl border border-forest-700">
                                    <p class="text-gray-400 text-sm">Belum ada pengumuman.</p>
                                </div>
                            ` : appData.announcements.map(ann => `
                                <div class="bg-forest-800/80 p-6 rounded-2xl gold-border shadow-xl space-y-2">
                                    <div class="flex justify-between items-center text-xs text-gold-400 font-semibold">
                                        <span>📢 PENGUMUMAN</span>
                                        <span>${ann.date}</span>
                                    </div>
                                    <h3 class="font-serif text-xl font-bold text-white">${ann.title}</h3>
                                    <p class="text-sm text-gray-300 leading-relaxed">${ann.content}</p>
                                    ${ann.photo ? `<img src="${ann.photo}" alt="${ann.title}" class="w-full max-h-96 object-cover rounded-xl mt-3 gold-border">` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
            animatePageReveal();
        }
