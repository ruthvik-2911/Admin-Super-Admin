import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Phone,
  ArrowRight,
  BarChart3,
  Megaphone,
  MapPin,
  Building2,
  Clock,
  XCircle,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import {
  emailPasswordLoginSchema,
  otpLoginStep1Schema,
  otpLoginStep2Schema,
  type EmailPasswordLoginFormData,
  type OtpLoginStep1FormData,
  type OtpLoginStep2FormData,
} from "../../schemas/loginSchema";
import { Modal } from "../../components/ui/Modal";
import logo from "../../assets/lightmodelogo.png";
import icon from "../../assets/keliriicon.png";

type Tab = "email" | "phone";
type OtpStep = "phone" | "otp";
type AccountStatus = "Approved" | "Pending" | "Rejected" | "Locked" | null;

const features = [
  { icon: BarChart3, label: 'Real-Time Insights', desc: 'Track performance across all locations with live data.' },
  { icon: Megaphone, label: 'Smart Ad Management', desc: 'Create, edit, publish, and monitor advertisements.' },
  { icon: MapPin, label: 'Geo-Targeting', desc: 'City-level and radius-based ad delivery.' },
  { icon: Building2, label: 'Publisher Management', desc: 'Easily manage and track all your business branches.' },
];

export default function AdminLogin() {
  const navigate = useNavigate();

  // Tab state
  const [activeTab, setActiveTab] = useState<Tab>("email");

  // Email form
  const [showPassword, setShowPassword] = useState(false);

  // Phone/OTP form
  const [otpStep, setOtpStep] = useState<OtpStep>("phone");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Loading & Status
  const [accountStatus, setAccountStatus] = useState<AccountStatus>(null);
  const [lockedEmail, setLockedEmail] = useState("");

  const emailForm = useForm<EmailPasswordLoginFormData>({
    resolver: zodResolver(emailPasswordLoginSchema),
  });

  const otpRequestForm = useForm<OtpLoginStep1FormData>({
    resolver: zodResolver(otpLoginStep1Schema),
  });

  const otpVerifyForm = useForm<OtpLoginStep2FormData>({
    resolver: zodResolver(otpLoginStep2Schema),
  });

  const isSubmitting =
    emailForm.formState.isSubmitting ||
    otpRequestForm.formState.isSubmitting ||
    otpVerifyForm.formState.isSubmitting;

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleLoginSuccess = (status: AccountStatus) => {
    if (status === "Approved") {
      navigate("/admin/dashboard");
    } else {
      setAccountStatus(status);
    }
  };

  const onEmailSubmit = async (data: EmailPasswordLoginFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1400));
    // Demo mocking logic for status check
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
  };

  const onOtpRequestSubmit = async (data: OtpLoginStep1FormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setOtpStep("otp");
    setCountdown(60);
    otpVerifyForm.setValue("mobileNumber", data.mobileNumber);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const onOtpVerifySubmit = async (data: OtpLoginStep2FormData) => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) {
      otpVerifyForm.setError("otp", { message: "Please enter all 6 digits" });
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 1400));
    handleLoginSuccess("Approved");
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOtp = () => {
    setCountdown(60);
    setOtp(["", "", "", "", "", ""]);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  return (
    <div className="min-h-screen flex animate-fade-in transition-colors bg-gray-50 dark:bg-[#0E1117]">
      {/* ─── Left Panel: Branding ─── */}
      <div className="hidden lg:flex flex-col w-[52%] bg-gradient-to-br from-primary-500 via-primary-600 to-orange-700 relative overflow-hidden p-12">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full translate-y-1/3 -translate-x-1/3" />
        <div className="absolute top-1/2 right-8 w-32 h-32 bg-white/5 rounded-3xl rotate-12" />

        <div className="relative z-10 flex items-center gap-3 mb-16">
          <div className="w-10 h-10 bg-white/50 backdrop-blur rounded-xl flex items-center justify-center p-1.5 overflow-hidden shadow-sm">
            <img src={icon} alt="KELIRI Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <img src={logo} alt="KELIRI Logo" className="w-24 h-10 object-contain drop-shadow-md" />
            <p className="text-orange-200 text-[11px] font-medium tracking-widest uppercase mt-0.5 drop-shadow-sm">Admin Platform</p>
          </div>
        </div>

        {/* Headline */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <h1 className="text-white font-bold text-4xl leading-tight mb-4 drop-shadow-sm">
            Manage Your<br />
            <span className="text-orange-200 drop-shadow-none">Advertising Network</span><br />
            From One Place
          </h1>
          <p className="text-orange-100 text-base leading-relaxed mb-12 max-w-md">
            Take complete control of your business advertising ecosystem — create campaigns, manage branch-level publishers, and track performance.
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.label} className="flex items-start gap-3 bg-white/10 backdrop-blur-sm shadow-sm border border-white/5 rounded-2xl p-4 hover:bg-white/15 transition-colors">
                  <div className="w-8 h-8 bg-white/20 rounded-lg shadow-inner flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon size={15} className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm leading-none drop-shadow-sm">{f.label}</p>
                    <p className="text-orange-200 text-xs mt-1 leading-relaxed drop-shadow-sm">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer text */}
        <p className="relative z-10 text-orange-200/70 text-xs mt-10">
          © {new Date().getFullYear()} KELIRI · Vinidra Softech · Confidential
        </p>
      </div>

      {/* ─── Right Panel: Form ─── */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0">
              <img src={icon} alt="KELIRI Logo" className="w-8 h-8 object-contain" />
            </div>
            <p className="font-bold text-gray-900 dark:text-white">KELIRI</p>
          </div>

          <div className="mb-8 animate-fade-in-scale">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Sign in to your Admin account</p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-gray-100/80 dark:bg-[#1A1D24] p-1.5 rounded-xl mb-6 shadow-inner animate-fade-in transition-colors">
            {(["email", "phone"] as Tab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  setActiveTab(tab);
                  setOtpStep("phone");
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300
                  ${
                    activeTab === tab
                      ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm border border-gray-200/50 dark:border-gray-700/50"
                      : "text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
              >
                {tab === "email" ? <Mail size={15} /> : <Phone size={15} />}
                {tab === "email" ? "Email & Password" : "Phone & OTP"}
              </button>
            ))}
          </div>

          {/* ── Email Form ── */}
          {activeTab === "email" && (
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4 animate-fade-in">
              <div>
                <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Email Address / Mobile</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...emailForm.register("identifier")}
                    type="text"
                    placeholder="admin@keliri.com"
                    className={`input-field pl-10 ${
                      emailForm.formState.errors.identifier ? "border-red-400 ring-2 ring-red-100 dark:ring-red-500/20" : ""
                    }`}
                  />
                </div>
                {emailForm.formState.errors.identifier && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">{emailForm.formState.errors.identifier.message}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">Password</label>
                  <button type="button" className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 font-semibold transition-colors">
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    {...emailForm.register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`input-field pl-10 pr-10 ${
                      emailForm.formState.errors.password ? "border-red-400 ring-2 ring-red-100 dark:ring-red-500/20" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {emailForm.formState.errors.password && (
                  <p className="text-xs text-red-500 mt-1.5 font-medium">{emailForm.formState.errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full flex items-center justify-center gap-2 mt-6 uppercase tracking-widest text-[11px]"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin opacity-75" />
                    Signing in...
                  </span>
                ) : (
                  <>
                    Sign In <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          )}

          {/* ── Phone / OTP Form ── */}
          {activeTab === "phone" && (
            <div className="animate-fade-in">
              {otpStep === "phone" ? (
                <form onSubmit={otpRequestForm.handleSubmit(onOtpRequestSubmit)} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Mobile Number</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">+91</span>
                      <span className="absolute left-[46px] top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-700">|</span>
                      <input
                        {...otpRequestForm.register("mobileNumber")}
                        type="tel"
                        placeholder="98765 43210"
                        maxLength={10}
                        className={`input-field pl-14 tracking-wider ${
                          otpRequestForm.formState.errors.mobileNumber ? "border-red-400 ring-2 ring-red-100 dark:ring-red-500/20" : ""
                        }`}
                      />
                    </div>
                    {otpRequestForm.formState.errors.mobileNumber && (
                      <p className="text-xs text-red-500 mt-1.5 font-medium">{otpRequestForm.formState.errors.mobileNumber.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full flex items-center justify-center gap-2 mt-6 uppercase tracking-widest text-[11px]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin opacity-75" />
                        Sending OTP...
                      </span>
                    ) : (
                      <>
                        Send OTP <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={otpVerifyForm.handleSubmit(onOtpVerifySubmit)} className="space-y-5 animate-fade-in">
                  <div className="bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20 rounded-xl px-4 py-3 flex items-center gap-2">
                    <Phone size={14} className="text-primary-500 flex-shrink-0" />
                    <p className="text-sm text-primary-700 dark:text-primary-400">
                      OTP sent to <strong className="font-bold">+91 {otpRequestForm.getValues("mobileNumber")}</strong>
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setOtpStep("phone");
                        setOtp(["", "", "", "", "", ""]);
                      }}
                      className="ml-auto text-xs text-primary-600 dark:text-primary-300 hover:text-primary-700 font-bold hover:underline"
                    >
                      Change
                    </button>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-3 block text-center">Enter 6-digit OTP</label>
                    <div className="flex gap-2 justify-between max-w-sm mx-auto">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => {
                            otpRefs.current[i] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          className={`w-11 h-12 text-center text-xl font-black border rounded-xl 
                                     focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
                                     transition-all duration-200 shadow-sm
                                     ${
                                       digit
                                         ? "border-primary-400 bg-primary-50 dark:bg-primary-500/20 text-primary-700 dark:text-primary-400 dark:border-primary-500"
                                         : "border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1A1D24] text-gray-800 dark:text-gray-100"
                                     }
                                     ${otpVerifyForm.formState.errors.otp ? "border-red-400 dark:border-red-500 ring-2 ring-red-100 dark:ring-red-500/20" : ""}`}
                        />
                      ))}
                    </div>
                    {otpVerifyForm.formState.errors.otp && (
                      <p className="text-xs text-red-500 mt-2 font-medium text-center">{otpVerifyForm.formState.errors.otp.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-4 mt-8">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full flex items-center justify-center gap-2 uppercase tracking-widest text-[11px]"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin opacity-75" />
                          Verifying...
                        </span>
                      ) : (
                        <>
                          Verify & Sign In <ArrowRight size={14} />
                        </>
                      )}
                    </button>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {countdown > 0 ? (
                        <span className="flex items-center flex-wrap gap-1">Resend code in <strong className="text-primary-600 dark:text-primary-400 font-bold">{countdown}s</strong></span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          className="font-bold text-primary-600 dark:text-primary-400 hover:text-primary-700 hover:underline transition-colors"
                        >
                          Resend OTP Code
                        </button>
                      )}
                    </p>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Footer */}
          <footer className="mt-12 text-center animate-fade-in-scale delay-75">
             <p className="text-sm text-gray-500 dark:text-gray-400">
               Don't have an account?{' '}
               <a href="/admin/register" className="text-primary-600 dark:text-primary-400 font-bold hover:underline transition-colors">
                 Register business
               </a>
             </p>
             <div className="mt-8 flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-600 border border-gray-100 dark:border-gray-800 py-1.5 px-3 rounded-full inline-flex mx-auto bg-white/50 dark:bg-black/20 shadow-sm">
               <Lock className="w-2.5 h-2.5" /> Protected by KELIRI Security
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
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                  Your application is currently being reviewed by our team. This usually takes 1-2 business days.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-100 dark:border-amber-500/20 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Status: AWAITING_APPROVAL
                </div>
              </div>
            </>
          ) : accountStatus === "Rejected" ? (
            <>
              <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-full text-red-500">
                <XCircle className="w-10 h-10" />
              </div>
              <div className="space-y-4 w-full">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                  Unfortunately, your registration was not approved. Please check your email for detailed reasons and re-apply with the required documents.
                </p>
                <button 
                  onClick={() => navigate("/admin/register")}
                  className="w-full py-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 font-bold rounded-xl text-sm border border-red-100 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors"
                >
                  Return to Registration Form
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-full text-red-500">
                <AlertTriangle className="w-10 h-10 animate-bounce-subtle" />
              </div>
              <div className="space-y-6 w-full">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                  For your security, this account has been locked due to 5 consecutive failed login attempts.
                </p>
                <div className="p-5 bg-gray-50 dark:bg-[#1A1D24] rounded-[1.5rem] border border-gray-100 dark:border-white/5 text-left shadow-inner">
                  <p className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 mb-4 tracking-[0.2em]">Resolution Steps</p>
                  <ul className="text-xs space-y-3 font-medium text-gray-600 dark:text-gray-300">
                    <li className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]" />
                      <span>An unlock link has been sent to <br/><strong className="text-gray-900 dark:text-white font-black">{lockedEmail}</strong></span>
                    </li>
                    <li className="flex gap-3 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(var(--primary-rgb),0.8)]" />
                      <span>Check your inbox (and spam) to reset your credentials.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </>
          )}
          
          <button
            onClick={() => setAccountStatus(null)}
            className="w-full mt-2 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-gray-900/20 dark:shadow-white/20 uppercase tracking-widest text-[11px]"
          >
            Dismiss
          </button>
        </div>
      </Modal>
    </div>
  );
}
