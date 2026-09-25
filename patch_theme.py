"""
patch_theme.py — pasang tema "Jungle Pop" Lorevia ke SEMUA halaman .html sekaligus.

Cara pakai:
  1. Taruh file ini di folder root project (sejajar index.html).
  2. Pastikan assets/css/theme.css sudah ada.
  3. Jalankan:  python patch_theme.py
  (kalau di Windows kadang:  py patch_theme.py)

Aman dijalankan berulang kali (halaman yang sudah dipatch dilewati),
dan file asli dicadangkan dulu di folder  _backup_sebelum_tema/
"""
import glob
import os
import re
import shutil

NAV_ITEMS = [
    ('beranda', '🏠', 'Beranda'),
    ('pendaftaran-trainee', '💌', 'Gabung Trainee'),
    ('pendaftaran-management', '🎀', 'Gabung management'),
    ('cek-hasil', '🔎', 'Cek Hasil Seleksi'),
    ('about', '🌸', 'About Lorevia'),
    ('member', '🌟', 'Member'),
    ('toko', '🛍️', 'Toko'),
    ('pengumuman', '📣', 'Pengumuman'),
    ('achievement', '🏆', 'Achievement'),
    ('struktur', '🦋', 'Struktur Admin'),
    ('guestbox', '📮', 'Guest Box'),
    ('video-playlist', '🎬', 'Video Playlist'),
    ('audio-playlist', '🎧', 'Audio Playlist'),
]

STICKERS = '''
    <!-- Sticker emoji melayang (dekorasi background) -->
    <div class="sticker-layer" aria-hidden="true">
        <span class="sticker" style="left:6%;  top:14%; --size:2.2rem; --dur:9s;  --rot:-10deg;">🌟</span>
        <span class="sticker" style="left:88%; top:10%; --size:1.9rem; --dur:11s; --delay:-3s; --rot:8deg;">🌸</span>
        <span class="sticker" style="left:80%; top:46%; --size:2.4rem; --dur:10s; --delay:-5s; --rot:-6deg;">🦋</span>
        <span class="sticker" style="left:4%;  top:52%; --size:1.7rem; --dur:8s;  --delay:-2s; --rot:12deg;">✨</span>
        <span class="sticker" style="left:92%; top:78%; --size:1.8rem; --dur:12s; --delay:-7s; --rot:-12deg;">💛</span>
        <span class="sticker" style="left:12%; top:84%; --size:2rem;   --dur:9.5s; --delay:-4s; --rot:7deg;">🍀</span>
        <span class="sticker" style="left:48%; top:6%;  --size:1.6rem; --dur:11s; --delay:-6s; --rot:-8deg;">🎀</span>
        <span class="sticker" style="left:58%; top:90%; --size:2rem;   --dur:10s; --delay:-1s; --rot:10deg;">🌼</span>
    </div>'''

ACTIVE_SCRIPT = '''
    <script>
        // Tandai menu aktif (pill gradient orange-golden) sesuai halaman
        (function () {
            document.querySelectorAll('#sidebar .nav-pill').forEach(function (btn) {
                if (btn.dataset.route === window.PAGE_ROUTE) {
                    btn.classList.add('is-active');
                    btn.setAttribute('aria-current', 'page');
                }
            });
        })();
    </script>'''


def build_nav():
    html = '<nav class="flex-1 px-4 py-6 space-y-2">\n'
    for route, emo, label in NAV_ITEMS:
        html += (f'            <button data-route="{route}" onclick="navigate(\'{route}\'); toggleSidebar();" class="nav-pill">\n'
                 f'                <span class="nav-emoji">{emo}</span><span>{label}</span>\n'
                 f'            </button>\n')
    html += '        </nav>'
    return html


