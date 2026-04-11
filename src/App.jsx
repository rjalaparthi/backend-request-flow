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
  { title: "Client Request", detail: "User sends request", active: ["client"], direction: "down" },
  { title: "DNS Resolve", detail: "Domain to IP", active: ["dns"], direction: "down" },
  { title: "Load Balancer", detail: "Routes traffic", active: ["lb"], direction: "down" },
  { title: "Gateway", detail: "Auth + routing", active: ["gateway"], direction: "down" },
  { title: "Backend", detail: "Receives request", active: ["backend"], direction: "down" },
  { title: "Controller", detail: "Maps endpoint", active: ["controller"], direction: "down" },
  { title: "Service Layer", detail: "Business logic starts", active: ["service"], direction: "down" },

  /* 🔥 RAG STARTS */
  { title: "Embedding", detail: "Convert query to vector", active: ["embedding"], direction: "down" },
  { title: "Vector DB Search", detail: "Find similar data", active: ["vectordb"], direction: "down" },
  { title: "LLM Processing", detail: "Generate answer", active: ["llm"], direction: "down" },

  /* 🔥 RESPONSE */
  { title: "LLM Response", detail: "AI generates output", active: ["llm"], direction: "up" },
  { title: "Service builds response", active: ["service"], direction: "up" },
  { title: "Controller returns", active: ["controller"], direction: "up" },
  { title: "Gateway returns", active: ["gateway"], direction: "up" },
  { title: "Load Balancer returns", active: ["lb"], direction: "up" },
  { title: "Client receives response", active: ["client"], direction: "up" },
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

        {/* 🔥 RAG */}
        <Node label="Embedding" active={activeSet.has("embedding")} direction={current.direction} />
        <Node label="Vector DB" active={activeSet.has("vectordb")} direction={current.direction} />
        <Node label="LLM" active={activeSet.has("llm")} direction={current.direction} />
      </div>
    </div>
  );
}
