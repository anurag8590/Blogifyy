import { useLoaderData } from "@tanstack/react-router";
import BlogCreatePage from "./blog-create-page";

export default function BlogEditPage() {
  const blog = useLoaderData({from: "/myblogs/$blogid"});

  return (
    <BlogCreatePage
      view={false}
      blogId={blog.blog_id}
      initialTitle={blog.title}
      initialContent={blog.content}
      initialIsPublished={blog.is_published}
      initialCategoryId={blog.category_id}
    />
  );
}
