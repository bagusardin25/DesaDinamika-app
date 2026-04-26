// ─── Dummy Report Data for all Dashboard Simulations ───

interface AgentReport {
  id: string;
  name: string;
  role: string;
  starting_morale: number;
  ending_morale: number;
  peak_stress: number;
  has_resigned: boolean;
  resigned_week: number | null;
  status: string;
  status_label: string;
}

interface KeyMetrics {
  total_agents: number;
  active_agents: number;
  resignations: number;
  avg_morale: number;
  avg_stress: number;
  avg_loyalty: number;
  avg_productivity: number;
  productivity_drop: number;
  simulation_weeks: number;
  total_planned_weeks: number;
}

interface Report {
  simulation_id: string;
  company_name: string;
  crisis_name: string;
  total_rounds: number;
  completed_rounds: number;
  executive_summary: string;
  critical_finding: string;
  simulation_overview: string;
  key_metrics: KeyMetrics;
  analysis_insights: string;
  conclusion: string;
  agent_reports: AgentReport[];
  productivity_drop: number;
  recommendations: string[];
  timeline: { round: number; morale: number; stress: number; output: number }[];
  sdgs_impact: string;
  public_trust_index: number;
}

const AGENTS_BASE: AgentReport[] = [
  { id: "a1", name: "Pak Budi", role: "Petani", starting_morale: 70, ending_morale: 45, peak_stress: 78, has_resigned: false, resigned_week: null, status: "Stressed", status_label: "Merasa tertekan oleh kebijakan" },
  { id: "a2", name: "Bu Siti", role: "Pemilik UMKM", starting_morale: 75, ending_morale: 60, peak_stress: 55, has_resigned: false, resigned_week: null, status: "Stable", status_label: "Cukup stabil" },
  { id: "a3", name: "Andi", role: "Pemuda Desa", starting_morale: 65, ending_morale: 50, peak_stress: 70, has_resigned: false, resigned_week: null, status: "Stressed", status_label: "Kecewa dengan prioritas anggaran" },
  { id: "a4", name: "Mbah Yoso", role: "Tokoh Agama", starting_morale: 80, ending_morale: 65, peak_stress: 45, has_resigned: false, resigned_week: null, status: "Stable", status_label: "Menerima dengan catatan" },
  { id: "a5", name: "Ibu Dewi", role: "Kader PKK", starting_morale: 72, ending_morale: 55, peak_stress: 62, has_resigned: false, resigned_week: null, status: "Stressed", status_label: "Khawatir dampak ke keluarga" },
];

function makeTimeline(pattern: "decline" | "stable" | "volatile", rounds: number) {
  const tl: { round: number; morale: number; stress: number; output: number }[] = [];
  for (let i = 0; i <= rounds; i++) {
    const t = i / rounds;
    let m: number, s: number, o: number;
    if (pattern === "decline") {
      m = Math.round(75 - t * 35 + Math.sin(i) * 5);
      s = Math.round(25 + t * 45 + Math.cos(i) * 4);
      o = Math.round(80 - t * 30 + Math.sin(i * 2) * 3);
    } else if (pattern === "stable") {
      m = Math.round(70 + Math.sin(i * 0.8) * 8);
      s = Math.round(30 + Math.cos(i * 0.6) * 6);
      o = Math.round(75 + Math.sin(i * 1.2) * 5);
    } else {
      m = Math.round(65 + Math.sin(i * 1.5) * 20);
      s = Math.round(40 + Math.cos(i * 1.3) * 18);
      o = Math.round(60 + Math.sin(i * 0.9) * 15);
    }
    tl.push({ round: i, morale: Math.max(10, Math.min(100, m)), stress: Math.max(5, Math.min(100, s)), output: Math.max(10, Math.min(100, o)) });
  }
  return tl;
}

