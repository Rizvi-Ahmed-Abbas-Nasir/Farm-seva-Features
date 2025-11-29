import React, { useState } from "react";

export default function OperationalForm({ onNext, onBack, setData, data }) {
  const [form, setForm] = useState(
    data || {
      vaccinationOnTime: false,
      vaccinationNotes: "",
      staffAvailable: false,
      staffNotes: "",
      recordKeepingOk: false,
      recordNotes: "",
    }
  );

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    const updated = { ...form, [name]: checked };
    setForm(updated);
    setData(updated);
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...form, [name]: value };
    setForm(updated);
    setData(updated);
  };

  return (
    <div className="space-y-6 text-black">

      {/* Vaccination */}
      <div className="space-y-2">
        <label className="block font-medium">
          1. Are all vaccinations done on time for pigs and poultry?
        </label>
        <input
          type="checkbox"
          name="vaccinationOnTime"
          checked={form.vaccinationOnTime}
          onChange={handleCheckboxChange}
        />
        <textarea
          name="vaccinationNotes"
          value={form.vaccinationNotes}
          onChange={handleTextChange}
          className="w-full border rounded-lg p-2 mt-1"
          placeholder="Write details if any vaccination was delayed, reasons, or notes"
        />
      </div>

      {/* Staff Availability */}
      <div className="space-y-2">
        <label className="block font-medium mt-2">
          2. Is there enough staff/caretakers available?
        </label>
        <input
          type="checkbox"
          name="staffAvailable"
          checked={form.staffAvailable}
          onChange={handleCheckboxChange}
        />
        <textarea
          name="staffNotes"
          value={form.staffNotes}
          onChange={handleTextChange}
          className="w-full border rounded-lg p-2 mt-1"
          placeholder="Write details if staff is short or any operational issues"
        />
      </div>

      {/* Record Keeping */}
      <div className="space-y-2">
        <label className="block font-medium mt-2">
          3. Are farm records maintained properly? (Feed, vaccination, health, breeding logs)
        </label>
        <input
          type="checkbox"
          name="recordKeepingOk"
          checked={form.recordKeepingOk}
          onChange={handleCheckboxChange}
        />
        <textarea
          name="recordNotes"
          value={form.recordNotes}
          onChange={handleTextChange}
          className="w-full border rounded-lg p-2 mt-1"
          placeholder="Add notes about record quality or missing information"
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="bg-gray-400 text-white px-4 py-2 rounded-lg"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
}
