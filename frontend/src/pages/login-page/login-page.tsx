import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { login } from "@/services/auth";
import { triggerAuthChange } from "@/hooks/use-auth";
import { Flip,toast } from "react-toastify";

function LoginPage() {

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

      toast.success("Login successful!!", {
        autoClose: 2000,
        position: "bottom-right",
        transition: Flip,
      });

      triggerAuthChange();
      navigate({ to: "/homepage" });
    } 
    catch (err) {
      setError("Invalid username or password");
    } 
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-96 p-6 shadow-xl">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <div>
              <Label>Username</Label>
              <Input name="username" type = "text" required placeholder="Enter username" />
            </div>

            <div>
              <Label>Password</Label>
              <div className="relative">
                <Input name="password" type = "password" required placeholder="Enter password" />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Login"}
            </Button>
          </form>
          <p className="mt-4 text-sm text-center">
            Don't have an account? {" "}
            <button 
              onClick={() => navigate({ to: "/register" })} 
              className="text-blue-600 underline" >

              Register
              
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginPage;
