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
      "User sends a request from browser or app.\nThis starts the entire backend and AI processing flow.",
    active: ["client"],
    direction: "down",
  },
  {
    title: "DNS Resolve",
    detail:
      "Domain name is converted into IP address.\nThis allows the request to reach the correct server.",
    active: ["dns"],
    direction: "down",
  },
  {
    title: "Load Balancer",
    detail:
      "Traffic is distributed across multiple backend servers.\nPrevents overload and improves scalability.",
    active: ["lb"],
    direction: "down",
  },
  {
    title: "Gateway",
    detail:
      "Handles authentication, routing, and security checks.\nThen forwards request to backend service.",
    active: ["gateway"],
    direction: "down",
  },
  {
    title: "Service Layer",
    detail:
      "Core decision point of backend.\nDecides whether to query database or use RAG pipeline.",
    active: ["service"],
    direction: "down",
  },

  // 🔥 RAG
  {
    title: "Embedding",
    detail:
      "User query is converted into vector representation.\nThis allows semantic similarity search instead of exact matching.",
    active: ["embedding"],
    direction: "down",
  },
  {
    title: "Vector DB",
    detail:
      "Searches for similar data using vector distance.\nReturns top relevant chunks instead of exact matches.",
    active: ["vectordb"],
    direction: "down",
  },
  {
    title: "Check Results",
    detail:
      "System evaluates relevance of retrieved data.\nLow similarity means risk of hallucination.",
    active: ["check"],
    direction: "down",
  },
  {
    title: "Retry",
    detail:
      "If results are weak, system retries retrieval.\nIt may increase Top-K or refine query.",
    active: ["retry"],
    direction: "down",
  },
  {
    title: "LLM Processing",
    detail:
      "LLM receives question + retrieved context.\nGenerates response grounded in real data.",
    active: ["llm"],
    direction: "down",
  },

  {
    title: "Response",
    detail:
      "Final answer is returned to backend.\nThen sent back to user through gateway and load balancer.",
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
