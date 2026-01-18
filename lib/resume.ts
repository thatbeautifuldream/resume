import type { Resume } from "./resume-schema";

export const resume: Resume = {
  basics: {
    name: "Milind Kumar Mishra",
    label: "Product Engineer",
    email: "milindmishra.work@gmail.com",
    phone: "+919631333128",
    url: "https://milindmishra.com",
    summary:
      "Software engineer specializing in React, Next.js, and high-performance UI engineering.",
    location: {
      address: "Zolo Darren, BTM Layout",
      postalCode: "560034",
      city: "Bengaluru",
      countryCode: "IN",
      region: "Karnataka",
    },
    timezone: "Asia/Kolkata",
    profiles: [
      {
        network: "LinkedIn",
        username: "mishramilind",
        url: "https://linkedin.com/in/mishramilind",
      },
      {
        network: "GitHub",
        username: "thatbeautifuldream",
        url: "https://github.com/thatbeautifuldream",
      },
      {
        network: "X",
        username: "milindmishra_",
        url: "https://x.com/milindmishra_",
      },
      {
        network: "YouTube",
        username: "milindmishra",
        url: "https://youtube.com/milindmishra",
      },
      {
        network: "Cal",
        username: "milind",
        url: "https://cal.com/milind",
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
        "Revamped Model Selector UX resulting lift in model adoption. Turned a boring list into a model discovery grid.",
        "Shipped ChatGPT history imports enabling 3.5K+ users to migrate from ChatGPT to Merlin.",
        "Drove retention and revenue wins, payment flow improvements reduced failures, churn interventions improved retention.",
        "Built real-time prompt enhancement streaming and interaction UX that feels instant because slow AI is broken AI.",
        "Engineered animation-heavy experiences for Thine, blending motion design with performance at scale.",
      ],
    },

    {
      name: "SARAL, Proof-of-Skill Protocol, Skillmates & StartupHire",
      location: "Bengaluru, Karnataka, India / Remote",
      position: "Software Engineer / Founding Product Engineer",
      workType: "Full Time / Contract",
      startDate: "2023-08-01",
      endDate: "2025-02-08",
      summary:
        "Built 0 to 1 hiring and skill validation platforms. Owned full-stack, growth tools, and product velocity in early-stage chaos.",
      highlights: [
        "Architected and shipped decentralized skill validation MVPs with voting consensus across 150+ validators. Turned hiring bias into algorithmic fairness.",
        "Built proctored assessments with real-time streaming—cut time-to-interview by 50%, because speed is a feature.",
        "Shipped recruiter dashboards (analytics, heatmaps, search) and candidate flows. Made hiring data actually useful.",
        "Built AI-powered assessment systems with Vercel AI SDK + OpenAI. Questions generated, not guessed.",
        "Shipped internal tools and ops dashboards that improved campaign ROI and ops efficiency. Made the team faster.",
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
        "Built 3D positioning and visualization systems for factories and labs. Improved UWB positioning from ~20cm to <10cm research-grade precision that shipped.",
        "Developed MQTT dashboards for real-time IoT device visualization. Made invisible data visible.",
        "Dockerized services, reduced deployment time by 80%, maintained 99.9% uptime. Boring infrastructure that just works.",
      ],
    },

    {
      name: "iNeuron.ai & Plusklass",
      location: "Bengaluru, Karnataka, India / Remote",
      position: "UX, Frontend & Technical Content Intern",
      workType: "Internship",
      startDate: "2022-01-01",
      endDate: "2022-06-30",
      summary:
        "UX, design systems, and technical education. First taste of shipping things people actually use.",
      highlights: [
        "Designed onboarding flows and managed a design system that increased dev velocity significantly.",
        "Wrote beginner-friendly HTML/CSS/JS content adopted by 2K+ learners. Improved course completion rates.",
        "Shipped marketing collateral that contributed to a 20% lead gen increase. Words and pixels that converted.",
      ],
    },
  ],
  education: [
    {
      institution: "National Yang Ming Chiao Tung University",
      url: "https://www.nycu.edu.tw/",
      area: "Computer Software Engineering",
      studyType: "Short Term Research Program",
      startDate: "2023-02-01",
      endDate: "2023-07-31",
    },
    {
      institution: "Visvesvaraya Technological University",
      url: "https://www.vtu.ac.in/",
      area: "Electronics and Communication",
      studyType: "Bachelor of Engineering",
      startDate: "2018-08-01",
      endDate: "2022-09-01",
    },
  ],
  certificates: [
    {
      name: "Next.js App Router Fundamentals",
      issuer: "Vercel",
      url: "https://nextjs.org/learn/certificate?course=dashboard-app&user=48654&certId=dashboard-app-48654-1745867386592",
    },
    {
      name: "Animations on the Web",
      issuer: "animations.dev",
      url: "https://animations.dev/certificate/3c66d48d-0d7a-4865-b023-e06ddfd71971",
    },
    {
      name: "AI for React Developers",
      issuer: "LinkedIn Learning",
      url: "https://www.linkedin.com/learning/certificates/28f048356a91802cc20a3af01c9a034faa62ac7628a02631142d2eb78062a781",
    },
    {
      name: "React: Design Patterns",
      issuer: "LinkedIn Learning",
      url: "https://www.linkedin.com/learning/certificates/bbb1d2307524475c1cc86d3c1dd77137a720dcc5f702ee1ee092d13354fa3c40",
    },
    {
      name: "React: State Management",
      issuer: "LinkedIn Learning",
      url: "https://www.linkedin.com/learning/certificates/325849cd7c3d9fc599c2acd78c01b63df82246724b77e4425a89d0c8c92460f4",
    },
    {
      name: "React (Basic)",
      issuer: "HackerRank",
      url: "https://www.hackerrank.com/certificates/57ce647802bb",
    },
  ],
  skills: [
    "TypeScript",
    "React",
    "State Management",
    "Performance Optimization",
    "Figma",
    "Product Thinking",
  ],
  projects: [
    {
      name: "AI Roadmap Generator",
      description:
        "Full-stack AI product that generates personalized learning roadmaps. 5,600+ organic users, zero marketing budget.",
      highlights: [
        "Shipped end-to-end: prompt design, structured LLM output parsing, canvas-based visualization, and responsive UX.",
        "Generated 250+ career roadmaps with real-time streaming. Turns vague goals into actionable learning paths.",
        "Built custom canvas rendering engine for interactive node-based navigation. Made learning plans feel explorable.",
      ],
      url: "https://airoadmapgenerator.com",
      keywords: ["Next.js", "React", "TypeScript", "Canvas", "LLMs"],
      date: "2024-08-01",
    },
    {
      name: "JSON Visualiser",
      description:
        "Open-source JSON debugging tool. Built because I wanted VSCode on the browser to visualise request/response.",
      highlights: [
        "143 unique users, 43% return rate. One developer used it 49 times—apparently it's less painful than alternatives.",
        "Format, validate, and explore JSON with tree/grid views. Handles deeply nested structures without choking.",
      ],
      url: "https://jsonvisualiser.com",
      keywords: ["React", "TypeScript", "D3.js"],
      date: "2024-10-01",
    },
  ],
  talks: [
    {
      event: "React Play Bengaluru Meetup",
      date: "2025-11-15",
      title: "Mastering ViewTransition in React for Stunning UI Updates",
      url: "https://www.meetup.com/reactplay-bengaluru/events/311437528",
      summary: "View transition animation and animation devtooling talk.",
    },
    {
      event: "React Play x React Bangalore Meetup",
      date: "2025-05-17",
      title: "Building Real-Time Applications with Reactive Databases",
      url: "https://www.meetup.com/reactplay-bengaluru/events/307690438/",
      summary: "Real-time applications with React and Convex.",
    },
    {
      event: "React Bangalore Meetup",
      date: "2025-04-12",
      title: "AI for React Developers",
      url: "https://www.meetup.com/reactjs-bangalore/events/306320480/",
      summary: "A deep-dive into Vercel's AI SDK.",
    },
  ],
  references: [
    {
      name: "Akash Bhadange",
      title: "CEO, Peerlist",
      reference:
        "100% AGREE! Also, the way team has launched the project is commendable. This is by far the most successful project launch on Peerlist - Appreciation on AI Roadmap Generator launch!",
    },
  ],
  contributions: [
    {
      repository: "https://github.com/vercel/streamdown",
      prs: [
        {
          title:
            "feat: add table markdown copy and csv/markdown download options #99",
          url: "https://github.com/vercel/streamdown/pull/99",
        },
        {
          title: "feat: add download functionality to code blocks #102",
          url: "https://github.com/vercel/streamdown/pull/102",
        },
        {
          title:
            "feat: add image download functionality with hover controls #103",
          url: "https://github.com/vercel/streamdown/pull/103",
        },
      ],
    },
    {
      repository: "https://github.com/vercel/ai-elements",
      prs: [
        {
          title:
            "feat: add speech to text input to prompt area and update test and example apps #112",
          url: "https://github.com/vercel/ai-elements/pull/112",
        },
      ],
    },
  ],
  volunteer: [],
  awards: [],
  languages: [],
};