def patch(html):
    """Return (new_html, list_of_done, list_of_skipped)."""
    done, skipped = [], []

    # 1. theme.css + theme-color
    if 'theme.css' not in html:
        m = re.search(r'<link[^>]*assets/css/style\.css[^>]*>', html)
        add = '\n    <link rel="stylesheet" href="assets/css/theme.css">\n    <meta name="theme-color" content="#24240C">'
        if m:
            html = html[:m.end()] + add + html[m.end():]
            done.append('link theme.css')
        elif '</head>' in html:
            html = html.replace('</head>', add.lstrip('\n') + '\n</head>', 1)
            done.append('link theme.css (style.css tidak ketemu, dipasang sebelum </head>)')
        else:
            skipped.append('link theme.css (tidak ada </head>)')
    else:
        skipped.append('link theme.css (sudah ada)')

    # 2. Sticker layer
    if 'sticker-layer' not in html:
        m = re.search(r'<div[^>]*\bsun-ray\b[^>]*></div>', html)
        if m:
            html = html[:m.end()] + '\n' + STICKERS + html[m.end():]
            done.append('sticker')
        else:
            m = re.search(r'<body[^>]*>', html)
            if m:
                html = html[:m.end()] + '\n' + STICKERS + html[m.end():]
                done.append('sticker (sun-ray tidak ketemu, dipasang setelah <body>)')
            else:
                skipped.append('sticker (tidak ada <body>)')

    # 3. Tombol header jadi bulat
    for old, new in [('theme-toggle-btn p-2.5 rounded-lg', 'theme-toggle-btn p-2.5 rounded-full'),
                     ('<button onclick="toggleSidebar()" class="p-2.5 rounded-lg', '<button onclick="toggleSidebar()" class="p-2.5 rounded-full')]:
        if old in html:
            html = html.replace(old, new)
            done.append('tombol header bulat')

    # 4. Sidebar: nav pill + judul + footer
    sb = html.find('id="sidebar"')
    if sb != -1 and 'nav-pill' not in html:
        m = re.compile(r'<nav\b[^>]*>.*?</nav>', re.S).search(html, sb)
        if m:
            html = html[:m.start()] + build_nav() + html[m.end():]
            done.append('sidebar nav pill')
        else:
            skipped.append('sidebar nav (tag <nav> tidak ketemu)')
    elif sb == -1:
        skipped.append('sidebar (tidak ada di halaman ini)')
    if 'Menu Navigasi' in html:
        html = html.replace('Menu Navigasi', 'Jelajahi Lorevia ~')
        done.append('judul sidebar')
    if 'Lorevia Entertainment Jungle Edition &copy; 2026' in html:
        html = html.replace('Lorevia Entertainment Jungle Edition &copy; 2026',
                            'Jungle Edition 🌿 ~ &copy; 2026 Lorevia Entertainment')
        done.append('footer sidebar')

    # 5. Footer copywriting (span admin tetap utuh)
    if 'Dibuat dengan 💛' not in html:
        m = re.search(r'<p>\s*<span onclick="triggerAdminModal\(\)"', html)
        if m:
            html = (html[:m.start()]
                    + '<p class="font-serif text-base mb-1">Dibuat dengan 💛 buat semua Lorevians ~</p>\n        '
                    + html[m.start():])
            done.append('footer copy')
        else:
            skipped.append('footer copy (footer admin tidak ketemu)')

    # 6. Tombol Batal + Oke
    batal = 'class="flex-1 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-gray-200 font-medium transition">Batal'
    if batal in html:
        html = html.replace(batal, 'class="flex-1 py-3 candy-btn-soft">Batal')
        done.append('tombol Batal')
    if '>Oke</button>' in html:
        html = html.replace('>Oke</button>', '>Oke~ ✨</button>')
        done.append('tombol Oke')

    # 7. Script menu aktif (setelah PAGE_ROUTE)
    if 'is-active' not in html:
        m = re.search(r'<script>\s*window\.PAGE_ROUTE\s*=\s*[\'"][^\'"]+[\'"];?\s*</script>', html)
        if m:
            html = html[:m.end()] + ACTIVE_SCRIPT + html[m.end():]
            done.append('script menu aktif')
        else:
            skipped.append('script menu aktif (PAGE_ROUTE tidak ketemu)')

    return html, done, skipped


def main():
    if not os.path.exists(os.path.join('assets', 'css', 'theme.css')):
        print('!! assets/css/theme.css belum ada. Taruh dulu file theme.css di assets/css/ lalu jalankan lagi.')
        return
    files = sorted(glob.glob('*.html'))
    if not files:
        print('!! Tidak ada file .html di folder ini. Jalankan dari folder root project.')
        return
    os.makedirs('_backup_sebelum_tema', exist_ok=True)
    for f in files:
        with open(f, encoding='utf-8') as fh:
            original = fh.read()
        new, done, skipped = patch(original)
        if new != original:
            backup = os.path.join('_backup_sebelum_tema', f)
            if not os.path.exists(backup):
                shutil.copy2(f, backup)
            with open(f, 'w', encoding='utf-8', newline='') as fh:
                fh.write(new)
        print(f'\n[{f}]')
        print('  ✔ ' + (', '.join(sorted(set(done))) if done else '(tidak ada perubahan)'))
        for s in skipped:
            print('  - dilewati: ' + s)
    print('\nSelesai. Buka tiap halaman, lalu Ctrl+F5 (hard refresh) buat cek hasilnya.')


if __name__ == '__main__':
    main()