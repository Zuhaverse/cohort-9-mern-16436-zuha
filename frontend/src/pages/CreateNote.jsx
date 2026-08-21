import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NoteForm from "../components/NoteForm";
import { createNote } from "../services/noteService";
import { ArrowLeft } from "lucide-react";

import "./NotePage.css";

function CreateNote() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (noteData) => {
    try {
      setLoading(true);
      setError("");

      await createNote(noteData);

      navigate("/dashboard");
    } catch (error) {
      setError("Failed to create note. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="note-page">
      <div className="header">
        
          <button
            type="button"
            className="back-btn"
            onClick={() => navigate("/dashboard")}
            aria-label="Back to notes"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="title-row">
  
          <h1>Create Note</h1>
        
  
        <p>Write down your thoughts and ideas.</p>
      </div>
      </div>
  
      {error && <p className="form-error">{error}</p>}
  
      <NoteForm
        onSubmit={handleCreate}
        submitText="Create Note"
        loading={loading}
      />
    </div>
  );
}

export default CreateNote;