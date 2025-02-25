import { useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {
  getCategories,
  createCategory,
} from "@/services/category.service";

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

  return {
    categories,
    isLoading,
    isFetching,
    isError,
    error,
    createMutation
  };
};
