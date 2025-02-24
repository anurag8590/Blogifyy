import { useBlogs } from "@/hooks/use-blog";
import { Link } from "@tanstack/react-router";
import { Loader2, PenSquare, Plus, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { getPreviousPath } from "@/shared/prev-path-tracker";

export default function BlogPage() {
  const { userBlogs, isLoading, isError } = useBlogs();
  const navigate = useNavigate();

  const getStatusColor = (isPublished: boolean) => {
    return isPublished 
      ? "bg-green-100 text-green-700" 
      : "bg-yellow-100 text-yellow-700";
  };

  const getStatusText = (isPublished: boolean) => {
    return isPublished ? "Published" : "Draft";
  };

  const handleGoBack = () => {
      const previousPath = getPreviousPath();
      if (previousPath) {
        navigate({to : previousPath});
      }
    };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-0 py-0">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-cyan-600 to-purple-900 text-white py-9 px-4 relative">
          {/* Back Button - Positioned to the left */}
          <div className="absolute left-4 top-4">
            <Button
              variant="ghost"
              onClick={handleGoBack}
              className="text-white hover:text-purple-950 hover:bg-white rounded-full p-2 sm:p-3 flex gap-[-2px]"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
          </div>
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mt-4 mb-4">Your Stories</h1>
          <p className="text-xl text-purple-100 mb-8">Manage and edit your published and draft stories</p>
          <div className="flex justify-center">
              <Button
                onClick={() => navigate({ to: "/newblog" })}
                className="bg-white text-purple-700 hover:bg-purple-50 rounded-full px-6 py-2 mb-2 flex items-center gap-2"
              >
                <Plus size={20} />
                Create New Story
              </Button>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <p className="text-xl text-gray-800 mb-2">Unable to load your stories</p>
            <p className="text-gray-600">Please try again later</p>
          </div>
        ) : userBlogs?.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <PenSquare className="w-12 h-12 text-purple-300 mb-4" />
            <p className="text-xl text-gray-800 mb-2">No stories yet</p>
            <p className="text-gray-600 mb-6">Start writing your first story today!</p>
            <Button
              onClick={() => navigate({ to: "/newblog" })}
              className="bg-purple-600 text-white hover:bg-purple-700 rounded-full px-6 py-2"
            >
              Create Your First Story
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userBlogs?.map((blog: any) => (
              <div
                key={blog.blog_id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Thumbnail */}
                <div
                  className="h-48 bg-cover bg-center bg-purple-100"
                  style={{ 
                    backgroundImage: blog.thumbnail 
                      ? `url(${blog.thumbnail})` 
                      : `url(/florian-klauer-mk7D-4UCfmg-unsplash.jpg)` 
                  }}
                />
                
                <div className="p-6">
                  {/* Status Badge */}
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${getStatusColor(blog.is_published)}`}>
                    {getStatusText(blog.is_published)}
                  </span>
                  
                  <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {blog.content}
                  </p>

                  <div className="flex items-center justify-between">
                    <Link
                      to="/myblogs/$blogid"
                      params={{ blogid: String(blog.blog_id) }}
                      className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium gap-2 transition-colors"
                    >
                      <PenSquare size={16} />
                      Edit Story
                    </Link>
                    
                    <span className="text-sm text-gray-500">
                      {new Date(blog.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}