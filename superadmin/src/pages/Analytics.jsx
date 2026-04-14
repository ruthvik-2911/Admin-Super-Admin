
import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { Download, Calendar, Filter, MapPin, Users, Globe, Clock, BarChart2 as BarChart3, Radio, ChevronDown } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatusBadge from '../components/shared/StatusBadge';
import { 
  mockAds,
  mockAdmins,
  mockPublishers
} from '../data/mockData';
import { SearchX, X } from 'lucide-react';

const isToday = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const isWithinDays = (dateStr, days) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= days;
};

const isWithinRange = (dateStr, start, end) => {
  const date = new Date(dateStr);
  return date >= new Date(start) && date <= new Date(end);
};

const TABS = [
  { id: 'ad-performance', label: 'Ad Performance', icon: BarChart3 },
  { id: 'geo-based', label: 'Geo-Based Analytics', icon: Globe },
  { id: 'admin-level', label: 'Admin-Level Analytics', icon: Users },
  { id: 'publisher-level', label: 'Publisher-Level Analytics', icon: Radio },
  { id: 'time-based', label: 'Time-Based Analytics', icon: Clock }
];

const COLORS = ['#FF6B00', '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

const Analytics = () => {
  const [activeTab, setActiveTab] = useState('ad-performance');
  const [filters, setFilters] = useState({
    dateRange: 'last30',
    admins: [],
    publishers: [],
    adTypes: [],
    locations: [],
    radius: null,
    adStatus: [],
    customStart: null,
    customEnd: null
  });

  const [activeDropdown, setActiveDropdown] = useState(null);

  const resetFilters = () => {
    setFilters({
      dateRange: 'last30',
      admins: [],
      publishers: [],
      adTypes: [],
      locations: [],
      radius: null,
      adStatus: [],
      customStart: null,
      customEnd: null
    });
  };

  const removeFilterPill = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: Array.isArray(prev[key]) 
        ? prev[key].filter(v => v !== value)
        : null
    }));
  };

  const filteredAds = useMemo(() => {
    let data = [...mockAds];

    // Date range filter
    if (filters.dateRange === 'today') {
      data = data.filter(ad => isToday(ad.date));
    } else if (filters.dateRange === 'last7') {
      data = data.filter(ad => isWithinDays(ad.date, 7));
    } else if (filters.dateRange === 'last30') {
      data = data.filter(ad => isWithinDays(ad.date, 30));
    } else if (filters.dateRange === 'last90') {
      data = data.filter(ad => isWithinDays(ad.date, 90));
    } else if (filters.dateRange === 'custom' && filters.customStart && filters.customEnd) {
      data = data.filter(ad => isWithinRange(ad.date, filters.customStart, filters.customEnd));
    }

    // Admin filter
    if (filters.admins.length > 0) {
      data = data.filter(ad => filters.admins.includes(ad.adminId));
    }

    // Publisher filter
    if (filters.publishers.length > 0) {
      data = data.filter(ad => filters.publishers.includes(ad.publisherId));
    }

    // Ad Type filter
    if (filters.adTypes.length > 0) {
      data = data.filter(ad => filters.adTypes.includes(ad.type));
    }

    // Location filter
    if (filters.locations.length > 0) {
      data = data.filter(ad => filters.locations.includes(ad.city));
    }

    // Radius filter
    if (filters.radius) {
      data = data.filter(ad => ad.radius <= filters.radius);
    }

    // Ad Status filter
    if (filters.adStatus.length > 0) {
      data = data.filter(ad => filters.adStatus.includes(ad.status));
    }

    return data;
  }, [filters]);

  // DERIVED DATA FOR CHARTS
  const kpiSummaryData = useMemo(() => [
    { 
      title: 'Total Impressions', 
      value: filteredAds.reduce((s, a) => s + a.impressions, 0).toLocaleString(), 
      change: 12.5 
    },
    { 
      title: 'Total Clicks', 
      value: filteredAds.reduce((s, a) => s + a.clicks, 0).toLocaleString(), 
      change: 18.2 
    },
    { 
      title: 'Avg CTR', 
      value: (filteredAds.length ? (filteredAds.reduce((s, a) => s + a.clicks, 0) / filteredAds.reduce((s, a) => s + a.impressions, 1) * 100).toFixed(2) : '0.00') + '%', 
      change: 4.1 
    },
  ], [filteredAds]);

  const adPerformanceChartData = useMemo(() => {
    return filteredAds
      .slice(0, 10)
      .map(ad => ({
        name: ad.title.length > 15 ? ad.title.slice(0, 15) + '...' : ad.title,
        impressions: ad.impressions,
        clicks: ad.clicks,
      }));
  }, [filteredAds]);

  const adTypeChartData = useMemo(() => {
    const counts = {};
    filteredAds.forEach(ad => {
        counts[ad.type] = (counts[ad.type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredAds]);

  const topLocationsData = useMemo(() => {
    const cityMap = {};
    filteredAds.forEach(ad => {
        cityMap[ad.city] = (cityMap[ad.city] || 0) + ad.impressions;
    });
    return Object.entries(cityMap)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5);
  }, [filteredAds]);

  const geoTableData = useMemo(() => {
    const cityMap = {};
    filteredAds.forEach(ad => {
      if (!cityMap[ad.city]) cityMap[ad.city] = { city: ad.city, impressions: 0, clicks: 0, status: 'Active' };
      cityMap[ad.city].impressions += ad.impressions;
      cityMap[ad.city].clicks += ad.clicks;
      if (ad.status !== 'Active' && cityMap[ad.city].status === 'Active') cityMap[ad.city].status = ad.status;
    });
    return Object.values(cityMap)
      .map(c => ({ 
        ...c, 
        ctr: (c.impressions > 0 ? (c.clicks / c.impressions * 100).toFixed(1) : '0.0') + '%' 
      }))
      .sort((a, b) => b.impressions - a.impressions);
  }, [filteredAds]);

  const radiusEngagementData = useMemo(() => {
    const radiusMap = {};
    filteredAds.forEach(ad => {
        const rKey = ad.radius + 'km';
        if (!radiusMap[rKey]) radiusMap[rKey] = { radius: rKey, sumCtr: 0, count: 0 };
        radiusMap[rKey].sumCtr += (ad.impressions > 0 ? (ad.clicks / ad.impressions * 100) : 0);
        radiusMap[rKey].count += 1;
    });
    return Object.values(radiusMap).map(r => ({
        radius: r.radius,
        value: parseFloat((r.sumCtr / r.count).toFixed(2))
    })).sort((a, b) => parseInt(a.radius) - parseInt(b.radius));
  }, [filteredAds]);

  const adminLeaderboardData = useMemo(() => {
    const adminMap = {};
    filteredAds.forEach(ad => {
        if (!adminMap[ad.adminId]) {
            adminMap[ad.adminId] = { name: ad.adminName, ads: 0, clicks: 0, impressions: 0, revenue: 0 };
        }
        adminMap[ad.adminId].ads += 1;
        adminMap[ad.adminId].clicks += ad.clicks;
        adminMap[ad.adminId].impressions += ad.impressions;
        adminMap[ad.adminId].revenue += ad.revenue;
    });
    return Object.values(adminMap)
        .map(a => ({
            ...a,
            ctr: a.impressions > 0 ? (a.clicks / a.impressions * 100).toFixed(1) : '0.0'
        }))
        .sort((a, b) => b.revenue - a.revenue)
        .map((a, i) => ({ ...a, rank: i + 1 }));
  }, [filteredAds]);

  const publisherPerformanceData = useMemo(() => {
    const pubMap = {};
    filteredAds.forEach(ad => {
        if (!pubMap[ad.publisherId]) {
            pubMap[ad.publisherId] = { name: ad.publisherName, ads: 0, impressions: 0, clicks: 0, status: 'Active' };
        }
        pubMap[ad.publisherId].ads += 1;
        pubMap[ad.publisherId].impressions += ad.impressions;
        pubMap[ad.publisherId].clicks += ad.clicks;
    });
    return Object.values(pubMap).map(p => ({
        ...p,
        engagement: p.impressions > 0 ? (p.clicks / p.impressions * 100).toFixed(1) : '0.0'
    })).sort((a, b) => b.impressions - a.impressions);
  }, [filteredAds]);

  const hourlyEngagementData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => ({ 
        hour: i.toString().padStart(2, '0'), 
        engagement: 0 
    }));
    filteredAds.forEach(ad => {
        ad.hourlyBreakdown?.forEach(h => {
            hours[h.hour].engagement += h.clicks;
        });
    });
    return hours;
  }, [filteredAds]);

  const dailyTrendData = useMemo(() => {
    const daysMap = {};
    filteredAds.forEach(ad => {
        const d = ad.date;
        if (!daysMap[d]) daysMap[d] = { date: d, impressions: 0, clicks: 0 };
        daysMap[d].impressions += ad.impressions;
        daysMap[d].clicks += ad.clicks;
    });
    return Object.values(daysMap).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [filteredAds]);

  const handleExport = () => {
    alert("Export triggered");
  };

  const renderKPIs = (data = []) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {data?.map((kpi, idx) => (
        <div key={idx} className="card-floating tilt-card animate-fade-in-scale group hover:-translate-y-2 transition-all duration-500 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
             <BarChart3 size={80} />
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{kpi?.title}</p>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter">{kpi?.value}</h3>
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black shadow-sm ${kpi?.change >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {kpi?.change >= 0 ? '↑' : '↓'} {Math.abs(kpi?.change)}%
              </div>
            </div>
            {/* Sparkline */}
            <div className="h-12 w-full mt-2 opacity-50 group-hover:opacity-100 transition-opacity">
               <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[...Array(10)].map((_, i) => ({ v: Math.random() * 100 }))}>
                     <Line type="monotone" dataKey="v" stroke={kpi?.change >= 0 ? '#10b981' : '#f43f5e'} strokeWidth={2} dot={false} />
                  </LineChart>
               </ResponsiveContainer>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAdPerformance = () => {
    if (filteredAds.length === 0) return renderEmptyState();
    return (
      <div className="space-y-6">
        {renderKPIs(kpiSummaryData)}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-card">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Top 10 Performing Ads</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={adPerformanceChartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend iconType="circle" />
                  <Bar dataKey="impressions" fill="#FF6B00" radius={[4, 4, 0, 0]} name="Impressions" />
                  <Bar dataKey="clicks" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Clicks" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
  
          <div className="bg-white p-6 rounded-2xl shadow-card">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Performance by Ad Type</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={adTypeChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {adTypeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
  
        <div className="bg-white p-6 rounded-2xl shadow-card">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Top Performing Locations (Impressions)</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topLocationsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F3F4F6" />
                <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={20} name="Total Impressions" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };

  const renderGeoBased = () => {
    if (filteredAds.length === 0) return renderEmptyState();
    const topLoc = geoTableData[0];
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-card animate-fade-in flex items-center justify-between border-l-4 border-primary-500">
          <div>
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Top Performing Location</p>
             <h3 className="text-2xl font-bold text-gray-900">{topLoc?.city || 'N/A'}</h3>
          </div>
          <div className="text-right">
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Impact</p>
             <p className="text-xl font-bold text-primary-600">{topLoc?.impressions?.toLocaleString() || 0} Impressions</p>
          </div>
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
               <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900">City-wise Engagement</h3>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                      <thead className="bg-gray-50">
                          <tr>
                              <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">City</th>
                              <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">Impressions</th>
                              <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">Clicks</th>
                              <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">CTR</th>
                              <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">Status</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {geoTableData.map((row, idx) => (
                              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{row.city}</td>
                                  <td className="px-6 py-4 text-sm text-gray-600">{row.impressions.toLocaleString()}</td>
                                  <td className="px-6 py-4 text-sm text-gray-600">{row.clicks.toLocaleString()}</td>
                                  <td className="px-6 py-4 text-sm font-bold text-primary-600">{row.ctr}</td>
                                  <td className="px-6 py-4"><StatusBadge status={row.status} /></td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
               </div>
          </div>
  
          <div className="bg-white p-6 rounded-2xl shadow-card">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Engagement by Radius</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={radiusEngagementData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="radius" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#FF6B00" radius={[4, 4, 0, 0]} name="Avg Engagement %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAdminLevel = () => {
    if (filteredAds.length === 0) return renderEmptyState();
    return (
      <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-card overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900">Admin Leaderboard</h3>
                  </div>
                  <div className="overflow-x-auto">
                      <table className="w-full text-left">
                          <thead className="bg-gray-50">
                              <tr>
                                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">Rank</th>
                                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">Admin Name</th>
                                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">ADS</th>
                                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">CTR</th>
                                  <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">Revenue</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                              {adminLeaderboardData.map((row, idx) => (
                                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                      <td className="px-6 py-4">
                                          <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold 
                                              ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : 
                                                idx === 1 ? 'bg-gray-100 text-gray-600' : 
                                                idx === 2 ? 'bg-orange-100 text-orange-700' : 'bg-transparent text-gray-400'}
                                          `}>
                                              {row.rank}
                                          </span>
                                      </td>
                                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{row.name}</td>
                                      <td className="px-6 py-4 text-sm text-gray-600">{row.ads}</td>
                                      <td className="px-6 py-4 text-sm font-bold text-indigo-600">{row.ctr}%</td>
                                      <td className="px-6 py-4 text-sm font-bold text-gray-900">₹{row.revenue.toLocaleString()}</td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
  
              <div className="bg-white p-6 rounded-2xl shadow-card">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue per Admin</h3>
                  <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={adminLeaderboardData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                              <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} />
                              <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
                              <Tooltip />
                              <Bar dataKey="revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
                          </BarChart>
                      </ResponsiveContainer>
                  </div>
              </div>
          </div>
      </div>
    );
  };

  const renderPublisherLevel = () => {
    if (filteredAds.length === 0) return renderEmptyState();
    return (
      <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900">Publisher Performance Monitoring</h3>
              </div>
              <div className="overflow-x-auto">
                  <table className="w-full text-left">
                      <thead className="bg-gray-50">
                          <tr>
                              <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">Publisher</th>
                              <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">Ads Posted</th>
                              <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">Total Impressions</th>
                              <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">Engagement %</th>
                              <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">Status</th>
                          </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                          {publisherPerformanceData.map((row, idx) => (
                              <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{row.name}</td>
                                  <td className="px-6 py-4 text-sm text-gray-600">{row.ads}</td>
                                  <td className="px-6 py-4 text-sm text-gray-600">{row.impressions.toLocaleString()}</td>
                                  <td className="px-6 py-4">
                                       <div className="flex items-center gap-2">
                                          <div className="flex-1 w-24 bg-gray-100 rounded-full h-1.5">
                                              <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${parseFloat(row.engagement) * 10}%` }} />
                                          </div>
                                          <span className="text-sm font-bold text-gray-900">{row.engagement}%</span>
                                       </div>
                                  </td>
                                  <td className="px-6 py-4"><StatusBadge status={row.status} /></td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          </div>
      </div>
    );
  };

  const renderTimeBased = () => {
    if (filteredAds.length === 0) return renderEmptyState();
    return (
      <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-card">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Hour-wise Engagement (0–23 hrs)</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyEngagementData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                  <XAxis dataKey="hour" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="engagement" stroke="#FF6B00" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#FF6B00', stroke: '#fff' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
  
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-card">
                  <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-gray-900">Campaign Trends</h3>
                      <div className="flex bg-gray-100 p-1 rounded-xl">
                          <button className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white shadow-sm transition-all">Daily</button>
                          <button className="px-3 py-1.5 text-xs font-bold text-gray-400 hover:text-gray-600 transition-all">Weekly</button>
                      </div>
                  </div>
                  <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={dailyTrendData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                              <XAxis dataKey="date" fontSize={12} tickLine={false} axisLine={false} />
                              <YAxis fontSize={12} tickLine={false} axisLine={false} />
                              <Tooltip />
                              <Legend />
                              <Line type="monotone" dataKey="impressions" stroke="#3B82F6" strokeWidth={2} />
                              <Line type="monotone" dataKey="clicks" stroke="#10B981" strokeWidth={2} />
                          </LineChart>
                      </ResponsiveContainer>
                  </div>
              </div>
  
              <div className="bg-white p-6 rounded-2xl shadow-card">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Duration vs Average CTR</h3>
                  <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[
                            { duration: '1 Week', ctr: 2.8 },
                            { duration: '2 Weeks', ctr: 3.2 },
                            { duration: '1 Month', ctr: 3.5 },
                            { duration: '3 Months', ctr: 3.1 },
                            { duration: '6 Months', ctr: 2.6 },
                          ]}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                              <XAxis dataKey="duration" fontSize={12} tickLine={false} axisLine={false} />
                              <YAxis fontSize={12} tickLine={false} axisLine={false} />
                              <Tooltip />
                              <Bar dataKey="ctr" fill="#8B5CF6" radius={[4, 4, 0, 0]} name="Avg CTR %" />
                          </BarChart>
                      </ResponsiveContainer>
                  </div>
              </div>
          </div>
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-20 px-6 bg-white rounded-3xl shadow-card animate-fade-in border border-dashed border-gray-200">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
            <SearchX size={40} className="text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No data matches the selected filters</h3>
        <p className="text-gray-500 mb-8 max-w-sm text-center">Try adjusting your time range, location, or other filter settings to see analytics.</p>
        <button 
            onClick={resetFilters}
            className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-primary-600/20 active:scale-95 transition-all"
        >
            Reset All Filters
        </button>
    </div>
  );

  return (
    <div className="pb-10">
      <PageHeader 
        title="Analytics & Reporting" 
        subtitle="Historical performance and ecosystem deep-dives"
        actions={
          <>
            <div className="relative group">
               <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all">
                  <Download size={16} className="text-primary-500" />
                  Export
                  <ChevronDown size={14} className="text-gray-400" />
               </button>
               <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
                  <button onClick={handleExport} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors font-medium border-b border-gray-50">Export as CSV</button>
                  <button onClick={handleExport} className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors font-medium">Export as Excel</button>
               </div>
            </div>
          </>
        }
      />

      {/* Sticky Filter Bar Placeholder (since we need specific multi-select here, let's build it inline or use a specialized one) */}
      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-100 -mx-6 px-6 py-4 mb-8 sticky top-0 z-20 flex flex-col gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
            <Calendar size={16} className="text-gray-400 ml-2" />
            <select 
                value={filters.dateRange} 
                onChange={(e) => setFilters(p => ({ ...p, dateRange: e.target.value }))}
                className="bg-transparent text-sm font-semibold text-gray-700 outline-none pr-4 cursor-pointer"
            >
                <option value="today">Today</option>
                <option value="last7">Last 7 Days</option>
                <option value="last30">Last 30 Days</option>
                <option value="last90">Last 90 Days</option>
                <option value="custom">Custom Range</option>
            </select>
            </div>

            <div className="h-6 w-px bg-gray-200" />

            <div className="flex items-center gap-2 relative">
                {[
                    { id: 'admins', label: 'Admins', options: mockAdmins.map(a => ({ label: a.name, value: a.id })) },
                    { id: 'publishers', label: 'Publishers', options: mockPublishers.map(p => ({ label: p.name, value: p.id })) },
                    { id: 'adTypes', label: 'Ad Types', options: ['Banner', 'Video', 'Thumbnail'].map(v => ({ label: v, value: v })) },
                    { id: 'locations', label: 'Locations', options: ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai'].map(v => ({ label: v, value: v })) },
                    { id: 'adStatus', label: 'Status', options: ['Active', 'Expired', 'Pending', 'Suspended'].map(v => ({ label: v, value: v })) },
                ].map(dropdown => (
                    <div key={dropdown.id} className="relative">
                        <button 
                            onClick={() => setActiveDropdown(activeDropdown === dropdown.id ? null : dropdown.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 border rounded-xl text-xs font-bold transition-all
                                ${filters[dropdown.id].length > 0 
                                    ? 'bg-primary-50 border-primary-100 text-primary-600' 
                                    : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100'}
                            `}
                        >
                            {dropdown.label}
                            {filters[dropdown.id].length > 0 && ` (${filters[dropdown.id].length})`}
                            <ChevronDown size={14} />
                        </button>
                        
                        {activeDropdown === dropdown.id && (
                            <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 p-2 animate-fade-in">
                                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                    {dropdown.options.map(opt => (
                                        <label key={opt.value} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-xl cursor-pointer group">
                                            <input 
                                                type="checkbox"
                                                className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 transition-all cursor-pointer"
                                                checked={filters[dropdown.id].includes(opt.value)}
                                                onChange={(e) => {
                                                    const val = opt.value;
                                                    setFilters(prev => ({
                                                        ...prev,
                                                        [dropdown.id]: e.target.checked 
                                                            ? [...prev[dropdown.id], val]
                                                            : prev[dropdown.id].filter(v => v !== val)
                                                    }));
                                                }}
                                            />
                                            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{opt.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                <div className="relative">
                    <button 
                        onClick={() => setActiveDropdown(activeDropdown === 'radius' ? null : 'radius')}
                        className={`flex items-center gap-2 px-3 py-1.5 border rounded-xl text-xs font-bold transition-all
                            ${filters.radius 
                                ? 'bg-primary-50 border-primary-100 text-primary-600' 
                                : 'bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100'}
                        `}
                    >
                        Radius {filters.radius && `: ${filters.radius}km`}
                        <ChevronDown size={14} />
                    </button>
                    {activeDropdown === 'radius' && (
                        <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 p-4 animate-fade-in">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Max Radius: {filters.radius || 0}km</p>
                            <input 
                                type="range" 
                                min="0" 
                                max="50" 
                                value={filters.radius || 0}
                                onChange={(e) => setFilters(p => ({ ...p, radius: parseInt(e.target.value) || null }))}
                                className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary-500"
                            />
                            <div className="flex justify-between mt-2 text-[10px] font-bold text-gray-400">
                                <span>0km</span>
                                <span>50km</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <button 
                onClick={resetFilters}
                className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all uppercase tracking-wider ml-auto"
            >
                Reset All
            </button>
        </div>

        {/* Filter Pills */}
        {(Object.entries(filters).some(([k, v]) => Array.isArray(v) && v.length > 0) || filters.radius) && (
            <div className="flex flex-wrap items-center gap-2 animate-fade-in">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mr-2">Filters:</span>
                {Object.entries(filters).map(([key, value]) => {
                    if (Array.isArray(value)) {
                        return value.map(val => (
                            <div key={`${key}-${val}`} className="flex items-center gap-1.5 px-2 py-1 bg-primary-100 text-primary-700 rounded-lg text-[10px] font-black shadow-sm border border-primary-200 group">
                                {val}
                                <button onClick={() => removeFilterPill(key, val)} className="hover:text-primary-900 transition-colors">
                                    <X size={12} strokeWidth={3} />
                                </button>
                            </div>
                        ));
                    }
                    if (key === 'radius' && value) {
                        return (
                            <div key="radius-pill" className="flex items-center gap-1.5 px-2 py-1 bg-primary-100 text-primary-700 rounded-lg text-[10px] font-black shadow-sm border border-primary-200 group">
                                Radius: {value}km
                                <button onClick={() => setFilters(p => ({ ...p, radius: null }))} className="hover:text-primary-900 transition-colors">
                                    <X size={12} strokeWidth={3} />
                                </button>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        )}
      </div>

      {/* Sub-nav tabs */}
      <div className="flex items-center gap-1 mb-8 bg-gray-100/50 p-1 rounded-2xl w-fit">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all
                ${isActive ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-500 hover:text-gray-900'}
              `}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content based on tab */}
      <div className="animate-fade-in">
        {activeTab === 'ad-performance' && renderAdPerformance()}
        {activeTab === 'geo-based' && renderGeoBased()}
        {activeTab === 'admin-level' && renderAdminLevel()}
        {activeTab === 'publisher-level' && renderPublisherLevel()}
        {activeTab === 'time-based' && renderTimeBased()}
      </div>
    </div>
  );
};

export default Analytics;
