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
    let isActive = true;
  
    const fetchNote = async () => {
      setLoading(true);
      setNote(null);
      setError("");
  
      try {
        const response = await getNote(id);
  
        if (isActive) {
          setNote(response.data);
        }
      } catch (error) {
        console.error("Fetch note error:", error);
  
        if (isActive) {
          setError("Failed to load note.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };
  
    fetchNote();
  
    return () => {
      isActive = false;
    };
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
  
  return (
    <div className="note-page">
      <div className="container">
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
  
      {error && !note ? (
        <p className="form-error">{error}</p>
      ) : (
        <>
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
        </>
      )}
    </div>
    </div>
  );
}

export default EditNote;