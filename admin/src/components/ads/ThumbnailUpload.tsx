import * as React from "react"
import { Image as ImageIcon, X, RefreshCw } from "lucide-react"

interface ThumbnailUploadProps {
  thumbnail: File | null
  onThumbnailChange: (file: File | null) => void
  error?: string
}

export function ThumbnailUpload({ thumbnail, onThumbnailChange, error }: ThumbnailUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (thumbnail) {
      const url = URL.createObjectURL(thumbnail)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreviewUrl(null)
    }
  }, [thumbnail])

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return
    onThumbnailChange(file)
  }

  const handleRemove = () => {
    onThumbnailChange(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="space-y-2">
      <div className={`rounded-2xl border-2 p-4 transition-all ${
        error
          ? "border-red-400/60 bg-red-500/5"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1A1D24]"
      }`}>
        {/* Section Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center">
            <ImageIcon className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-white">Image Thumbnail</p>
            <p className="text-xs text-gray-400">Required · JPG/PNG · Max 5MB</p>
          </div>
          {thumbnail && (
            <span className="ml-auto text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 px-2 py-1 rounded-full">
              ✓ Set
            </span>
          )}
        </div>

        {/* Upload Area */}
        {!previewUrl ? (
          <label
            className={`flex items-center gap-4 w-full border-2 border-dashed rounded-xl px-5 py-4 cursor-pointer transition-all group ${
              error
                ? "border-red-400/60 hover:border-red-500"
                : "border-gray-200 dark:border-gray-600 hover:border-brand-500 dark:hover:border-brand-500"
            }`}
          >
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-white">Add a Thumbnail</p>
              <p className="text-xs text-gray-400">Tap to pick & upload</p>
            </div>
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </label>
        ) : (
          <div className="relative rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 bg-black/5 dark:bg-black/20">
            <img
              src={previewUrl}
              alt="Thumbnail Preview"
              className="w-full h-36 object-cover"
            />
            {/* Action Buttons */}
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center gap-3 transition-all duration-200">
              <label className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-900 text-xs font-semibold rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                <RefreshCw className="w-3.5 h-3.5" />
                Replace
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
              </label>
              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Remove
              </button>
            </div>
            <div className="absolute bottom-1.5 left-2 right-2 bg-black/60 backdrop-blur-sm rounded-md px-2 py-1">
              <p className="text-[10px] text-white font-medium truncate">{thumbnail?.name}</p>
            </div>
          </div>
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
