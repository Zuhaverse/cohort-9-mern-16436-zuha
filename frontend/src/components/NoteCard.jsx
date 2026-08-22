import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2 } from "lucide-react";
import "./NoteCard.css";

function getPlainTextPreview(content, maxLength = 120) {
  const tempElement = document.createElement("div");
  tempElement.innerHTML = content;

  const plainText = tempElement.textContent || tempElement.innerText || "";

  return plainText.length > maxLength
    ? `${plainText.substring(0, maxLength)}...`
    : plainText;
}

function NoteCard({ note, onDelete }) {
  const deleteButtonRef = useRef(null);
  const modalRef = useRef(null);
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

  const closeModal = () => {
    if (deleting) {
      return;
    }

    setShowConfirm(false);
    deleteButtonRef.current?.focus();
  };

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

  useEffect(() => {
    if (!showConfirm) {
      return;
    }
  
    modalRef.current?.focus();
     }, [showConfirm]);
    
      useEffect(() => {
        if (!showConfirm) {
          return;
        }
  
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setShowConfirm(false);
        deleteButtonRef.current?.focus();
        return;
      }
    
      if (event.key === "Tab") {
        const modal = modalRef.current;

        if (!modal) {
          return;
        }
        const focusableElements = [
                   modal,
                    ...modal.querySelectorAll(
                      'button:not([disabled]), [href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
                    ),
                  ];
        const firstElement = focusableElements[0];
        const lastElement =
          focusableElements[focusableElements.length - 1];
    
        const activeElement = document.activeElement;
    
        if (
          event.shiftKey &&
          (activeElement === firstElement ||
            activeElement === modalRef.current ||
            !modalRef.current?.contains(activeElement))
        ) {
          event.preventDefault();
          lastElement.focus();
        } else if (
          !event.shiftKey &&
          (activeElement === lastElement ||
            !modalRef.current?.contains(activeElement))
        ) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };
  
    document.addEventListener("keydown", handleKeyDown);
  
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [showConfirm]);

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
              ref={deleteButtonRef}
              type="button"
              className="delete-note-btn"
              onClick={() => setShowConfirm(true)}
              aria-label={`Delete ${note.title}`}
            >
              <Trash2 size={17} strokeWidth={2} />
            </button>
          </div>
        </div>

        <p>{getPlainTextPreview(note.content)}</p>

        <small>{formattedDate}</small>
      </div>

      {showConfirm && (
        <div className="modal-overlay">
          <div
            ref={modalRef}
            className="delete-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-modal-title"
            tabIndex="-1"
          >
            <h2 id="delete-modal-title">Delete Note?</h2>

            <p>
              Are you sure you want to delete{" "}
              <strong>"{note.title}"</strong>? This action cannot be undone.
            </p>

            <div className="modal-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={closeModal}
                disabled={deleting}
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