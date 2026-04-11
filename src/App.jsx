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
  { title: "Client Request", detail: "User asks a question", active: ["client"], direction: "down" },
  { title: "DNS", detail: "Find server location", active: ["dns"], direction: "down" },
  { title: "Load Balancer", detail: "Pick server", active: ["lb"], direction: "down" },
  { title: "Gateway", detail: "Security + routing", active: ["gateway"], direction: "down" },
  { title: "Backend", detail: "Receives request", active: ["backend"], direction: "down" },
  { title: "Controller", detail: "Routes request", active: ["controller"], direction: "down" },
  { title: "Service", detail: "Decides what to do", active: ["service"], direction: "down" },

  // 🔥 DB PATH
  { title: "Check Database", detail: "Try to find exact data", active: ["db"], direction: "down" },
  { title: "DB Found ✅", detail: "Data found directly", active: ["db_success"], direction: "down" },

  // 🔥 RAG PATH
  { title: "Not Found → RAG", detail: "Fallback to AI search", active: ["rag_start"], direction: "down" },
  { title: "Embedding", detail: "Convert to vector", active: ["embedding"], direction: "down" },
  { title: "Vector DB", detail: "Find similar data", active: ["vectordb"], direction: "down" },
  { title: "Check Results", detail: "Are results good?", active: ["check"], direction: "down" },

  { title: "Low Confidence ⚠️", detail: "Data is weak", active: ["warning"], direction: "down" },
  { title: "Retry 🔁", detail: "Try again better", active: ["retry"], direction: "down" },

  { title: "LLM", detail: "Generate answer", active: ["llm"], direction: "down" },

  { title: "RAG Success ✅", detail: "AI answer created", active: ["success"], direction: "up" },
  { title: "Fallback 🚫", detail: "No data available", active: ["fallback"], direction: "up" },

  // 🔥 RESPONSE BACK
  { 
  title: "Service Response", 
  detail: 
    "Service prepares the final answer.\nMakes sure the data is correct before sending it back.", 
  active: ["service"], 
  direction: "up" 
},
{ 
  title: "Controller", 
  detail: 
    "Controller converts the response into JSON format.\nThis is what frontend understands.", 
  active: ["controller"], 
  direction: "up" 
},
{ 
  title: "Gateway", 
  detail: 
    "Gateway sends the response securely.\nIt ensures rules and checks are followed.", 
  active: ["gateway"], 
  direction: "up" 
},
{ 
  title: "Load Balancer", 
  detail: 
    "Load balancer routes response back to the right user.\nMakes sure it reaches the correct client.", 
  active: ["lb"], 
  direction: "up" 
},
{ 
  title: "Client", 
  detail: 
    "User receives the answer.\nThe result is displayed on the screen.", 
  active: ["client"], 
  direction: "up" 
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

{/* 🔥 DB PATH */}
<Node
  label="Database"
  active={activeSet.has("db")}
  direction={current.direction}
/>

<Node
  label="DB Success ✅"
  active={activeSet.has("db_success")}
  type="db_success"
  direction={current.direction}
/>        

{/* 🔥 RAG PATH */}
<Node
  label="RAG Start"
  active={activeSet.has("rag_start")}
  type="rag_start"
  direction={current.direction}
/>        
<Node label="Embedding" active={activeSet.has("embedding")} direction={current.direction} />
<Node label="Vector DB" active={activeSet.has("vectordb")} direction={current.direction} />
<Node label="Check" active={activeSet.has("check")} direction={current.direction} />
<Node label="⚠️ Low Confidence" active={activeSet.has("warning")} direction={current.direction} />
<Node label="🔁 Retry" active={activeSet.has("retry")} direction={current.direction} />
<Node label="LLM" active={activeSet.has("llm")} direction={current.direction} />
<Node label="RAG Success ✅" active={activeSet.has("success")} direction={current.direction} />
<Node label="🚫 Fallback" active={activeSet.has("fallback")} direction={current.direction} />
      </div>
    </div>
  );
}
