import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit2, Check, X } from "lucide-react";
import { useQuery} from "@tanstack/react-query";
import { fetchComments } from "@/services/comment.service";
import { useComments } from '@/hooks/use-comment';


interface CommentsProps {
  blogId: number;
  currentUserId: number;
  isBlogAuthor: boolean; 
}

const CommentComponent = ({ blogId, currentUserId, isBlogAuthor }: CommentsProps) => {
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState("");

  const {createCommentMutation, updateCommentMutation, deleteCommentMutation} = useComments(blogId)

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ["comments", blogId],
    queryFn: () => fetchComments(blogId),
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    createCommentMutation.mutate(
      { content: newComment, blog_id: blogId },
      {
        onSuccess: () => {
          setNewComment("");
        },
      }
    );
  };

  const handleStartEdit = (commentId: number, content: string) => {
    setEditingCommentId(commentId);
    setEditedContent(content);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedContent("");
  };

  const handleUpdateComment = (commentId: number) => {
    if (!editedContent.trim()) return;

    updateCommentMutation.mutate(
      { commentId, updatedData: { content: editedContent } },
      {
        onSuccess: () => {
          setEditingCommentId(null);
          setEditedContent("");
        },
      }
    );
  };

  const handleDeleteComment = (commentId: number) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  const canManageComment = (commentUserId: number) => {
    return currentUserId === commentUserId;
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading comments...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Comments</h2>

        {isBlogAuthor && comments.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (window.confirm("Are you sure you want to delete all comments? This action cannot be undone.")) {
                comments.forEach(comment => deleteCommentMutation.mutate(comment.comment_id));
              }
            }}
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete All Comments
          </Button>
        )}
      </div>
      
      <form onSubmit={handleSubmitComment} className="flex gap-2">
        <Input
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1"
        />
        <Button 
          type="submit" 
          disabled={!newComment.trim() || createCommentMutation.isPending}
        >
          Post
        </Button>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.comment_id} className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {editingCommentId === comment.comment_id ? (
                  <div className="space-y-2">
                    <Input
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleUpdateComment(comment.comment_id)}
                        className="flex items-center gap-1"
                        disabled={updateCommentMutation.isPending}
                      >
                        <Check className="w-4 h-4" /> Save
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCancelEdit}
                        className="flex items-center gap-1"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700">{comment.content}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  Posted by User #{comment.user_id} • {new Date(comment.created_at).toLocaleDateString()}
                </p>
              </div>

              {(canManageComment(comment.user_id) || isBlogAuthor) && (
                <div className="flex gap-2 ml-4">
                  {canManageComment(comment.user_id) && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleStartEdit(comment.comment_id, comment.content)}
                      className="text-blue-600 hover:text-blue-700"
                      disabled={editingCommentId !== null}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteComment(comment.comment_id)}
                    className="text-red-600 hover:text-red-700"
                    disabled={deleteCommentMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentComponent;