import * as React from "react"
import { useFormContext } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import { Type, AlertCircle } from "lucide-react"

import { BannerUploader } from "./BannerUploader"
import { VideoUploader } from "./VideoUploader"
import { ThumbnailUpload } from "./ThumbnailUpload"

// ─────────────────────────────────────────────
// Types for local media state (stored outside RHF)
// ─────────────────────────────────────────────
export interface MediaState {
  bannerFiles: File[]
  videoFile: File | null
  videoUrl: string
  thumbnail: File | null
}

interface MediaUploadStepProps {
  mediaState: MediaState
  setMediaState: React.Dispatch<React.SetStateAction<MediaState>>
  validationErrors: { [key: string]: string }
}

export function MediaUploadStep({ mediaState, setMediaState, validationErrors }: MediaUploadStepProps) {
  const { watch } = useFormContext()
  const adType: string = watch("type") // "Banner" | "Video" | "Thumbnail"

  const isVideoAd   = adType === "Video"
  const isBannerAd  = adType === "Banner"
  const isTextAd    = adType === "Thumbnail" // Thumbnail = Text-only in this schema

  const adTypeLabel = isVideoAd ? "Video" : isBannerAd ? "Banner" : "Thumbnail (Text)"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upload Ad Media</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          You selected a{" "}
          <span className="font-bold text-brand-500">{adTypeLabel}</span> ad.{" "}
          {isVideoAd && "Upload a video file or paste a URL, then add a thumbnail."}
          {isBannerAd && "Upload 1–4 banner images and a thumbnail."}
          {isTextAd && "No media upload needed for thumbnail/text ads."}
        </p>
      </div>

      {/* ── Text / Thumbnail Ad — no upload needed ── */}
      {isTextAd && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center gap-4 py-16 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
            <Type className="w-8 h-8" />
          </div>
          <div>
            <p className="font-bold text-gray-700 dark:text-gray-200 text-lg">No Media Required</p>
            <p className="text-sm text-gray-400 mt-1">Thumbnail / Text ads are display-only. Click <strong>Continue</strong> to set geo-targeting.</p>
          </div>
        </motion.div>
      )}

      {/* ── Video Ad ── */}
      <AnimatePresence mode="wait">
        {isVideoAd && (
          <motion.div
            key="video"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <VideoUploader
              videoFile={mediaState.videoFile}
              videoUrl={mediaState.videoUrl}
              onFileChange={(file) => setMediaState(s => ({ ...s, videoFile: file }))}
              onUrlChange={(url) => setMediaState(s => ({ ...s, videoUrl: url }))}
              error={validationErrors.video}
            />
            <ThumbnailUpload
              thumbnail={mediaState.thumbnail}
              onThumbnailChange={(file) => setMediaState(s => ({ ...s, thumbnail: file }))}
              error={validationErrors.thumbnail}
            />
          </motion.div>
        )}

        {/* ── Banner Ad ── */}
        {isBannerAd && (
          <motion.div
            key="banner"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-4"
          >
            <BannerUploader
              files={mediaState.bannerFiles}
              onFilesChange={(files) => setMediaState(s => ({ ...s, bannerFiles: files }))}
              error={validationErrors.banner}
            />
            <ThumbnailUpload
              thumbnail={mediaState.thumbnail}
              onThumbnailChange={(file) => setMediaState(s => ({ ...s, thumbnail: file }))}
              error={validationErrors.thumbnail}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global error (fallback) */}
      {validationErrors.general && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium border border-red-100 dark:border-red-900/30">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {validationErrors.general}
        </div>
      )}
    </div>
  )
}
