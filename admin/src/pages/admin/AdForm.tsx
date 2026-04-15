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
import { AdDetailsStep } from "../../components/ads/AdDetailsStep"
import { MediaUploadStep } from "../../components/ads/MediaUploadStep"
import { TargetingStep } from "../../components/ads/TargetingStep"

const STEPS = ["Ad Options", "Media Upload", "Geo-Targeting"]

export default function AdForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = !!id

  const [currentStep, setCurrentStep] = React.useState(0)
  const [loading, setLoading] = React.useState(isEditMode)

  const methods = useForm<AdFormData>({
    resolver: zodResolver(adSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      type: "Banner",
      mediaFile: null,
      locationMode: "manual",
      latitude: 0,
      longitude: 0,
      radius: 10,
      mediaUrl: ""
    }
  })

  const { handleSubmit, trigger, formState: { isSubmitting }, reset } = methods as any

  // Load draft ad if editing
  React.useEffect(() => {
    async function load() {
      if (!id) return
      try {
        const ad = await getAdById(id)
        // Since it's a mock, we just patch the generic data over
        reset({
          title: ad.title,
          description: "This is a drafted description mock.",
          type: "Banner",
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

  const handleNext = async () => {
    // Determine which fields belong to current step
    let fieldsToValidate: any[] = []
    if (currentStep === 0) fieldsToValidate = ["title", "description", "type"]
    if (currentStep === 1) fieldsToValidate = ["mediaFile"]
    if (currentStep === 2) fieldsToValidate = ["latitude", "longitude", "radius"]

    const isValid = await trigger(fieldsToValidate)
    
    if (isValid) {
      setCurrentStep(curr => Math.min(curr + 1, STEPS.length - 1))
    } else {
      toast.error("Please fix the validation errors before proceeding", { id: "val-err" })
    }
  }

  const handleBack = () => {
    setCurrentStep(curr => Math.max(curr - 1, 0))
  }

  const onSubmit = async (data: AdFormData, shouldPublish: boolean = false) => {
    try {
      if (isEditMode) {
        await updateAd(id, data)
        toast.success(`Draft successfully updated`)
      } else {
         await createAd(data)
         toast.success(`Ad draft created successfully!`)
      }
      
      if (shouldPublish) {
        toast.success("Ad forwarded for Publication!", { icon: "🚀" })
      }
      
      setTimeout(() => navigate('/admin/ads'), 800)
    } catch (err) {
      toast.error("Failed to save advertisement")
    }
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return <AdDetailsStep />
      case 1: return <MediaUploadStep />
      case 2: return <TargetingStep />
      default: return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0E1117] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    )
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="space-y-6">
        
        {/* Action Bar */}
        <div className="max-w-3xl">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/admin/ads")}
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back to Ads
            </button>
          
          <button 
            type="button"
            onClick={handleSubmit((d: any) => onSubmit(d, false))}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 rounded-lg transition-colors font-semibold border border-gray-200 dark:border-gray-800 disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> Save Draft
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Progress Stepper */}
        <AdStepper currentStep={currentStep} steps={STEPS} />

        {/* Form Area */}
        <div className="bg-white dark:bg-[#1A1D24] shadow-sm border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden min-h-[400px] flex flex-col transition-colors">
          <FormProvider {...methods}>
            <form className="flex-1 flex flex-col">
              <div className="flex-1 p-6 md:p-8 overflow-hidden">
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
                    className="flex items-center gap-2 px-8 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-semibold shadow-sm shadow-primary-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
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

      </div>
    </div>
  </>
)
}
