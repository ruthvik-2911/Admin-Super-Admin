import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Megaphone,
  MapPin,
  Building2,
  User,
  Phone,
  Mail,
  MapPinned,
  FileText,
  Upload,
  ArrowRight,
  Loader2,
  Lock,
} from 'lucide-react';
import logo from '../../assets/lightmodelogo.png';
import icon from '../../assets/keliriicon.png';

const features = [
  { icon: BarChart3, label: 'Real-Time Insights', desc: 'Track performance across all locations with live data.' },
  { icon: Megaphone, label: 'Smart Ad Management', desc: 'Create, edit, publish, and monitor advertisements.' },
  { icon: MapPin, label: 'Geo-Targeting', desc: 'City-level and radius-based ad delivery.' },
  { icon: Building2, label: 'Publisher Management', desc: 'Easily manage and track all your business branches.' },
];

export default function AdminRegister() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gstCertFile, setGstCertFile] = useState<File | null>(null);
  const [companyDocFile, setCompanyDocFile] = useState<File | null>(null);
  const [idProofFile, setIdProofFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onBlur' });

  const gstNumber = watch('gstNumber');
  const showGstCertificate = Boolean(gstNumber?.trim());

  const onSubmit = (data: any) => {
    setIsSubmitting(true);
    localStorage.setItem('registrationEmail', data.emailId);
    setTimeout(() => {
      navigate('/admin/status');
    }, 1000);
  };

  const inputClass = 'input-field';
  const errorClass = 'text-xs text-red-500 mt-1 font-medium';
  const labelClass = 'text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block';

  const FileDropZone = ({
    label,
    file,
    onChange,
    accept = '.pdf,.jpg,.jpeg,.png',
    required = false,
    hint,
  }: {
    label: string;
    file: File | null;
    onChange: (f: File | null) => void;
    accept?: string;
    required?: boolean;
    hint?: string;
  }) => (
    <div>
      <label className={labelClass}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <label className="group flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer bg-white dark:bg-[#1A1D24] hover:border-primary-400 hover:bg-primary-50/50 dark:hover:border-primary-500 transition-all shadow-sm">
        <div className="flex flex-col items-center gap-1.5 text-center px-4">
          {file ? (
            <>
              <FileText className="w-6 h-6 text-primary-500" />
              <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 truncate max-w-[200px]">{file.name}</p>
              <p className="text-xs text-gray-400">Click to change</p>
            </>
          ) : (
            <>
              <Upload className="w-6 h-6 text-gray-400 group-hover:text-primary-500 transition-colors" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                <span className="text-primary-500 font-semibold">Click to upload</span> or drag & drop
              </p>
              <p className="text-xs text-gray-400">{hint || 'PDF, JPG, PNG accepted'}</p>
            </>
          )}
        </div>
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </label>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0E1117] overflow-hidden animate-fade-in transition-colors">
      <Toaster position="top-right" />

      {/* ─── Left Panel: Branding ─── */}
      <div className="hidden lg:flex flex-col w-[40%] bg-gradient-to-br from-primary-500 via-primary-600 to-orange-700 relative p-12">
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
            Register your business to access the administration dashboard — create campaigns, manage branch-level publishers, and track performance.
          </p>

          {/* Features */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: BarChart3, label: 'Real-Time Insights', desc: 'Track performance across all locations with live data.' },
              { icon: Megaphone, label: 'Smart Ad Management', desc: 'Create, edit, publish, and monitor advertisements.' },
              { icon: MapPin, label: 'Geo-Targeting', desc: 'City-level and radius-based ad delivery.' },
              { icon: Building2, label: 'Publisher Management', desc: 'Easily manage and track all your business branches.' },
            ].map((f) => {
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

      {/* ── Right Panel: Form ── */}
      <div className="flex-1 flex flex-col p-8 sm:p-12 overflow-y-auto relative">
        <div className="w-full max-w-2xl mx-auto my-auto animate-fade-in-scale">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <img src={icon} alt="KELIRI Logo" className="w-8 h-8 object-contain" />
            </div>
            <p className="font-bold text-gray-900 dark:text-white">KELIRI</p>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Create your account</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Register your business to get started with Keliri Admin</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* ── Company Information ── */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-5 pb-3 border-b border-gray-100 dark:border-gray-800">
                Company Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Company Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      {...register('companyName', { required: 'Company name is required' })}
                      type="text"
                      placeholder="Your company name"
                      className={`${inputClass} pl-10 ${errors.companyName ? 'border-red-400 ring-2 ring-red-100 dark:ring-red-500/20' : ''}`}
                    />
                  </div>
                  {errors.companyName && <p className={errorClass}>{errors.companyName.message as string}</p>}
                </div>

                <div>
                  <label className={labelClass}>Authorized Person Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      {...register('authorizedPerson', { required: 'Authorized person name is required' })}
                      type="text"
                      placeholder="Full name"
                      className={`${inputClass} pl-10 ${errors.authorizedPerson ? 'border-red-400 ring-2 ring-red-100 dark:ring-red-500/20' : ''}`}
                    />
                  </div>
                  {errors.authorizedPerson && <p className={errorClass}>{errors.authorizedPerson.message as string}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Business Address <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <MapPinned className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      {...register('businessAddress', { required: 'Business address is required' })}
                      type="text"
                      placeholder="Complete business address"
                      className={`${inputClass} pl-10 ${errors.businessAddress ? 'border-red-400 ring-2 ring-red-100 dark:ring-red-500/20' : ''}`}
                    />
                  </div>
                  {errors.businessAddress && <p className={errorClass}>{errors.businessAddress.message as string}</p>}
                </div>

                <div className={showGstCertificate ? '' : 'md:col-span-2'}>
                  <label className={labelClass}>GST Number <span className="text-gray-400 font-normal text-[10px] uppercase ml-1">(Optional)</span></label>
                  <div className="relative">
                    <FileText className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      {...register('gstNumber')}
                      type="text"
                      placeholder="e.g. 27AAPCS1234C1ZV"
                      className={`${inputClass} pl-10`}
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">GST certificate upload will appear if you enter a number</p>
                </div>

                {showGstCertificate && (
                  <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
                    <FileDropZone
                      label="GST Certificate"
                      file={gstCertFile}
                      onChange={setGstCertFile}
                      required={showGstCertificate}
                      hint="PDF, JPG, PNG — max 5MB"
                    />
                  </motion.div>
                )}
              </div>
            </div>

            {/* ── Contact Information ── */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-5 pb-3 border-b border-gray-100 dark:border-gray-800">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelClass}>Mobile Number <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-medium">+91</span>
                    <span className="absolute left-[46px] top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-700">|</span>
                    <input
                      {...register('mobileNumber', {
                        required: 'Mobile number is required',
                        pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit Indian mobile number' },
                      })}
                      type="tel"
                      placeholder="10-digit mobile number"
                      className={`${inputClass} pl-14 tracking-wider ${errors.mobileNumber ? 'border-red-400 ring-2 ring-red-100 dark:ring-red-500/20' : ''}`}
                    />
                  </div>
                  {errors.mobileNumber && <p className={errorClass}>{errors.mobileNumber.message as string}</p>}
                </div>

                <div>
                  <label className={labelClass}>Email ID <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      {...register('emailId', {
                        required: 'Email is required',
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
                      })}
                      type="email"
                      placeholder="business@example.com"
                      className={`${inputClass} pl-10 ${errors.emailId ? 'border-red-400 ring-2 ring-red-100 dark:ring-red-500/20' : ''}`}
                    />
                  </div>
                  {errors.emailId && <p className={errorClass}>{errors.emailId.message as string}</p>}
                </div>
              </div>
            </div>

            {/* ── Document Uploads ── */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-5 pb-3 border-b border-gray-100 dark:border-gray-800">
                Document Uploads
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FileDropZone
                  label="Company Registration Document"
                  file={companyDocFile}
                  onChange={setCompanyDocFile}
                  required
                  hint="Certificate of incorporation or equivalent"
                />
                <FileDropZone
                  label="ID Proof"
                  file={idProofFile}
                  onChange={setIdProofFile}
                  required
                  hint="Aadhaar, Passport, or Driving License"
                />
              </div>
            </div>

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-6 uppercase tracking-widest text-[11px]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin opacity-75" />
                  Submitting Registration...
                </span>
              ) : (
                <>
                  Register <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <footer className="mt-12 text-center pb-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <a href="/admin/login" className="text-primary-600 dark:text-primary-400 font-bold hover:underline transition-colors">
                Sign in
              </a>
            </p>
            <div className="mt-8 flex items-center justify-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-600 border border-gray-100 dark:border-gray-800 py-1.5 px-3 rounded-full inline-flex mx-auto bg-white dark:bg-black/20 shadow-sm">
              <Lock className="w-2.5 h-2.5" /> Protected by KELIRI Security
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
