export type AdStatus = "Pending" | "Active" | "Expired"
export type PaymentStatus = "Paid" | "Pending" | "Failed"

export interface Advertisement {
  id: string
  title: string
  publishers: string[]
  status: AdStatus
  startDate: string
  endDate: string
  impressions: number
  clicks: number
  ctr: number
  paymentStatus: PaymentStatus
}

const generateMockAds = (count: number): Advertisement[] => {
  const titles = ["Summer Mega Sale", "Winter Clearance", "New Store Launch", "Festive Offers", "Weekend Flash Deals", "Buy 1 Get 1 Free", "End of Season Sale"]
  const pubs = ["Phoenix Mall", "High Street Branch", "Global Hub", "Downtown Store", "Airport Outlet"]
  
  return Array.from({ length: count }).map((_, index) => {
    const isExpired = Math.random() > 0.8
    const isPending = Math.random() > 0.7
    
    let status: AdStatus = "Active"
    let paymentStatus: PaymentStatus = "Paid"
    
    if (isExpired) {
      status = "Expired"
    } else if (isPending) {
      status = "Pending"
      paymentStatus = "Pending"
    }

    const impressions = status === "Pending" ? 0 : Math.floor(1000 + Math.random() * 50000)
    const clicks = status === "Pending" ? 0 : Math.floor(impressions * (Math.random() * 0.05))
    const ctr = impressions > 0 ? parseFloat(((clicks / impressions) * 100).toFixed(1)) : 0

    // Random startDate spanning roughly around today
    const startOffset = Math.floor(Math.random() * 60) - 30
    const startDateObj = new Date()
    startDateObj.setDate(startDateObj.getDate() + startOffset)
    
    const endDateObj = new Date(startDateObj)
    endDateObj.setDate(endDateObj.getDate() + Math.floor(Math.random() * 30) + 7)

    return {
      id: `AD${2000 + index}`,
      title: `${titles[Math.floor(Math.random() * titles.length)]} ${2026}`,
      publishers: [pubs[Math.floor(Math.random() * pubs.length)], pubs[Math.floor(Math.random() * pubs.length)]].slice(0, Math.floor(Math.random() * 2) + 1),
      status,
      startDate: startDateObj.toISOString().split("T")[0],
      endDate: endDateObj.toISOString().split("T")[0],
      impressions,
      clicks,
      ctr,
      paymentStatus
    }
  })
}

// Global mock state
let mockAds = generateMockAds(65)

export interface FetchAdsArgs {
  page: number
  limit: number
  search?: string
  status?: string | string[]
  publisher?: string
  dateRange?: { start?: string; end?: string }
}

export interface FetchAdsResult {
  data: Advertisement[]
  totalItems: number
  totalPages: number
  uniquePublishers: string[]
}

export const fetchAds = async ({ page, limit, search, status, publisher, dateRange }: FetchAdsArgs): Promise<FetchAdsResult> => {
  await new Promise(resolve => setTimeout(resolve, 600)) // delay

  let filtered = [...mockAds]

  if (search) {
    const s = search.toLowerCase()
    filtered = filtered.filter(ad => 
      ad.title.toLowerCase().includes(s) || 
      ad.publishers.some(p => p.toLowerCase().includes(s))
    )
  }

  if (status && status !== "All") {
    if (Array.isArray(status)) {
      if (status.length > 0) {
        filtered = filtered.filter(ad => status.includes(ad.status))
      }
    } else {
      filtered = filtered.filter(ad => ad.status === status)
    }
  }

  if (publisher && publisher !== "All") {
    filtered = filtered.filter(ad => ad.publishers.includes(publisher))
  }

  if (dateRange) {
    // Basic date parsing logic for mock
    if (dateRange.start) {
      filtered = filtered.filter(ad => new Date(ad.startDate) >= new Date(dateRange.start!))
    }
    if (dateRange.end) {
      filtered = filtered.filter(ad => new Date(ad.startDate) <= new Date(dateRange.end!))
    }
  }

  // Get unique publishers from the full dataset (not just filtered) so the dropdown is always populated
  const uniquePublishers = Array.from(new Set(mockAds.flatMap(ad => ad.publishers))).sort()

  const totalItems = filtered.length
  const totalPages = Math.ceil(totalItems / limit) || 1
  const paginated = filtered.slice((page - 1) * limit, page * limit)

  return {
    data: paginated,
    totalItems,
    totalPages,
    uniquePublishers
  }
}

