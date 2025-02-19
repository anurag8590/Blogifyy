import { useLoaderData } from "@tanstack/react-router";
import BlogPage from "./blog-create-page";

export default function BlogEditPage() {
  const blog = useLoaderData({from: "/myblogs/$blogid"});

  return (
    <BlogPage
      view={false}
      blogId={blog.blog_id}
      initialTitle={blog.title}
      initialContent={blog.content}
      initialIsPublished={blog.is_published}
      initialCategoryId={blog.category_id}
    />
  );
}
