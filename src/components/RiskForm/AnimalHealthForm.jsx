import React, { useState } from "react";

export default function AnimalHealthForm({ onNext, setData, data }) {
  const [form, setForm] = useState(data || {
    suddenDeaths: false,
    visibleWounds: "",
    strangeBehavior: "",
    sicknessSigns: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updated = { ...form, [name]: type === "checkbox" ? checked : value };
    setForm(updated);
    setData(updated);
  };

  return (
    <div className="text-black">
      <label className="block mb-2 font-medium">Did you notice sudden deaths in your animals?</label>
      <input
        type="checkbox"
        name="suddenDeaths"
        checked={form.suddenDeaths}
        onChange={handleChange}
        className="mr-2"
      /> Yes

      <label className="block mt-4 mb-2 font-medium">Do animals have any visible wounds or injuries?</label>
      <input
        type="text"
        name="visibleWounds"
        value={form.visibleWounds}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
        placeholder="Example: cuts, swelling, bleeding"
      />

      <label className="block mt-4 mb-2 font-medium">Have you noticed strange behavior?</label>
      <input
        type="text"
        name="strangeBehavior"
        value={form.strangeBehavior}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
        placeholder="Example: not eating, walking slowly, shaking"
      />

      <label className="block mt-4 mb-2 font-medium">Do you see any signs of sickness?</label>
      <input
        type="text"
        name="sicknessSigns"
        value={form.sicknessSigns}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
        placeholder="Example: coughing, diarrhea, fever"
      />

      <div className="flex justify-end mt-6">
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
