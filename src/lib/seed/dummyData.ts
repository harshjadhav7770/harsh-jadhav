import { PortfolioType } from "@/models/Installation";

export interface DummyDataPackage {
  profile: {
    professionalTitle: string;
    heroHeadline: string;
    heroSubheadline: string;
    heroIntroduction: string;
    typingWords: string[];
    yearsOfExperience: number;
    highlightStats: Array<{ label: string; value: string; order: number }>;
  };
  about: {
    biography: string;
    secondaryBio: string;
    interests: string[];
    learningApproach: {
      philosophy: string;
      practicalProcess: string;
      problemSolving: string;
      projectBased: string;
      continuousLearning: string;
    };
  };
  skillCategories: Array<{ name: string; slug: string; order: number }>;
  skills: Array<{
    name: string;
    categorySlug: string;
    proficiencyLevel: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    proficiencyPercent: number;
    yearsOfExperience: number;
    iconName: string;
    order: number;
  }>;
  projectCategories: Array<{ name: string; slug: string; order: number }>;
  projects: Array<{
    title: string;
    slug: string;
    shortDescription: string;
    fullDescription: string;
    problemStatement: string;
    solutionStatement: string;
    keyFeatures: string[];
    technologies: string[];
    categorySlug: string;
    projectType: "Personal" | "Client" | "Open Source" | "Academic";
    heroImageUrl: string;
    screenshots: Array<{
      imageUrl: string;
      caption: string;
      description?: string;
      order: number;
    }>;
    liveUrl?: string;
    sourceUrl?: string;
    isFeatured: boolean;
    order: number;
  }>;
}

