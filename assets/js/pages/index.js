// Tampilan halaman "Lorevia Entertainment" (route: beranda).
// Markup disalin apa adanya dari versi satu file.
        function renderView() {
            const content = document.getElementById('appContent');
            if (currentRoute !== 'toko') stopPromoBanner();
            if (currentRoute === 'beranda') {
                const traineeMembers = appData.members.filter(m => m.status !== 'group');
                const generations = getGenerations();
                content.innerHTML = `
                    <div class="text-center py-12 md:py-20 space-y-6">
                        <div class="relative max-w-2xl mx-auto rounded-3xl overflow-hidden gold-border shadow-2xl">
                            <img src="${GROUP_PHOTO_IMG}" alt="Member Lorevia Entertainment" class="w-full h-auto object-contain bg-forest-900">
                            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-2 rounded-full bg-forest-800/80 gold-border shadow-2xl">
                                <img src="${LOGO_IMG}" alt="Logo Lorevia Entertainment" class="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover">
                            </div>
                        </div>
                        <h1 class="font-serif text-4xl md:text-6xl font-bold gold-text tracking-wide">Lorevia Entertainment</h1>
                        <p class="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light">
                            Selamat datang di dunia keajaiban hutan tropis penuh bakti, talenta agung, dan kreativitas tanpa batas. Buka menu burger di kanan atas untuk menjelajahi agensi kami.
                        </p>
                        <div class="pt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            <div class="bg-forest-800/60 p-6 rounded-2xl gold-border backdrop-blur-sm">
                                <span class="text-3xl">🌱</span>
                                <h3 class="font-serif text-xl font-bold gold-text mt-3">Trainee Berbakat</h3>
                                <p class="text-sm text-gray-300 mt-2">Bergabunglah dalam program pelatihan intensif langsung di bawah bimbingan para coach profesional.</p>
                            </div>
                            <div class="bg-forest-800/60 p-6 rounded-2xl gold-border backdrop-blur-sm">
                                <span class="text-3xl">🛡️</span>
                                <h3 class="font-serif text-xl font-bold gold-text mt-3">management & Security</h3>
                                <p class="text-sm text-gray-300 mt-2">Tim solid yang menjaga kedamaian dan ketertiban seluruh ekosistem Lorevia Entertainment.</p>
                            </div>
                            <div class="bg-forest-800/60 p-6 rounded-2xl gold-border backdrop-blur-sm">
                                <span class="text-3xl">🏆</span>
                                <h3 class="font-serif text-xl font-bold gold-text mt-3">Prestasi Emas</h3>
                                <p class="text-sm text-gray-300 mt-2">Deretan pencapaian spektakuler yang menempatkan kami di puncak industri hiburan.</p>
                            </div>
                        </div>

                        <!-- Featured Posters -->
                        <div class="mt-16 relative">
                            <h3 class="font-serif text-2xl font-bold gold-text mb-6">Poster Resmi Lorevia Entertainment</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                                <div class="rounded-2xl overflow-hidden gold-border shadow-2xl group relative">
                                    <img src="${POSTER1_IMG}" alt="Poster Lorevia Entertainment 1" class="w-full h-auto object-cover group-hover:scale-105 transition duration-500">
                                </div>
                                <div class="rounded-2xl overflow-hidden gold-border shadow-2xl group relative">
                                    <img src="${POSTER2_IMG}" alt="Poster Lorevia Entertainment 2" class="w-full h-auto object-cover group-hover:scale-105 transition duration-500">
                                </div>
                                <div class="absolute -top-2 -right-3 md:-right-5 w-20 h-20 md:w-24 md:h-24 rounded-full gold-border overflow-hidden shadow-2xl bg-forest-900 z-10">
                                    <img src="${LOGO_IMG}" alt="Logo Lorevia Entertainment" class="w-full h-full object-cover">
                                </div>
                            </div>
                        </div>

                        <!-- Statistik Database Ringkas -->
                        <div class="mt-16 text-center space-y-8">
                            <div>
                                <h3 class="font-serif text-2xl md:text-3xl font-bold gold-text mb-1">Database Lorevia Entertainment</h3>
                                <p class="text-gray-300 text-sm">Rekap statistik management, trainee, dan generasi resmi yang tergabung di agensi.</p>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                                <div class="bg-forest-800/70 p-8 rounded-2xl gold-border shadow-xl hover:-translate-y-1 transition duration-300">
                                    <span class="text-4xl">🛡️</span>
                                    <p class="text-4xl font-serif font-bold gold-text mt-3">${appData.managementList.length}</p>
                                    <p class="text-sm text-gray-300 mt-1 uppercase tracking-wide">management</p>
                                </div>
                                <div class="bg-forest-800/70 p-8 rounded-2xl gold-border shadow-xl hover:-translate-y-1 transition duration-300">
                                    <span class="text-4xl">🌱</span>
                                    <p class="text-4xl font-serif font-bold gold-text mt-3">${traineeMembers.length}</p>
                                    <p class="text-sm text-gray-300 mt-1 uppercase tracking-wide">Trainee</p>
                                </div>
                            </div>

                            <!-- Statistik per Generasi (Gen) yang sudah debut, masing-masing bisa diklik untuk lihat member -->
                            ${generations.length > 0 ? `
                            <div class="pt-4">
                                <h4 class="font-serif text-lg font-bold text-gold-400 mb-4">Generasi Resmi yang Sudah Debut</h4>
                                <div class="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
                                    ${generations.map(g => `
                                        <div onclick="viewGeneration('${g.replace(/'/g, "\\'")}')" class="cursor-pointer bg-forest-800/70 p-8 rounded-2xl gold-border shadow-xl hover:-translate-y-1 hover:shadow-gold-500/30 transition duration-300 w-44">
                                            <span class="text-4xl">✨</span>
                                            <p class="text-4xl font-serif font-bold gold-text mt-3">${getGenerationMembers(g).length}</p>
                                            <p class="text-sm text-gray-300 mt-1 uppercase tracking-wide">${g}</p>
                                            <p class="text-[10px] text-gold-400 mt-2 uppercase tracking-widest">Klik untuk lihat &rarr;</p>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            ` : `
                            <p class="text-sm text-gray-400 italic">Belum ada generasi resmi yang debut.</p>
                            `}
                            <p class="text-xs text-gray-400">Lihat detail lengkap member di menu <span class="text-gold-400 font-semibold">Member</span> pada navigasi burger.</p>
                        </div>

                    </div>
                `;
            }
            animatePageReveal();
        }
