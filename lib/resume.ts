import type { Resume } from "./resume-schema";

export const resume: Resume = {
  source: "github.com/thatbeautifuldream/resume",
  basics: {
    name: "Milind Kumar Mishra",
    label: "Product Engineer",
    email: "milindmishra.work@gmail.com",
    phone: "9631333128",
    url: "milindmishra.com",
    location: {
      city: "Bengaluru",
      countryCode: "IN",
    },
    timezone: "Asia/Kolkata",
    profiles: [
      {
        network: "GitHub",
        username: "thatbeautifuldream",
        url: "github.com/thatbeautifuldream",
      },
    ],
  },
  work: [
    {
      name: "Foyer (Merlin AI & Thine)",
      location: "Bengaluru, Karnataka, India",
      position: "Product Engineer",
      workType: "Full Time",
      startDate: "2025-02-21",
      summary:
        "Building AI products for 2M+ users. Ownership across growth, revenue, platform stability, and expressive UI.",
      highlights: [
        "Revamped Model Selector UX with discovery grid interface, increasing model adoption by 40%",
        "Shipped ChatGPT history import feature enabling 3,500+ users to migrate from ChatGPT to Merlin",
        "Improved payment flow reducing transaction failures by 25%, implemented churn intervention flows improving retention by 15%",
        "Built real-time prompt enhancement with streaming architecture, reducing perceived latency to under 200ms",
        "Engineered animation-heavy experiences for Thine using optimized motion design patterns, maintaining 60fps performance at scale",
      ],
    },

    {
      name: "Proof-of-Skill Protocol & StartupHire",
      location: "Bengaluru, Karnataka, India / Remote",
      position: "Founding Product Engineer",
      workType: "Full Time",
      startDate: "2023-08-01",
      endDate: "2025-02-08",
      summary:
        "Built 0 to 1 hiring and skill validation platforms. Owned frontend, devops, growth tools, and product velocity in early-stage chaos.",
      highlights: [
        "Architected and shipped decentralized skill validation MVPs with voting consensus across 150+ validators, reducing hiring bias through algorithmic evaluation",
        "Built proctored assessments with real-time streaming infrastructure, reducing time-to-interview by 50%",
        "Developed recruiter dashboards with analytics, heatmaps, and search functionality, improving candidate discovery and data-driven decision making",
        "Built AI-powered assessment generation system using Vercel AI SDK and OpenAI API, automating question creation for 20+ skill domains",
        "Shipped internal tools and ops dashboards improving campaign ROI tracking and operational efficiency by 30%",
      ],
    },

    {
      name: "Locus Connect × National Yang Ming Chiao Tung University (NYCU)",
      location: "Hsinchu, Taiwan",
      position: "Software Engineer & Research Assistant",
      workType: "Full Time",
      startDate: "2022-07-01",
      endDate: "2023-07-31",
      summary:
        "Industry-academia R&D on real-time IoT positioning systems. Shipped research-grade accuracy into production.",
      highlights: [
        "Built 3D positioning and visualization systems for industrial IoT applications, improving UWB positioning accuracy from 20cm to under 10cm research-grade precision",
        "Developed MQTT-based dashboards for real-time IoT device monitoring and visualization across 50+ connected devices",
        "Dockerized microservices architecture reducing deployment time by 80% while maintaining 99.9% uptime",
      ],
    },

    {
      name: "iNeuron.ai & Plusklass",
      location: "Bengaluru, Karnataka, India / Remote",
      position: "UX Designer & Technical Content Writer",
      workType: "Internship",
      startDate: "2022-01-01",
      endDate: "2022-06-30",
      summary:
        "UX, design systems, and technical education. First taste of shipping things people actually use.",
      highlights: [
        "Designed onboarding flows and maintained component-based design system, increasing development velocity by 35%",
        "Authored beginner-friendly HTML, CSS, and JavaScript educational content adopted by 2,000+ learners, improving course completion rates by 25%",
        "Created marketing collateral and landing pages contributing to 20% increase in lead generation",
      ],
    },
  ],
  education: [
    {
      institution: "National Yang Ming Chiao Tung University",
      url: "www.nycu.edu.tw",
      area: "Computer Software Engineering",
      studyType: "Short Term Research Program",
      endDate: "2023-07",
    },
    {
      institution: "Visvesvaraya Technological University",
      url: "www.vtu.ac.in",
      area: "Electronics and Communication",
      studyType: "Bachelor of Engineering",
      endDate: "2022-09",
    },
  ],
  certificates: [],
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Tailwind CSS",
    "HTML",
    "CSS",
    "Git",
    "Docker",
    "PostgreSQL",
    "MongoDB",
    "REST APIs",
    "WebSockets",
    "MQTT",
    "Redux",
    "Zustand",
    "React Query",
    "Vercel AI SDK",
    "OpenAI API",
    "Canvas API",
    "D3.js",
    "Framer Motion",
    "Figma",
    "CI/CD",
  ],
  projects: [
    {
      name: "AI Roadmap Generator",
      description:
        "Full-stack AI product generating personalized learning roadmaps with 5,600+ organic users",
      highlights: [
        "Developed end-to-end solution with prompt engineering, structured LLM output parsing, canvas-based visualization, and responsive UX",
        "Generated 250+ career roadmaps using real-time streaming architecture with OpenAI API",
        "Built custom canvas rendering engine for interactive node-based navigation with drag-and-drop functionality",
      ],
      url: "airoadmapgenerator.com",
      keywords: ["Next.js", "React", "TypeScript", "Canvas", "LLMs"],
      date: "2024-08-01",
    },
    {
      name: "JSON Visualiser",
      description:
        "Open-source JSON debugging and visualization tool with tree and grid view options",
      highlights: [
        "Achieved 143 unique users with 43% return rate, including one power user with 49 sessions",
        "Implemented JSON formatting, validation, and exploration with tree and grid visualization modes supporting deeply nested structures",
      ],
      url: "jsonvisualiser.com",
      keywords: ["React", "TypeScript", "D3.js"],
      date: "2024-10-01",
    },
  ],
  talks: [
    {
      title: "Mastering ViewTransition in React for Stunning UI Updates",
      organiser: "React Play Bengaluru",
      link: "meetup.com/reactplay-bengaluru/events/311437528",
    },
    {
      title: "Building Real-Time Applications with Reactive Databases",
      organiser: "React Play x React Bangalore",
      link: "meetup.com/reactplay-bengaluru/events/307690438",
    },
    {
      title: "AI for React Developers",
      organiser: "React Bangalore",
      link: "meetup.com/reactjs-bangalore/events/306320480",
    },
  ],
  references: [],
  contributions: [
    {
      title:
        "feat: add table markdown copy and csv/markdown download options #99",
      url: "github.com/vercel/streamdown/pull/99",
    },
    {
      title: "feat: add download functionality to code blocks #102",
      url: "github.com/vercel/streamdown/pull/102",
    },
    {
      title: "feat: add image download functionality with hover controls #103",
      url: "github.com/vercel/streamdown/pull/103",
    },
    {
      title:
        "feat: add speech to text input to prompt area and update test and example apps #112",
      url: "github.com/vercel/ai-elements/pull/112",
    },
  ],
  volunteer: [],
  awards: [],
  languages: [],
};
