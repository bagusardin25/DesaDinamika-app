"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Users, AlertTriangle, Play, Briefcase, Plus, X, Loader2, UserPlus, Pencil, ChevronDown, Cpu, Sparkles, FileUp, FileText, CheckCircle2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { RadarChart } from "@/components/ui/radar-chart";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const MAX_ROSTER_SIZE = 8;

interface AgentPersonality {
  empathy: number;
  ambition: number;
  stressTolerance: number;
  agreeableness: number;
  assertiveness: number;
}

interface PresetAgent {
  id: string;
  name: string;
  role: string;
  type: string;
  color: string;
  personality: AgentPersonality;
  motivation?: string;
  expertise?: string;
  model?: string;
}

const POPULAR_MODELS = [
  { label: "Default (Global)", value: "__default__" },
  { label: "GPT-4o Mini", value: "gpt-4o-mini" },
  // { label: "GPT-4o", value: "gpt-4o" },
  { label: "minimax-m2.5", value: "minimax/minimax-m2.5:free" },
  { label: "Claude 3 Haiku", value: "anthropic/claude-3-haiku" },
  { label: "Llama 3.1 8B", value: "meta-llama/llama-3.1-8b-instruct:free" },
  { label: "Kimi K2.5", value: "moonshotai/kimi-k2.5" },
  { label: "Mistral 7B", value: "mistralai/mistral-7b-instruct:free" },
  { label: "Deepseek-v3.2", value: "deepseek/deepseek-v3.2" },
  { label: "Gemini 2.0 Flash", value: "gemini-2.0-flash" },
  // { label: "Custom...", value: "__custom__" },
];

const AGENT_COLORS = [
  { label: "Red", value: "bg-red-500/20 text-red-500", dot: "bg-red-500" },
  { label: "Green", value: "bg-green-500/20 text-green-500", dot: "bg-green-500" },
  { label: "Blue", value: "bg-blue-500/20 text-blue-500", dot: "bg-blue-500" },
  { label: "Purple", value: "bg-purple-500/20 text-purple-500", dot: "bg-purple-500" },
  { label: "Orange", value: "bg-orange-500/20 text-orange-500", dot: "bg-orange-500" },
  { label: "Cyan", value: "bg-cyan-500/20 text-cyan-500", dot: "bg-cyan-500" },
  { label: "Pink", value: "bg-pink-500/20 text-pink-500", dot: "bg-pink-500" },
  { label: "Yellow", value: "bg-yellow-500/20 text-yellow-500", dot: "bg-yellow-500" },
];

const DEFAULT_PERSONALITY: AgentPersonality = {
  empathy: 50,
  ambition: 50,
  stressTolerance: 50,
  agreeableness: 50,
  assertiveness: 50,
};

