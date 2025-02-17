import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="w-screen h-screen flex flex-col items-center p-6 bg-gray-100">
      {/* App Name */}
      <h2 className="text-4xl font-bold text-gray-800 mt-10">Blogifyy</h2>

      {/* Search Bar */}
      <div className="w-3/4 mt-6">
        <Input placeholder="Search blogs..." className="w-full p-3 text-lg border rounded-md shadow-sm" />
      </div>

      {/* Tags Section */}
      <div className="w-1/2 mt-6 flex flex-wrap justify-center gap-2">
        {["Technology", "Health", "Finance", "Education", "Travel", "Food"].map((tag) => (
          <Button key={tag} variant="outline" className="px-4 py-2 rounded-full">
            {tag}
          </Button>
        ))}
      </div>

      {/* Blog Cards */}
      <div className="w-3/4 mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((blog) => (
          <div key={blog} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold">Blog Title {blog}</h3>
            <p className="text-gray-600 mt-2">Short description of the blog post...</p>
            <Button variant="link" className="mt-3 text-blue-600">Read More</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
