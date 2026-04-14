
import { Toaster } from "react-hot-toast";import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { InputField } from '../../components/form/InputField';
import { FileUpload } from '../../components/form/FileUpload';
import { Button } from '../../components/ui/Button';

export default function AdminRegister() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
  } = useForm();

  // Watch GST number to show/hide GST certificate field
  const gstNumber = watch('gstNumber');
  const showGstCertificate = Boolean(gstNumber?.trim());

  const onSubmit = (data: any) => {
    console.log("Demo Submit:", data);
    setIsSubmitting(true);
    
    // Store registration info for status page
    localStorage.setItem('registrationEmail', data.emailId);
    
    // Redirect to status page after a delay
    setTimeout(() => {
      navigate('/admin/status');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Admin Registration</h1>
            <p className="text-blue-100 mt-2">Register your business account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
            {/* Company Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                Company Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Company Name"
                  name="companyName"
                  placeholder="Enter your company name"
                  register={register}
                />
                
                <InputField
                  label="Authorized Person Name"
                  name="authorizedPerson"
                  placeholder="Full name of authorized person"
                  register={register}
                  required
                />
                
                <div className="md:col-span-2">
                  <InputField
                    label="Business Address"
                    name="businessAddress"
                    placeholder="Complete business address"
                    register={register}
                    required
                  />
                </div>
                
                <InputField
                  label="GST Number (Optional)"
                  name="gstNumber"
                  placeholder="e.g., 27AAPCS1234C1ZV"
                  register={register}
                />
                
                {showGstCertificate && (
                  <div className="md:col-span-2">
                    <FileUpload
                      label="GST Certificate"
                      name="gstCertificate"
                      register={register}
                      required={showGstCertificate}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Mobile Number"
                  name="mobileNumber"
                  type="tel"
                  placeholder="10-digit mobile number"
                  register={register}
                  required
                />
                
                <InputField
                  label="Email ID"
                  name="emailId"
                  type="email"
                  placeholder="business@example.com"
                  register={register}
                  required
                />
              </div>
            </div>

            {/* Document Uploads Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                Document Uploads
              </h2>
              
              <div className="space-y-6">
                <FileUpload
                  label="Company Registration Document"
                  name="companyRegistrationDoc"
                  register={register}
                  required
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                
                <FileUpload
                  label="ID Proof"
                  name="idProof"
                  register={register}
                  required
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6 border-t border-gray-200">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                disabled={isSubmitting}
                className="min-w-[200px]"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Registration'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
