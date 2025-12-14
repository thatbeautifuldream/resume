import type { Resume } from "./resume-schema";

export const resume: Resume = {
  basics: {
    name: "Milind Kumar Mishra",
    label: "Product Engineer",
    email: "milindmishra.work@gmail.com",
    phone: "+919631333128",
    url: "https://milindmishra.com",
    summary:
      "Frontend software engineer specializing in React, Next.js, and high-performance UI engineering. Skilled in building scalable, user-centric web applications with strong foundations in component architecture, design systems, performance optimization, and accessibility. Experienced in shipping AI-integrated SaaS platforms to large user bases. Active contributor to the React ecosystem and frequent speaker at community meetups.",
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
      startDate: "2025-02-21",
      logo: "/logos/merlin_ai_assistant_logo.jpeg",
      summary:
        "Product engineering ownership across Merlin AI and Thine, spanning core platform maintenance, growth, payments, churn reduction, and revenue-impacting product initiatives, alongside high-performance frontend development.",
      highlights: [
        // Merlin AI – Platform, Growth & Revenue
        "Took end-to-end ownership of Merlin AI’s platform health, including maintenance, stability, and production issue resolution across critical user flows.",
        "Led payments and subscription lifecycle improvements, optimizing billing reliability and reducing payment-related drop-offs.",
        "Designed and shipped churn-reduction strategies across cancellation and downgrade flows, directly improving customer retention.",
        "Drove revenue-focused product updates by identifying high-impact user friction points and shipping meaningful feature improvements to retain and upsell users.",
        "Shipped ChatGPT Imports UI, enabling 10,000+ users to migrate chat history seamlessly and accelerating product adoption.",
        "Built project-based chat history pages, improving navigation clarity and increasing session retention by 15%.",
        "Revamped the Model Selector, boosting model adoption by 80% and improving user satisfaction by 30%.",
        "Led real-time prompt and streaming UX enhancements, supporting smooth, responsive interactions for 2M+ users.",

        // Thine – Product Experience
        "Engineered animation-centric product experiences for Thine’s web platform with a strong focus on visual storytelling and brand expression.",
        "Developing an interactive landing page featuring a video timeline to communicate product narrative and value.",
        "Implemented advanced split-text and motion-driven animations to elevate engagement across manifesto and marketing pages.",
      ],
    },
    {
      name: "SARAL - The Influencer OS",
      location: "Bengaluru, Karnataka, India",
      position: "Software Engineer",
      url: "https://getsaral.com",
      logo: "/logos/getsaral_logo.jpeg",
      startDate: "2024-12-28",
      endDate: "2025-02-08",
      summary:
        "Built core features and internal tools improving efficiency and decision-making for influencer campaigns.",
      highlights: [
        "Delivered revamped dashboard—reduced onboarding and insight delivery time by 30%.",
        "Engineered a multi-select drag-and-drop feature for campaign management, increasing ops efficiency by 40% for large-scale campaigns.",
        "Built a content submission system to streamline influencer-brand collaboration, reducing content approval times by 60%.",
        "Enhanced real-time campaign metric tracking, empowering managers with data to improve campaign ROI by up to 20%.",
      ],
    },
    {
      name: "Proof-of-Skill Protocol",
      location: "Bengaluru, Karnataka, India",
      position: "Founding Product Engineer",
      url: "https://proofofskill.org",
      logo: "/logos/proof_of_skill_logo.jpeg",
      startDate: "2024-06-01",
      endDate: "2024-12-27",
      summary:
        "Architected and launched a decentralized skill validation protocol, revolutionizing unbiased, transparent candidate evaluation for tech hiring.",
      highlights: [
        "Led MVP development for validators, candidates, and recruiters.",
        "Designed and implemented a voting-based consensus algorithm to ensure fair and transparent skill validation across a network of 150+ validators.",
        "Built proctored assessment workflow with real-time streaming, cutting time-to-interview by 50%.",
        "Launched recruiter dashboard with skill heatmaps, driving smarter hiring for 20+ partners.",
        "Scaled cloud infra (EC2, NGINX, PM2, Next.js) to support 5000+ actions on the platform.",
      ],
    },
    {
      name: "Freelance",
      location: "Bengaluru, Karnataka, India",
      position: "Independent Contractor",
      url: "https://milindmishra.com",
      logo: "/logos/milind_mishra_technologies_logo.jpeg",
      startDate: "2024-02-01",
      endDate: "2024-05-31",
      summary:
        "Delivered AI-powered products for hiring and skills validation as an independent engineer.",
      highlights: [
        "Built recruiter analytics platform with advanced candidate search.",
        "Engineered an AI-powered quiz system with Vercel AI SDK and OpenAI.",
        "Deployed scalable Next.js UIs with AI workflow integration.",
      ],
    },
    {
      name: "StartupHire",
      location: "Remote",
      position: "Software Engineer",
      url: "https://www.linkedin.com/company/startuphire",
      logo: "/logos/startuphire_logo.jpeg",
      startDate: "2023-08-01",
      endDate: "2024-01-31",
      summary: "Built marketing pages and platform features.",
      highlights: [
        "Collaborated with team to build recruiting pipeline, reducing manual work for hiring managers.",
      ],
    },
    {
      name: "National Yang Ming Chiao Tung University",
      location: "Hsinchu, Taiwan",
      position: "Research Assistant",
      url: "https://www.nycu.edu.tw/",
      logo: "/logos/nycu_logo.jpeg",
      startDate: "2023-02-01",
      endDate: "2023-07-31",
      summary:
        "Built and optimized indoor positioning system interfaces for a cutting-edge IoT research project.",
      highlights: [
        "Developed a frontend for an MQTT-powered indoor positioning platform to visualize real-time data from IoT devices.",
        "Enhanced UWB positioning accuracy from 20cm to under 10cm—significantly improving research outcomes.",
        "Enabled 3D real-time visualization of tracking data for production ready factories and research labs.",
      ],
    },
    {
      name: "Locus Connect",
      location: "Hsinchu, Taiwan",
      position: "Software Engineer",
      url: "https://www.locusconnect.com/",
      logo: "/logos/locus_connect_logo.jpeg",
      startDate: "2022-07-01",
      endDate: "2023-01-31",
      summary:
        "Developed core 3D visualization and internal infra tools for proprietary IoT positioning solutions.",
      highlights: [
        "Produced frontend for 3D positioning platform, supporting live deployments.",
        "Created and maintained the marketing site for B2B outreach.",
        "Dockerized and maintained internal services, achieving 99.9% uptime and cutting deployment times by 80%.",
      ],
    },
    {
      name: "iNeuron.ai",
      location: "Bengaluru, Karnataka, India",
      position: "UX Designer",
      url: "https://www.ineuron.ai/",
      logo: "/logos/ineuron_ai_logo.jpeg",
      startDate: "2022-05-01",
      endDate: "2022-06-30",
      summary:
        "Designed intuitive user experiences and managed design systems for ed-tech platforms.",
      highlights: [
        "Created user flows for hiring and onboarding.",
        "Managed a scalable design system, increasing developer velocity by 30%.",
        "Crafted marketing collateral for two campaign launches, contributing to a 20% increase in lead generation.",
      ],
    },
    {
      name: "Plusklass",
      location: "Remote",
      position: "Technical Writer",
      url: "https://www.plusklass.com/",
      logo: "/logos/plusklass_logo.jpeg",
      startDate: "2022-01-01",
      endDate: "2022-04-30",
      summary:
        "Authored and curated technical content for HTML/CSS/JS modules, driving learning impact for novices.",
      highlights: [
        "Created beginner-friendly learning content adopted by 2,000+ new users.",
        "Structured and reviewed curriculum, improving student course completion rates by 40%.",
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
      "name": "Thine Landing",
      "description": "Animated landing experience for Thine, a reflective AI companion.",
      "highlights": [
        "Delivered smooth transitions, scroll animations, and expressive motion design.",
        "Designed with Tailwind, Framer Motion, and custom animation systems.",
        "Optimized for fast load performance and emotional impact."
      ],
      "url": "https://www.thine.com",
      "keywords": ["Tailwind CSS", "Framer Motion", "CSS Animation"],
      "date": "2025-11-01"
    },
    {
      "name": "Models Surf",
      "description": "Interactive directory for exploring, filtering, and comparing AI models and their capabilities.",
      "highlights": [
        "Built lightweight searchable UI optimized with virtualization.",
        "Designed for discoverability and developer-first exploration.",
        "Open-source and built with clean modular architecture."
      ],
      "url": "https://models.surf",
      "keywords": ["Next.js", "Models", "Virtualisation"],
      "date": "2025-09-01"
    },
    {
      "name": "Merlin Projects",
      "description": "AI-powered personal knowledge base for collecting, organizing, and querying content with contextual understanding.",
      "highlights": [
        "Supports search and retrieval using LLMs and RAG patterns.",
        "Built for organizing web links, notes, and documents into a unified knowledge layer.",
        "Optimized around latency and streaming user workflows with React Query.",
        "Delivered frictionless knowledge exploration through a clean interface."
      ],
      "url": "https://www.getmerlin.in/chat/projects",
      "keywords": ["Next.js", "React Query", "LLMs", "RAG"],
      "date": "2025-08-01"
    },
    {
      "name": "TypeScript Playground",
      "description": "Modern browser-based TS/JS playground with real-time execution and console output.",
      "highlights": [
        "Built using TypeScript Compiler API for accurate diagnostics and evaluation.",
        "Open-source tool used by learners and interviewers.",
        "Smooth execution sandbox with intuitive editor-console interactions."
      ],
      "url": "https://ts.milind.app",
      "keywords": ["Next.js", "TypeScript Compiler API", "Code Sandboxing"],
      "date": "2025-08-01"
    },
    {
      "name": "Rizzboard",
      "description": "Fun meme soundboard where your most played sounds float to the top.",
      "highlights": [
        "Built with delightful animations using Framer Motion.",
        "Persistent state using Zustand for ranking and usage tracking.",
        "Lightweight, fast and mobile-responsive."
      ],
      "url": "https://rizzboard.milind.app",
      "keywords": ["Next.js", "Framer Motion", "Zustand", "useSound"],
      "date": "2025-08-01"
    },
    {
      "name": "Saral Admin Dashboard",
      "description": "Revamped Saral’s admin dashboard with improved design system and visibility of operational metrics.",
      "highlights": [
        "Reduced onboarding time and improved data discoverability for internal teams.",
        "Delivered clean, intuitive UI powered by TanStack Router and Framer Motion.",
        "Improved insights and data aggregation flow across modules."
      ],
      "url": "https://milindmishra.com/project/saral-admin-dashboard",
      "keywords": ["TanStack Router", "Framer Motion", "Data Aggregation"],
      "date": "2025-01-01"
    },
    {
      "name": "JSON Visualizer",
      "description": "Interactive visualization tool for nested JSON data structures to aid debugging and comprehension.",
      "highlights": [
        "Supports large datasets with efficient tree traversal and grid views.",
        "Used by hundreds of developers for integration debugging and backend validation.",
        "Praised for clarity, performance, and usability compared to alternatives.",
        "Open-source and referenced within developer community discussions."
      ],
      "url": "https://jsonvisualiser.com",
      "keywords": ["React", "TypeScript", "D3.js"],
      "date": "2024-10-01"
    },
    {
      "name": "AI Roadmap Generator",
      "description": "Generates personalized learning paths leveraging LLMs and interactive visualizations.",
      "highlights": [
        "Built using Next.js, React, TypeScript, Canvas, and LLMs; used by thousands of engineers.",
        "Generated 250+ roadmaps and attracted over 5,600 unique visitors organically.",
        "Delivers real-time structured roadmap generation with intuitive navigation.",
        "Open-source with privacy-friendly sharing, topic clustering, and recommendations.",
        "Led full-stack architecture, visualization engine, and complete product UX."
      ],
      "url": "https://airoadmapgenerator.com",
      "keywords": ["Next.js", "React", "TypeScript", "Canvas", "LLMs"],
      "date": "2024-08-01"
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
