import * as React from "react"
import { Image as ImageIcon, X, Plus, AlertCircle } from "lucide-react"

interface BannerUploaderProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  error?: string
}

export function BannerUploader({ files, onFilesChange, error }: BannerUploaderProps) {
  const [dragActive, setDragActive] = React.useState(false)
  const MAX = 4

  const addFiles = (incoming: FileList | File[]) => {
    const valid = Array.from(incoming).filter(f => f.type.startsWith("image/"))
    const combined = [...files, ...valid].slice(0, MAX)
    onFilesChange(combined)
  }

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index)
    onFilesChange(updated)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files)
  }

  const remaining = MAX - files.length

  return (
    <div className="space-y-2">
      <div className={`rounded-2xl border-2 p-4 transition-all ${
        error
          ? "border-red-400/60 bg-red-500/5"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1A1D24]"
      }`}>
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center">
            <ImageIcon className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900 dark:text-white">Banner Images</p>
            <p className="text-xs text-gray-400">1–4 images · JPG/PNG · Max 10MB each</p>
          </div>
          <div className="text-[11px] font-black text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-full">
            {files.length} / {MAX}
          </div>
        </div>

        {/* Image Preview Grid */}
        {files.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mb-3">
            {files.map((file, i) => {
              const url = URL.createObjectURL(file)
              return (
                <div key={i} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <img src={url} alt={`Banner ${i + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="absolute bottom-1 left-1 bg-black/60 text-[9px] text-white px-1.5 py-0.5 rounded font-semibold">
                    {i + 1}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Drop Zone — only show when under max */}
        {files.length < MAX && (
          <label
            className={`flex flex-col items-center justify-center gap-2 w-full border-2 border-dashed rounded-xl px-5 py-6 cursor-pointer transition-all ${
              dragActive
                ? "border-blue-500 bg-blue-500/5"
                : error
                  ? "border-red-400/60 hover:border-red-500"
                  : "border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400"
            }`}
            onDragEnter={(e) => { e.preventDefault(); setDragActive(true) }}
            onDragLeave={(e) => { e.preventDefault(); setDragActive(false) }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              dragActive ? "bg-blue-500" : "bg-gray-100 dark:bg-gray-700"
            }`}>
              <Plus className={`w-5 h-5 ${dragActive ? "text-white" : "text-gray-400"}`} />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {files.length === 0 ? "Drag & drop or click to add images" : `Add ${remaining} more image${remaining > 1 ? "s" : ""}`}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">JPEG, PNG · Up to {MAX} total</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(e) => e.target.files && addFiles(e.target.files)}
            />
          </label>
        )}
      </div>

      {error && (
        <p className="text-xs font-semibold text-red-500 px-1 flex items-center gap-1">
          <span className="inline-block w-1 h-1 rounded-full bg-red-500" />
          {error}
        </p>
      )}
    </div>
  )
}
