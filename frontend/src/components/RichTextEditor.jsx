import { useEffect, useRef } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./RichTextEditor.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote"],
    [{ color: [] }, { align: [] }],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "blockquote",
  "color",
  "align",
];

function RichTextEditor({
  value,
  onChange,
  placeholder,
  id,
  ariaLabelledby,
  ariaInvalid,
  ariaDescribedby,
  rows,
  className,
}) {
  const quillRef = useRef(null);

  useEffect(() => {
    const editor = quillRef.current?.getEditor()?.root;

    if (!editor) return;

    if (id) {
      editor.id = id;
    }

    if (ariaLabelledby) {
      editor.setAttribute("aria-labelledby", ariaLabelledby);
    }

    if (ariaInvalid !== undefined) {
      editor.setAttribute("aria-invalid", String(ariaInvalid));
    }

    if (ariaDescribedby) {
      editor.setAttribute("aria-describedby", ariaDescribedby);
    } else {
      editor.removeAttribute("aria-describedby");
    }

    if (rows) {
      editor.style.minHeight = `${rows * 20}px`;
    }
  }, [id, ariaLabelledby, ariaInvalid, ariaDescribedby, rows]);

  return (
    <div className={`rich-text-editor ${className || ""}`}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        modules={modules}
        formats={formats}
      />
    </div>
  );
}

export default RichTextEditor;