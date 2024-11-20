export interface HelpResource {
    id: string
    title: string
    type: 'article' | 'video'
    duration?: string // for videos
    readTime?: string // for articles
    thumbnail: string
    description: string
    topics: string[]
    updatedAt: string
    author: string
    content: string
  }
  
  export const helpResourceData: HelpResource[] = [
    {
      id: "getting-started",
      title: "Getting Started Guide",
      type: "article",
      readTime: "5 min",
      thumbnail: "/images/getting-started.jpg",
      description: "Learn the basics of our platform and how to set up your first project.",
      topics: [
        "Basics",
        "Setup",
        "Configuration"
      ],
      updatedAt: "2024-03-19",
      author: "Alex Chen",
      content: "Complete guide covering the essential features and setup process..."
    },
    {
      id: "project-management-tutorial",
      title: "Project Management Tutorial",
      type: "video",
      duration: "12:34",
      thumbnail: "/images/project-tutorial.jpg",
      description: "A comprehensive video tutorial on managing projects effectively.",
      topics: [
        "Project Management",
        "Best Practices",
        "Team Collaboration"
      ],
      updatedAt: "2024-03-15",
      author: "Sarah Johnson",
      content: "https://video-url.com/project-management-tutorial"
    },
    {
      id: "advanced-workflows",
      title: "Advanced Workflow Techniques",
      type: "article",
      readTime: "8 min",
      thumbnail: "/images/advanced-workflows.jpg",
      description: "Master advanced workflow patterns and automation strategies.",
      topics: ["Workflows", "Automation", "Productivity"],
      updatedAt: "2024-03-18",
      author: "Michael Zhang",
      content: "Detailed guide on implementing advanced workflow patterns..."
    },
    {
      id: "team-collaboration",
      title: "Effective Team Collaboration",
      type: "video",
      duration: "15:45",
      thumbnail: "/images/team-collab.jpg",
      description: "Learn best practices for collaborating with your team.",
      topics: ["Collaboration", "Communication", "Team Management"],
      updatedAt: "2024-03-17",
      author: "Emma Wilson",
      content: "https://video-url.com/team-collaboration"
    },
    {
      id: "security-best-practices",
      title: "Security Guidelines",
      type: "article",
      readTime: "10 min",
      thumbnail: "/images/security.jpg",
      description: "Essential security practices for protecting your projects.",
      topics: ["Security", "Best Practices", "Compliance"],
      updatedAt: "2024-03-16",
      author: "David Kumar",
      content: "Comprehensive guide on implementing security measures..."
    },
    {
      id: "api-integration",
      title: "API Integration Guide",
      type: "video",
      duration: "20:15",
      thumbnail: "/images/api-integration.jpg",
      description: "Step-by-step tutorial on integrating external APIs.",
      topics: ["API", "Integration", "Development"],
      updatedAt: "2024-03-14",
      author: "Rachel Martinez",
      content: "https://video-url.com/api-integration"
    },
    {
      id: "performance-optimization",
      title: "Performance Optimization Tips",
      type: "article",
      readTime: "7 min",
      thumbnail: "/images/performance.jpg",
      description: "Learn how to optimize your application's performance.",
      topics: ["Performance", "Optimization", "Best Practices"],
      updatedAt: "2024-03-13",
      author: "Tom Anderson",
      content: "Guide to improving application performance..."
    },
    {
      id: "user-onboarding",
      title: "User Onboarding Strategies",
      type: "video",
      duration: "18:30",
      thumbnail: "/images/onboarding.jpg",
      description: "Create effective user onboarding experiences.",
      topics: ["UX", "Onboarding", "User Experience"],
      updatedAt: "2024-03-12",
      author: "Lisa Park",
      content: "https://video-url.com/user-onboarding"
    },
    {
      id: "data-management",
      title: "Data Management Essentials",
      type: "article",
      readTime: "6 min",
      thumbnail: "/images/data-management.jpg",
      description: "Best practices for managing application data.",
      topics: ["Data", "Management", "Storage"],
      updatedAt: "2024-03-11",
      author: "Chris Taylor",
      content: "Complete guide to effective data management..."
    },
    {
      id: "testing-strategies",
      title: "Testing Best Practices",
      type: "video",
      duration: "25:00",
      thumbnail: "/images/testing.jpg",
      description: "Comprehensive guide to testing your applications.",
      topics: ["Testing", "Quality Assurance", "Development"],
      updatedAt: "2024-03-10",
      author: "Jennifer Lee",
      content: "https://video-url.com/testing-strategies"
    },
    {
      id: "deployment-guide",
      title: "Deployment Workflow Guide",
      type: "article",
      readTime: "9 min",
      thumbnail: "/images/deployment.jpg",
      description: "Learn how to set up efficient deployment pipelines.",
      topics: ["Deployment", "DevOps", "CI/CD"],
      updatedAt: "2024-03-09",
      author: "Mark Stevens",
      content: "Complete guide to deployment workflows..."
    },
    {
      id: "monitoring-analytics",
      title: "Monitoring and Analytics",
      type: "video",
      duration: "16:45",
      thumbnail: "/images/monitoring.jpg",
      description: "Set up comprehensive monitoring and analytics.",
      topics: ["Monitoring", "Analytics", "Observability"],
      updatedAt: "2024-03-08",
      author: "Sophie Chen",
      content: "https://video-url.com/monitoring-analytics"
    }
  ]
  
  export function getHelpResource(id: string) {
    return helpResourceData.find(resource => resource.id === id)
  } 