
import React, { useState, useEffect } from 'react';
import { Eye, AlertCircle, MapPin, Target, Calendar, BarChart3, Megaphone, User, Radio, ExternalLink } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import DataTable from '../components/shared/DataTable';
import StatusBadge from '../components/shared/StatusBadge';
import DetailDrawer from '../components/shared/DetailDrawer';
import FilterBar from '../components/shared/FilterBar';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import { mockAds, mockAdmins, mockPublishers } from '../data/mockData';

const AdvertisementMonitoring = () => {
    const [ads, setAds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAd, setSelectedAd] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({ status: null, type: null, adType: null });
    
    // Dialog state
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, ad: null });

    useEffect(() => {
        const timer = setTimeout(() => {
            setAds(mockAds);
            setIsLoading(false);
        }, 800);
        return () => clearTimeout(timer);
    }, []);

    const handleSuspend = (ad) => {
        setConfirmDialog({ isOpen: true, ad });
    };

    const executeSuspend = () => {
        const { ad } = confirmDialog;
        setAds(prev => prev.map(a => a.id === ad.id ? { ...a, status: 'Suspended' } : a));
        if (selectedAd && selectedAd.id === ad.id) {
            setSelectedAd(prev => ({ ...prev, status: 'Suspended' }));
        }
        setConfirmDialog({ isOpen: false, ad: null });
    };

    const columns = [
        { key: 'id', label: 'ID', className: 'font-mono text-[10px] font-bold text-gray-400' },
        { key: 'title', label: 'Campaign Title', render: (val) => <span className="font-bold text-gray-900">{val}</span> },
        { key: 'type', label: 'Ad Type' },
        { key: 'adminName', label: 'Admin', render: (val) => <span className="text-xs font-semibold text-gray-600">{val}</span> },
        { key: 'publisherName', label: 'Publisher', render: (val) => <span className="text-xs font-semibold text-gray-600">{val}</span> },
        { key: 'status', label: 'Status', render: (val) => <StatusBadge status={val} /> },
        { key: 'impressions', label: 'Impr.', className: 'text-right font-medium' },
        { key: 'ctr', label: 'CTR', render: (val) => <span className="font-bold text-primary-500">{val}%</span>, className: 'text-right' },
        { key: 'actions', label: 'Actions', render: (_, row) => (
            <div className="flex items-center gap-1">
                <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedAd(row); setIsDrawerOpen(true); }}
                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                >
                    <Eye size={18} />
                </button>
                {row.status === 'Active' && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleSuspend(row); }}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Suspend Advertisement"
                    >
                        <AlertCircle size={18} />
                    </button>
                )}
            </div>
        )}
    ];

    const filterOptions = [
        { 
            key: 'adType', 
            label: 'Ad Type', 
            type: 'checkbox', 
            options: [
                { label: 'Banner', value: 'Banner' },
                { label: 'Video', value: 'Video' },
                { label: 'Thumbnail', value: 'Thumbnail' }
            ],
            appliedValue: activeFilters.adType
        },
        { 
            key: 'status', 
            label: 'Status', 
            type: 'select', 
            options: [
                { label: 'Active', value: 'Active' },
                { label: 'Draft', value: 'Draft' },
                { label: 'Expired', value: 'Expired' },
                { label: 'Suspended', value: 'Suspended' }
            ],
            appliedValue: activeFilters.status
        }
    ];

    const filteredData = ads.filter(ad => {
        if (activeFilters.status && ad.status !== activeFilters.status) return false;
        if (activeFilters.adType && !activeFilters.adType.includes(ad.type)) return false;
        return true;
    });

    const handleFilterChange = (key, value) => {
        setActiveFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="pb-10 space-y-8 animate-fade-in">
            <div className="animate-fade-in-scale">
                <PageHeader 
                    title="Advertisement Monitoring" 
                    subtitle="System-wide lifecycle management and performance audit of all campaigns"
                />
            </div>

            <div className="card-floating p-0 animate-fade-in-scale delay-100">
                <FilterBar 
                    filters={filterOptions} 
                    onFilterChange={handleFilterChange} 
                    onReset={() => setActiveFilters({})} 
                    activeFiltersCount={Object.values(activeFilters).filter(Boolean).length}
                />
            </div>

            <div className="card-floating p-0 overflow-hidden animate-fade-in-scale delay-200">
                <DataTable 
                    columns={columns} 
                    data={filteredData} 
                    isLoading={isLoading}
                    onRowClick={(row) => { setSelectedAd(row); setIsDrawerOpen(true); }}
                    className="hover-glow-border"
                />
            </div>

            {/* Detail Drawer */}
            <DetailDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                title="Advertisement Deep-Dive"
                footerActions={
                    selectedAd?.status === 'Active' && (
                        <button 
                            onClick={() => handleSuspend(selectedAd)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-black shadow-lg shadow-red-600/20 active:scale-95 transition-all"
                        >
                            <AlertCircle size={14} />
                            Suspend Campaign
                        </button>
                    )
                }
            >
                {selectedAd && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Ad Overview Card */}
                        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="p-3 bg-primary-100 text-primary-600 rounded-2xl">
                                    <Megaphone size={28} />
                                </div>
                                <StatusBadge status={selectedAd.status} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-gray-900 leading-tight">{selectedAd.title}</h3>
                                <p className="text-sm font-medium text-gray-400 mt-1 font-mono tracking-tighter">ID: {selectedAd.id}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                               <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</p>
                                    <p className="text-sm font-bold text-gray-900">{selectedAd.type} Advertisement</p>
                               </div>
                               <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Created On</p>
                                    <p className="text-sm font-bold text-gray-900">{selectedAd.createdDate}</p>
                               </div>
                            </div>
                        </div>

                        {/* Stakeholders */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-inner">
                                <div className="flex items-center gap-2 text-indigo-600 mb-2 font-bold text-[10px] uppercase">
                                    <User size={14} />
                                    Account Admin
                                </div>
                                <p className="text-sm font-black text-gray-900">{selectedAd.adminName}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 shadow-inner">
                                <div className="flex items-center gap-2 text-purple-600 mb-2 font-bold text-[10px] uppercase">
                                    <Radio size={14} />
                                    Publisher
                                </div>
                                <p className="text-sm font-black text-gray-900">{selectedAd.publisherName}</p>
                            </div>
                        </div>

                        {/* Geo-Targeting */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                <MapPin size={16} className="text-primary-500" />
                                Targeting Configuration
                            </h4>
                            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Target City</p>
                                    <p className="text-sm font-bold text-gray-900">{selectedAd.location}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Geo-Radius</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                                            <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: (parseInt(selectedAd.radius) * 10) + '%' }} />
                                        </div>
                                        <p className="text-sm font-bold text-gray-900">{selectedAd.radius}</p>
                                    </div>
                                </div>
                                <div className="col-span-2 space-y-1 pt-2">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Campaign Duration</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-gray-900">{selectedAd.startDate}</span>
                                        <span className="text-gray-300">→</span>
                                        <span className="text-sm font-bold text-gray-900">{selectedAd.endDate}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Real-time Performance */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                <BarChart3 size={16} className="text-primary-500" />
                                Performance Metrics
                            </h4>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { label: 'Impressions', value: selectedAd.impressions.toLocaleString() },
                                    { label: 'Clicks', value: selectedAd.clicks.toLocaleString() },
                                    { label: 'Avg CTR', value: `${selectedAd.ctr}%`, highlight: true }
                                ].map((m, i) => (
                                    <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mb-1">{m.label}</p>
                                        <p className={`text-xl font-black ${m.highlight ? 'text-primary-500' : 'text-gray-900'}`}>{m.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Ad Preview Placeholder */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                <Target size={16} className="text-primary-500" />
                                Ad Creative Preview
                            </h4>
                            <div className="aspect-video bg-gray-100 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 group cursor-pointer hover:bg-gray-50 transition-all hover:border-primary-200">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-primary-500 group-hover:scale-110 shadow-sm transition-all">
                                    <ExternalLink size={24} />
                                </div>
                                <span className="text-sm font-bold text-gray-400 group-hover:text-primary-600">Click to preview active creative</span>
                            </div>
                        </div>
                    </div>
                )}
            </DetailDrawer>

            {/* Suspend Confirmation */}
            {confirmDialog.isOpen && (
                <ConfirmDialog 
                    isOpen={confirmDialog.isOpen}
                    onClose={() => setConfirmDialog({ isOpen: false, ad: null })}
                    onConfirm={executeSuspend}
                    title="Suspend Advertisement"
                    message={`Are you sure you want to suspend the campaign "${confirmDialog.ad?.title}"? This action will take the ad offline immediately.`}
                    confirmText="Suspend Campaign"
                    type="danger"
                />
            )}
        </div>
    );
};

export default AdvertisementMonitoring;
