import { createRootRoute, Outlet } from "@tanstack/react-router";
import Footer from "@/components/footer/footer.tsx";
import { Suspense } from "react";
import LoadingScreen from "@/components/loading-screen/loading-screen.tsx";
import Navbar from "@/shared/navbar";

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col bg-purple-100">
      <Navbar />
      <div className="flex-1 bg-purple-100 pt-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <main className="flex-1">
        <Suspense fallback={<LoadingScreen />}>
          <Outlet />
        </Suspense>
      </main>
      </div>
      </div>
        <Footer />
    </div>
  ),
});