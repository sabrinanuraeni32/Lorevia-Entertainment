/**
 * Lorevia Entertainment - Backend Pendaftaran Trainee & management
 * Ditulis ke Google Sheets, file upload disimpan ke Google Drive.
 *
 * CARA PAKAI:
 * 1. Buat Google Spreadsheet baru, bikin 6 sheet (tab) dengan nama PERSIS:
 *    "PendaftaranTrainee" dan "Pendaftaranmanagement"
 *    "management" dan "guestbox"
 *    "Audioplaylist" dan "Videoplaylist"
 * 2. Baris pertama tiap tab diisi header berikut (urutan harus sama):
 *
 *    PendaftaranTrainee:
 *    Timestamp | Nama Panjang | Nama Panggung | Line | Divisi | Alasan | Niat | Link Voice Sample | Status | Tanggal
 *
 *    Pendaftaranmanagement:
 *    Timestamp | Nama Panjang | Nama Panggung | Line | Posisi | Alasan | Niat | Link File Sample | Status | Tanggal
 *
 *    guestbox:
 *    Timestamp | Nama | Pesan | Tanggal
 *
 *    Audioplaylist / Videoplaylist:
 *    Timestamp | ID | Tipe | Nama/Judul | Deskripsi/Tanggal | Playlist ID | Orientasi | URL Media | URL Cover | Status
 *
 * 3. Buat 2 folder terpisah di Google Drive: satu untuk file upload pendaftar Trainee,
 *    satu lagi untuk pendaftar management.
 * 4. Ambil SHEET_ID (dari URL spreadsheet) dan ID kedua folder Drive tadi (dari URL masing-masing
 *    folder), isi di bawah.
 * 5. Buka Extensions > Apps Script di spreadsheet, paste file ini (ganti isi Code.gs).
 * 6. Deploy > New deployment > Web app.
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 7. Copy URL Web App yang muncul, paste ke assets/js/api.js (API_URL).
 *
 * TAB "management" (struktur admin, terpisah dari "Pendaftaranmanagement" di atas):
 *    id | Nama Panjang | Nama Panggung | Tanggal Lahir | Face Claim | Jabatan | Foto
 *    Urutan baris dari atas ke bawah = urutan level di bagan struktur.
 */

const SHEET_ID = '1Z0-h4BmYh_c4P_ZRoHMsH-RNSwnbLWLsgCQoC1jlKmk';
const FOLDER_ID_TRAINEE = '1Q01mE2_X9GYplESYk6c07zoHvRxU7pxY';
const FOLDER_ID_MANAGEMENT = '1Ye3Mu8Jj-dd79LOlI0J9_8YM1iVDWFRU';

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SHEET_ID);

    if (body.type === 'trainee') {
      return appendTrainee(ss, body);
    }
    if (body.type === 'management') {
      return appendManagement(ss, body);
    }
    if (body.type === 'management_member') {
      return appendManagementMember(ss, body);
    }
    if (body.type === 'guestbox') {
      return appendGuestBox(ss, body);
    }
    if (body.type === 'playlist') {
      return appendPlaylist(ss, body);
    }
    if (body.type === 'media') {
      return uploadMedia(body);
    }
    return jsonOutput({ ok: false, error: 'Tipe pendaftaran tidak dikenal: ' + body.type });
  } catch (err) {
    return jsonOutput({ ok: false, error: err.message });
  }
}

// Dipakai untuk tes cepat lewat browser (buka URL Web App langsung),
// dan sekarang juga dipakai frontend buat baca data struktur admin.
// Contoh: <API_URL>?type=management
function doGet(e) {
  const type = e.parameter && e.parameter.type;

  if (type === 'management') {
    return getManagementData();
  }
  if (type === 'guestbox') {
    return getGuestBoxData();
  }
  if (type === 'audio-playlist' || type === 'video-playlist') {
    return getPlaylistData(type === 'audio-playlist' ? 'audio' : 'video');
  }

  return jsonOutput({ ok: true, message: 'Lorevia API aktif. Gunakan POST untuk mengirim data.' });
}

function getManagementData() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('management');
    if (!sheet) return jsonOutput({ ok: false, error: 'Sheet "management" tidak ditemukan' });

    const values = sheet.getDataRange().getValues();
    if (values.length < 2) return jsonOutput({ ok: true, data: [] });

    const headers = values[0]; // id, Nama Panjang, Nama Panggung, Tanggal Lahir, Face Claim, Jabatan, Foto
    const rows = values.slice(1).filter(r => r.some(cell => String(cell).trim() !== ''));

    const data = rows.map(r => {
      const obj = {};
      headers.forEach((h, i) => { obj[String(h).trim()] = r[i]; });
      return obj;
    });

    return jsonOutput({ ok: true, data: data });
  } catch (err) {
    return jsonOutput({ ok: false, error: err.message });
  }
}

function getGuestBoxData() {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('guestbox');
    if (!sheet) return jsonOutput({ ok: false, error: 'Sheet "guestbox" tidak ditemukan' });

    const values = sheet.getDataRange().getValues();
    if (values.length < 2) return jsonOutput({ ok: true, data: [] });

    const headers = values[0];
    const rows = values.slice(1).filter(row => row.some(cell => String(cell).trim() !== ''));
    const data = rows.map(row => {
      const item = {};
      headers.forEach((header, index) => { item[String(header).trim()] = row[index]; });
      return item;
    });

    return jsonOutput({ ok: true, data: data });
  } catch (err) {
    return jsonOutput({ ok: false, error: err.message });
  }
}

