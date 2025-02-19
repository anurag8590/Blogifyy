import api from "@/services/auth";
import { Blog } from "@/interface/Blog";

// Create a new blog
export const createBlog = async (blogData: Partial<Blog>) => {
    const response = await api.post("/blogs/", blogData);
    return response.data;
  };
  
  // Get all blogs
  export const getBlogs = async () => {
    const response = await api.get("/blogs/");
    return response.data;
  };
  
  // Get a single blog by ID
  export const getBlogById = async (blogId: number) => {
    const response = await api.get(`/blogs/${blogId}/?get_type=BLOG`);
    return response.data;
  };
  
  // Update a blog
  export const updateBlog = async (blogId: number, updatedData: Partial<Blog>) => {
    const response = await api.put(`/blogs/${blogId}`, updatedData);
    return response.data;
  };
  
  // Delete a blog
  export const deleteBlog = async (blogId: number) => {
    await api.delete(`/blogs/${blogId}`);
  };
  
  // Toggle publish status of a blog
  export const togglePublishBlog = async (blogId: number) => {
    const response = await api.put(`/${blogId}/toggle-publish`);
    return response.data;
  };

  // export const getBlogbyUserId = async (id : number) =>{
  //   const response = await api.get(`/blogs/${id}`)
  //   return response.data
  // }

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

  export const searchBlogs = async (query: string) => {
    if (!query) throw new Error("Search query is required");
    const response = await api.get(`/search/blogs?q=${encodeURIComponent(query)}`);
    return response.data;
  };  