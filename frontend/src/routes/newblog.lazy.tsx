import { createLazyFileRoute } from "@tanstack/react-router";
import BlogCreatePage from "@/pages/blog-page/blog-create-page";

export const Route = createLazyFileRoute("/newblog")({
    component: BlogCreatePage,
});
