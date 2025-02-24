import { useLoaderData } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Blog } from "@/interface/Blog";

export default function CategoriesBlogPage() {

  const blogs = useLoaderData({from: "/blogs/category/$catid"});
  console.log(blogs)
  
  if (!blogs || blogs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">No blogs found in this category</h2>
            <p className="mt-4 text-gray-600">Check back later for new content</p>
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