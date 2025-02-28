import { useBlogs } from "@/hooks/use-blog";
import { Loader2, PenSquare, Plus, AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import MyBlogCard from "@/components/my-blog-card";

export default function BlogPage() {
  const { userBlogs, isLoading, isError } = useBlogs();
  const navigate = useNavigate();

  const handleGoBack = () => {
    window.history.back();
  };

  const convertHtmlToText = (html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-0 py-0">

      <div className="bg-gradient-to-r from-cyan-600 to-purple-900 text-white py-9 px-4 relative">
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
              <MyBlogCard 
                key={blog.blog_id} 
                blog={blog}
                convertHtmlToText={convertHtmlToText} // Make sure you have this function available
              />
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}