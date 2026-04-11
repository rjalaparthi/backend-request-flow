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

/* 🔥 BACKEND + RAG FLOW */
const steps = [
  {
    title: "Client Request",
    detail:
      "User asks a question.\nLike asking: 'What happened to my claim?'",
    active: ["client"],
    direction: "down",
  },
  {
    title: "DNS",
    detail:
      "Internet finds where the website lives.\nLike finding an address before going there.",
    active: ["dns"],
    direction: "down",
  },
  {
    title: "Load Balancer",
    detail:
      "Chooses which server should handle the request.\nLike picking the shortest queue in a store.",
    active: ["lb"],
    direction: "down",
  },
  {
    title: "Gateway",
    detail:
      "Checks if the request is allowed.\nLike a security guard at the entrance.",
    active: ["gateway"],
    direction: "down",
  },
  {
    title: "Backend",
    detail:
      "Main system receives the request.\nThis is where actual work starts.",
    active: ["backend"],
    direction: "down",
  },
  {
    title: "Controller",
    detail:
      "Decides which function to run.\nLike choosing which team should handle the task.",
    active: ["controller"],
    direction: "down",
  },
  {
    title: "Service",
    detail:
      "This is the brain of the system.\nIt decides what to do next.",
    active: ["service"],
    direction: "down",
  },

  // 🔥 RAG
  {
    title: "Embedding",
    detail:
      "Turns the question into numbers.\nSo computer can understand meaning, not just words.",
    active: ["embedding"],
    direction: "down",
  },
  {
    title: "Vector DB",
    detail:
      "Finds similar information.\nLike searching for similar stories, not exact words.",
    active: ["vectordb"],
    direction: "down",
  },
  {
    title: "Check Results",
    detail:
      "System checks if the data makes sense.\nIf not, it should not guess.",
    active: ["check"],
    direction: "down",
  },
  {
    title: "Retry",
    detail:
      "If data is weak, system tries again.\nLike asking the question in a better way.",
    active: ["retry"],
    direction: "down",
  },
  {
    title: "LLM",
    detail:
      "AI reads the data and writes an answer.\nLike a smart assistant answering using notes.",
    active: ["llm"],
    direction: "down",
  },

  {
    title: "Response",
    detail:
      "Answer goes back to user.\nUser sees the result on screen.",
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
        <h1>AI Backend Request Flow</h1>

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

<Node label="Embedding" active={activeSet.has("embedding")} direction={current.direction} />
<Node label="Vector DB" active={activeSet.has("vectordb")} direction={current.direction} />

<Node label="Check" active={activeSet.has("check")} direction={current.direction} />

<Node label="⚠️ Low Confidence" active={activeSet.has("warning")} direction={current.direction} />
<Node label="🔁 Retry" active={activeSet.has("retry")} direction={current.direction} />

<Node label="LLM" active={activeSet.has("llm")} direction={current.direction} />

<Node label="✅ Success" active={activeSet.has("success")} direction={current.direction} />
<Node label="🚫 Fallback" active={activeSet.has("fallback")} direction={current.direction} />
      </div>
    </div>
  );
}
