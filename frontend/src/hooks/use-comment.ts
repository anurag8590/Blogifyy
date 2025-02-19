import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
} from "@/api/comment";

export const useComments = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (newComment: { content: string; blog_id: number }) => createComment(newComment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] }); // Refresh blogs to show new comments
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ commentId, updatedData }: { commentId: number; updatedData: { content?: string } }) =>
      updateComment(commentId, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
};
