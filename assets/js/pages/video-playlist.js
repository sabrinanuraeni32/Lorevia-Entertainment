// Tampilan halaman "Video Playlist - Lorevia Entertainment" (route: video-playlist).
// Markup disalin apa adanya dari versi satu file.
let videoPlaylistLoaded = false;

async function loadVideoPlaylistData() {
    if (videoPlaylistLoaded) return;
    try {
        const response = await fetch(`${API_URL}?type=video-playlist`, { cache: 'no-store' });
        const result = await response.json();
        if (!result.ok) throw new Error(result.error || 'Gagal memuat video playlist');
        const playlists = result.data.filter(row => row['Tipe'] === 'playlist');
        const items = result.data.filter(row => row['Tipe'] !== 'playlist');
        appData.videoPlaylists = playlists.map(row => ({ id: row['ID'], name: row['Nama/Judul'] || '', desc: row['Deskripsi/Tanggal'] || '', image: row['URL Cover'] || '' }));
        appData.videos = items.map(row => ({ id: row['ID'], title: row['Nama/Judul'] || '', date: row['Deskripsi/Tanggal'] || '', playlistId: row['Playlist ID'] || null, orientation: row['Orientasi'] || 'landscape', data: row['URL Media'] || '', thumbnail: row['URL Cover'] || '', views: 0, likes: 0, comments: [] })).filter(item => item.data);
    } catch (error) {
        console.error('Gagal load video playlist:', error);
    } finally {
        videoPlaylistLoaded = true;
    }
}

        function renderView() {
            const content = document.getElementById('appContent');
            if (currentRoute !== 'toko') stopPromoBanner();
            if (currentRoute === 'video-playlist') {
                if (!videoPlaylistLoaded) {
                    content.innerHTML = '<div class="max-w-6xl mx-auto py-16 text-center text-gray-300">Memuat video playlist...</div>';
                    loadVideoPlaylistData().then(() => { if (currentRoute === 'video-playlist') renderView(); });
                    return;
                }
                content.innerHTML = `
                    <div class="max-w-6xl mx-auto py-8 space-y-8">
                        <div class="text-center space-y-2">
                            <span class="inline-block text-[11px] tracking-[0.3em] uppercase text-gold-500/80 font-semibold">Koleksi Resmi</span>
                            <h2 class="font-serif text-3xl md:text-4xl font-bold gold-text">🎬 Video Playlist</h2>
                            <p class="text-gray-300 mt-1">Kumpulan video resmi Lorevia Entertainment — langsung dari hutan tropis kami.</p>
                            <div class="w-16 h-[3px] bg-gold-600 mx-auto rounded-full"></div>
                            ${appData.videos.length > 0 ? `<p class="text-[11px] text-gray-400">${appData.videos.length} video tersedia</p>` : ''}
                        </div>
                        ${appData.videoPlaylists.length > 0 ? `
                        <div class="flex flex-wrap justify-center gap-2">
                            <button type="button" onclick="setVideoFilter(null)" class="px-4 py-1.5 rounded-full text-xs font-semibold border transition ${currentVideoFilter === null ? 'bg-gold-600 text-black border-gold-600' : 'bg-forest-800/60 text-gray-300 border-forest-600 hover:border-gold-500/70 hover:text-gold-400'}">Semua</button>
                            ${appData.videoPlaylists.map(p => `
                                <button type="button" onclick="setVideoFilter(${p.id})" class="px-4 py-1.5 rounded-full text-xs font-semibold border transition ${currentVideoFilter === p.id ? 'bg-gold-600 text-black border-gold-600' : 'bg-forest-800/60 text-gray-300 border-forest-600 hover:border-gold-500/70 hover:text-gold-400'}">${p.name}</button>
                            `).join('')}
                        </div>
                        ` : ''}
                        ${appData.videos.length === 0 ? `
                        <p class="text-center text-gray-400 py-16">Belum ada video yang diunggah.</p>
                        ` : (() => {
                            const filteredVideos = appData.videos.map((v, i) => ({ v, i })).filter(({ v }) => currentVideoFilter === null || v.playlistId === currentVideoFilter);
                            filteredVideos.sort((a, b) => {
                                const aPortrait = a.v.orientation === 'portrait' ? 0 : 1;
                                const bPortrait = b.v.orientation === 'portrait' ? 0 : 1;
                                return aPortrait - bPortrait;
                            });
                            if (filteredVideos.length === 0) {
                                return `<p class="text-center text-gray-400 py-16">Belum ada video di playlist ini.</p>`;
                            }
                            return `
                        <div class="flex flex-wrap justify-center gap-5 md:gap-6">
                            ${filteredVideos.map(({ v, i: idx }) => `
                                <div onclick="openVideoPlayer(${idx})" class="w-[46%] sm:w-[30%] md:w-[22%] cursor-pointer group relative bg-forest-800/60 rounded-2xl border border-forest-700 overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-gold-500/70 hover:shadow-xl hover:shadow-gold-600/20">
                                    <div class="${v.orientation === 'portrait' ? 'aspect-[9/16]' : 'aspect-video'} bg-black relative overflow-hidden">
                                        ${v.thumbnail ? `<img src="${v.thumbnail}" alt="${v.title}" class="w-full h-full object-cover pointer-events-none transition duration-500 group-hover:scale-105">` : `<video src="${v.data}" class="w-full h-full object-cover pointer-events-none transition duration-500 group-hover:scale-105" muted preload="metadata"></video>`}
                                        <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                                        <div class="absolute inset-0 flex items-center justify-center">
                                            <span class="w-11 h-11 md:w-14 md:h-14 rounded-full bg-gold-500/90 text-black flex items-center justify-center text-lg md:text-2xl shadow-lg shadow-black/40 scale-90 group-hover:scale-100 transition duration-300">▶</span>
                                        </div>
                                        ${v.orientation === 'portrait' ? `<span class="absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wider bg-black/60 text-gold-400 px-2 py-0.5 rounded-full border border-gold-600/40">Shorts</span>` : ''}
                                    </div>
                                    <div class="p-3 space-y-1.5">
                                        <p class="text-xs md:text-sm font-semibold text-gold-400 line-clamp-2 group-hover:text-gold-300 transition">${v.title}</p>
                                        ${v.date ? `<p class="text-[10px] text-gray-400 flex items-center gap-1">🗓️ ${v.date}</p>` : ''}
                                        <div class="flex items-center justify-between pt-1.5 mt-1 border-t border-forest-700/60">
                                            <span id="videoViews_${idx}" class="text-[10px] text-gray-400 flex items-center gap-1">👁️ ${(v.views || 0).toLocaleString('id-ID')}</span>
                                            <div class="flex items-center gap-2.5">
                                                <button type="button" onclick="event.stopPropagation(); toggleLike('video', ${idx})" id="videoLikeBtn_${idx}" class="text-[11px] flex items-center gap-1 ${v._liked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'} transition">
                                                    <span id="videoLikeIcon_${idx}">${v._liked ? '❤️' : '🤍'}</span><span id="videoLikeCount_${idx}">${(v.likes || 0).toLocaleString('id-ID')}</span>
                                                </button>
                                                <button type="button" onclick="event.stopPropagation(); openComments('video', ${idx})" class="text-[11px] flex items-center gap-1 text-gray-400 hover:text-gold-400 transition">
                                                    💬 <span>${(v.comments && v.comments.length) || 0}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
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
