# Neng_AI Portfolio

Website utama: https://neng-ai.cloud

Portfolio HTML/CSS/JS, satu layar dengan navigasi antar bagian. Github Pages melayani domain utama; Vercel project **neng-ai-portfolio** menjalankan endpoint server /api/live-token. Aplikasi Neng-app, Aster Assistant, dan Aster Gateway tetap terpisah.

## Mengaktifkan Neng Live

1. Buka Vercel → project **neng-ai-portfolio** → Settings → Environment Variables.
2. Tambahkan **GEMINI_API_KEY**, isi API key Google AI Studio yang mendukung Gemini Live, target **Production**.
3. Redeploy deployment Production agar env tersedia di server.
4. Buka https://neng-ai.cloud. Status Neng Live akan menjadi Terhubung.

Model mengikuti implementasi Aster Live yang sudah ada: **gemini-3.1-flash-live-preview**, suara **Sulafat**. API key permanen tidak dikirim ke browser. Server memberi ephemeral token satu kali pakai, batas koneksi baru 60 detik, masa sesi 30 menit.

Sapaan diminta persis: “Halo.. selamat datang di Fortopolio Neng_AI, yuk lihat semua karya Neng_AI”.

Koneksi otomatis dimulai saat halaman dibuka dan tetap sama ketika navigasi antar bagian. Browser dapat menahan suara sampai gesture pertama; tombol Suara menyediakan kontrol manual. Mikrofon baru diakses setelah pengunjung menekan Nyalakan mikrofon dan menyetujui izin browser. Percakapan teks tersedia di Ngobrol. Tidak ada musik latar.

## Video

Upload ke **public/videos/**:
- karya-01.mp4
- karya-02.mp4
- karya-03.mp4
- karya-04.mp4

Disarankan MP4 H.264/AAC. Video tampil saat tombol putar ditekan. Jika belum diupload, placeholder tetap tampil.

## Assets

Header menggunakan panda-head.png dari neng-app. Foto Neng diambil dari landing page sebelumnya. Preview ketiga aplikasi merupakan ilustrasi antarmuka, bukan screenshot terbaru.

## Catatan operasional

Token publik dibatasi origin dan model. Throttle server hanya per instance; kelola kuota/budget Gemini di Google project untuk traffic publik. Seluruh percakapan hanya berada di memori browser.
