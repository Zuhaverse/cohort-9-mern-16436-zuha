import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import CreateNote from "./CreateNote";
import { createNote } from "../services/noteService";

jest.mock("../services/noteService", () => ({
  createNote: jest.fn(),
}));

jest.mock("../components/NoteForm", () => {
    return function MockNoteForm({ onSubmit, loading }) {
      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
  
            const formData = new FormData(e.currentTarget);
  
            onSubmit({
              title: formData.get("title"),
              content: formData.get("content"),
            });
          }}
        >
          <label htmlFor="title">Title</label>
          <input id="title" name="title" />
  
          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" />
  
          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Create Note"}
          </button>
        </form>
      );
    };
  });
describe("CreateNote", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders create note page", () => {
    render(
      <MemoryRouter>
        <CreateNote />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: "Create Note" })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Write down your thoughts and ideas.")
    ).toBeInTheDocument();

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /create note/i })
    ).toBeInTheDocument();
  });

  test("creates a note and redirects to dashboard", async () => {
    const user = userEvent.setup();

    createNote.mockResolvedValue({
      success: true,
      data: {
        id: 1,
        title: "My New Note",
        content: "This is my note.",
      },
    });

    render(
      <MemoryRouter initialEntries={["/notes/new"]}>
        <Routes>
          <Route path="/notes/new" element={<CreateNote />} />
          <Route
            path="/dashboard"
            element={<h1>Dashboard</h1>}
          />
        </Routes>
      </MemoryRouter>
    );

    await user.type(
      screen.getByLabelText(/title/i),
      "My New Note"
    );

    await user.type(
      screen.getByLabelText(/content/i),
      "This is my note."
    );

    await user.click(
      screen.getByRole("button", { name: /create note/i })
    );

    await waitFor(() => {
      expect(createNote).toHaveBeenCalledWith({
        title: "My New Note",
        content: "This is my note.",
      });
    });

    expect(
      await screen.findByRole("heading", {
        name: "Dashboard",
      })
    ).toBeInTheDocument();
  });

  test("shows error when note creation fails", async () => {
    const user = userEvent.setup();

    createNote.mockRejectedValue(new Error("Create failed"));

    render(
      <MemoryRouter>
        <CreateNote />
      </MemoryRouter>
    );

    await user.type(
      screen.getByLabelText(/title/i),
      "My Note"
    );

    await user.type(
      screen.getByLabelText(/content/i),
      "Some content"
    );

    await user.click(
      screen.getByRole("button", { name: /create note/i })
    );

    expect(
      await screen.findByText(
        "Failed to create note. Please try again."
      )
    ).toBeInTheDocument();
  });

  test("shows loading state while creating a note", async () => {
    const user = userEvent.setup();

    createNote.mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter>
        <CreateNote />
      </MemoryRouter>
    );

    await user.type(
      screen.getByLabelText(/title/i),
      "My Note"
    );

    await user.type(
      screen.getByLabelText(/content/i),
      "Some content"
    );

    await user.click(
      screen.getByRole("button", { name: /create note/i })
    );

    expect(
      screen.getByRole("button", { name: /saving/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /saving/i })
    ).toBeDisabled();
  });

  test("back button navigates to dashboard", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/notes/new"]}>
        <Routes>
          <Route path="/notes/new" element={<CreateNote />} />
          <Route
            path="/dashboard"
            element={<h1>Dashboard</h1>}
          />
        </Routes>
      </MemoryRouter>
    );

    await user.click(
      screen.getByRole("button", {
        name: "Back to notes",
      })
    );

    expect(
      await screen.findByRole("heading", {
        name: "Dashboard",
      })
    ).toBeInTheDocument();
  });
});