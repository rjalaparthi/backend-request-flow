import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import "./styles.css";

/* 🔥 HYBRID CLAIMS SYSTEM (DB + RAG) */
const steps = [
  {
    title: "Client Request",
    detail:
      "User requests claim details (e.g., claim ID 123).\nThis starts backend processing.",
    active: ["client"],
    direction: "down",
  },
  {
    title: "DNS",
    detail:
      "Resolves domain to IP address.\nEnsures request reaches correct server.",
    active: ["dns"],
    direction: "down",
  },
  {
    title: "Load Balancer",
    detail:
      "Distributes traffic across servers.\nPrevents overload and improves performance.",
    active: ["lb"],
    direction: "down",
  },
  {
    title: "Gateway",
    detail:
      "Handles authentication and routing.\nEnsures secure access.",
    active: ["gateway"],
    direction: "down",
  },
  {
    title: "Backend",
    detail:
      "Receives request and starts processing.\nBusiness logic begins here.",
    active: ["backend"],
    direction: "down",
  },
  {
    title: "Controller",
    detail:
      "Maps API endpoint.\nValidates request before passing to service.",
    active: ["controller"],
    direction: "down",
  },
  {
    title: "Service",
    detail:
      "Core logic layer.\nFetches claim data from database first.",
    active: ["service"],
    direction: "down",
  },

  // 🔥 DB FIRST (SOURCE OF TRUTH)
  {
    title: "Database Query",
    detail:
      "Executes SQL query to fetch claim details.\nThis is the most accurate source of data.",
    active: ["db"],
    direction: "down",
  },
  {
    title: "DB Result",
    detail:
      "Returns structured claim data (status, codes).\nThis is the system of record.",
    active: ["db_success"],
    direction: "down",
  },

  // 🔥 RAG AUGMENTATION (NOT REPLACEMENT)
  {
    title: "Need Explanation?",
    detail:
      "Check if user needs explanation.\nExample: 'Why was claim denied?'",
    active: ["rag_start"],
    direction: "down",
  },
  {
    title: "Embedding",
    detail:
      "Convert query into vector format.\nHelps understand meaning instead of keywords.",
    active: ["embedding"],
    direction: "down",
  },
  {
    title: "Vector DB",
    detail:
      "Search policies or similar claims.\nFinds relevant context for explanation.",
    active: ["vectordb"],
    direction: "down",
  },
  {
    title: "LLM",
    detail:
      "Generates explanation using context.\nCombines DB data with knowledge.",
    active: ["llm"],
    direction: "down",
  },

  {
    title: "Enriched Response",
    detail:
      "Combines DB result + AI explanation.\nProvides accurate and human-readable output.",
    active: ["success"],
    direction: "up",
  },

  // 🔥 RESPONSE FLOW
  {
    title: "Service Response",
    detail:
      "Formats final response.\nEnsures correctness and consistency.",
    active: ["service"],
    direction: "up",
  },
  {
    title: "Controller",
    detail:
      "Converts response into JSON.\nFrontend understands this format.",
    active: ["controller"],
    direction: "up",
  },
  {
    title: "Gateway",
    detail:
      "Applies security checks.\nEnsures safe response delivery.",
    active: ["gateway"],
    direction: "up",
  },
  {
    title: "Load Balancer",
    detail:
      "Routes response to correct client.\nMaintains reliability.",
    active: ["lb"],
    direction: "up",
  },
  {
    title: "Client",
    detail:
      "User sees claim result + explanation.\nDisplayed in UI.",
    active: ["client"],
    direction: "up",
  },
];

function Node({ label, active, direction, type }) {
  return (
    <motion.div
      className={`node ${active ? direction : ""} ${active && type ? type : ""}`}
      animate={active ? { scale: 1.05 } : { scale: 1 }}
    >
      {label}
    </motion.div>
  );
}

export default function App() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setStep((s) => (s + 1) % steps.length);
    }, 1800);
    return () => clearInterval(t);
  }, [playing]);

  const current = steps[step];

  const activeSet = useMemo(() => {
    const visited = new Set();

    if (current.direction === "down") {
      for (let i = 0; i <= step; i++) {
        steps[i].active.forEach((a) => visited.add(a));
      }
    } else {
      for (let i = step; i < steps.length; i++) {
        steps[i].active.forEach((a) => visited.add(a));
      }
    }

    return visited;
  }, [step, current.direction]);

  return (
    <div className="layout">
      {/* LEFT PANEL */}
      <div className="left">
        <h1>Claims Backend + RAG Flow</h1>

        <h2>
          Step {step + 1} —{" "}
          {current.direction === "down"
            ? "⬇️ Request Flow"
            : "⬆️ Response Flow"}
        </h2>

        <h3>{current.title}</h3>

        <p style={{ whiteSpace: "pre-line" }}>
          {current.detail}
        </p>

        <div className="buttons">
          <button onClick={() => setStep((s) => (s - 1 + steps.length) % steps.length)}>
            <ChevronLeft /> Prev
          </button>

          <button onClick={() => setPlaying((p) => !p)}>
            {playing ? <Pause /> : <Play />}
            {playing ? "Pause" : "Play"}
          </button>

          <button onClick={() => setStep((s) => (s + 1) % steps.length)}>
            Next <ChevronRight />
          </button>

          <button
            onClick={() => {
              setPlaying(false);
              setStep(0);
            }}
          >
            <RotateCcw /> Reset
          </button>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="right">
        <Node label="Client" active={activeSet.has("client")} direction={current.direction} />
        <Node label="DNS" active={activeSet.has("dns")} direction={current.direction} />
        <Node label="Load Balancer" active={activeSet.has("lb")} direction={current.direction} />
        <Node label="Gateway" active={activeSet.has("gateway")} direction={current.direction} />
        <Node label="Backend" active={activeSet.has("backend")} direction={current.direction} />
        <Node label="Controller" active={activeSet.has("controller")} direction={current.direction} />
        <Node label="Service" active={activeSet.has("service")} direction={current.direction} />

        {/* DB */}
        <Node label="Database" active={activeSet.has("db")} direction={current.direction} />
        <Node label="DB Result" active={activeSet.has("db_success")} type="db_success" direction={current.direction} />

        {/* RAG */}
        <Node label="Need Explanation" active={activeSet.has("rag_start")} type="rag_start" direction={current.direction} />
        <Node label="Embedding" active={activeSet.has("embedding")} direction={current.direction} />
        <Node label="Vector DB" active={activeSet.has("vectordb")} direction={current.direction} />
        <Node label="LLM" active={activeSet.has("llm")} direction={current.direction} />

        <Node label="Enriched Response" active={activeSet.has("success")} direction={current.direction} />
      </div>
    </div>
  );
}
