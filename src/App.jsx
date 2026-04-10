import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Globe,
  Server,
  Database,
  Network,
  Boxes,
  ShieldCheck,
  Cable,
  ArrowRightLeft,
} from "lucide-react";
import "./styles.css";

const steps = [
  { title: "Browser sends request", detail: "User sends request", active: ["client"] },
  { title: "DNS resolves domain", detail: "Domain → IP", active: ["dns"] },
  { title: "Load balancer", detail: "Distributes traffic", active: ["lb"] },
  { title: "Gateway", detail: "Routes request", active: ["gateway"] },
  { title: "Backend", detail: "Spring Boot receives request", active: ["backend"] },
  { title: "Controller", detail: "Maps endpoint", active: ["controller"] },
  { title: "Service", detail: "Business logic", active: ["service"] },
  { title: "Cache", detail: "Check Redis", active: ["cache"] },
  { title: "Database", detail: "Query DB", active: ["db"] },
  { title: "API calls", detail: "Call services", active: ["api"] },
  { title: "Kafka", detail: "Publish event", active: ["kafka"] },
  { title: "Response", detail: "Return response", active: ["backend"] },
];

function NodeCard({ icon: Icon, title, subtitle, active }) {
  return (
    <motion.div className={`node-card ${active ? "active" : ""}`}>
      <Icon size={20} />
      <div>
        <div>{title}</div>
        <small>{subtitle}</small>
      </div>
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
    }, 1500);
    return () => clearInterval(t);
  }, [playing]);

  const current = steps[step];
  const activeSet = useMemo(() => new Set(current.active), [current]);

  return (
    <div className="main-layout">

      {/* LEFT SIDE */}
      <div className="left-panel">
        <h2>Backend Flow</h2>
        <p>{current.detail}</p>

        <div className="btn-column">
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

      {/* RIGHT SIDE */}
      <div className="right-panel">

        <NodeCard icon={Globe} title="Client" subtitle="Request" active={activeSet.has("client")} />
        <NodeCard icon={Globe} title="DNS" subtitle="Resolve" active={activeSet.has("dns")} />
        <NodeCard icon={Network} title="Load Balancer" subtitle="Route" active={activeSet.has("lb")} />
        <NodeCard icon={ShieldCheck} title="Gateway" subtitle="Forward" active={activeSet.has("gateway")} />
        <NodeCard icon={Server} title="Backend" subtitle="Spring Boot" active={activeSet.has("backend")} />
        <NodeCard icon={Boxes} title="Controller" subtitle="API" active={activeSet.has("controller")} />
        <NodeCard icon={ShieldCheck} title="Service" subtitle="Logic" active={activeSet.has("service")} />
        <NodeCard icon={Database} title="Cache" subtitle="Redis" active={activeSet.has("cache")} />
        <NodeCard icon={Database} title="Database" subtitle="Postgres" active={activeSet.has("db")} />
        <NodeCard icon={Cable} title="API Calls" subtitle="External" active={activeSet.has("api")} />
        <NodeCard icon={Network} title="Kafka" subtitle="Events" active={activeSet.has("kafka")} />

      </div>
    </div>
  );
}
