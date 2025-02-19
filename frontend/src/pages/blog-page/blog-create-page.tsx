import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import RichTextEditor from "@/components/editor/editor";
import { Save, Edit, ArrowLeft } from "lucide-react";
import { useBlogs } from "@/hooks/use-blog";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BlogFormProps {
  view: boolean;
  blogId?: number;
  initialTitle?: string;
  initialContent?: string;
  initialIsPublished?: boolean;
  initialCategoryId?: number;
}

export default function BlogPage({
  view = false,
  blogId,
  initialTitle = "",
  initialContent = "Start writing your amazing story...",
  initialIsPublished = false,
  initialCategoryId = 1,
}: BlogFormProps) {
  const navigate = useNavigate();
  const isEditing = blogId !== undefined; // User is editing if a blogId exists

  const { createMutation, updateMutation } = useBlogs();

  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isPublished, setIsPublished] = useState(initialIsPublished);
  const [categoryId, setCategoryId] = useState(initialCategoryId);
  const [editingMode, setEditingMode] = useState(!view); // If view mode, start in read-only
  const [editorKey, setEditorKey] = useState(0);

  useEffect(() => {
    setEditorKey((prevKey) => prevKey + 1);
  }, [initialTitle, initialContent]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please provide both a title and content for your blog post");
      return;
    }

    const blogData = {
      title,
      content,
      is_published: isPublished,
      category_id: categoryId,
    };

    if (isEditing) {
      updateMutation.mutate(
        { blogId: Number(blogId), updatedData: blogData },
        {
          onSuccess: () => {
            toast.success("Blog post updated successfully!");
            setEditingMode(false); // Return to view mode after saving
            navigate({ to: `/my-blog` });
          },
        }
      );
    } else {
      createMutation.mutate(blogData, {
        onSuccess: () => {
          toast.success("Blog post created successfully!");
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
            {/* Show buttons only if NOT in view mode */}
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
                    onClick={() => setEditingMode(true)} // Enable editing
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-2 rounded-full"
                  >
                    <Edit className="w-4 h-4 mr-2" /> Edit
                  </Button>
                ) : (
                  <Button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-full"
                  >
                    <Save className="w-4 h-4 mr-2" /> Save
                  </Button>
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

            <Select
              value={String(categoryId)}
              onValueChange={(value) => setCategoryId(Number(value))}
              disabled={!editingMode}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="1">Humor</SelectItem>
                  <SelectItem value="2">Fiction</SelectItem>
                  <SelectItem value="3">Technology</SelectItem>
                  <SelectItem value="4">Anime</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 min-h-[600px]">
            <RichTextEditor
              key={editorKey}
              initialContent={content}
              onChange={setContent}
              disabled={!editingMode}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
