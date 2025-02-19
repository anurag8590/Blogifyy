import api from "@/services/auth";


export const createComment = async (commentData: { content: string; blog_id: number }) => {
    const response = await api.post("/comments", commentData);
    return response.data;
  };
  
export const getCommentById = async (commentId: number) => {
const response = await api.get(`/comments/${commentId}`);
return response.data;
};

export const updateComment = async (commentId: number, updatedData: { content?: string }) => {
const response = await api.put(`/comments/${commentId}`, updatedData);
return response.data;
};

export const deleteComment = async (commentId: number) => {
await api.delete(`/comments/${commentId}`);
};
