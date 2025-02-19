// src/pages/landing-page/landing-page.tsx
import './landing-page.css'
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

function LandingPage() {
  const navigate = useNavigate();
  const authenticated = useAuth();
  
  return (
    <div className="landing-page">
      <header className="header">
        <h1>Blogifyy</h1>
      </header>
      <main className="main-content">
        <p>
          Welcome to Blogifyy, your ultimate blogging platform. Share your thoughts,
          stories, and ideas with the world. Join our community of writers and
          start your blogging journey today!
        </p>
        <Button onClick={() => navigate({ to: authenticated ? "/homepage" : "/register" })} >
          Get Started
        </Button>
      </main>
      <footer className="footer">
        <p>&copy; 2023 Blogifyy. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LandingPage;