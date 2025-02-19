import api from "@/services/auth";



// Category Endpoints
export const createCategory = async (categoryData: { name: string; description?: string }) => {
const response = await api.post("/categories", categoryData);
return response.data;
};

export const getCategories = async () => {
const response = await api.get("/categories");
return response.data;
};

export const getCategoryById = async (categoryId: number) => {
const response = await api.get(`/categories/${categoryId}`);
return response.data;
};

export const updateCategory = async (categoryId: number, updatedData: { name?: string; description?: string }) => {
const response = await api.put(`/categories/${categoryId}`, updatedData);
return response.data;
};