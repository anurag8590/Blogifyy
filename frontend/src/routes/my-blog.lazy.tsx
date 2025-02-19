import { createLazyFileRoute } from "@tanstack/react-router";
import BlogPage from "@/pages/blog-page/blog-page";

export const Route = createLazyFileRoute("/my-blog")({
  component: BlogPage,
});
