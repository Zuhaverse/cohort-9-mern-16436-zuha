import { useState } from "react";
import "./NoteForm.css";

function NoteForm({
  initialData = { title: "", content: "" },
  onSubmit,
  submitText = "Save Note",
  loading = false,
}) {
  const [title, setTitle] = useState(initialData.title || "");
  const [content, setContent] = useState(initialData.content || "");
  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required.";
    }

    if (!content.trim()) {
      newErrors.content = "Content is required.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    await onSubmit({
      title: title.trim(),
      content: content.trim(),
    });
  };

  return (
    <form className="note-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="title">Title</label>

        <input
          id="title"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Enter note title"
        />

        {errors.title && (
          <p className="field-error">{errors.title}</p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="content">Content</label>

        <textarea
          id="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="Write your note..."
          rows="10"
        />

        {errors.content && (
          <p className="field-error">{errors.content}</p>
        )}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : submitText}
      </button>
    </form>
  );
}

export default NoteForm;