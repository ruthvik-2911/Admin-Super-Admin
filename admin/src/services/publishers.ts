export interface Publisher {
  id: string
  name: string
  contactPerson: string
  location: string
  status: "Active" | "Inactive"
  lastActive: string
  mobile: string
  email: string
  address?: string
  latitude?: number
  longitude?: number
}

export interface AdCampaign {
  id: string
  title: string
  status: "Active" | "Expired" | "Draft"
  startDate: string
  endDate: string
  impressions: number
  clicks: number
  ctr: number
}

export interface PublisherAnalytics {
  publisher: Publisher
  stats: {
    totalAds: number
    activeCampaigns: number
    impressions: number
    clicks: number
    ctr: number
  }
  trends: {
    date: string
    impressions: number
    clicks: number
  }[]
  campaigns: AdCampaign[]
}

const generateMockPublishers = (count: number): Publisher[] => {
  const locations = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat"]
  const names = ["Retail Hub", "Tech Solutions", "Fresh Mart", "Global Logistics", "Alpha Services", "Omega Trade", "Prime Electronics", "Star Foods"]
  
  return Array.from({ length: count }).map((_, index) => {
    const id = `PUB${1000 + index}`
    const location = locations[Math.floor(Math.random() * locations.length)]
    const name = `${names[Math.floor(Math.random() * names.length)]} ${location}`
    
    return {
      id,
      name,
      contactPerson: `Person ${index + 1}`,
      mobile: `+91 9${Math.floor(100000000 + Math.random() * 900000000)}`,
      email: `contact${index}@${name.toLowerCase().replace(/ /g, '')}.com`,
      location,
      status: Math.random() > 0.2 ? "Active" : "Inactive",
      lastActive: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString()
    }
  })
}

// Global mock state so it persists during navigation
let mockPublishers = generateMockPublishers(45)

export interface FetchPublishersArgs {
  page: number
  limit: number
  search?: string
  status?: string
}

export interface FetchPublishersResult {
  data: Publisher[]
  totalItems: number
  totalPages: number
}

export const fetchPublishers = async ({ page, limit, search, status }: FetchPublishersArgs): Promise<FetchPublishersResult> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))
  
  let filteredData = [...mockPublishers]

  if (search) {
    const s = search.toLowerCase()
    filteredData = filteredData.filter(p => 
      p.name.toLowerCase().includes(s) || 
      p.location.toLowerCase().includes(s) || 
      p.contactPerson.toLowerCase().includes(s)
    )
  }

  if (status && status !== "All") {
    filteredData = filteredData.filter(p => p.status === status)
  }

  const totalItems = filteredData.length
  const totalPages = Math.ceil(totalItems / limit)
  
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  
  const paginatedData = filteredData.slice(startIndex, endIndex)

  return {
    data: paginatedData,
    totalItems,
    totalPages
  }
}

export const togglePublisherStatus = async (id: string): Promise<Publisher> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  
  const index = mockPublishers.findIndex(p => p.id === id)
  if (index === -1) throw new Error("Publisher not found")
  
  const currentStatus = mockPublishers[index].status
  const newStatus = currentStatus === "Active" ? "Inactive" : "Active"
  
  mockPublishers[index] = { ...mockPublishers[index], status: newStatus }
  return mockPublishers[index]
}

export const getPublisherById = async (id: string): Promise<Publisher> => {
  await new Promise(resolve => setTimeout(resolve, 300))
  const publisher = mockPublishers.find(p => p.id === id)
  if (!publisher) throw new Error("Publisher not found")
  // Adding mock extra fields for the form that the base model didn't use initially
  return {
    ...publisher,
    address: `${publisher.location} High Street, 123 Building`,
    latitude: 19.0760 + (Math.random() * 0.1),
    longitude: 72.8777 + (Math.random() * 0.1)
  } as Publisher & { address: string; latitude: number; longitude: number }
}

export const createPublisher = async (data: any): Promise<Publisher> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  const newPub = {
    id: `PUB${1000 + mockPublishers.length}`,
    name: data.name,
    contactPerson: data.contactPerson,
    mobile: data.mobile,
    email: data.email,
    location: "New Location", // Derived locally in real app
    status: "Active" as const,
    lastActive: "Just now",
  }
  mockPublishers.unshift(newPub)
  return newPub
}

export const updatePublisher = async (id: string, data: any): Promise<Publisher> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  const index = mockPublishers.findIndex(p => p.id === id)
  if (index === -1) throw new Error("Publisher not found")
  
  mockPublishers[index] = {
    ...mockPublishers[index],
    name: data.name,
    contactPerson: data.contactPerson,
    mobile: data.mobile,
    email: data.email
  }
  return mockPublishers[index]
}

export const fetchPublisherAnalytics = async (id: string): Promise<PublisherAnalytics> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  const pub = await getPublisherById(id)
  
  const trends = Array.from({ length: 14 }).map((_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (13 - i))
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      impressions: Math.floor(Math.random() * 5000) + 1000,
      clicks: Math.floor(Math.random() * 200) + 20
    }
  })

  const totalImpressions = trends.reduce((acc, curr) => acc + curr.impressions, 0)
  const totalClicks = trends.reduce((acc, curr) => acc + curr.clicks, 0)

  const campaigns: AdCampaign[] = [
    {
      id: "CMP001",
      title: "Summer Sale Display",
      status: "Active",
      startDate: "2026-04-01",
      endDate: "2026-04-30",
      impressions: 12500,
      clicks: 420,
      ctr: parseFloat(((420 / 12500) * 100).toFixed(1))
    },
    {
      id: "CMP002",
      title: "Weekend Special",
      status: "Expired",
      startDate: "2026-03-25",
      endDate: "2026-03-28",
      impressions: 8400,
      clicks: 156,
      ctr: parseFloat(((156 / 8400) * 100).toFixed(1))
    },
    {
      id: "CMP003",
      title: "New Outlet Launch",
      status: "Active",
      startDate: "2026-04-10",
      endDate: "2026-05-10",
      impressions: 4200,
      clicks: 89,
      ctr: parseFloat(((89 / 4200) * 100).toFixed(1))
    },
    {
      id: "CMP004",
      title: "Monsoon Pre-booking",
      status: "Draft",
      startDate: "-",
      endDate: "-",
      impressions: 0,
      clicks: 0,
      ctr: 0
    }
  ]

  return {
    publisher: pub,
    stats: {
      totalAds: 12,
      activeCampaigns: campaigns.filter(c => c.status === "Active").length,
      impressions: totalImpressions,
      clicks: totalClicks,
      ctr: parseFloat(((totalClicks / totalImpressions) * 100).toFixed(1))
    },
    trends,
    campaigns
  }
}
