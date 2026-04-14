import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { InputField } from "../../components/form/InputField";
import { Button } from "../../components/ui/Button";

type TabType = "email" | "otp";

export default function AdminLogin() {
  const [activeTab, setActiveTab] = useState<TabType>("email");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/admin/dashboard"); // change if needed
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 px-8 py-6">
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-blue-100 mt-1">Demo Login Page</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={`flex-1 py-3 ${
              activeTab === "email" ? "border-b-2 border-blue-500" : ""
            }`}
            onClick={() => setActiveTab("email")}
          >
            Email Login
          </button>

          <button
            className={`flex-1 py-3 ${
              activeTab === "otp" ? "border-b-2 border-blue-500" : ""
            }`}
            onClick={() => setActiveTab("otp")}
          >
            OTP Login
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          {activeTab === "email" ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <InputField
                label="Email"
                name="email"
                placeholder="Enter email"
                register={register}
              />

              <InputField
                label="Password"
                name="password"
                type="password"
                placeholder="Enter password"
                register={register}
              />

              <Button type="submit" className="w-full">
                {isSubmitting ? "Logging in..." : "Login"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <InputField
                label="Mobile Number"
                name="mobile"
                placeholder="Enter mobile number"
                register={register}
              />

              <Button type="submit" className="w-full">
                {isSubmitting ? "Sending OTP..." : "Send OTP"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}