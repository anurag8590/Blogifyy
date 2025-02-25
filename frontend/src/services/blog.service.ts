import {api} from "./auth.service";
import { Blog } from "@/interface/Blog";

export const createBlog = async (blogData: Partial<Blog>) => {
    const response = await api.post("/blogs/", blogData);
    return response.data;
  };
  
export const getBlogs = async () => {
  try {
    const response = await api.get("/blogs/");
    return response.data;
  } catch (err) {
    console.error("Failed to fetch blogs:", err);
    throw new Error("An error occurred while fetching blogs. Please try again later.");
  }
};

export const getBlogById = async (blogId: number) => {
  if (!blogId) throw new Error("Blog ID is not present");
  const response = await api.get(`/blogs/${blogId}/?get_type=BLOG`);
  return response.data;
};

export const getBlogsByUserId = async (userId?: number) => {
  if (!userId) throw new Error("User ID is not present");
  const response = await api.get(`/blogs/${userId}/?get_type=USER`);
  return response.data;
};

export const getBlogsByCategoryId = async (catId?: number) => {
  if (!catId) throw new Error("Category ID is not present");
  const response = await api.get(`/blogs/${catId}/?get_type=CATG`);
  return response.data;
};

export const updateBlog = async (blogId: number, updatedData: Partial<Blog>) => {
  const response = await api.put(`/blogs/${blogId}`, updatedData);
  return response.data;
};

export const deleteBlog = async (blogId: number) => {
  await api.delete(`/blogs/${blogId}`);
};

export const searchBlogs = async (query: string) => {
  if (!query) throw new Error("Search query is required");
  const response = await api.get(`/search/blogs?q=${encodeURIComponent(query)}`);
  return response.data;
};  