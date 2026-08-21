import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import "./NoteCard.css";

function NoteCard({ note, onDelete }) {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const formattedDate = new Date(note.created_at).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await onDelete(note.id);
      setShowConfirm(false);
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="note-card">
        <div className="note-card-header">
          <h3>{note.title}</h3>

          <div className="note-card-actions">
            <button
              type="button"
              className="edit-note-btn"
              onClick={() => navigate(`/notes/${note.id}/edit`)}
              aria-label={`Edit ${note.title}`}
            >
              <Pencil size={17} strokeWidth={2} />
            </button>

            <button
              type="button"
              className="delete-note-btn"
              onClick={() => setShowConfirm(true)}
              aria-label={`Delete ${note.title}`}
            >
              <Trash2 size={17} strokeWidth={2} />
            </button>
          </div>
        </div>

        <p>
          {note.content.length > 120
            ? `${note.content.substring(0, 120)}...`
            : note.content}
        </p>

        <small>{formattedDate}</small>
      </div>

      {showConfirm && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h2>Delete Note?</h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>"{note.title}"</strong>? This action cannot be undone.
            </p>

            <div className="modal-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>

              <button
  type="button"
  className="confirm-delete-btn"
  onClick={handleDelete}
  disabled={deleting}
>
  {deleting ? "Deleting..." : "Delete"}
</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default NoteCard;