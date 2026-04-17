import React, { useState, useEffect } from 'react';
import { Eye, AlertCircle, MapPin, Target, BarChart3, Megaphone, User, Radio, ExternalLink } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import StatusBadge from '../components/shared/StatusBadge';
import DetailDrawer from '../components/shared/DetailDrawer';
import FilterBar from '../components/shared/FilterBar';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import { fetchAdvertisements, suspendAdvertisement } from '../lib/ads';

const AdvertisementMonitoring = () => {
    const [ads, setAds] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedAd, setSelectedAd] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({ status: null, type: null, adType: null });
    
    // Dialog state
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, ad: null });

    const formatMetric = (value, suffix = '') => {
        if (value === null || value === undefined) {
            return 'N/A';
        }

        if (typeof value === 'number') {
            return `${value.toLocaleString()}${suffix}`;
        }

        return `${value}${suffix}`;
    };

    useEffect(() => {
        let active = true;

        const loadAdvertisements = async () => {
            setIsLoading(true);
            setError('');

            try {
                const data = await fetchAdvertisements();
                if (active) {
                    setAds(data);
                }
            } catch (err) {
                if (active) {
                    setAds([]);
                    setError(err instanceof Error ? err.message : 'Unable to load advertisements');
                }
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        };

        loadAdvertisements();
        return () => { active = false; };
    }, []);

    const handleSuspend = (ad) => {
        setConfirmDialog({ isOpen: true, ad });
    };

    const executeSuspend = async () => {
        const { ad } = confirmDialog;
        if (!ad) {
            return;
        }

        try {
            const updatedAd = await suspendAdvertisement(ad.id);
            setAds(prev => prev.map(a => a.id === ad.id ? updatedAd : a));
            if (selectedAd && selectedAd.id === ad.id) {
                setSelectedAd(updatedAd);
            }
            setConfirmDialog({ isOpen: false, ad: null });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unable to suspend advertisement');
        }
    };

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

            {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                </div>
            )}

            {/* Ads Grid View */}
            <div className="animate-fade-in-scale delay-200">
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="aspect-[4/5] bg-white rounded-[2.5rem] border border-gray-100 animate-pulse" />
                        ))}
                    </div>
                ) : filteredData.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredData.map((ad) => (
                            <div 
                                key={ad.id}
                                onClick={() => { setSelectedAd(ad); setIsDrawerOpen(true); }}
                                className="group relative bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-primary-500/10 transition-all duration-500 cursor-pointer overflow-hidden flex flex-col animate-fade-in"
                            >
                                {/* Image Preview Wrapper */}
                                <div className="aspect-[4/3] w-full overflow-hidden relative">
                                    <img 
                                        src={ad.image || 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&q=80'} 
                                        alt={ad.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                    
                                    {/* Status Badge Over Image */}
                                    <div className="absolute top-4 right-4 z-10 transition-transform duration-300 group-hover:translate-x-1">
                                        <StatusBadge status={ad.status} />
                                    </div>

                                    {/* Type Tag */}
                                    <div className="absolute bottom-4 left-4 z-10">
                                        <div className="px-3 py-1.5 bg-white/20 backdrop-blur-md border border-white/20 text-white text-[10px] font-black rounded-xl uppercase tracking-widest shadow-xl">
                                            {ad.type}
                                        </div>
                                    </div>
                                </div>

                                {/* Content Details */}
                                <div className="p-6 flex-1 flex flex-col relative">
                                    <div className="mb-1">
                                        <span className="text-[10px] font-black text-gray-400 font-mono tracking-tighter bg-gray-50 px-2 py-0.5 rounded-md">ID: {ad.id}</span>
                                    </div>
                                    <h4 className="text-lg font-black text-gray-900 leading-tight mb-6 group-hover:text-primary-600 transition-colors line-clamp-2">
                                        {ad.title}
                                    </h4>

                                    <div className="mt-auto pt-5 border-t border-gray-50 flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Impressions</p>
                                            <p className="text-base font-black text-gray-900 tracking-tight">{formatMetric(ad.impressions)}</p>
                                        </div>
                                        <div className="space-y-1 text-right">
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Avg CTR</p>
                                            <p className="text-base font-black text-primary-500 tracking-tight">{formatMetric(ad.ctr, ad.ctr === null || ad.ctr === undefined ? '' : '%')}</p>
                                        </div>
                                    </div>

                                    {/* Floating Hover Actions */}
                                    <div className="absolute -top-6 right-6 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setSelectedAd(ad); setIsDrawerOpen(true); }}
                                            className="w-12 h-12 bg-white shadow-xl rounded-2xl flex items-center justify-center text-primary-500 hover:bg-primary-500 hover:text-white transition-all active:scale-90 border border-gray-50"
                                        >
                                            <Eye size={20} />
                                        </button>
                                        {ad.status === 'Active' && (
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleSuspend(ad); }}
                                                className="w-12 h-12 bg-white shadow-xl rounded-2xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90 border border-gray-50"
                                            >
                                                <AlertCircle size={20} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="card-floating py-20 flex flex-col items-center justify-center text-center">
                         <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-4">
                            <Megaphone size={40} />
                         </div>
                         <h3 className="text-xl font-black text-gray-900">No campaigns found</h3>
                         <p className="text-sm text-gray-400 mt-2">Try adjusting your filters or search criteria</p>
                    </div>
                )}
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
                                            <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${Math.min((parseFloat(selectedAd.radius) || 0) * 10, 100)}%` }} />
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
                                    { label: 'Impressions', value: formatMetric(selectedAd.impressions) },
                                    { label: 'Clicks', value: formatMetric(selectedAd.clicks) },
                                    { label: 'Avg CTR', value: formatMetric(selectedAd.ctr, selectedAd.ctr === null || selectedAd.ctr === undefined ? '' : '%'), highlight: true }
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
