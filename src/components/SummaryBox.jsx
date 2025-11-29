// components/SummaryBox.jsx
import React from "react";

const SummaryBox = ({ title, value, color }) => (
  <div className={`p-6 rounded-lg shadow-lg bg-gradient-to-r ${color}`}>
    <h3 className="text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
);

export default SummaryBox;
