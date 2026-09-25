// Halaman About: profil singkat Lorevia Entertainment + link sosial media.

        const SOCIAL_LINKS = [
            {
                name: 'YouTube',
                handle: '@loreviaentoffc',
                url: 'https://youtube.com/@loreviaentoffc?si=e1Y-AH60QbiLehur',
                desc: 'Nonton MV, behind the scene, dan konten video lainnya.',
                accent: '#FF0033',
                icon: '<path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8ZM9.6 15.5V8.5l6.3 3.5-6.3 3.5Z"/>'
            },
            {
                name: 'TikTok',
                handle: '@loreviaentertainment26',
                url: 'https://www.tiktok.com/@loreviaentertainment26?_r=1&_t=ZS-99rQy93hmlx',
                desc: 'Update harian, teaser, dan momen seru dari balik layar.',
                accent: '#25F4EE',
                icon: '<path d="M16.6 5.8a4.6 4.6 0 0 1-3.8-4.1h-3.2v14.6a2.6 2.6 0 1 1-1.8-2.5V10.5a5.8 5.8 0 1 0 5 5.8V9.7a7.8 7.8 0 0 0 4.5 1.4V7.9a4.6 4.6 0 0 1-.7-2.1Z"/>'
            },
            {
                name: 'WhatsApp Channel',
                handle: 'Lorevia Entertainment',
                url: 'https://whatsapp.com/channel/0029VbD5Bbe9hXF5LMG9TM2L',
                desc: 'Ikuti channel WA buat info & pengumuman paling cepat.',
                accent: '#25D366',
                icon: '<path d="M17.5 14.4c-.3-.1-1.7-.8-1.9-.9-.3-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.3-.4a.5.5 0 0 0 0-.5c-.1-.1-.6-1.5-.9-2-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.5-.3ZM12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 20.2 12 8.2 8.2 0 0 1 12 20.2Z"/>'
            }
        ];

        function renderView() {
            const content = document.getElementById('appContent');
            if (!content) return;

            const socialCards = SOCIAL_LINKS.map(s => `
                <a href="${s.url}" target="_blank" rel="noopener noreferrer"
                   class="group flex items-center gap-4 bg-forest-800/60 gold-border rounded-2xl p-4 md:p-5 hover:bg-forest-700/70 transition transform hover:-translate-y-0.5 hover:shadow-xl">
                    <div class="w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center" style="background:${s.accent}1A;">
                        <svg viewBox="0 0 24 24" class="w-6 h-6" fill="${s.accent}">${s.icon}</svg>
                    </div>
                    <div class="flex-1 min-w-0">
                        <p class="font-serif font-bold text-gold-400 text-base md:text-lg">${s.name}</p>
                        <p class="text-xs md:text-sm text-gray-400 truncate">${s.handle}</p>
                        <p class="text-xs md:text-sm text-gray-300 mt-1">${s.desc}</p>
                    </div>
                    <svg class="w-5 h-5 text-gold-500 flex-shrink-0 transition transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </a>
            `).join('');

            content.innerHTML = `
                <div class="max-w-3xl mx-auto space-y-8">

                    <div class="text-center space-y-3">
                        <h1 class="font-serif text-3xl md:text-4xl font-bold gold-text">Tentang Kami</h1>
                        <p class="text-gray-300 text-sm md:text-base leading-relaxed">
                            <span class="font-semibold text-gold-400">Lorevia Entertainment</span> adalah agensi hiburan yang berfokus
                            mencetak talenta muda di bidang vokal, rap, dan dance. Kami percaya setiap trainee punya potensi untuk
                            berkembang menjadi entertainer profesional lewat bimbingan, latihan, dan panggung yang tepat.
                        </p>
                    </div>

                    <div class="bg-forest-800/40 gold-border rounded-2xl p-6 md:p-8 space-y-4">
                        <h2 class="font-serif text-xl md:text-2xl font-bold gold-text">Visi & Misi</h2>
                        <ul class="text-gray-300 text-sm md:text-base leading-relaxed list-disc list-inside space-y-2">
                            <li>Menjadi wadah pengembangan bakat hiburan yang suportif dan profesional.</li>
                            <li>Membina trainee dan management dengan pelatihan rutin di berbagai divisi.</li>
                            <li>Menghadirkan konten dan pertunjukan berkualitas untuk seluruh member dan penggemar.</li>
                        </ul>
                    </div>

                    <div class="space-y-4">
                        <h2 class="font-serif text-xl md:text-2xl font-bold gold-text text-center">Sosial Media Kami</h2>
                        <p class="text-center text-gray-400 text-sm">Yuk follow biar nggak ketinggalan update dari kami!</p>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            ${socialCards}
                        </div>
                    </div>

                    <div class="bg-forest-800/40 gold-border rounded-2xl p-6 md:p-8 space-y-5">
                        <h2 class="font-serif text-xl md:text-2xl font-bold gold-text text-center">Info & Kontak</h2>

                        <div class="flex items-start gap-3">
                            <svg class="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <div>
                                <p class="text-sm font-semibold text-gold-400">Alamat</p>
                                <p class="text-sm text-gray-300">123 Hutan Damai-gil, Gangnam-gu, Seoul 06123, South Korea</p>
                            </div>
                        </div>

                        <div class="flex items-start gap-3">
                            <svg class="w-5 h-5 text-gold-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                            </svg>
                            <div>
                                <p class="text-sm font-semibold text-gold-400">Laporkan Masalah</p>
                                <p class="text-sm text-gray-300">
                                    Email: <a href="mailto:loreviaentertainment0810@gmail.com" class="underline hover:text-gold-400 transition">loreviaentertainment0810@gmail.com</a>
                                </p>
                                <p class="text-sm text-gray-300">
                                    WhatsApp: <a href="https://wa.me/6285141679594" target="_blank" rel="noopener noreferrer" class="underline hover:text-gold-400 transition">0851-4167-9594</a>
                                </p>
                            </div>
                        </div>

                        <button onclick="navigate('toko')" class="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gold-600 hover:bg-gold-500 text-black font-bold text-sm transition transform hover:scale-[1.02] active:scale-95">
                            <span>🛍️ Dukung Agensi Kami — Kunjungi Toko</span>
                        </button>
                    </div>

                </div>
            `;

            animatePageReveal();
        }