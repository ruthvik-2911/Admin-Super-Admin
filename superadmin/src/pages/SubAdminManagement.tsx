
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  UserPlus, 
  MoreVertical, 
  Trash2, 
  ShieldAlert, 
  UserCheck, 
  Clock, 
  Globe, 
  Monitor,
  LayoutDashboard,
  BarChart3,
  Users,
  Radio,
  Megaphone,
  DollarSign,
  Ticket
} from 'lucide-react';
import PageHeader from '../components/shared/PageHeader';
import DataTable from '../components/shared/DataTable';
import StatusBadge from '../components/shared/StatusBadge';
import DetailDrawer from '../components/shared/DetailDrawer';
import ConfirmDialog from '../components/shared/ConfirmDialog';
import { mockSubAdmins } from '../data/mockData';

const SubAdminManagement: React.FC = () => {
  const [subAdmins, setSubAdmins] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubAdmin, setSelectedSubAdmin] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempPermissions, setTempPermissions] = useState<any>(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, type: '', subAdmin: null });

  useEffect(() => {
    const timer = setTimeout(() => {
      setSubAdmins(mockSubAdmins);
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleAction = (type: string, subAdmin: any) => {
    setConfirmDialog({ isOpen: true, type, subAdmin });
  };

  const executeAction = () => {
    const { type, subAdmin } = confirmDialog;
    
    setSubAdmins(prev => prev.map(s => {
      if (s.id === subAdmin.id) {
        if (type === 'Suspend') return { ...s, status: 'Suspended' };
        if (type === 'Activate') return { ...s, status: 'Active' };
        return s;
      }
      return s;
    }).filter(s => type === 'Delete' ? s.id !== subAdmin.id : true));

    setConfirmDialog({ isOpen: false, type: '', subAdmin: null });
    if (selectedSubAdmin && selectedSubAdmin.id === subAdmin.id) {
      setIsDrawerOpen(false);
    }
  };

  const startEditing = () => {
    setTempPermissions({ ...selectedSubAdmin.permissions });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setTempPermissions(null);
  };

  const savePermissions = () => {
    setSubAdmins(prev => prev.map(s => {
      if (s.id === selectedSubAdmin.id) {
        return { ...s, permissions: tempPermissions };
      }
      return s;
    }));
    
    setSelectedSubAdmin(prev => ({ ...prev, permissions: tempPermissions }));
    setIsEditing(false);
    setTempPermissions(null);
  };

  const togglePermission = (key: string) => {
    if (!isEditing) return;
    setTempPermissions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const columns = [
    { key: 'id', label: 'ID', className: 'font-mono text-[10px] font-bold text-gray-400' },
    { 
      key: 'name', 
      label: 'Sub-Admin', 
      render: (val: string, row: any) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-700 dark:text-primary-400 font-bold text-xs uppercase">
            {val.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-black text-gray-900 dark:text-white leading-none">{val}</span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold mt-1 uppercase tracking-tighter">{row.email}</span>
          </div>
        </div>
      ) 
    },
    { 
      key: 'permissions', 
      label: 'Access Scope', 
      render: (permissions: any) => {
        const activeModules = Object.entries(permissions).filter(([_, val]) => val).length;
        const totalModules = Object.entries(permissions).length;
        return (
          <div className="flex items-center gap-2">
            <div className="flex -space-x-1.5 overflow-hidden">
               {permissions.dashboard && <div className="w-5 h-5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-500 dark:text-blue-400 border-2 border-white dark:border-gray-900 flex items-center justify-center"><LayoutDashboard size={10} /></div>}
               {permissions.analytics && <div className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-900/40 text-indigo-500 dark:text-indigo-400 border-2 border-white dark:border-gray-900 flex items-center justify-center"><BarChart3 size={10} /></div>}
               {permissions.ads && <div className="w-5 h-5 rounded-full bg-orange-50 dark:bg-orange-900/40 text-orange-500 dark:text-orange-400 border-2 border-white dark:border-gray-900 flex items-center justify-center"><Megaphone size={10} /></div>}
               {permissions.tickets && <div className="w-5 h-5 rounded-full bg-primary-50 dark:bg-primary-900/40 text-primary-500 dark:text-primary-400 border-2 border-white dark:border-gray-900 flex items-center justify-center"><Ticket size={10} /></div>}
            </div>
            <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{activeModules}/{totalModules} Modules</span>
          </div>
        )
      }
    },
    { key: 'status', label: 'Status', render: (val: string) => <StatusBadge status={val} /> },
    { key: 'lastLogin', label: 'Last Active', className: 'text-xs font-semibold text-gray-400' },
    { 
      key: 'actions', 
      label: '', 
      render: (_: any, row: any) => (
        <div className="flex items-center justify-end gap-1">
          <button 
            onClick={(e) => { e.stopPropagation(); handleAction(row.status === 'Active' ? 'Suspend' : 'Activate', row); }}
            className={`p-2 rounded-lg transition-all ${row.status === 'Active' ? 'text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:text-orange-600 dark:hover:text-orange-400' : 'text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400'}`}
          >
            {row.status === 'Active' ? <ShieldAlert size={18} /> : <UserCheck size={18} />}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleAction('Delete', row); }}
            className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  const kpis = [
    { label: 'Total Sub-Admins', value: subAdmins.length, icon: ShieldCheck, color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Active Sessions', value: subAdmins.filter(s => s.status === 'Active').length, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Recently Logged', value: 'Today', icon: Clock, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="pb-10 space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <PageHeader 
          title="Sub-Admin Management" 
          subtitle="Define organizational structure and manage granular access controls for secondary administrators"
        />
        <button className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-2xl text-sm font-black shadow-lg shadow-primary-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
          <UserPlus size={18} />
          Create Sub-Admin
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-scale">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white dark:bg-[#1A1D24] p-6 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-5 group hover:shadow-lg transition-all">
            <div className={`p-4 rounded-3xl ${kpi.bg} dark:bg-opacity-10 ${kpi.color} group-hover:scale-110 transition-transform`}>
              <kpi.icon size={28} />
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1">{kpi.label}</p>
              <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{kpi.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-[#1A1D24] rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden animate-fade-in-scale delay-75">
        <DataTable 
          columns={columns} 
          data={subAdmins} 
          isLoading={isLoading}
          onRowClick={(row) => { setSelectedSubAdmin(row); setIsDrawerOpen(true); }}
          className="hover-glow-border"
        />
      </div>

      <DetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => { setIsDrawerOpen(false); cancelEditing(); }}
        title="Sub-Admin Governance"
        footerActions={
            selectedSubAdmin && (
                <div className="flex items-center gap-3 w-full">
                    {isEditing ? (
                        <>
                            <button 
                                onClick={savePermissions}
                                className="flex-1 px-6 py-2.5 bg-primary-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary-500/20 active:scale-95 transition-all"
                            >
                                Save Changes
                            </button>
                            <button 
                                onClick={cancelEditing}
                                className="px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-200 dark:hover:bg-gray-700 transition-all font-mono"
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => handleAction('Suspend', selectedSubAdmin)} className="flex-1 px-6 py-2.5 bg-orange-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-orange-600/20 active:scale-95 transition-all">Suspend Access</button>
                            <button onClick={() => handleAction('Delete', selectedSubAdmin)} className="p-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"><Trash2 size={20} /></button>
                        </>
                    )}
                </div>
            )
        }
      >
        {selectedSubAdmin && (
            <div className="space-y-10 animate-fade-in">
              {/* Profile Overview */}
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white dark:border-gray-800 shadow-xl">
                    {selectedSubAdmin.name.charAt(0)}
                </div>
                <div className="space-y-1">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{selectedSubAdmin.name}</h3>
                    <div className="flex items-center gap-3">
                        <StatusBadge status={selectedSubAdmin.status} />
                        <span className="text-xs font-bold font-mono text-gray-400">{selectedSubAdmin.id}</span>
                    </div>
                </div>
              </div>

              {/* Permissions Matrix */}
              <div className="space-y-4">
                 <div className="flex items-center justify-between px-1">
                    <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">Module Access Scope</h4>
                    {!isEditing && (
                        <button 
                            onClick={startEditing}
                            className="text-[10px] font-black text-primary-500 uppercase tracking-widest hover:underline"
                        >
                            Edit Level
                        </button>
                    )}
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                    {[
                        { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
                        { key: 'analytics', label: 'Analytics', icon: BarChart3 },
                        { key: 'admins', label: 'Admins', icon: Users },
                        { key: 'publishers', label: 'Publishers', icon: Radio },
                        { key: 'ads', label: 'Ads', icon: Megaphone },
                        { key: 'revenue', label: 'Revenue', icon: DollarSign },
                        { key: 'tickets', label: 'Support', icon: Ticket },
                    ].map((mod) => {
                        const permissions = isEditing ? tempPermissions : selectedSubAdmin.permissions;
                        const isGranted = permissions[mod.key];
                        
                        return (
                            <button 
                                key={mod.key} 
                                onClick={() => togglePermission(mod.key)}
                                disabled={!isEditing}
                                className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left
                                    ${isGranted 
                                        ? 'bg-primary-50/20 border-primary-100 shadow-sm' 
                                        : 'bg-gray-50/50 border-gray-100 opacity-60 grayscale'
                                    }
                                    ${isEditing ? 'hover:scale-[1.02] active:scale-[0.98] cursor-pointer ring-primary-500/10 hover:ring-2' : ''}
                                `}
                            >
                                <div className="flex items-center gap-3">
                                    <mod.icon size={18} className={isGranted ? 'text-primary-500' : 'text-gray-400 dark:text-gray-600'} />
                                    <span className="text-xs font-black text-gray-900 dark:text-white tracking-tight">{mod.label}</span>
                                </div>
                                {isGranted ? 
                                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20"><UserCheck size={12} /></span> : 
                                    <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center"><ShieldAlert size={12} /></span>
                                }
                            </button>
                        );
                    })}
                 </div>
              </div>

              {/* Login Audit Trail */}
              <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] px-1">Login Audit Trail</h4>
                  <div className="space-y-3">
                    {selectedSubAdmin.loginActivity.map((log: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl hover:border-primary-200 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-600 rounded-xl group-hover:bg-primary-50 dark:group-hover:bg-primary-900/20 group-hover:text-primary-500 transition-colors">
                                    <Monitor size={18} />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-black text-gray-900 dark:text-white leading-none">{log.location}</p>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{log.ip}</p>
                                </div>
                            </div>
                            <div className="text-right space-y-1">
                                <p className="text-xs font-black text-gray-900 dark:text-white">{log.time}</p>
                                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{log.date}</p>
                            </div>
                        </div>
                    ))}
                  </div>
              </div>
            </div>
        )}
      </DetailDrawer>

      {/* Action Dialog */}
      {confirmDialog.isOpen && (
        <ConfirmDialog
          isOpen={confirmDialog.isOpen}
          onClose={() => setConfirmDialog({ isOpen: false, type: '', subAdmin: null })}
          onConfirm={executeAction}
          title={`${confirmDialog.type} Sub-Admin Access`}
          message={`Are you sure you want to ${confirmDialog.type.toLowerCase()} account permissions for ${confirmDialog.subAdmin?.name}?`}
          confirmText={`${confirmDialog.type} Account`}
          type={confirmDialog.type === 'Delete' || confirmDialog.type === 'Suspend' ? 'danger' : 'primary'}
        />
      )}
    </div>
  );
};

export default SubAdminManagement;
