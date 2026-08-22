import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RichTextEditor from "./RichTextEditor";

jest.mock("react-quill-new", () => {
    const React = require("react");
  
    return React.forwardRef(function MockReactQuill(
      { value, onChange, placeholder },
      ref
    ) {
      const editorRoot = React.useRef(null);
  
      React.useImperativeHandle(ref, () => ({
        getEditor: () => ({
          root: editorRoot.current,
        }),
      }));
  
      return (
        <textarea
          ref={editorRoot}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
        />
      );
    });
  });

test("renders the rich text editor and accepts input", async () => {
  const user = userEvent.setup();
  const handleChange = jest.fn();

  render(
    <RichTextEditor
      value=""
      onChange={handleChange}
      placeholder="Write your note..."
      id="content"
      ariaLabelledby="content-label"
    />
  );

  const editor = screen.getByRole("textbox");

  expect(editor).toBeInTheDocument();

  await user.type(editor, "My rich text note");

  expect(handleChange).toHaveBeenCalled();
});

test("associates the editor with its label", () => {
  render(
    <RichTextEditor
      value=""
      onChange={jest.fn()}
      placeholder="Write your note..."
      id="content"
      ariaLabelledby="content-label"
    />
  );

  const editor = screen.getByRole("textbox");

  expect(editor).toHaveAttribute("id", "content");
  expect(editor).toHaveAttribute("aria-labelledby", "content-label");
});

test("sets error accessibility attributes", () => {
  render(
    <RichTextEditor
      value=""
      onChange={jest.fn()}
      placeholder="Write your note..."
      id="content"
      ariaLabelledby="content-label"
      ariaInvalid={true}
      ariaDescribedby="content-error"
    />
  );

  const editor = screen.getByRole("textbox");

  expect(editor).toHaveAttribute("aria-invalid", "true");
  expect(editor).toHaveAttribute("aria-describedby", "content-error");
});