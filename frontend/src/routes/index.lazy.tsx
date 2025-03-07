import { createLazyFileRoute } from "@tanstack/react-router";
import LandingPage from "@/pages/landing-page/landing-page";

export const Route = createLazyFileRoute("/")({
  component: LandingPage
});