/**
 * ─────────────────────────────────────────────────────────────
 *  PORTFOLIO CONTENT — edit this file to personalise the site.
 * ─────────────────────────────────────────────────────────────
 */

export type Suit = "spades" | "diamonds" | "clubs" | "hearts";

export const PROFILE = {
  name: "Siddharth Shetty",
  role: "Robotics & AI Engineer / Full-Stack Developer",
  roleLines: ["Robotics & AI Engineer", "Full-Stack Developer"],
  location: "India",
  bio: "I build machines that see, think and move — from bare-metal motor control and edge neural inference to the real-time dashboards that watch over them.",
  githubUser: "styxoid", // ← your GitHub username (used for live repo/commit data)
  linkedin: "https://www.linkedin.com/in/siddharth-sudesh-shetty",
  email: "siddharth.shetty2006@gmail.com",
  resume: "/resume.pdf", // ← drop your CV at public/resume.pdf
};

export const SUITS: Record<
  Suit,
  { symbol: string; title: string; domain: string; color: string; binder: string }
> = {
  spades: {
    symbol: "♠",
    title: "The Blade",
    domain: "Embedded, Kinematics & Hardware",
    color: "#cbd5e1",
    binder: "Hardware",
  },
  diamonds: {
    symbol: "♦",
    title: "The Core",
    domain: "Neural Networks, Edge AI & Computer Vision",
    color: "#d4af37",
    binder: "AI & Vision",
  },
  clubs: {
    symbol: "♣",
    title: "The Circuit",
    domain: "Distributed Systems, Simulation & Web Architecture",
    color: "#34d399",
    binder: "Web Architecture",
  },
  hearts: {
    symbol: "♥",
    title: "The Vector",
    domain: "Spatial Graphics, Simulation & Edge Research",
    color: "#f43f5e",
    binder: "Spatial & Tools",
  },
};

export type Project = {
  id: string;
  rank: string;
  suit: Suit;
  title: string;
  tagline: string;
  description: string;
  metrics: string[];
  stack: string[];
  demo?: string;
  source: string;
  actionLabel?: string;
};

export const PROJECTS: Project[] = [
  // ── 1. THE BLADE (♠ Embedded, Kinematics & Hardware) ──
  {
    id: "kinetrak",
    rank: "A",
    suit: "spades",
    title: "KineTrak",
    tagline: "6-DOF Spatial Controller & Telemetry Wand",
    description:
      "A low-latency 6-DOF spatial tracking wand utilizing real-time IMU sensor telemetry, high-speed USB bridge drivers, and custom desktop 3D viewports for robotic manipulation and motion capture.",
    metrics: ["6-DOF Spatial Tracking", "Telemetry Latency: < 8ms", "High-Speed USB Bridge"],
    stack: ["C++", "Python", "IMU Sensors", "Three.js", "Serial Protocol"],
    source: "https://github.com/your-username/KineTrak",
    actionLabel: "EXPLORE REPO",
  },
  {
    id: "project-cerebro",
    rank: "K",
    suit: "spades",
    title: "Project Cerebro",
    tagline: "Closed-Loop Brain-Computer Interface for Mobile Robotics",
    description:
      "A closed-loop BCI architecture processing non-invasive EEG and EMG signals. Utilizes machine learning classification pipelines to translate neural intent and muscular impulses into directional commands for mobile robotic units.",
    metrics: ["Non-Invasive EEG/EMG", "Real-Time Signal Processing", "Direct Hardware Teleoperation"],
    stack: ["Python", "SciPy", "Scikit-Learn", "C++", "Embedded Systems"],
    source: "https://github.com/your-username/Project-Cerebro",
    actionLabel: "EXPLORE REPO",
  },

  // ── 2. THE CORE (♦ Neural Networks, Edge AI & Computer Vision) ──
  {
    id: "resqone",
    rank: "A",
    suit: "diamonds",
    title: "ResQOne",
    tagline: "Autonomous Search-and-Rescue Quadcopter System",
    description:
      "An offline-first autonomous drone platform engineered for search-and-rescue missions. Features onboard edge computer vision for automated survivor and hazard detection paired with an offline web ground control station.",
    metrics: ["Edge YOLOv8 Inference", "Offline-First Sync", "Autonomous Waypoint Navigation"],
    stack: ["Python", "YOLOv8", "ROS", "FastAPI", "WebSockets"],
    source: "https://github.com/your-username/ResQOne",
    actionLabel: "EXPLORE REPO",
  },
  {
    id: "rudraone",
    rank: "K",
    suit: "diamonds",
    title: "RudraOne",
    tagline: "Multilingual Speech Intelligence & Incident Routing Platform",
    description:
      "An emergency intelligence platform parsing multi-channel emergency voice streams. Features low-latency automated speech recognition, multilingual transcription, and instant critical entity extraction for dispatch centers.",
    metrics: ["Multilingual ASR", "Zero-Shot Entity Extraction", "Low-Latency Audio Streaming"],
    stack: ["Python", "FastAPI", "Whisper", "Transformers", "React"],
    source: "https://github.com/your-username/RudraOne",
    actionLabel: "EXPLORE REPO",
  },
  {
    id: "ozone-ai",
    rank: "Q",
    suit: "diamonds",
    title: "Ozone AI",
    tagline: "Multi-Agent Misinformation Defense System",
    description:
      "An autonomous multi-agent defense architecture that parses multi-modal web claims, runs cross-source factual verification against trusted databases, and detects coordinated disinformation campaigns.",
    metrics: ["Multi-Agent Consensus", "Cross-Source Fact Verification", "Real-Time Trust Scoring"],
    stack: ["Python", "LangChain", "FastAPI", "Vector DB", "NLP"],
    source: "https://github.com/your-username/Ozone-AI",
    actionLabel: "EXPLORE REPO",
  },

  // ── 3. THE CIRCUIT (♣ Distributed Systems, Simulation & Web Architecture) ──
  {
    id: "aegissurge",
    rank: "A",
    suit: "clubs",
    title: "AegisSurge",
    tagline: "Disaster Cascade Simulation & Algorithmic Triage Engine",
    description:
      "A disaster mitigation simulation engine modeling environmental impact and infrastructure collapse. Couples Holland wind physics equations with topological dependency graphs to calculate failure cascades and route triage resources.",
    metrics: ["Holland Wind Physics Engine", "Topological Graph Dependencies", "Dynamic Triage Prioritization"],
    stack: ["Python", "FastAPI", "NetworkX", "NumPy", "Google Cloud"],
    source: "https://github.com/your-username/AegisSurge",
    actionLabel: "EXPLORE REPO",
  },
  {
    id: "marine-dash",
    rank: "K",
    suit: "clubs",
    title: "Marine Dash",
    tagline: "Centralized Maritime Command & Vessel Telemetry Console",
    description:
      "A real-time maritime analytics command dashboard ingesting high-throughput AIS feed data. Delivers interactive live vessel tracking, trajectory forecasting, and proximity collision warnings.",
    metrics: ["High-Throughput AIS Ingestion", "Sub-second UI Telemetry Rendering", "Trajectory & Collision Forecasting"],
    stack: ["TypeScript", "FastAPI", "Leaflet/Mapbox", "WebSockets", "Docker"],
    source: "https://github.com/your-username/MarineDash",
    actionLabel: "EXPLORE REPO",
  },

  // ── 4. THE VECTOR (♥ Spatial Graphics, Simulation & Edge Research) ──
  {
    id: "edge-drone-benchmark",
    rank: "A",
    suit: "hearts",
    title: "Edge Drone Vision Benchmark",
    tagline: "Empirical Latency & Accuracy Study on Constrained Edge Hardware",
    description:
      "An empirical research benchmarking study comparing MobileNetV3 and YOLOv8 architectures on edge hardware for drone gesture control under environmental distortions, sensor noise, and hardware resource limits.",
    metrics: ["Latency vs mAP Optimization", "Simulated Environmental Distortions", "Quantized Edge Benchmarks"],
    stack: ["Python", "PyTorch", "YOLOv8", "MobileNetV3", "OpenCV", "Google Colab"],
    source: "https://github.com/your-username/Edge-Drone-Benchmark",
    actionLabel: "VIEW RESEARCH / REPO",
  },
];

