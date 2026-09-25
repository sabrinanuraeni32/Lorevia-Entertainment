// Tampilan halaman "Guest Box - Lorevia Entertainment" (route: guestbox).
// Markup disalin apa adanya dari versi satu file.
let guestBoxLoaded = false;

function escapeGuestBoxHtml(value) {
    return String(value || '').replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[character]));
}

async function loadGuestBoxes() {
    if (guestBoxLoaded) return;
    try {
        const response = await fetch(`${API_URL}?type=guestbox`, { cache: 'no-store' });
        const result = await response.json();
        if (!result.ok) throw new Error(result.error || 'Gagal memuat Guest Box');

        appData.guestBoxes = result.data.map(row => ({
            name: row['Nama'] || '',
            message: row['Pesan'] || '',
            date: row['Tanggal'] || row['Timestamp'] || ''
        })).filter(item => item.name || item.message);
    } catch (error) {
        console.error('Gagal load Guest Box:', error);
    } finally {
        guestBoxLoaded = true;
    }
}

        function renderView() {
            const content = document.getElementById('appContent');
            if (currentRoute !== 'toko') stopPromoBanner();
            if (currentRoute === 'guestbox') {
                if (!guestBoxLoaded) {
                    content.innerHTML = `
                        <div class="max-w-3xl mx-auto py-8 text-center">
                            <h2 class="font-serif text-3xl font-bold gold-text">Guest Box (Buku Tamu)</h2>
                            <p class="text-gray-300 mt-2">Memuat pesan pengunjung...</p>
                        </div>
                    `;
                    loadGuestBoxes().then(() => {
                        if (currentRoute === 'guestbox') renderView();
                    });
                    return;
                }
                content.innerHTML = `
                    <div class="max-w-3xl mx-auto py-8 space-y-8">
                        <div class="text-center">
                            <h2 class="font-serif text-3xl font-bold gold-text">Guest Box (Buku Tamu)</h2>
                            <p class="text-gray-300 mt-1">Tinggalkan pesan, kesan, atau dukungan Anda untuk Lorevia Entertainment.</p>
                        </div>
                        
                        <!-- Form Guest Box -->
                        <div class="bg-forest-800/80 p-6 rounded-2xl gold-border shadow-xl">
                            <form onsubmit="submitGuest(event)" class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gold-400 mb-1">Nama / Panggilan</label>
                                    <input type="text" id="gName" required class="w-full px-4 py-3 rounded-xl bg-forest-900 border border-forest-600 focus:border-gold-500 text-white outline-none">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gold-400 mb-1">Pesan / Kesan</label>
                                    <textarea id="gMsg" rows="3" required class="w-full px-4 py-3 rounded-xl bg-forest-900 border border-forest-600 focus:border-gold-500 text-white outline-none"></textarea>
                                </div>
                                <button type="submit" class="w-full py-3 rounded-xl bg-gold-600 hover:bg-gold-500 text-black font-bold transition shadow-lg">Kirim Pesan</button>
                            </form>
                        </div>

                        <!-- List of Messages -->
                        <div class="space-y-4">
                            <h3 class="font-serif text-xl font-bold gold-text border-b border-forest-700 pb-2">Pesan Pengunjung</h3>
                            ${appData.guestBoxes.slice().reverse().map(gb => `
                                <div class="bg-forest-800/60 p-5 rounded-xl border border-forest-700 shadow-md space-y-2">
                                    <div class="flex justify-between items-center text-xs text-gray-400">
                                        <span class="font-bold text-gold-400 text-sm">${escapeGuestBoxHtml(gb.name)}</span>
                                        <span>${escapeGuestBoxHtml(gb.date)}</span>
                                    </div>
                                    <p class="text-sm text-gray-200">${escapeGuestBoxHtml(gb.message)}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
            animatePageReveal();
        }
