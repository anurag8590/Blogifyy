import {Dialog,DialogContent,DialogDescription,DialogHeader,DialogTitle,DialogTrigger,DialogFooter} from "@/components/ui/dialog";
import { useCategories } from "@/hooks/use-category";
import { useEffect, useState } from "react";
import { BlogCategory, CategoryWithImage } from "@/interface/Category";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getPreviousPath } from "@/shared/prev-path-tracker";
import { ArrowLeft } from "lucide-react";
import { CategoryCard } from "@/components/category-card";
import { fetchPexelImage } from "@/components/get-pexel-image";
import { Flip, toast } from "react-toastify";

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
        toast.success("Comment added successfully", {
          autoClose: 1500,
          position: "bottom-right",
          transition: Flip,
        });
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCategory(prev => ({ ...prev, [name]: value }));
  };

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
                description={category.description || ''}
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