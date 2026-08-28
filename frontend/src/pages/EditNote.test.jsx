import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import EditNote from "./EditNote";
import { getNote, updateNote } from "../services/noteService";

jest.mock("../services/noteService", () => ({
  getNote: jest.fn(),
  updateNote: jest.fn(),
}));

jest.mock("../components/NoteForm", () => {
  return function MockNoteForm({
    initialData,
    onSubmit,
    loading,
  }) {
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
        <input
          id="title"
          name="title"
          defaultValue={initialData?.title || ""}
        />

        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          defaultValue={initialData?.content || ""}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    );
  };
});

describe("EditNote", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("loads and displays the existing note", async () => {
    getNote.mockResolvedValue({
      success: true,
      data: {
        id: 1,
        title: "Existing Note",
        content: "Existing content",
      },
    });

    render(
      <MemoryRouter initialEntries={["/notes/1/edit"]}>
        <Routes>
          <Route path="/notes/:id/edit" element={<EditNote />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Loading note...")).toBeInTheDocument();

    expect(
      await screen.findByDisplayValue("Existing Note")
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue("Existing content")
    ).toBeInTheDocument();

    expect(getNote).toHaveBeenCalledWith("1");
  });

  test("updates the note and redirects to dashboard", async () => {
    const user = userEvent.setup();

    getNote.mockResolvedValue({
      success: true,
      data: {
        id: 1,
        title: "Old Title",
        content: "Old content",
      },
    });

    updateNote.mockResolvedValue({
      success: true,
      data: {
        id: 1,
        title: "Updated Title",
        content: "Updated content",
      },
    });

    render(
      <MemoryRouter initialEntries={["/notes/1/edit"]}>
        <Routes>
          <Route path="/notes/:id/edit" element={<EditNote />} />

          <Route
            path="/dashboard"
            element={<h1>Dashboard</h1>}
          />
        </Routes>
      </MemoryRouter>
    );

    const titleInput = await screen.findByDisplayValue("Old Title");
    const contentInput = screen.getByDisplayValue("Old content");

    await user.clear(titleInput);
    await user.type(titleInput, "Updated Title");

    await user.clear(contentInput);
    await user.type(contentInput, "Updated content");

    await user.click(
      screen.getByRole("button", {
        name: /save changes/i,
      })
    );

    await waitFor(() => {
      expect(updateNote).toHaveBeenCalledWith("1", {
        title: "Updated Title",
        content: "Updated content",
      });
    });

    expect(
      await screen.findByRole("heading", {
        name: "Dashboard",
      })
    ).toBeInTheDocument();
  });

  test("shows error when loading the note fails", async () => {
    getNote.mockRejectedValue(new Error("Failed to load"));

    render(
      <MemoryRouter initialEntries={["/notes/1/edit"]}>
        <Routes>
          <Route path="/notes/:id/edit" element={<EditNote />} />
        </Routes>
      </MemoryRouter>
    );

    expect(
      await screen.findByText("Failed to load note.")
    ).toBeInTheDocument();
  });

  test("shows error when updating the note fails", async () => {
    const user = userEvent.setup();

    getNote.mockResolvedValue({
      success: true,
      data: {
        id: 1,
        title: "Old Title",
        content: "Old content",
      },
    });

    updateNote.mockRejectedValue(
      new Error("Update failed")
    );

    render(
      <MemoryRouter initialEntries={["/notes/1/edit"]}>
        <Routes>
          <Route path="/notes/:id/edit" element={<EditNote />} />
        </Routes>
      </MemoryRouter>
    );

    const titleInput = await screen.findByDisplayValue("Old Title");

    await user.clear(titleInput);
    await user.type(titleInput, "Updated Title");

    await user.click(
      screen.getByRole("button", {
        name: /save changes/i,
      })
    );

    expect(
      await screen.findByText(
        "Failed to update note. Please try again."
      )
    ).toBeInTheDocument();
  });

  test("back button navigates to dashboard", async () => {
    const user = userEvent.setup();

    getNote.mockResolvedValue({
      success: true,
      data: {
        id: 1,
        title: "Test Note",
        content: "Test content",
      },
    });

    render(
      <MemoryRouter initialEntries={["/notes/1/edit"]}>
        <Routes>
          <Route path="/notes/:id/edit" element={<EditNote />} />

          <Route
            path="/dashboard"
            element={<h1>Dashboard</h1>}
          />
        </Routes>
      </MemoryRouter>
    );

    await screen.findByDisplayValue("Test Note");

    await user.click(
      screen.getByRole("button", {
        name: /back to notes/i,
      })
    );

    expect(
      await screen.findByRole("heading", {
        name: "Dashboard",
      })
    ).toBeInTheDocument();
  });
});