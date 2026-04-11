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
  { title: "Client Request", detail: "User sends request from browser or app", active: ["client"], direction: "down" },
  { title: "DNS Resolve", detail: "Domain is converted into IP address", active: ["dns"], direction: "down" },
  { title: "Load Balancer", detail: "Distributes traffic across backend servers", active: ["lb"], direction: "down" },
  { title: "Gateway", detail: "Handles auth, routing, and forwards request", active: ["gateway"], direction: "down" },
  { title: "Backend", detail: "Application receives and processes request", active: ["backend"], direction: "down" },
  { title: "Controller", detail: "Maps API endpoint and forwards to service", active: ["controller"], direction: "down" },
  { title: "Service Layer", detail: "Business logic starts here", active: ["service"], direction: "down" },

  // 🔥 RAG
  { title: "Embedding", detail: "Convert user query into vector representation", active: ["embedding"], direction: "down" },
  { title: "Vector DB", detail: "Find similar data using semantic search", active: ["vectordb"], direction: "down" },
  { title: "LLM Processing", detail: "Generate answer using context + question", active: ["llm"], direction: "down" },

  // 🔥 RESPONSE
  { title: "LLM Response", detail: "AI generates final response", active: ["llm"], direction: "up" },
  { title: "Service Response", detail: "Formats and prepares response", active: ["service"], direction: "up" },
  { title: "Controller Return", detail: "Converts response into JSON", active: ["controller"], direction: "up" },
  { title: "Gateway Return", detail: "Routes response back securely", active: ["gateway"], direction: "up" },
  { title: "Load Balancer Return", detail: "Ensures response reaches client", active: ["lb"], direction: "up" },
  { title: "Client Response", detail: "UI receives and renders data", active: ["client"], direction: "up" },
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
