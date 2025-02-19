import { useLoaderData } from "@tanstack/react-router";
import BlogPage from "./blog-create-page";

export default function BlogViewPage() {
  const blog = useLoaderData({from: "/blogs/$blogid"});

  return (
    <BlogPage
      view={true}
      blogId={blog.blog_id}
      initialTitle={blog.title}
      initialContent={blog.content}
      initialIsPublished={blog.is_published}
      initialCategoryId={blog.category_id}
    />
  );
}
