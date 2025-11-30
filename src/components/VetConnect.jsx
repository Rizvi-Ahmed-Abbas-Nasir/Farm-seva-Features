import React, { useState, useEffect } from "react";
import { FaSearch, FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaw, FaInfoCircle, FaStar, FaExclamationTriangle, FaDog, FaSyncAlt, FaPiggyBank, FaEgg } from "react-icons/fa";

export default function VetList({ city = "mumbai" }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [animalType, setAnimalType] = useState("pig");
  const [customAnimal, setCustomAnimal] = useState("");

  useEffect(() => {
    if (city && animalType) {
      fetchVetData();
    }
  }, [city, animalType]);

  const handleAnimalTypeChange = (type) => {
    setAnimalType(type);
    if (type === "custom") {
      setCustomAnimal("");
    }
  };

  const handleCustomAnimalChange = (e) => {
    setCustomAnimal(e.target.value);
    setAnimalType(e.target.value);
  };

  const fetchVetData = async () => {
    const currentAnimalType = animalType === "custom" ? customAnimal : animalType;
    
    if (!city || !currentAnimalType) {
      setError("Please provide both city and animal type");
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);
    
    try {
      const payload = {
        city: city,
        animalType: currentAnimalType
      };

      const response = await fetch(
        "http://localhost:5678/webhook-test/159fa3fa-d577-4aea-8d78-225bc00b915b",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Enhanced error handling for AI output parsing
      if (!result.output) {
        throw new Error("Invalid response format from server");
      }

      // More robust JSON extraction
      let jsonString = result.output
        .replace(/```json\s*/, "")
        .replace(/\s*```$/, "")
        .replace(/\\"/g, '"')
        .replace(/\\n/g, '')
        .trim();

      const parsedData = JSON.parse(jsonString);
      
      // Validate parsed data structure
      if (!Array.isArray(parsedData)) {
        throw new Error("Invalid data format received");
      }

      setData(parsedData);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(
        err.message.includes("JSON") 
          ? "Failed to process veterinary data. Please try again."
          : "Failed to fetch data. Please check your connection and try again."
      );
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const RetryButton = () => (
    <button
      onClick={fetchVetData}
      className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition-colors flex items-center gap-2"
    >
      <FaSyncAlt />
      Try Again
    </button>
  );

  const VetCard = ({ vet, index }) => (
    <div
      key={index}
      className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 bg-white hover:bg-gray-50"
    >
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-xl font-bold text-gray-800">{vet.name}</h2>
        {vet.rating && (
          <div className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-semibold">
            <FaStar className="mr-1" />
            {vet.rating}
          </div>
        )}
      </div>

      <div className="space-y-3 text-gray-600">
        {vet.phone && (
          <div className="flex items-center">
            <FaPhone className="w-5 h-5 mr-3 text-gray-400" />
            <a 
              href={`tel:${vet.phone}`}
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              {vet.phone}
            </a>
          </div>
        )}

        {vet.email && (
          <div className="flex items-center">
            <FaEnvelope className="w-5 h-5 mr-3 text-gray-400" />
            <a 
              href={`mailto:${vet.email}`}
              className="text-blue-600 hover:text-blue-800 hover:underline break-all"
            >
              {vet.email}
            </a>
          </div>
        )}

        {vet.address && (
          <div className="flex items-start">
            <FaMapMarkerAlt className="w-5 h-5 mr-3 mt-0.5 text-gray-400 flex-shrink-0" />
            <span className="text-gray-700">{vet.address}</span>
          </div>
        )}

        {vet.animal_types && vet.animal_types.length > 0 && (
          <div className="flex items-start">
            <FaPaw className="w-5 h-5 mr-3 mt-0.5 text-gray-400 flex-shrink-0" />
            <div className="flex-1">
              <span className="font-medium text-gray-700">Specializes in: </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {vet.animal_types.map((type, idx) => (
                  <span
                    key={idx}
                    className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {vet.additional_info && (
          <div className="flex items-start pt-3 border-t border-gray-100">
            <FaInfoCircle className="w-5 h-5 mr-3 mt-0.5 text-gray-400 flex-shrink-0" />
            <p className="text-sm text-gray-500 italic">{vet.additional_info}</p>
          </div>
        )}
      </div>
    </div>
  );

  const getAnimalIcon = () => {
    const currentAnimal = animalType === "custom" ? customAnimal : animalType;
    if (currentAnimal.toLowerCase().includes("pig")) return <FaPiggyBank className="text-6xl mb-4 mx-auto text-gray-400" />;
    if (currentAnimal.toLowerCase().includes("poultry") || currentAnimal.toLowerCase().includes("chicken")) return <FaEgg className="text-6xl mb-4 mx-auto text-gray-400" />;
    return <FaDog className="text-6xl mb-4 mx-auto text-gray-400" />;
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Animal Type Selection */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Select Animal Type</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <button
            onClick={() => handleAnimalTypeChange("pig")}
            className={`flex items-center justify-center gap-3 p-4 border-2 rounded-lg transition-all duration-200 ${
              animalType === "pig" 
                ? "border-blue-500 bg-blue-50 text-blue-700" 
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
            }`}
          >
            <FaPiggyBank className="text-2xl" />
            <span className="font-semibold">Pig</span>
          </button>

          <button
            onClick={() => handleAnimalTypeChange("poultry")}
            className={`flex items-center justify-center gap-3 p-4 border-2 rounded-lg transition-all duration-200 ${
              animalType === "poultry" 
                ? "border-blue-500 bg-blue-50 text-blue-700" 
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
            }`}
          >
            <FaEgg className="text-2xl" />
            <span className="font-semibold">Poultry</span>
          </button>

          <button
            onClick={() => handleAnimalTypeChange("custom")}
            className={`flex items-center justify-center gap-3 p-4 border-2 rounded-lg transition-all duration-200 ${
              animalType === "custom" 
                ? "border-blue-500 bg-blue-50 text-blue-700" 
                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
            }`}
          >
            <FaPaw className="text-2xl" />
            <span className="font-semibold">Other Animal</span>
          </button>
        </div>

        {animalType === "custom" && (
          <div className="mt-4">
            <label htmlFor="customAnimal" className="block text-sm font-medium text-gray-700 mb-2">
              Enter Animal Type
            </label>
            <input
              type="text"
              id="customAnimal"
              value={customAnimal}
              onChange={handleCustomAnimalChange}
              placeholder="e.g., cow, goat, sheep, etc."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {animalType === "custom" ? customAnimal : animalType} Veterinarians in {city}
          </h1>
          {data.length > 0 && (
            <p className="text-gray-600 mt-1">
              Found {data.length} veterinary clinic{data.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        
        <button
          onClick={fetchVetData}
          disabled={loading || !city || !animalType || (animalType === "custom" && !customAnimal)}
          className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 min-w-[140px] flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <FaSearch />
              Search Again
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-3">
            <FaExclamationTriangle className="text-red-500 text-xl flex-shrink-0" />
            <div>
              <p className="text-red-800 font-medium">{error}</p>
              <div className="mt-2">
                <RetryButton />
              </div>
            </div>
          </div>
        </div>
      )}

      {!hasSearched && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          {getAnimalIcon()}
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            Find the Best Veterinarians
          </h3>
          <p className="text-gray-500">
            Select an animal type to discover veterinary clinics in {city}
          </p>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Searching for veterinary clinics...</p>
          </div>
        </div>
      )}

      {!loading && data.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {data.map((vet, index) => (
            <VetCard key={index} vet={vet} index={index} />
          ))}
        </div>
      )}

      {!loading && hasSearched && data.length === 0 && !error && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          {getAnimalIcon()}
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Veterinary Clinics Found
          </h3>
          <p className="text-gray-500 mb-4">
            We couldn't find any {animalType === "custom" ? customAnimal : animalType} veterinarians in {city}. 
            Try searching a different area or animal type.
          </p>
          <RetryButton />
        </div>
      )}
    </div>
  );
}