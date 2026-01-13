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
      logo: "/logos/merlin_ai_assistant_logo.jpeg",
      summary:
        "Product engineering ownership across Merlin AI and Thine, spanning platform stability, growth, revenue systems, churn reduction, and high-performance frontend experiences.",
      highlights: [
        "Owned platform health, stability, and production issue resolution across critical user flows serving 2M+ users.",
        "Improved payments and subscription lifecycle flows, reducing payment failures and churn-related drop-offs.",
        "Shipped churn-reduction initiatives across cancellation and downgrade journeys, improving customer retention.",
        "Drove revenue-focused product improvements by identifying and fixing high-impact user friction points.",
        "Shipped ChatGPT Imports UI enabling 10,000+ users to migrate chat history, accelerating product adoption.",
        "Built project-based chat history pages, increasing session retention by 15%.",
        "Revamped Model Selector UX, boosting model adoption by 80% and improving user satisfaction by 30%.",
        "Led real-time prompt streaming and interaction UX for responsive AI experiences.",
        "Engineered animation-heavy, motion-driven product and marketing experiences for Thine’s web platform.",
      ],
    },

    {
      name: "SARAL, Proof-of-Skill Protocol, Skillmates & StartupHire",
      location: "Bengaluru, Karnataka, India / Remote",
      position: "Software Engineer / Founding Product Engineer",
      workType: "Full Time / Contract",
      startDate: "2023-08-01",
      endDate: "2025-02-08",
      logo: "/logos/proof_of_skill_logo.jpeg",
      summary:
        "Early-stage and founding product engineering roles focused on hiring infrastructure, skill validation, growth tooling, and internal platforms in fast-moving startup environments.",
      highlights: [
        "Led MVP development across candidates, recruiters, and validators for decentralized skill validation platforms.",
        "Designed and implemented a voting-based consensus algorithm enabling fair skill validation across 150+ validators.",
        "Built proctored assessment workflows with real-time streaming, cutting time-to-interview by 50%.",
        "Launched recruiter dashboards with analytics, heatmaps, and advanced candidate search.",
        "Engineered AI-powered quiz and assessment systems using Vercel AI SDK and OpenAI.",
        "Developed job seeker dashboards and application flows improving candidate experience.",
        "Built internal tools and dashboards improving campaign ROI by up to 20%.",
        "Engineered multi-select drag-and-drop and content submission systems, improving ops efficiency by 40–60%.",
        "Designed and built marketing and landing pages driving user acquisition.",
        "Scaled cloud infrastructure (EC2, NGINX, PM2, Docker) supporting 5,000+ platform actions.",
        "Handled DevOps, internal tooling, and cross-functional collaboration in zero-to-one startup environments.",
      ],
    },

    {
      name: "Locus Connect × National Yang Ming Chiao Tung University (NYCU)",
      location: "Hsinchu, Taiwan",
      position: "Software Engineer & Research Assistant",
      workType: "Full Time",
      startDate: "2022-07-01",
      endDate: "2023-07-31",
      logo: "/logos/locus_connect_logo.jpeg",
      summary:
        "Industry–academia R&D collaboration focused on real-time IoT systems, 3D visualization, and high-accuracy indoor positioning.",
      highlights: [
        "Built real-time 3D positioning and visualization platforms for production factories and research labs.",
        "Improved UWB positioning accuracy from ~20cm to under 10cm, significantly enhancing research outcomes.",
        "Developed MQTT-powered dashboards to visualize real-time IoT device data.",
        "Dockerized and maintained internal services achieving 99.9% uptime.",
        "Reduced deployment times by 80% through containerization and CI improvements.",
        "Created B2B marketing and demo platforms supporting enterprise outreach.",
      ],
    },

    {
      name: "iNeuron.ai & Plusklass",
      location: "Bengaluru, Karnataka, India / Remote",
      position: "UX, Frontend & Technical Content Intern",
      workType: "Internship",
      startDate: "2022-01-01",
      endDate: "2022-06-30",
      logo: "/logos/ineuron_ai_logo.jpeg",
      summary:
        "Early-career foundation in UX design, design systems, frontend thinking, and technical education.",
      highlights: [
        "Designed intuitive user experiences and onboarding flows for ed-tech and hiring platforms.",
        "Managed and scaled a design system, increasing developer velocity by 30%.",
        "Crafted marketing collateral contributing to a 20% increase in lead generation.",
        "Authored beginner-friendly HTML, CSS, and JavaScript content adopted by 2,000+ learners.",
        "Structured and reviewed curriculum, improving course completion rates by 40%.",
      ],
    },
  ],

  education: [
    {
      institution: "National Yang Ming Chiao Tung University",
      url: "https://www.nycu.edu.tw/",
      logo: "/logos/nycu_logo.jpeg",
      area: "Computer Software Engineering",
      studyType: "Short Term Research Program",
      startDate: "2023-02-01",
      endDate: "2023-07-31",
    },
    {
      institution: "Visvesvaraya Technological University",
      url: "https://www.vtu.ac.in/",
      logo: "/logos/vtu_logo.jpeg",
      area: "Electronics and Communication",
      studyType: "Bachelor of Engineering",
      startDate: "2018-08-01",
      endDate: "2022-01-01",
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
    {
      name: "Frontend Product Engineering",
      level: "Advanced",
      keywords: [
        "React",
        "Next.js",
        "TypeScript",
        "Modern JavaScript",
        "UI Architecture",
        "Component Design",
        "State Management",
        "Performance Optimization",
        "Responsive Design",
        "Accessibility",
      ],
    },
    {
      name: "Product & UX",
      level: "Advanced",
      keywords: [
        "User Experience (UX)",
        "UI/UX Design",
        "Figma",
        "Workflow Optimization",
        "Human-Centered Design",
        "Rapid Prototyping",
        "Usability Testing",
      ],
    },
    {
      name: "AI Product Integration",
      level: "Intermediate",
      keywords: [
        "OpenAI APIs",
        "AI-Driven UX",
        "Prompt Engineering",
        "Conversational Interfaces",
        "Real-time Applications",
      ],
    },
    {
      name: "Cloud & DevOps",
      level: "Intermediate",
      keywords: [
        "AWS Basics (EC2, S3, CloudFront)",
        "GCP",
        "CI/CD Pipelines",
        "Docker",
        "Deployment Automation",
      ],
    },
    {
      name: "Collaboration & Product Delivery",
      level: "Intermediate",
      keywords: [
        "Product Management",
        "Agile Delivery",
        "Team Collaboration",
        "Cross-functional Communication",
        "Documentation",
        "Stakeholder Alignment",
      ],
    },
  ],
  projects: [
    {
      name: "Thine Landing",
      description:
        "Animated landing experience for Thine, a reflective AI companion.",
      highlights: [
        "Delivered smooth transitions, scroll animations, and expressive motion design.",
        "Designed with Tailwind, Framer Motion, and custom animation systems.",
        "Optimized for fast load performance and emotional impact.",
      ],
      url: "https://www.thine.com",
      keywords: ["Tailwind CSS", "Framer Motion", "CSS Animation"],
      date: "2025-11-01",
    },
    {
      name: "Models Surf",
      description:
        "Interactive directory for exploring, filtering, and comparing AI models and their capabilities.",
      highlights: [
        "Built lightweight searchable UI optimized with virtualization.",
        "Designed for discoverability and developer-first exploration.",
        "Open-source and built with clean modular architecture.",
      ],
      url: "https://models.surf",
      keywords: ["Next.js", "Models", "Virtualisation"],
      date: "2025-09-01",
    },
    {
      name: "Merlin Projects",
      description:
        "AI-powered personal knowledge base for collecting, organizing, and querying content with contextual understanding.",
      highlights: [
        "Supports search and retrieval using LLMs and RAG patterns.",
        "Built for organizing web links, notes, and documents into a unified knowledge layer.",
        "Optimized around latency and streaming user workflows with React Query.",
        "Delivered frictionless knowledge exploration through a clean interface.",
      ],
      url: "https://www.getmerlin.in/chat/projects",
      keywords: ["Next.js", "React Query", "LLMs", "RAG"],
      date: "2025-08-01",
    },
    {
      name: "TypeScript Playground",
      description:
        "Modern browser-based TS/JS playground with real-time execution and console output.",
      highlights: [
        "Built using TypeScript Compiler API for accurate diagnostics and evaluation.",
        "Open-source tool used by learners and interviewers.",
        "Smooth execution sandbox with intuitive editor-console interactions.",
      ],
      url: "https://ts.milind.app",
      keywords: ["Next.js", "TypeScript Compiler API", "Code Sandboxing"],
      date: "2025-08-01",
    },
    {
      name: "Rizzboard",
      description:
        "Fun meme soundboard where your most played sounds float to the top.",
      highlights: [
        "Built with delightful animations using Framer Motion.",
        "Persistent state using Zustand for ranking and usage tracking.",
        "Lightweight, fast and mobile-responsive.",
      ],
      url: "https://rizzboard.milind.app",
      keywords: ["Next.js", "Framer Motion", "Zustand", "useSound"],
      date: "2025-08-01",
    },
    {
      name: "Saral Admin Dashboard",
      description:
        "Revamped Saral’s admin dashboard with improved design system and visibility of operational metrics.",
      highlights: [
        "Reduced onboarding time and improved data discoverability for internal teams.",
        "Delivered clean, intuitive UI powered by TanStack Router and Framer Motion.",
        "Improved insights and data aggregation flow across modules.",
      ],
      url: "https://milindmishra.com/project/saral-admin-dashboard",
      keywords: ["TanStack Router", "Framer Motion", "Data Aggregation"],
      date: "2025-01-01",
    },
    {
      name: "JSON Visualizer",
      description:
        "Interactive visualization tool for nested JSON data structures to aid debugging and comprehension.",
      highlights: [
        "Supports large datasets with efficient tree traversal and grid views.",
        "Used by hundreds of developers for integration debugging and backend validation.",
        "Praised for clarity, performance, and usability compared to alternatives.",
        "Open-source and referenced within developer community discussions.",
      ],
      url: "https://jsonvisualiser.com",
      keywords: ["React", "TypeScript", "D3.js"],
      date: "2024-10-01",
    },
    {
      name: "AI Roadmap Generator",
      description:
        "Generates personalized learning paths leveraging LLMs and interactive visualizations.",
      highlights: [
        "Built using Next.js, React, TypeScript, Canvas, and LLMs; used by thousands of engineers.",
        "Generated 250+ roadmaps and attracted over 5,600 unique visitors organically.",
        "Delivers real-time structured roadmap generation with intuitive navigation.",
        "Open-source with privacy-friendly sharing, topic clustering, and recommendations.",
        "Led full-stack architecture, visualization engine, and complete product UX.",
      ],
      url: "https://airoadmapgenerator.com",
      keywords: ["Next.js", "React", "TypeScript", "Canvas", "LLMs"],
      date: "2024-08-01",
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
