import { useNavigate, Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/use-category";
import { useBlogs, useCategoryBlogs, useSearchBlogs } from "@/hooks/use-blog"; // Import hooks
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Flip, toast } from "react-toastify";
import { Blog } from "@/interface/Blog";
import { BlogCategory } from "@/interface/Category";


export default function HomePage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuth();
  const { blogs: defaultBlogs, isLoading: isBlogsLoading, isError: isBlogsError} = useBlogs();
  const { categories, isLoading: isCategoriesLoading, isError: isCategoriesError, error: categoriesError } = useCategories();

  // State for search and category
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [displayedBlogs, setDisplayedBlogs] = useState<Blog[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isCategoryActive, setIsCategoryActive] = useState(false);

  // Fetch category blogs
  const { data: categoryBlogs, isLoading: isCategoryBlogsLoading } = useCategoryBlogs(activeCategoryId!);

  // Fetch search results
  const { data: searchResults, isLoading: isSearchLoading } = useSearchBlogs(searchQuery);

  // Authentication and error handling
  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    }
    if (isBlogsError) {
      toast.error("Error! Returning Back to Login", {
        autoClose: 1500,
        position: "bottom-right",
        transition: Flip,
      });
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, navigate, isBlogsError]);

  // Handle blog display logic
  useEffect(() => {
    if (isSearchActive && searchResults) {
      setDisplayedBlogs(searchResults);
      setIsCategoryActive(false);
      setActiveCategoryId(null);
    } else if (isCategoryActive && categoryBlogs) {
      setDisplayedBlogs(categoryBlogs);
      setIsSearchActive(false);
      setSearchQuery("");
    } else if (defaultBlogs) {
      setDisplayedBlogs(defaultBlogs);
    }
  }, [isSearchActive, isCategoryActive, searchResults, categoryBlogs, defaultBlogs]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearchActive(true);
      setIsCategoryActive(false);
      setActiveCategoryId(null);
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    setActiveCategoryId(categoryId);
    setIsCategoryActive(true);
    setIsSearchActive(false);
    setSearchQuery("");
  };

  const clearFilters = () => {
    setIsSearchActive(false);
    setIsCategoryActive(false);
    setSearchQuery("");
    setActiveCategoryId(null);
    setDisplayedBlogs(defaultBlogs || []);
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen py-10 px-4">
      <h2 className="text-4xl font-bold text-gray-800">Blogifyy</h2>

      <div className="flex gap-4 mt-6">
        <Button onClick={() => navigate({ to: "/newblog" })}>Create New Blog</Button>
        <Button onClick={() => navigate({ to: "/my-blog" })} variant="outline">
          My Blogs
        </Button>
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
        <Button onClick={handleSearch}>Search</Button>
        {(isSearchActive || isCategoryActive) && (
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        )}
      </div>

      <div className="w-full max-w-3xl mt-6 flex flex-wrap justify-center gap-3">
        {isCategoriesLoading ? (
          <p>Loading categories...</p>
        ) : isCategoriesError ? (
          <p className="text-red-500">Error: {categoriesError?.message}</p>
        ) : (
          categories?.map((category : BlogCategory) => (
            <Button
              key={category.category_id}
              variant={activeCategoryId === category.category_id ? "default" : "outline"}
              onClick={() => handleCategoryClick(category.category_id)}
              className="flex-auto items-center px-4 py-2 rounded-full"
            >
              {category.name}
            </Button>
          ))
        )}
      </div>

      <div className="w-full max-w-5xl mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isBlogsLoading || isSearchLoading || isCategoryBlogsLoading ? (
          <p>Loading blogs...</p>
        ) : displayedBlogs?.length > 0 ? (
          displayedBlogs.map((blog: Blog) => (
            <div key={blog.blog_id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
              <h3 className="text-xl font-semibold">{blog.title}</h3>
              <p className="text-gray-600 mt-2">{blog.content.slice(0, 30)}...</p>
              <Link
                to="/blogs/$blogid"
                params={{ blogid: String(blog.blog_id) }}
                state={{ author: String(blog.user_id) } as any}
                className="text-blue-800 hover:text-blue-200"
              >
                Read
              </Link>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No blogs found</p>
        )}
      </div>
    </div>
  );
}
