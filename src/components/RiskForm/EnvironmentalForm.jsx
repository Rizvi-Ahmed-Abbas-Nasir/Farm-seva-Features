import React, { useState } from "react";

export default function EnvironmentalForm({ onNext, onBack, setData, data }) {
  const [form, setForm] = useState(
    data || {
      pigTemperatureOk: false,
      pigTemperatureNotes: "",
      poultryTemperatureOk: false,
      poultryTemperatureNotes: "",
      humidityOk: false,
      humidityNotes: "",
      ventilationOk: false,
      ventilationNotes: "",
    }
  );

  const [showVentilationGuide, setShowVentilationGuide] = useState(false);

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
    <div className="space-y-6 text-black max-h-[70vh] overflow-y-auto p-4">
      <h2 className="text-2xl font-bold text-green-700 mb-4">Environmental Check</h2>

      {/* Pig Temperature */}
      <div className="space-y-2">
        <label className="block font-medium">
          1. Are pigs kept at the right temperature?  
          (Newborn: 27–35°C, Young: 24–30°C, Growers: 16–27°C, Adults: 10–24°C)
        </label>
        <input
          type="checkbox"
          name="pigTemperatureOk"
          checked={form.pigTemperatureOk}
          onChange={handleCheckboxChange}
        />
        <textarea
          name="pigTemperatureNotes"
          value={form.pigTemperatureNotes}
          onChange={handleTextChange}
          className="w-full border rounded-lg p-2 mt-1"
          placeholder="Add any observations about pig temperature or issues"
        />
      </div>

      {/* Poultry Temperature */}
      <div className="space-y-2">
        <label className="block font-medium">
          2. Are poultry kept below 41°C?
        </label>
        <input
          type="checkbox"
          name="poultryTemperatureOk"
          checked={form.poultryTemperatureOk}
          onChange={handleCheckboxChange}
        />
        <textarea
          name="poultryTemperatureNotes"
          value={form.poultryTemperatureNotes}
          onChange={handleTextChange}
          className="w-full border rounded-lg p-2 mt-1"
          placeholder="Add any notes about poultry temperature or observations"
        />
      </div>

      {/* Humidity */}
      <div className="space-y-2">
        <label className="block font-medium">
          3. Is the humidity for pigs between 60–70%?
        </label>
        <input
          type="checkbox"
          name="humidityOk"
          checked={form.humidityOk}
          onChange={handleCheckboxChange}
        />
        <textarea
          name="humidityNotes"
          value={form.humidityNotes}
          onChange={handleTextChange}
          className="w-full border rounded-lg p-2 mt-1"
          placeholder="Add any notes about humidity or issues noticed"
        />
      </div>

      {/* Ventilation */}
      <div className="space-y-2">
        <label className="block font-medium">
          4. Is the ventilation sufficient and safe for animals?  
        </label>

        {/* Expandable guide button */}
        <button
          type="button"
          onClick={() => setShowVentilationGuide(!showVentilationGuide)}
          className="text-sm text-blue-600 underline"
        >
          {showVentilationGuide ? "Hide Guide" : "Show Ideal Ventilation Conditions"}
        </button>

        {/* Expandable content */}
        {showVentilationGuide && (
          <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-700 mt-1">
            ✅ Good airflow across pens/sheds  
            ✅ No strong ammonia or bad smell  
            ✅ No areas that are too hot or too cold  
            ✅ Animals appear comfortable (not gasping, not huddled)  
          </div>
        )}

        <input
          type="checkbox"
          name="ventilationOk"
          checked={form.ventilationOk}
          onChange={handleCheckboxChange}
          className="mt-2"
        />
        <span className="ml-2">Ventilation is sufficient</span>

        <textarea
          name="ventilationNotes"
          value={form.ventilationNotes}
          onChange={handleTextChange}
          className="w-full border rounded-lg p-2 mt-2"
          placeholder="Describe ventilation system or any problems"
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
