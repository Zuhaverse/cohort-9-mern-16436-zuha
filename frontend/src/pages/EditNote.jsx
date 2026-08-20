import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NoteForm from "../components/NoteForm";
import { getNote, updateNote } from "../services/noteService";
import { ArrowLeft } from "lucide-react";

import "./NotePage.css"

function EditNote() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const response = await getNote(id);
        setNote(response.data);
      } catch (error) {
        console.error("Fetch note error:", error);
        setError("Failed to load note.");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleUpdate = async (noteData) => {
    try {
      setSaving(true);
      setError("");

      await updateNote(id, noteData);

      navigate("/dashboard");
    } catch (error) {
      console.error("Update note error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update note. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading note...</p>;
  }

  if (error && !note) {
    return <p>{error}</p>;
  }

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
      <h1>Edit Note</h1>
      
      <p>Update your note.</p>
      </div>
      </div>

      {error && <p className="form-error">{error}</p>}

      <NoteForm
        initialData={{
          title: note.title,
          content: note.content,
        }}
        onSubmit={handleUpdate}
        submitText="Save Changes"
        loading={saving}
      />
    </div>
  );
}

export default EditNote;