import { useEffect, useMemo, useState } from 'react'
import { ShieldPlus, Trash2, Lock, Unlock } from 'lucide-react'
import PageHeader from '../components/shared/PageHeader'
import StatusBadge from '../components/shared/StatusBadge'
import {
  createSubAdmin,
  deleteSubAdmin,
  fetchSubAdmins,
  lockSubAdmin,
  unlockSubAdmin,
  updateSubAdmin,
} from '../lib/subAdmins'
import type { PermissionKey } from '../lib/auth'
import type { SubAdminRecord } from '../lib/subAdmins'

const permissionOptions: Array<{ key: PermissionKey; label: string }> = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'admins', label: 'Admin Management' },
  { key: 'publishers', label: 'Publishers' },
  { key: 'ads', label: 'Advertisements' },
  { key: 'revenue', label: 'Revenue' },
  { key: 'transactions', label: 'Transactions' },
  { key: 'tickets', label: 'Tickets' },
  { key: 'auditLogs', label: 'Audit Logs' },
  { key: 'profile', label: 'Profile' },
  { key: 'settings', label: 'Settings' },
]

const defaultPermissions = permissionOptions.reduce((acc, item) => {
  acc[item.key] = item.key === 'dashboard' || item.key === 'profile' || item.key === 'settings'
  return acc
}, {} as Record<PermissionKey, boolean>)

export default function SubAdmins() {
  const [subAdmins, setSubAdmins] = useState<SubAdminRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    permissions: { ...defaultPermissions },
  })

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchSubAdmins()
      setSubAdmins(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load sub-admin accounts'
      setSubAdmins([])
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const enabledCount = useMemo(() => Object.values(form.permissions).filter(Boolean).length, [form.permissions])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await createSubAdmin(form)
      setForm({ name: '', email: '', phone: '', password: '', permissions: { ...defaultPermissions } })
      await load()
    } finally {
      setSaving(false)
    }
  }

  const handleToggleLock = async (admin: SubAdminRecord) => {
    if (admin.locked) {
      await unlockSubAdmin(admin.id)
    } else {
      await lockSubAdmin(admin.id)
    }
    await load()
  }

  const handleDelete = async (admin: SubAdminRecord) => {
    const confirmed = window.confirm(`Delete sub-admin ${admin.email}?`)
    if (!confirmed) return
    await deleteSubAdmin(admin.id)
    await load()
  }

  const handleQuickPermissionToggle = async (admin: SubAdminRecord, permission: PermissionKey) => {
    const updated = {
      ...admin.permissions,
      [permission]: !admin.permissions?.[permission],
    }

    await updateSubAdmin(admin.id, {
      permissions: updated,
    })
    await load()
  }

  return (
    <div className="space-y-6 pb-8">
      <PageHeader
        title="Sub-Super Admins"
        subtitle="Master Super Admin can create and manage module-level permissions for sub-admin accounts."
        actions={null}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 card-floating p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldPlus size={18} className="text-primary-600" />
            <h3 className="font-bold text-gray-900">Create Sub-Admin</h3>
          </div>
          <form onSubmit={handleCreate} className="space-y-3">
            <input className="input-field" placeholder="Name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} required />
            <input className="input-field" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))} required />
            <input className="input-field" placeholder="Phone" value={form.phone} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} required />
            <input className="input-field" type="password" placeholder="Temporary Password" value={form.password} onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))} required minLength={6} />

            <div className="pt-2">
              <p className="text-xs font-semibold text-gray-500 mb-2">Module Permissions ({enabledCount} enabled)</p>
              <div className="grid grid-cols-2 gap-2">
                {permissionOptions.map((item) => (
                  <label key={item.key} className="flex items-center gap-2 text-xs text-gray-700">
                    <input
                      type="checkbox"
                      checked={form.permissions[item.key]}
                      onChange={() => setForm((s) => ({
                        ...s,
                        permissions: {
                          ...s.permissions,
                          [item.key]: !s.permissions[item.key],
                        },
                      }))}
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" disabled={saving} className="btn-primary w-full">
              {saving ? 'Creating...' : 'Create Sub-Admin'}
            </button>
          </form>
        </div>

        <div className="xl:col-span-2 card-floating p-0 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Sub-Admin Accounts</h3>
            <span className="text-xs text-gray-500">{subAdmins.length} accounts</span>
          </div>

          {error ? (
            <div className="mx-5 mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-xs text-gray-500 uppercase">Account</th>
                  <th className="px-4 py-3 text-xs text-gray-500 uppercase">Status</th>
                  <th className="px-4 py-3 text-xs text-gray-500 uppercase">Permissions</th>
                  <th className="px-4 py-3 text-xs text-gray-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td className="px-4 py-8 text-sm text-gray-500" colSpan={4}>Loading...</td></tr>
                ) : subAdmins.length === 0 ? (
                  <tr><td className="px-4 py-8 text-sm text-gray-500" colSpan={4}>No sub-admin accounts found.</td></tr>
                ) : subAdmins.map((admin) => (
                  <tr key={admin.id}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900 text-sm">{admin.name}</p>
                      <p className="text-xs text-gray-500">{admin.email}</p>
                      <p className="text-xs text-gray-400">{admin.phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={admin.locked ? 'Suspended' : 'Active'} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {permissionOptions.map((item) => (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => handleQuickPermissionToggle(admin, item.key)}
                            className={`px-2 py-1 rounded text-[10px] font-semibold border ${admin.permissions?.[item.key] ? 'bg-primary-50 text-primary-700 border-primary-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleToggleLock(admin)} className="p-2 rounded hover:bg-gray-100 text-gray-600" title={admin.locked ? 'Unlock' : 'Lock'}>
                          {admin.locked ? <Unlock size={16} /> : <Lock size={16} />}
                        </button>
                        <button onClick={() => handleDelete(admin)} className="p-2 rounded hover:bg-red-50 text-red-600" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
