import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Flip, toast } from "react-toastify";
import RichTextEditor from "@/components/editor/editor";
import { Save, Edit, ArrowLeft, Trash } from "lucide-react";
import { useBlogs } from "@/hooks/use-blog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CommentComponent from "../comment/comment";
import { useCategories } from "@/hooks/use-category";
import { BlogCategory } from "@/interface/Category";

interface BlogFormProps {
  view: boolean;
  blogId?: number;
  author?: number;
  initialTitle?: string;
  initialContent?: string;
  initialIsPublished?: boolean;
  initialCategoryId?: number;
}

export default function BlogCreatePage({
  view = false,
  blogId,
  author,
  initialTitle = "",
  initialContent = "Start writing your amazing story...",
  initialIsPublished = false,
  initialCategoryId = 1,
}: BlogFormProps) {
  const navigate = useNavigate();
  const isEditing = blogId !== undefined;

  const { createMutation, updateMutation, deleteMutation } = useBlogs(); 
  const { categories } = useCategories();

  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isPublished, setIsPublished] = useState(initialIsPublished);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [editingMode, setEditingMode] = useState(!view);
  const [editorKey, setEditorKey] = useState(0);

  // reset all form states when initial values change
  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
    setCategoryId(initialCategoryId);
  }, [initialTitle, initialContent, initialCategoryId]);

  // handle is_published when switching from editing to not editing and vice versa
  useEffect(() => {
    if (!isEditing) {
      setIsPublished(initialIsPublished); 
    }
  }, [blogId]);

  useEffect(() => {
    setEditorKey((prevKey) => prevKey + 1);
  }, [initialTitle, initialContent]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please provide both a title and content for your blog post");
      return;
    }

    let trimmed_content = content.replace(/<\/?p[^>]*>/g, '').replace(/<br\s*\/?>/g, '\n');
    console.log(trimmed_content);

    const blogData = {
      title,
      content: trimmed_content,
      is_published: isPublished,
      category_id: categoryId,
    };

    if (isEditing) {
      console.log(blogData);
      updateMutation.mutate(
        { blogId: Number(blogId), updatedData: blogData },
        {
          onSuccess: () => {
            toast.success("Blog post updated successfully!", {
              autoClose: 2000,
              position: "bottom-right",
              transition: Flip,
            });
            setEditingMode(false);
            navigate({ to: `/homepage` });
          },
        }
      );
    } else {
      createMutation.mutate(blogData, {
        onSuccess: () => {
          toast.success("Blog post created successfully!", {
            autoClose: 2000,
            position: "bottom-right",
            transition: Flip,
          });
          navigate({ to: "/homepage" });
        },
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      deleteMutation.mutate(Number(blogId), {
        onSuccess: () => {
          toast.success("Blog post deleted successfully!", {
            autoClose: 2000,
            position: "bottom-right",
            transition: Flip,
          });
          navigate({ to: "/homepage" });
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate({ to: "/homepage" })}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">
              {isEditing
                ? editingMode
                  ? "Edit Blog Post"
                  : "View Blog Post"
                : "Create New Blog Post"}
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {!view && (
              <div className="flex justify-between items-center mb-4">
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: "/homepage" })}
                  className="px-6 py-2"
                >
                  Cancel
                </Button>

                {isEditing && !editingMode ? (
                  <Button
                    onClick={() => setEditingMode(true)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-2 rounded-full"
                  >
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </Button>
                ) : (
                  <div className="flex gap-4">
                    {isEditing && (
                      <Button
                        onClick={handleDelete}
                        className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-full"
                      >
                        <Trash className="w-4 h-4 mr-2" /> Delete
                      </Button>
                    )}
                    <Button
                      onClick={handleSave}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-full"
                    >
                      <Save className="w-4 h-4 mr-2" /> Save
                    </Button>
                  </div>
                )}
              </div>
            )}

            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your captivating title..."
              className="flex-1 text-3xl font-bold border-none focus:ring-2 focus:ring-blue-500"
              disabled={!editingMode}
            />

            <div className="flex items-center gap-8 mt-4 mb-4">
              <Select
                value={String(categoryId)}
                onValueChange={(value) => setCategoryId(Number(value))}
                disabled={!editingMode}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-100">
                  <SelectGroup>
                    {categories?.map((category: BlogCategory) => (
                      <SelectItem key={category.category_id} value={String(category.category_id)}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => {
                    setIsPublished((prev) => !prev);
                    console.log("Updated isPublished:", !isPublished);
                  }}
                  disabled={!editingMode}
                  className={`px-4 py-2 rounded-md ${
                    isPublished ? "bg-green-500 text-white" : "bg-gray-300 text-black"
                  }`}
                >
                  {isPublished ? "Published" : "Unpublished"}
                </Button>
                <label
                  htmlFor="publish"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {isPublished ? "Published" : "Unpublished"}
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 min-h-[600px]">
            <RichTextEditor
              key={editorKey}
              initialContent={content}
              onChange={setContent}
              disabled={!editingMode}
            />
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            {blogId && (
              <CommentComponent
                blogId={blogId}
                currentUserId={Number(localStorage.getItem("user_id"))}
                isBlogAuthor={author === Number(localStorage.getItem("user_id"))}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}