export const DUMMY_REPORTS: Record<string, Report> = {
  "sim-001": {
    simulation_id: "sim-001",
    company_name: "Desa Sukamakmur",
    crisis_name: "Pemotongan BLT 2025",
    total_rounds: 8,
    completed_rounds: 8,
    executive_summary: "Simulasi kebijakan pemotongan Bantuan Langsung Tunai (BLT) sebesar 30% menunjukkan dampak negatif yang signifikan terhadap kepuasan warga desa. Mayoritas agen warga virtual merespons dengan kekhawatiran tinggi, terutama dari kelompok masyarakat rentan dan petani yang bergantung pada bantuan tersebut. Tingkat konflik sosial meningkat dari 25% ke 72% selama 8 minggu simulasi.",
    critical_finding: "Pemotongan BLT tanpa program kompensasi alternatif berpotensi memicu protes massal. 3 dari 5 agen warga menunjukkan tingkat stres di atas ambang kritis (>70%), dan kelompok petani mengancam akan melakukan demonstrasi di balai desa.",
    simulation_overview: "Simulasi ini menguji dampak kebijakan pengurangan BLT sebesar Rp 150.000.000 dari total anggaran desa. Lima profil agen warga yang mewakili demografi utama desa diminta merespons kebijakan ini selama 8 minggu simulasi.",
    key_metrics: { total_agents: 5, active_agents: 5, resignations: 1, avg_morale: 42, avg_stress: 72, avg_loyalty: 38, avg_productivity: 45, productivity_drop: 35, simulation_weeks: 8, total_planned_weeks: 8 },
    analysis_insights: "Analisis menunjukkan bahwa kelompok masyarakat miskin dan petani paling terdampak. Tokoh agama berperan sebagai peredam konflik, namun efektivitasnya menurun setelah minggu ke-5. Pemuda desa cenderung vokal di media sosial yang dapat memperluas dampak negatif ke luar desa. Pola diskusi menunjukkan bahwa warga lebih menerima jika pemotongan dilakukan bertahap (10% per kuartal) dibanding langsung 30%.",
    conclusion: "Kebijakan pemotongan BLT 30% dalam bentuk saat ini TIDAK DIREKOMENDASIKAN untuk dilaksanakan. Risiko konflik sosial terlalu tinggi dan kepuasan warga turun drastis. Diperlukan revisi kebijakan dengan pendekatan bertahap dan program kompensasi.",
    agent_reports: [
      { ...AGENTS_BASE[0], ending_morale: 25, peak_stress: 88, has_resigned: true, resigned_week: 6, status: "Failed", status_label: "Walkout — Mengancam demo" },
      { ...AGENTS_BASE[1], ending_morale: 50, peak_stress: 60, status: "Stressed", status_label: "Khawatir dampak ke UMKM" },
      { ...AGENTS_BASE[2], ending_morale: 35, peak_stress: 82, status: "Critical", status_label: "Kampanye negatif di medsos" },
      { ...AGENTS_BASE[3], ending_morale: 60, peak_stress: 48, status: "Stable", status_label: "Berusaha mediasi" },
      { ...AGENTS_BASE[4], ending_morale: 40, peak_stress: 75, status: "Stressed", status_label: "Khawatir anak putus sekolah" },
    ],
    productivity_drop: 35,
    recommendations: [
      "Lakukan pemotongan BLT secara bertahap (10% per kuartal) agar warga bisa beradaptasi secara ekonomi.",
      "Siapkan program pemberdayaan alternatif seperti pelatihan UMKM dan bantuan bibit pertanian sebagai kompensasi.",
      "Libatkan tokoh agama dan sesepuh desa sebagai mediator dalam sosialisasi kebijakan kepada warga.",
      "Prioritaskan perlindungan terhadap keluarga miskin dan lansia dengan mempertahankan BLT penuh untuk kelompok ini.",
      "Buat forum musyawarah terbuka sebelum implementasi untuk menampung aspirasi warga secara langsung.",
    ],
    timeline: makeTimeline("decline", 8),
    sdgs_impact: "Peringatan: Kebijakan ini berisiko menurunkan metrik SDGs Desa Poin 1 (Desa Tanpa Kemiskinan) dan Poin 10 (Desa Tanpa Kesenjangan).",
    public_trust_index: 35,
  },

  "sim-002": {
    simulation_id: "sim-002",
    company_name: "Desa Sukamakmur",
    crisis_name: "Pembangunan Irigasi Timur",
    total_rounds: 8,
    completed_rounds: 8,
    executive_summary: "Simulasi kebijakan pembangunan sistem irigasi di wilayah timur desa mendapat respons yang dominan positif dari warga virtual. Alokasi anggaran Rp 450.000.000 dinilai proporsional karena berdampak langsung pada produktivitas pertanian. Petani dan pelaku UMKM menunjukkan dukungan kuat, meski pemuda desa menyuarakan kebutuhan akan infrastruktur digital.",
    critical_finding: "Kebijakan ini relatif aman untuk dilaksanakan. Satu-satunya titik rawan adalah potensi ketidakpuasan pemuda desa yang merasa kebutuhan infrastruktur digital terabaikan. Perlu ada alokasi kecil untuk WiFi desa sebagai penyeimbang.",
    simulation_overview: "Simulasi menguji respons warga terhadap pembangunan irigasi baru senilai Rp 450.000.000 yang akan mengaliri 120 hektar sawah di wilayah timur. Lima profil agen warga diminta berdiskusi dan merespons rencana ini.",
    key_metrics: { total_agents: 5, active_agents: 5, resignations: 0, avg_morale: 78, avg_stress: 28, avg_loyalty: 75, avg_productivity: 82, productivity_drop: 5, simulation_weeks: 8, total_planned_weeks: 8 },
    analysis_insights: "Kebijakan infrastruktur pertanian mendapat dukungan luas karena menyentuh mata pencaharian mayoritas warga. Diskusi berjalan konstruktif dengan Pak Budi (Petani) menjadi pendukung utama. Mbah Yoso mendukung karena selaras dengan tradisi agraris desa. Andi (Pemuda) menerima dengan syarat ada janji pembangunan WiFi di tahun anggaran berikutnya.",
    conclusion: "Kebijakan pembangunan irigasi timur DIREKOMENDASIKAN untuk dilaksanakan. Tingkat persetujuan warga 85% dan risiko konflik sangat rendah. Tambahkan klausul pembangunan WiFi desa sebagai komitmen jangka menengah untuk menjaga kepuasan pemuda.",
    agent_reports: [
      { ...AGENTS_BASE[0], ending_morale: 90, peak_stress: 20, status: "Thriving", status_label: "Sangat mendukung — sawah terbantu" },
      { ...AGENTS_BASE[1], ending_morale: 80, peak_stress: 25, status: "Thriving", status_label: "Optimis omzet naik" },
      { ...AGENTS_BASE[2], ending_morale: 55, peak_stress: 45, status: "Stable", status_label: "Menerima, minta janji WiFi" },
      { ...AGENTS_BASE[3], ending_morale: 85, peak_stress: 15, status: "Thriving", status_label: "Bangga dengan keputusan" },
      { ...AGENTS_BASE[4], ending_morale: 78, peak_stress: 22, status: "Thriving", status_label: "Mendukung untuk ketahanan pangan" },
    ],
    productivity_drop: 5,
    recommendations: [
      "Lanjutkan implementasi pembangunan irigasi sesuai rencana anggaran yang telah disiapkan.",
      "Alokasikan anggaran kecil (Rp 15-25 juta) untuk studi kelayakan WiFi desa sebagai komitmen ke pemuda.",
      "Libatkan warga dalam pengawasan proyek melalui tim Pokdarwis untuk membangun rasa kepemilikan.",
      "Jadwalkan evaluasi dampak setelah 6 bulan untuk mengukur peningkatan produktivitas pertanian.",
    ],
    timeline: makeTimeline("stable", 8),
    sdgs_impact: "Positif: Mendukung pencapaian SDGs Desa Poin 8 (Pertumbuhan Ekonomi Desa Merata) dan Poin 9 (Infrastruktur dan Inovasi Desa sesuai Kebutuhan).",
    public_trust_index: 85,
  },

  "sim-003": {
    simulation_id: "sim-003",
    company_name: "Desa Sukamakmur",
    crisis_name: "Pajak BUMDes Baru",
    total_rounds: 8,
    completed_rounds: 8,
    executive_summary: "Simulasi kebijakan pengenaan pajak baru untuk BUMDes menunjukkan respons yang terbagi. Pelaku UMKM dan pedagang merasa terbebani, sementara aparatur desa melihat potensi peningkatan PADes. Tanpa sosialisasi yang memadai, kebijakan ini berpotensi menurunkan partisipasi warga dalam kegiatan ekonomi desa.",
    critical_finding: "Kebijakan pajak BUMDes tanpa simulasi tarif yang tepat dan sosialisasi intensif akan kontraproduktif. Bu Siti (UMKM) mengancam memindahkan usahanya ke desa tetangga jika tarif terlalu tinggi. Diperlukan revisi tarif dan masa transisi.",
    simulation_overview: "Simulasi menguji respons warga terhadap rencana pengenaan pajak baru untuk unit usaha yang beroperasi di bawah BUMDes. Kebijakan ini diusulkan tanpa alokasi anggaran khusus karena bersifat regulatif.",
    key_metrics: { total_agents: 5, active_agents: 5, resignations: 0, avg_morale: 52, avg_stress: 55, avg_loyalty: 48, avg_productivity: 50, productivity_drop: 22, simulation_weeks: 8, total_planned_weeks: 8 },
    analysis_insights: "Warga terbagi menjadi dua kubu: pro-pajak (Mbah Yoso dan Ibu Dewi) yang melihat manfaat jangka panjang, dan anti-pajak (Bu Siti dan Andi) yang khawatir dampak ekonomi langsung. Pak Budi netral tapi condong menolak jika tarif di atas 5%. Titik kompromi ditemukan di tarif 3% dengan masa bebas pajak 6 bulan pertama.",
    conclusion: "Kebijakan pajak BUMDes PERLU REVISI sebelum implementasi. Tarif awal disarankan 3% (bukan 5% seperti rencana awal), dengan masa transisi 6 bulan dan insentif bagi UMKM yang taat pajak. Sosialisasi intensif minimal 2 bulan sebelum berlaku efektif.",
    agent_reports: [
      { ...AGENTS_BASE[0], ending_morale: 55, peak_stress: 50, status: "Stable", status_label: "Netral, tidak terdampak langsung" },
      { ...AGENTS_BASE[1], ending_morale: 35, peak_stress: 80, status: "Critical", status_label: "Mengancam pindah usaha" },
      { ...AGENTS_BASE[2], ending_morale: 40, peak_stress: 65, status: "Stressed", status_label: "Protes di forum pemuda" },
      { ...AGENTS_BASE[3], ending_morale: 70, peak_stress: 30, status: "Stable", status_label: "Mendukung untuk PADes" },
      { ...AGENTS_BASE[4], ending_morale: 60, peak_stress: 48, status: "Stable", status_label: "Setuju jika ada transparansi" },
    ],
    productivity_drop: 22,
    recommendations: [
      "Turunkan tarif pajak BUMDes dari 5% menjadi 3% sebagai tarif perkenalan selama tahun pertama.",
      "Berikan masa bebas pajak (grace period) selama 6 bulan pertama untuk UMKM yang baru bergabung.",
      "Siapkan program insentif berupa diskon pajak 50% bagi UMKM yang taat bayar selama 12 bulan berturut-turut.",
      "Lakukan sosialisasi intensif melalui forum PKK dan pertemuan RT/RW minimal 2 bulan sebelum berlaku.",
      "Publikasikan laporan penggunaan dana pajak secara transparan setiap kuartal untuk membangun kepercayaan.",
    ],
    timeline: makeTimeline("volatile", 8),
    sdgs_impact: "Peringatan: Perlu penyesuaian agar tidak bertentangan dengan SDGs Desa Poin 8 (Pertumbuhan Ekonomi Desa Merata). UMKM berisiko mati jika pajak terlalu tinggi.",
    public_trust_index: 48,
  },

  "sim-004": {
    simulation_id: "sim-004",
    company_name: "Desa Sukamakmur",
    crisis_name: "Alih Fungsi Lahan Sawah",
    total_rounds: 8,
    completed_rounds: 8,
    executive_summary: "Simulasi kebijakan alih fungsi lahan sawah seluas 5 hektar menjadi kawasan wisata desa memicu konflik yang sangat tajam. Petani bereaksi keras karena lahan produktif akan hilang, sementara pemuda dan pedagang melihat peluang ekonomi baru. Konflik antar-kelompok warga mencapai puncak pada minggu ke-4.",
    critical_finding: "PERINGATAN KRITIS: Kebijakan ini memicu polarisasi sosial yang paling tinggi dari seluruh simulasi. Pak Budi (Petani) melakukan walkout pada minggu ke-5 dan mengancam memobilisasi 40 keluarga petani untuk blokade jalan desa. Risiko konflik horizontal sangat nyata.",
    simulation_overview: "Simulasi menguji dampak rencana mengubah 5 hektar lahan sawah produktif menjadi kawasan wisata terpadu. Anggaran pembangunan Rp 320.000.000 dengan proyeksi ROI 3 tahun.",
    key_metrics: { total_agents: 5, active_agents: 4, resignations: 1, avg_morale: 38, avg_stress: 78, avg_loyalty: 35, avg_productivity: 40, productivity_drop: 42, simulation_weeks: 8, total_planned_weeks: 8 },
    analysis_insights: "Kebijakan alih fungsi lahan menciptakan dilema klasik antara modernisasi ekonomi dan pelestarian mata pencaharian tradisional. Kelompok petani merasa eksistensinya terancam. Pemuda melihat peluang, tapi tanpa jaminan lapangan kerja dari wisata, dukungan mereka rapuh. Tokoh agama gagal menjadi mediator karena kebijakan ini menyentuh isu fundamental (tanah = kehidupan).",
    conclusion: "Kebijakan alih fungsi lahan sawah dalam format saat ini SANGAT TIDAK DIREKOMENDASIKAN. Diperlukan pendekatan hybrid: 2 hektar untuk wisata, 3 hektar tetap sawah dengan intensifikasi. Wajib ada program konversi profesi dan jaminan penghasilan minimum bagi petani terdampak.",
    agent_reports: [
      { ...AGENTS_BASE[0], ending_morale: 15, peak_stress: 95, has_resigned: true, resigned_week: 5, status: "Failed", status_label: "Walkout — ancam blokade jalan" },
      { ...AGENTS_BASE[1], ending_morale: 55, peak_stress: 58, status: "Stressed", status_label: "Tertarik tapi ragu" },
      { ...AGENTS_BASE[2], ending_morale: 60, peak_stress: 50, status: "Stable", status_label: "Mendukung wisata desa" },
      { ...AGENTS_BASE[3], ending_morale: 30, peak_stress: 75, status: "Critical", status_label: "Menentang — tanah warisan" },
      { ...AGENTS_BASE[4], ending_morale: 40, peak_stress: 70, status: "Stressed", status_label: "Khawatir ketahanan pangan" },
    ],
    productivity_drop: 42,
    recommendations: [
      "Ubah skema menjadi pendekatan hybrid: 2 hektar wisata + 3 hektar tetap sawah dengan program intensifikasi pertanian.",
      "Sediakan program konversi profesi dan pelatihan bagi petani terdampak sebelum alih fungsi dimulai.",
      "Jamin penghasilan minimum bagi petani selama masa transisi (minimal 12 bulan) setara dengan hasil panen sebelumnya.",
      "Libatkan kelompok tani dalam perencanaan kawasan wisata agar mereka punya peran dan penghasilan dari sektor baru.",
      "Lakukan studi AMDAL dan kajian dampak sosial sebelum melanjutkan rencana alih fungsi lahan.",
    ],
    timeline: makeTimeline("decline", 8),
    sdgs_impact: "Kritis: Sangat bertentangan dengan SDGs Desa Poin 2 (Desa Tanpa Kelaparan) dan Poin 15 (Desa Peduli Lingkungan Darat). Mengancam ketahanan pangan.",
    public_trust_index: 22,
  },

  "sim-005": {
    simulation_id: "sim-005",
    company_name: "Desa Sukamakmur",
    crisis_name: "Program Pelatihan UMKM",
    total_rounds: 8,
    completed_rounds: 8,
    executive_summary: "Simulasi kebijakan program pelatihan UMKM digital senilai Rp 75.000.000 mendapat respons sangat positif dari seluruh lapisan warga. Program ini dianggap investasi tepat untuk meningkatkan daya saing ekonomi desa. Pelaku UMKM dan pemuda antusias, sementara kelompok lain mendukung secara umum.",
    critical_finding: "Tidak ada temuan kritis yang mengkhawatirkan. Satu catatan penting: pastikan materi pelatihan disesuaikan dengan tingkat literasi digital warga yang beragam. Petani membutuhkan pendekatan berbeda dibanding pemuda.",
    simulation_overview: "Simulasi menguji respons warga terhadap program pelatihan digitalisasi UMKM yang mencakup marketplace online, pembukuan digital, dan pemasaran media sosial. Anggaran Rp 75.000.000 untuk 3 batch pelatihan.",
    key_metrics: { total_agents: 5, active_agents: 5, resignations: 0, avg_morale: 85, avg_stress: 18, avg_loyalty: 82, avg_productivity: 88, productivity_drop: 2, simulation_weeks: 8, total_planned_weeks: 8 },
    analysis_insights: "Kebijakan pemberdayaan ekonomi mendapat dukungan universal karena tidak mengurangi hak apapun dan justru menambah kapasitas warga. Bu Siti menjadi champion program ini dan bahkan mengajukan diri sebagai mentor sukarela. Andi menawarkan diri membantu konten digital. Keberhasilan simulasi ini membuktikan bahwa kebijakan berbasis pemberdayaan lebih mudah diterima dibanding kebijakan regulatif atau restriktif.",
    conclusion: "Kebijakan program pelatihan UMKM SANGAT DIREKOMENDASIKAN. Ini adalah contoh kebijakan ideal yang menghasilkan win-win solution. Dapat dijadikan role model untuk kebijakan pemberdayaan lainnya. Pertimbangkan untuk memperbesar anggaran di tahun berikutnya.",
    agent_reports: [
      { ...AGENTS_BASE[0], ending_morale: 75, peak_stress: 20, status: "Thriving", status_label: "Tertarik jual hasil tani online" },
      { ...AGENTS_BASE[1], ending_morale: 95, peak_stress: 10, status: "Thriving", status_label: "Sangat antusias — jadi mentor" },
      { ...AGENTS_BASE[2], ending_morale: 92, peak_stress: 12, status: "Thriving", status_label: "Siap bantu konten digital" },
      { ...AGENTS_BASE[3], ending_morale: 78, peak_stress: 18, status: "Thriving", status_label: "Mendukung kemajuan ekonomi" },
      { ...AGENTS_BASE[4], ending_morale: 88, peak_stress: 15, status: "Thriving", status_label: "Ingin ikut batch pertama" },
    ],
    productivity_drop: 2,
    recommendations: [
      "Segera implementasikan program pelatihan sesuai rencana — tingkat dukungan warga sangat tinggi.",
      "Buat 3 tingkatan materi: dasar (untuk petani/lansia), menengah (untuk UMKM aktif), dan lanjutan (untuk pemuda).",
      "Libatkan Bu Siti dan Andi sebagai mentor lokal untuk meningkatkan rasa kepemilikan warga atas program.",
      "Pertimbangkan peningkatan anggaran menjadi Rp 120.000.000 di tahun anggaran berikutnya berdasarkan animo yang tinggi.",
    ],
    timeline: makeTimeline("stable", 8),
    sdgs_impact: "Sangat Positif: Mendorong kuat SDGs Desa Poin 4 (Pendidikan Desa Berkualitas) dan Poin 8 (Pertumbuhan Ekonomi Desa Merata).",
    public_trust_index: 92,
  },
};

export function getDummyReport(simId: string): Report | null {
  return DUMMY_REPORTS[simId] || null;
}
