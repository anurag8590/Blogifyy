import {  useMutation, useQueryClient } from "@tanstack/react-query";
import { createContact} from "@/services/contact.service";

export const useContact = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (contactData: { name: string; email: string; subject: string; message: string }) => 
      createContact(contactData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
    },
  });

  return {
    createMutation,
  };
};
