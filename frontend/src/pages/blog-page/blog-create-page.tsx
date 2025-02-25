import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Flip, toast } from "react-toastify";
import RichTextEditor from "@/components/editor/editor";
import { Save, Edit, ArrowLeft, Trash, BookOpen, Eye, EyeOff } from "lucide-react";
import { useBlogs } from "@/hooks/use-blog";
import {Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import CommentComponent from "../comment/comment";
import { useCategories } from "@/hooks/use-category";
import { BlogCategory } from "@/interface/Category";
import { isAuthenticated } from "@/services/auth";
import { getPreviousPath } from "@/shared/prev-path-tracker";

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

  const isEditing = blogId !== undefined;

  const navigate = useNavigate();
  const { createMutation, updateMutation, deleteMutation } = useBlogs();
  const { categories } = useCategories();
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isPublished, setIsPublished] = useState(initialIsPublished);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [editingMode, setEditingMode] = useState(!view);
  const [editorKey, setEditorKey] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
    setCategoryId(initialCategoryId);
  }, [initialTitle, initialContent, initialCategoryId]);

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

    const blogData = {
      title,
      content: trimmed_content,
      is_published: isPublished,
      category_id: categoryId,
    };

    if (isEditing) {
      updateMutation.mutate(
        { blogId: Number(blogId), updatedData: blogData },
        {
          onSuccess: () => {
            toast.success("Blog post updated successfully!", {
              autoClose: 1500,
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
            autoClose: 1500,
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
            autoClose: 1500,
            position: "bottom-right",
            transition: Flip,
          });
          navigate({ to: "/my-blog" });
        },
      });
    }
  };

  const handleGoBack = () => {
    const previousPath = getPreviousPath();
    if (previousPath) {
      navigate({to : previousPath});
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 to-white">

      <div className="bg-gradient-to-r from-cyan-600 to-purple-900 text-white py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleGoBack}
                className="text-white hover:text-purple-950 hover:bg-white rounded-full p-2 sm:p-3"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
              <h1 className="text-xl sm:text-2xl font-bold">
                {isEditing
                  ? editingMode
                    ? "Edit Story"
                    : "View Story"
                  : "Write a New Story"}
              </h1>
            </div>
            {!view && (
              <div className="flex gap-2 sm:gap-3 w-full sm:w-auto justify-end">
                {isEditing && !editingMode ? (
                  <Button
                    onClick={() => setEditingMode(true)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 sm:px-6 rounded-full flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" /> 
                    <span className="hidden sm:inline">Edit</span>
                  </Button>
                ) : (
                  <div className="flex gap-2 sm:gap-3">
                    {isEditing && (
                      <Button
                        onClick={handleDelete}
                        variant="outline"
                        className="border-red-300 text-red-100 hover:bg-red-500 hover:text-white rounded-full flex items-center gap-2"
                      >
                        <Trash className="w-4 h-4" />
                        <span className="hidden sm:inline">Delete</span>
                      </Button>
                    )}
                    <Button
                      onClick={handleSave}
                      className="bg-white text-purple-700 hover:bg-purple-50 rounded-full flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span className="hidden sm:inline">
                        {isEditing ? "Update" : "Publish"}
                      </span>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
        <div className="space-y-4 sm:space-y-6">

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-8">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your story title..."
              className="text-2xl sm:text-4xl font-bold border-none focus:ring-2 focus:ring-purple-500 mb-4 sm:mb-6 placeholder-gray-300"
              disabled={!editingMode}
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <Select
                value={String(categoryId)}
                onValueChange={(value) => setCategoryId(Number(value))}
                disabled={!editingMode}
              >
                <SelectTrigger className="w-full sm:w-64 border-purple-200 focus:ring-purple-500">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectGroup>
                    {categories?.map((category: BlogCategory) => (
                      <SelectItem key={category.category_id} value={String(category.category_id)}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full w-full sm:w-auto justify-center sm:justify-start">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsPublished(!isPublished)}
                  disabled={!editingMode}
                  className={`rounded-full flex items-center gap-2 ${
                    isPublished 
                      ? 'text-green-600 hover:text-green-700'
                      : 'text-gray-600 hover:text-gray-700'
                  }`}
                >
                  {isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  {isPublished ? "Live" : "Draft"}
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-8 min-h-[400px] sm:min-h-[600px]">
            <RichTextEditor
              key={editorKey}
              initialContent={content}
              onChange={setContent}
              disabled={!editingMode}
            />
          </div>

          {blogId && (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm p-4 sm:p-8">
              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                <h2 className="text-lg sm:text-xl font-semibold">Comments</h2>
              </div>
              <CommentComponent
                blogId={blogId}
                currentUserId={Number(localStorage.getItem("user_id"))}
                isBlogAuthor={author === Number(localStorage.getItem("user_id"))}
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}