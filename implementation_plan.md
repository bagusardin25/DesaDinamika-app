# Rencana Implementasi UI/UX Prototype DesaDinamika

Dokumen ini memuat rencana implementasi UI/UX untuk *prototype* aplikasi **DesaDinamika: Platform Simulasi Kebijakan Desa Berbasis AI Multi-Agent**. Fokus utama fase ini adalah mendesain alur antarmuka yang intuitif bagi aparatur desa, sekaligus mempertahankan estetika *premium dashboard* hasil adaptasi dari arsitektur TeamDynamics tapi jangan dibuat sama persis.

## 1. Konsep Visual & Tema (Design System)

DesaDinamika ditargetkan untuk aparatur desa, namun UI-nya harus terlihat sangat canggih dan profesional (layaknya *Command Center*) untuk memberikan *Wow Factor* di kompetisi GEMASTIK.

- **Warna Utama (Primary):** Hijau Zamrud (Emerald Green) - Melambangkan pedesaan, agrikultur, dan pertumbuhan ekonomi.
- **Warna Sekunder (Secondary):** Biru Dongker (Navy Blue) & Emas (Gold) - Melambangkan profesionalitas tata kelola pemerintahan dan Dana Desa.
- **Background:** *Dark Mode* dengan aksen *glassmorphism* (panel semi-transparan) agar simulasi terlihat seperti layar komando (HUD).
- **Tipografi:** Inter atau Roboto untuk *readability* yang tegas dan rapi.

## 2. Alur Pengguna (User Flow) Prototype

Alur *prototype* dirancang seolah-olah pengguna sedang menguji coba satu siklus kebijakan lengkap:

`Landing Page` ➔ `Dashboard` ➔ `Setup Simulasi (Input Data)` ➔ `Live Simulation (Balai Desa Virtual)` ➔ `Executive Report (Laporan Evaluasi)`

## 3. Detail Halaman & Komponen Kunci

### Halaman 1: Landing Page
Halaman pengenalan produk untuk menarik perhatian juri dan menjelaskan *value proposition*.
- **Hero Section:** Judul aplikasi dengan animasi 3D sederhana atau *mockup* simulasi yang menyala di *background*, disertai tombol "Coba Simulasi Sekarang".
- **Fitur Utama:** Tiga kartu (*cards*) yang menjelaskan: AI Warga Virtual, Stress-Test Kebijakan, Laporan Mitigasi.
- **Statistik Dampak (Dummy):** Angka yang menunjukkan potensi anggaran terselamatkan.

### Halaman 2: Dashboard Utama (Ruang Kerja Kades)
Halaman awal setelah *login*, menampilkan ringkasan simulasi yang sudah pernah dilakukan.
- **Overview Metrics:** Total simulasi dijalankan, persentase keberhasilan kebijakan bulan ini, tingkat kepuasan warga rata-rata.
- **Recent Simulations Table:** Daftar riwayat simulasi (misal: "Simulasi BLT 2025", "Simulasi Pembangunan Irigasi") dengan status (Aman / Rawan Konflik).
- **Primary Action:** Tombol "Buat Simulasi Kebijakan Baru" (+).

### Halaman 3: Setup Wizard (3-Step Form)
Halaman interaktif (*stepper*) untuk mempersiapkan simulasi. Ini adalah titik masuk data.
- **Step 1: Konfigurasi Demografi Desa.**
  - Fitur unggah dokumen profil desa (PDF/Excel) ATAU *input* manual.
  - *Slider* komposisi warga: Petani (%), Buruh (%), UMKM (%), Pemuda (%), dll.
- **Step 2: Input Kebijakan / APBDes.**
  - Kolom teks panjang untuk mendeskripsikan rencana kebijakan (misal: "Memangkas anggaran perbaikan jalan sebesar 30% untuk dialihkan ke BUMDes").
- **Step 3: Review & Launch.**
  - Menampilkan ringkasan bahwa AI sedang menyiapkan Agen Warga berdasarkan demografi. Tombol besar "Mulai Simulasi Balai Desa".

### Halaman 4: Live Simulation Interface (Balai Desa Virtual)
Ini adalah **Halaman Inti (Core Feature)** aplikasi, hasil *reskin* dari halaman simulasi.
- **Layout Kiri (Agent Feed):** Menampilkan daftar Agen AI (misal: Pak Budi - Petani, Bu Siti - Pedagang). Setiap agen memiliki avatar, profesi, dan status sentimen (Emoji marah/senang).
- **Layout Tengah (Live Debate / Chat):** Jendela *chat* bergaya *feed* yang menampilkan para agen berdiskusi merespons kebijakan yang diajukan. Terdapat indikator *typing* animasi agar terlihat hidup.
- **Layout Kanan (Metrics & God-Mode):** 
  - **Radial Gauges:** Grafik *real-time* untuk "Indeks Kepuasan Petani", "Risiko Konflik", "Kepercayaan Warga".
  - **Intervention Panel (God-Mode):** Tombol bagi pengguna untuk menyuntikkan krisis di tengah simulasi (misal: Inject "Isu Hoax di WhatsApp", atau Inject "Janji Tambahan Subsidi").

### Halaman 5: Executive Report
Halaman laporan pasca-simulasi.
- **Header:** "Laporan Mitigasi Risiko Kebijakan: [Nama Kebijakan]"
- **Kesimpulan AI:** Paragraf singkat yang menjustifikasi apakah kebijakan ini layak dilanjutkan, perlu revisi, atau sangat berbahaya (ditandai dengan warna Merah/Kuning/Hijau).
- **Grafik Tren:** *Line chart* menunjukkan pergerakan sentimen warga dari awal hingga akhir simulasi.
- **Actionable Recommendations:** *Bullet points* saran dari AI (misal: "Kebijakan disetujui 70% warga, namun mendapat penolakan keras dari kelompok Pemuda. Saran: Tambahkan program WiFi gratis sebesar 5% dari anggaran").
- **Tombol Aksi:** "Export to PDF" untuk dilaporkan ke BPD atau Kabupaten.

## User Review Required
> [!IMPORTANT]
> Mohon konfirmasi apakah Anda setuju dengan **Tema Visual (Dark Mode + Hijau Zamrud)** dan **Alur 5 Halaman** ini. Jika Anda ingin *vibe* desain yang lebih terang (*Light Mode* yang lebih resmi layaknya sistem pemerintahan biasa), mohon beri tahu saya agar dapat disesuaikan.
