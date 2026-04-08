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
      name: "attnui",
      description:
        "UI component library focused on polished interaction design, motion systems, and production-ready frontend primitives",
      role: "Product Engineer",
      teamSize: "1",
      duration: "Nov 2025 - Present",
      status: "Live",
      highlights: [
        "Designed reusable component patterns with an emphasis on motion quality, visual consistency, and implementation ergonomics",
        "Built production-ready primitives that improve delivery speed while maintaining a higher UI quality bar across frontend builds",
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
    {
      name: "JSON Visualiser",
      description:
        "JSON inspection and visualization tool for debugging deeply nested payloads across tree and grid views",
      role: "Product Engineer",
      teamSize: "1",
      duration: "Oct 2024 - Present",
      status: "Live",
      highlights: [
        "Built a unified inspection workflow that combines validation, formatting, and multi-view exploration for complex payloads",
        "Implemented tree and grid renderers optimized for nested JSON structures with efficient expand and collapse interactions",
        "Reached 143 unique users with a 43% return rate, including one user with 49 sessions as of Mar 2026",
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
      name: "Markdown Visualizer",
      description:
        "Markdown editing and preview tool for fast iteration on technical writing workflows",
      role: "Product Engineer",
      teamSize: "1",
      duration: "Dec 2025 - Present",
      status: "Live",
      highlights: [
        "Built a low-latency editing and preview workflow to reduce context switching while drafting markdown-heavy content",
        "Implemented rendering and editing utilities that keep technical writing workflows responsive and predictable",
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
