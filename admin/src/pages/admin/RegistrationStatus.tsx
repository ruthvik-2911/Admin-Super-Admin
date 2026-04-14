import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatusCard, type RegistrationStatus } from '../../components/ui/StatusCard';

export default function RegistrationStatus() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    // Get email from localStorage (stored during registration) or URL params
    const storedEmail = localStorage.getItem('registrationEmail');
    const urlParams = new URLSearchParams(window.location.search);
    const emailParam = urlParams.get('email');
    
    const emailToUse = storedEmail || emailParam || '';
    
    if (!emailToUse) {
      setEmail('demo@example.com');
    } else {
      setEmail(emailToUse);
    }

    // Simulate loading and set hardcoded approved status
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Hardcoded approved status for demo
  const status: RegistrationStatus = 'approved';
  const reason = undefined;

  const handleGoToLogin = () => {
    // Clear registration email since user is now approved
    localStorage.removeItem('registrationEmail');
    navigate('/admin/login');
  };

  const handleReApply = () => {
    // Clear registration email and redirect to registration
    localStorage.removeItem('registrationEmail');
    navigate('/admin/register');
  };

  
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Registration Status</h1>
          <p className="text-gray-600 mt-2">
            {email ? `Checking status for: ${email}` : 'Loading...'}
          </p>
        </div>

        {/* Status Card */}
        <StatusCard
          status={status}
          reason={reason}
          onGoToLogin={handleGoToLogin}
          onReApply={undefined}
          isLoading={isLoading}
        />

        
        {/* Help Section */}
        <div className="mt-8 text-center">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Need Help?</h3>
            <p className="text-gray-600 text-sm mb-4">
              If you have any questions about your registration, please contact our support team.
            </p>
            <div className="space-y-2 text-sm">
              <p className="text-gray-700">
                <span className="font-medium">Email:</span> support@company.com
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Phone:</span> +1 (555) 123-4567
              </p>
              <p className="text-gray-700">
                <span className="font-medium">Hours:</span> Mon-Fri, 9AM-6PM EST
              </p>
            </div>
          </div>
        </div>

              </div>
    </div>
  );
}
