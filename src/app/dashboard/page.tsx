"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Plus, Search, FileText, Layers, CheckCircle2, SmilePlus,
  Sun, Moon, LogOut, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTheme } from "next-themes";

// ─── Dummy Data ───────────────────────────────────────────────
interface SimulationRow {
  id: string;
  name: string;
  date: string;
  budget: string;
  riskStatus: "aman" | "rawan_konflik" | "perlu_revisi";
}

const DUMMY_SIMULATIONS: SimulationRow[] = [
  {
    id: "sim-001",
    name: "Pemotongan BLT 2025",
    date: "24 Apr 2026",
    budget: "Rp 150.000.000",
    riskStatus: "rawan_konflik",
  },
  {
    id: "sim-002",
    name: "Pembangunan Irigasi Timur",
    date: "20 Apr 2026",
    budget: "Rp 450.000.000",
    riskStatus: "aman",
  },
  {
    id: "sim-003",
    name: "Pajak BUMDes Baru",
    date: "15 Apr 2026",
    budget: "Rp 0",
    riskStatus: "perlu_revisi",
  },
  {
    id: "sim-004",
    name: "Alih Fungsi Lahan Sawah",
    date: "10 Apr 2026",
    budget: "Rp 320.000.000",
    riskStatus: "rawan_konflik",
  },
  {
    id: "sim-005",
    name: "Program Pelatihan UMKM",
    date: "05 Apr 2026",
    budget: "Rp 75.000.000",
    riskStatus: "aman",
  },
];

const RISK_CONFIG: Record<string, { label: string; className: string }> = {
  aman: {
    label: "Aman",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  rawan_konflik: {
    label: "Rawan Konflik",
    className: "bg-red-500/15 text-red-400 border-red-500/30",
  },
  perlu_revisi: {
    label: "Perlu Revisi",
    className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
};

// ─── Component ────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSimulations = DUMMY_SIMULATIONS.filter((sim) =>
    sim.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 backdrop-blur-md bg-background/60">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="text-lg">🏘️</span>
            <span className="font-bold text-base tracking-tight">DesaDinamika</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <div className="flex items-center gap-2 pl-2 border-l border-border/40">
              <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="text-[10px] font-bold text-primary">KD</span>
              </div>
              <span className="text-xs font-medium hidden sm:block">Kades</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* ── Header Section ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2.5 mb-1.5">
              <span className="text-2xl">📋</span> Meja Kerja Kades
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Selamat datang, Pak Budi. Berikut ringkasan simulasi kebijakan desa Anda.
            </p>
          </div>
          <Link href="/setup">
            <Button className="rounded-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all h-10 px-5">
              <Plus className="w-4 h-4 mr-2" /> Buat Simulasi Baru
            </Button>
          </Link>
        </motion.div>

        {/* ── Stats Cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10"
        >
          {/* Card 1: Simulasi Bulan Ini */}
          <Card className="relative overflow-hidden bg-card/50 border-border/50 group hover:border-teal-500/40 transition-colors duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <CardContent className="p-5 flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
                <Layers className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight">12</p>
                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <span className="text-sm">📊</span> Simulasi Bulan Ini
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Kebijakan Berhasil */}
          <Card className="relative overflow-hidden bg-card/50 border-border/50 group hover:border-emerald-500/40 transition-colors duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <CardContent className="p-5 flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight">85%</p>
                <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                  <span className="text-sm">✅</span> Kebijakan Berhasil
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Kepercayaan Publik */}
          <Card className="relative overflow-hidden bg-card/50 border-red-500/30 group hover:border-red-500/50 transition-colors duration-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <CardContent className="p-5 flex flex-col justify-center relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                  <span className="text-xl">📉</span>
                </div>
                <div>
                  <p className="text-3xl font-bold tracking-tight text-red-400">48%</p>
                  <p className="text-xs text-muted-foreground font-medium">Indeks Kepercayaan Warga</p>
                </div>
              </div>
              <div className="mt-3">
                <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30 text-[9px] uppercase tracking-wider animate-pulse">
                  ⚠️ Risiko Kekalahan di Pilkades Berikutnya
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Simulation History Table ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-card/40 border-border/50 overflow-hidden">
            {/* Table Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 pb-4 border-b border-border/40">
              <h2 className="text-lg font-semibold tracking-tight">Riwayat Simulasi Terakhir</h2>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="Cari simulasi..."
                  className="pl-9 h-9 bg-background/50 border-border/50 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/30">
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 min-w-[200px]">
                      Nama Simulasi
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 min-w-[120px]">
                      Tanggal
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 min-w-[140px]">
                      Anggaran
                    </th>
                    <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 min-w-[130px]">
                      Status Risiko
                    </th>
                    <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 min-w-[100px]">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSimulations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-muted-foreground text-sm py-12">
                        Tidak ada simulasi ditemukan.
                      </td>
                    </tr>
                  ) : (
                    filteredSimulations.map((sim, idx) => {
                      const risk = RISK_CONFIG[sim.riskStatus];
                      return (
                        <motion.tr
                          key={sim.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.04 }}
                          className="border-b border-border/20 last:border-b-0 hover:bg-muted/30 transition-colors group cursor-pointer"
                          onClick={() => router.push(`/report?id=${sim.id}`)}
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/5 border border-border/40 flex items-center justify-center shrink-0">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <span className="text-sm font-medium group-hover:text-primary transition-colors">
                                {sim.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-muted-foreground">
                            {sim.date}
                          </td>
                          <td className="px-5 py-4 text-sm font-medium">
                            {sim.budget}
                          </td>
                          <td className="px-5 py-4">
                            <Badge
                              variant="outline"
                              className={`text-[11px] font-semibold px-2.5 py-0.5 ${risk.className}`}
                            >
                              {risk.label}
                            </Badge>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs font-semibold px-3 border-border/50 hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all group-hover:border-primary/20"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/report?id=${sim.id}`);
                              }}
                            >
                              Lihat Laporan
                              <ChevronRight className="w-3 h-3 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" />
                            </Button>
                          </td>
                        </motion.tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            {filteredSimulations.length > 0 && (
              <div className="px-5 py-3 border-t border-border/30 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  Menampilkan {filteredSimulations.length} dari {DUMMY_SIMULATIONS.length} simulasi
                </p>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-foreground">
                  Lihat Semua →
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      </main>
    </div>
  );
}
