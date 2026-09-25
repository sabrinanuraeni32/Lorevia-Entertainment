// Tampilan halaman "Member - Lorevia Entertainment" (route: member).
// Markup disalin apa adanya dari versi satu file.
        function renderView() {
            const content = document.getElementById('appContent');
            if (currentRoute !== 'toko') stopPromoBanner();
            if (currentRoute === 'member') {
                content.innerHTML = `
                    <div class="max-w-5xl mx-auto py-8">
                        <div class="text-center mb-10">
                            <h2 class="font-serif text-3xl md:text-4xl font-bold gold-text">Member Lorevia</h2>
                            <p class="text-gray-300 mt-2">Daftar talenta dan trainee berbakat yang bernaung di bawah payung Lorevia Entertainment.</p>
                        </div>
                        ${appData.members.length === 0 ? `
                            <div class="text-center py-16 bg-forest-800/40 rounded-2xl border border-forest-700">
                                <span class="text-4xl">🌱</span>
                                <p class="text-gray-400 mt-3">Belum ada data member yang ditambahkan.</p>
                            </div>
                        ` : `
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            ${appData.members.map(m => `
                                <div class="bg-forest-800/70 rounded-2xl overflow-hidden gold-border shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col items-center p-6 text-center">
                                    <div class="w-32 h-32 rounded-full gold-border overflow-hidden mb-4 shadow-lg">
                                        <img src="${m.img}" alt="${m.stageName}" class="w-full h-full object-cover">
                                    </div>
                                    <h3 class="font-serif text-xl font-bold gold-text">${m.stageName}</h3>
                                    <span class="inline-block px-3 py-1 bg-forest-900 text-gold-400 text-xs font-semibold rounded-full mt-2 border border-forest-700">${m.divisi}</span>
                                    <span class="text-xs text-gray-400 mt-1">Line: ${m.line}</span>
                                    <span class="inline-block px-2.5 py-0.5 bg-gold-600/20 text-gold-400 text-[10px] font-bold rounded-full mt-2 border border-gold-600/40 uppercase tracking-wide">${m.status === 'group' ? `Group: ${m.groupName}` : 'Trainee'}</span>
                                </div>
                            `).join('')}
                        </div>
                        `}
                    </div>
                `;
            }
            animatePageReveal();
        }
