import React from "react";
import { useLocation } from "react-router-dom";

export default function RiskResultPage() {
  const location = useLocation();
  const { formData, riskResult } = location.state || {};

  if (!formData || !riskResult) return <p>No data available.</p>;

  return (
    <div className="min-h-screen p-6 bg-green-50 text-black">
      <h1 className="text-3xl font-bold text-green-700 mb-4">Farm Risk Assessment</h1>

      <h2 className="text-xl font-semibold mt-4">Risk Result</h2>
      <pre className="p-4 bg-white rounded-lg shadow mb-6 whitespace-pre-wrap break-words">
        {riskResult}
      </pre>

      <h2 className="text-xl font-semibold mt-4">Collected Farm Data</h2>
      <pre className="p-4 bg-white rounded-lg shadow whitespace-pre-wrap break-words">
        {JSON.stringify(formData, null, 2)}
      </pre>

      {/* TODO: Later you can add charts/graphs here */}
    </div>
  );
}
