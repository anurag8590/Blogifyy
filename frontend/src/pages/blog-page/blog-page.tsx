// import { useNavigate } from "@tanstack/react-router";
// import { Button } from "@/components/ui/button";
import { useBlogs } from "@/hooks/use-blog";
import { Link } from "@tanstack/react-router";
// import { useAuth } from "@/hooks/use-auth";
// import { useEffect } from "react";

export default function BlogPage() {

  const { userBlogs, isLoading, isError } = useBlogs();

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen">
      <h2 className="text-4xl font-bold text-gray-800 mt-10">Blogs</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p className="text-red-500">Error loading blogs.</p>
      ) : userBlogs?.length === 0 ? (
        <p className="text-gray-600 mt-6">There are no blogs yet!!</p>
      ) : (
        <div className="w-3/4 mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userBlogs?.map((blog: any) => (
            <div key={blog.id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold">{blog.title}</h3>
              <p className="text-gray-600 mt-2">{blog.content.slice(0, 30) + "..."}</p>
              <Link to="/myblogs/$blogid"
              params={
                {
                  blogid: String(blog.blog_id)
                }
              }>
                Edit
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}