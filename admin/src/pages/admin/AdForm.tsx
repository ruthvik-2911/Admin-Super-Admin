import * as React from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useForm, FormProvider } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, Save, Send, Loader2 } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"

import { adSchema, type AdFormData } from "../../schemas/adSchema"
import { getAdById, createAd, updateAd } from "../../services/ads"

import { AdStepper } from "../../components/ads/AdStepper"
import { AdDetailsStep } from "../../components/ads/AdDetailsStep" // Ad Options
import { MediaUploadStep, type MediaState } from "../../components/ads/MediaUploadStep"
import { AdFinalDetailsStep } from "../../components/ads/AdFinalDetailsStep"
import { TargetingStep } from "../../components/ads/TargetingStep"

const STEPS = ["Ad Options", "Media Upload", "Ad Details", "Geo-Targeting"]

export default function AdForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = !!id

  const [currentStep, setCurrentStep] = React.useState(0)
  const [loading, setLoading] = React.useState(isEditMode)

  // ── Media state lives outside RHF since Files can't serialize ──
  const [mediaState, setMediaState] = React.useState<MediaState>({
    bannerFiles: [],
    videoFile: null,
    videoUrl: "",
    thumbnail: null,
  })

  // Inline validation errors for Step 2
  const [mediaErrors, setMediaErrors] = React.useState<{ [key: string]: string }>({})

  const methods = useForm<AdFormData>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "Banner" as const,
      mediaFile: null,
      ctaType: "Redirect",
      ctaLabel: "Learn More",
      ctaActionValue: "",
      customSections: [{ title: "", description: "" }],
      locationMode: "manual" as const,
      latitude: 0,
      longitude: 0,
      radius: 10,
    } as unknown as AdFormData
  })

  const { handleSubmit, trigger, watch, formState: { isSubmitting }, reset } = methods
  const adType = watch("type")

  React.useEffect(() => {
    // Clear media state when ad type switches
    if (currentStep < 1) { // Only clear if we haven't reached/passed media step potentially
        setMediaState({ bannerFiles: [], videoFile: null, videoUrl: "", thumbnail: null })
        setMediaErrors({})
    }
  }, [adType])

  React.useEffect(() => {
    async function load() {
      if (!id) return
      try {
        const ad = await getAdById(id)
        reset({
          title: ad.title,
          description: "This is a drafted description.",
          type: "Banner",
          ctaType: "Redirect",
          ctaLabel: "Learn More",
          ctaActionValue: "",
          customSections: [{ title: "Welcome", description: "Hello world" }],
          locationMode: "manual",
          radius: 25,
          latitude: 19.0760,
          longitude: 72.8777,
        } as unknown as AdFormData)
      } catch (err) {
        toast.error("Failed to load draft.")
        navigate("/admin/ads")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, reset, navigate])

  // ── Step 2 Media Validation ──────────────────────────────
  const validateMediaStep = (): boolean => {
    const errors: { [key: string]: string } = {}

    if (adType === "Video") {
      if (!mediaState.videoFile && !mediaState.videoUrl.trim()) {
        errors.video = "Please upload a video file or enter a video URL."
      }
      if (!mediaState.thumbnail) {
        errors.thumbnail = "Thumbnail is required for Video ads."
      }
    } else if (adType === "Banner") {
      if (mediaState.bannerFiles.length === 0) {
        errors.banner = "At least 1 banner image is required."
      } else if (mediaState.bannerFiles.length > 4) {
        errors.banner = "Maximum 4 banner images allowed."
      }
      if (!mediaState.thumbnail) {
        errors.thumbnail = "Thumbnail is required for Banner ads."
      }
    }

    setMediaErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleNext = async () => {
    let fieldsToValidate: any[] = []

    if (currentStep === 0) {
      fieldsToValidate = ["title", "description", "type"]
    } else if (currentStep === 1) {
      const isValid = validateMediaStep()
      if (!isValid) {
        toast.error("Please complete all required media fields.", { id: "media-err" })
        return
      }
      setCurrentStep(curr => Math.min(curr + 1, STEPS.length - 1))
      return
    } else if (currentStep === 2) {
      fieldsToValidate = ["ctaType", "ctaLabel", "ctaActionValue", "customSections"]
    } else if (currentStep === 3) {
      fieldsToValidate = ["latitude", "longitude", "radius"]
    }

    const isValid = await trigger(fieldsToValidate)
    if (isValid) {
      setCurrentStep(curr => Math.min(curr + 1, STEPS.length - 1))
    } else {
      toast.error("Please fix the validation errors before proceeding", { id: "val-err" })
    }
  }

  const handleBack = () => setCurrentStep(curr => Math.max(curr - 1, 0))

  const onSubmit = async (data: AdFormData, shouldPublish: boolean = false) => {
    try {
      // Structure payload for backend as requested
      const payload = {
        title: data.title,
        description: data.description,
        type: data.type,
        location: {
            latitude: data.latitude,
            longitude: data.longitude,
            radius: data.radius,
            mode: data.locationMode
        },
        cta: {
          ctaType: "Button",
          buttons: [
            {
              ctaId: data.ctaType.toUpperCase(),
              content: {
                label: data.ctaLabel,
                action: data.ctaActionValue
              }
            }
          ]
        },
        customTextSection: data.customSections,
        media: {
            url: data.mediaUrl,
            // mediaState contains the actual files for multipart upload if needed
        }
      }

      // In a real app we'd use FormData if uploading files
      if (isEditMode) {
        await updateAd(id, payload)
        toast.success("Draft successfully updated")
      } else {
        await createAd(payload)
        toast.success("Ad draft created successfully!")
      }
      
      if (shouldPublish) toast.success("Ad forwarded for Publication!", { icon: "🚀" })
      setTimeout(() => navigate("/admin/ads"), 800)
    } catch (err) {
      toast.error("Failed to save advertisement")
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return <AdDetailsStep />
      case 1: return (
        <MediaUploadStep
          mediaState={mediaState}
          setMediaState={setMediaState}
          validationErrors={mediaErrors}
        />
      )
      case 2: return <AdFinalDetailsStep />
      case 3: return <TargetingStep />
      default: return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0E1117] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0E1117] pb-16 transition-colors duration-200">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#1C1F26]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/ads")}
                className="p-2 -ml-2 text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors focus:outline-none"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {isEditMode ? "Manage Advertisement Draft" : "Launch New Advertisement"}
              </h1>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleSubmit((d) => onSubmit(d, false))}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors font-semibold shadow-sm border border-gray-200 dark:border-gray-700 disabled:opacity-50"
              >
                <Save className="w-4 h-4" /> Save Draft
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Progress Stepper */}
        <AdStepper currentStep={currentStep} steps={STEPS} />

        {/* Form Area */}
        <div className="bg-white dark:bg-[#1A1D24] shadow-sm border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden min-h-[480px] flex flex-col transition-colors">
          <FormProvider {...methods}>
            <form className="flex-1 flex flex-col">
              <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    {renderCurrentStep()}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Footer */}
              <div className="px-6 py-4 bg-gray-50 dark:bg-[#1C1F26] border-t border-gray-200 dark:border-gray-800 flex items-center justify-between mt-auto transition-colors">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 0 || isSubmitting}
                  className="px-6 py-2 text-gray-600 dark:text-gray-300 font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                >
                  Back
                </button>

                {currentStep === STEPS.length - 1 ? (
                  <button
                    type="button"
                    onClick={handleSubmit((d) => onSubmit(d, true))}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-8 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg text-sm font-semibold shadow-sm shadow-brand-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Submit for Publishing
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-8 py-2.5 bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white rounded-lg text-sm font-semibold shadow-sm transition-all"
                  >
                    Continue
                  </button>
                )}
              </div>
            </form>
          </FormProvider>
        </div>

      </main>
    </div>
  )
}
