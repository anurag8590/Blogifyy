import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RichTextEditor from "@/components/editor/editor";

export default function BlogEditorPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("This is initial content :)");
  const [editingMode, setEditingMode] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

  useEffect(() => {
    setEditorKey((prevKey) => prevKey + 1);
  }, [editingMode]);

  const handlePublish = () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content cannot be empty");
      return;
    }
    toast.success("Blog published successfully!");
    setEditingMode(true);
  };

  return (
    <div className="w-screen h-screen flex flex-col p-6 gap-6 bg-gray-100">
      <div className="flex items-center gap-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter blog title"
          className="flex-1 text-2xl font-semibold border p-3 rounded-md shadow-sm"
          disabled={editingMode}
        />
        {editingMode ? (
          <Button onClick={() => setEditingMode(false)} className="bg-yellow-500 text-white px-4 py-2 rounded-md">
            Edit
          </Button>
        ) : (
          <Button onClick={() => setEditingMode(true)} className="bg-green-600 text-white px-4 py-2 rounded-md">
            Save
          </Button>
        )}
      </div>
      <div className="flex-1 bg-white border rounded-md p-4 shadow-md">
        <RichTextEditor key={editorKey} initialContent={content} onChange={setContent} disabled={editingMode} />
      </div>
      <Button onClick={handlePublish} className="w-full bg-blue-600 text-white py-3 rounded-md shadow-md">
        Publish
      </Button>
    </div>
  );
}
