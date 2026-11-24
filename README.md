# Bersih Sepatu

Website jasa perawatan sepatu dan tas. Folder ini **siap diupload ke GitHub** dan langsung bisa dipublikasikan lewat GitHub Pages, tanpa perlu install apa pun.

## Cara publikasi (GitHub Pages)

1. Buka https://github.com/new, isi nama repository (misalnya `bersih-sepatu`), pilih **Public**, lalu klik **Create repository**.
2. Di halaman repository, klik **uploading an existing file**.
3. Buka folder ini di komputer, **pilih semua isinya** (bukan file zip-nya), lalu seret ke halaman GitHub. Tunggu hingga semua file selesai terunggah.
4. Klik **Commit changes**.
5. Buka **Settings → Pages**. Pada **Source** pilih **Deploy from a branch**, pada **Branch** pilih `main` dan folder `/ (root)`, lalu klik **Save**.
6. Tunggu sekitar 1–2 menit. Alamat website muncul di bagian atas halaman Pages:
   `https://NAMA-GITHUB-ANDA.github.io/NAMA-REPOSITORY/`

## Isi folder

- `index.html`, `icon*.png`, `icon.svg`, `favicon.ico`: website yang sudah jadi (inilah yang dipublikasikan).
- `source/`: kode sumber (React + Vite) untuk mengedit website.

## Mengubah isi website

Link penting ada di bagian atas `source/src/App.tsx`:

- `GOOGLE_FORM_URL`: link Google Form pemesanan
- `WHATSAPP_URL`: link WhatsApp
- `INSTAGRAM_URL`: link Instagram
- `ADMIN_PASSWORD`: password dashboard admin

Setelah mengedit, buat ulang websitenya:

1. Pasang Node.js, lalu buka terminal di folder `source`.
2. Jalankan `npm install`, kemudian `npm run build`.
3. Salin **isi** folder `source/dist` ke folder utama (timpa `index.html` dan file lain), lalu upload ulang ke GitHub.

Untuk mencoba saat mengedit, jalankan `npm run dev`.

## Penting

- Semua file di repository Public bisa dilihat siapa saja, termasuk `ADMIN_PASSWORD`. **Ganti password admin** sebelum publikasi dan jangan memakai password yang dipakai di tempat lain. Dashboard admin dibuka lewat `/#/ruang-admin-solecare`.
- Data pesanan di dashboard admin disimpan di browser perangkat yang dipakai, sehingga tidak tersinkron antar perangkat.
