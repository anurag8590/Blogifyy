import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";

function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = () => {
    toast.success("Registration successful!");
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-96 p-6 shadow-xl">
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Label>Email</Label>
            <Input type="email" placeholder="Enter your email" />
          </div>
          <div className="mb-4">
            <Label>Password</Label>
            <div className="relative">
              <Input type={showPassword ? "text" : "password"} placeholder="Enter password" />
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeClosedIcon /> : <EyeOpenIcon />}
              </button>
            </div>
          </div>
          <Button className="w-full" onClick={handleRegister}>
            Register
          </Button>
          <p className="mt-4 text-sm text-center">
            Already have an account?{" "}
            <button onClick={() => navigate("/login")} className="text-blue-600 underline">
              Login
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default RegisterPage;
