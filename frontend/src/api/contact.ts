import api from "@/services/auth";

export const createContact = async (contactData: { 
  name: string; 
  email: string; 
  subject: string; 
  message: string; 
}) => {
  const response = await api.post("/contacts/", contactData);
  return response.data;
};

