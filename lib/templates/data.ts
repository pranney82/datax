export interface Template {
  id: string
  title: string
  badge: string
  downloadCount: number
  content: string
  footer?: string
  updatedAt: string
  createdBy: string
  type: string
  description: string
  includedItems: string[]
}

export const getTemplate = (id: string) => {
  return templatesData.find(template => template.id === id)
}

export const templatesData: Template[] = [
  {
    id: "bathroom-01",
    title: "Bathroom Template",
    badge: "Cost Group",
    downloadCount: 10,
    content: "Standard bathroom renovation template with common fixtures and labor costs.",
    description: "A comprehensive template for bathroom renovation projects, including detailed cost breakdowns and standard specifications.",
    includedItems: [
      "Cost breakdown structure",
      "Standard fixtures and fittings",
      "Common labor costs",
      "Typical timeline"
    ],
    updatedAt: "2024-03-20",
    createdBy: "John Doe",
    type: "Cost Group"
  },
  {
    id: "kitchen-01",
    title: "Kitchen Renovation",
    badge: "Premium",
    downloadCount: 156,
    content: "Complete kitchen remodeling template with appliance specifications and cabinet layouts.",
    description: "Detailed kitchen renovation planning template including cabinetry, appliances, and finishing specifications.",
    includedItems: [
      "Appliance specifications",
      "Cabinet layouts",
      "Countertop options",
      "Lighting plan"
    ],
    updatedAt: "2024-03-15",
    createdBy: "Sarah Smith",
    type: "Cost Group"
  },
  {
    id: "office-01",
    title: "Commercial Office Space",
    badge: "Commercial",
    downloadCount: 89,
    content: "Office space planning template with workstation layouts and infrastructure requirements.",
    description: "Professional template for commercial office space planning and cost estimation.",
    includedItems: [
      "Workstation layouts",
      "Network infrastructure",
      "HVAC requirements",
      "Lighting specifications"
    ],
    updatedAt: "2024-03-10",
    createdBy: "Mike Johnson",
    type: "Commercial"
  },
  {
    id: "landscape-01",
    title: "Garden Landscaping",
    badge: "Outdoor",
    downloadCount: 45,
    content: "Comprehensive landscaping template for residential gardens and outdoor spaces.",
    description: "Garden design and landscaping template with material specifications and plant selections.",
    includedItems: [
      "Plant selection guide",
      "Irrigation system",
      "Hardscape materials",
      "Lighting design"
    ],
    updatedAt: "2024-03-18",
    createdBy: "Emma Wilson",
    type: "Outdoor"
  },
  {
    id: "basement-01",
    title: "Basement Finishing",
    badge: "Residential",
    downloadCount: 67,
    content: "Template for basement renovation including waterproofing and finishing details.",
    description: "Complete basement finishing template with moisture control and space planning.",
    includedItems: [
      "Waterproofing specs",
      "HVAC considerations",
      "Lighting layout",
      "Egress requirements"
    ],
    updatedAt: "2024-03-12",
    createdBy: "Tom Brown",
    type: "Cost Group"
  },
  {
    id: "retail-01",
    title: "Retail Store Layout",
    badge: "Commercial",
    downloadCount: 123,
    content: "Retail space planning template with display layouts and customer flow patterns.",
    description: "Comprehensive retail store design template including fixtures and customer experience elements.",
    includedItems: [
      "Floor plan layouts",
      "Display fixtures",
      "Lighting design",
      "POS station setup"
    ],
    updatedAt: "2024-03-08",
    createdBy: "Lisa Chen",
    type: "Commercial"
  },
  {
    id: "garage-01",
    title: "Garage Conversion",
    badge: "Residential",
    downloadCount: 34,
    content: "Template for converting garage space into living area or workshop.",
    description: "Detailed garage conversion template with insulation and utility specifications.",
    includedItems: [
      "Insulation specs",
      "Electrical layout",
      "Ventilation plan",
      "Floor finishing"
    ],
    updatedAt: "2024-03-05",
    createdBy: "David Park",
    type: "Cost Group"
  },
  {
    id: "pool-01",
    title: "Swimming Pool Installation",
    badge: "Outdoor",
    downloadCount: 78,
    content: "Complete swimming pool construction template with equipment specifications.",
    description: "Swimming pool installation template including filtration and safety features.",
    includedItems: [
      "Pool specifications",
      "Equipment details",
      "Safety features",
      "Landscaping integration"
    ],
    updatedAt: "2024-03-02",
    createdBy: "Rachel Green",
    type: "Outdoor"
  },
  {
    id: "solar-01",
    title: "Solar Panel Installation",
    badge: "Green Energy",
    downloadCount: 245,
    content: "Solar panel system installation template with electrical specifications.",
    description: "Comprehensive solar installation template including mounting and electrical requirements.",
    includedItems: [
      "Panel specifications",
      "Mounting details",
      "Electrical requirements",
      "Inverter options"
    ],
    updatedAt: "2024-03-01",
    createdBy: "Alex Turner",
    type: "Sustainable"
  },
  {
    id: "restaurant-01",
    title: "Restaurant Kitchen",
    badge: "Commercial",
    downloadCount: 167,
    content: "Commercial kitchen design template with equipment layout and ventilation.",
    description: "Professional restaurant kitchen template including equipment specifications and safety features.",
    includedItems: [
      "Equipment layout",
      "Ventilation system",
      "Safety features",
      "Storage planning"
    ],
    updatedAt: "2024-02-28",
    createdBy: "Chris Wong",
    type: "Commercial"
  },
  {
    id: "smart-home-01",
    title: "Smart Home Integration",
    badge: "Technology",
    downloadCount: 198,
    content: "Smart home automation template with device specifications and network requirements.",
    description: "Complete smart home planning template including automation and security features.",
    includedItems: [
      "Device specifications",
      "Network requirements",
      "Security features",
      "Integration options"
    ],
    updatedAt: "2024-02-25",
    createdBy: "James Miller",
    type: "Technology"
  },
  {
    id: "gym-01",
    title: "Home Gym Design",
    badge: "Residential",
    downloadCount: 89,
    content: "Home gym design template with equipment layout and flooring specifications.",
    description: "Comprehensive home gym template including equipment placement and ventilation requirements.",
    includedItems: [
      "Equipment layout",
      "Flooring options",
      "Ventilation plan",
      "Storage solutions"
    ],
    updatedAt: "2024-02-22",
    createdBy: "Kate Anderson",
    type: "Residential"
  },
  {
    id: "deck-01",
    title: "Deck Construction",
    badge: "Outdoor",
    downloadCount: 145,
    content: "Outdoor deck construction template with material specifications and railing options.",
    description: "Detailed deck building template including material selections and safety requirements.",
    includedItems: [
      "Material specs",
      "Railing options",
      "Lighting plan",
      "Stairs design"
    ],
    updatedAt: "2024-02-20",
    createdBy: "Mark Thompson",
    type: "Outdoor"
  },
  {
    id: "studio-01",
    title: "Recording Studio",
    badge: "Specialty",
    downloadCount: 56,
    content: "Professional recording studio design template with acoustic treatment specifications.",
    description: "Complete recording studio template including soundproofing and equipment placement.",
    includedItems: [
      "Acoustic treatment",
      "Equipment layout",
      "Soundproofing specs",
      "HVAC considerations"
    ],
    updatedAt: "2024-02-18",
    createdBy: "Sam Rodriguez",
    type: "Specialty"
  },
  {
    id: "wine-cellar-01",
    title: "Wine Cellar Design",
    badge: "Luxury",
    downloadCount: 34,
    content: "Wine cellar construction template with climate control and storage specifications.",
    description: "Luxury wine cellar template including temperature control and racking systems.",
    includedItems: [
      "Climate control specs",
      "Racking systems",
      "Lighting design",
      "Security features"
    ],
    updatedAt: "2024-02-15",
    createdBy: "Pierre Dubois",
    type: "Luxury"
  },
  {
    id: "greenhouse-01",
    title: "Greenhouse Construction",
    badge: "Outdoor",
    downloadCount: 67,
    content: "Greenhouse building template with climate control and irrigation specifications.",
    description: "Complete greenhouse construction template including environmental control systems.",
    includedItems: [
      "Climate control",
      "Irrigation system",
      "Ventilation design",
      "Material specs"
    ],
    updatedAt: "2024-02-12",
    createdBy: "Helen Foster",
    type: "Outdoor"
  },
  {
    id: "ev-charging-01",
    title: "EV Charging Station",
    badge: "Green Energy",
    downloadCount: 178,
    content: "Electric vehicle charging station installation template with electrical specifications.",
    description: "Professional EV charging station template including power requirements and safety features.",
    includedItems: [
      "Electrical specs",
      "Safety features",
      "Installation guide",
      "Network requirements"
    ],
    updatedAt: "2024-02-10",
    createdBy: "Tony Stark",
    type: "Sustainable"
  },
  {
    id: "home-theater-01",
    title: "Home Theater Design",
    badge: "Entertainment",
    downloadCount: 123,
    content: "Home theater design template with audio-visual specifications and seating layout.",
    description: "Complete home theater template including acoustics and equipment specifications.",
    includedItems: [
      "AV equipment specs",
      "Seating layout",
      "Acoustic treatment",
      "Lighting control"
    ],
    updatedAt: "2024-02-08",
    createdBy: "Ryan Cooper",
    type: "Entertainment"
  },
  {
    id: "rooftop-garden-01",
    title: "Rooftop Garden",
    badge: "Green Living",
    downloadCount: 89,
    content: "Rooftop garden design template with structural considerations and plant selection.",
    description: "Urban rooftop garden template including weight load calculations and irrigation systems.",
    includedItems: [
      "Structural specs",
      "Plant selection",
      "Irrigation system",
      "Safety features"
    ],
    updatedAt: "2024-02-05",
    createdBy: "Maria Garcia",
    type: "Outdoor"
  },
  {
    id: "art-studio-01",
    title: "Art Studio Design",
    badge: "Specialty",
    downloadCount: 45,
    content: "Art studio design template with lighting and storage specifications.",
    description: "Professional art studio template including natural light optimization and ventilation.",
    includedItems: [
      "Lighting design",
      "Storage solutions",
      "Ventilation plan",
      "Work area layout"
    ],
    updatedAt: "2024-02-02",
    createdBy: "Nina Patel",
    type: "Specialty"
  }
] 