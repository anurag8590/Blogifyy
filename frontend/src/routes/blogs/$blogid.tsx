import { createFileRoute } from '@tanstack/react-router'
import BlogViewPage from '@/pages/blog-page/blog-view-page'
import { getBlogById } from '@/api/blog';

export const Route = createFileRoute('/blogs/$blogid')({
  component: BlogViewPage,
  loader: async ({ params }) => {
      const blogData = await getBlogById(Number(params.blogid));
      return blogData;
}})

