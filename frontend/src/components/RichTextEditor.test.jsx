import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RichTextEditor from "./RichTextEditor";

jest.mock("react-quill-new", () => {
  return function MockReactQuill({ value, onChange, placeholder }) {
    return (
      <textarea
        aria-label="Rich text editor"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    );
  };
});

test("renders the rich text editor and accepts input", async () => {
  const user = userEvent.setup();
  const handleChange = jest.fn();

  render(
    <RichTextEditor
      value=""
      onChange={handleChange}
      placeholder="Write your note..."
    />
  );

  const editor = screen.getByRole("textbox", {
    name: "Rich text editor",
  });

  expect(editor).toBeInTheDocument();

  await user.type(editor, "My rich text note");

  expect(handleChange).toHaveBeenCalled();
});