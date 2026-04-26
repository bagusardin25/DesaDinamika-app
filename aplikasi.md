1. Judul Karya (Usulan)
DesaDinamika: Platform Simulasi Kebijakan Desa Berbasis AI Multi-Agent untuk Mitigasi Risiko Sosial-Ekonomi

2. Latar Belakang & Urgensi Masalah (Urgensi: 10%)
Masalah: Setiap tahun, ribuan desa di Indonesia menerima Alokasi Dana Desa (ADD) miliaran rupiah. Namun, Kepala Desa dan Badan Permusyawaratan Desa (BPD) seringkali mengambil kebijakan (misal: membangun gapura vs. subsidi pupuk) berdasarkan intuisi, bukan data.
Akibat: Sering terjadi ketidaktepatan sasaran, penolakan warga, atau bahkan konflik sosial horizontal karena kebijakan dirasa tidak adil oleh kelompok tertentu.
Urgensi: Belum ada alat bantu (decision support system) yang murah dan mudah digunakan bagi aparatur desa untuk melakukan stress-test atau memprediksi reaksi warga sebelum sebuah kebijakan atau anggaran disahkan.
3. Inovasi Solusi & Dampak (Inovasi: 20%, Dampak: 20%)
Solusi Inovatif: Alih-alih menggunakan kuesioner statis, DesaDinamika menggunakan Generative AI Multi-Agent Simulation. Sistem akan "menciptakan" warga virtual (Agen AI) yang mewakili berbagai demografi desa.
Cara Kerja Inovasi: Ketika Kepala Desa (User) mengusulkan sebuah draf kebijakan di aplikasi, para Agen Warga Virtual ini akan membaca usulan tersebut, berdebat satu sama lain, dan memberikan reaksi (setuju, protes, atau apatis) berdasarkan profil psikologis dan ekonomi mereka secara real-time.
Dampak & Sustainability:
Mencegah pemborosan anggaran desa.
Mengedukasi aparatur desa tentang tata kelola berbasis data (data-driven governance).
Bisa diadopsi oleh Kementerian Desa (Kemendes PDTT) sebagai standar evaluasi APBDes.
4. Arsitektur & Cara Kerja (Adaptasi dari TeamDynamics)
Karena Anda sudah memiliki codebase TeamDynamics, arsitekturnya tinggal disesuaikan:

Setup Phase (Input Data Desa):

Pengguna mengunggah dokumen Demografi Desa (Excel/CSV) atau APBDes.
Document Service (PyPDF2/openpyxl): AI akan mengekstrak data dan secara otomatis membuat Preset Agents proporsional. Misal: Desa X mayoritas petani, maka sistem men-generate Agen Petani (40%), Agen Pemuda/Gen Z (30%), Pedagang (20%), Tokoh Agama (10%).
Simulation Engine (Multi-Agent Interaction):

Agent Profiles: Setiap agen diberi prompt khusus yang berisi hidden agenda, tingkat ekonomi, dan psikologi (sama seperti sistem kepribadian di TeamDynamics). Agen Petani mungkin sensitif terhadap harga subsidi, sedangkan Agen Pemuda peduli pada WiFi dan lapangan kerja.
WebSocket Streaming: Pengguna (Kepala Desa) melihat "Grup Chat Balai Desa Virtual" di mana para agen berdebat merespons kebijakan yang dimasukkan.
God-Mode Interventions (Krisis):

Pengguna bisa menyuntikkan krisis eksternal di tengah simulasi, misalnya: "Harga beras anjlok" atau "Banjir melanda sawah". Sistem akan memonitor bagaimana reaksi agen warga berubah (indikator tingkat stres dan kepercayaan pada Kepala Desa).
Executive Report & Metrics:

Di akhir simulasi, Report Generator akan mengeluarkan PDF berisi: Prediksi penerimaan warga (misal: 75% Setuju, 25% Protes), potensi titik rawan konflik, dan rekomendasi AI untuk memperbaiki draf kebijakan tersebut agar lebih diterima masyarakat.
5. UI/UX & Desain Antarmuka (Desain: 20%)
Fokus utama adalah **User-Friendly dan Aksesibel**, mengingat pengguna akhirnya adalah Kepala Desa dan Perangkat Desa yang mungkin memiliki tingkat literasi digital yang beragam.

Tema Visual & Navigasi: Menggunakan desain *clean*, bersih, dengan font yang mudah dibaca, kontras warna yang jelas, dan navigasi yang sangat intuitif. Meski sederhana untuk digunakan, tetap diberi sentuhan profesional (seperti *subtle animations* dan *soft shadows*) agar tetap terlihat premium dan canggih di mata juri.
Bahasa & Terminologi Lokal: Seluruh antarmuka menggunakan bahasa Indonesia yang membumi. Istilah teknis diubah menjadi istilah yang familiar bagi aparatur desa (misal: "Agent" menjadi "Warga Virtual", "Dashboard" menjadi "Meja Kerja Kades").
Live Feed (Simulasi Musyawarah): Antarmuka simulasi diskusi dibuat menyerupai aplikasi *chatting* populer (seperti WhatsApp) agar Kepala Desa langsung paham cara pakainya. Dilengkapi animasi *typing indicator* saat warga virtual merespons kebijakan.
Indikator Visual Intuitif: Grafik melingkar (*Radial Gauges*) di sidebar menggunakan sistem warna *traffic light* (Hijau = Aman, Kuning = Waspada, Merah = Rawan Konflik) untuk menunjukkan Tingkat Kepuasan Warga secara *real-time*, sehingga Kepala Desa bisa langsung mengerti situasi tanpa perlu membaca data yang rumit.
6. Metodologi Pengembangan (Metodologi: 20%)
Di dalam proposal, Anda bisa menuliskan metodologi yang matang:

Framework: Agile (Scrum) dengan sprint 2 mingguan.
Pengujian Khusus: Penjelasan bahwa sistem diuji tidak hanya dari sisi fungsi (menggunakan TestSprite, ini nilai plus karena Anda menguasai automated testing!), tetapi juga Prompt Evaluation untuk memastikan respons agen warga tidak hallucinate dan relevan dengan budaya Indonesia.