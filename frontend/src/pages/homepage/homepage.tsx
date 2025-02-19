import { useNavigate, Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/use-category";
import { useBlogs } from "@/hooks/use-blog";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";

export default function HomePage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuth();
  const { blogs, isLoading: isBlogsLoading, isError: isBlogsError, error: blogsError } = useBlogs();
  const { categories, isLoading, isError, error } = useCategories();

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, navigate]);

  const handleNavigate = (path: string) => {
    navigate({ to: path });
  };
  //const userID = localStorage.getItem("user_id");
  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen py-10 px-4">
      <h2 className="text-4xl font-bold text-gray-800">Blogifyy</h2>

      <div className="flex gap-4 mt-6">
        <Button onClick={() => handleNavigate("/newblog")}>Create New Blog</Button>
        <Button onClick={() => handleNavigate(`/my-blog`)} variant="outline">My Blogs</Button>
      </div>

      <div className="w-full max-w-lg mt-6 flex gap-2">
        <Input
          name="search"
          id="search"
          placeholder="Search blogs..."
          className="flex-1 p-3 text-lg border rounded-md shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={() => handleNavigate(`/blogs?params=${searchQuery}&get_type=SEARCH`)}>Search</Button>
      </div>

      <div className="w-full max-w-3xl mt-6 flex flex-wrap justify-center gap-3">
        {isLoading ? (
          <p>Loading categories...</p>
        ) : isError ? (
          <p className="text-red-500">Error: {error?.message}</p>
        ) : (
          categories?.map((category: any) => (
            <Button
              key={category.category_id}
              variant="outline"
              onClick={() => handleNavigate(`/blogs/${category.category_id}?get_type=CATG`)}
              className="px-4 py-2 rounded-full"
            >
              {category.name}
            </Button>
          ))
        )}
      </div>

      <div className="w-full max-w-5xl mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isBlogsLoading ? (
          <p>Loading blogs...</p>
        ) : isBlogsError ? (
          <p className="text-red-500">Error: {blogsError?.message}</p>
        ) : (
          blogs?.map((blog: any) => (
            <div key={blog.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-semibold">{blog.title}</h3>
              <p className="text-gray-600 mt-2">{blog.content.slice(0, 50)}...</p>
              <Link to="/blogs/$blogid"
              className="text-blue-800 hover:text-blue-200"
                            params={
                              {
                                blogid: String(blog.blog_id)
                              }
                            }>
                              Read
                            </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
