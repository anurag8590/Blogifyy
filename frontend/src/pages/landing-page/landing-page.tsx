import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

function LandingPage() {
  const navigate = useNavigate();
  const authenticated = useAuth();
  
  return (
    <div className="fixed inset-0 -mt-14"> {/* Offset for navbar */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/wp6374897.webp')" }}
      >
        {/* Overlay to ensure text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>
      
      {/* Content Container */}
      <div className="relative h-full flex flex-col items-center justify-center gap-6 px-4">
          {/* Title */}
          <h1 className="text-white text-[80px] sm:text-[100px] font-bold tracking-wide font-customFont drop-shadow-lg">
            <span className="bg-gradient-to-r from-white via-purple-100 to-purple-200 text-transparent bg-clip-text">
              Blogifyy
            </span>
          </h1>
      
          {/* Subtitle */}
          <p className="text-[22px] sm:text-2xl font-light max-w-2xl text-center">
            <span className="text-white text-transparent bg-clip-text">
              Welcome to Blogifyy! Got something on your mind? Share your thoughts with the world.
            </span>
          </p>
    
        {/* Button */}
        <Button 
          className="h-14 w-64 shadow-lg mt-8 text-lg sm:text-xl font-mono font-semibold rounded-xl 
                     bg-purple-600 text-white transition-all duration-300 hover:bg-purple-700 active:scale-95"
          onClick={() => navigate({ to: authenticated ? "/homepage" : "/register" })}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
}

export default LandingPage;