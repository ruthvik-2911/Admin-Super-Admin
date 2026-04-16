
import React, { useState, useEffect } from 'react';
import { Eye, MapPin, User, Mail, Phone, Calendar, Info, BarChart2 } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import DataTable from '../components/shared/DataTable';
import StatusBadge from '../components/shared/StatusBadge';
import DetailDrawer from '../components/shared/DetailDrawer';
import FilterBar from '../components/shared/FilterBar';
import { mockPublishers, mockAds, mockAdmins } from '../data/mockData';

const PublisherMonitoring = () => {
    const [publishers, setPublishers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPublisher, setSelectedPublisher] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({ admin: null, status: null });

    useEffect(() => {
        const timer = setTimeout(() => {
            setPublishers(mockPublishers);
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const columns = [
        { key: 'id', label: 'ID', className: 'font-mono text-[10px] font-bold text-gray-400' },
        { key: 'name', label: 'Publisher', render: (val) => <span className="font-bold text-gray-900 dark:text-white">{val}</span> },
        { key: 'adminName', label: 'Managed By', render: (val) => (
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-[8px] font-bold text-gray-500 dark:text-gray-400">{val.charAt(0)}</div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{val}</span>
            </div>
        )},
        { key: 'location', label: 'Location', render: (val) => (
            <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                <MapPin size={14} className="text-gray-400 dark:text-gray-500" />
                <span className="text-sm font-medium">{val}</span>
            </div>
        )},
        { key: 'adsPosted', label: 'Ads', className: 'text-center font-bold text-gray-900 dark:text-white' },
        { key: 'engagement', label: 'Engagement', render: (val) => (
            <span className="font-black text-primary-600">{val}%</span>
        )},
        { key: 'status', label: 'Activity', render: (val) => <StatusBadge status={val} /> },
        { key: 'actions', label: 'Actions', render: (_, row) => (
            <button 
                onClick={(e) => { e.stopPropagation(); setSelectedPublisher(row); setIsDrawerOpen(true); }}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 hover:bg-primary-500 hover:text-white rounded-lg text-xs font-bold transition-all group dark:text-gray-300"
            >
                <Eye size={14} />
                View
            </button>
        )}
    ];

    const publisherAds = selectedPublisher 
        ? mockAds.filter(ad => ad.publisherId === selectedPublisher.id)
        : [];

    const handleFilterChange = (key, value) => {
        setActiveFilters(prev => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setActiveFilters({ admin: null, status: null });
    };

    const filterOptions = [
        { 
            key: 'admin', 
            label: 'Admin', 
            type: 'select', 
            options: mockAdmins.map(a => ({ label: a.name, value: a.id })),
            appliedValue: activeFilters.admin ? mockAdmins.find(a => a.id === activeFilters.admin)?.name : null
        },
        { 
            key: 'status', 
            label: 'Status', 
            type: 'select', 
            options: [
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' },
                { label: 'Suspended', value: 'Suspended' }
            ],
            appliedValue: activeFilters.status
        }
    ];

    const filteredData = publishers.filter(p => {
        if (activeFilters.admin && p.adminId !== activeFilters.admin) return false;
        if (activeFilters.status && p.status !== activeFilters.status) return false;
        return true;
    });

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
                    data={filteredData} 
                    isLoading={isLoading}
                    onRowClick={(row) => { setSelectedPublisher(row); setIsDrawerOpen(true); }}
                    className="hover-glow-border"
                />
            </div>

            {/* Read-only Detail Drawer */}
            <DetailDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title="Publisher Insights"
                footerActions={<span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest border border-gray-200 dark:border-gray-800 px-2 py-1 rounded-lg">Read Only</span>}
            >
                {selectedPublisher && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Profile Header */}
                        <div className="bg-white dark:bg-gray-800/40 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <BarChart2 size={120} className="text-primary-500" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-2xl bg-gray-900 dark:bg-gray-800 flex items-center justify-center text-white text-2xl font-black shadow-xl">
                                        {selectedPublisher.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white">{selectedPublisher.name}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <StatusBadge status={selectedPublisher.status} />
                                            <span className="text-xs text-gray-400 dark:text-gray-500 font-mono">{selectedPublisher.id}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-y-3 pt-4 border-t border-gray-50 dark:border-gray-700">
                                    <div className="flex items-center gap-2 text-sm">
                                        <User size={14} className="text-primary-500" />
                                        <span className="text-gray-500 dark:text-gray-400">Admin:</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{selectedPublisher.adminName}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin size={14} className="text-primary-500" />
                                        <span className="text-gray-500 dark:text-gray-400">Location:</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{selectedPublisher.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail size={14} className="text-primary-500" />
                                        <span className="font-bold text-gray-900 dark:text-white">{selectedPublisher.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar size={14} className="text-primary-500" />
                                        <span className="text-gray-500 dark:text-gray-400">Joined:</span>
                                        <span className="font-bold text-gray-900 dark:text-white">{selectedPublisher.joinDate}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Metrics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { label: 'Ads Posted', value: selectedPublisher.adsPosted, icon: Info },
                                { label: 'Impressions', value: selectedPublisher.impressions.toLocaleString(), icon: Info },
                                { label: 'Clicks', value: selectedPublisher.clicks.toLocaleString(), icon: Info },
                                { label: 'Engagement', value: `${selectedPublisher.engagement}%`, icon: Info, highlight: true },
                            ].map((stat, idx) => (
                                <div key={idx} className="bg-white dark:bg-gray-800/40 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 text-center flex flex-col items-center shadow-sm">
                                    <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                                    <p className={`text-xl font-black ${stat.highlight ? 'text-primary-500' : 'text-gray-900 dark:text-white'}`}>{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Recent Ads Table */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
                                Published Advertisements
                                <span className="text-xs font-medium text-gray-400 dark:text-gray-500 normal-case">{publisherAds.length} campaigns</span>
                            </h4>
                            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead className="bg-gray-50 dark:bg-gray-900/50">
                                            <tr>
                                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">AD Title</th>
                                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Type</th>
                                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">Status</th>
                                                <th className="px-4 py-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase text-right">CTR</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                            {publisherAds.length > 0 ? publisherAds.map((ad, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-gray-100 max-w-[150px] truncate">{ad.title}</td>
                                                    <td className="px-4 py-3 text-xs text-gray-500 dark:text-gray-400 font-medium">{ad.type}</td>
                                                    <td className="px-4 py-3"><StatusBadge status={ad.status} /></td>
                                                    <td className="px-4 py-3 text-right text-xs font-bold text-primary-600 dark:text-primary-400">{ad.ctr}%</td>
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
