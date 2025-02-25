import {api} from "./auth.service";

export const createContact = async (contactData: { 
  name: string; 
  email: string; 
  subject: string; 
  message: string; 
}) => {
  const response = await api.post("/contact/", contactData);
  return response.data;
};