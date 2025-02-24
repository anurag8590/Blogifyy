import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface RTEProps {
  initialContent?: string;
  onChange?: (content: string) => void;
  disabled?: boolean;
}

export default function RichTextEditor({
  initialContent = "",
  onChange,
  disabled = false,
}: RTEProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillInstance = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current && !quillInstance.current) {
      quillInstance.current = new Quill(editorRef.current, {
        theme: "snow",
        readOnly: disabled,
        modules: {
          toolbar: disabled
            ? false
            : [
                ["bold", "italic", "underline", "strike"],
                [{ header: 1 }, { header: 2 }],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ script: "sub" }, { script: "super" }],
                [{ indent: "-1" }, { indent: "+1" }],
                [{ color: [] }, { background: [] }],
                [{ align: [] }],
                ["link", "image"],
                ["clean"],
              ],
        },
      });

      if (initialContent) {
        quillInstance.current.root.innerHTML = initialContent;
      }

      if (!disabled && onChange) {
        quillInstance.current.on("text-change", () => {
          onChange(quillInstance.current!.root.innerHTML);
        });
      }
    }
  }, [initialContent, disabled, onChange]);

  return (
    <div className="relative">
      <style>
      {`
          .ql-container {
            font-family: ui-sans-serif, system, -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 1.125rem;
            border: none !important;
          }

          .ql-toolbar {
            border: none !important;
            border-bottom: 1px solid #e5e7eb !important;
            padding: 12px 0 !important;
            position: sticky;
            top: 0;
            background: white;
            z-index: 10;
          }

          .ql-toolbar button {
            width: 32px;
            height: 32px;
            margin: 0 2px;
            border-radius: 6px;
            transition: all 0.2s;
          }

          .ql-toolbar button:hover {
            background-color: #f3f4f6;
          }

          .ql-toolbar button.ql-active {
            background-color: #f3f4f6;
          }

          .ql-toolbar .ql-stroke {
            stroke: #4b5563;
          }

          .ql-toolbar .ql-fill {
            fill: #4b5563;
          }

          .ql-toolbar button:hover .ql-stroke {
            stroke: #1f2937;
          }

          .ql-toolbar button:hover .ql-fill {
            fill: #1f2937;
          }

          .ql-editor {
            min-height: 500px;
            padding: 24px 0;
            font-size: 1.125rem;
            line-height: 1.75;
          }

          .ql-editor p {
            margin-bottom: 1.5em;
          }

          .ql-editor h1 {
            font-size: 2.5em;
            margin-bottom: 1em;
          }

          .ql-editor h2 {
            font-size: 2em;
            margin-bottom: 0.75em;
          }

          .ql-editor h3 {
            font-size: 1.5em;
            margin-bottom: 0.75em;
          }

          
        `}
      </style>
      <div
        ref={editorRef}
       
        data-testid="quill-editor"
        className="min-h-[500px] w-full focus:outline-none"
      />
    </div>
  );
}