export const publishAd = async (id: string): Promise<Advertisement> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  const idx = mockAds.findIndex(ad => ad.id === id)
  if (idx === -1) throw new Error("Ad not found")
  if (mockAds[idx].status !== "Pending") throw new Error("Only Pending ads can be published")
  
  mockAds[idx] = { ...mockAds[idx], status: "Pending", paymentStatus: "Pending" }
  return mockAds[idx]
}

export const duplicateAd = async (id: string): Promise<Advertisement> => {
  await new Promise(resolve => setTimeout(resolve, 600))
  const target = mockAds.find(ad => ad.id === id)
  if (!target) throw new Error("Ad not found")
  
  const duplicated: Advertisement = {
    ...target,
    id: `AD${2000 + mockAds.length}`,
    title: `${target.title} (Copy)`,
    status: "Pending",
    paymentStatus: "Pending",
    impressions: 0,
    clicks: 0,
    ctr: 0
  }
  
  mockAds.unshift(duplicated)
  return duplicated
}

export const archiveAd = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  mockAds = mockAds.filter(ad => ad.id !== id)
}

export const getAdById = async (id: string): Promise<Advertisement> => {
  await new Promise(resolve => setTimeout(resolve, 400))
  const target = mockAds.find(ad => ad.id === id)
  if (!target) throw new Error("Ad not found")
  // In a real app we'd fetch relations, etc.
  return {
    ...target,
    // Add mock extended properties that might be expected by the wizard
  } as Advertisement
}

export const createAd = async (data: any): Promise<Advertisement> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  
  const newAd: Advertisement = {
    id: `AD${2000 + mockAds.length}`,
    title: data.title,
    publishers: ["System Default"], // Mocks
    status: "Pending",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    impressions: 0,
    clicks: 0,
    ctr: 0,
    paymentStatus: "Pending"
  }
  
  mockAds.unshift(newAd)
  return newAd
}

export const updateAd = async (id: string, data: any): Promise<Advertisement> => {
  await new Promise(resolve => setTimeout(resolve, 800))
  const idx = mockAds.findIndex(ad => ad.id === id)
  if (idx === -1) throw new Error("Ad not found")
  
  mockAds[idx] = {
    ...mockAds[idx],
    title: data.title,
    // other fields that form updates
  }
  return mockAds[idx]
}
export interface PublishPayload {
  startDate: string
  endDate: string
  publisherIds: string[]
  cost: number
}

export const finalizeAdPublication = async (id: string, data: PublishPayload): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 1500))
  const idx = mockAds.findIndex(ad => ad.id === id)
  if (idx !== -1) {
    mockAds[idx] = { 
      ...mockAds[idx], 
      status: "Active", 
      startDate: data.startDate,
      endDate: data.endDate,
      publishers: data.publisherIds // Simplified for mock
    }
  }
}

export const fetchPublisherNames = async (): Promise<{id: string, name: string}[]> => {
  // We'll reuse the logic from the global ads filter unique publishers or fetch from publisher service
  // For simplicity here, we'll return a static list for now or import from publishers.ts if needed
  await new Promise(resolve => setTimeout(resolve, 300))
  return [
    { id: "PUB1000", name: "Phoenix Mall Mumbai" },
    { id: "PUB1001", name: "High Street Bangalore" },
    { id: "PUB1002", name: "Global Hub Delhi" },
    { id: "PUB1003", name: "Downtown Store Chennai" },
    { id: "PUB1004", name: "Airport Outlet Kolkata" },
    { id: "PUB1005", name: "City Center Pune" },
  ]
}
