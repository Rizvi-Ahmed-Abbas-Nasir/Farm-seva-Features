import React, { useState, useEffect } from "react";
import { 
  FaSearch, FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaw, 
  FaInfoCircle, FaStar, FaExclamationTriangle, FaDog, 
  FaSyncAlt, FaPiggyBank, FaEgg, FaShieldAlt, FaStore, 
  FaClock, FaCheckCircle, FaHistory, FaBookmark, 
  FaExternalLinkAlt, FaChevronRight, FaHeart, FaShareAlt,
  FaCalendarAlt, FaUserMd, FaAmbulance, FaTag, 
  FaThumbsUp, FaComment, FaDirections, FaBookOpen,
  FaFilter, FaTimes, FaCheckSquare, FaSquare
} from "react-icons/fa";
import { MdVerified, MdEmergency, MdLocalHospital } from "react-icons/md";

export default function VetList({ city = "mumbai" }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [animalType, setAnimalType] = useState("pig");
  const [customAnimal, setCustomAnimal] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [savedContacts, setSavedContacts] = useState([]);
  const [contactedContacts, setContactedContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState({
    emergency: false,
    openNow: false,
    highRating: false
  });

  useEffect(() => {
    if (city && animalType) {
      fetchVetData();
    }
  }, [city, animalType]);

  useEffect(() => {
    // Load saved and contacted contacts from localStorage
    const saved = localStorage.getItem('savedVetContacts');
    const contacted = localStorage.getItem('contactedVetContacts');
    if (saved) setSavedContacts(JSON.parse(saved));
    if (contacted) setContactedContacts(JSON.parse(contacted));
  }, []);

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

      if (!result.output) {
        throw new Error("Invalid response format from server");
      }

      let jsonString = result.output
        .replace(/```json\s*/, "")
        .replace(/\s*```$/, "")
        .replace(/\\"/g, '"')
        .replace(/\\n/g, '')
        .trim();

      const parsedData = JSON.parse(jsonString);
      
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

  const handleSaveContact = (contact) => {
    const updatedSaved = [...savedContacts];
    const index = updatedSaved.findIndex(c => c.name === contact.name);
    
    if (index > -1) {
      updatedSaved.splice(index, 1);
    } else {
      updatedSaved.push(contact);
    }
    
    setSavedContacts(updatedSaved);
    localStorage.setItem('savedVetContacts', JSON.stringify(updatedSaved));
  };

  const handleContactCheckbox = (contact) => {
    const updatedContacted = [...contactedContacts];
    const index = updatedContacted.findIndex(c => c.name === contact.name);
    
    if (index > -1) {
      updatedContacted.splice(index, 1);
    } else {
      updatedContacted.push({
        ...contact,
        contactedAt: new Date().toISOString()
      });
    }
    
    setContactedContacts(updatedContacted);
    localStorage.setItem('contactedVetContacts', JSON.stringify(updatedContacted));
  };

  const handleViewDetails = (contact) => {
    setSelectedContact(contact);
    setShowDetailModal(true);
  };

  const handleFilterChange = (filterName) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const filteredData = data.filter(item => {
    if (activeTab === "saved") {
      return savedContacts.some(c => c.name === item.name);
    }
    if (activeTab === "contacted") {
      return contactedContacts.some(c => c.name === item.name);
    }
    if (activeTab === "government") {
      return item.Type === "Govt" || item.Type === "Non-Govt/NGO";
    }
    if (activeTab === "local") {
      return item.Type === "Local";
    }
    
    // Apply filters
    if (activeFilters.emergency && item.Active !== "24/7") return false;
    if (activeFilters.openNow && !item.Active?.toLowerCase().includes("now")) return false;
    if (activeFilters.highRating && (!item.rating || parseFloat(item.rating) < 4.0)) return false;
    
    return true;
  });

  const govtContacts = filteredData.filter(item => item.Type === "Govt" || item.Type === "Non-Govt/NGO");
  const localContacts = filteredData.filter(item => item.Type === "Local");

  const RetryButton = () => (
    <button
      onClick={fetchVetData}
      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-8 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
    >
      <FaSyncAlt className="animate-spin-on-hover" />
      Try Again
    </button>
  );

  const ContactCard = ({ contact, index }) => {
    const isSaved = savedContacts.some(c => c.name === contact.name);
    const isContacted = contactedContacts.some(c => c.name === contact.name);
    const isGovt = contact.Type === "Govt" || contact.Type === "Non-Govt/NGO";
    const isEmergency = contact.Active === "24/7";
    const rating = parseFloat(contact.rating) || 0;
    const isOpenNow = contact.Active?.toLowerCase().includes("now") || contact.Active?.toLowerCase().includes("24/7");

    return (
      <div
        key={index}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-200 p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group"
      >
        {/* Status Indicators */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {isEmergency && (
            <div className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg">
              <MdEmergency className="text-lg" />
              <span>24/7</span>
            </div>
          )}
          {isOpenNow && !isEmergency && (
            <div className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              <FaClock className="text-xs" />
              <span>Open Now</span>
            </div>
          )}
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl shadow-md ${isGovt ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}>
              {isGovt ? <FaShieldAlt className="text-white text-2xl" /> : <FaStore className="text-white text-2xl" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {contact.name}
                </h3>
                {contact.rating && contact.rating !== "Not applicable" && (
                  <div className="flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-lg">
                    <FaStar className="text-xs" />
                    <span className="font-bold text-sm">{rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  isGovt 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {isGovt ? (contact.Type === "Non-Govt/NGO" ? "NGO" : "GOVERNMENT") : "LOCAL BUSINESS"}
                </span>
                {contact.link && (
                  <a 
                    href={contact.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <FaExternalLinkAlt className="text-xs" />
                    Official Link
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4 mb-6">
          {contact.phone && contact.phone !== "Not provided" && (
            <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 shadow-sm">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 rounded-lg shadow-sm">
                <FaPhone className="text-white" />
              </div>
              <div className="flex-1">
                <a 
                  href={`tel:${contact.phone}`}
                  className="text-blue-700 hover:text-blue-900 font-semibold text-lg"
                >
                  {contact.phone}
                </a>
                <p className="text-xs text-gray-500 mt-1">Click to call</p>
              </div>
            </div>
          )}

          {contact.address && contact.address !== "Not specified" && (
            <div className="flex items-start gap-3">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-2 rounded-lg shadow-sm mt-0.5">
                <FaMapMarkerAlt className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-gray-700 font-medium">{contact.address}</p>
                <button className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-1">
                  <FaDirections className="text-xs" />
                  Get Directions
                </button>
              </div>
            </div>
          )}

          {contact.Active && (
            <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-3 border border-emerald-200">
              <FaClock className="text-emerald-600 text-lg" />
              <div>
                <span className="text-emerald-800 font-semibold">{contact.Active}</span>
                <p className="text-xs text-emerald-600 mt-1">Availability Status</p>
              </div>
            </div>
          )}
        </div>

        {/* Animal Types */}
        {contact.animal_types && contact.animal_types.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <FaPaw className="text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">Specializes In:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {contact.animal_types.map((type, idx) => (
                <span
                  key={idx}
                  className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSaveContact(contact)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isSaved 
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <FaHeart className={isSaved ? 'text-xl' : 'text-lg'} />
            </button>
            
            <button
              onClick={() => handleContactCheckbox(contact)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                isContacted
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {isContacted ? <FaCheckSquare className="text-lg" /> : <FaSquare className="text-lg" />}
              <span className="text-sm font-medium">{isContacted ? "Contacted" : "Mark as Contacted"}</span>
            </button>
          </div>
          
          <button
            onClick={() => handleViewDetails(contact)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl group/btn"
          >
            <span>View Details</span>
            <FaChevronRight className="group-hover/btn:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    );
  };

  const DetailModal = ({ contact, onClose }) => {
    const isSaved = savedContacts.some(c => c.name === contact.name);
    const isContacted = contactedContacts.some(c => c.name === contact.name);
    const isGovt = contact.Type === "Govt" || contact.Type === "Non-Govt/NGO";

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
        <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
          {/* Modal Header */}
          <div className={`p-6 ${isGovt ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                  {isGovt ? <FaShieldAlt className="text-white text-3xl" /> : <FaStore className="text-white text-3xl" />}
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-white">{contact.name}</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="bg-white/30 px-4 py-1 rounded-full text-sm font-semibold text-white backdrop-blur-sm">
                      {isGovt ? (contact.Type === "Non-Govt/NGO" ? "NGO" : "GOVERNMENT") : "LOCAL BUSINESS"}
                    </span>
                    {contact.rating && contact.rating !== "Not applicable" && (
                      <div className="flex items-center gap-2 bg-white/30 px-3 py-1 rounded-full backdrop-blur-sm">
                        <FaStar className="text-yellow-300" />
                        <span className="font-bold text-white">{contact.rating}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 p-3 rounded-xl transition-colors duration-300 backdrop-blur-sm"
              >
                <FaTimes className="text-white text-xl" />
              </button>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column - Contact Info */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <FaPhone className="text-blue-600" />
                    Contact Information
                  </h3>
                  <div className="space-y-4">
                    {contact.phone && contact.phone !== "Not provided" && (
                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-lg">
                          <FaPhone className="text-white text-xl" />
                        </div>
                        <div>
                          <a 
                            href={`tel:${contact.phone}`}
                            className="text-2xl font-bold text-blue-700 hover:text-blue-900"
                          >
                            {contact.phone}
                          </a>
                          <p className="text-sm text-gray-600 mt-1">Available for calls</p>
                        </div>
                      </div>
                    )}

                    {contact.email && contact.email !== "" && (
                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl">
                        <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-3 rounded-lg">
                          <FaEnvelope className="text-white text-xl" />
                        </div>
                        <div>
                          <a 
                            href={`mailto:${contact.email}`}
                            className="text-xl font-semibold text-purple-700 hover:text-purple-900"
                          >
                            {contact.email}
                          </a>
                          <p className="text-sm text-gray-600 mt-1">Send email</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {contact.address && contact.address !== "Not specified" && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                      <FaMapMarkerAlt className="text-red-600" />
                      Location
                    </h3>
                    <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl">
                      <p className="text-lg text-gray-800 font-medium">{contact.address}</p>
                      <button className="mt-4 flex items-center gap-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl">
                        <FaDirections />
                        Get Directions on Maps
                      </button>
                    </div>
                  </div>
                )}

                {contact.Active && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                      <FaClock className="text-green-600" />
                      Availability
                    </h3>
                    <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${contact.Active === "24/7" ? 'bg-gradient-to-r from-red-500 to-red-600' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}>
                          {contact.Active === "24/7" ? <MdEmergency className="text-white text-2xl" /> : <FaClock className="text-white text-2xl" />}
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-gray-900">{contact.Active}</p>
                          <p className="text-sm text-gray-600 mt-1">Current status</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Additional Info */}
              <div className="space-y-6">
                {contact.animal_types && contact.animal_types.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                      <FaPaw className="text-indigo-600" />
                      Specializations
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {contact.animal_types.map((type, idx) => (
                        <span
                          key={idx}
                          className="bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-800 px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-shadow duration-300"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {contact.additional_info && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                      <FaInfoCircle className="text-amber-600" />
                      Additional Information
                    </h3>
                    <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl">
                      <p className="text-gray-700 leading-relaxed">{contact.additional_info}</p>
                    </div>
                  </div>
                )}

                {contact.link && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                      <FaExternalLinkAlt className="text-blue-600" />
                      Official Links
                    </h3>
                    <a 
                      href={contact.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 hover:text-blue-900 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg border border-blue-200"
                    >
                      <FaExternalLinkAlt />
                      Visit Official Website
                    </a>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-6">
                  <button
                    onClick={() => handleSaveContact(contact)}
                    className={`flex-1 flex items-center justify-center gap-3 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                      isSaved
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                        : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:shadow-lg'
                    }`}
                  >
                    {isSaved ? <FaHeart /> : <FaHeart className="text-gray-400" />}
                    {isSaved ? "Saved" : "Save Contact"}
                  </button>
                  
                  <button
                    onClick={() => handleContactCheckbox(contact)}
                    className={`flex-1 flex items-center justify-center gap-3 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${
                      isContacted
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                        : 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 hover:shadow-lg'
                    }`}
                  >
                    {isContacted ? <FaCheckSquare /> : <FaSquare />}
                    {isContacted ? "Contacted ✓" : "Mark as Contacted"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <MdVerified className="text-green-600 text-xl" />
                <span className="font-medium">Information Verified</span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${contact.name} - ${contact.phone || ''} - ${contact.address || ''}`);
                  alert('Contact information copied to clipboard!');
                }}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <FaShareAlt />
                Share Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const getAnimalIcon = () => {
    const currentAnimal = animalType === "custom" ? customAnimal : animalType;
    if (currentAnimal.toLowerCase().includes("pig")) return <FaPiggyBank className="text-7xl mb-4 mx-auto text-blue-400" />;
    if (currentAnimal.toLowerCase().includes("poultry") || currentAnimal.toLowerCase().includes("chicken")) return <FaEgg className="text-7xl mb-4 mx-auto text-orange-400" />;
    return <FaDog className="text-7xl mb-4 mx-auto text-purple-400" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
            🐾 Veterinary Connect
          </h1>
          <p className="text-gray-600 text-lg">Your trusted network for animal healthcare in {city}</p>
        </div>

        {/* Animal Type Selection */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <FaPaw className="text-blue-600" />
            Select Animal Type
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <button
              onClick={() => handleAnimalTypeChange("pig")}
              className={`flex items-center justify-center gap-3 p-5 border-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                animalType === "pig" 
                  ? "border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-700 shadow-lg" 
                  : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:shadow-md"
              }`}
            >
              <FaPiggyBank className="text-3xl" />
              <span className="font-bold text-lg">Pig</span>
            </button>

            <button
              onClick={() => handleAnimalTypeChange("poultry")}
              className={`flex items-center justify-center gap-3 p-5 border-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                animalType === "poultry" 
                  ? "border-orange-500 bg-gradient-to-br from-orange-50 to-yellow-50 text-orange-700 shadow-lg" 
                  : "border-gray-200 bg-white text-gray-700 hover:border-orange-300 hover:shadow-md"
              }`}
            >
              <FaEgg className="text-3xl" />
              <span className="font-bold text-lg">Poultry</span>
            </button>

            <button
              onClick={() => handleAnimalTypeChange("custom")}
              className={`flex items-center justify-center gap-3 p-5 border-2 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                animalType === "custom" 
                  ? "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 text-purple-700 shadow-lg" 
                  : "border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:shadow-md"
              }`}
            >
              <FaPaw className="text-3xl" />
              <span className="font-bold text-lg">Other Animal</span>
            </button>
          </div>

          {animalType === "custom" && (
            <div className="mt-6 animate-fadeIn">
              <label htmlFor="customAnimal" className="block text-sm font-semibold text-gray-700 mb-2">
                Enter Animal Type
              </label>
              <input
                type="text"
                id="customAnimal"
                value={customAnimal}
                onChange={handleCustomAnimalChange}
                placeholder="e.g., cow, goat, sheep, buffalo..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 text-lg"
              />
            </div>
          )}
          
          <button
            onClick={fetchVetData}
            disabled={loading || !city || !animalType || (animalType === "custom" && !customAnimal)}
            className="mt-6 w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl transform hover:scale-105 disabled:transform-none"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                <span className="text-lg">Searching...</span>
              </>
            ) : (
              <>
                <FaSearch className="text-xl" />
                <span className="text-lg">Find Veterinary Services</span>
              </>
            )}
          </button>
        </div>

        {/* Tabs Navigation */}
        {hasSearched && data.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Browse Contacts</h2>
                <div className="flex items-center gap-2">
                  <FaFilter className="text-gray-500" />
                  <span className="text-sm text-gray-600">Filters</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(activeFilters).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => handleFilterChange(key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      value
                        ? key === 'emergency' 
                          ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                          : key === 'openNow'
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                            : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {key === 'emergency' && <MdEmergency />}
                    {key === 'openNow' && <FaClock />}
                    {key === 'highRating' && <FaStar />}
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </button>
                ))}
              </div>

              <div className="flex space-x-4 border-b border-gray-200 overflow-x-auto pb-2">
                {[
                  { id: "all", label: "All Contacts", icon: <FaPaw />, count: filteredData.length },
                  { id: "government", label: "Government", icon: <FaShieldAlt />, count: govtContacts.length },
                  { id: "local", label: "Local", icon: <FaStore />, count: localContacts.length },
                  { id: "saved", label: "Saved", icon: <FaHeart />, count: savedContacts.length },
                  { id: "contacted", label: "History", icon: <FaHistory />, count: contactedContacts.length }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-5 py-3 rounded-xl whitespace-nowrap transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {tab.icon}
                    <span className="font-semibold">{tab.label}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      activeTab === tab.id ? 'bg-white/30 text-white' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-center gap-4">
              <FaExclamationTriangle className="text-red-500 text-3xl flex-shrink-0" />
              <div>
                <p className="text-red-800 font-semibold text-lg">{error}</p>
                <div className="mt-3">
                  <RetryButton />
                </div>
              </div>
            </div>
          </div>
        )}

        {!hasSearched && !loading && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            {getAnimalIcon()}
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Discover Trusted Veterinary Services
            </h3>
            <p className="text-gray-600 text-lg">
              Select an animal type above to find specialized care in {city}
            </p>
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
              <p className="text-gray-700 text-xl font-semibold">Searching for veterinary services...</p>
            </div>
          </div>
        )}

        {!loading && hasSearched && filteredData.length > 0 && (
          <div className="space-y-8">
            {/* Results Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {activeTab === "all" ? "All Veterinary Services" :
                     activeTab === "government" ? "Government & NGO Services" :
                     activeTab === "local" ? "Local Veterinary Clinics" :
                     activeTab === "saved" ? "Saved Contacts" :
                     "Contact History"}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Showing {filteredData.length} services in {city}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Saved</p>
                    <p className="text-xl font-bold text-blue-600">{savedContacts.length}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Contacted</p>
                    <p className="text-xl font-bold text-green-600">{contactedContacts.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contacts Grid */}
            <div className="grid gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {filteredData.map((contact, index) => (
                <ContactCard key={index} contact={contact} index={index} />
              ))}
            </div>
          </div>
        )}

        {!loading && hasSearched && filteredData.length === 0 && !error && (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            {getAnimalIcon()}
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              No Services Found
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              We couldn't find any {animalType === "custom" ? customAnimal : animalType} veterinary services in {city}.
            </p>
            <RetryButton />
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedContact && (
        <DetailModal 
          contact={selectedContact} 
          onClose={() => setShowDetailModal(false)} 
        />
      )}

      {/* Add some custom styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-spin-on-hover:hover {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .max-h-60vh {
          max-height: 60vh;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
}