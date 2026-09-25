// Tampilan halaman "Toko - Lorevia Entertainment" (route: toko).
// Markup disalin apa adanya dari versi satu file.
        function renderView() {
            const content = document.getElementById('appContent');
            if (currentRoute !== 'toko') stopPromoBanner();
            if (currentRoute === 'toko') {
                content.innerHTML = `
                    <div class="max-w-6xl mx-auto py-8 space-y-8">
                        <div class="flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
                            <div>
                                <h2 class="font-serif text-3xl font-bold gold-text">Toko Lorevia Entertainment</h2>
                                <p class="text-gray-300 mt-1">Album, merchandise, dan koleksi resmi dari hutan tropis kami.</p>
                            </div>
                            <button onclick="navigate('checkout')" class="px-5 py-2.5 rounded-xl bg-forest-800 gold-border text-gold-400 font-semibold hover:bg-forest-700 transition whitespace-nowrap">
                                Keranjang (${cart.reduce((a,c)=>a+c.qty,0)})
                            </button>
                        </div>
                        ${(() => {
                            const activePromos = getActivePromos();
                            if (activePromos.length === 0) return '';
                            return `
                            <div id="promoBannerBox" class="relative overflow-hidden rounded-2xl gold-border bg-gradient-to-r from-forest-800 to-forest-700">
                                <div id="promoBannerTrack" class="relative h-14"></div>
                            </div>
                            `;
                        })()}
                        ${appData.products.length === 0 ? `
                        <p class="text-center text-gray-400 py-16">Belum ada produk yang tersedia saat ini. Nantikan album dan merchandise terbaru kami!</p>
                        ` : `
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            ${appData.products.map((p, idx) => {
                                const imgs = (p.images && p.images.length > 0) ? p.images : [''];
                                const activeIdx = productActiveImg[idx] || 0;
                                const stock = parseInt(p.qty, 10) || 0;
                                return `
                                <div class="bg-forest-800/70 rounded-2xl border border-forest-700 overflow-hidden gold-border flex flex-col">
                                    <div class="aspect-square bg-forest-900 overflow-hidden">
                                        ${imgs[activeIdx] ? `<img src="${imgs[activeIdx]}" alt="${p.name}" class="w-full h-full object-cover">` : `<div class="w-full h-full flex items-center justify-center text-gray-500 text-sm">Tidak ada foto</div>`}
                                    </div>
                                    ${imgs.length > 1 ? `
                                    <div class="flex gap-1.5 px-3 pt-2 overflow-x-auto">
                                        ${imgs.map((im, i) => `<img src="${im}" onclick="setProductImg(${idx}, ${i})" class="w-10 h-10 rounded-md object-cover cursor-pointer border-2 ${i === activeIdx ? 'border-gold-500' : 'border-forest-600'} flex-shrink-0">`).join('')}
                                    </div>
                                    ` : ''}
                                    <div class="p-4 flex-1 flex flex-col space-y-2">
                                        <h3 class="font-serif text-lg font-bold text-gold-400">${p.name}</h3>
                                        <p class="text-xs text-gray-300 flex-1 line-clamp-3">${p.description || ''}</p>
                                        <p class="text-base font-bold text-white">${formatRupiah(p.price)}</p>
                                        <p class="text-[11px] ${stock > 0 ? 'text-gray-400' : 'text-red-400 font-semibold'}">${stock > 0 ? `Stok: ${stock}` : 'Stok habis'}</p>
                                        ${stock > 0 ? `
                                        <div class="flex items-center gap-2 pt-1">
                                            <input type="number" id="prodQty_${idx}" value="1" min="1" max="${stock}" class="w-16 px-2 py-1.5 rounded-lg bg-forest-900 border border-forest-600 text-white text-sm text-center outline-none">
                                            <button onclick="addToCart(${idx})" class="flex-1 py-1.5 rounded-lg bg-gold-600 hover:bg-gold-500 text-black text-sm font-bold transition">Tambah ke Keranjang</button>
                                        </div>
                                        ` : `
                                        <button disabled class="w-full py-1.5 rounded-lg bg-gray-700 text-gray-400 text-sm font-bold cursor-not-allowed">Stok Habis</button>
                                        `}
                                    </div>
                                </div>
                                `;
                            }).join('')}
                        </div>
                        `}
                    </div>
                `;
                updateCartBadge();
                startPromoBanner();
            }
            animatePageReveal();
        }
