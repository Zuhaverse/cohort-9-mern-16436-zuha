import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import { getNotes, deleteNote } from "../services/noteService";
import { useAuth } from "../context/useAuth";

jest.mock("../services/noteService", () => ({
  getNotes: jest.fn(),
  deleteNote: jest.fn(),
}));

jest.mock("../context/useAuth", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../assets/logo.png", () => "logo.png");
describe("Dashboard", () => {
  const user = {
    id: 1,
    name: "Test User",
    email: "test@example.com",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useAuth.mockReturnValue({
      user,
      logout: jest.fn(),
    });
  });

  test("shows loading state while notes are loading", () => {
    getNotes.mockReturnValue(new Promise(() => {}));

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading notes...")).toBeInTheDocument();
  });

  test("shows notes when notes are loaded successfully", async () => {
    getNotes.mockResolvedValue({
      data: [
        {
          id: 1,
          title: "First Note",
          content: "Learning MERN stack",
          created_at: "2026-08-21T10:00:00.000Z",
        },
      ],
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("First Note")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Learning MERN stack")
    ).toBeInTheDocument();
  });

  test("shows empty state when there are no notes", async () => {
    getNotes.mockResolvedValue({
      data: [],
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("Your space is empty")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Create a note to get started.")
    ).toBeInTheDocument();
  });

  test("shows error state when notes fail to load", async () => {
    getNotes.mockRejectedValue(new Error("Failed to load"));

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(
      await screen.findByText(
        "Failed to load notes. Please try again."
      )
    ).toBeInTheDocument();
  });

  test("navigates to create note page when Create Note is clicked", async () => {
    const user = userEvent.setup();
  
    getNotes.mockResolvedValue({
      data: [],
    });
  
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/notes/new"
            element={<h1>Create Note Page</h1>}
          />
        </Routes>
      </MemoryRouter>
    );
  
    const createButtons = await screen.findAllByRole("button", {
      name: /create note/i,
    });
  
    await user.click(createButtons[0]);
  
    expect(
      await screen.findByRole("heading", {
        name: "Create Note Page",
      })
    ).toBeInTheDocument();
  });

  test("deletes a note successfully", async () => {
    const user = userEvent.setup();

    getNotes.mockResolvedValue({
      data: [
        {
          id: 1,
          title: "Test Note",
          content: "Test content",
          created_at: "2026-08-21T10:00:00.000Z",
        },
      ],
    });

    deleteNote.mockResolvedValue({
      success: true,
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("Test Note")
    ).toBeInTheDocument();

    const deleteButton = screen.getByRole("button", {
      name: "Delete Test Note",
    });

    await user.click(deleteButton);

    const confirmButton = screen.getByRole("button", {
      name: "Delete",
    });

    await user.click(confirmButton);

    await waitFor(() => {
      expect(deleteNote).toHaveBeenCalledWith(1);
    });

    await waitFor(() => {
      expect(
        screen.queryByText("Test Note")
      ).not.toBeInTheDocument();
    });
  });

  test("shows delete error when deleting a note fails", async () => {
    const user = userEvent.setup();

    getNotes.mockResolvedValue({
      data: [
        {
          id: 1,
          title: "Test Note",
          content: "Test content",
          created_at: "2026-08-21T10:00:00.000Z",
        },
      ],
    });

    deleteNote.mockRejectedValue(new Error("Delete failed"));

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(
      await screen.findByText("Test Note")
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", {
        name: "Delete Test Note",
      })
    );

    await user.click(
      screen.getByRole("button", {
        name: "Delete",
      })
    );

    expect(
      await screen.findByRole("alert")
    ).toHaveTextContent(
      "Failed to delete note. Please try again."
    );
  });

  test("logs out and redirects to login", async () => {
    const logout = jest.fn().mockResolvedValue({
      success: true,
    });
  
    useAuth.mockReturnValue({
      user: {
        id: 1,
        name: "Test User",
        email: "test@example.com",
      },
      logout,
    });
  
    getNotes.mockResolvedValue({
      success: true,
      data: [],
    });
  
    const user = userEvent.setup();
  
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<h1>Login Page</h1>} />
        </Routes>
      </MemoryRouter>
    );
  
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /my notes/i })
      ).toBeInTheDocument();
    });
  
    await user.click(
      screen.getByRole("button", {
        name: /open profile menu/i,
      })
    );

    await user.click(
      screen.getByRole("button", {
        name: /logout/i,
      })
    );
  
    await waitFor(() => {
      expect(logout).toHaveBeenCalledTimes(1);
    });
  
    expect(
      screen.getByRole("heading", { name: /login page/i })
    ).toBeInTheDocument();
  });
});