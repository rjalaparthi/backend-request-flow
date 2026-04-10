import React, { useEffect, useMemo, useState } from "react";
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
  {
    title: "Browser sends request",
    detail:
      "A user opens a site or an app sends an API request. This is the starting point most people think about.",
    active: ["client"],
  },
  {
    title: "DNS resolves the domain",
    detail:
      "DNS converts a domain like www.linkedin.com into an IP address so the request knows where to go.",
    active: ["dns"],
  },
  {
    title: "Load balancer receives traffic",
    detail:
      "The load balancer spreads traffic across healthy backend instances so one server is not overloaded.",
    active: ["lb"],
  },
  {
    title: "API gateway / Nginx forwards request",
    detail:
      "This layer often handles SSL termination, routing, auth checks, and forwards the request to the right backend service.",
    active: ["gateway"],
  },
  {
    title: "Spring Boot backend receives request",
    detail:
      "Now your backend application gets the request. This is where Java backend developers usually start caring the most.",
    active: ["backend"],
  },
  {
    title: "Controller maps the endpoint",
    detail:
      "The controller matches the path and method, then passes work into the service layer.",
    active: ["backend", "controller"],
  },
  {
    title: "Service layer runs business logic",
    detail:
      "Validation, transformation, orchestration, and decision making happen here.",
    active: ["backend", "service"],
  },
  {
    title: "Cache is checked first",
    detail:
      "If data is already available in Redis or another cache, the backend can avoid a heavier database call.",
    active: ["backend", "cache"],
  },
  {
    title: "Database query runs",
    detail:
      "If cache misses or fresh data is needed, the backend sends SQL to the database and waits for results.",
    active: ["backend", "db"],
  },
  {
    title: "Backend may call other APIs",
    detail:
      "Real systems often call user services, payment services, claims services, or partner APIs before building a response.",
    active: ["backend", "api"],
  },
  {
    title: "Event may be published to Kafka",
    detail:
      "For async or data engineering style flows, the backend may publish an event like user-created or claim-processed to Kafka.",
    active: ["backend", "kafka"],
  },
  {
    title: "Response is built and returned",
    detail:
      "The backend creates the response and sends it back through gateway and load balancer to the client.",
    active: ["backend", "gateway", "lb", "client"],
  },
];

function NodeCard({ icon: Icon, title, subtitle, active = false }) {
  return (
    <motion.div
      layout
      className={`node-card ${active ? "node-card-active" : ""}`}
    >
      <div className="node-card-row">
        <div className={`node-icon ${active ? "node-icon-active" : ""}`}>
          <Icon size={22} />
        </div>
        <div>
          <div className="node-title">{title}</div>
          <div className="node-subtitle">{subtitle}</div>
        </div>
      </div>
    </motion.div>
  );
}

function FlowArrow({ active = false, label }) {
  return (
    <div className="flow-arrow-wrap">
      <motion.div
        animate={
          active
            ? { opacity: [0.45, 1, 0.45], scale: [1, 1.04, 1] }
            : { opacity: 0.35, scale: 1 }
        }
        transition={{ repeat: Infinity, duration: 1.5 }}
        className={`flow-arrow ${active ? "flow-arrow-active" : ""}`}
      />
      {label ? <div className="flow-arrow-label">{label}</div> : null}
    </div>
  );
}

function BackendBox({ activeSet }) {
  return (
    <div className="backend-box">
      <div className="backend-header">
        <div className="backend-header-icon">
          <Server size={24} />
        </div>
        <div>
          <div className="backend-kicker">Backend</div>
          <div className="backend-title">SPRING BOOT SERVICE</div>
        </div>
      </div>

      <div className="backend-grid">
        <NodeCard
          icon={Boxes}
          title="Controller"
          subtitle="Maps endpoint and accepts request"
          active={activeSet.has("controller")}
        />
        <NodeCard
          icon={ShieldCheck}
          title="Service Layer"
          subtitle="Runs business logic and orchestrates work"
          active={activeSet.has("service")}
        />

        <div className="two-col">
          <NodeCard
            icon={Database}
            title="Cache / Redis"
            subtitle="Fast lookup before DB hit"
            active={activeSet.has("cache")}
          />
          <NodeCard
            icon={Database}
            title="PostgreSQL / DB"
            subtitle="Runs SQL and returns data"
            active={activeSet.has("db")}
          />
        </div>

        <div className="two-col">
          <NodeCard
            icon={Cable}
            title="Other APIs"
            subtitle="Calls partner or internal services"
            active={activeSet.has("api")}
          />
          <NodeCard
            icon={Network}
            title="Kafka / Events"
            subtitle="Publishes async events for downstream systems"
            active={activeSet.has("kafka")}
          />
        </div>
      </div>
    </div>
  );
}

