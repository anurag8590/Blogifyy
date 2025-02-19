import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  togglePublishBlog,
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
    enabled: user 
  });

  // const { data: categoryBlogs, isLoading: isCategoryBlogsLoading, isError: isCategoryBlogsError, error: categoryBlogsError } = useQuery({
  //   queryKey: ["categoryBlogs", catId],  // Include catId to refetch when it changes
  //   queryFn: () => getBlogsByCategoryId(catId!),  // Ensure it's called properly
  //   enabled: !!catId,  // Prevent running if catId is undefined
  // });

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

  const togglePublishMutation = useMutation({
    mutationFn: (blogId: number) => togglePublishBlog(blogId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });

  return {
    blogs,
    userBlogs,
    // categoryBlogs,
    // isCategoryBlogsLoading,
    // isCategoryBlogsError,
    // categoryBlogsError,
    isLoading,
    isUserBlogsLoading,
    isUserBlogsError,
    userBlogsError,
    isFetching,
    isError,
    error,
    createMutation,
    updateMutation,
    deleteMutation,
    togglePublishMutation,
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
