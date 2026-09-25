// Tampilan halaman "Audio Playlist - Lorevia Entertainment" (route: audio-playlist).
// Markup disalin apa adanya dari versi satu file.
let audioPlaylistLoaded = false;

async function loadAudioPlaylistData() {
    if (audioPlaylistLoaded) return;
    try {
        const response = await fetch(`${API_URL}?type=audio-playlist`, { cache: 'no-store' });
        const result = await response.json();
        if (!result.ok) throw new Error(result.error || 'Gagal memuat audio playlist');
        const playlists = result.data.filter(row => row['Tipe'] === 'playlist');
        const items = result.data.filter(row => row['Tipe'] !== 'playlist');
        appData.audioPlaylists = playlists.map(row => ({ id: row['ID'], name: row['Nama/Judul'] || '', desc: row['Deskripsi/Tanggal'] || '', image: row['URL Cover'] || '' }));
        appData.audios = items.map(row => ({ id: row['ID'], title: row['Nama/Judul'] || '', date: row['Deskripsi/Tanggal'] || '', playlistId: row['Playlist ID'] || null, data: row['URL Media'] || '', cover: row['URL Cover'] || '', plays: 0, likes: 0, comments: [] })).filter(item => item.data);
    } catch (error) {
        console.error('Gagal load audio playlist:', error);
    } finally {
        audioPlaylistLoaded = true;
    }
}

        function renderView() {
            const content = document.getElementById('appContent');
            if (currentRoute !== 'toko') stopPromoBanner();
            if (currentRoute === 'audio-playlist') {
                if (!audioPlaylistLoaded) {
                    content.innerHTML = '<div class="max-w-4xl mx-auto py-16 text-center text-gray-300">Memuat audio playlist...</div>';
                    loadAudioPlaylistData().then(() => { if (currentRoute === 'audio-playlist') renderView(); });
                    return;
                }
                content.innerHTML = `
                    <div class="max-w-4xl mx-auto py-8 space-y-8">
                        <div class="text-center space-y-2">
                            <span class="inline-block text-[11px] tracking-[0.3em] uppercase text-gold-500/80 font-semibold">Dengarkan Sekarang</span>
                            <h2 class="font-serif text-3xl md:text-4xl font-bold gold-text">🎧 Audio Playlist</h2>
                            <p class="text-gray-300 mt-1">Rekaman suara & lagu resmi Lorevia Entertainment.</p>
                            <div class="w-16 h-[3px] bg-gold-600 mx-auto rounded-full"></div>
                            ${appData.audios.length > 0 ? `<p class="text-[11px] text-gray-400">${appData.audios.length} audio tersedia</p>` : ''}
                        </div>
                        ${appData.audioPlaylists.length > 0 ? `
                        <div class="flex flex-wrap justify-center gap-2">
                            <button type="button" onclick="setAudioFilter(null)" class="px-4 py-1.5 rounded-full text-xs font-semibold border transition ${currentAudioFilter === null ? 'bg-gold-600 text-black border-gold-600' : 'bg-forest-800/60 text-gray-300 border-forest-600 hover:border-gold-500/70 hover:text-gold-400'}">Semua</button>
                            ${appData.audioPlaylists.map(p => `
                                <button type="button" onclick="setAudioFilter(${p.id})" class="px-4 py-1.5 rounded-full text-xs font-semibold border transition ${currentAudioFilter === p.id ? 'bg-gold-600 text-black border-gold-600' : 'bg-forest-800/60 text-gray-300 border-forest-600 hover:border-gold-500/70 hover:text-gold-400'}">${p.name}</button>
                            `).join('')}
                        </div>
                        ` : ''}
                        ${appData.audios.length === 0 ? `
                        <p class="text-center text-gray-400 py-16">Belum ada audio yang diunggah.</p>
                        ` : (() => {
                            const filteredAudios = appData.audios.map((a, i) => ({ a, i })).filter(({ a }) => currentAudioFilter === null || a.playlistId === currentAudioFilter);
                            if (filteredAudios.length === 0) {
                                return `<p class="text-center text-gray-400 py-16">Belum ada audio di playlist ini.</p>`;
                            }
                            return `
                        <div class="space-y-4">
                            ${filteredAudios.map(({ a, i: idx }) => `
                                <div id="audioCard_${idx}" class="audio-card group relative overflow-hidden rounded-2xl gold-border bg-forest-800/70 shadow-lg transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-gold-600/20">
                                    <div class="absolute inset-0 opacity-15 bg-cover bg-center" style="background-image:url('${a.cover || ''}')"></div>
                                    <div class="relative flex items-center gap-4 p-4 md:p-5">
                                        <div class="relative flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden bg-forest-900 border border-gold-600/40 shadow-inner">
                                            ${a.cover ? `<img src="${a.cover}" alt="${a.title}" class="w-full h-full object-cover">` : `<div class="w-full h-full flex items-center justify-center text-xl">🎵</div>`}
                                            <button onclick="playAudio(${idx})" id="audioPlayBtn_${idx}" class="absolute inset-0 w-full h-full bg-black/40 hover:bg-black/55 text-gold-400 flex items-center justify-center text-xl md:text-2xl transition">▶</button>
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p class="font-serif text-base md:text-lg font-bold text-white truncate">${a.title}</p>
                                            <div class="flex items-center gap-2 mt-0.5">
                                                ${a.date ? `<p class="text-[11px] text-gray-400">${a.date}</p>` : ''}
                                                <span id="audioEq_${idx}" class="hidden eq-bars items-end gap-[2px] h-3"><i></i><i></i><i></i></span>
                                            </div>
                                        </div>
                                        <div class="flex-shrink-0 flex items-center gap-1.5 pl-3 border-l border-gold-600/30">
                                            <span class="text-base">🎧</span>
                                            <div class="text-right leading-tight">
                                                <p id="audioPlays_${idx}" class="text-sm md:text-base font-bold text-gold-400">${(a.plays || 0).toLocaleString('id-ID')}</p>
                                                <p class="text-[9px] uppercase tracking-wider text-gray-400">Pendengar</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="relative flex items-center justify-end gap-4 px-4 md:px-5 pb-3 -mt-1">
                                        <button type="button" onclick="toggleLike('audio', ${idx})" id="audioLikeBtn_${idx}" class="text-xs flex items-center gap-1 ${a._liked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'} transition">
                                            <span id="audioLikeIcon_${idx}">${a._liked ? '❤️' : '🤍'}</span><span id="audioLikeCount_${idx}">${(a.likes || 0).toLocaleString('id-ID')}</span>
                                        </button>
                                        <button type="button" onclick="openComments('audio', ${idx})" class="text-xs flex items-center gap-1 text-gray-400 hover:text-gold-400 transition">
                                            💬 <span>${(a.comments && a.comments.length) || 0}</span>
                                        </button>
                                    </div>
                                    <audio id="audioPlayer_${idx}" src="${a.data}" class="hidden" preload="none"></audio>
                                </div>
                            `).join('')}
                        </div>
                        `;
                        })()}
                    </div>
                `;
            }
            animatePageReveal();
        }
