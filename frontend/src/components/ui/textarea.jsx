import React from "react";

export const Textarea = ({ placeholder, value, onChange, className }) => {
  return (
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`px-4 py-2 border rounded w-full resize-none ${className}`}
    />
  );
};