export function getDummyData(type: PortfolioType, candidateName: string): DummyDataPackage {
  const isAnalytics = type === "data-analytics" || type === "both";
  const isFullStack = type === "full-stack" || type === "both";

  const title =
    type === "data-analytics"
      ? "Data Analyst & Business Intelligence Specialist"
      : type === "full-stack"
      ? "Full-Stack Software Engineer & Solutions Architect"
      : "Full-Stack Developer & Data Analytics Specialist";

  const heroHeadline =
    type === "data-analytics"
      ? "Transforming Complex Data into Actionable Business Insights"
      : type === "full-stack"
      ? "Architecting Scalable, Modern & High-Performance Web Applications"
      : "Bridging the Gap Between Scalable Engineering and Data Intelligence";

  const typingWords =
    type === "data-analytics"
      ? ["Data Analyst", "Power BI Specialist", "SQL Developer", "Python Programmer"]
      : type === "full-stack"
      ? ["Full-Stack Engineer", "Next.js Specialist", "Node.js Developer", "TypeScript Enthusiast"]
      : ["Full-Stack Engineer", "Data Analyst", "React & Next.js", "SQL & Power BI"];

  return {
    profile: {
      professionalTitle: title,
      heroHeadline,
      heroSubheadline: `Professional Portfolio of ${candidateName} — Built with modern engineering and high attention to detail.`,
      heroIntroduction:
        "Passionate technology practitioner dedicated to crafting robust solutions, turning business challenges into impactful digital products, and maintaining the highest standards of code and architectural clarity.",
      typingWords,
      yearsOfExperience: 2,
      highlightStats: [
        { label: "Completed Projects", value: "10+", order: 1 },
        { label: "Technologies Mastered", value: "15+", order: 2 },
        { label: "Code Quality & Tests", value: "99%", order: 3 },
      ],
    },
    about: {
      biography: `Hello! I'm ${candidateName}. I specialize in building modern, scalable digital systems and transforming data into actionable insights. Through disciplined practice, continuous learning, and hands-on project execution with SKILLHUB IT SOLUTION, I have developed strong foundational principles in design patterns, clean architecture, and performance optimization.`,
      secondaryBio:
        "When I'm not developing applications or analyzing data patterns, I actively contribute to technical communities, explore emerging technology trends, and refine my engineering processes.",
      interests: [
        "Distributed Systems",
        "Data Visualizations",
        "Cloud Architecture",
        "Open Source",
        "Clean Code Practices",
      ],
      learningApproach: {
        philosophy:
          "I believe in deep conceptual comprehension reinforced by rigorous practical implementation. Reading documentation is only the first step; true mastery comes from building real-world solutions.",
        practicalProcess:
          "My workflow follows a structured cadence: requirements breakdown, architecture diagramming, incremental test-driven implementation, and performance profiling.",
        problemSolving:
          "I approach complex bugs and bottlenecks methodically: isolating variables, analyzing logs, validating edge cases, and ensuring solutions prevent regressions.",
        projectBased:
          "Every theoretical concept I learn is anchored in an end-to-end working prototype with production-grade validation, error handling, and clean code principles.",
        continuousLearning:
          "I actively track official technical roadmaps, framework RFCs, security advisories, and industry standards to ensure my skill set remains cutting-edge.",
      },
    },
    skillCategories: [
      { name: "Programming Languages", slug: "programming-languages", order: 1 },
      ...(isFullStack
        ? [
            { name: "Frontend Development", slug: "frontend-development", order: 2 },
            { name: "Backend Development", slug: "backend-development", order: 3 },
          ]
        : []),
      { name: "Databases", slug: "databases", order: 4 },
      ...(isAnalytics
        ? [
            { name: "Data Analytics", slug: "data-analytics", order: 5 },
            { name: "Business Intelligence", slug: "business-intelligence", order: 6 },
          ]
        : []),
      { name: "Tools & Platforms", slug: "tools-platforms", order: 7 },
    ],
    skills: [
      ...(isAnalytics
        ? [
            {
              name: "Python",
              categorySlug: "programming-languages",
              proficiencyLevel: "Expert" as const,
              proficiencyPercent: 92,
              yearsOfExperience: 2,
              iconName: "FileCode",
              order: 1,
            },
            {
              name: "SQL",
              categorySlug: "databases",
              proficiencyLevel: "Expert" as const,
              proficiencyPercent: 95,
              yearsOfExperience: 2,
              iconName: "Database",
              order: 2,
            },
            {
              name: "Power BI",
              categorySlug: "business-intelligence",
              proficiencyLevel: "Expert" as const,
              proficiencyPercent: 90,
              yearsOfExperience: 2,
              iconName: "BarChart3",
              order: 3,
            },
            {
              name: "Pandas & NumPy",
              categorySlug: "data-analytics",
              proficiencyLevel: "Advanced" as const,
              proficiencyPercent: 88,
              yearsOfExperience: 2,
              iconName: "Table",
              order: 4,
            },
            {
              name: "Excel & Advanced DAX",
              categorySlug: "data-analytics",
              proficiencyLevel: "Advanced" as const,
              proficiencyPercent: 90,
              yearsOfExperience: 2,
              iconName: "FileSpreadsheet",
              order: 5,
            },
            {
              name: "Data Cleaning & ETL",
              categorySlug: "data-analytics",
              proficiencyLevel: "Expert" as const,
              proficiencyPercent: 92,
              yearsOfExperience: 2,
              iconName: "RefreshCw",
              order: 6,
            },
          ]
        : []),
      ...(isFullStack
        ? [
            {
              name: "TypeScript",
              categorySlug: "programming-languages",
              proficiencyLevel: "Expert" as const,
              proficiencyPercent: 90,
              yearsOfExperience: 2,
              iconName: "Code2",
              order: 7,
            },
            {
              name: "React & Next.js",
              categorySlug: "frontend-development",
              proficiencyLevel: "Expert" as const,
              proficiencyPercent: 95,
              yearsOfExperience: 2,
              iconName: "Layers",
              order: 8,
            },
            {
              name: "Tailwind CSS",
              categorySlug: "frontend-development",
              proficiencyLevel: "Expert" as const,
              proficiencyPercent: 92,
              yearsOfExperience: 2,
              iconName: "Palette",
              order: 9,
            },
            {
              name: "Node.js & Express",
              categorySlug: "backend-development",
              proficiencyLevel: "Advanced" as const,
              proficiencyPercent: 88,
              yearsOfExperience: 2,
              iconName: "Server",
              order: 10,
            },
            {
              name: "MongoDB & Mongoose",
              categorySlug: "databases",
              proficiencyLevel: "Advanced" as const,
              proficiencyPercent: 88,
              yearsOfExperience: 2,
              iconName: "Database",
              order: 11,
            },
            {
              name: "Git & GitHub",
              categorySlug: "tools-platforms",
              proficiencyLevel: "Expert" as const,
              proficiencyPercent: 92,
              yearsOfExperience: 2,
              iconName: "GitBranch",
              order: 12,
            },
          ]
        : []),
    ],
    projectCategories: [
      ...(isFullStack
        ? [
            { name: "Web Applications", slug: "web", order: 1 },
            { name: "Full Stack Systems", slug: "full-stack", order: 2 },
          ]
        : []),
      ...(isAnalytics
        ? [
            { name: "Data Analytics", slug: "analytics", order: 3 },
            { name: "Power BI Dashboards", slug: "power-bi", order: 4 },
            { name: "SQL Analytics", slug: "sql", order: 5 },
          ]
        : []),
    ],
    projects: [
      ...(isAnalytics
        ? [
            {
              title: "Enterprise Sales Performance Dashboard",
              slug: "sales-performance-dashboard",
              shortDescription:
                "Interactive Power BI executive dashboard analyzing multi-region revenue, KPI trends, and margin fluctuations.",
              fullDescription:
                "This comprehensive analytics project provides executive leadership with real-time visibility into regional sales performance, client retention trends, and product margin analytics. Built using advanced DAX modeling and automated ETL pipelines.",
              problemStatement:
                "Executive stakeholders lacked unified visibility across fragmented regional sales reports, leading to delayed decision-making and unrecognized inventory bottlenecks.",
              solutionStatement:
                "Developed a centralized Power BI reporting model connecting multi-channel data sources with automated data transformation routines, dynamic date tables, and role-based KPI views.",
              keyFeatures: [
                "Dynamic time intelligence analysis (MTD, QTD, YTD, YoY comparisons)",
                "Drill-through regional performance matrix with custom tooltips",
                "Automated data hygiene and currency normalization pipelines",
                "Custom visual KPI alert triggers for margin drops exceeding 5%",
              ],
              technologies: ["Power BI", "DAX", "SQL", "Excel", "Data Modeling"],
              categorySlug: "power-bi",
              projectType: "Personal" as const,
              heroImageUrl:
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
              screenshots: [
                {
                  imageUrl:
                    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
                  caption: "Executive Overview Dashboard",
                  description: "High-level KPI performance showing revenue by product line and geography.",
                  order: 1,
                },
                {
                  imageUrl:
                    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
                  caption: "Regional Breakdown & Drill-Through",
                  description: "Detailed drill-through sheet displaying store-level variance analysis.",
                  order: 2,
                },
              ],
              liveUrl: "https://www.skillhubdev.com",
              sourceUrl: "https://github.com",
              isFeatured: true,
              order: 1,
            },
            {
              title: "Customer Segmentation & Behavioral Analysis",
              slug: "customer-segmentation-analysis",
              shortDescription:
                "Python RFM analysis and K-Means clustering model identifying high-value customer cohorts.",
              fullDescription:
                "Applied Recency, Frequency, and Monetary (RFM) segmentation along with unsupervised machine learning to classify 50,000+ consumer transactions into distinct behavioral groups to optimize marketing ROI.",
              problemStatement:
                "The business treated all customers with uniform marketing blasts, causing poor conversion rates and unsubscribes among top-tier repeat buyers.",
              solutionStatement:
                "Engineered an automated RFM calculation script with Python and Pandas, determined optimal cluster count using the elbow method, and visualized cohort characteristics.",
              keyFeatures: [
                "Automated outlier detection and data cleaning with Pandas and NumPy",
                "RFM scoring engine outputting tier rankings (Champions, Loyal, At Risk)",
                "Interactive clustering visualizations using Seaborn and Matplotlib",
                "Actionable campaign recommendations tailored for each customer tier",
              ],
              technologies: ["Python", "Pandas", "NumPy", "Matplotlib", "SQL", "Scikit-Learn"],
              categorySlug: "analytics",
              projectType: "Personal" as const,
              heroImageUrl:
                "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80",
              screenshots: [
                {
                  imageUrl:
                    "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80",
                  caption: "RFM Cluster Distribution",
                  description: "Scatter plot illustrating monetary score vs recency distribution across segments.",
                  order: 1,
                },
              ],
              liveUrl: "https://www.skillhubdev.com",
              sourceUrl: "https://github.com",
              isFeatured: false,
              order: 2,
            },
          ]
        : []),
      ...(isFullStack
        ? [
            {
              title: "Next.js E-Commerce SaaS Architecture",
              slug: "ecommerce-saas-platform",
              shortDescription:
                "Modern multi-tenant web application featuring server-side rendering, cart persistence, and Stripe checkout.",
              fullDescription:
                "Built from scratch with Next.js App Router, TypeScript, and MongoDB. Delivers sub-second page transitions, dynamic product filtering, responsive UI components with Tailwind CSS, and secure checkout processing.",
              problemStatement:
                "Traditional single-page apps suffered from poor SEO indexation, slow first contentful paint on mobile devices, and clunky cart synchronization.",
              solutionStatement:
                "Implemented hybrid React Server Components for instantaneous initial renders and SEO optimization, coupled with optimistic UI updates for cart modifications.",
              keyFeatures: [
                "Full React Server Component architecture with dynamic metadata for top SEO rankings",
                "Instant search and category faceted filtering with URL state persistence",
                "Secure administrative management portal for inventory and order management",
                "Mobile-first responsive interface tested across 10+ viewport sizes",
              ],
              technologies: ["Next.js", "TypeScript", "Tailwind CSS", "MongoDB", "Node.js", "Stripe"],
              categorySlug: "web",
              projectType: "Personal" as const,
              heroImageUrl:
                "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
              screenshots: [
                {
                  imageUrl:
                    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
                  caption: "Storefront & Catalog View",
                  description: "Responsive product grid with instant category filtering and search.",
                  order: 1,
                },
                {
                  imageUrl:
                    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
                  caption: "Administrative Inventory View",
                  description: "Protected administrative view for stock tracking and pricing updates.",
                  order: 2,
                },
              ],
              liveUrl: "https://www.skillhubdev.com",
              sourceUrl: "https://github.com",
              isFeatured: true,
              order: 3,
            },
            {
              title: "Collaborative Task & Sprint Manager",
              slug: "collaborative-task-manager",
              shortDescription:
                "Real-time productivity platform with drag-and-drop Kanban boards and sprint metrics.",
              fullDescription:
                "A full-stack project tracking application designed for engineering squads. Integrates optimistic board updates, team role permissions, and sprint velocity charts.",
              problemStatement:
                "Distributed teams experienced latency lag during status meetings when updating sprint backlog tasks simultaneously.",
              solutionStatement:
                "Engineered a snappy client-side state model synced with optimistic server actions and secure JWT token authorization.",
              keyFeatures: [
                "Drag-and-drop Kanban interface with column limits and swimlanes",
                "Detailed task modal with markdown descriptions, checklists, and tags",
                "Sprint velocity and burn-down reporting charts",
                "Fine-grained member authorization roles",
              ],
              technologies: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Mongoose"],
              categorySlug: "web",
              projectType: "Personal" as const,
              heroImageUrl:
                "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80",
              screenshots: [
                {
                  imageUrl:
                    "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80",
                  caption: "Sprint Kanban Board",
                  description: "Active sprint view displaying task cards categorized by progress state.",
                  order: 1,
                },
              ],
              liveUrl: "https://www.skillhubdev.com",
              sourceUrl: "https://github.com",
              isFeatured: false,
              order: 4,
            },
          ]
        : []),
    ],
  };
}
