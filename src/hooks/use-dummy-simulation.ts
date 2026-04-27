"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type {
  Agent, SimMessage, Metrics, WorldState, DecisionStatus,
  MetricsSnapshot, SimulationOutcome,
} from "@/app/simulation/types";
import { DEFAULT_METRICS } from "@/app/simulation/types";

// ─── Dummy Agents ─────────────────────────────────────────────
const DUMMY_AGENTS: Agent[] = [
  { id: "a1", name: "Pak Budi (Petani)", morale: 70, stress: 25, loyalty: 72, productivity: 75, initials: "PB" },
  { id: "a2", name: "Bu Siti (UMKM)", morale: 75, stress: 20, loyalty: 78, productivity: 80, initials: "BS" },
  { id: "a3", name: "Andi (Pemuda)", morale: 65, stress: 30, loyalty: 60, productivity: 70, initials: "AN" },
  { id: "a4", name: "Mbah Yoso (Sesepuh)", morale: 80, stress: 15, loyalty: 85, productivity: 65, initials: "MY" },
  { id: "a5", name: "Ibu Dewi (PKK)", morale: 72, stress: 22, loyalty: 70, productivity: 78, initials: "ID" },
];

// ─── Script: Messages per round ───────────────────────────────
interface ScriptMessage {
  round: number;
  agent_name: string;
  type: "system" | "agent" | "intervention";
  content: string;
  thought?: string;
  state_changes?: { morale?: number; stress?: number; loyalty?: number; productivity?: number };
}

