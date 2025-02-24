import { useLoaderData} from "@tanstack/react-router";
import BlogCreatePage from "./blog-create-page";
import { useLocation } from "@tanstack/react-router";

export default function BlogViewPage() {
  const blog = useLoaderData({from: "/blogs/$blogid"});
  const location = useLocation();
  const author = location?.state?.author || null;

  // console.log(`author: ${author}`)
  // console.log(typeof(author))

  return (
    <BlogCreatePage
      view={true}
      blogId={blog.blog_id}
      author = {Number(author)}
      initialTitle={blog.title}
      initialContent={blog.content}
      initialIsPublished={blog.is_published}
      initialCategoryId={blog.category_id}
    />
  );
}
