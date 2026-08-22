import React from "react";

const ReactQuill = React.forwardRef(
  ({ value, onChange, ...props }, ref) => {
    const editorRoot = React.useRef(null);

    React.useImperativeHandle(ref, () => ({
      getEditor: () => ({
        root: editorRoot.current,
      }),
    }));

    return (
      <textarea
        ref={editorRoot}
        {...props}
        aria-label="Content"
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }
);

export default ReactQuill;