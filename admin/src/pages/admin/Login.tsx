import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  BarChart2,
  Megaphone,
  MapPin,
  Building2,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  ArrowRight,
  ChevronLeft,
  Timer,
  RefreshCw,
  AlertTriangle,
  XCircle,
  Clock,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  emailPasswordLoginSchema, 
  otpLoginStep1Schema, 
  otpLoginStep2Schema,
  type EmailPasswordLoginFormData,
  type OtpLoginStep1FormData,
  type OtpLoginStep2FormData 
} from "../../schemas/loginSchema";
import { OtpInput } from "../../components/form/OtpInput";
import { Modal } from "../../components/ui/Modal";

type TabType = "email" | "otp";
type OtpStep = "request" | "verify";
type AccountStatus = "Approved" | "Pending" | "Rejected" | "Locked" | null;

export default function AdminLogin() {
  const [activeTab, setActiveTab] = useState<TabType>("email");
  const [otpStep, setOtpStep] = useState<OtpStep>("request");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [accountStatus, setAccountStatus] = useState<AccountStatus>(null);
  const [lockedEmail, setLockedEmail] = useState("");
  
  const navigate = useNavigate();

  // Forms
  const emailForm = useForm<EmailPasswordLoginFormData>({
    resolver: zodResolver(emailPasswordLoginSchema)
  });

  const otpRequestForm = useForm<OtpLoginStep1FormData>({
    resolver: zodResolver(otpLoginStep1Schema)
  });

  const otpVerifyForm = useForm<OtpLoginStep2FormData>({
    resolver: zodResolver(otpLoginStep2Schema)
  });

  // Timer logic for OTP resend
  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleLoginSuccess = (status: AccountStatus) => {
    if (status === "Approved") {
      navigate("/admin/dashboard");
    } else {
      setAccountStatus(status);
    }
  };

  const onEmailSubmit = (data: EmailPasswordLoginFormData) => {
    setIsSubmitting(true);
    // Mock logic for status checks
    setTimeout(() => {
      setIsSubmitting(false);
      // Demo logic: login as 'pending@keliri.com' to see pending status
      if (data.identifier === "pending@keliri.com") {
        setAccountStatus("Pending");
      } else if (data.identifier === "rejected@keliri.com") {
        setAccountStatus("Rejected");
      } else if (data.identifier === "locked@keliri.com") {
        setAccountStatus("Locked");
        setLockedEmail("locked@keliri.com");
      } else {
        handleLoginSuccess("Approved");
      }
    }, 1500);
  };

  const onOtpRequestSubmit = (data: OtpLoginStep1FormData) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setOtpStep("verify");
      setResendTimer(60);
      otpVerifyForm.setValue("mobileNumber", data.mobileNumber);
      toast.success("OTP sent to your mobile number");
    }, 1200);
  };

  const onOtpVerifySubmit = (data: OtpLoginStep2FormData) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      handleLoginSuccess("Approved");
    }, 1500);
  };

  const handleResendOtp = () => {
    if (resendTimer > 0) return;
    setResendTimer(60);
    toast.success("New OTP sent!");
  };

  const resetOtpFlow = () => {
    setOtpStep("request");
    setResendTimer(0);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 md:bg-white dark:bg-[#0E1117]">
      <Toaster position="top-right" />
      
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 overflow-hidden text-white p-12 flex-col justify-between">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary-400 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-primary-800 rounded-full blur-[120px] opacity-60"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="" className="h-10 w-auto object-contain" />
          </div>

          <div className="mt-24 max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight mb-6 tracking-tight">
              Manage Your Advertising<br />Network From One<br />Unified Dashboard
            </h2>
            <p className="text-primary-100 text-lg md:text-xl font-medium leading-relaxed mb-12">
              Take complete control of your business advertising ecosystem — create campaigns, manage branch-level publishers, monitor performance, and track spending — all from a single, powerful admin platform.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <BarChart2 className="w-5 h-5" />, title: "Real-Time Insights", desc: "Track performance across all locations with live data." },
                { icon: <Megaphone className="w-5 h-5" />, title: "Smart Ad Management", desc: "Create, edit, publish, and monitor advertisements." },
                { icon: <MapPin className="w-5 h-5" />, title: "Geo-Targeting", desc: "City-level and radius-based ad delivery." },
                { icon: <Building2 className="w-5 h-5" />, title: "Publisher Management", desc: "Easily manage and track all your business branches." },
              ].map((feature, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:bg-white/15 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white/10 rounded-lg shadow-sm">
                      {feature.icon}
                    </div>
                    <span className="font-semibold text-sm">{feature.title}</span>
                  </div>
                  <p className="text-xs text-primary-200 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-primary-200 font-medium tracking-wide">
          © 2026 Keliri
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative bg-gray-50 dark:bg-[#0E1117] transition-colors">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <img src="/logo.png" alt="" className="h-10 w-auto object-contain" />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back</h2>
            <p className="text-gray-500 dark:text-gray-400">Sign in to your Admin account</p>
          </div>

          <div className="bg-gray-200/60 dark:bg-[#1C1F26] p-1.5 rounded-xl flex mb-8">
            <button
              type="button"
              disabled={otpStep === "verify"}
              onClick={() => setActiveTab("email")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === "email"
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border border-gray-200/50 dark:border-gray-700"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              } ${otpStep === "verify" ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Mail className="w-4 h-4" />
              Email & Password
            </button>
            <button
              type="button"
              disabled={otpStep === "verify"}
              onClick={() => setActiveTab("otp")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === "otp"
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border border-gray-200/50 dark:border-gray-700"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              } ${otpStep === "verify" ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <Phone className="w-4 h-4" />
              Phone & OTP
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === "email" ? (
              <motion.form
                key="email-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={emailForm.handleSubmit(onEmailSubmit)}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Email or Mobile
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-[18px] h-[18px]" />
                    </div>
                    <input
                      {...emailForm.register("identifier")}
                      type="text"
                      placeholder="admin@keliri.com"
                      className="block w-full pl-10 px-4 py-3 bg-white dark:bg-[#1C1F26] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors shadow-sm text-sm"
                    />
                  </div>
                  {emailForm.formState.errors.identifier && (
                    <p className="text-xs text-red-500 mt-1">{emailForm.formState.errors.identifier.message}</p>
                  )}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <a href="#" className="text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-500">
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-[18px] h-[18px]" />
                    </div>
                    <input
                      {...emailForm.register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="block w-full pl-10 pr-10 px-4 py-3 bg-white dark:bg-[#1C1F26] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors shadow-sm text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                    </button>
                  </div>
                  {emailForm.formState.errors.password && (
                    <p className="text-xs text-red-500 mt-1">{emailForm.formState.errors.password.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>Sign In <ArrowRight className="w-[18px] h-[18px] group-hover:translate-x-0.5 transition-transform" /></>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="otp-container"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                {otpStep === "request" ? (
                  <form onSubmit={otpRequestForm.handleSubmit(onOtpRequestSubmit)} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                        Mobile Number
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                          <Phone className="w-[18px] h-[18px]" />
                        </div>
                        <input
                          {...otpRequestForm.register("mobileNumber")}
                          type="tel"
                          placeholder="9876543210"
                          className="block w-full pl-10 px-4 py-3 bg-white dark:bg-[#1C1F26] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors shadow-sm text-sm"
                        />
                      </div>
                      {otpRequestForm.formState.errors.mobileNumber && (
                        <p className="text-xs text-red-500 mt-1">{otpRequestForm.formState.errors.mobileNumber.message}</p>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
                    >
                      {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send OTP"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={otpVerifyForm.handleSubmit(onOtpVerifySubmit)} className="space-y-8">
                    <button
                      type="button"
                      onClick={resetOtpFlow}
                      className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-primary-600 transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" /> Change Number
                    </button>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-6">
                        Enter the 6-digit code sent to <br/>
                        <span className="font-bold text-gray-900 dark:text-white">+91 {otpRequestForm.getValues("mobileNumber")}</span>
                      </p>
                      
                      <OtpInput 
                        name="otp"
                        register={otpVerifyForm.register}
                        errors={otpVerifyForm.formState.errors}
                        length={6}
                        onOtpComplete={(otp) => otpVerifyForm.setValue("otp", otp)}
                      />
                    </div>

                    <div className="flex flex-col gap-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/20 transition-all"
                      >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Sign In"}
                      </button>

                      <div className="flex items-center justify-center gap-3">
                         {resendTimer > 0 ? (
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                               <Timer className="w-3.5 h-3.5" />
                               Resend in {resendTimer}s
                            </div>
                         ) : (
                            <button
                              type="button"
                              onClick={handleResendOtp}
                              className="flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
                            >
                              <RefreshCw className="w-3.5 h-3.5" /> Resend OTP Now
                            </button>
                         )}
                      </div>
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <footer className="mt-12 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Don't have an account?{' '}
              <a href="/admin/register" className="text-primary-600 dark:text-primary-400 font-bold hover:underline">
                Register business
              </a>
            </p>
            <div className="mt-8 flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
              <Lock className="w-3 h-3" /> Protected by Keliri Security
            </div>
          </footer>
        </div>
      </div>

      {/* Account Status Modals */}
      <Modal 
        isOpen={!!accountStatus} 
        onClose={() => setAccountStatus(null)}
        title={
          accountStatus === "Pending" ? "Review in Progress" :
          accountStatus === "Rejected" ? "Application Rejected" :
          "Account Locked"
        }
      >
        <div className="flex flex-col items-center text-center gap-6 pb-2">
          {accountStatus === "Pending" ? (
            <>
              <div className="p-4 bg-amber-50 dark:bg-amber-500/10 rounded-full text-amber-500">
                <Clock className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  Your application is currently being reviewed by our team. This usually takes 1-2 business days.
                </p>
                <p className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/5 px-4 py-2 rounded-lg border border-amber-100 dark:border-amber-500/10 inline-block">
                  Current Status: AWAITING_APPROVAL
                </p>
              </div>
            </>
          ) : accountStatus === "Rejected" ? (
            <>
              <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-full text-red-500">
                <XCircle className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  Unfortunately, your registration was not approved. Please check your email for detailed reasons and re-apply with the required documents.
                </p>
                <button 
                  onClick={() => navigate("/admin/register")}
                  className="text-xs font-bold text-red-600 dark:text-red-400 hover:underline"
                >
                  Return to Registration Form
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-full text-red-500">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <div className="space-y-4 w-full">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  For your security, this account has been locked due to 5 consecutive failed login attempts.
                </p>
                <div className="p-4 bg-gray-50 dark:bg-[#0E1117] rounded-xl border border-gray-100 dark:border-gray-800 text-left">
                  <p className="text-[10px] font-black uppercase text-gray-400 mb-3 tracking-widest">Resolution Steps</p>
                  <ul className="text-xs space-y-2.5 text-gray-500 dark:text-gray-400">
                    <li className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1 shrink-0" />
                      An unlock link has been sent to <span className="font-bold text-gray-900 dark:text-white">{lockedEmail}</span>
                    </li>
                    <li className="flex gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1 shrink-0" />
                      Check your inbox (and spam) to reset your credentials.
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}
          
          <button
            onClick={() => setAccountStatus(null)}
            className="w-full mt-4 py-3 bg-gray-900 dark:bg-white dark:text-gray-900 text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            Dismiss
          </button>
        </div>
      </Modal>
    </div>
  );
}