export default function SimpleBackendFlow() {
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
  const activeSet = useMemo(() => new Set(current.active), [current]);

  return (
    <div className="page">
      <div className="shell">
        <div className="topbar">
          <div className="logo-box">
            <ArrowRightLeft size={24} />
          </div>
          <div>
            <h1 className="main-title">Backend Request Flow</h1>
            <div className="subtitle">
              Simplified for backend and data engineering · {steps.length} steps
            </div>
          </div>
        </div>

        <div className="stepbar">
          <div className="step-pill">
            STEP {String(step + 1).padStart(2, "0")}/
            {String(steps.length).padStart(2, "0")}
          </div>
          <div className="step-title">{current.title}</div>

          <div className="progress-track">
            <motion.div
              className="progress-fill"
              animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="content">
          <div className="flow-column">
            <NodeCard
              icon={Globe}
              title="Client / Browser"
              subtitle="User opens a website or app sends an API request"
              active={activeSet.has("client")}
            />

            <FlowArrow active={activeSet.has("dns")} label="resolve" />

            <NodeCard
              icon={Globe}
              title="DNS"
              subtitle="Finds the server IP for the domain"
              active={activeSet.has("dns")}
            />

            <FlowArrow active={activeSet.has("lb")} label="route" />

            <NodeCard
              icon={Network}
              title="Load Balancer"
              subtitle="Distributes traffic across backend instances"
              active={activeSet.has("lb")}
            />

            <FlowArrow active={activeSet.has("gateway")} label="forward" />

            <NodeCard
              icon={ShieldCheck}
              title="API Gateway / Nginx"
              subtitle="Handles SSL, routing, auth checks, and forwards request"
              active={activeSet.has("gateway")}
            />

            <FlowArrow
              active={
                activeSet.has("backend") ||
                activeSet.has("controller") ||
                activeSet.has("service")
              }
              label="process"
            />

            <BackendBox activeSet={activeSet} />
          </div>
        </div>

        <div className="bottom-grid">
          <div className="info-card">
            <div className="card-kicker">What is happening now</div>
            <p className="card-text">{current.detail}</p>

            <div className="btn-row">
              <button
                className="btn btn-secondary"
                onClick={() =>
                  setStep((s) => (s - 1 + steps.length) % steps.length)
                }
              >
                <ChevronLeft size={16} /> Previous
              </button>

              <button
                className="btn btn-primary"
                onClick={() => setPlaying((p) => !p)}
              >
                {playing ? <Pause size={16} /> : <Play size={16} />}
                {playing ? "Pause" : "Play"}
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setStep((s) => (s + 1) % steps.length)}
              >
                Next <ChevronRight size={16} />
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => {
                  setPlaying(false);
                  setStep(0);
                }}
              >
                <RotateCcw size={16} /> Reset
              </button>
            </div>
          </div>

          <div className="info-card">
            <div className="card-kicker">Best talking point</div>
            <div className="talking-points">
              <p>
                This version is easier to explain than kernel-level flow because
                it focuses on the pieces backend and data engineers actually
                discuss in real systems.
              </p>
              <p>
                It shows where request routing, business logic, database work,
                cross-service calls, and Kafka publishing happen.
              </p>
            </div>

            <div className="highlight-box">
              “When people ask what happens after typing a URL, this is the
              version I care about most as a backend and data-focused engineer.”
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
