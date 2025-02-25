import { createFileRoute, redirect } from '@tanstack/react-router'
import { getBlogById } from '@/services/blog.service';
import BlogEditPage from '@/pages/blog-page/blog-edit-page';
import { isAuthenticated } from '@/services/auth.service';

export const Route = createFileRoute('/myblogs/$blogid')({
  beforeLoad: () => {
          if (!isAuthenticated()) {
            return redirect({ to: "/login" });
          }
        },
  component: BlogEditPage,
  loader: async ({ params }) => {
    const blogData = await getBlogById(Number(params.blogid));
    return blogData;
}
})

