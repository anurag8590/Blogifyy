import { useState, useEffect } from "react";
import { isAuthenticated } from "@/services/auth";

export const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  useEffect(() => {
    const handleAuthChange = () => {
      console.log("Auth change detected")
      setAuthenticated(isAuthenticated());
    };

    // Listen for storage changes in other tabs
    window.addEventListener("storage", handleAuthChange);

    // Manually trigger on login/logout
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  return authenticated;
};

// Function to manually trigger authentication change
export const triggerAuthChange = () => {
  console.log("Triggering auth change");
  window.dispatchEvent(new Event("authChange"));
};