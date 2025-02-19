import { createFileRoute } from '@tanstack/react-router'
import { getBlogById } from '@/api/blog';
import BlogEditPage from '@/pages/blog-page/blog-edit-page';

export const Route = createFileRoute('/myblogs/$blogid')({
  component: BlogEditPage,
  loader: async ({ params }) => {
    const blogData = await getBlogById(Number(params.blogid));
    return blogData;
}
})

