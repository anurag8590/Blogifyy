import { createClient } from 'pexels';

const apiKey = String(import.meta.env.VITE_SECRET_KEY);

const client = createClient(apiKey);

export const fetchPexelImage = async (query: string) => {
    try {
        const pexel_data = await client.photos.search({ query });

        if ("photos" in pexel_data && Array.isArray(pexel_data.photos) && pexel_data.photos.length > 0) {
            return pexel_data.photos[0].src.large;
        } else {
            console.error("No photos found in response:", pexel_data);
            return null;
        }
    } catch (error) {
        console.error("Error fetching images:", error);
        return null;
    }
  };