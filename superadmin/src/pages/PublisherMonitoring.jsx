import React, { useEffect, useMemo, useState } from 'react';
import { Eye, MapPin, User, Mail, Calendar, Info, BarChart2 } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import DataTable from '../components/shared/DataTable';
import StatusBadge from '../components/shared/StatusBadge';
import DetailDrawer from '../components/shared/DetailDrawer';
import FilterBar from '../components/shared/FilterBar';
import { fetchPublisherDetail, fetchPublishers } from '../lib/management';

const PublisherMonitoring = () => {
  const [publishers, setPublishers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState({ admin: null, status: null, location: null });

  useEffect(() => {
    const loadPublishers = async () => {
      setIsLoading(true);
      try {
        const data = await fetchPublishers({
          adminId: activeFilters.admin || undefined,
          status: activeFilters.status || undefined,
          location: activeFilters.location || undefined,
        });
        setPublishers(data);
      } finally {
        setIsLoading(false);
      }
    };

    loadPublishers();
  }, [activeFilters.admin, activeFilters.status, activeFilters.location]);

  const handleOpenDetails = async (publisher) => {
    setSelectedPublisher(publisher);
    setIsDrawerOpen(true);

    try {
      const details = await fetchPublisherDetail(publisher.id);
      setSelectedPublisher(details);
    } catch {
      // Keep summary fallback data.
    }
  };

  const columns = [
    { key: 'id', label: 'ID', className: 'font-mono text-[10px] font-bold text-gray-400' },
    { key: 'name', label: 'Publisher', render: (val) => <span className="font-bold text-gray-900">{val}</span> },
    {
      key: 'adminName',
      label: 'Managed By',
      render: (val) => (
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[8px] font-bold text-gray-500">{val.charAt(0)}</div>
          <span className="text-sm font-medium text-gray-600">{val}</span>
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      render: (val) => (
        <div className="flex items-center gap-1.5 text-gray-500">
          <MapPin size={14} className="text-gray-400" />
          <span className="text-sm font-medium">{val}</span>
        </div>
      ),
    },
    { key: 'adsPosted', label: 'Ads', className: 'text-center font-bold text-gray-900' },
    { key: 'engagement', label: 'Engagement', render: (val) => <span className="font-black text-primary-600">{val}%</span> },
    { key: 'status', label: 'Activity', render: (val) => <StatusBadge status={val} /> },
    {
      key: 'actions',
      label: 'Actions',
      render: (_, row) => (
        <button
          onClick={(e) => { e.stopPropagation(); handleOpenDetails(row); }}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-primary-500 hover:text-white rounded-lg text-xs font-bold transition-all group"
        >
          <Eye size={14} />
          View
        </button>
      ),
    },
  ];

  const handleFilterChange = (key, value) => {
    setActiveFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setActiveFilters({ admin: null, status: null, location: null });
  };

  const adminOptions = useMemo(() => {
    const map = new Map();
    publishers.forEach((publisher) => {
      if (!map.has(publisher.adminId)) {
        map.set(publisher.adminId, publisher.adminName);
      }
    });

    return Array.from(map.entries())
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [publishers]);

  const locationOptions = useMemo(() => {
    return [...new Set(publishers.map((publisher) => publisher.location))]
      .sort((a, b) => a.localeCompare(b))
      .map((value) => ({ label: value, value }));
  }, [publishers]);

  const filterOptions = [
    {
      key: 'admin',
      label: 'Admin',
      type: 'select',
      options: adminOptions,
      appliedValue: activeFilters.admin ? adminOptions.find((a) => a.value === activeFilters.admin)?.label : null,
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' },
        { label: 'Suspended', value: 'Suspended' },
      ],
      appliedValue: activeFilters.status,
    },
    {
      key: 'location',
      label: 'Location',
      type: 'select',
      options: locationOptions,
      appliedValue: activeFilters.location,
    },
  ];

  const publisherAds = selectedPublisher?.ads ?? [];

  return (
    <div className="pb-10 space-y-8 animate-fade-in">
      <div className="animate-fade-in-scale">
        <PageHeader
          title="Publisher Monitoring"
          subtitle="Global audit of all publisher engagement and display activity"
        />
      </div>

      <div className="card-floating p-0 animate-fade-in-scale delay-100">
        <FilterBar
          filters={filterOptions}
          onFilterChange={handleFilterChange}
          onReset={resetFilters}
          activeFiltersCount={Object.values(activeFilters).filter(Boolean).length}
        />
      </div>

      <div className="card-floating p-0 overflow-hidden animate-fade-in-scale delay-200">
        <DataTable
          columns={columns}
          data={publishers}
          isLoading={isLoading}
          onRowClick={handleOpenDetails}
          className="hover-glow-border"
        />
      </div>

      <DetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Publisher Insights"
        footerActions={<span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border border-gray-200 px-2 py-1 rounded-lg">Read Only</span>}
      >
        {selectedPublisher && (
          <div className="space-y-8 animate-fade-in">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <BarChart2 size={120} className="text-primary-500" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gray-900 flex items-center justify-center text-white text-2xl font-black">
                    {selectedPublisher.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-gray-900">{selectedPublisher.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={selectedPublisher.status} />
                      <span className="text-xs text-gray-400 font-mono">{selectedPublisher.id}</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-y-3 pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2 text-sm">
                    <User size={14} className="text-primary-500" />
                    <span className="text-gray-500">Admin:</span>
                    <span className="font-bold text-gray-900">{selectedPublisher.adminName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={14} className="text-primary-500" />
                    <span className="text-gray-500">Location:</span>
                    <span className="font-bold text-gray-900">{selectedPublisher.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={14} className="text-primary-500" />
                    <span className="font-bold text-gray-900">{selectedPublisher.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={14} className="text-primary-500" />
                    <span className="text-gray-500">Joined:</span>
                    <span className="font-bold text-gray-900">{selectedPublisher.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Ads Posted', value: selectedPublisher.adsPosted, icon: Info },
                { label: 'Impressions', value: selectedPublisher.impressions.toLocaleString(), icon: Info },
                { label: 'Clicks', value: selectedPublisher.clicks.toLocaleString(), icon: Info },
                { label: 'Engagement', value: `${selectedPublisher.engagement}%`, icon: Info, highlight: true },
              ].map((stat, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-100 text-center flex flex-col items-center shadow-sm">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className={`text-xl font-black ${stat.highlight ? 'text-primary-500' : 'text-gray-900'}`}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center justify-between">
                Published Advertisements
                <span className="text-xs font-medium text-gray-400 normal-case">{publisherAds.length} campaigns</span>
              </h4>
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase">AD Title</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase">Type</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase">Status</th>
                        <th className="px-4 py-3 text-[10px] font-bold text-gray-400 uppercase text-right">CTR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {publisherAds.length > 0 ? publisherAds.map((ad, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900 max-w-[150px] truncate">{ad.title}</td>
                          <td className="px-4 py-3 text-xs text-gray-500 font-medium">{ad.type}</td>
                          <td className="px-4 py-3"><StatusBadge status={ad.status} /></td>
                          <td className="px-4 py-3 text-right text-xs font-bold text-primary-600">{ad.ctr}%</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="4" className="px-4 py-8 text-center text-gray-400 text-xs italic">No campaigns found for this publisher</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  );
};

export default PublisherMonitoring;