/** Proficiency rank: A = Expert, K = Advanced, Q = Proficient, J = Working knowledge */
export type SkillRank = "A" | "K" | "Q" | "J";
export const RANK_LABEL: Record<SkillRank, string> = {
  A: "Expert",
  K: "Advanced",
  Q: "Proficient",
  J: "Working",
};

export const SKILLS: Record<Suit, { name: string; rank: SkillRank }[]> = {
  spades: [
    { name: "C++", rank: "A" },
    { name: "C", rank: "A" },
    { name: "ROS2", rank: "K" },
    { name: "STM32 / ARM", rank: "K" },
    { name: "FreeRTOS", rank: "Q" },
    { name: "Kinematics", rank: "K" },
    { name: "KiCad", rank: "J" },
  ],
  diamonds: [
    { name: "Python", rank: "A" },
    { name: "PyTorch", rank: "A" },
    { name: "OpenCV", rank: "K" },
    { name: "TensorRT", rank: "Q" },
    { name: "YOLO", rank: "K" },
    { name: "ONNX", rank: "Q" },
  ],
  clubs: [
    { name: "TypeScript", rank: "A" },
    { name: "Next.js", rank: "K" },
    { name: "FastAPI", rank: "A" },
    { name: "PostgreSQL", rank: "K" },
    { name: "Redis", rank: "Q" },
    { name: "Docker", rank: "K" },
    { name: "Go", rank: "J" },
  ],
  hearts: [
    { name: "Three.js", rank: "A" },
    { name: "R3F", rank: "K" },
    { name: "GLSL", rank: "Q" },
    { name: "Blender", rank: "Q" },
    { name: "Unity", rank: "J" },
    { name: "Git", rank: "A" },
  ],
};

/** SVG path data (100×100 box) for the custom suit glyphs — shared by HTML and canvas textures. */
export const SUIT_PATHS: Record<Suit, string> = {
  spades:
    "M50 4C50 4 9 38 9 61c0 16 15 25 29 19 4-2 7-5 9-8-1 10-5 18-13 23h32c-8-5-12-13-13-23 2 3 5 6 9 8 14 6 29-3 29-19C91 38 50 4 50 4z",
  hearts:
    "M50 92C50 92 7 63 7 34 7 18 19 8 32 8c9 0 15 5 18 12C53 13 59 8 68 8c13 0 25 10 25 26 0 29-43 58-43 58z",
  diamonds: "M50 3Q68 29 89 50 68 71 50 97 32 71 11 50 32 29 50 3z",
  clubs:
    "M32 28a18 18 0 1 0 36 0a18 18 0 1 0-36 0zM10 60a18 18 0 1 0 36 0a18 18 0 1 0-36 0zM54 60a18 18 0 1 0 36 0a18 18 0 1 0-36 0zM46 58c0 18-5 29-14 37h36c-9-8-14-19-14-37z",
};
