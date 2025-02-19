import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
} from "@/api/comment";
import { BlogComment } from "@/interface/Comments";

export const useComments = (blogId: number) => {
  const queryClient = useQueryClient();

  const commentsQuery = useQuery<BlogComment[], Error>({
    queryKey: ["comments", blogId],
    queryFn: () => fetchComments(blogId),
  });

  const createMutation = useMutation({
    mutationFn: (newComment: { content: string; blog_id: number }) => createComment(newComment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", blogId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ commentId, updatedData }: { commentId: number; updatedData: { content?: string } }) =>
      updateComment(commentId, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", blogId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", blogId] });
    },
  });

  return {
    comments: commentsQuery.data ?? [],
    isLoading: commentsQuery.isLoading,
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
