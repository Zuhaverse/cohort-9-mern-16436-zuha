import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NoteForm from "./NoteForm";

describe("NoteForm", () => {
  test("renders title and content fields", () => {
    render(<NoteForm onSubmit={jest.fn()} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/content/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /save note/i })
    ).toBeInTheDocument();
  });

  test("allows the user to type in title and content", async () => {
    const user = userEvent.setup();

    render(<NoteForm onSubmit={jest.fn()} />);

    const titleInput = screen.getByLabelText(/title/i);
    const contentInput = screen.getByLabelText(/content/i);

    await user.type(titleInput, "My First Note");
    await user.type(contentInput, "This is my note content.");

    expect(titleInput).toHaveValue("My First Note");
    expect(contentInput).toHaveValue("This is my note content.");
  });

  test("shows validation error when title is empty", async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    render(<NoteForm onSubmit={handleSubmit} />);

    const contentInput = screen.getByLabelText(/content/i);
    const submitButton = screen.getByRole("button", {
      name: /save note/i,
    });

    await user.type(contentInput, "Some content");
    await user.click(submitButton);

    expect(screen.getByText("Title is required.")).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  test("shows validation error when content is empty", async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    render(<NoteForm onSubmit={handleSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    const submitButton = screen.getByRole("button", {
      name: /save note/i,
    });

    await user.type(titleInput, "My Note");
    await user.click(submitButton);

    expect(
      screen.getByText("Content is required.")
    ).toBeInTheDocument();

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  test("submits the entered note data", async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    render(<NoteForm onSubmit={handleSubmit} />);

    await user.type(
      screen.getByLabelText(/title/i),
      "My First Note"
    );

    await user.type(
      screen.getByLabelText(/content/i),
      "This is my note."
    );

    await user.click(
      screen.getByRole("button", { name: /save note/i })
    );

    expect(handleSubmit).toHaveBeenCalledWith({
      title: "My First Note",
      content: "This is my note.",
    });
  });

  test("trims whitespace before submitting", async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    render(<NoteForm onSubmit={handleSubmit} />);

    await user.type(
      screen.getByLabelText(/title/i),
      "   My Note   "
    );

    await user.type(
      screen.getByLabelText(/content/i),
      "   Some content   "
    );

    await user.click(
      screen.getByRole("button", { name: /save note/i })
    );

    expect(handleSubmit).toHaveBeenCalledWith({
      title: "My Note",
      content: "Some content",
    });
  });

  test("shows saving state when loading", () => {
    render(
      <NoteForm
        onSubmit={jest.fn()}
        loading={true}
      />
    );

    expect(
      screen.getByRole("button", { name: /saving/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /saving/i })
    ).toBeDisabled();
  });
});