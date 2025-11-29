import React, { useState } from "react";

export default function FeedNutritionForm({ onNext, onBack, setData, data }) {
  const [form, setForm] = useState(
    data || {
      feedShortage: false,
      feedShortageNotes: "",
      contaminatedFeed: false,
      contaminatedFeedNotes: "",
      feedingScheduleOk: false,
      feedingScheduleNotes: "",
      ventilationOk: false,
      ventilationNotes: "",
    }
  );

  const [showDetails, setShowDetails] = useState({
    feedShortage: false,
    contaminatedFeed: false,
    feedingSchedule: false,
    ventilation: false,
  });

  const toggleDetails = (section) => {
    setShowDetails((prev) => ({ ...prev, [section]: !prev[section] }));
  };

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
      {/* Feed Shortage */}
      <div className="space-y-2">
        <label className="block font-medium">
          1. Have you experienced any shortage of animal feed?
        </label>
        <button
          type="button"
          onClick={() => toggleDetails("feedShortage")}
          className="text-sm text-green-600 underline"
        >
          {showDetails.feedShortage ? "Hide ideal conditions" : "Show ideal conditions"}
        </button>
        {showDetails.feedShortage && (
          <div className="bg-gray-50 border rounded-lg p-3 text-sm text-gray-700">
            <p className="font-semibold text-green-700">Ideal Feed Availability:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Feed available daily without interruption</li>
              <li>Balanced rations matched to animal age and type</li>
              <li>Clean, uncontaminated feed in sufficient quantities</li>
            </ul>
          </div>
        )}
        <input
          type="checkbox"
          name="feedShortage"
          checked={form.feedShortage}
          onChange={handleCheckboxChange}
        />
        <textarea
          name="feedShortageNotes"
          value={form.feedShortageNotes}
          onChange={handleTextChange}
          className="w-full border rounded-lg p-2 mt-1"
          placeholder="Describe details of feed shortage: duration, quantity, type of feed"
        />
      </div>

      {/* Contaminated Feed */}
      <div className="space-y-2">
        <label className="block font-medium mt-2">
          2. Is there any contaminated or spoiled feed?
        </label>
        <button
          type="button"
          onClick={() => toggleDetails("contaminatedFeed")}
          className="text-sm text-green-600 underline"
        >
          {showDetails.contaminatedFeed ? "Hide ideal conditions" : "Show ideal conditions"}
        </button>
        {showDetails.contaminatedFeed && (
          <div className="bg-gray-50 border rounded-lg p-3 text-sm text-gray-700">
            <p className="font-semibold text-green-700">Ideal Feed Quality:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>No mold, foul smell, or discoloration</li>
              <li>Stored properly in dry, clean containers</li>
              <li>Free from pests, rodents, and insects</li>
            </ul>
          </div>
        )}
        <input
          type="checkbox"
          name="contaminatedFeed"
          checked={form.contaminatedFeed}
          onChange={handleCheckboxChange}
        />
        <textarea
          name="contaminatedFeedNotes"
          value={form.contaminatedFeedNotes}
          onChange={handleTextChange}
          className="w-full border rounded-lg p-2 mt-1"
          placeholder="Write details about contaminated feed: type, quantity, and possible causes"
        />
      </div>

      {/* Feeding Schedule */}
      <div className="space-y-2">
        <label className="block font-medium mt-2">
          3. Are animals being fed according to their age and schedule?
        </label>
        <button
          type="button"
          onClick={() => toggleDetails("feedingSchedule")}
          className="text-sm text-green-600 underline"
        >
          {showDetails.feedingSchedule ? "Hide ideal conditions" : "Show ideal conditions"}
        </button>
        {showDetails.feedingSchedule && (
          <div className="bg-gray-50 border rounded-lg p-3 text-sm text-gray-700">
            <p className="font-semibold text-green-700">Feeding Schedule Tips:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Piglets: 5–6 small meals per day</li>
              <li>Growing pigs: free access 24 hours a day</li>
              <li>Poultry: starter, grower, finisher feed as appropriate</li>
            </ul>
          </div>
        )}
        <input
          type="checkbox"
          name="feedingScheduleOk"
          checked={form.feedingScheduleOk}
          onChange={handleCheckboxChange}
        />
        <textarea
          name="feedingScheduleNotes"
          value={form.feedingScheduleNotes}
          onChange={handleTextChange}
          className="w-full border rounded-lg p-2 mt-1"
          placeholder="Add any notes about feeding schedule, irregularities, or observations"
        />
      </div>

      {/* Ventilation */}
      <div className="space-y-2">
        <label className="block font-medium mt-2">
          4. Is the ventilation sufficient and safe for animals?
        </label>
        <button
          type="button"
          onClick={() => toggleDetails("ventilation")}
          className="text-sm text-green-600 underline"
        >
          {showDetails.ventilation ? "Hide ideal conditions" : "Show ideal conditions"}
        </button>
        {showDetails.ventilation && (
          <div className="bg-gray-50 border rounded-lg p-3 text-sm text-gray-700">
            <p className="font-semibold text-green-700">Good Ventilation Means:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Proper airflow inside the housing</li>
              <li>No bad smells (ammonia, waste gases)</li>
              <li>No hot or cold spots in the shelter</li>
              <li>Animals appear comfortable and active</li>
            </ul>
          </div>
        )}
        <input
          type="checkbox"
          name="ventilationOk"
          checked={form.ventilationOk}
          onChange={handleCheckboxChange}
        />
        <span className="ml-2">Ventilation is sufficient</span>

        <textarea
          name="ventilationNotes"
          value={form.ventilationNotes}
          onChange={handleTextChange}
          className="w-full border rounded-lg p-2 mt-1"
          placeholder="Write any notes about ventilation issues or improvements"
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