const SCRIPT: ScriptMessage[] = [
  // Round 1
  { round: 1, agent_name: "Sistem", type: "system", content: "📋 Kebijakan diusulkan: **Pemotongan Bantuan Langsung Tunai (BLT) sebesar 30%** untuk dialihkan ke pembangunan jalan desa. Musyawarah dimulai." },
  { round: 1, agent_name: "Pak Budi (Petani)", type: "agent", content: "Saya keberatan keras! BLT itu sumber penghidupan kami di musim paceklik. Kalau dipotong 30%, bagaimana keluarga petani bisa bertahan? Jalan bagus tapi perut kosong, buat apa?", thought: "Merasa terancam karena BLT adalah safety net utama keluarga petani", state_changes: { morale: -8, stress: 12 } },
  { round: 1, agent_name: "Bu Siti (UMKM)", type: "agent", content: "Saya mengerti kekhawatiran Pak Budi. Tapi jalan yang bagus bisa membuka akses pasar yang lebih luas untuk produk UMKM kita. Mungkin kita cari jalan tengah?", thought: "Melihat peluang bisnis tapi empati terhadap sesama warga", state_changes: { morale: -3, stress: 5 } },
  { round: 1, agent_name: "Andi (Pemuda)", type: "agent", content: "Menurut saya, daripada potong BLT, kenapa tidak cari sumber anggaran lain? Banyak pos yang bisa dihemat. BLT itu hak warga, bukan variabel yang bisa dipotong seenaknya.", thought: "Vokal dan idealis, merasa aparatur desa tidak kreatif", state_changes: { morale: -5, stress: 8 } },

  // Round 2
  { round: 2, agent_name: "Mbah Yoso (Sesepuh)", type: "agent", content: "Anak-anak, dengarkan. Dulu kita bangun desa ini tanpa bantuan siapapun. Tapi zaman sudah berubah. Yang tua butuh BLT, yang muda butuh jalan. Kenapa tidak potong 15% saja, sisanya cari dana dari provinsi?", thought: "Berusaha menjadi penengah dengan solusi kompromi", state_changes: { morale: 2, stress: -3 } },
  { round: 2, agent_name: "Ibu Dewi (PKK)", type: "agent", content: "Saya setuju dengan Mbah Yoso. Ibu-ibu di PKK sudah menghitung — kalau BLT dipotong 30%, ada 12 keluarga yang anaknya terancam putus sekolah. Ini data riil, bukan asumsi.", thought: "Berbasis data dari lapangan, khawatir dampak ke anak-anak", state_changes: { morale: -4, stress: 6 } },
  { round: 2, agent_name: "Pak Budi (Petani)", type: "agent", content: "Nah itu dia! Ibu Dewi sudah menghitung. 12 keluarga, Pak Kades! Apa Bapak siap tanggung jawab kalau anak-anak putus sekolah gara-gara kebijakan ini?", thought: "Semakin emosional, menggunakan data Ibu Dewi untuk memperkuat argumen", state_changes: { morale: -6, stress: 10 } },

  // Round 3
  { round: 3, agent_name: "Sistem", type: "system", content: "⚠️ Tingkat ketegangan meningkat. Indikator konflik naik dari 25% ke 48%." },
  { round: 3, agent_name: "Bu Siti (UMKM)", type: "agent", content: "Bagaimana kalau begini: BLT dipotong 15% seperti usul Mbah Yoso, tapi kami pelaku UMKM bersedia membuat program magang berbayar untuk pemuda desa. Jadi ada kompensasi ekonomi.", thought: "Mencoba menawarkan solusi win-win dari sisi bisnis", state_changes: { morale: 3, stress: -2 } },
  { round: 3, agent_name: "Andi (Pemuda)", type: "agent", content: "Wah, ide Bu Siti menarik! Kalau ada program magang, setidaknya kami pemuda bisa dapat skill dan penghasilan tambahan. Tapi tetap, pemotongan BLT harus minimal.", thought: "Mulai terbuka karena ada peluang untuk pemuda", state_changes: { morale: 5, stress: -4 } },

  // Round 4
  { round: 4, agent_name: "Mbah Yoso (Sesepuh)", type: "agent", content: "Bagus, Bu Siti. Itu baru namanya gotong royong. Desa kita kuat karena saling bantu, bukan karena uang pemerintah saja. Saya dukung proposal 15% dengan program magang.", thought: "Senang melihat semangat gotong royong muncul kembali", state_changes: { morale: 5, stress: -5 } },
  { round: 4, agent_name: "Pak Budi (Petani)", type: "agent", content: "Hmm... 15% masih berat, tapi kalau ada jaminan keluarga miskin tidak dipotong sama sekali, saya bisa terima. Prioritaskan perlindungan untuk yang paling lemah.", thought: "Mulai lunak tapi masih berjuang untuk kelompoknya", state_changes: { morale: 2, stress: -3 } },
  { round: 4, agent_name: "Ibu Dewi (PKK)", type: "agent", content: "Saya usulkan: keluarga dengan penghasilan di bawah Rp 1 juta/bulan tetap dapat BLT penuh. Yang di atas itu, baru dipotong 15%. Ini lebih adil.", thought: "Mengusulkan kebijakan progresif berbasis data ekonomi", state_changes: { morale: 4, stress: -2 } },

  // Round 5
  { round: 5, agent_name: "Sistem", type: "system", content: "📊 Dinamika berubah. Usulan pemotongan progresif (15% hanya untuk warga mampu) mendapat dukungan dari 4 agen. Tingkat konflik turun ke 35%." },
  { round: 5, agent_name: "Bu Siti (UMKM)", type: "agent", content: "Saya juga bersedia menyumbang 2% keuntungan BUMDes untuk dana pendidikan anak. Anggap saja CSR skala desa. Ini lebih baik daripada kita terus berdebat.", thought: "Mengambil inisiatif sosial sebagai bentuk tanggung jawab pengusaha", state_changes: { morale: 6, stress: -5 } },
  { round: 5, agent_name: "Andi (Pemuda)", type: "agent", content: "Keren Bu Siti! Kalau UMKM bantu, kami pemuda siap jadi relawan untuk sosialisasi program ke warga. Kita bikin gerakan bersama, bukan cuma tunggu pemerintah.", thought: "Antusias dan mulai merasa dilibatkan dalam solusi", state_changes: { morale: 8, stress: -6 } },

  // Round 6
  { round: 6, agent_name: "Pak Budi (Petani)", type: "agent", content: "Ya sudah, saya ikut. Tapi tolong dicatat — ini komitmen bersama. Kalau tahun depan keluarga miskin malah makin susah, kita harus evaluasi lagi. Jangan cuma omong kosong.", thought: "Akhirnya menerima tapi tetap waspada dan menuntut akuntabilitas", state_changes: { morale: 5, stress: -4 } },
  { round: 6, agent_name: "Mbah Yoso (Sesepuh)", type: "agent", content: "Alhamdulillah, ini baru namanya musyawarah mufakat. Pak Kades, catat semua kesepakatan ini. Biar tidak ada yang ingkar janji.", thought: "Puas karena proses demokrasi desa berjalan baik", state_changes: { morale: 8, stress: -8 } },

  // Round 7
  { round: 7, agent_name: "Sistem", type: "system", content: "✅ Keputusan mufakat tercapai: Pemotongan BLT 15% (hanya untuk warga mampu), program magang UMKM, dan dana pendidikan dari CSR BUMDes. Konflik turun ke 18%." },
  { round: 7, agent_name: "Ibu Dewi (PKK)", type: "agent", content: "Saya akan koordinasi dengan PKK untuk data penerima BLT yang akurat. Tidak boleh ada salah sasaran. Terima kasih semuanya sudah mau berdiskusi dengan baik.", thought: "Lega dan langsung berpikir soal implementasi", state_changes: { morale: 7, stress: -6 } },
  { round: 7, agent_name: "Bu Siti (UMKM)", type: "agent", content: "Mari kita buktikan bahwa desa kita bisa membuat kebijakan yang cerdas. Saya optimis tahun depan kita semua lebih sejahtera. 💪", thought: "Optimis dan bangga dengan hasil musyawarah", state_changes: { morale: 5, stress: -3 } },
];

