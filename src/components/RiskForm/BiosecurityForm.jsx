import React, { useState } from "react";

export default function FarmHealthForm({ onBack, setData, data }) {
  const [form, setForm] = useState(
    data || {
      // Biosecurity
      unauthorizedAccess: false,
      contaminatedEquipment: false,
      // Environment
      pigTemperatureOk: false,
      pigHumidityOk: false,
      poultryTemperatureOk: false,
      // Feed & Feeding
      feedStoredSafely: false,
      feedAmountOk: false,
      // Health
      vaccinesGiven: false,
      diseaseObserved: false,
      notes: "",
    }
  );

  const handleChange = (e) => {
    const { name, checked } = e.target;
    const updated = { ...form, [name]: checked };
    setForm(updated);
    setData(updated);
  };

  const handleNotesChange = (e) => {
    const { value } = e.target;
    const updated = { ...form, notes: value };
    setForm(updated);
    setData(updated);
  };

  const handleSubmit = () => {
    alert("Form submitted successfully ✅");
    console.log("Final Data:", form);
  };

  return (
    <div className="space-y-6 text-black max-h-[70vh] overflow-y-auto p-4">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Farm Health & Safety</h2>

      {/* 1. Biosecurity */}
      <div className="space-y-2">
        <label className="block font-medium">
          1. Is your farm safe from strangers or unauthorized visitors?
        </label>
        <input
          type="checkbox"
          name="unauthorizedAccess"
          checked={form.unauthorizedAccess}
          onChange={handleChange}
        />

        <label className="block font-medium mt-2">
          Are your equipment and vehicles cleaned before use?
        </label>
        <input
          type="checkbox"
          name="contaminatedEquipment"
          checked={form.contaminatedEquipment}
          onChange={handleChange}
        />
      </div>

      {/* 2. Environment */}
      <div className="space-y-2">
        <label className="block font-medium">2. Pig Temperature OK?</label>
        <input
          type="checkbox"
          name="pigTemperatureOk"
          checked={form.pigTemperatureOk}
          onChange={handleChange}
        />

        <label className="block font-medium mt-2">Pig Humidity OK?</label>
        <input
          type="checkbox"
          name="pigHumidityOk"
          checked={form.pigHumidityOk}
          onChange={handleChange}
        />

        <label className="block font-medium mt-2">Poultry Temperature OK?</label>
        <input
          type="checkbox"
          name="poultryTemperatureOk"
          checked={form.poultryTemperatureOk}
          onChange={handleChange}
        />
      </div>

      {/* 3. Feed */}
      <div className="space-y-2">
        <label className="block font-medium">3. Feed stored safely?</label>
        <input
          type="checkbox"
          name="feedStoredSafely"
          checked={form.feedStoredSafely}
          onChange={handleChange}
        />

        <label className="block font-medium mt-2">Animals fed properly?</label>
        <input
          type="checkbox"
          name="feedAmountOk"
          checked={form.feedAmountOk}
          onChange={handleChange}
        />
      </div>

      {/* 4. Health */}
      <div className="space-y-2">
        <label className="block font-medium">4. Vaccines given as per schedule?</label>
        <input
          type="checkbox"
          name="vaccinesGiven"
          checked={form.vaccinesGiven}
          onChange={handleChange}
        />

        <label className="block font-medium mt-2">Any unusual sickness observed?</label>
        <input
          type="checkbox"
          name="diseaseObserved"
          checked={form.diseaseObserved}
          onChange={handleChange}
        />
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="block font-medium">Notes / Observations</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleNotesChange}
          className="w-full border rounded-lg p-2"
          placeholder="Add any notes about farm conditions"
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-4">
        <button onClick={onBack} className="bg-gray-300 px-4 py-2 rounded-lg">
          Back
        </button>
        <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded-lg">
          Submit
        </button>
      </div>
    </div>
  );
}
