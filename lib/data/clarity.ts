export const clarityStats = {
  project: {
    name: "Milind's Resume",
    dateRange: {
      from: "2024-12-22",
      to: "2025-12-21",
    },
  },

  overview: {
    sessions: {
      total: 624,
      bot: 71,
      human: 553,
    },
    users: {
      unique: 365,
      newSessions: 377,
      returningSessions: 247,
    },
    engagement: {
      pagesPerSessionAvg: 1.9,
      scrollDepthAvgPercent: 69.32,
      activeTimeSeconds: 70,
      totalTimeSeconds: 237,
    },
  },

  behaviorInsights: {
    rageClicks: { sessions: 3, percentage: 0.48 },
    deadClicks: { sessions: 49, percentage: 7.85 },
    excessiveScrolling: { sessions: 1, percentage: 0.16 },
    quickBackClicks: { sessions: 97, percentage: 15.54 },
  },

  audience: {
    devices: {
      pc: { sessions: 346, percentage: 55.45 },
      mobile: { sessions: 266, percentage: 42.63 },
      tablet: { sessions: 12, percentage: 1.92 },
    },
    operatingSystems: {
      macOS: 264,
      iOS: 163,
      android: 115,
      windows: 74,
      linux: 8,
    },
    countries: [
      { country: "India", sessions: 490 },
      { country: "United States", sessions: 31 },
      { country: "Canada", sessions: 15 },
      { country: "Singapore", sessions: 13 },
    ],
  },

  contentPerformance: {
    topPages: [
      { label: "/", sessions: 587 },
      { label: "/chat", sessions: 143 },
      { label: "/projects", sessions: 27 },
      { label: "/cal", sessions: 26 },
    ],
  },

  performance: {
    score: 85.65,
    coreWebVitals: {
      lcpSeconds: 1.88,
      inpMs: 176,
      cls: 0.002,
    },
  },

  funnels: {
    resumeToChat: {
      conversionRatePercent: 18.1,
      sessionsConverted: 105,
      medianTimeSeconds: 24,
    },
  },
};
