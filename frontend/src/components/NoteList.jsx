import NoteCard from "./NoteCard";
import "./NoteList.css";

function NoteList({ notes }) {
  return (
    <div className="note-list">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
}

export default NoteList;