import type { Resume } from "./resume-schema";

export const resume: Resume = {
  basics: {
    name: "Milind Kumar Mishra",
    label: "Product Engineer",
    email: "milindmishra.work@gmail.com",
    phone: "+919631333128",
    url: "https://milindmishra.com",
    summary:
      "Full-stack software engineer specializing in React, Next.js, and scalable product engineering. Experienced in building AI-integrated SaaS platforms serving millions of users with solid foundations in system design, component architecture, and performance optimization. Contributor to open-source at Vercel and frequent speaker at React community meetups.",
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
      name: "Thine by Foyer",
      location: "Bangalore Urban, Karnataka, India",
      position: "Design Engineer",
      logo: "/logos/alwaysthine_logo.jpeg",
      startDate: "2025-10-01",
      summary:
        "Designing advanced, animation-centric product experiences for Thine's web platform.",
      highlights: [
        "Building a new landing page with an advanced video timeline for engaging media-rich introductions.",
        "Creating split text animations for the manifesto and marketing pages, enhancing visual storytelling.",
      ],
    },
    {
      name: "Merlin AI by Foyer",
      location: "Bengaluru, Karnataka, India",
      position: "Product Engineer",
      url: "https://getmerlin.in",
      logo: "/logos/merlin_ai_assistant_logo.jpeg",
      startDate: "2025-02-21",
      endDate: "2025-10-01",
      summary:
        "Driving product engineering initiatives for Merlin AI, focused on seamless AI integration and next-gen chat experiences.",
      highlights: [
        "Shipped ChatGPT Imports UI, enabling 10,000+ users to migrate chat history smoothly.",
        "Launched project-based chat history pages, improving user navigation and increasing session retention by 15%.",
        "Revamped the Model Selector, boosting model adoption by 80% and improving user satisfaction scores by 30%.",
        "Led development of a prompt enhancement feature, improving real-time UX for 2M+ users by bridging backend streaming with a responsive frontend.",
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
      name: "AI Roadmap Generator",
      description:
        "Web app generating personalized and visual learning roadmaps powered by Next.js, React, Canvas, and LLMs. Used by thousands of learners and engineers to break down any tech domain.",
      highlights: [
        "Generated over 250 roadmaps and reached 5,600+ unique visitors within months of launch.",
        "Features real-time topic-to-roadmap generation with highly interactive visualizations, empowering rapid self-learning.",
        "Recognized as a successful project launch on Peerlist; highlighted for exceptional product execution.",
        "Includes privacy-friendly, shareable roadmaps and book recommendations, all built with scalable, privacy-first engineering.",
        "Led frontend, LLM integration, and roadmap visualization; orchestrated team-wide product improvements.",
      ],
      url: "https://airoadmapgenerator.com",
      keywords: ["Next.js", "React", "TypeScript", "OpenAI", "Figma"],
    },
    {
      name: "Sideprojects Directory",
      description:
        "Platform surfacing and auto-profiling open-source side projects from GitHub, growing project visibility and developer collaboration.",
      highlights: [
        "Indexed dozens of unique side projects, driving organic discovery and supporting project-based hiring.",
        "Enabled GitHub-based auto-profile import, reducing project onboarding to seconds.",
        "Facilitated connections between early-stage engineers, makers, and hiring managers.",
        "Improved open-source visibility, with multiple projects receiving new contributors through directory exposure.",
      ],
      url: "https://sideprojects.directory",
      keywords: ["Next.js", "React", "TypeScript", "GitHub API", "Vercel"],
    },
    {
      name: "JSON Visualizer",
      description:
        "Interactive tool for tree/grid visualization of complex JSON, built for dev teams to debug and understand frontend/backend data structures.",
      highlights: [
        "Adopted by hundreds of developers for production debugging and API integration.",
        "Supports large dataset rendering and deep tree navigation; praised for performance vs. other online tools.",
        "Open-source and extensible, referenced as a recommended resource in developer forums.",
        "Designed intuitive UI for both technical and non-technical users, reducing time to diagnose data issues.",
      ],
      url: "https://jsonvisualiser.com",
      keywords: [
        "Next.js",
        "React",
        "TypeScript",
        "Zustand",
        "Monaco",
        "json-tree",
      ],
    },
  ],
  talks: [
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
      reference:
        "100% AGREE! Also, the way team has launched the project is commendable. This is by far the most successful project launch on Peerlist",
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
