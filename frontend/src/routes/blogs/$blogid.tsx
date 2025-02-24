import { createFileRoute, redirect } from '@tanstack/react-router'
import BlogViewPage from '@/pages/blog-page/blog-view-page'
import { getBlogById } from '@/api/blog';
import { isAuthenticated } from '@/services/auth';

export const Route = createFileRoute('/blogs/$blogid')({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      return redirect({ to: "/login" });
    }
  },
  component: BlogViewPage,
  loader: async ({ params }) => {
      const blogData = await getBlogById(Number(params.blogid));
      return blogData;
}})

