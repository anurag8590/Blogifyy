import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
} from "@/services/comment.service";
import { BlogComment } from "@/interface/Comments";
import { Flip, toast } from 'react-toastify';

export const useComments = (blogId: number) => {
  const queryClient = useQueryClient();

  const commentsQuery = useQuery<BlogComment[], Error>({
    queryKey: ["comments", blogId],
    queryFn: () => fetchComments(blogId),
  });

    const createCommentMutation = useMutation({
      mutationFn: (newComment: { content: string; blog_id: number }) =>
        createComment(newComment),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["comments", blogId] });
        toast.success("Comment added successfully", {
          autoClose: 1500,
          position: "bottom-right",
          transition: Flip,
        });
      },
      onError: () => {
        toast.error("Failed to add comment", {
          autoClose: 1500,
          position: "bottom-right",
          transition: Flip,
        });
      },
    });
  
    const updateCommentMutation = useMutation({
      mutationFn: ({ commentId, updatedData }: { commentId: number; updatedData: { content: string } }) =>
        updateComment(commentId, updatedData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["comments", blogId] });
        toast.success("Comment updated successfully", {
          autoClose: 1500,
          position: "bottom-right",
          transition: Flip,
        });
      },
      onError: () => {
        toast.error("Failed to update comment", {
          autoClose: 1500,
          position: "bottom-right",
          transition: Flip,
        });
      },
    });
  
    const deleteCommentMutation = useMutation({
      mutationFn: (commentId: number) => deleteComment(commentId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["comments", blogId] });
        toast.success("Comment deleted successfully", {
          autoClose: 1500,
          position: "bottom-right",
          transition: Flip,
        });
      },
      onError: () => {
        toast.error("Failed to deleted comment", {
          autoClose: 1500,
          position: "bottom-right",
          transition: Flip,
        });
      },
    });

  return {
    comments: commentsQuery.data ?? [],
    isLoading: commentsQuery.isLoading,
    createCommentMutation,
    updateCommentMutation,
    deleteCommentMutation,
  };
};