export default function SetupPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [presets, setPresets] = useState<PresetAgent[]>([]);
  const [selectedAgents, setSelectedAgents] = useState<PresetAgent[]>([]);
  const [companyName, setCompanyName] = useState("Desa Sukamakmur");
  const [companyCulture, setCompanyCulture] = useState(
    "Desa agraris dengan 60% penduduk adalah petani. Sedang merencanakan pembangunan irigasi desa namun anggaran terbatas."
  );
  const [crisis, setCrisis] = useState("rnd1");
  const [customCrisis, setCustomCrisis] = useState("");
  const [isGeneratingCrisis, setIsGeneratingCrisis] = useState(false);
  const [durationWeeks, setDurationWeeks] = useState(12);
  const [pacingSpeed, setPacingSpeed] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Custom Agent Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingAgent, setEditingAgent] = useState<PresetAgent | null>(null);
  const [customName, setCustomName] = useState("");
  const [customRole, setCustomRole] = useState("");
  const [customType, setCustomType] = useState("");
  const [customColor, setCustomColor] = useState(AGENT_COLORS[0].value);
  const [customMotivation, setCustomMotivation] = useState("");
  const [customExpertise, setCustomExpertise] = useState("");
  const [customModel, setCustomModel] = useState("");
  const [customModelInput, setCustomModelInput] = useState("");
  const [customPersonality, setCustomPersonality] = useState<AgentPersonality>({ ...DEFAULT_PERSONALITY });

  // Preset picker dropdown
  const [showPresetPicker, setShowPresetPicker] = useState(false);

  // Document upload state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [docAnalysis, setDocAnalysis] = useState<{
    filename: string;
    analysis: {
      company_name: string;
      company_culture: string;
      summary: string;
      key_requirements: string[];
      team_risks: string[];
      suggested_crisis: { title: string; description: string };
      suggested_agents: { name: string; role: string; type: string; rationale: string; personality: AgentPersonality }[];
      suggested_team_rules: string[];
      actionable_insights: string[];
    };
  } | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // Fetch preset agents on mount
  useEffect(() => {
    fetch(`${API_BASE}/api/agents/presets`)
      .then((res) => res.json())
      .then((data) => {
        setPresets(data);
        setSelectedAgents(data.slice(0, 3));
      })
      .catch((err) => {
        console.error("Failed to fetch presets:", err);
        // Fallback to hardcoded presets
        const fallback: PresetAgent[] = [
          { id: "1", name: "Pak Budi", role: "Petani", type: "Pragmatis", color: "bg-green-500/20 text-green-500", personality: { empathy: 60, ambition: 40, stressTolerance: 80, agreeableness: 50, assertiveness: 60 } },
          { id: "2", name: "Bu Siti", role: "Pemilik UMKM", type: "Adaptif", color: "bg-blue-500/20 text-blue-500", personality: { empathy: 80, ambition: 70, stressTolerance: 60, agreeableness: 70, assertiveness: 50 } },
          { id: "3", name: "Andi", role: "Pemuda Desa", type: "Vokal", color: "bg-orange-500/20 text-orange-500", personality: { empathy: 50, ambition: 90, stressTolerance: 40, agreeableness: 30, assertiveness: 85 } },
          { id: "4", name: "Mbah Yoso", role: "Sesepuh", type: "Konservatif", color: "bg-purple-500/20 text-purple-500", personality: { empathy: 70, ambition: 30, stressTolerance: 70, agreeableness: 40, assertiveness: 75 } },
        ];
        setPresets(fallback);
        setSelectedAgents(fallback.slice(0, 3));
      });
  }, []);

  const removeAgent = (id: string) => setSelectedAgents(selectedAgents.filter((a) => a.id !== id));

  const addPresetAgent = (agent: PresetAgent) => {
    if (selectedAgents.length >= MAX_ROSTER_SIZE) return;
    if (!selectedAgents.find((a) => a.id === agent.id)) {
      setSelectedAgents([...selectedAgents, agent]);
    }
  };

  const handleGenerateCrisis = async () => {
    if (!companyName || !companyCulture) {
      toast.error("Please fill in Company Name and Culture first.");
      return;
    }
    setIsGeneratingCrisis(true);
    try {
      const res = await fetch(`${API_BASE}/api/simulation/generate-crisis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_name: companyName, company_culture: companyCulture }),
      });
      if (!res.ok) throw new Error("Failed to generate crisis");
      const data = await res.json();
      setCrisis("custom");
      setCustomCrisis(`[${data.title}]\n\n${data.description}`);
      toast.success("AI tailored a custom crisis for your startup!");
    } catch (err) {
      console.error(err);
      toast.error("Generation failed. Please try again.");
    } finally {
      setIsGeneratingCrisis(false);
    }
  };

  const handleDocumentUpload = async (file: File) => {
    if (!file) return;
    setIsAnalyzing(true);
    setDocAnalysis(null);
    
    // Simulate API delay for demo magic
    setTimeout(() => {
      const fakeAnalysis = {
        company_name: "Desa Sukamakmur",
        company_culture: "Mayoritas warga bergantung pada sektor pertanian (40%) dan UMKM (20%). Dokumen APBDes menunjukkan adanya rencana pengalihan dana operasional yang signifikan.",
        summary: "Draf RAB mengindikasikan pemotongan anggaran pemberdayaan masyarakat sebesar 30% untuk dialihkan ke proyek fisik jembatan.",
        key_requirements: ["Efisiensi Anggaran Fisik", "Transparansi Dana Bantuan"],
        team_risks: ["Potensi protes dari kelompok Petani", "Keluhan penurunan daya beli UMKM"],
        suggested_crisis: {
          title: "Pemangkasan Bantuan Sosial (BLT) 30%",
          description: "Pengalihan dana BLT untuk mempercepat pembangunan fisik desa.",
        },
        suggested_agents: [],
        suggested_team_rules: [],
        actionable_insights: [],
      };

      setDocAnalysis({ filename: file.name, analysis: fakeAnalysis });
      setIsAnalyzing(false);
      toast.success("Dokumen RAB berhasil diekstrak oleh AI!");
      
      // Auto-apply magic for Demo
      setCompanyName(fakeAnalysis.company_name);
      setCompanyCulture(fakeAnalysis.company_culture);
      setCrisis("rnd1"); // Pemangkasan Bantuan Sosial (BLT) 30%
      
      // Auto-select specific agents for this crisis (Petani, UMKM, Pemuda)
      const demoAgents = presets.filter(a => ["1", "2", "3"].includes(a.id));
      if (demoAgents.length > 0) {
        setSelectedAgents(demoAgents);
      }
      
      toast.info("AI secara otomatis menyiapkan kebijakan dan menyusun agen perwakilan desa.");
    }, 2500);
  };

  const applyDocSuggestions = () => {
    if (!docAnalysis) return;
    toast.success("Konfigurasi dari dokumen telah diterapkan.");
  };

  const addSuggestedAgent = (sa: { name: string; role: string; type: string; rationale: string; personality: AgentPersonality }, index: number) => {
    if (selectedAgents.length >= MAX_ROSTER_SIZE) {
      toast.warning("Roster is full (max 8 agents).");
      return;
    }
    const newAgent: PresetAgent = {
      id: `ai-suggested-${Date.now()}-${index}`,
      name: sa.name || `Agent`,
      role: sa.role,
      type: sa.type,
      color: AGENT_COLORS[selectedAgents.length % AGENT_COLORS.length].value,
      personality: sa.personality || { ...DEFAULT_PERSONALITY },
    };
    setSelectedAgents((prev) => [...prev, newAgent]);
    toast.success(`${newAgent.name} (${newAgent.role}) added to roster!`);
  };

  const openCreateModal = () => {
    setEditingAgent(null);
    setCustomName("");
    setCustomRole("");
    setCustomType("");
    setCustomColor(AGENT_COLORS[0].value);
    setCustomMotivation("");
    setCustomExpertise("");
    setCustomModel("__default__");
    setCustomModelInput("");
    setCustomPersonality({ ...DEFAULT_PERSONALITY });
    setShowCreateModal(true);
  };

  const openEditModal = (agent: PresetAgent) => {
    setEditingAgent(agent);
    setCustomName(agent.name);
    setCustomRole(agent.role);
    setCustomType(agent.type);
    setCustomColor(agent.color);
    setCustomMotivation(agent.motivation || "");
    setCustomExpertise(agent.expertise || "");
    const agentModel = agent.model || "";
    const isKnown = POPULAR_MODELS.some(m => m.value === agentModel && m.value !== "__default__");
    setCustomModel(isKnown ? agentModel : (agentModel ? "__custom__" : "__default__"));
    setCustomModelInput(isKnown ? "" : (agentModel || ""));
    setCustomPersonality({ ...agent.personality });
    setShowCreateModal(true);
  };

  const handleSaveAgent = () => {
    if (!customName.trim() || !customRole.trim() || !customType.trim()) return;

    const resolvedModel = customModel === "__custom__" ? customModelInput.trim() : (customModel === "__default__" ? "" : customModel);
    const agentData: PresetAgent = {
      id: editingAgent ? editingAgent.id : `custom-${Date.now()}`,
      name: customName.trim(),
      role: customRole.trim(),
      type: customType.trim(),
      color: customColor,
      personality: { ...customPersonality },
      motivation: customMotivation.trim() || undefined,
      expertise: customExpertise.trim() || undefined,
      model: resolvedModel || undefined,
    };

    if (editingAgent) {
      setSelectedAgents(selectedAgents.map((a) => (a.id === editingAgent.id ? agentData : a)));
    } else {
      setSelectedAgents([...selectedAgents, agentData]);
    }

    setShowCreateModal(false);
  };

  const getPacingLabel = () => {
    if (pacingSpeed <= 25) return "Slow";
    if (pacingSpeed <= 75) return "Normal";
    return "Fast";
  };

  const getPacingValue = (): string => {
    if (pacingSpeed <= 25) return "slow";
    if (pacingSpeed <= 75) return "normal";
    return "fast";
  };

  const estimateApiCalls = () => {
    return selectedAgents.length * durationWeeks;
  };

  const estimateCost = () => {
    return (estimateApiCalls() * 0.0005).toFixed(2);
  };

  const handleStartSimulation = async () => {
    if (!crisis) {
      toast.warning("Please select a crisis scenario before starting.");
      return;
    }
    if (selectedAgents.length === 0) {
      toast.warning("Please select at least one agent.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        company: {
          name: companyName,
          culture: companyCulture,
        },
        agents: selectedAgents.map((a) => ({
          id: a.id,
          name: a.name,
          role: a.role,
          type: a.type,
          color: a.color,
          personality: a.personality,
          motivation: a.motivation || null,
          expertise: a.expertise || null,
          model: a.model || null,
        })),
        crisis: {
          scenario: crisis,
          custom_description: crisis === "custom" ? customCrisis : null,
        },
        params: {
          duration_weeks: durationWeeks,
          pacing: getPacingValue(),
        },
      };

      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_BASE}/api/simulation/create`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        if (res.status === 403) {
          toast.error(errData?.detail || "No simulation credits remaining.");
          setIsLoading(false);
          return;
        }
        throw new Error(errData?.detail || "Failed to create simulation");
      }

      const data = await res.json();
      toast.success("Simulation created! Redirecting...");
      router.push(`/simulation?id=${data.id}`);
    } catch (err: any) {
      console.error("Failed to start simulation:", err);
      // Fallback to demo mode when backend is unavailable
      toast.info("Backend tidak tersedia. Menjalankan simulasi demo...");
      
      // Save setup data to use in dummy simulation & report
      sessionStorage.setItem("demo_agents", JSON.stringify(selectedAgents));
      sessionStorage.setItem("demo_company", companyName);
      sessionStorage.setItem("demo_culture", companyCulture);
      sessionStorage.setItem("demo_crisis", crisis === "custom" ? customCrisis : crisis);
      
      router.push("/simulation?id=demo");
    }
  };

  const rosterFull = selectedAgents.length >= MAX_ROSTER_SIZE;
  const availablePresets = presets.filter((p) => !selectedAgents.find((s) => s.id === p.id));

  return (
    <div className="min-h-screen bg-background p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header & Stepper */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
          <div>
            <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-3">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight mb-2 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              Konfigurasi Simulasi Desa
            </h1>
            <p className="text-muted-foreground max-w-lg">
              Atur profil desa, pilih agen perwakilan warga, dan uji coba kebijakan Anda secara virtual.
            </p>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div className={`relative w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 ${currentStep === step ? 'bg-primary text-primary-foreground scale-110 ring-4 ring-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.6)]' : currentStep > step ? 'bg-primary/10 text-primary border border-primary/30' : 'bg-muted/50 text-muted-foreground border border-border/50 hover:bg-muted'}`}>
                  {currentStep > step ? <CheckCircle2 className="w-4 h-4" /> : step}
                </div>
                {step < 3 && (
                  <div className="relative w-6 sm:w-12 h-1 bg-muted/50 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute left-0 top-0 h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: currentStep > step ? '100%' : '0%' }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="relative min-h-[600px]">
          <AnimatePresence mode="wait">
            {/* Step 1 */}
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8 max-w-3xl mx-auto">
                <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                  <Card className="relative overflow-hidden border-border/40 bg-card/40 backdrop-blur-xl shadow-2xl hover:border-primary/30 transition-colors duration-500 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <CardHeader className="relative z-10 pb-4 border-b border-border/30 bg-card/30">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="p-2.5 rounded-xl bg-primary/10 text-primary shadow-inner">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Data Demografi & Profil Desa</CardTitle>
                          <CardDescription className="mt-0.5 text-xs">Informasi dasar tentang desa yang dikelola.</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10 space-y-4 pt-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Nama Desa</label>
                        <Input placeholder="e.g. Desa Sukamakmur" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="bg-background/50 border-border/50 focus-visible:ring-primary/50 text-sm transition-all" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Profil Demografi</label>
                        <Textarea placeholder="Contoh: Mayoritas warga bekerja sebagai petani (60%). Sedang ada isu kekeringan..." value={companyCulture} onChange={(e) => setCompanyCulture(e.target.value)} className="min-h-[100px] bg-background/50 border-border/50 focus-visible:ring-primary/50 text-sm leading-relaxed resize-y transition-all" />
                      </div>

                      {/* Demographic Composition Sliders */}
                      <div className="space-y-3 pt-2">
                        <label className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Komposisi Demografi Warga</label>
                        <p className="text-[10px] text-muted-foreground -mt-1">Atur perkiraan proporsi kelompok warga desa. Ini membantu AI menyiapkan agen yang representatif.</p>
                        {[
                          { key: "petani", label: "🌾 Petani / Buruh Tani", value: 40, color: "bg-emerald-500" },
                          { key: "umkm", label: "🏪 Pelaku UMKM / Pedagang", value: 20, color: "bg-blue-500" },
                          { key: "pemuda", label: "👦 Pemuda / Gen Z", value: 20, color: "bg-violet-500" },
                          { key: "tokoh", label: "🕌 Tokoh Agama / Adat", value: 10, color: "bg-amber-500" },
                          { key: "pkk", label: "👩 Kader PKK / Perempuan", value: 10, color: "bg-rose-500" },
                        ].map((demo) => (
                          <div key={demo.key} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium">{demo.label}</span>
                              <span className="text-xs font-bold text-primary tabular-nums">{demo.value}%</span>
                            </div>
                            <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${demo.color} transition-all`} style={{ width: `${demo.value}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                  <Card className="relative overflow-hidden border-border/40 bg-card/40 backdrop-blur-xl shadow-2xl hover:border-orange-500/30 transition-colors duration-500 group">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 to-orange-600" />
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <CardHeader className="relative z-10 pb-4 border-b border-border/30 bg-card/30">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 shadow-inner">
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">Input Kebijakan Desa</CardTitle>
                          <CardDescription className="mt-0.5 text-xs">Kebijakan apa yang ingin Anda ujikan kepada warga?</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10 space-y-4 pt-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Pilih Kebijakan</label>
                          <Button variant="ghost" size="sm" onClick={handleGenerateCrisis} disabled={isGeneratingCrisis} className="h-7 text-[11px] font-semibold text-orange-500 hover:text-orange-400 hover:bg-orange-500/10 rounded-full px-2.5 transition-all">
                            {isGeneratingCrisis ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                            AI Suggestion
                          </Button>
                        </div>
                        <Select value={crisis} onValueChange={(val) => setCrisis(val || "")}>
                          <SelectTrigger className="w-full bg-background/50 border-border/50 focus:ring-orange-500/50 text-sm transition-all">
                            <SelectValue placeholder="Pilih rancangan kebijakan..." />
                          </SelectTrigger>
                          <SelectContent className="backdrop-blur-xl bg-background/95 border-white/10 shadow-2xl">
                            <SelectItem value="rnd1" className="cursor-pointer focus:bg-orange-500/10 focus:text-orange-500 transition-colors text-sm">Pemangkasan Bantuan Sosial (BLT) 30%</SelectItem>
                            <SelectItem value="rnd2" className="cursor-pointer focus:bg-orange-500/10 focus:text-orange-500 transition-colors text-sm">Pemindahan Lahan Pasar Desa</SelectItem>
                            <SelectItem value="rnd3" className="cursor-pointer focus:bg-orange-500/10 focus:text-orange-500 transition-colors text-sm">Kenaikan Iuran Kebersihan 50%</SelectItem>
                            <SelectItem value="rnd4" className="cursor-pointer focus:bg-orange-500/10 focus:text-orange-500 transition-colors text-sm">Alih Fungsi Lahan Pertanian ke Wisata</SelectItem>
                            <SelectItem value="custom" className="cursor-pointer font-bold text-primary focus:bg-primary/10 transition-colors text-sm">Kebijakan Kustom...</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {crisis === "custom" && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-1.5 pt-1">
                          <label className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">Deskripsi Detail Kebijakan</label>
                          <Textarea placeholder="Contoh: Menganggarkan 50 Juta dari Dana Desa untuk pelatihan UMKM..." value={customCrisis} onChange={(e) => setCustomCrisis(e.target.value)} className="min-h-[100px] bg-background/50 border-border/50 focus-visible:ring-orange-500/50 text-sm leading-relaxed transition-all" />
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Document Upload & AI Analysis */}
                <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                  <Card className="relative overflow-hidden border-border/40 bg-card/40 backdrop-blur-xl shadow-2xl hover:border-violet-500/30 transition-colors duration-500 group">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-400 to-violet-600" />
                    <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    <CardHeader className="relative z-10 pb-4 border-b border-border/30 bg-card/30">
                      <div className="flex items-center gap-3 mb-1">
                        <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-500 relative shadow-inner">
                          <FileUp className="w-5 h-5 relative z-10" />
                          <div className="absolute inset-0 bg-violet-500/20 blur-xl rounded-full" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <CardTitle className="text-lg">Analisis Dokumen AI</CardTitle>
                            <Badge variant="secondary" className="px-1.5 py-0 text-[9px] bg-violet-500 text-white border-none shadow-[0_0_10px_rgba(139,92,246,0.5)] animate-pulse">BARU</Badge>
                          </div>
                          <CardDescription className="mt-0.5 text-xs">Unggah dokumen RAB/APBDes (PDF, Excel) untuk ekstraksi data otomatis.</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10 space-y-4 pt-4">
                      {/* Drop zone */}
                      <div
                        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer overflow-hidden ${dragOver ? "border-violet-500 bg-violet-500/20 scale-[0.99] shadow-inner" : "border-border/60 hover:border-violet-500/50 hover:bg-violet-500/5"
                          } ${isAnalyzing ? "pointer-events-none opacity-50 backdrop-blur-sm" : ""}`}
                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setDragOver(false);
                          const file = e.dataTransfer.files[0];
                          if (file) handleDocumentUpload(file);
                        }}
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = ".pdf,.docx,.doc,.txt,.csv,.xlsx,.xls";
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) handleDocumentUpload(file);
                          };
                          input.click();
                        }}
                      >
                        {isAnalyzing ? (
                          <div className="flex flex-col items-center gap-3">
                            <div className="relative">
                              <Loader2 className="w-8 h-8 text-violet-400 animate-spin relative z-10" />
                              <div className="absolute inset-0 bg-violet-500/40 blur-xl rounded-full animate-pulse" />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-violet-400">Menganalisis Dokumen...</p>
                              <p className="text-xs text-muted-foreground mt-0.5">Mengekstrak data anggaran, demografi, dan risiko kebijakan</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-3 relative z-10">
                            <div className={`p-3 rounded-full transition-colors duration-300 ${dragOver ? "bg-violet-500/30 text-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.3)]" : "bg-card/50 shadow-sm border border-white/5 text-muted-foreground"}`}>
                              <FileUp className={`w-6 h-6 transition-colors ${dragOver ? "text-violet-400" : ""}`} />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Klik untuk pilih file atau seret ke sini</p>
                              <p className="text-xs text-muted-foreground mt-0.5 tracking-wide">Mendukung PDF, DOCX, TXT, CSV, Excel (Maks 10MB)</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Analysis Results */}
                      <AnimatePresence>
                        {docAnalysis && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                            <div className="rounded-xl bg-violet-500/5 border border-violet-500/20 p-4 space-y-3">
                              <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span className="text-sm font-semibold">Hasil Analisis: {docAnalysis.filename}</span>
                              </div>

                              {/* Detected Company Info */}
                              {(docAnalysis.analysis.company_name || docAnalysis.analysis.company_culture) && (
                                <div className="rounded-lg bg-blue-500/10 border border-blue-500/20 p-3 space-y-1">
                                  <h4 className="text-xs font-semibold text-blue-400 mb-1">🏘️ Info Desa Terdeteksi</h4>
                                  {docAnalysis.analysis.company_name && (
                                    <p className="text-xs"><span className="text-muted-foreground">Nama Desa:</span> <span className="font-medium">{docAnalysis.analysis.company_name}</span></p>
                                  )}
                                  {docAnalysis.analysis.company_culture && (
                                    <p className="text-xs"><span className="text-muted-foreground">Profil:</span> <span className="font-medium">{docAnalysis.analysis.company_culture}</span></p>
                                  )}
                                </div>
                              )}

                              {/* Summary */}
                              <p className="text-sm text-muted-foreground leading-relaxed">{docAnalysis.analysis.summary}</p>

                              {/* Key Requirements */}
                              {docAnalysis.analysis.key_requirements.length > 0 && (
                                <div>
                                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Poin Utama</h4>
                                  <ul className="space-y-1">
                                    {docAnalysis.analysis.key_requirements.map((req, i) => (
                                      <li key={i} className="text-xs text-foreground flex gap-2"><span className="text-violet-400 shrink-0">•</span>{req}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Team Risks */}
                              {docAnalysis.analysis.team_risks.length > 0 && (
                                <div>
                                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Risiko Sosial</h4>
                                  <ul className="space-y-1">
                                    {docAnalysis.analysis.team_risks.map((risk, i) => (
                                      <li key={i} className="text-xs text-orange-400 flex gap-2"><AlertTriangle className="w-3 h-3 shrink-0 mt-0.5" />{risk}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Suggested Team Rules */}
                              {docAnalysis.analysis.suggested_team_rules && docAnalysis.analysis.suggested_team_rules.length > 0 && (
                                <div>
                                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">📋 Suggested Team Rules</h4>
                                  <ul className="space-y-1">
                                    {docAnalysis.analysis.suggested_team_rules.map((rule, i) => (
                                      <li key={i} className="text-xs text-foreground flex gap-2"><span className="text-cyan-400 shrink-0">{i + 1}.</span>{rule}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Suggested Crisis */}
                              {docAnalysis.analysis.suggested_crisis && (
                                <div className="rounded-lg bg-orange-500/10 border border-orange-500/20 p-3">
                                  <h4 className="text-xs font-semibold text-orange-400 mb-1">💥 Suggested Crisis</h4>
                                  <p className="text-xs font-medium">{docAnalysis.analysis.suggested_crisis.title}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">{docAnalysis.analysis.suggested_crisis.description}</p>
                                </div>
                              )}

                              {/* Suggested Agents */}
                              {docAnalysis.analysis.suggested_agents.length > 0 && (
                                <div>
                                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Suggested Team Members</h4>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {docAnalysis.analysis.suggested_agents.map((agent, i) => {
                                      const isAlreadyAdded = selectedAgents.some((sa) => sa.name === agent.name && sa.role === agent.role);
                                      return (
                                        <div key={i} className={`rounded-lg bg-background/50 border p-2 transition-all ${isAlreadyAdded ? 'border-green-500/30 bg-green-500/5' : 'border-border/50 hover:border-primary/40'}`}>
                                          <div className="flex items-start justify-between gap-1">
                                            <div className="flex-1 min-w-0">
                                              <div className="text-xs font-semibold">{agent.name} — {agent.role}</div>
                                              <Badge variant="secondary" className="text-[9px] mt-0.5">{agent.type}</Badge>
                                            </div>
                                            {isAlreadyAdded ? (
                                              <Badge variant="secondary" className="text-[9px] bg-green-500/10 text-green-500 border-none shrink-0">Added</Badge>
                                            ) : (
                                              <button
                                                onClick={() => addSuggestedAgent(agent, i)}
                                                disabled={selectedAgents.length >= MAX_ROSTER_SIZE}
                                                className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors shrink-0 disabled:opacity-30"
                                                title={`Add ${agent.name} to roster`}
                                              >
                                                <Plus className="w-3 h-3" />
                                              </button>
                                            )}
                                          </div>
                                          <p className="text-[10px] text-muted-foreground mt-1">{agent.rationale}</p>
                                          {/* Mini personality preview */}
                                          <div className="flex gap-1 mt-1.5 flex-wrap">
                                            {Object.entries(agent.personality || {}).map(([key, val]) => (
                                              <span key={key} className="text-[8px] px-1 py-0.5 rounded bg-muted/50 text-muted-foreground">
                                                {key.slice(0, 3).toUpperCase()} {val as number}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {/* Apply All Suggestions Button */}
                              <Button size="sm" className="w-full h-9 bg-violet-600 hover:bg-violet-700 text-white" onClick={applyDocSuggestions}>
                                <Sparkles className="w-3 h-3 mr-1" /> Apply All Suggestions to Setup
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>

                </motion.div>

                <div className="flex justify-end pt-4 pb-2">
                  <Button onClick={() => setCurrentStep(2)} className="w-full sm:w-auto h-11 px-8 rounded-xl text-sm font-semibold bg-primary hover:bg-primary/90 shadow-[0_8px_30px_rgba(var(--primary),0.3)] hover:shadow-[0_8px_30px_rgba(var(--primary),0.5)] transition-all hover:-translate-y-1 group">
                    Next: Assemble Team
                    <ChevronDown className="w-4 h-4 ml-1.5 -rotate-90 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2 */}
            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left: Pool */}
                  <Card className="border-border/50 bg-card/20 backdrop-blur-sm border-dashed">
                    <CardHeader>
                      <CardTitle className="text-lg">Kandidat Agen Warga</CardTitle>
                      <CardDescription>Pilih warga untuk ikut simulasi kebijakan.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 h-[400px] overflow-y-auto p-4">
                      {/* AI Recommended Section */}
                      {docAnalysis && docAnalysis.analysis.suggested_agents.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                            <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">AI Recommended</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {docAnalysis.analysis.suggested_agents.map((sa, i) => {
                              const isAdded = selectedAgents.some((a) => a.name === sa.name && a.role === sa.role);
                              return (
                                <motion.button
                                  key={`ai-pool-${i}`}
                                  onClick={() => !isAdded && addSuggestedAgent(sa, i)}
                                  disabled={isAdded || rosterFull}
                                  className={`flex flex-col text-left border rounded-xl p-3 transition-all group ${isAdded
                                    ? 'border-green-500/30 bg-green-500/5 opacity-60 cursor-default'
                                    : 'border-violet-500/30 bg-violet-500/5 hover:bg-violet-500/10 hover:border-violet-500/50 hover:shadow-md'
                                    }`}
                                >
                                  <div className="flex items-center gap-2 mb-2 w-full">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm bg-violet-500/80 text-white">{sa.name?.charAt(0) || '?'}</div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-semibold truncate group-hover:text-violet-400 transition-colors">{sa.name}</div>
                                      <div className="text-[10px] text-muted-foreground truncate">{sa.role}</div>
                                    </div>
                                    {isAdded ? (
                                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                                    ) : (
                                      <Plus className="w-4 h-4 text-violet-400 group-hover:text-violet-300 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    )}
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Badge variant="secondary" className="text-[9px] w-fit truncate">{sa.type}</Badge>
                                    <Badge variant="secondary" className="text-[8px] bg-violet-500/10 text-violet-400 border-none">AI</Badge>
                                  </div>
                                </motion.button>
                              );
                            })}
                          </div>
                          <Separator className="my-2" />
                        </div>
                      )}

                      {/* Standard Presets */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 content-start">
                        {availablePresets.map((p) => (
                          <motion.button
                            key={p.id}
                            layoutId={`agent-${p.id}`}
                            onClick={() => { addPresetAgent(p); }}
                            className="flex flex-col text-left border border-border/40 rounded-xl p-3 bg-card hover:bg-primary/5 hover:border-primary/50 hover:shadow-md transition-all group"
                          >
                            <div className="flex items-center gap-2 mb-2 w-full">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm text-white ${p.color.replace('text-', 'bg-').replace('/20', '/80')}`}>{p.name.charAt(0)}</div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold truncate group-hover:text-primary transition-colors">{p.name}</div>
                                <div className="text-[10px] text-muted-foreground truncate">{p.role}</div>
                              </div>
                              <Plus className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <Badge variant="secondary" className="text-[9px] w-fit truncate">
                              {p.type}
                            </Badge>
                          </motion.button>
                        ))}
                        <motion.button onClick={openCreateModal} layout className="flex flex-col items-center justify-center text-center border-2 border-dashed border-primary/30 rounded-xl p-4 bg-primary/5 hover:bg-primary/10 transition-colors h-[100px] gap-2 text-primary">
                          <UserPlus className="w-5 h-5" />
                          <span className="text-xs font-semibold">Buat Manual</span>
                        </motion.button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Right: Roster */}
                  <Card className="border-primary/20 bg-card/50 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent pointer-events-none" />
                    <CardHeader className="flex flex-row items-start justify-between gap-4 pb-2 border-b border-border/50">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Users className="w-5 h-5 text-primary" />
                          <CardTitle>Perwakilan Warga</CardTitle>
                        </div>
                        <CardDescription>Daftar agen yang akan disimulasikan.</CardDescription>
                      </div>
                      <Badge variant={rosterFull ? "destructive" : "secondary"} className="shrink-0 mt-1 shadow-sm">
                        {selectedAgents.length}/8
                      </Badge>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3 h-[400px] overflow-y-auto">
                      <AnimatePresence>
                        {selectedAgents.length === 0 && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                            <Users className="w-12 h-12 mb-3 opacity-20" />
                            <p className="text-sm">Roster is empty.</p>
                            <p className="text-xs">Add up to 8 agents.</p>
                          </motion.div>
                        )}
                        {selectedAgents.map((agent) => (
                          <motion.div
                            key={agent.id}
                            layoutId={`agent-${agent.id}`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, x: 20 }}
                            className="border border-border/50 rounded-xl p-3 bg-background/80 backdrop-blur-md relative group cursor-pointer transition-all hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-[0_4px_20px_rgba(var(--primary),0.15)]"
                            onClick={() => setExpandedAgent(expandedAgent === agent.id ? null : agent.id)}
                          >
                            <button onClick={(e) => { e.stopPropagation(); removeAgent(agent.id); }} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-destructive/10 text-destructive flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground z-10"><X className="w-3 h-3" /></button>
                            <button onClick={(e) => { e.stopPropagation(); openEditModal(agent); }} className="absolute top-2 right-10 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground z-10"><Pencil className="w-3 h-3" /></button>

                            <div className="flex items-center gap-3 mb-2">
                              {/* Soft GLow based on agent color type */}
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-md text-white ${agent.color.replace('text-', 'bg-').replace('/20', '/80')}`}>
                                {agent.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-semibold text-sm group-hover:text-primary transition-colors">{agent.name}</div>
                                <div className="text-xs text-muted-foreground">{agent.role}</div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              <Badge variant="secondary" className={`${agent.color.includes('border') ? agent.color : agent.color + " border-none"} font-medium text-[10px]`}>{agent.type}</Badge>
                              {agent.model && <Badge variant="outline" className="text-[9px] bg-violet-500/10 text-violet-400 border-violet-500/20"><Cpu className="w-2.5 h-2.5 mr-1" />Custom AI</Badge>}
                              {agent.expertise && <Badge variant="outline" className="text-[9px]">🎯 Expert</Badge>}
                            </div>

                            {/* Radar Chart (expanded) */}
                            <AnimatePresence>
                              {expandedAgent === agent.id && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                  <div className="mt-3 pt-3 border-t border-border/50 flex flex-col items-center">
                                    <RadarChart size={160} data={[{ label: "EMP", value: agent.personality.empathy }, { label: "AMB", value: agent.personality.ambition }, { label: "RES", value: agent.personality.stressTolerance }, { label: "AGR", value: agent.personality.agreeableness }, { label: "ASR", value: agent.personality.assertiveness }]} />
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setCurrentStep(1)} className="h-12 px-6">&larr; Kembali</Button>
                  <Button onClick={() => setCurrentStep(3)} size="lg" disabled={selectedAgents.length === 0} className="h-12 px-8">Selanjutnya: Konfigurasi &rarr;</Button>
                </div>
              </motion.div>
            )}

            {/* Step 3 */}
            {currentStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-8 max-w-2xl mx-auto">
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-xl">Parameter Simulasi</CardTitle>
                    <CardDescription>Atur durasi dan kecepatan simulasi.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <label className="font-medium">Duration (Weeks)</label>
                        <span className="text-xl font-bold text-primary">{durationWeeks}</span>
                      </div>
                      <Slider value={[durationWeeks]} onValueChange={(val) => setDurationWeeks(Array.isArray(val) ? val[0] : val)} max={24} min={1} step={1} className="py-4" />
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <label className="font-medium">Pacing Speed</label>
                        <span className="text-xl font-bold text-primary">{getPacingLabel()}</span>
                      </div>
                      <Slider value={[pacingSpeed]} onValueChange={(val) => setPacingSpeed(Array.isArray(val) ? val[0] : val)} max={100} step={50} className="py-4" />
                      <p className="text-xs text-muted-foreground">Determines how fast agents reply in the simulated chat UI.</p>
                    </div>



                  </CardContent>
                </Card>

                <div className="flex justify-between pt-4">
                  <Button variant="outline" onClick={() => setCurrentStep(2)} className="h-12 px-6">&larr; Kembali</Button>
                  <Button className="h-12 px-10 text-md font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all hover:scale-105" onClick={handleStartSimulation} disabled={isLoading || selectedAgents.length === 0}>
                    {isLoading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Memulai...</> : <><Play className="w-5 h-5 mr-2" /> Mulai Simulasi</>}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Create / Edit Agent Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold">{editingAgent ? "Edit Agent" : "Create Custom Agent"}</h2>
                  <button onClick={() => setShowCreateModal(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Name *</label>
                    <Input
                      placeholder="e.g. Taylor"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Role *</label>
                    <Input
                      placeholder="e.g. Designer"
                      value={customRole}
                      onChange={(e) => setCustomRole(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Personality Type *</label>
                  <Input
                    placeholder="e.g. Perfectionist & Anxious"
                    value={customType}
                    onChange={(e) => setCustomType(e.target.value)}
                    className="bg-background/50"
                  />
                </div>

                {/* Color Picker */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Color Tag</label>
                  <div className="flex gap-2">
                    {AGENT_COLORS.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => setCustomColor(c.value)}
                        className={`w-7 h-7 rounded-full ${c.dot} transition-all ${customColor === c.value ? "ring-2 ring-primary ring-offset-2 ring-offset-card scale-110" : "opacity-60 hover:opacity-100"}`}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Personality Traits */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Personality Traits</label>
                  <div className="space-y-4 pt-2">
                    {[
                      { key: "empathy" as const, label: "Empathy", desc: "How well they understand others' feelings" },
                      { key: "ambition" as const, label: "Ambition", desc: "Drive to achieve and succeed" },
                      { key: "stressTolerance" as const, label: "Stress Tolerance", desc: "Ability to handle pressure" },
                      { key: "agreeableness" as const, label: "Agreeableness", desc: "Tendency to cooperate and comply" },
                      { key: "assertiveness" as const, label: "Assertiveness", desc: "Willingness to speak up and lead" },
                    ].map((trait) => (
                      <div key={trait.key} className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-sm font-medium">{trait.label}</span>
                            <p className="text-[10px] text-muted-foreground">{trait.desc}</p>
                          </div>
                          <span className="text-sm font-bold text-primary w-8 text-right">{customPersonality[trait.key]}</span>
                        </div>
                        <Slider
                          value={customPersonality[trait.key]}
                          onValueChange={(val) => setCustomPersonality({ ...customPersonality, [trait.key]: val as number })}
                          max={100}
                          min={0}
                          step={5}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Motivation & Expertise */}
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Motivation</label>
                  <Textarea
                    placeholder="e.g. Wants to prove themselves after a failed project..."
                    value={customMotivation}
                    onChange={(e) => setCustomMotivation(e.target.value)}
                    className="min-h-[60px] bg-background/50 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Expertise / Skills</label>
                  <Input
                    placeholder="e.g. React, System Design, Team Management"
                    value={customExpertise}
                    onChange={(e) => setCustomExpertise(e.target.value)}
                    className="bg-background/50"
                  />
                </div>

                <Separator />

                {/* LLM Model Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                    <Cpu className="w-3 h-3" /> AI Model (Optional)
                  </label>
                  <p className="text-[10px] text-muted-foreground">Assign a specific AI model to this agent via OpenRouter. Leave as &quot;Default&quot; to use the global provider.</p>
                  <Select value={customModel} onValueChange={(val) => { setCustomModel(val || ""); if (val !== "__custom__") setCustomModelInput(""); }}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Default (Global Provider)" />
                    </SelectTrigger>
                    <SelectContent>
                      {POPULAR_MODELS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {customModel === "__custom__" && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="pt-1">
                      <Input
                        placeholder="e.g. anthropic/claude-3.7-sonnet"
                        value={customModelInput}
                        onChange={(e) => setCustomModelInput(e.target.value)}
                        className="bg-background/50 font-mono text-xs"
                      />
                      <p className="text-[10px] text-muted-foreground mt-1">Browse models at <a href="https://openrouter.ai/models" target="_blank" rel="noopener" className="text-primary hover:underline">openrouter.ai/models</a></p>
                    </motion.div>
                  )}
                </div>

                {/* Radar Preview */}
                <div className="flex justify-center pt-2">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-2">Personality Preview</p>
                    <RadarChart
                      size={160}
                      data={[
                        { label: "EMP", value: customPersonality.empathy },
                        { label: "AMB", value: customPersonality.ambition },
                        { label: "RES", value: customPersonality.stressTolerance },
                        { label: "AGR", value: customPersonality.agreeableness },
                        { label: "ASR", value: customPersonality.assertiveness },
                      ]}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setShowCreateModal(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleSaveAgent}
                    disabled={!customName.trim() || !customRole.trim() || !customType.trim()}
                  >
                    {editingAgent ? "Save Changes" : "Add to Roster"}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
