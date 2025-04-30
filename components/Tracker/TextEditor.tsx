import dynamic from "next/dynamic";
import React from "react";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function TextEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div data-color-mode="dark" className="">
      <MDEditor
        value={value}
        // onChange={onChange}
        height={200}
        preview="edit"
        textareaProps={{
          placeholder: "Write your journal in **Markdown**..."
        }}
      />
    </div>
  );
}
