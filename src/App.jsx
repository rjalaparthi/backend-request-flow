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
  { title: "Client Request", detail: "User asks question", active: ["client"], direction: "down" },
  { title: "Service Layer", detail: "Backend processes request", active: ["service"], direction: "down" },

  // 🔥 RAG
  { title: "Embedding", detail: "Convert query to vector", active: ["embedding"], direction: "down" },
  { title: "Vector DB Search", detail: "Find similar data (Top 3)", active: ["vectordb"], direction: "down" },

  { title: "Check Results", detail: "Are results relevant?", active: ["check"], direction: "down" },

  // 🔥 CONDITION
  {
    title: "Low Confidence ⚠️",
    detail: "Weak match → risk of hallucination",
    active: ["warning"],
    direction: "down",
  },
  {
    title: "Retry Retrieval 🔁",
    detail: "Increase Top-K or refine query",
    active: ["retry"],
    direction: "down",
  },

  {
    title: "LLM Processing",
    detail: "Generate answer using context",
    active: ["llm"],
    direction: "down",
  },

  // 🔥 RESPONSE
  {
    title: "Grounded Response ✅",
    detail: "Answer backed by retrieved data",
    active: ["success"],
    direction: "up",
  },
  {
    title: "Fallback 🚫",
    detail: "No data → return safe response",
    active: ["fallback"],
    direction: "up",
  },
  {
    title: "Client Response",
    detail: "User receives final answer",
    active: ["client"],
    direction: "up",
  },
];
function Node({ label, active, direction }) {
  return (
    <motion.div
      className={`node ${active ? direction : ""}`}
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
        <p>{current.detail}</p>

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

{/* 🔥 RAG PIPELINE */}
<Node label="Embedding" active={activeSet.has("embedding")} direction={current.direction} />
<Node label="Vector DB" active={activeSet.has("vectordb")} direction={current.direction} />

{/* 🔍 DECISION */}
<Node label="Check Results" active={activeSet.has("check")} direction={current.direction} />

{/* ⚠️ FAILURE PATH */}
<Node label="⚠️ Low Confidence" active={activeSet.has("warning")} direction={current.direction} />
<Node label="🔁 Retry" active={activeSet.has("retry")} direction={current.direction} />

{/* 🤖 AI */}
<Node label="LLM" active={activeSet.has("llm")} direction={current.direction} />

{/* ✅ / 🚫 RESPONSE */}
<Node label="✅ Success" active={activeSet.has("success")} direction={current.direction} />
<Node label="🚫 Fallback" active={activeSet.has("fallback")} direction={current.direction} />
      </div>
    </div>
  );
}
