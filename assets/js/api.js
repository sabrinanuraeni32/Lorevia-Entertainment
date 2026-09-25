// Konfigurasi & helper untuk kirim data ke Google Sheets lewat Apps Script Web App.
// GANTI nilai di bawah dengan URL Web App hasil deploy Code.gs (lihat google-apps-script/Code.gs).
const API_URL = 'https://script.google.com/macros/s/AKfycbwYHfYZOsAa74vTVE4bTL1udLJT7wxkfhiSmKExAz6M9X6Qijcey1fDBoGBWnofbFn1/exec';

/**
 * Kirim data pendaftaran (atau data lain) ke Google Sheets.
 * type: 'trainee' | 'management'
 * data: object field-field form (lihat submitTrainee/submitmanagement di core.js)
 * Mengembalikan { ok: true } kalau sukses, { ok: false, error } kalau gagal.
 */
async function kirimKeSheet(type, data) {
  if (API_URL.includes('PASTE_URL_WEB_APP')) {
    console.warn('API_URL belum diisi di assets/js/api.js — data hanya tersimpan lokal.');
    return { ok: false, error: 'API_URL belum dikonfigurasi' };
  }
  try {
    const payload = Object.assign({ type: type }, data);
    const res = await fetch(API_URL, {
      method: 'POST',
      // Content-Type text/plain sengaja dipakai supaya browser tidak mengirim
      // preflight OPTIONS request, karena Apps Script Web App tidak menanganinya.
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    console.error('Gagal mengirim ke Google Sheets:', err);
    return { ok: false, error: err.message };
  }
}
