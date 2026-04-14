
import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle2, XCircle, AlertCircle, RefreshCw, FileText, Phone, Mail, Building2, Calendar } from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import DataTable from '../components/shared/DataTable';
import StatusBadge from '../components/shared/StatusBadge';
import DetailDrawer from '../components/shared/DetailDrawer';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import { mockAdmins, mockPublishers } from '../data/mockData';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Pending');
  
  // Dialog states
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, type: '', admin: null });

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setAdmins(mockAdmins);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleAction = (type, admin) => {
    setConfirmDialog({ isOpen: true, type, admin });
  };

  const executeAction = (reason) => {
    const { type, admin } = confirmDialog;
    
    // Simulate UI update
    setAdmins(prev => prev.map(a => {
      if (a.id === admin.id) {
        let newStatus = a.status;
        if (type === 'Approve') newStatus = 'Active';
        if (type === 'Reject') newStatus = 'Rejected';
        if (type === 'Suspend') newStatus = 'Suspended';
        if (type === 'Reinstate') newStatus = 'Active';
        return { ...a, status: newStatus };
      }
      return a;
    }));

    // Show toast (native alert for now as per "UI only" but premium feel)
    if (type === 'Approve') {
      console.log(`Approval email sent to ${admin.email}`);
      // In a real app we'd use a toast library. Let's assume a toast exists or just log.
    }
    
    setConfirmDialog({ isOpen: false, type: '', admin: null });
    if (selectedAdmin && selectedAdmin.id === admin.id) {
        setIsDrawerOpen(false);
    }
  };

  const tabs = [
    { id: 'Pending', label: 'Pending Admins', color: { bg: 'bg-amber-100', text: 'text-amber-600', active: 'bg-amber-600' } },
    { id: 'Active', label: 'Active Admins', color: { bg: 'bg-green-100', text: 'text-green-600', active: 'bg-green-600' } },
    { id: 'Suspended', label: 'Suspended Admins', color: { bg: 'bg-orange-100', text: 'text-orange-600', active: 'bg-orange-600' } },
    { id: 'Rejected', label: 'Rejected Admins', color: { bg: 'bg-red-100', text: 'text-red-500', active: 'bg-red-600' } },
  ];

  const getColumns = (status) => {
    const baseColumns = [
      { key: 'id', label: 'Admin ID', className: 'font-mono text-xs font-bold' },
      { key: 'name', label: 'Name', render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs uppercase">
            {val.charAt(0)}
          </div>
          <span className="font-semibold text-gray-900">{val}</span>
        </div>
      )},
      { key: 'email', label: 'Email' },
      { key: 'company', label: 'Company', render: (val) => <span className="font-medium text-gray-700">{val}</span> },
      { key: 'registeredDate', label: 'Registered Date' },
      { key: 'actions', label: 'Actions', render: (_, row) => (
        <div className="flex items-center gap-1">
          <button 
            onClick={(e) => { e.stopPropagation(); setSelectedAdmin(row); setIsDrawerOpen(true); }}
            className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
            title="View Details"
          >
            <Eye size={18} />
          </button>
          
          {row.status === 'Pending' && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); handleAction('Approve', row); }}
                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                title="Approve"
              >
                <CheckCircle2 size={18} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); handleAction('Reject', row); }}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                title="Reject"
              >
                <XCircle size={18} />
              </button>
            </>
          )}
          
          {row.status === 'Active' && (
            <button 
              onClick={(e) => { e.stopPropagation(); handleAction('Suspend', row); }}
              className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
              title="Suspend"
            >
              <AlertCircle size={18} />
            </button>
          )}
          
          {row.status === 'Suspended' && (
            <button 
              onClick={(e) => { e.stopPropagation(); handleAction('Reinstate', row); }}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
              title="Reinstate"
            >
              <RefreshCw size={18} />
            </button>
          )}
        </div>
      )}
    ];
    return baseColumns;
  };

  const adminPublishers = selectedAdmin 
    ? mockPublishers.filter(p => p.adminId === selectedAdmin.id)
    : [];

  return (
    <div className="pb-10 space-y-8">
      <div className="animate-fade-in-scale">
        <PageHeader 
          title="Admin Management" 
          subtitle="System-wide governance of regional ecosystem administrators"
        />
      </div>

      <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-xl shadow-gray-200/50 relative z-10 animate-fade-in-scale delay-75">
        {tabs.map((tab) => {
          const count = admins.filter(a => a.status === tab.id).length;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all duration-300 relative group ${
                isActive 
                  ? 'bg-white shadow-lg shadow-gray-200/50 text-gray-900 translate-y-[-1px]' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-white/40'
              }`}
            >
              <span className={`text-sm font-bold tracking-tight ${isActive ? 'scale-105' : ''} transition-transform`}>
                {tab.label}
              </span>
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black tracking-tighter ${tab.color.bg} ${tab.color.text} shadow-sm border border-black/5`}>
                {count}
              </span>
              {isActive && (
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary-500 rounded-full shadow-[0_0_12px_rgba(var(--primary-rgb),0.6)] animate-pulse-subtle" />
              )}
            </button>
          );
        })}
      </div>

      <div className="relative min-h-[500px]">
        {tabs.map((tab) => (
          <div 
            key={tab.id} 
            className={`transition-all duration-500 absolute inset-0 ${
              activeTab === tab.id 
                ? 'opacity-100 translate-y-0 pointer-events-auto' 
                : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
          >
             <div className="card-floating p-0 overflow-hidden hover-glow-border h-full">
                <DataTable 
                  columns={getColumns(tab.id)} 
                  data={admins.filter(a => a.status === tab.id)} 
                  isLoading={isLoading}
                  emptyMessage={`No ${tab.id.toLowerCase()} admins found`}
                  onRowClick={(row) => { setSelectedAdmin(row); setIsDrawerOpen(true); }}
                />
             </div>
          </div>
        ))}
      </div>

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Admin Details"
        footerActions={
            selectedAdmin && (
                <div className="flex items-center gap-2">
                    {selectedAdmin.status === 'Pending' && (
                        <>
                            <button onClick={() => handleAction('Approve', selectedAdmin)} className="px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-green-600/20 active:scale-95 transition-all">Approve</button>
                            <button onClick={() => handleAction('Reject', selectedAdmin)} className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-600/20 active:scale-95 transition-all">Reject</button>
                        </>
                    )}
                    {selectedAdmin.status === 'Active' && (
                        <button onClick={() => handleAction('Suspend', selectedAdmin)} className="px-4 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-orange-600/20 active:scale-95 transition-all">Suspend</button>
                    )}
                    {selectedAdmin.status === 'Suspended' && (
                        <button onClick={() => handleAction('Reinstate', selectedAdmin)} className="px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-green-600/20 active:scale-95 transition-all">Reinstate</button>
                    )}
                </div>
            )
        }
      >
        {selectedAdmin && (
          <div className="space-y-8 animate-fade-in">
            {/* Header Profile */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-bold">
                {selectedAdmin.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedAdmin.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <StatusBadge status={selectedAdmin.status} />
                  <span className="text-xs text-gray-400 font-medium font-mono">{selectedAdmin.id}</span>
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 text-primary-500 mb-2">
                    <Mail size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{selectedAdmin.email}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 text-primary-500 mb-2">
                    <Phone size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone Number</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{selectedAdmin.phone}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 text-primary-500 mb-2">
                    <Building2 size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Company</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{selectedAdmin.company}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2 text-primary-500 mb-2">
                    <Calendar size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Registered</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{selectedAdmin.registeredDate}</p>
              </div>
            </div>

            {/* KPI Summary */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Performance Summary</h4>
              <div className="grid grid-cols-3 gap-3">
                {[
                    { label: 'Total Ads', value: '124', color: 'text-indigo-600' },
                    { label: 'Revenue', value: '₹4.5L', color: 'text-green-600' },
                    { label: 'Avg CTR', value: '3.2%', color: 'text-primary-600' },
                ].map((kpi, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-xl border border-gray-100 text-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1">{kpi.label}</p>
                        <p className={`text-lg font-black ${kpi.color}`}>{kpi.value}</p>
                    </div>
                ))}
              </div>
            </div>

            {/* Submitted Documents */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Verification Documents</h4>
              <div className="space-y-2">
                {[
                  { name: 'GST Certificate.pdf', type: 'GST Registration' },
                  { name: 'Company_Registration.pdf', type: 'COI' }
                ].map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white border border-gray-100 rounded-xl hover:border-primary-200 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-50 text-red-500 rounded-lg">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">{doc.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">{doc.type}</p>
                      </div>
                    </div>
                    <button className="text-xs font-bold text-primary-500 hover:underline">View</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Publisher List */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Publishers Under Management</h4>
              <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase">Name</th>
                      <th className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase">Status</th>
                      <th className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase text-right">Ads</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {adminPublishers.length > 0 ? adminPublishers.map((pub, idx) => (
                        <tr key={idx} className="text-sm">
                            <td className="px-4 py-3 font-medium text-gray-900">{pub.name}</td>
                            <td className="px-4 py-3"><StatusBadge status={pub.status} /></td>
                            <td className="px-4 py-3 text-right font-bold text-gray-700">{pub.adsPosted}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="3" className="px-4 py-8 text-center text-gray-400 text-xs">No publishers linked yet</td>
                        </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </DetailDrawer>

      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ isOpen: false, type: '', admin: null })}
          onConfirm={executeAction}
          title={`${confirmDialog.type} Admin`}
          message={
            confirmDialog.type === 'Approve' ? "Approve this admin? An email will be sent to them." :
            confirmDialog.type === 'Reject' ? "Reject this admin? This action cannot be undone." :
            confirmDialog.type === 'Suspend' ? "Suspend this admin? They will lose platform access." :
            confirmDialog.type === 'Reinstate' ? "Reinstate this admin? They will regain platform access." :
            `Are you sure you want to ${confirmDialog.type.toLowerCase()} ${confirmDialog.admin?.name}?`
          }
          confirmText={confirmDialog.type === 'Reinstate' ? 'Reinstate Account' : `${confirmDialog.type} Account`}
          type={confirmDialog.type === 'Reject' || confirmDialog.type === 'Suspend' ? 'danger' : 'primary'}
          requireReason={confirmDialog.type === 'Reject'}
          reasonPlaceholder="Explain why this application is being rejected..."
        />
      )}
    </div>
  );
};

export default AdminManagement;
