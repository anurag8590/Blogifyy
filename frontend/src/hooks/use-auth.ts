import { useState, useEffect } from "react";
import { isAuthenticated } from "@/services/auth";

export const useAuth = () => {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());

  useEffect(() => {
    const handleAuthChange = () => {
      console.log("Auth change detected")
      setAuthenticated(isAuthenticated());
    };

    window.addEventListener("storage", handleAuthChange);

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  return authenticated;
};

export const triggerAuthChange = () => {
  console.log("Triggering auth change");
  window.dispatchEvent(new Event("authChange"));
};