// ─── Metrics evolution per round ──────────────────────────────
const METRICS_PER_ROUND: Metrics[] = [
  { avgMorale: 70, avgStress: 25, productivity: 75, resignations: 0, avgLoyalty: 72, teamCohesion: 70 },
  { avgMorale: 58, avgStress: 42, productivity: 65, resignations: 0, avgLoyalty: 62, teamCohesion: 55 },
  { avgMorale: 52, avgStress: 48, productivity: 60, resignations: 0, avgLoyalty: 58, teamCohesion: 50 },
  { avgMorale: 58, avgStress: 40, productivity: 65, resignations: 0, avgLoyalty: 62, teamCohesion: 58 },
  { avgMorale: 65, avgStress: 32, productivity: 72, resignations: 0, avgLoyalty: 68, teamCohesion: 65 },
  { avgMorale: 72, avgStress: 25, productivity: 78, resignations: 0, avgLoyalty: 75, teamCohesion: 72 },
  { avgMorale: 78, avgStress: 20, productivity: 82, resignations: 0, avgLoyalty: 80, teamCohesion: 78 },
  { avgMorale: 82, avgStress: 18, productivity: 85, resignations: 0, avgLoyalty: 82, teamCohesion: 82 },
];

const WORLD_STATES: WorldState[] = [
  { budgetRemaining: 100, customerSatisfaction: 70, companyReputation: 75, teamCapacity: 100, technicalDebt: 20, deadlineWeeksLeft: 7 },
  { budgetRemaining: 92, customerSatisfaction: 55, companyReputation: 65, teamCapacity: 95, technicalDebt: 35, deadlineWeeksLeft: 6 },
  { budgetRemaining: 85, customerSatisfaction: 50, companyReputation: 58, teamCapacity: 90, technicalDebt: 42, deadlineWeeksLeft: 5 },
  { budgetRemaining: 78, customerSatisfaction: 55, companyReputation: 62, teamCapacity: 92, technicalDebt: 38, deadlineWeeksLeft: 4 },
  { budgetRemaining: 70, customerSatisfaction: 65, companyReputation: 70, teamCapacity: 95, technicalDebt: 30, deadlineWeeksLeft: 3 },
  { budgetRemaining: 62, customerSatisfaction: 72, companyReputation: 76, teamCapacity: 98, technicalDebt: 22, deadlineWeeksLeft: 2 },
  { budgetRemaining: 55, customerSatisfaction: 80, companyReputation: 82, teamCapacity: 100, technicalDebt: 15, deadlineWeeksLeft: 1 },
  { budgetRemaining: 50, customerSatisfaction: 85, companyReputation: 85, teamCapacity: 100, technicalDebt: 12, deadlineWeeksLeft: 0 },
];

