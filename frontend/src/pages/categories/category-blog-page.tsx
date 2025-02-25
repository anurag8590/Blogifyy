import { useLoaderData, useNavigate } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Blog } from "@/interface/Blog";
import { Button } from "@/components/ui/button";
import { getPreviousPath } from "@/shared/prev-path-tracker";
import { ArrowLeft } from "lucide-react";



export default function CategoriesBlogPage() {
  
  const navigate = useNavigate();
  
  const handleGoBack = () => {
      const previousPath = getPreviousPath();
      if (previousPath) {
        navigate({to : previousPath});
      }
    };

  const blogs = useLoaderData({from: "/blogs/category/$catid"});
  console.log(blogs)
  
  if (!blogs || blogs.length === 0) {
    return (
      <div className="h-screen bg-gradient-to-br from-purple-50 to-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">No blogs found in this category</h2>
            <p className="mt-4 mb-6 text-gray-600">Check back later for new content</p>
            <div className="flex justify-center">
              <Button
                onClick={handleGoBack}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-4 py-2 flex items-center"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span>Back</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white pt-0">
      <div className="max-w-7xl mx-auto px-0 py-0">
        <div className="text-center mb-16">
      <div className="bg-gradient-to-r from-cyan-600 to-purple-900 text-white py-12 px-4 mb-10">
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
            {blogs[0]?.name || 'Category Blogs'}
          </h1>
          <p className="text-lg text-white max-w-2xl mx-auto leading-relaxed">
            Explore all articles in this category
          </p>
          <Button
                onClick={handleGoBack}
                className="text-white hover:text-purple-950 hover:bg-white rounded-full mt-4 drop-shadow-2xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span>Back</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog: Blog) => (
            <div
              key={blog.blog_id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${blog.thumbnail || '/florian-klauer-mk7D-4UCfmg-unsplash.jpg'})` }}
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">{blog.title}</h3>
                <p className="text-gray-600 line-clamp-3 mb-4">{blog.content}</p>
                <Link
                  to="/blogs/$blogid"
                  params={{ blogid: String(blog.blog_id) }}
                  className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium gap-2 transition-colors"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  );
}