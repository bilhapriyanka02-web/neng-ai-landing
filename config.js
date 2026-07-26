// =====================================================
// KONFIGURASI NENG_AI CHATBOT — via TokenRouter
// =====================================================
// File ini WAJIB ada dan ke-load SEBELUM script utama di index.html
// (sudah otomatis diatur lewat <script src="config.js"> di <head>/<body>)
//
// GANTI 3 value di bawah ini sebelum situs kamu live:
// 1) TOKENROUTER_API_KEY  -> API key TokenRouter kamu
// 2) TOKENROUTER_ENDPOINT -> endpoint chat completions TokenRouter kamu
//    (cek dashboard/dokumentasi TokenRouter buat URL yang persis)
// 3) TOKENROUTER_MODEL    -> nama model persis sesuai yang dipakai TokenRouter
//
// ⚠️ PENTING BUAT DIBACA:
// Misahin config ke file ini TIDAK bikin API key jadi rahasia. Karena
// situs ini jalan di browser (client-side), siapapun yang buka situs
// kamu bisa lihat isi file ini secara langsung lewat:
//   namamu.github.io/config.js  (atau domain kamu + /config.js)
// Ini sama aja kayak taruh key di index.html — cuma lokasinya beda,
// bukan levelnya jadi lebih aman.
//
// Manfaat misahin ke file ini cuma dua:
// 1) Kode lebih rapi & gampang di-maintain
// 2) Kamu BISA nge-.gitignore file ini biar key gak ke-push ke GitHub
//    (isi .gitignore dengan baris: config.js)
//    Tapi konsekuensinya: situs yang di-deploy ke GitHub Pages juga
//    gak akan punya file ini, jadi chatbot-nya gak akan jalan sampai
//    kamu upload config.js secara manual ke hosting (di luar Git).
//
// Kalau kamu emang mau chatbot ini jalan aman di publik, solusi yang
// bener adalah bikin backend kecil / serverless function (proxy) yang
// nyimpen API key di server, terus index.html manggil proxy itu —
// bukan langsung ke TokenRouter. Bilang aja kalau mau aku bantu bikinin.

const TOKENROUTER_API_KEY  = "sk-miTo3QK0umlbmdr8a72fi7EgSF9tsW0vZjsWKUusf8Vs4G2q";
const TOKENROUTER_ENDPOINT = "https://api.tokenrouter.com/v1beta/models";
const TOKENROUTER_MODEL    = "google/gemini-3.5-flash-lite";