const FINAL_OUTCOME: SimulationOutcome = {
  emoji: "🤝",
  title: "Musyawarah Mufakat Tercapai",
  description: "Warga desa berhasil mencapai kesepakatan melalui diskusi yang konstruktif. Kebijakan direvisi menjadi lebih adil dengan pemotongan progresif dan program kompensasi.",
};

// ─── Hook ─────────────────────────────────────────────────────
export function useDummySimulation(soundEnabled: boolean) {
  const [agents, setAgents] = useState<Agent[]>(DUMMY_AGENTS.map(a => ({ ...a })));
  const [messages, setMessages] = useState<SimMessage[]>([]);
  const [metrics, setMetrics] = useState<Metrics>(METRICS_PER_ROUND[0]);
  const [prevMetrics, setPrevMetrics] = useState<Metrics | null>(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [status, setStatus] = useState("running");
  const [isTyping, setIsTyping] = useState(true);
  const [typingAgent, setTypingAgent] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("Desa Sukamakmur");
  const [agentMap, setAgentMap] = useState<Record<string, string>>({});
  const [worldState, setWorldState] = useState<WorldState>(WORLD_STATES[0]);
  const [decisionStatus, setDecisionStatus] = useState<DecisionStatus | null>(null);
  const [metricsHistory, setMetricsHistory] = useState<MetricsSnapshot[]>([]);
  const [outcome, setOutcome] = useState<SimulationOutcome | null>(null);

  const scriptIdx = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const totalRounds = 7;

  // Apply state changes to agents
  const applyChanges = useCallback((agentName: string, changes?: ScriptMessage["state_changes"]) => {
    if (!changes) return;
    setAgents(prev => prev.map(a => {
      if (!a.name.includes(agentName.split(" (")[0])) return a;
      return {
        ...a,
        morale: Math.max(5, Math.min(100, a.morale + (changes.morale || 0))),
        stress: Math.max(0, Math.min(100, a.stress + (changes.stress || 0))),
      };
    }));
  }, []);

  // Auto-play messages
  useEffect(() => {
    let currentAgentMap: Record<string, string> = {};
    const savedAgentsStr = sessionStorage.getItem("demo_agents");
    if (savedAgentsStr) {
      try {
        const savedAgents = JSON.parse(savedAgentsStr);
        if (savedAgents && savedAgents.length > 0) {
          const mappedAgents = savedAgents.map((sa: any) => ({
            id: sa.id,
            name: `${sa.name} (${sa.role})`,
            morale: 70 + Math.floor(Math.random() * 10),
            stress: 20 + Math.floor(Math.random() * 10),
            loyalty: 70 + Math.floor(Math.random() * 10),
            productivity: 75 + Math.floor(Math.random() * 10),
            initials: sa.name.substring(0, 2).toUpperCase(),
          }));
          setAgents(mappedAgents);
          
          DUMMY_AGENTS.forEach((da, i) => {
            currentAgentMap[da.name] = mappedAgents[i] ? mappedAgents[i].name : mappedAgents[Math.floor(Math.random() * mappedAgents.length)].name;
          });
          setAgentMap(currentAgentMap);
        }
      } catch (e) {
        console.error("Failed to parse demo agents", e);
      }
    }
    const savedCompany = sessionStorage.getItem("demo_company");
    if (savedCompany) setCompanyName(savedCompany);

    function playNext() {
      if (scriptIdx.current >= SCRIPT.length) {
        // Simulation complete
        setTimeout(() => {
          setIsTyping(false);
          setTypingAgent(null);
          setStatus("completed");
          setOutcome(FINAL_OUTCOME);
          setPrevMetrics(METRICS_PER_ROUND[6]);
          setMetrics(METRICS_PER_ROUND[7]);
          setWorldState(WORLD_STATES[7]);
          const finalHistory: MetricsSnapshot[] = METRICS_PER_ROUND.map((m, i) => ({
            round: i, morale: m.avgMorale, stress: m.avgStress,
            productivity: m.productivity, loyalty: m.avgLoyalty, cohesion: m.teamCohesion,
          }));
          setMetricsHistory(finalHistory);
        }, 1500);
        return;
      }

      const msg = SCRIPT[scriptIdx.current];
      const mappedAgentName = msg.type === "agent" ? (currentAgentMap[msg.agent_name] || msg.agent_name) : msg.agent_name;

      // Show typing indicator first
      setIsTyping(true);
      setTypingAgent(msg.type === "system" ? null : mappedAgentName);

      const typingDelay = msg.type === "system" ? 800 : 1500 + Math.random() * 1500;

      timerRef.current = setTimeout(() => {
        const simMsg: SimMessage = {
          id: scriptIdx.current + 1,
          round: msg.round,
          agent_name: mappedAgentName,
          agent: mappedAgentName,
          type: msg.type,
          content: msg.content,
          thought: msg.thought,
          state_changes: msg.state_changes,
        };

        setMessages(prev => [...prev, simMsg]);
        setCurrentRound(msg.round);

        // Update metrics for this round
        const roundMetrics = METRICS_PER_ROUND[Math.min(msg.round, METRICS_PER_ROUND.length - 1)];
        setPrevMetrics(metrics);
        setMetrics(roundMetrics);
        setWorldState(WORLD_STATES[Math.min(msg.round, WORLD_STATES.length - 1)]);

        // Apply agent state changes
        if (msg.state_changes && msg.type === "agent") {
          applyChanges(mappedAgentName, msg.state_changes);
        }

        // Update decision status
        if (msg.round >= 5) {
          setDecisionStatus({
            proposalCount: 3,
            hasDecision: msg.round >= 7,
            decidedProposal: msg.round >= 7 ? "Pemotongan BLT 15% progresif + program magang UMKM" : null,
            leadingProposal: "Pemotongan progresif 15% untuk warga mampu",
            leadingSupport: Math.min(3, 1 + msg.round * 0.4),
            escalationCount: 0,
            resignThreats: msg.round < 4 ? 1 : 0,
          });
        }

        // Update metrics history
        setMetricsHistory(prev => {
          const exists = prev.find(h => h.round === msg.round);
          if (exists) return prev;
          return [...prev, {
            round: msg.round, morale: roundMetrics.avgMorale, stress: roundMetrics.avgStress,
            productivity: roundMetrics.productivity, loyalty: roundMetrics.avgLoyalty, cohesion: roundMetrics.teamCohesion,
          }];
        });

        scriptIdx.current += 1;
        setIsTyping(false);
        setTypingAgent(null);

        // Schedule next message
        const nextDelay = 800 + Math.random() * 1200;
        timerRef.current = setTimeout(playNext, nextDelay);
      }, typingDelay);
    }

    // Start after a short initial delay
    timerRef.current = setTimeout(playNext, 2000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const sendIntervention = useCallback((type: string, customMsg?: string) => {
    const interventionMsg: SimMessage = {
      id: Date.now(),
      round: currentRound,
      agent_name: "Kepala Desa",
      agent: "Kepala Desa",
      type: "intervention",
      content: customMsg || `[Intervensi: ${type}]`,
    };
    setMessages(prev => [...prev, interventionMsg]);
  }, [currentRound]);

  return {
    agents,
    messages,
    metrics,
    prevMetrics,
    currentRound,
    totalRounds,
    status,
    companyName,
    isConnected: true,
    isTyping,
    typingAgent,
    connectionError: null,
    worldState,
    decisionStatus,
    metricsHistory,
    outcome,
    sendIntervention,
    sendInterventionRest: async () => {},
  };
}
