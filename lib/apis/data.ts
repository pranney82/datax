export interface APIScript {
  id: string
  title: string
  badge: string
  downloadCount: number
  content: string
  description: string
  includedItems: string[]
  updatedAt: string
  createdBy: string
  type: string
  language?: string
  version?: string
}

export const apiScriptData: APIScript[] = [
  {
    id: "cost-calculator-api",
    title: "Cost Calculator API",
    badge: "REST API",
    downloadCount: 234,
    content: "RESTful API for construction cost calculations with material and labor estimates.",
    description: "A robust REST API that provides endpoints for calculating construction costs, including materials, labor, and overhead estimates. Includes authentication and rate limiting.",
    includedItems: [
      "API documentation",
      "Authentication endpoints",
      "Cost calculation endpoints",
      "Rate limiting middleware"
    ],
    updatedAt: "2024-03-19",
    createdBy: "Alex Chen",
    type: "REST API",
    version: "2.1.0"
  },
  {
    id: "material-inventory-sync",
    title: "Material Inventory Sync Script",
    badge: "Python",
    downloadCount: 156,
    content: "Automated script for syncing material inventory across multiple systems.",
    description: "Python script that synchronizes material inventory data between various construction management systems using their respective APIs.",
    includedItems: [
      "Sync script",
      "Configuration template",
      "Error handling",
      "Logging system"
    ],
    updatedAt: "2024-03-15",
    createdBy: "Sarah Johnson",
    type: "Script",
    language: "Python"
  },
  {
    id: "project-timeline-api",
    title: "Project Timeline API",
    badge: "GraphQL",
    downloadCount: 189,
    content: "GraphQL API for managing construction project timelines and milestones.",
    description: "Modern GraphQL API for creating and managing construction project timelines, with support for dependencies and resource allocation.",
    includedItems: [
      "GraphQL schema",
      "Query resolvers",
      "Mutation resolvers",
      "Timeline algorithms"
    ],
    updatedAt: "2024-03-12",
    createdBy: "Mike Wilson",
    type: "GraphQL API",
    version: "1.5.0"
  },
  {
    id: "permit-automation",
    title: "Permit Application Automation",
    badge: "Node.js",
    downloadCount: 123,
    content: "Automated script for handling construction permit applications.",
    description: "Node.js script that automates the process of submitting and tracking construction permit applications through various municipal systems.",
    includedItems: [
      "Automation script",
      "Form templates",
      "PDF generation",
      "Status tracking"
    ],
    updatedAt: "2024-03-10",
    createdBy: "Emma Davis",
    type: "Script",
    language: "JavaScript"
  },
  {
    id: "resource-allocation-api",
    title: "Resource Allocation API",
    badge: "REST API",
    downloadCount: 167,
    content: "API for managing construction resource allocation and scheduling.",
    description: "RESTful API designed for optimal resource allocation in construction projects, including equipment and personnel scheduling.",
    includedItems: [
      "API endpoints",
      "Scheduling algorithm",
      "Resource optimization",
      "Conflict resolution"
    ],
    updatedAt: "2024-03-08",
    createdBy: "Tom Brown",
    type: "REST API",
    version: "1.2.0"
  }
  // ... Add more items following similar pattern
]

export function getAPIScript(id: string) {
  return apiScriptData.find(script => script.id === id)
} 