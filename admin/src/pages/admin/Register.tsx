import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  BarChart2,
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
} from 'lucide-react';

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

  const inputClass =
    'block w-full pl-10 px-4 py-3 bg-white dark:bg-[#1C1F26] border border-gray-200 dark:border-gray-800 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors shadow-sm text-sm';
  const errorClass = 'text-xs text-red-500 mt-1 font-medium';
  const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

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
      <label className="group flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer bg-gray-50 dark:bg-[#1C1F26] hover:border-brand-400 hover:bg-brand-50/30 dark:hover:border-brand-500 transition-all">
        <div className="flex flex-col items-center gap-1.5 text-center px-4">
          {file ? (
            <>
              <FileText className="w-6 h-6 text-brand-500" />
              <p className="text-sm font-semibold text-brand-600 dark:text-brand-400 truncate max-w-[200px]">{file.name}</p>
              <p className="text-xs text-gray-400">Click to change</p>
            </>
          ) : (
            <>
              <Upload className="w-6 h-6 text-gray-400 group-hover:text-brand-500 transition-colors" />
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                <span className="text-brand-500 font-semibold">Click to upload</span> or drag & drop
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
    <div className="flex min-h-screen bg-gray-50 md:bg-white dark:bg-[#0E1117]">
      <Toaster position="top-right" />

      {/* ── Left Panel ── */}
      <div className="hidden lg:flex lg:w-5/12 relative bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 overflow-hidden text-white p-12 flex-col justify-between">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-brand-400 rounded-full blur-[100px] opacity-60" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-brand-800 rounded-full blur-[120px] opacity-60" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="" className="h-10 w-auto object-contain" />
          </div>

          <div className="mt-16 max-w-xl">
            <h2 className="text-4xl font-bold leading-tight mb-5 tracking-tight">
              Manage Your Advertising<br />Network From One<br />Unified Dashboard
            </h2>
            <p className="text-brand-100 text-lg font-medium leading-relaxed mb-10">
              Take complete control of your business advertising ecosystem — create campaigns, manage branch-level publishers, monitor performance, and track spending — all from a single, powerful admin platform.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <BarChart2 className="w-5 h-5" />, title: 'Real-Time Insights', desc: 'Track performance across all locations with live data.' },
                { icon: <Megaphone className="w-5 h-5" />, title: 'Smart Ad Management', desc: 'Create, edit, publish, and monitor advertisements.' },
                { icon: <MapPin className="w-5 h-5" />, title: 'Geo-Targeting', desc: 'City-level and radius-based ad delivery.' },
                { icon: <Building2 className="w-5 h-5" />, title: 'Publisher Management', desc: 'Easily manage and track all your business branches.' },
              ].map((f, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:bg-white/15 transition-colors">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white/10 rounded-lg">{f.icon}</div>
                    <span className="font-semibold text-sm">{f.title}</span>
                  </div>
                  <p className="text-xs text-brand-200 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-brand-200 font-medium tracking-wide">© 2026 Keliri</div>
      </div>

      {/* ── Right Panel ── */}
      <div className="w-full lg:w-7/12 flex items-start justify-center p-6 sm:p-10 lg:p-14 overflow-y-auto bg-gray-50 dark:bg-[#0E1117] transition-colors">
        <div className="w-full max-w-2xl">

          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <img src="/logo.png" alt="" className="h-10 w-auto object-contain" />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">Create your account</h2>
            <p className="text-gray-500 dark:text-gray-400">Register your business to get started with Keliri Admin</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            {/* ── Company Information ── */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-5 pb-3 border-b border-gray-100 dark:border-gray-800">
                Company Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Company Name */}
                <div>
                  <label className={labelClass}>Company Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Building2 className="w-[18px] h-[18px]" />
                    </div>
                    <input
                      {...register('companyName', { required: 'Company name is required' })}
                      type="text"
                      placeholder="Your company name"
                      className={inputClass}
                    />
                  </div>
                  {errors.companyName && <p className={errorClass}>{errors.companyName.message as string}</p>}
                </div>

                {/* Authorized Person */}
                <div>
                  <label className={labelClass}>Authorized Person Name <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <User className="w-[18px] h-[18px]" />
                    </div>
                    <input
                      {...register('authorizedPerson', { required: 'Authorized person name is required' })}
                      type="text"
                      placeholder="Full name"
                      className={inputClass}
                    />
                  </div>
                  {errors.authorizedPerson && <p className={errorClass}>{errors.authorizedPerson.message as string}</p>}
                </div>

                {/* Business Address - full width */}
                <div className="md:col-span-2">
                  <label className={labelClass}>Business Address <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <MapPinned className="w-[18px] h-[18px]" />
                    </div>
                    <input
                      {...register('businessAddress', { required: 'Business address is required' })}
                      type="text"
                      placeholder="Complete business address"
                      className={inputClass}
                    />
                  </div>
                  {errors.businessAddress && <p className={errorClass}>{errors.businessAddress.message as string}</p>}
                </div>

                {/* GST Number */}
                <div className={showGstCertificate ? '' : 'md:col-span-2'}>
                  <label className={labelClass}>GST Number <span className="text-gray-400 font-normal text-xs">(Optional)</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <FileText className="w-[18px] h-[18px]" />
                    </div>
                    <input
                      {...register('gstNumber')}
                      type="text"
                      placeholder="e.g. 27AAPCS1234C1ZV"
                      className={inputClass}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">GST certificate upload will appear if you enter a number</p>
                </div>

                {/* GST Certificate Upload (conditional) */}
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
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-5 pb-3 border-b border-gray-100 dark:border-gray-800">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* Mobile Number */}
                <div>
                  <label className={labelClass}>Mobile Number <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Phone className="w-[18px] h-[18px]" />
                    </div>
                    <input
                      {...register('mobileNumber', {
                        required: 'Mobile number is required',
                        pattern: { value: /^[6-9]\d{9}$/, message: 'Enter a valid 10-digit Indian mobile number' },
                      })}
                      type="tel"
                      placeholder="10-digit mobile number"
                      className={inputClass}
                    />
                  </div>
                  {errors.mobileNumber && <p className={errorClass}>{errors.mobileNumber.message as string}</p>}
                </div>

                {/* Email ID */}
                <div>
                  <label className={labelClass}>Email ID <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-[18px] h-[18px]" />
                    </div>
                    <input
                      {...register('emailId', {
                        required: 'Email is required',
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email address' },
                      })}
                      type="email"
                      placeholder="business@example.com"
                      className={inputClass}
                    />
                  </div>
                  {errors.emailId && <p className={errorClass}>{errors.emailId.message as string}</p>}
                </div>
              </div>
            </div>

            {/* ── Document Uploads ── */}
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-5 pb-3 border-b border-gray-100 dark:border-gray-800">
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
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
              ) : (
                <>Register <ArrowRight className="w-[18px] h-[18px]" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <a href="/admin/login" className="text-brand-600 dark:text-brand-400 font-semibold hover:underline">
                Sign in
              </a>
            </p>
          </div>

          <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            Protected by <span className="font-semibold text-gray-700 dark:text-gray-300">Keliri Security</span>
            <span>·</span>
            Role-based access control
          </div>
        </div>
      </div>
    </div>
  );
}
