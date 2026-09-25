// Tampilan halaman "Checkout - Lorevia Entertainment" (route: checkout).
// Markup disalin apa adanya dari versi satu file.
        function renderView() {
            const content = document.getElementById('appContent');
            if (currentRoute !== 'toko') stopPromoBanner();
            if (currentRoute === 'checkout') {
                const subtotal = cart.reduce((a, c) => a + (c.price * c.qty), 0);
                const discount = getPromoDiscount(subtotal);
                const total = Math.max(0, subtotal - discount);
                content.innerHTML = `
                    <div class="max-w-3xl mx-auto py-8 space-y-6">
                        <h2 class="font-serif text-3xl font-bold gold-text text-center">Keranjang & Pembayaran</h2>
                        ${cart.length === 0 ? `
                        <div class="text-center py-16 space-y-4">
                            <p class="text-gray-400">Keranjang kamu masih kosong.</p>
                            <button onclick="navigate('toko')" class="px-5 py-2.5 rounded-xl bg-gold-600 hover:bg-gold-500 text-black font-bold transition">Belanja ke Toko</button>
                        </div>
                        ` : `
                        <div class="bg-forest-800/70 rounded-2xl gold-border p-5 space-y-3">
                            ${cart.map((c, idx) => `
                                <div class="flex items-center gap-3 border-b border-forest-700 pb-3 last:border-0 last:pb-0">
                                    <div class="w-14 h-14 rounded-lg overflow-hidden bg-forest-900 flex-shrink-0">
                                        ${c.image ? `<img src="${c.image}" class="w-full h-full object-cover">` : ''}
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-semibold text-gold-400 truncate">${c.name}</p>
                                        <p class="text-xs text-gray-400">${formatRupiah(c.price)} x ${c.qty}</p>
                                    </div>
                                    <div class="flex items-center gap-1.5">
                                        <button onclick="changeCartQty(${idx}, -1)" class="w-7 h-7 rounded bg-forest-900 border border-forest-600 text-gold-400 font-bold">-</button>
                                        <span class="w-6 text-center text-sm">${c.qty}</span>
                                        <button onclick="changeCartQty(${idx}, 1)" class="w-7 h-7 rounded bg-forest-900 border border-forest-600 text-gold-400 font-bold">+</button>
                                    </div>
                                    <button onclick="removeFromCart(${idx})" class="text-red-400 hover:text-red-300 text-xs font-semibold ml-2">Hapus</button>
                                </div>
                            `).join('')}
                            <div class="flex justify-between items-center pt-2 text-sm">
                                <span class="text-gray-400">Subtotal</span>
                                <span class="text-gray-300">${formatRupiah(subtotal)}</span>
                            </div>
                            ${appliedPromo ? `
                            <div class="flex justify-between items-center text-sm">
                                <span class="text-gray-400">Diskon (${appliedPromo.code})</span>
                                <span class="text-red-400">-${formatRupiah(discount)}</span>
                            </div>
                            ` : ''}
                            <div class="flex justify-between items-center pt-2 text-lg font-bold border-t border-forest-700">
                                <span class="text-gray-300">Total</span>
                                <span class="gold-text">${formatRupiah(total)}</span>
                            </div>
                        </div>

                        <div class="bg-forest-800/70 rounded-2xl gold-border p-5 space-y-3">
                            <h3 class="font-serif text-lg font-bold text-gold-400">Kode Promo / Voucher</h3>
                            ${appliedPromo ? `
                            <div class="flex items-center justify-between bg-forest-900 border border-gold-600 rounded-xl px-4 py-2.5">
                                <div>
                                    <p class="text-sm font-bold text-gold-400">${appliedPromo.code}</p>
                                    <p class="text-xs text-gray-400">Berhasil diterapkan, hemat ${formatRupiah(discount)}</p>
                                </div>
                                <button onclick="removePromoCode()" class="text-red-400 hover:text-red-300 text-xs font-semibold">Hapus</button>
                            </div>
                            ` : `
                            <form onsubmit="applyPromoCode(event)" class="flex gap-2">
                                <input type="text" id="promoCodeInput" placeholder="Masukkan kode promo (jika ada)" class="flex-1 px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-sm outline-none uppercase">
                                <button type="submit" class="px-5 py-2.5 rounded-xl bg-gold-600 hover:bg-gold-500 text-black text-sm font-bold transition whitespace-nowrap">Pakai Kode</button>
                            </form>
                            <p id="promoErrorMsg" class="text-xs text-red-400 hidden"></p>
                            `}
                        </div>

                        <div class="bg-forest-800/70 rounded-2xl gold-border p-5 space-y-4 text-center">
                            <h3 class="font-serif text-xl font-bold text-gold-400">Scan Untuk Bayar</h3>
                            <img src="${PAYMENT_QR_IMG}" alt="QR Pembayaran" class="w-56 h-56 mx-auto rounded-xl border-2 border-gold-600 object-cover">
                            <p class="text-sm text-gray-300">Setelah transfer sesuai total di atas, kasi bukti ss payment nya yaa lewat kontak admin kami! Pesanan diproses setelah bukti pembayaran diterima.</p>
                        </div>

                        <form onsubmit="submitOrder(event)" class="bg-forest-800/70 rounded-2xl gold-border p-5 space-y-3">
                            <h3 class="font-serif text-lg font-bold text-gold-400">Data Pemesan</h3>
                            <input type="text" id="orderName" placeholder="Nama Lengkap" required class="w-full px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-sm outline-none">
                            <input type="text" id="orderContact" placeholder="Nomor WhatsApp / Kontak" required class="w-full px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-sm outline-none">
                            <textarea id="orderNote" placeholder="Catatan (opsional, cth: alamat pengiriman)" rows="2" class="w-full px-4 py-2.5 rounded-xl bg-forest-900 border border-forest-600 text-white text-sm outline-none"></textarea>
                            <button type="submit" class="w-full py-3 rounded-xl bg-gold-600 hover:bg-gold-500 text-black font-bold transition">Konfirmasi Pesanan</button>
                        </form>
                        `}
                    </div>
                `;
                updateCartBadge();
            }
            animatePageReveal();
        }
