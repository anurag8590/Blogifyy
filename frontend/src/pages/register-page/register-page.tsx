import { useNavigate } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import { register } from "@/services/auth";

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
      setTimeout(() => navigate({ to: "/login" }), 2000);
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-96 p-6 shadow-xl">
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="bg-green-50 p-4 rounded-md text-center">
              <p className="text-green-800 font-medium">Registration successful!</p>
              <p className="text-green-600 text-sm mt-1">Redirecting to login page...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              <div>
                <Label>Email</Label>
                <Input name="email" type="email" required placeholder="Enter your email" />
              </div>
              <div>
                <Label>Username</Label>
                <Input name="username" type="text" required placeholder="Enter your username" />
              </div>
              <div>
                <Label>Password</Label>
                <div className="relative">
                  <Input name="password" type={showPassword ? "text" : "password"} required placeholder="Enter password" />
                  <button
                    type="button"
                    className="absolute right-3 top-2.5 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>
          )}
          <p className="mt-4 text-sm text-center">
            Already have an account? {" "}
            <button
              onClick={() => navigate({ to: "/login" })} 
              className="text-blue-600 underline"
            >
              Login
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default RegisterPage;
