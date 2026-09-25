// Tampilan halaman "Member Generasi - Lorevia Entertainment" (route: gen-members).
// Markup disalin apa adanya dari versi satu file.
        function renderView() {
            const content = document.getElementById('appContent');
            if (currentRoute !== 'toko') stopPromoBanner();
            if (currentRoute === 'gen-members') {
                const genMembers = getGenerationMembers(selectedGeneration);
                content.innerHTML = `
                    <div class="max-w-5xl mx-auto py-8">
                        <button onclick="navigate('beranda')" class="mb-6 px-4 py-2 rounded-xl bg-forest-800/70 hover:bg-forest-700 text-gold-400 text-sm font-medium border border-forest-600/50 transition">&larr; Kembali ke Beranda</button>
                        <div class="text-center mb-8">
                            <span class="text-4xl">✨</span>
                            <h2 class="font-serif text-3xl md:text-4xl font-bold gold-text mt-2">${selectedGeneration || ''}</h2>
                            <p class="text-sm text-gray-300 mt-1">${genMembers.length} member resmi tergabung dalam generasi ini.</p>
                        </div>
                        ${genMembers.length === 0 ? `
                            <p class="text-center text-gray-400">Belum ada member pada generasi ini.</p>
                        ` : `
                            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                                ${genMembers.map(m => `
                                    <div class="bg-forest-800/70 p-4 rounded-2xl gold-border shadow-xl text-center">
                                        <div class="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-gold-500 mb-3">
                                            <img src="${m.img}" alt="${m.stageName}" class="w-full h-full object-cover">
                                        </div>
                                        <h3 class="font-serif text-base font-bold gold-text">${m.stageName}</h3>
                                        <p class="text-xs text-gray-400 mt-1">${m.divisi || ''}</p>
                                    </div>
                                `).join('')}
                            </div>
                        `}
                    </div>
                `;
            }
            animatePageReveal();
        }
