import React from "react";
import ReactQuill from "react-quill";
import Quill from "quill";
import "react-quill/dist/quill.snow.css";
var Block = Quill.import("blots/block");

Block.tagName = "DIV";
Quill.register(Block, true);

const toolbar = [
  [{ header: [1, 2, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ list: "ordered" }, { list: "bullet" }],
  ["link", "image", "video"],
  ["clean"],
];
export default function TextEditor({ value, setValue }) {
  return (
    <div className="text-editor">
      <ReactQuill
        modules={{ toolbar }}
        value={value}
        onChange={setValue}
      ></ReactQuill>
    </div>
  );
}
