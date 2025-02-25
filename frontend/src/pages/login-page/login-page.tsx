import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { login } from "@/services/auth.service";
import { triggerAuthChange } from "@/hooks/use-auth";
import { Flip, toast } from "react-toastify";
import { Lock, User, EyeOff, Eye } from "lucide-react";

function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      await login({
        username: formData.get("username") as string,
        password: formData.get("password") as string,
      });

      toast.success("Login successful!", {
        autoClose: 2000,
        position: "bottom-right",
        transition: Flip,
      });

      triggerAuthChange();
      navigate({ to: "/homepage" });
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full mt-10 max-w-md border-0 shadow-[0_0_20px_5px_rgba(192,132,252,0.8)]">
        <CardHeader className="space-y-3 pb-6">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-cyan-600 to-purple-900 bg-clip-text text-transparent">
            Welcome back
          </CardTitle>
          <p className="text-sm text-center text-gray-600">
            Enter your credentials to access your account
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-500 text-sm p-4 rounded-lg text-center border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Username
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  name="username"
                  type="text"
                  required
                  placeholder="Enter username"
                  className="pl-10 bg-gray-50 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter password"
                  className="pl-10 pr-10 bg-gray-50 border-gray-200 focus:border-purple-400 focus:ring-purple-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 transition-colors duration-200"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate({ to: "/register" })}
                className="text-purple-600 hover:text-purple-700 font-medium transition-colors"
              >
                Create account
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