function appendTrainee(ss, body) {
  const sheet = ss.getSheetByName('PendaftaranTrainee');
  if (!sheet) return jsonOutput({ ok: false, error: 'Sheet "PendaftaranTrainee" tidak ditemukan' });

  const voiceUrl = body.voiceSample
    ? saveFileToDrive(body.voiceSample, sanitizeName(body.stageName) + '_voice', FOLDER_ID_TRAINEE)
    : '';

  sheet.appendRow([
    new Date(),
    body.name || '',
    body.stageName || '',
    body.line || '',
    body.div || '',
    body.reason || '',
    body.intent || '',
    voiceUrl,
    'pending',
    body.date || ''
  ]);

  return jsonOutput({ ok: true });
}

function appendManagement(ss, body) {
  const sheet = ss.getSheetByName('Pendaftaranmanagement');
  if (!sheet) return jsonOutput({ ok: false, error: 'Sheet "Pendaftaranmanagement" tidak ditemukan' });

  const fileUrl = body.fileSample
    ? saveFileToDrive(body.fileSample, sanitizeName(body.stageName) + '_sample', FOLDER_ID_MANAGEMENT)
    : '';

  sheet.appendRow([
    new Date(),
    body.name || '',
    body.stageName || '',
    body.line || '',
    body.pos || '',
    body.reason || '',
    body.intent || '',
    fileUrl,
    'pending',
    body.date || ''
  ]);

  return jsonOutput({ ok: true });
}

function appendManagementMember(ss, body) {
  const sheet = ss.getSheetByName('management');
  if (!sheet) return jsonOutput({ ok: false, error: 'Sheet "management" tidak ditemukan' });

  const photoUrl = body.foto
    ? saveFileToDrive(body.foto, sanitizeName(body.namaPanggung), FOLDER_ID_MANAGEMENT)
    : '';

  sheet.appendRow([
    body.id || Utilities.getUuid(),
    body.namaPanjang || '',
    body.namaPanggung || '',
    body.tanggalLahir || '',
    body.faceClaim || '',
    body.jabatan || '',
    photoUrl
  ]);

  return jsonOutput({ ok: true, photoUrl: photoUrl });
}

function appendGuestBox(ss, body) {
  const sheet = ss.getSheetByName('guestbox');
  if (!sheet) return jsonOutput({ ok: false, error: 'Sheet "guestbox" tidak ditemukan' });

  sheet.appendRow([
    new Date(),
    body.name || '',
    body.message || '',
    body.date || ''
  ]);

  return jsonOutput({ ok: true });
}

function getPlaylistData(mediaType) {
  try {
    const sheetName = mediaType === 'audio' ? 'Audioplaylist' : 'Videoplaylist';
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(sheetName);
    if (!sheet) return jsonOutput({ ok: false, error: 'Sheet "' + sheetName + '" tidak ditemukan' });

    const values = sheet.getDataRange().getValues();
    if (values.length < 2) return jsonOutput({ ok: true, data: [] });
    const headers = values[0];
    const rows = values.slice(1).filter(row => row.some(cell => String(cell).trim() !== ''));
    const data = rows.map(row => {
      const item = {};
      headers.forEach((header, index) => { item[String(header).trim()] = row[index]; });
      return item;
    });
    return jsonOutput({ ok: true, data: data });
  } catch (err) {
    return jsonOutput({ ok: false, error: err.message });
  }
}

function appendPlaylist(ss, body) {
  const mediaType = body.mediaType === 'audio' ? 'audio' : 'video';
  const sheetName = mediaType === 'audio' ? 'Audioplaylist' : 'Videoplaylist';
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return jsonOutput({ ok: false, error: 'Sheet "' + sheetName + '" tidak ditemukan' });

  const mediaUrl = body.media && body.media.data
    ? saveFileToDrive(body.media, sanitizeName(body.title || body.name), FOLDER_ID_MANAGEMENT)
    : body.mediaUrl || '';
  const coverUrl = body.cover && body.cover.data
    ? saveFileToDrive(body.cover, sanitizeName(body.title || body.name) + '_cover', FOLDER_ID_MANAGEMENT)
    : body.coverUrl || '';

  sheet.appendRow([
    new Date(),
    body.id || Utilities.getUuid(),
    body.recordType || 'item',
    body.title || body.name || '',
    body.desc || body.date || '',
    body.playlistId || '',
    body.orientation || '',
    mediaUrl,
    coverUrl,
    'active'
  ]);

  return jsonOutput({ ok: true, mediaUrl: mediaUrl, coverUrl: coverUrl });
}

function uploadMedia(body) {
  try {
    const files = Array.isArray(body.files) ? body.files : [];
    const urls = files.map((file, index) => saveFileToDrive(
      file,
      sanitizeName(body.prefix || 'media') + '_' + (index + 1),
      FOLDER_ID_MANAGEMENT
    ));
    return jsonOutput({ ok: true, urls: urls });
  } catch (err) {
    return jsonOutput({ ok: false, error: err.message });
  }
}

// fileObj = { name, type, data } — data berformat "data:<mime>;base64,<isi>"
// (persis hasil dari readFileAsBase64 di frontend)
// folderId = FOLDER_ID_TRAINEE atau FOLDER_ID_MANAGEMENT, tergantung tipe pendaftar
function saveFileToDrive(fileObj, baseName, folderId) {
  if (!fileObj || !fileObj.data) return '';
  const folder = DriveApp.getFolderById(folderId);
  const match = fileObj.data.match(/^data:(.+);base64,(.+)$/);
  if (!match) return '';
  const mimeType = match[1];
  const base64Data = match[2];
  const blob = Utilities.newBlob(Utilities.base64Decode(base64Data), mimeType, baseName + '_' + (fileObj.name || 'file'));
  const file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}

function sanitizeName(name) {
  return String(name || 'tanpa_nama').replace(/[^a-zA-Z0-9_-]/g, '_');
}

function jsonOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}