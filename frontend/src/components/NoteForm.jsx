import { useState } from "react";
import "./NoteForm.css";
import RichTextEditor from "./RichTextEditor";

function NoteForm({
  initialData = { title: "", content: "" },
  onSubmit,
  submitText = "Save Note",
  loading = false,
}) {
  const [title, setTitle] = useState(initialData.title || "");
  const [content, setContent] = useState(initialData.content || "");
  const [errors, setErrors] = useState({});
  const plainTextContent =
    new DOMParser().parseFromString(content, "text/html").body.textContent?.trim() ||
    "";

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required.";
    }

    if (!plainTextContent) {
      newErrors.content = "Content is required.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      await onSubmit({
        title: title.trim(),
        content: content.trim(),
      });
    } catch (error) {
      console.error("Form submission error:", error);
  
      setErrors({
        form: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <form className="note-form" onSubmit={handleSubmit}>
    {errors.form && (
      <p className="form-error" role="alert">
        {errors.form}
      </p>
    )}
  
    <div className="form-group">
      <label htmlFor="title">Title</label>
  
      <input
        id="title"
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Enter note title"
        aria-invalid={!!errors.title}
        aria-describedby={errors.title ? "title-error" : undefined}
        className={errors.title ? "input-error" : ""}
      />
  
      {errors.title && (
        <p id="title-error" className="field-error">
          {errors.title}
        </p>
      )}
    </div>
      <div className="form-group">
      <label id="content-label" htmlFor="content">
  Content
</label>

      <RichTextEditor
  value={content}
  onChange={setContent}
  placeholder="Write your note..."
  rows={10}
  id="content"
  ariaLabelledby="content-label"
  ariaInvalid={!!errors.content}
  ariaDescribedby={
    errors.content ? "content-error" : undefined
  }
  className={errors.content ? "input-error" : ""}
/>

{errors.content && (
  <p id="content-error" className="field-error">
    {errors.content}
  </p>
)}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : submitText}
      </button>
    </form>
  );
}

export default NoteForm;