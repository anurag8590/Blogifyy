import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { register } from "@/services/auth";
import { Lock, User, Mail, Eye, EyeOff } from 'lucide-react';

function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const credentials = {
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      await register(credentials);
      setSuccess(true);
      toast.success("Registration successful!");
      setTimeout(() => navigate({ to: "/login" }), 1500);
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4">
      <Card className="w-full max-w-md border-0 shadow-[0_0_20px_5px_rgba(192,132,252,0.8)]">
        <CardHeader className="space-y-3 pb-6">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-cyan-600 to-purple-900 bg-clip-text text-transparent">
            Create Account
          </CardTitle>
          <p className="text-sm text-center text-gray-600">
            Join us today and get started with your journey
          </p>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="bg-green-50 p-6 rounded-xl text-center border border-green-100">
              <p className="text-green-800 font-medium text-lg">Registration successful!</p>
              <p className="text-green-600 text-sm mt-2">Redirecting to login page...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-500 text-sm p-4 rounded-lg text-center border border-red-100">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Email</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    name="email"
                    type="email"
                    required
                    placeholder="Enter your email"
                    className="pl-10 bg-gray-50 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Username</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    name="username"
                    type="text"
                    required
                    placeholder="Choose a username"
                    className="pl-10 bg-gray-50 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Password</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Create a password"
                    className="pl-10 pr-10 bg-gray-50 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 transition-colors duration-200"
              >
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate({ to: "/login" })}
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default RegisterPage;