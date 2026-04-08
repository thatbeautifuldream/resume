import { ResumeSchema, type Resume, withResumeDefaults } from "./resume-schema";

const resumeData: Resume = {
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
      {
        network: "LinkedIn",
        username: "milindmishra",
        url: "linkedin.com/in/milindmishra",
      },
      {
        network: "X",
        username: "milindmishra_",
        url: "x.com/milindmishra_",
      },
      {
        network: "Cal.com",
        username: "milind",
        url: "cal.com/milind",
      },
    ],
  },
  work: [
    {
      name: "Thine / Merlin AI by Foyer",
      location: "Bangalore Urban, Karnataka, India (On-site)",
      position: "Product Engineer / Design Engineer",
      workType: "Full Time",
      startDate: "2025-02",
      summary:
        "Own frontend execution across Merlin's customer-facing product surfaces and Thine's web experiences, spanning product engineering, UX systems, payments, and AI-native interfaces.",
      highlights: [
        "Owned product experience, user experience, and frontend implementation for a browser agent built inside a Chrome extension sidebar",
        "Led design system improvements across the Merlin website to raise UI consistency, implementation speed, and overall product quality",
        "Maintained various payment flows for the Merlin website, ensuring a smoother purchase and subscription experience for customers and better campaign outcomes for the marketing team",
        "Owned the frontend for Merlin's customer-facing web product, delivering core user journeys across merlin projects, engagement, retention and support experiences",
        "Built interaction-heavy AI product flows for Merlin, including imports, chat history improvements, merlin projects, and responsive motion systems",
        "Developed the Thine website and shaped its product storytelling through a polished, image sequence scroll experience",
      ],
      proofLinks: [
        { type: "live", label: "Thine's Website", url: "https://thine.com" },
        {
          type: "live",
          label: "Merlin AI's Website",
          url: "https://getmerlin.in/chat",
        },
        {
          type: "live",
          label: "Merlin's Chrome Extension",
          url: "https://chromewebstore.google.com/detail/merlin-ask-ai-to-research/camppjleccjaphfdbohjdohecfnoikec",
        },
      ],
    },
    {
      name: "SARAL - The Influencer OS",
      location: "Bengaluru, Karnataka, India (Remote)",
      position: "Software Engineer",
      workType: "Full Time",
      startDate: "2024-12",
      endDate: "2025-02",
      summary:
        "Improved internal product workflows for support, growth, and campaign operations.",
      highlights: [
        "Revamped internal dashboard to improve visibility of key metrics for support and growth teams",
        "Implemented multi-select drag-and-drop interactions for faster bulk operations",
        "Built a content submission UI to streamline approvals and accelerate campaign execution",
      ],
      proofLinks: [
        { type: "live", label: "Saral's Website", url: "https://getsaral.com" },
      ],
    },
    {
      name: "Proof-of-Skill protocol",
      location: "Bengaluru, Karnataka, India (On-site)",
      position: "Founding Product Engineer",
      workType: "Full Time",
      startDate: "2024-06",
      endDate: "2024-12",
      summary:
        "Led product engineering for an assessment and skill validation platform from MVP to deployment.",
      highlights: [
        "Led frontend development for MVP flows across Skill Validators, Candidates, and Recruiters",
        "Designed and implemented validator UI with voting and consensus-driven assessment validation",
        "Built real-time assessment recording and proctoring integrations to improve data integrity and malpractice detection",
        "Architected core systems and handled end-to-end deployment for platform availability",
      ],
      proofLinks: [
        {
          type: "live",
          label: "Proof of Skill Protocol's Website",
          url: "https://proofofskill.org",
        },
      ],
    },
    {
      name: "StartupHire",
      location: "Irvine, California, United States (Remote)",
      position: "Lead Frontend Engineer",
      workType: "Full Time",
      startDate: "2023-08",
      endDate: "2024-01",
      summary:
        "Led frontend execution for recruiting workflow and Gen AI product prototypes.",
      highlights: [
        "Led a team of two developers to build a recruiting pipeline prototype",
        "Integrated multiple job boards to centralize candidate applications and improve recruiter visibility",
        "Managed deployments for Gen AI workflows to ensure stable operation",
      ],
    },
    {
      name: "Locus Connect / National Yang Ming Chiao Tung University",
      location: "Bengaluru, Karnataka, India / Hsinchu City, Taiwan",
      position: "Frontend Engineer / Research Assistant",
      workType: "Full Time",
      startDate: "2022-07",
      endDate: "2023-07",
      summary:
        "Built product, research, and visualization systems for a 3D indoor positioning platform across industry and university collaboration.",
      highlights: [
        "Developed and maintained frontend for a 3D indoor positioning product and related marketing experiences",
        "Maintained frontend systems for indoor positioning with integrated IoT data pipelines",
        "Enhanced 3D visualization using React, GSAP, and Three.js",
        "Improved HDOP calculations and z-index accuracy from around 20 cm to under 10 cm",
        "Managed infrastructure tasks across switch configuration, load balancers, Docker deployments, and bare-metal services",
      ],
      proofLinks: [
        {
          type: "live",
          label: "Locus Connect's Website",
          url: "https://locusconnect.com/",
        },
        {
          type: "live",
          label: "University Website",
          url: "https://www.nycu.edu.tw/",
        },
      ],
    },
  ],
  education: [
    {
      institution: "National Yang Ming Chiao Tung University",
      url: "www.nycu.edu.tw",
      studyType: "Research Program, CSE",
      endDate: "2023-07",
    },
    {
      institution: "Visvesvaraya Technological University",
      url: "www.vtu.ac.in",
      studyType: "Bachelor of Engineering, ECE",
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
    "REST APIs",
    "MQTT",
    "Zustand",
    "React Query",
    "Vercel AI SDK",
    "OpenAI API",
    "D3.js",
    "Framer Motion",
    "Figma",
    "CI/CD",
  ],
  projects: [
    {
      name: "AI Roadmap Generator",
      description:
        "Full-stack AI product for generating personalized learning roadmaps",
      role: "Engineer & Product Owner",
      teamSize: "3",
      duration: "Aug 2024 - Sept 2024",
      status: "Live",
      highlights: [
        "Identified a gap in structured upskilling journeys and shipped a personalized roadmap generator with streaming AI responses and node-based learning flows",
        "Built and owned the full stack end-to-end (prompt design, typed output parsing, canvas renderer, and responsive UX), reducing first roadmap generation to under 10 seconds",
        "Reached 5,600+ all-time users and generated 250+ learning roadmaps through organic distribution as of Mar 2026",
      ],
      impactMetrics: [
        {
          label: "Users",
          value: "5,600+",
          window: "All-time (as of Mar 2026)",
        },
        {
          label: "Roadmaps Generated",
          value: "500+",
          window: "All-time (as of Mar 2026)",
        },
      ],
      proofLinks: [
        {
          type: "live",
          label: "Live",
          url: "airoadmapgenerator.com",
        },
        {
          type: "source",
          label: "Source",
          url: "github.com/thatbeautifuldream",
        },
      ],
      challenges: [
        "Converting inconsistent LLM output into stable, typed roadmap nodes",
        "Keeping canvas interactions smooth while rendering larger roadmap graphs",
      ],
      url: "airoadmapgenerator.com",
      keywords: ["Next.js", "React", "TypeScript", "Canvas", "LLMs"],
      date: "2024-08-01",
    },
    {
      name: "JSON Visualiser",
      description:
        "JSON debugging and visualization tool with tree and grid views for nested data exploration",
      role: "Creator",
      teamSize: "1",
      duration: "Oct 2024 - Present",
      status: "Live",
      highlights: [
        "Built the tool to reduce debugging time for deeply nested payloads by combining validation, formatting, and multi-view exploration in one interface",
        "Implemented tree and grid renderers optimized for complex nested JSON structures with smooth expand/collapse navigation",
        "Reached 143 unique users with 43% return rate, including one power user with 49 sessions as of Mar 2026",
      ],
      impactMetrics: [
        {
          label: "Unique Users",
          value: "143",
          window: "All-time (as of Mar 2026)",
        },
        {
          label: "Return Rate",
          value: "43%",
          window: "All-time cohort (as of Mar 2026)",
        },
      ],
      proofLinks: [
        {
          type: "live",
          label: "Live",
          url: "jsonvisualiser.com",
        },
        {
          type: "source",
          label: "Source",
          url: "github.com/thatbeautifuldream/jsonvisualiser",
        },
      ],
      challenges: [
        "Making large JSON payload inspection usable on smaller screens",
        "Balancing rendering performance with readability for deep hierarchies",
      ],
      url: "jsonvisualiser.com",
      keywords: ["React", "TypeScript", "D3.js"],
      date: "2024-10-01",
    },
    {
      name: "models.surf",
      description:
        "AI model discovery platform to explore and filter models by capabilities and use cases",
      role: "Founder & Product Engineer",
      teamSize: "1",
      duration: "Feb 2026 - Present",
      status: "Live",
      highlights: [
        "Built a model discovery interface to reduce evaluation time for developers choosing across rapidly changing AI model options",
        "Designed capability-first filtering workflows and ranking views to surface fit-for-purpose models faster",
      ],
      proofLinks: [
        { type: "live", label: "Live", url: "models.surf" },
        {
          type: "source",
          label: "Source",
          url: "github.com/thatbeautifuldream",
        },
      ],
      url: "models.surf",
      keywords: ["Next.js", "React", "TypeScript", "AI Tooling"],
      date: "2026-02-01",
    },
    {
      name: "Markdown Visualizer",
      description:
        "Real-time markdown rendering and preview tool for fast writing and iteration",
      role: "Creator",
      teamSize: "1",
      duration: "Dec 2025 - Present",
      status: "Live",
      highlights: [
        "Built an instant preview workflow to reduce context switching while writing technical content",
        "Implemented low-latency rendering and editing utilities for markdown-heavy developer workflows",
      ],
      proofLinks: [
        { type: "live", label: "Live", url: "markdownvisualizer.com" },
        {
          type: "source",
          label: "Source",
          url: "github.com/thatbeautifuldream",
        },
      ],
      url: "markdownvisualizer.com",
      keywords: ["React", "TypeScript", "Markdown", "DX"],
      date: "2025-12-01",
    },
    {
      name: "attnui",
      description:
        "Attention-to-detail UI component collection focused on polished interaction design",
      role: "Creator",
      teamSize: "1",
      duration: "Nov 2025 - Present",
      status: "Live",
      highlights: [
        "Designed reusable UI patterns focused on motion quality and production-grade component ergonomics",
        "Built component primitives that improve consistency and implementation speed for frontend builds",
      ],
      proofLinks: [
        { type: "live", label: "Live", url: "attnui.com" },
        {
          type: "source",
          label: "Source",
          url: "github.com/thatbeautifuldream",
        },
      ],
      url: "attnui.com",
      keywords: ["Design Systems", "React", "UI Components", "Motion"],
      date: "2025-11-01",
    },
  ],
  talks: [
    {
      title: "Building a Component Distribution System with shadcn Registry",
      organiser: "React Bangalore",
      link: "meetup.com/reactjs-bangalore/events/312620988",
    },
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

const result = ResumeSchema.safeParse(resumeData);
if (!result.success) {
  throw new Error(
    `Resume validation failed: ${JSON.stringify(result.error.format(), null, 2)}`,
  );
}

export const resume = withResumeDefaults(result.data);
