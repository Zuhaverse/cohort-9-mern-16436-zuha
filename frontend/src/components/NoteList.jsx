import NoteCard from "./NoteCard";
import "./NoteList.css";

function NoteList({ notes, onDelete }) {
  return (
    <div className="note-list">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default NoteList;