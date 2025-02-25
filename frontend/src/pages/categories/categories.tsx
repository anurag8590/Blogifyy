import { useCategories } from "@/hooks/use-category";
import { useEffect, useState } from "react";
import { createClient } from 'pexels';
import { BlogCategory } from "@/interface/Category";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getPreviousPath } from "@/shared/prev-path-tracker";
import { ArrowLeft } from "lucide-react";


const apiKey = String(import.meta.env.VITE_SECRET_KEY);
const client = createClient(apiKey);

const CategoryCard = ({ category_id, name, description, imageUrl }: { category_id: number, name: string, description: string, imageUrl: string }) => (
  <Link
    to="/blogs/category/$catid"
    params={{ catid: String(category_id) }}
    className="block group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-purple-100"
  >
    <div className="relative h-56 overflow-hidden">
      <img 
        src={imageUrl}
        alt={name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0" />
      <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white tracking-wide">{name}</h3>
    </div>
    <div className="p-6">
      <p className="text-gray-600 line-clamp-3 text-sm leading-relaxed">{description}</p>
      <div className="mt-6 flex items-center text-purple-600 font-semibold group-hover:text-purple-700 transition-colors duration-300">
        Explore {name}
        <svg 
          className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-2" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  </Link>
);

const CategoriesPage = () => {
  const { categories, isLoading, isError, createMutation } = useCategories();
  const [categoriesWithImages, setCategoriesWithImages] = useState<CategoryWithImage[]>([]);
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreateCategory = () => {
    createMutation.mutate(newCategory, {
      onSuccess: () => {
        setNewCategory({ name: "", description: "" });
        setIsDialogOpen(false);
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({ ...prev, [name]: value }));
  };

  const fetchPexelImage = async (query: string) => {
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

  interface CategoryWithImage {
    category_id: number;
    name: string;
    description: string;
    imageUrl: string;
  }

  useEffect(() => {
    const addImages = async () => {
      if (categories) {
        const withImages: CategoryWithImage[] = await Promise.all(
          categories.map(async (category: BlogCategory) => ({
            ...category,
            imageUrl: await fetchPexelImage(category.name) || '/florian-klauer-mk7D-4UCfmg-unsplash.jpg'
          }))
        );
        setCategoriesWithImages(withImages);
      }
    };

    addImages();
  }, [categories]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
        <div className="text-purple-600 text-xl font-medium">Loading categories...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center">
        <div className="text-red-600 text-xl font-medium">Error loading categories</div>
      </div>
    );
  }

  const handleGoBack = () => {
      const previousPath = getPreviousPath();
      if (previousPath) {
        navigate({to : previousPath});
      }
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <div className="max-w-7xl mx-auto px-0 py-0">
        <div className="text-center mb-16 ">
          <div className="bg-gradient-to-r from-cyan-600 to-purple-900 text-white py-8 px-4 mb-10">
            <h1 className="text-5xl font-bold text-white mb-5">
              Explore Categories
            </h1>
            <p className="text-lg text-white max-w-2xl mx-auto leading-relaxed pt-3">
              Discover content across different topics and genres. Each category offers unique perspectives and engaging discussions.
            </p>
          <Button
                onClick={handleGoBack}
                className="text-white hover:text-purple-950 hover:bg-white rounded-full mt-4 drop-shadow-2xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span>Back</span>
          </Button>
          <div className="flex px-6">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="text-white hover:text-purple-950 hover:bg-white rounded-full p-2 sm:p-3 shadow-lg">
                  Create New Category
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                  <DialogTitle>Create New Category</DialogTitle>
                  <DialogDescription>
                    Add a new category to organize your blog content.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Category Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={newCategory.name}
                      onChange={handleInputChange}
                      placeholder="Enter category name"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newCategory.description}
                      onChange={handleInputChange}
                      placeholder="Enter category description"
                      rows={4}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    onClick={handleCreateCategory}
                    disabled={!newCategory.name || createMutation.isPending}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {createMutation.isPending ? "Creating..." : "Create Category"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6 pb-8">
            {categoriesWithImages.map((category) => (
              <CategoryCard
                category_id={category.category_id}
                key={category.name}
                name={category.name}
                description={category.description}
                imageUrl={category.imageUrl}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;