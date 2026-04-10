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
} from "lucide-react";
import "./styles.css";

/* 🔥 FULL REQUEST + RESPONSE FLOW */
const steps = [
  {
    title: "Browser sends request",
    detail:
      "A user opens a website or an app sends an API request. This is the starting point of every system.",
    active: ["client"],
    direction: "down",
  },
  {
    title: "DNS resolves domain",
    detail:
      "DNS converts a domain like google.com into an IP address so the request knows where to go.",
    active: ["dns"],
    direction: "down",
  },
  {
    title: "Load balancer receives traffic",
    detail:
      "The load balancer distributes incoming traffic across multiple backend servers to prevent overload.",
    active: ["lb"],
    direction: "down",
  },
  {
    title: "API Gateway / Nginx",
    detail:
      "This layer handles SSL termination, authentication, routing rules, and forwards the request.",
    active: ["gateway"],
    direction: "down",
  },
  {
    title: "Spring Boot backend receives request",
    detail:
      "Your backend application receives the request. This is where Java backend engineers start working.",
    active: ["backend"],
    direction: "down",
  },
  {
    title: "Controller maps endpoint",
    detail:
      "Controller identifies the API endpoint and passes the request to the service layer.",
    active: ["controller"],
    direction: "down",
  },
  {
    title: "Service layer executes logic",
    detail:
      "Business logic runs here — validation, transformation, and orchestration.",
    active: ["service"],
    direction: "down",
  },
  {
    title: "Cache is checked",
    detail:
      "System checks Redis or cache first to avoid expensive database queries.",
    active: ["cache"],
    direction: "down",
  },
  {
    title: "Database query executes",
    detail:
      "If cache misses, backend queries the database using SQL and fetches data.",
    active: ["db"],
    direction: "down",
  },

  /* 🔥 RESPONSE FLOW */
  {
    title: "Database returns data",
    detail:
      "Database sends the requested data back to the backend application.",
    active: ["db"],
    direction: "up",
  },
  {
    title: "Service builds response",
    detail:
      "Service layer processes data and prepares response object.",
    active: ["service"],
    direction: "up",
  },
  {
    title: "Controller sends response",
    detail:
      "Controller converts response into JSON and sends it back.",
    active: ["controller"],
    direction: "up",
  },
  {
    title: "Gateway forwards response",
    detail:
      "Gateway passes response back through security and routing layers.",
    active: ["gateway"],
    direction: "up",
  },
  {
    title: "Load balancer returns response",
    detail:
      "Load balancer ensures response reaches the correct client.",
    active: ["lb"],
    direction: "up",
  },
  {
    title: "Client receives response",
    detail:
      "Browser or app receives data and renders UI.",
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
        <h2>
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
        <Node label="Cache" active={activeSet.has("cache")} direction={current.direction} />
        <Node label="Database" active={activeSet.has("db")} direction={current.direction} />
      </div>
    </div>
  );
}
