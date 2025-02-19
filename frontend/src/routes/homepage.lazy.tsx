import { createLazyFileRoute } from "@tanstack/react-router";
import HomePage from "@/pages/homepage/homepage";

export const Route = createLazyFileRoute("/homepage")({
  component: HomePage
});