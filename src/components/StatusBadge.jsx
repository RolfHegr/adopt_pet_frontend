import React from "react";

export default function StatusBadge({ status, children }) {
  let badgeColors = ["", ""];

  if (status === "available") badgeColors = ["#d3f4e5", "#008000"];
  if (status === "adopted") badgeColors = ["#fff0f0", "#ff3838"];
  if (status === "fostered") badgeColors = ["#fef6e5", "#eecb95"];

  return (
    <>
      <div
        className="d-flex justify-content-center"
        style={{
          backgroundColor: badgeColors[0],
          color: badgeColors[1],
          width: "25%",
          borderRadius: "1rem",
          padding: "0.3rem",
        }}
      >
        {children}
      </div>
    </>
  );
}
