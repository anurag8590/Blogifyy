import { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';
import { PenSquare } from 'lucide-react';
import { Blog } from '@/interface/Blog';
import { fetchPexelImage } from './get-pexel-image';

interface MyBlogCardProps {
  blog: Blog;
  convertHtmlToText?: (html: string) => string;
}

const MyBlogCard = ({ blog, convertHtmlToText }: MyBlogCardProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      try {
        const url = await fetchPexelImage(blog.title);
        setImageUrl(url);
      } catch (error) {
        console.error("Error loading image:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadImage();
  }, [blog.title]);

  const getStatusColor = (isPublished: boolean) => {
    return isPublished 
      ? "bg-green-100 text-green-700" 
      : "bg-yellow-100 text-yellow-700";
  };

  const getStatusText = (isPublished: boolean) => {
    return isPublished ? "Published" : "Draft";
  };

  const formatContent = (content: string) => {
    if (convertHtmlToText) {
      return convertHtmlToText(content.slice(0, 150));
    }
    return content.slice(0, 150);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300">
      <div
        className="h-48 bg-cover bg-center relative"
        style={{ 
          backgroundImage: !isLoading 
            ? `url(${imageUrl || '/florian-klauer-mk7D-4UCfmg-unsplash.jpg'})` 
            : 'none'
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${getStatusColor(blog.is_published)}`}>
          {getStatusText(blog.is_published)}
        </span>
        
        <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
          {blog.title}
        </h3>
        
        <p className="text-gray-600 mb-6 line-clamp-3">
          {formatContent(blog.content)}
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
  );
};

export default MyBlogCard;