import React from "react";

const ReactQuill = ({ value, onChange, ...props }) => {
  return (
    <textarea
      {...props}
      aria-label="Content"
      value={value || ""}
      onChange={(event) => onChange(event.target.value)}
    />
  );
};

export default ReactQuill;