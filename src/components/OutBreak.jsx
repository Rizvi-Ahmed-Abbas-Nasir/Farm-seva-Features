import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import {
  MapPin,
  Calendar,
  AlertTriangle,
  Search,
  Filter,
  X,
  Info,
  Shield,
  History,
  Activity,
  ArrowLeft,
  ChevronRight,
  Check,
  RefreshCw,
  AlertOctagon,
  AlertCircle
} from "lucide-react";

const DiseaseAlertsDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // User State & Location
  const [userLocation, setUserLocation] = useState({ state: null, city: null, lat: null, lon: null });
  const [locationStatus, setLocationStatus] = useState('Detecting location...');
  const [isLocationDataLoaded, setIsLocationDataLoaded] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState(['All']);
  const [isLocalOnly, setIsLocalOnly] = useState(false);
  const [customLocation, setCustomLocation] = useState(''); // New state for manual location input
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Google Sheets CSV
  const SHEET_URL = "https://docs.google.com/spreadsheets/d/1GYaSR_EL4c-oKNyiTyx1XOv2aI-ON8WmGJ0G491j35E/export?format=csv";

  useEffect(() => {
    getUserLocation();
    fetchSheetData();
  }, []);

  // Update customLocation defaulting to city/state when location loads
  useEffect(() => {
    if (userLocation.city) {
      setCustomLocation(userLocation.city);
    } else if (userLocation.state) {
      setCustomLocation(userLocation.state);
    }
  }, [userLocation]);

  useEffect(() => {
    if (alerts.length > 0) {
      applyFilters();
    }
  }, [alerts, searchTerm, selectedTypes, isLocalOnly, customLocation, userLocation]);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("Not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();

          const city = data.address.city || data.address.town || data.address.village;
          const state = data.address.state;

          setUserLocation({
            state: state,
            city: city,
            lat: latitude,
            lon: longitude
          });

          if (city) setCustomLocation(city);

          setLocationStatus("Detected");
          setIsLocationDataLoaded(true);
        } catch (err) {
          console.error("Error fetching address:", err);
          setLocationStatus("Unknown");
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        setLocationStatus("Denied");
      }
    );
  };

  const fetchSheetData = () => {
    setLoading(true);
    Papa.parse(SHEET_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        try {
          const validRows = result.data.filter(row => row['DiseaseName'] && row['Type']);
          const parsedData = validRows.map((row, index) => ({
            id: row['OBTID'] || index,
            type: row['Type']?.trim(),
            diseaseName: row['DiseaseName'],
            monthYear: row['MonthYear'],
            locationsEffected: row['Locations Effected'] ? row['Locations Effected'].split(',').map(l => l.trim()) : [],
            updatedDate: row['UpdatedDate'],
            updatedOn: row['UpdatedOn'],
            overview: row['Disease Overview'],
            preventiveMeasure: row['Possible Preventive Measure'],
          }));
          setAlerts(parsedData);
          setFilteredAlerts(parsedData);
        } catch (err) {
          console.error("Parse Error:", err);
          setError("Failed to parse data.");
        } finally {
          setLoading(false);
        }
      },
      error: (err) => {
        console.error("CSV Fetch Error:", err);
        setError("Failed to load outbreak data.");
        setLoading(false);
      }
    });
  };

  const applyFilters = () => {
    let result = alerts;

    // 1. Search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(item =>
        item.diseaseName?.toLowerCase().includes(lowerSearch) ||
        item.overview?.toLowerCase().includes(lowerSearch) ||
        item.locationsEffected.some(loc => loc.toLowerCase().includes(lowerSearch))
      );
    }

    // 2. Type Filter
    if (!selectedTypes.includes('All')) {
      result = result.filter(item => selectedTypes.some(type => item.type?.toLowerCase() === type.toLowerCase()));
    }

    // 3. Location ("Near Me") Filter logic
    if (isLocalOnly && customLocation) {
      const filterLoc = customLocation.toLowerCase().trim();
      result = result.filter(item => {
        return item.locationsEffected.some(loc =>
          loc.toLowerCase().includes(filterLoc)
        );
      });
    }

    setFilteredAlerts(result);
  };

  const isUserAffected = (alert) => {
    // Check against user actual location OR custom entered location
    const checkLoc = customLocation || userLocation.state || '';
    if (!checkLoc) return false;

    return alert.locationsEffected.some(loc =>
      loc.toLowerCase().includes(checkLoc.toLowerCase())
    );
  };

  const toggleTypeFilter = (type) => {
    if (type === 'All') {
      setSelectedTypes(['All']);
    } else {
      let newTypes = selectedTypes.filter(t => t !== 'All');
      if (newTypes.includes(type)) {
        newTypes = newTypes.filter(t => t !== type);
      } else {
        newTypes.push(type);
      }
      if (newTypes.length === 0) newTypes = ['All'];
      setSelectedTypes(newTypes);
    }
  };

  // Helper to get severity styles
  const getSeverityStyle = (type) => {
    const t = type?.toLowerCase() || '';
    if (t.includes('outbreak') || t.includes('critical')) {
      return {
        gradient: 'from-red-500 to-red-600',
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-700',
        iconColor: 'text-red-600',
        badgeBg: 'bg-red-100',
        label: 'Severe Outbreak'
      };
    }
    if (t.includes('warning') || t.includes('high')) {
      return {
        gradient: 'from-yellow-400 to-orange-500',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-800',
        iconColor: 'text-amber-600',
        badgeBg: 'bg-amber-100',
        label: 'Warning'
      };
    }
    return {
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      iconColor: 'text-blue-600',
      badgeBg: 'bg-blue-100',
      label: 'Advisory'
    };
  };

  const openModal = (alert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  const Modal = ({ alert, onClose }) => {
    if (!alert) return null;
    const isRisk = isUserAffected(alert);
    const styles = getSeverityStyle(alert.type);

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
          {/* Header with Severity Gradient */}
          <div className={`relative p-8 text-white bg-gradient-to-r ${styles.gradient}`}>
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider bg-black/20 rounded-full shadow-sm backdrop-blur-md">
                {styles.label}
              </span>
              {isRisk && (
                <span className="px-4 py-1.5 text-xs font-bold uppercase bg-white text-red-600 rounded-full flex items-center gap-1 animate-pulse shadow-sm">
                  <AlertTriangle size={14} /> Near You
                </span>
              )}
            </div>
            <h2 className="text-4xl font-bold mb-2 tracking-tight">{alert.diseaseName}</h2>
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium opacity-90 mt-4">
              <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg"><Calendar size={16} /> {alert.monthYear}</span>
              <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg"><MapPin size={16} /> {alert.locationsEffected.length} Locations</span>
            </div>
          </div>

          <div className="p-8 space-y-8">
            <section>
              <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4">
                <Info className="text-blue-600" size={24} /> Disease Overview
              </h3>
              <p className="text-gray-700 text-lg leading-relaxed bg-blue-50 p-6 rounded-2xl border border-blue-100 shadow-sm">
                {alert.overview || "No detailed overview available."}
              </p>
            </section>

            <section>
              <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4">
                <MapPin className="text-red-500" size={24} /> Affected Locations
              </h3>
              <div className="flex flex-wrap gap-2">
                {alert.locationsEffected.map((loc, i) => {
                  const checkLoc = customLocation || userLocation.state || '';
                  const isMatch = checkLoc && loc.toLowerCase().includes(checkLoc.toLowerCase());
                  return (
                    <span
                      key={i}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${isMatch
                          ? "bg-red-500 text-white shadow-md transform scale-105"
                          : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                    >
                      {loc}
                    </span>
                  );
                })}
              </div>
            </section>

            <section>
              <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 mb-4">
                <Shield className="text-green-600" size={24} /> Preventive Measures
              </h3>
              <div className="bg-green-50 p-8 rounded-2xl border border-green-100 prose prose-lg prose-green max-w-none text-gray-700 shadow-sm">
                {alert.preventiveMeasure ? alert.preventiveMeasure : "Consult a veterinarian for tailored advice."}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-8 font-sans">
      <div className="max-w-[1600px] mx-auto">
        <button className="flex items-center text-blue-600 mb-8 font-medium hover:underline text-lg transition-colors">
          <ArrowLeft size={24} className="mr-2" /> Back
        </button>

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

          {/* LEFT SIDEBAR FILTERS */}
          <div className="w-full md:w-1/4 flex-shrink-0">
            <div className="sticky top-6 bg-white rounded-2xl shadow-sm p-8 border border-neutral-100">

              {/* Header */}
              <div className="flex items-center justify-between mb-8 border-b border-neutral-100 pb-6">
                <h2 className="text-2xl font-bold text-neutral-800">Filter By</h2>
                <button
                  onClick={() => {
                    setIsLocalOnly(false);
                    setCustomLocation(userLocation.city || userLocation.state || '');
                    setSelectedTypes(['All']);
                    setSearchTerm('');
                  }}
                  className="text-sm text-green-600 font-bold uppercase tracking-wide hover:text-green-700 transition-colors"
                >
                  Reset
                </button>
              </div>

              {/* Near Me Toggle & INPUT */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4 text-neutral-800 font-bold">
                  <h3 className="text-lg">Location</h3>
                  <MapPin size={20} className="text-green-600" />
                </div>

                <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-neutral-700 font-bold">Show Near Me</span>
                    <button
                      onClick={() => setIsLocalOnly(!isLocalOnly)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${isLocalOnly ? 'bg-green-600' : 'bg-neutral-300'
                        }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isLocalOnly ? 'translate-x-6' : 'translate-x-1'
                          }`}
                      />
                    </button>
                  </div>

                  {/* Manual Location Input - Shows when Toggle is ON */}
                  {isLocalOnly && (
                    <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                      <label className="text-xs font-bold text-neutral-500 uppercase tracking-wide mb-1 block">
                        Filter by City/State
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={customLocation}
                          onChange={(e) => setCustomLocation(e.target.value)}
                          placeholder="e.g. Mumbai"
                          className="w-full pl-8 pr-3 py-2 rounded-lg border border-neutral-300 text-sm font-bold text-neutral-800 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                        />
                        <MapPin size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                      </div>
                      <p className="text-xs text-neutral-500 mt-2">
                        Showing alerts matching this location.
                      </p>
                    </div>
                  )}

                  {!isLocalOnly && (
                    <p className="text-xs text-neutral-500 leading-snug">
                      Enable to filter alerts detected in your area.
                    </p>
                  )}
                </div>
              </div>

              {/* Animal Type Filter */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4 text-neutral-800 font-bold">
                  <h3 className="text-lg">Animal Type</h3>
                  <ChevronRight size={20} className="rotate-90 text-green-600" />
                </div>
                <div className="space-y-3 pl-1">
                  {['All', 'Pig', 'Poultry'].map(type => (
                    <label key={type} className="flex items-center gap-4 cursor-pointer group p-2 rounded-lg hover:bg-neutral-50 transition-colors">
                      <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${selectedTypes.includes(type)
                          ? "bg-green-600 border-green-600 shadow-sm"
                          : "border-2 border-neutral-300 bg-white group-hover:border-green-400"
                        }`}>
                        {selectedTypes.includes(type) && <Check size={14} className="text-white" />}
                      </div>
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleTypeFilter(type)}
                      />
                      <span className={`text-base transition-colors ${selectedTypes.includes(type) ? "text-neutral-900 font-bold" : "text-neutral-600 group-hover:text-green-700"
                        }`}>
                        {type} Farming
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Status Badge */}
              <div className="mt-8 pt-6 border-t border-neutral-100">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">
                    <MapPin size={12} /> Detected Location
                  </div>
                  {userLocation.state ? (
                    <p className="text-blue-900 font-bold text-lg">
                      {userLocation.city}, {userLocation.state}
                    </p>
                  ) : (
                    <p className="text-blue-400 italic text-sm">{locationStatus}</p>
                  )}
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="flex-grow">

            {/* Warning Banner */}
            {isLocationDataLoaded && filteredAlerts.some(a => isUserAffected(a)) && !isLocalOnly && (
              <div className="mb-8 bg-red-50 border border-red-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 animate-in slide-in-from-top duration-500 shadow-sm ring-1 ring-red-100">
                <div className="bg-white p-3 rounded-full text-red-600 shadow-md">
                  <Activity size={32} className="animate-pulse" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xl font-bold text-red-800 mb-1">Warning: Disease detected in {customLocation || userLocation.state}</h3>
                  <p className="text-red-600/80 font-medium">Outbreaks have been reported in this vicinity. Review alerts immediately.</p>
                </div>
                <button
                  onClick={() => setIsLocalOnly(true)}
                  className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-red-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  View Near Me
                </button>
              </div>
            )}

            {/* Search Bar */}
            <div className="relative mb-8 group">
              <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 flex items-center overflow-hidden transition-all group-hover:shadow-md group-hover:border-green-200">
                <div className="pl-6 text-neutral-400 group-hover:text-green-600 transition-colors">
                  <Search size={24} />
                </div>
                <input
                  type="text"
                  placeholder="Search for diseases, symptoms, or locations..."
                  className="w-full py-5 px-6 text-xl text-neutral-700 focus:outline-none placeholder-neutral-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="bg-green-700 text-white p-5 hover:bg-green-800 transition-colors">
                  <Search size={28} />
                </button>
              </div>
              <p className="text-sm text-neutral-500 mt-3 flex items-center gap-2 pl-2">
                <Info size={16} />
                Try searching for specific terms like "Swine Flu" or "Assam".
              </p>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-2">
                <span className="text-neutral-600 text-lg">Found <span className="font-bold text-neutral-900 bg-white px-3 py-1 rounded-lg border border-neutral-200 shadow-sm ml-1">{filteredAlerts.length}</span> active alerts</span>
                {isLocalOnly && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-bold animate-in fade-in flex items-center gap-1">
                    <MapPin size={12} fill="currentColor" /> {customLocation}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-neutral-500 font-medium text-sm uppercase tracking-wide">Sort By</span>
                <select className="bg-white border border-neutral-200 text-neutral-700 text-sm font-bold rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer shadow-sm">
                  <option>Relevance</option>
                  <option>Newest First</option>
                  <option>High Severity</option>
                </select>
              </div>
            </div>

            {/* Card Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-neutral-100 shadow-sm">
                <RefreshCw className="animate-spin text-green-500 mb-6" size={48} />
                <p className="text-neutral-500 font-bold text-lg">Fetching latest outbreak data...</p>
                <p className="text-neutral-400 text-sm mt-2">Connecting to live database</p>
              </div>
            ) : filteredAlerts.length === 0 ? (
              <div className="text-center py-32 bg-white rounded-3xl border border-neutral-200 border-dashed">
                <div className="bg-neutral-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="text-neutral-300" size={32} />
                </div>
                <h3 className="text-xl font-bold text-neutral-800 mb-2">No alerts found</h3>
                <p className="text-neutral-500 max-w-sm mx-auto mb-6">
                  {isLocalOnly
                    ? `Great news! No disease outbreaks reported in "${customLocation}".`
                    : "We couldn't find any disease alerts matching your search criteria."}
                </p>
                <button onClick={() => { setSearchTerm(''); setSelectedTypes(['All']); setIsLocalOnly(false); }} className="bg-green-50 text-green-700 px-6 py-2 rounded-full font-bold hover:bg-green-100 transition-colors">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAlerts.map((alert, index) => {
                  const isRisk = isUserAffected(alert);
                  const styles = getSeverityStyle(alert.type);

                  return (
                    <div
                      key={index}
                      onClick={() => openModal(alert)}
                      className={`bg-white rounded-2xl p-6 shadow-sm border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group flex flex-col justify-between relative overflow-hidden ${isRisk ? "border-red-200 ring-4 ring-red-50" : "border-neutral-200 hover:border-green-200"
                        }`}
                    >
                      {/* Card Content */}
                      <div>
                        <div className="flex justify-between items-start mb-4 relative z-10">
                          <div>
                            {isRisk ? (
                              <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-700 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 animate-pulse shadow-sm">
                                <AlertTriangle size={12} fill="currentColor" /> Critical Risk
                              </span>
                            ) : (
                              <span className={`inline-flex items-center gap-1.5 ${styles.badgeBg} ${styles.text} px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-3 shadow-sm`}>
                                {styles.label === 'Warning' ? <AlertOctagon size={12} /> : <AlertCircle size={12} />}
                                {styles.label}
                              </span>
                            )}

                            <h3 className="text-2xl font-bold text-neutral-900 mb-2 group-hover:text-green-700 transition-colors line-clamp-2 leading-tight">
                              {alert.diseaseName}
                            </h3>

                            <div className="flex items-center gap-3 text-xs font-bold text-neutral-400 uppercase tracking-wide">
                              <span>{alert.type}</span>
                              <span>•</span>
                              <span>{alert.monthYear}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mb-6 bg-neutral-50 p-4 rounded-xl border border-neutral-100 group-hover:bg-green-50/30 group-hover:border-green-100 transition-colors">
                          <p className="text-neutral-600 line-clamp-3 leading-relaxed text-sm font-medium">
                            {alert.overview || "No overview available."}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {alert.locationsEffected.slice(0, 3).map((loc, i) => (
                            <span key={i} className="px-3 py-1 bg-white border border-neutral-200 text-neutral-600 rounded-full text-xs font-bold shadow-sm">
                              {loc}
                            </span>
                          ))}
                          {alert.locationsEffected.length > 3 && (
                            <span className="px-3 py-1 bg-neutral-100 text-neutral-500 rounded-full text-xs font-bold">
                              +{alert.locationsEffected.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-neutral-100 mt-auto">
                        <span className="text-xs text-neutral-300 font-mono font-bold">ID: {alert.id}</span>
                        <span className="bg-neutral-900 text-white p-2 rounded-full group-hover:bg-green-600 transition-colors shadow-md">
                          <ChevronRight size={16} />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>
      </div>

      {isModalOpen && selectedAlert && <Modal alert={selectedAlert} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default DiseaseAlertsDashboard;