import { api } from './api';

// ─────────────────────────────────────────
// Types
// ─────────────────────────────────────────

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
}

export interface AdCampaign {
  id: string
  title: string
  status: string
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

// ─────────────────────────────────────────
// Helper: map backend publisher to frontend type
// ─────────────────────────────────────────
const mapPublisher = (p: any): Publisher => ({
  id: p.id,
  name: p.name,
  contactPerson: p.contactPerson || '',
  location: p.location || 'Unknown',
  status: p.status === 'ACTIVE' ? 'Active' : 'Inactive',
  lastActive: p.createdAt
    ? new Date(p.createdAt).toLocaleDateString('en-IN')
    : new Date().toLocaleDateString('en-IN'),
  mobile: p.mobile || '',
  email: p.email || '',
  address: p.address || '',
})

// ─────────────────────────────────────────
// Fetch All Publishers (with client-side search/filter/pagination)
// ─────────────────────────────────────────
export const fetchPublishers = async ({
  page,
  limit,
  search,
  status,
}: FetchPublishersArgs): Promise<FetchPublishersResult> => {
  try {
    const response = await api.get('/api/admin/publishers')
    let publishers: Publisher[] = (response.data?.publishers || []).map(mapPublisher)

    if (search) {
      const s = search.toLowerCase()
      publishers = publishers.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.location.toLowerCase().includes(s) ||
          p.contactPerson.toLowerCase().includes(s)
      )
    }

    if (status && status !== 'All') {
      publishers = publishers.filter((p) => p.status === status)
    }

    const totalItems = publishers.length
    const totalPages = Math.ceil(totalItems / limit)
    const startIndex = (page - 1) * limit
    const paginatedData = publishers.slice(startIndex, startIndex + limit)

    return { data: paginatedData, totalItems, totalPages }
  } catch (error) {
    console.error('Error fetching publishers:', error)
    return { data: [], totalItems: 0, totalPages: 0 }
  }
}

// ─────────────────────────────────────────
// Get Publisher by ID
// ─────────────────────────────────────────
export const getPublisherById = async (id: string): Promise<Publisher> => {
  const response = await api.get(`/api/admin/publishers/${id}`)
  return mapPublisher(response.data.publisher)
}

// ─────────────────────────────────────────
// Create Publisher
// ─────────────────────────────────────────
export const createPublisher = async (data: any): Promise<Publisher> => {
  const payload = {
    name: data.name,
    contactPerson: data.contactPerson,
    mobile: data.mobile,
    email: data.email,
    address: data.address || '',
    location:
      data.latitude && data.longitude
        ? `${data.latitude}, ${data.longitude}`
        : data.location || '',
  }
  const response = await api.post('/api/admin/publishers', payload)
  return mapPublisher(response.data.publisher)
}

// ─────────────────────────────────────────
// Update Publisher
// ─────────────────────────────────────────
export const updatePublisher = async (id: string, data: any): Promise<Publisher> => {
  const payload = {
    name: data.name,
    contactPerson: data.contactPerson,
    mobile: data.mobile,
    email: data.email,
    address: data.address || '',
    location:
      data.latitude && data.longitude
        ? `${data.latitude}, ${data.longitude}`
        : data.location || '',
  }
  const response = await api.put(`/api/admin/publishers/${id}`, payload)
  return mapPublisher(response.data.publisher)
}

// ─────────────────────────────────────────
// Toggle Publisher Status (ACTIVE ↔ INACTIVE)
// ─────────────────────────────────────────
export const togglePublisherStatus = async (id: string): Promise<Publisher> => {
  const response = await api.patch(`/api/admin/publishers/${id}/status`)
  return mapPublisher(response.data.publisher)
}

// ─────────────────────────────────────────
// Fetch Publisher Analytics (Real Data)
// ─────────────────────────────────────────
export const fetchPublisherAnalytics = async (id: string): Promise<PublisherAnalytics> => {
  const response = await api.get(`/api/admin/publishers/${id}/analytics`)
  const { publisher: rawPub, analytics } = response.data

  const publisher = mapPublisher(rawPub)

  return {
    publisher,
    stats: {
      totalAds: analytics.stats.totalAds ?? 0,
      activeCampaigns: analytics.stats.activeCampaigns ?? 0,
      impressions: analytics.stats.impressions ?? 0,
      clicks: analytics.stats.clicks ?? 0,
      ctr: analytics.stats.ctr ?? 0,
    },
    trends: (analytics.trends ?? []).map((t: any) => ({
      date: t.date,
      impressions: t.impressions,
      clicks: t.clicks,
    })),
    campaigns: (analytics.campaigns ?? []).map((c: any) => ({
      id: c.id,
      title: c.title,
      status: c.status === 'ACTIVE' ? 'Active' : c.status === 'EXPIRED' ? 'Expired' : c.status ?? 'Draft',
      startDate: c.startDate ?? '-',
      endDate: c.endDate ?? '-',
      impressions: c.impressions ?? 0,
      clicks: c.clicks ?? 0,
      ctr: c.ctr ?? 0,
    })),
  }
}
