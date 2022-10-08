import React from "react";

export default function InfoBadge({ title, value, valueType }) {
  const isMonths = valueType.toLowerCase() === "months";
  const isWeight = valueType.toLowerCase() === "weight";

  function displayMonthsOrYears() {
    if (value <= 11) return displayValues();

    const ageInYears = Math.floor(value / 12);
    if (ageInYears === 1) return <>{ageInYears} year</>;

    return <>{ageInYears} years</>;
  }

  function displayValues() {
    return (
      <>
        {" "}
        {value} {valueType}
      </>
    );
  }

  function displayWeightInGramsOrKg() {
    const kg = Math.floor(parseInt(value) / 1000);

    if (kg < 1) return <>{value} grams</>;
    else return <>{kg} kg</>;
  }

  return (
    <>
      <div
        style={{
          border: "1px solid lightgray",
          borderRadius: "1rem",
          padding: "0.25rem 0.5rem",
        }}
      >
        <div
          className="text-secondary"
          style={{ display: "flex", justifyContent: "center" }}
        >
          {title}
        </div>
        <div className="fw-bold text d-flex justify-content-center">
          {isMonths && displayMonthsOrYears()}
          {isWeight && displayWeightInGramsOrKg()}
          {!isMonths && !isWeight && displayValues()}
        </div>
      </div>
    </>
  );
}
