import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogsByUserId, 
  getBlogsByCategoryId, 
  searchBlogs}
  from "@/api/blog";

import { Blog } from "@/interface/Blog";
import { isAuthenticated } from "@/services/auth";

export const useBlogs = () => {
  const queryClient = useQueryClient();
  const user = isAuthenticated();

  const { data: blogs, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["blogs"],
    queryFn: getBlogs,
  });

  const { data: userBlogs, isLoading: isUserBlogsLoading, isError: isUserBlogsError, error: userBlogsError} = useQuery({
    queryKey: ["userBlogs", localStorage.getItem("user_id")],
    queryFn: () => getBlogsByUserId(Number(localStorage.getItem("user_id"))),
    enabled: user,
    retry: false
  });

  const createMutation = useMutation({
    mutationFn: (newBlog: Partial<Blog>) => createBlog(newBlog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ blogId, updatedData }: { blogId: number; updatedData: Partial<Blog> }) =>
      updateBlog(blogId, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (blogId: number) => deleteBlog(blogId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });

  return {
    blogs,
    userBlogs,
    isLoading,
    isUserBlogsLoading,
    isUserBlogsError,
    userBlogsError,
    isFetching,
    isError,
    error,
    createMutation,
    updateMutation,
    deleteMutation
  };
};

export const useCategoryBlogs = (catId?: number) => {
  return useQuery({
    queryKey: ["categoryBlogs", catId],
    queryFn: () => getBlogsByCategoryId(catId!),
    enabled: !!catId,
  });
};

export const useSearchBlogs = (query?: string) => {
  return useQuery({
    queryKey: ["searchBlogs", query],
    queryFn: () => searchBlogs(query!),
    enabled: !!query,
  });
};