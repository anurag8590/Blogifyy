import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCategories,
  createCategory,
  updateCategory,
} from "@/api/category";

export const useCategories = () => {
  const queryClient = useQueryClient();

  const { data: categories, isLoading, isError, error, isFetching } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const createMutation = useMutation({
    mutationFn: (newCategory: { name: string; description?: string }) => createCategory(newCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ categoryId, updatedData }: { categoryId: number; updatedData: { name?: string; description?: string } }) =>
      updateCategory(categoryId, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    categories,
    isLoading,
    isFetching,
    isError,
    error,
    createMutation,
    updateMutation,
  };
};
