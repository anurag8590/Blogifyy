import { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/use-category";
import { useBlogs, useCategoryBlogs } from "@/hooks/use-blog";
import { useAuth } from "@/hooks/use-auth";
import { Flip, toast } from "react-toastify";
import { Blog } from "@/interface/Blog";
import { BlogCategory } from "@/interface/Category";
import { Search, PenSquare, BookOpen, Loader2 } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuth();
  const { blogs: defaultBlogs, isLoading: isBlogsLoading, isError: isBlogsError } = useBlogs();
  const { categories, isLoading: isCategoriesLoading, isError: isCategoriesError} = useCategories();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const { data: categoryBlogs, isLoading: isCategoryBlogsLoading } = useCategoryBlogs(activeCategoryId!);

  const filteredBlogs = useMemo(() => {
    const blogsToFilter = activeCategoryId ? categoryBlogs : defaultBlogs;
    if (!blogsToFilter) return [];
    
    return blogsToFilter.filter((blog: Blog) => 
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, defaultBlogs, categoryBlogs, activeCategoryId]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    }
    if (isBlogsError || isCategoriesError) {
      toast.error("Error! Returning Back to Login", {
        autoClose: 1500,
        position: "bottom-right",
        transition: Flip,
      });
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, navigate, isBlogsError, isCategoriesError]);

  const handleCategoryClick = (categoryId: number) => {
    setActiveCategoryId(categoryId === activeCategoryId ? null : categoryId);
  };

  return (
    <div className="bg-gradient-to-b from-purple-50 to-white">

      <div className="bg-gradient-to-r from-cyan-600 to-purple-900 text-white py-12 px-4 ">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4 ">Blogifyy</h1>
          <p className="text-xl text-purple-100 mb-8 ">Discover stories, thoughts, and expertise from writers on any topic.</p>
          

          <div className="flex justify-center gap-4">
            <Button
              onClick={() => navigate({ to: "/newblog" })}
              variant="ghost"
              className="text-white hover:text-purple-950 hover:bg-white shadow-lg rounded-full px-6 py-2 flex items-center gap-2"
            >
              <PenSquare size={20} />
              Write a Story
            </Button>
            <Button
              onClick={() => navigate({ to: "/my-blog" })}
              variant="ghost"
              className="text-white hover:text-purple-950 hover:bg-white shadow-lg rounded-full px-6 py-2 flex items-center gap-2"
            >
              <BookOpen size={20} />
              My Stories
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="relative max-w-2xl mx-auto mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stories..."
            className="w-full pl-12 pr-4 py-3 text-lg rounded-full border-2 border-purple-100 focus:border-purple-500 focus:ring-purple-500 transition-all"
          />
        </div>


        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {isCategoriesLoading ? (
            <Loader2 className="animate-spin text-purple-600" />
          ) : (
            categories?.map((category: BlogCategory) => (
              <Button
                key={category.category_id}
                variant={activeCategoryId === category.category_id ? "default" : "outline"}
                onClick={() => handleCategoryClick(category.category_id)}
                className={`rounded-full px-6 py-2 transition-all ${
                  activeCategoryId === category.category_id
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "border-purple-300 text-purple-600 hover:bg-purple-50"
                }`}
              >
                {category.name}
              </Button>
            ))
          )}
        </div>

        {isBlogsLoading || isCategoryBlogsLoading ? (
          <div className="flex justify-center">
            <Loader2 className="animate-spin text-purple-600" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog: Blog) => (
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
                    state={{ author: String(blog.user_id) } as any}
                    className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium gap-2 transition-colors"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
            {filteredBlogs.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No stories found matching your criteria</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}