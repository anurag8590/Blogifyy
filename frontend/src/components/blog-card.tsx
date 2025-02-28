import { useState, useEffect } from 'react';
import { HistoryState, Link } from '@tanstack/react-router';
import { fetchPexelImage } from './get-pexel-image';
import { Blog } from '@/interface/Blog';

interface BlogCardProps {
    blog: Blog;
    convertHtmlToText: (html: string) => string;
  }

interface CustomHistoryState extends HistoryState{
author? : number;
}

const BlogCard = ({ blog, convertHtmlToText }: BlogCardProps) => {
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

    return (
        <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div
            className="h-48 bg-cover bg-center relative"
            style={{ 
            backgroundImage: !isLoading ? `url(${imageUrl || '/florian-klauer-mk7D-4UCfmg-unsplash.jpg'})` : 'none'
            }}
        >
            {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            )}
        </div>
        <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">{blog.title}</h3>
            <p className="text-gray-600 line-clamp-3 mb-4">{convertHtmlToText(blog.content.slice(0,150))}</p>
            <Link
            to="/blogs/$blogid"
            params={{ blogid: String(blog.blog_id) }}
            state={{ author: Number(blog.user_id) } as CustomHistoryState}
            className="inline-flex items-center text-purple-600 hover:text-purple-800 font-medium gap-2 transition-colors"
            >
            Read More →
            </Link>
        </div>
        </div>
    );
    };


export default BlogCard;