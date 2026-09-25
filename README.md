# Lorevia Entertainment — struktur multi-halaman

Hasil pemisahan dari satu file `index-1-1.html` menjadi satu file HTML per halaman.
Desain, isi, dan fungsi tidak diubah.

## Halaman

| File | Route lama |
|---|---|
| index.html | beranda |
| gen-members.html | gen-members |
| pendaftaran-trainee.html | pendaftaran-trainee |
| pendaftaran-management.html | pendaftaran-management |
| cek-hasil.html | cek-hasil |
| about.html | about |
| member.html | member |
| toko.html | toko |
| checkout.html | checkout |
| pengumuman.html | pengumuman |
| achievement.html | achievement |
| struktur.html | struktur |
| guestbox.html | guestbox |
| video-playlist.html | video-playlist |
| audio-playlist.html | audio-playlist |
| admin-dashboard.html | admin-dashboard |

## Berkas bersama

- `assets/css/style.css` — seluruh CSS kustom.
- `assets/js/images.js` — gambar base64 (logo, poster, foto grup, QR pembayaran).
- `assets/js/data.js` — data awal + pemuatan/penyimpanan `appData` di localStorage.
- `assets/js/core.js` — fungsi bersama: tema, sidebar, navigasi, keranjang, promo,
  playlist, komentar, modal, dan seluruh handler admin.
- `assets/js/pages/<halaman>.js` — `renderView()` khusus halaman tersebut.

## Catatan

- `navigate('route')` tetap dipakai dengan nama yang sama; sekarang isinya berpindah
  ke file HTML yang sesuai lewat `ROUTE_FILES` di `core.js`.
- Keranjang, kode promo, status login admin, tab admin, dan generasi terpilih
  disimpan di `sessionStorage` agar tidak hilang saat berpindah halaman.
- Buka lewat server lokal (misalnya `python3 -m http.server`) atau hosting biasa,
  karena file JS dimuat sebagai berkas terpisah.
