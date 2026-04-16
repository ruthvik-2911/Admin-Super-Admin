import * as React from "react"
import { Building2, Mail, Phone, MapPin, CheckCircle2, XCircle } from "lucide-react"
import type { Publisher } from "../../services/publishers"
import { motion } from "framer-motion"

interface PublisherInfoCardProps {
  publisher: Publisher
}

export function PublisherInfoCard({ publisher }: PublisherInfoCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white dark:bg-[#1A1D24] rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-800"
    >
      <div className="flex items-start justify-between mb-6 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-primary-50 dark:bg-primary-500/10 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-xl shadow-inner uppercase">
            {publisher.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {publisher.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{publisher.location}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {publisher.status === "Active" ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-green-700 dark:text-green-400 rounded-full bg-green-50 dark:bg-green-500/10">
              <CheckCircle2 className="w-4 h-4" /> Active
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 dark:text-red-400 rounded-full bg-red-50 dark:bg-red-500/10">
              <XCircle className="w-4 h-4" /> Inactive
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
        <div className="flex gap-4">
          <div className="mt-1 text-gray-400"><Building2 className="w-5 h-5" /></div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Person</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{publisher.contactPerson}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="mt-1 text-gray-400"><Phone className="w-5 h-5" /></div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile Number</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5">{publisher.mobile}</p>
          </div>
        </div>

        <div className="flex gap-4 min-w-0">
          <div className="mt-1 text-gray-400 shrink-0"><Mail className="w-5 h-5" /></div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5 break-all" title={publisher.email}>{publisher.email}</p>
          </div>
        </div>

        <div className="flex gap-4 min-w-0">
          <div className="mt-1 text-gray-400 shrink-0"><MapPin className="w-5 h-5" /></div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Location Data</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-0.5 leading-relaxed break-words" title={publisher.address}>{publisher.address || "N/A"}</p>
            <div className="mt-2 flex items-center gap-2">
                <span className="px-1.5 py-0.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded text-[10px] font-bold border border-orange-100 dark:border-orange-800/50">Lat: {publisher.latitude?.toFixed(4) || "0.0"}</span>
                <span className="px-1.5 py-0.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded text-[10px] font-bold border border-orange-100 dark:border-orange-800/50">Lng: {publisher.longitude?.toFixed(4) || "0.0"}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
