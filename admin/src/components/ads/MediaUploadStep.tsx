import * as React from "react"
import { useFormContext } from "react-hook-form"
import { UploadCloud, X, Image as ImageIcon, Video, AlertCircle } from "lucide-react"

export function MediaUploadStep() {
  const { register, watch, setValue, formState: { errors }, clearErrors } = useFormContext()
  
  const adType = watch("type")
  const fileValue = watch("mediaFile")
  
  const [dragActive, setDragActive] = React.useState(false)
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)

  const isVideo = adType === "Video"
  const expectedFormat = isVideo ? "MP4 video" : "JPG/PNG image"
  const maxSize = isVideo ? "50MB" : "10MB"

  React.useEffect(() => {
    // If adType switches, maybe clear invalid files
    if (fileValue instanceof File) {
      const isActuallyVideo = fileValue.type.startsWith("video/")
      if ((isVideo && !isActuallyVideo) || (!isVideo && isActuallyVideo)) {
         handleRemove()
      }
    }
  }, [adType])

  const handleFile = (file: File) => {
    // Basic validation
    const isVideoFile = file.type.startsWith("video/")
    const isImageFile = file.type.startsWith("image/")

    if (isVideo && !isVideoFile) {
      setValue("mediaFile", null)
      // Custom error logic or rely on Zod, but we'll reject via UI for smoothness
      return
    }

    if (!isVideo && !isImageFile) {
      setValue("mediaFile", null)
      return
    }

    // Set file
    setValue("mediaFile", file, { shouldValidate: true })
    clearErrors("mediaFile")
    
    // Create preview
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleRemove = () => {
    setValue("mediaFile", null, { shouldValidate: true })
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Upload Ad Media</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
        Upload the creative asset for this ad. You selected a <strong>{adType}</strong> format, so please provide a {expectedFormat} under {maxSize}.
      </p>

      {!previewUrl ? (
        <div 
          className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all ${
            dragActive 
              ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10" 
              : errors.mediaFile 
                ? "border-red-300 bg-red-50 dark:border-red-900/50 dark:bg-red-500/10" 
                : "border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-[#1C1F26] hover:border-gray-400 dark:hover:border-gray-600"
          }`}
          onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true) }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false) }}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
          onDrop={handleDrop}
        >
          <div className="w-16 h-16 bg-white dark:bg-[#1A1D24] shadow-sm rounded-full flex items-center justify-center mb-4 text-primary-500">
            {isVideo ? <Video className="w-8 h-8" /> : <ImageIcon className="w-8 h-8" />}
          </div>
          
          <p className="text-gray-900 dark:text-white font-semibold text-lg mb-1">
            Drag & drop your {isVideo ? "video" : "image"} here
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
            Files supported: {isVideo ? "MP4" : "JPEG, PNG"}. Max size: {maxSize}.
          </p>
          
          <label className="cursor-pointer bg-white dark:bg-[#1A1D24] border border-gray-200 dark:border-gray-700 px-6 py-2.5 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm">
            Browse Files
            <input 
              type="file" 
              className="hidden" 
              accept={isVideo ? "video/mp4" : "image/jpeg,image/png"}
              onChange={(e) => e.target.files && handleFile(e.target.files[0])}
            />
          </label>
        </div>
      ) : (
        <div className="relative border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1C1F26] rounded-2xl p-4 overflow-hidden">
          <button 
            onClick={handleRemove}
            type="button"
            className="absolute top-6 right-6 z-10 w-8 h-8 bg-black/50 hover:bg-red-500 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="w-full h-[300px] flex items-center justify-center bg-black/5 dark:bg-black/20 rounded-xl overflow-hidden">
            {isVideo ? (
              <video 
                src={previewUrl} 
                controls 
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <img 
                src={previewUrl} 
                alt="Ad Preview" 
                className="max-w-full max-h-full object-contain"
              />
            )}
          </div>
          <div className="mt-4 flex items-center gap-3 px-2">
            <UploadCloud className="w-5 h-5 text-gray-400" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {fileValue?.name || "Media File"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {(fileValue?.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <div className="text-sm font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-3 py-1 rounded-full">
              Ready
            </div>
          </div>
        </div>
      )}

      {errors.mediaFile && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 mt-4 text-sm font-medium border border-red-100 dark:border-red-900/30">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {errors.mediaFile.message as string}
        </div>
      )}

    </div>
  )
}
