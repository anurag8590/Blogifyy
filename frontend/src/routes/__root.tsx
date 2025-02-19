import { createRootRoute, Outlet } from "@tanstack/react-router";
// import NotificationBar from "@/components/notification-bar";
import Footer from "@/components/footer/footer.tsx";
import { Suspense } from "react";
import LoadingScreen from "@/components/loading-screen/loading-screen.tsx";

export const Route = createRootRoute({
  component: () => (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 w-full z-50">
      </div>
      <div className="flex-1 flex flex-col justify justify-center mt-16">
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <Footer />
    </div>
  ),
});