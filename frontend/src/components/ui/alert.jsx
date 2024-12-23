import React from "react";

export const Alert = ({ children, className }) => {
  return (
    <div
      className={`p-4 border-l-4 border-red-500 bg-red-100 text-red-800 rounded ${className}`}
    >
      {children}
    </div>
  );
};

export const AlertDescription = ({ children, className }) => {
  return (
    <p className={`text-sm ${className}`}>
      {children}
    </p>
  );
};
