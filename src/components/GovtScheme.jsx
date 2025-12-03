import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { 
  ExternalLink, 
  ArrowLeft, 
  Calendar, 
  PiggyBank, 
  Bird,
  Globe,
  Building,
  IndianRupee,
  Shield,
  FileCheck,
  ClipboardList,
  Users,
  Home,
  Search,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Download,
  Info,
  Clock,
  CheckSquare,
  X,
  Star,
  Award,
  Target,
  MapPin,
  History,
  FileText,
  CheckCircle,
  Clock as ClockIcon,
  XCircle
} from "lucide-react";

export default function GovtScheme() {
  const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/11oh6nVyIGXoy9oTfA_UWgAD3JxCvVeO0K4n9ncqVeyw/export?format=csv";

  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [selectedAnimalFilter, setSelectedAnimalFilter] = useState("All");
  const [currentView, setCurrentView] = useState("list");
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedSchemes, setSavedSchemes] = useState([]);
  const [appliedSchemes, setAppliedSchemes] = useState([]);
  const [activeTab, setActiveTab] = useState("all"); // "all", "saved", "applied"

  useEffect(() => {
    Papa.parse(SHEET_URL, {
      download: true,
      header: true,
      complete: (result) => {
        const data = result.data.slice(2);
        setSchemes(data);
        setFilteredSchemes(data);
      },
    });

    // Load applied schemes from localStorage
    const savedApplied = localStorage.getItem('appliedSchemes');
    if (savedApplied) {
      setAppliedSchemes(JSON.parse(savedApplied));
    }
  }, []);

  useEffect(() => {
    // Save applied schemes to localStorage
    localStorage.setItem('appliedSchemes', JSON.stringify(appliedSchemes));
  }, [appliedSchemes]);

  useEffect(() => {
    let filtered = schemes;
    
    if (selectedAnimalFilter !== "All") {
      filtered = filtered.filter(scheme => {
        const schemeName = scheme["Govt Scheme Name"]?.toLowerCase() || "";
        const schemeDescription = scheme["Scheme Description"]?.toLowerCase() || "";
        
        if (selectedAnimalFilter === "Pig") {
          return schemeName.includes("pig") || 
                 schemeName.includes("swine") ||
                 schemeDescription.includes("pig") || 
                 schemeDescription.includes("swine");
        }
        
        if (selectedAnimalFilter === "Poultry") {
          return schemeName.includes("poultry") || 
                 schemeName.includes("chicken") ||
                 schemeName.includes("hen") ||
                 schemeDescription.includes("poultry") || 
                 schemeDescription.includes("chicken") ||
                 schemeDescription.includes("hen");
        }
        
        return true;
      });
    }
    
    if (searchQuery) {
      filtered = filtered.filter(scheme => {
        const searchLower = searchQuery.toLowerCase();
        return (
          scheme["Govt Scheme Name"]?.toLowerCase().includes(searchLower) ||
          scheme["Scheme Description"]?.toLowerCase().includes(searchLower) ||
          scheme["Ministry / Department Name"]?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Filter by active tab
    if (activeTab === "saved") {
      filtered = filtered.filter(scheme => 
        savedSchemes.includes(scheme["Govt Scheme Name"])
      );
    } else if (activeTab === "applied") {
      const appliedSchemeNames = appliedSchemes.map(app => app.schemeName);
      filtered = filtered.filter(scheme => 
        appliedSchemeNames.includes(scheme["Govt Scheme Name"])
      );
    }
    
    setFilteredSchemes(filtered);
  }, [selectedAnimalFilter, schemes, searchQuery, savedSchemes, appliedSchemes, activeTab]);

  const handleViewDetails = (scheme) => {
    setSelectedScheme(scheme);
    setCurrentView("detail");
    window.scrollTo(0, 0);
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedScheme(null);
    window.scrollTo(0, 0);
  };

  const handleSaveScheme = (schemeId) => {
    let updatedSaved;
    if (savedSchemes.includes(schemeId)) {
      updatedSaved = savedSchemes.filter(id => id !== schemeId);
    } else {
      updatedSaved = [...savedSchemes, schemeId];
    }
    setSavedSchemes(updatedSaved);
  };

  const handleApplyStatus = (schemeName, status) => {
    const existingIndex = appliedSchemes.findIndex(app => app.schemeName === schemeName);
    
    let updatedApplied;
    if (existingIndex >= 0) {
      updatedApplied = [...appliedSchemes];
      updatedApplied[existingIndex] = {
        ...updatedApplied[existingIndex],
        status,
        updatedAt: new Date().toISOString()
      };
    } else {
      updatedApplied = [
        ...appliedSchemes,
        {
          schemeName,
          status,
          appliedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }
    
    setAppliedSchemes(updatedApplied);
  };

  const getAppliedStatus = (schemeName) => {
    const applied = appliedSchemes.find(app => app.schemeName === schemeName);
    return applied ? applied.status : null;
  };

  const animalFilters = [
    { id: "All", label: "All Schemes", icon: <Globe size={28} /> },
    { id: "Pig", label: "Pig Farming", icon: <PiggyBank size={28} /> },
    { id: "Poultry", label: "Poultry Farming", icon: <Bird size={28} /> }
  ];

  if (currentView === "detail" && selectedScheme) {
    return <SchemeDetailPage 
      scheme={selectedScheme} 
      onBack={handleBackToList} 
      isSaved={savedSchemes.includes(selectedScheme["Govt Scheme Name"])}
      onSaveToggle={() => handleSaveScheme(selectedScheme["Govt Scheme Name"])}
      appliedStatus={getAppliedStatus(selectedScheme["Govt Scheme Name"])}
      onApplyStatusChange={(status) => handleApplyStatus(selectedScheme["Govt Scheme Name"], status)}
    />;
  }

  return (
    <div className="min-h-screen p-12 bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-8xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-neutral-900 rounded-3xl flex items-center justify-center">
                <Home size={36} className="text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold text-neutral-900 tracking-tight">
                  FarmSeva
                </h1>
                <p className="text-2xl text-neutral-600 mt-2">
                  Government Schemes Portal for Farmers
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Award size={32} className="text-amber-600" />
              <span className="text-xl font-medium text-neutral-700">Official Portal</span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-8xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-neutral-900">{schemes.length}</div>
              <div className="text-xl text-neutral-600 mt-2">Active Schemes</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-neutral-900">{savedSchemes.length}</div>
              <div className="text-xl text-black mt-2">Saved Schemes</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-neutral-900">
                {appliedSchemes.filter(app => app.status === 'applied').length}
              </div>
              <div className="text-xl text-black mt-2">Applied</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-neutral-900">₹10Cr+</div>
              <div className="text-xl text-black mt-2">Benefits</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-8xl mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <Search size={32} className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search government schemes by name, keywords, or ministry..."
                className="w-full pl-20 pr-14 py-6 text-2xl bg-neutral-50 border-2 border-neutral-200 rounded-3xl focus:border-neutral-900 focus:bg-white focus:outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X size={28} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-8xl mx-auto px-6 py-16">
        {/* Tab Navigation */}
        <div className="mb-12">
          <div className="flex space-x-6 border-b-2 border-neutral-200">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-6 text-2xl font-medium transition-all ${
                activeTab === "all"
                  ? "text-neutral-900 border-b-4 border-neutral-900"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              All Schemes
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`pb-6 text-2xl font-medium transition-all flex items-center gap-3 ${
                activeTab === "saved"
                  ? "text-neutral-900 border-b-4 border-neutral-900"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <Bookmark size={28} />
              Saved ({savedSchemes.length})
            </button>
            <button
              onClick={() => setActiveTab("applied")}
              className={`pb-6 text-2xl font-medium transition-all flex items-center gap-3 ${
                activeTab === "applied"
                  ? "text-neutral-900 border-b-4 border-neutral-900"
                  : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <History size={28} />
              Applied History ({appliedSchemes.length})
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-neutral-900 mb-10">
            Browse Schemes by Category
          </h2>
          <div className="flex flex-wrap gap-4">
            {animalFilters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setSelectedAnimalFilter(filter.id)}
                className={`flex items-center gap-4 px-10 py-6 rounded-2xl text-2xl font-medium transition-all ${
                  selectedAnimalFilter === filter.id
                    ? "bg-neutral-900 text-white shadow-xl shadow-neutral-900/20"
                    : "bg-white text-neutral-700 border-2 border-neutral-200 hover:border-neutral-300"
                }`}
              >
                {filter.icon}
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-neutral-900 mb-4">
            {activeTab === "saved" ? "Saved Schemes" : 
             activeTab === "applied" ? "Applied Schemes" : 
             "Available Government Schemes"}
          </h2>
          <p className="text-2xl text-neutral-600">
            Showing {filteredSchemes.length} of {schemes.length} schemes
          </p>
        </div>

        {/* Scheme Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredSchemes.map((scheme, i) => (
            <SchemeCard 
              key={i} 
              scheme={scheme} 
              onViewDetails={() => handleViewDetails(scheme)}
              isSaved={savedSchemes.includes(scheme["Govt Scheme Name"])}
              onSaveToggle={() => handleSaveScheme(scheme["Govt Scheme Name"])}
              appliedStatus={getAppliedStatus(scheme["Govt Scheme Name"])}
            />
          ))}
        </div>

        {filteredSchemes.length === 0 && (
          <div className="text-center py-32">
            <div className="w-32 h-32 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-10">
              <Search size={60} className="text-neutral-400" />
            </div>
            <p className="text-3xl font-semibold text-neutral-900 mb-4">No schemes found</p>
            <p className="text-xl text-neutral-600">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 mt-24">
        <div className="max-w-8xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center">
                <Home size={28} className="text-white" />
              </div>
              <span className="text-3xl font-bold text-neutral-900">FarmSeva</span>
            </div>
            <div className="text-xl text-neutral-600">
              © 2024 Ministry of Agriculture & Farmers Welfare
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SchemeCard({ scheme, onViewDetails, isSaved, onSaveToggle, appliedStatus }) {
  const getAnimalType = () => {
    const name = scheme["Govt Scheme Name"]?.toLowerCase() || "";
    const desc = scheme["Scheme Description"]?.toLowerCase() || "";
    
    if (name.includes("pig") || desc.includes("pig") || desc.includes("swine")) 
      return { icon: <PiggyBank size={32} />, label: "Pig Farming" };
    if (name.includes("poultry") || desc.includes("poultry") || desc.includes("chicken") || desc.includes("hen")) 
      return { icon: <Bird size={32} />, label: "Poultry Farming" };
    return { icon: <Globe size={32} />, label: "General Agriculture" };
  };

  const getStatusBadge = () => {
    switch(appliedStatus) {
      case 'applied':
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full">
            <CheckCircle size={20} />
            <span className="text-sm font-medium">Applied</span>
          </div>
        );
      case 'not-applied':
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-full">
            <XCircle size={20} />
            <span className="text-sm font-medium">Not Applied</span>
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full">
            <ClockIcon size={20} />
            <span className="text-sm font-medium">In Progress</span>
          </div>
        );
      default:
        return null;
    }
  };

  const animal = getAnimalType();
  const amount = scheme["Benefits Provided"]?.match(/₹[\d,]+|Up to [\d,]+|Rs\.[\d,]+/)?.[0] || "Variable Benefits";
  const ministry = scheme["Ministry / Department Name"] || "Government of India";

  return (
    <div className="bg-white border-2 border-neutral-200 rounded-3xl hover:border-neutral-300 hover:shadow-2xl transition-all duration-300 flex flex-col h-full group">
      <div className="p-8 flex flex-col flex-grow">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-neutral-100 rounded-2xl flex items-center justify-center flex-shrink-0">
              {animal.icon}
            </div>
            <div>
              <div className="text-xl font-semibold text-neutral-900">{animal.label}</div>
              <div className="flex items-center gap-2 text-lg text-neutral-600 mt-1">
                <Building size={20} />
                <span className="line-clamp-1">{ministry}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            {getStatusBadge()}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onSaveToggle();
              }}
              className="text-neutral-400 hover:text-neutral-900 transition-colors p-2 flex-shrink-0"
            >
              {isSaved ? <BookmarkCheck size={28} /> : <Bookmark size={28} />}
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-3xl font-bold text-neutral-900 mb-6 leading-tight line-clamp-2">
          {scheme["Govt Scheme Name"]}
        </h3>

        {/* Description */}
        <p className="text-xl text-neutral-700 leading-relaxed mb-6 line-clamp-4 flex-grow">
          {scheme["Scheme Description"]}
        </p>

        {/* Benefits */}
        <div className="bg-neutral-50 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <IndianRupee size={24} className="text-neutral-700" />
            <span className="text-xl font-semibold text-neutral-900">Scheme Benefits</span>
          </div>
          <p className="text-2xl font-medium text-neutral-900">{amount}</p>
        </div>

        {/* Quick Info */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Shield size={24} className="text-neutral-400" />
              <span className="text-lg text-neutral-600">Govt Verified</span>
            </div>
            <div className="flex items-center gap-2">
              <Target size={24} className="text-neutral-400" />
              <span className="text-lg text-neutral-600">Direct Benefit</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={onViewDetails}
          className="w-full flex items-center justify-center gap-3 py-5 bg-neutral-900 hover:bg-black text-white text-2xl font-semibold rounded-2xl transition-all group/btn mt-auto"
        >
          View Full Details
          <ChevronRight size={24} className="group-hover/btn:translate-x-2 transition-transform" />
        </button>
      </div>
    </div>
  );
}

function SchemeDetailPage({ scheme, onBack, isSaved, onSaveToggle, appliedStatus, onApplyStatusChange }) {
  const getAnimalType = () => {
    const name = scheme["Govt Scheme Name"]?.toLowerCase() || "";
    const desc = scheme["Scheme Description"]?.toLowerCase() || "";
    
    if (name.includes("pig") || desc.includes("pig") || desc.includes("swine")) 
      return { icon: <PiggyBank size={40} />, label: "Pig Farming Scheme" };
    if (name.includes("poultry") || desc.includes("poultry") || desc.includes("chicken") || desc.includes("hen")) 
      return { icon: <Bird size={40} />, label: "Poultry Farming Scheme" };
    return { icon: <Globe size={40} />, label: "Agriculture Scheme" };
  };

  const parseBenefits = (benefitsText) => {
    if (!benefitsText) return [];
    
    // Split by common numbering patterns (1., 2., etc.)
    const items = benefitsText.split(/(?:\d+\.\s)/).filter(item => item.trim());
    
    // If no numbered items found, try splitting by sentences
    if (items.length <= 1) {
      return benefitsText.split(/\.\s+/).filter(item => item.trim()).map(item => item + '.');
    }
    
    return items;
  };

  const animal = getAnimalType();
  const ministry = scheme["Ministry / Department Name"] || "Government of India";
  const benefitsList = parseBenefits(scheme["Benefits Provided"]);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation Bar */}
      <div className="sticky top-0 bg-white border-b border-neutral-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={onBack}
              className="flex items-center gap-3 text-neutral-700 hover:text-neutral-900 text-2xl font-medium transition-colors group"
            >
              <ArrowLeft size={28} className="group-hover:-translate-x-2 transition-transform" />
              Back to All Schemes
            </button>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={onSaveToggle}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-xl font-medium transition-all ${
                  isSaved 
                    ? "bg-neutral-900 text-white" 
                    : "border-2 border-neutral-200 text-black hover:border-neutral-300"
                }`}
              >
                {isSaved ? <BookmarkCheck size={28} /> : <Bookmark size={28} />}
                {isSaved ? "Saved" : "Save Scheme"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-6 mb-12">
            <div className="w-24 h-24 bg-neutral-100 rounded-3xl flex items-center justify-center flex-shrink-0">
              {animal.icon}
            </div>
            <div>
              <div className="text-2xl font-semibold text-neutral-900">{animal.label}</div>
              <div className="flex items-center gap-3 text-xl text-neutral-600 mt-2">
                <Building size={24} />
                <span>{ministry}</span>
              </div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-10 leading-tight">
            {scheme["Govt Scheme Name"]}
          </h1>
          
          <p className="text-3xl text-neutral-700 leading-relaxed">
            {scheme["Scheme Description"]}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-12">
            {/* Benefits */}
            {scheme["Benefits Provided"] && (
              <section className="bg-white border-2 border-neutral-200 rounded-3xl p-10">
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-20 h-20 bg-neutral-100 rounded-2xl flex items-center justify-center">
                    <IndianRupee size={32} className="text-neutral-900" />
                  </div>
                  <h2 className="text-4xl font-bold text-neutral-900">Scheme Benefits</h2>
                </div>
                {benefitsList.length > 1 ? (
                  <ul className="space-y-6">
                    {benefitsList.map((benefit, index) => (
                      <li key={index} className="flex gap-6">
                        <span className="flex-shrink-0 w-10 h-10 bg-neutral-900 text-white rounded-full flex items-center justify-center text-xl font-semibold mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-2xl text-neutral-700 leading-relaxed">{benefit.trim()}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-2xl text-neutral-700 leading-relaxed">
                    {scheme["Benefits Provided"]}
                  </p>
                )}
              </section>
            )}

            {/* Timeline */}
            {scheme["Application Start Date"] && (
              <section className="bg-white border-2 border-neutral-200 rounded-3xl p-10">
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-20 h-20 bg-neutral-100 rounded-2xl flex items-center justify-center">
                    <Calendar size={32} className="text-neutral-900" />
                  </div>
                  <h2 className="text-4xl font-bold text-neutral-900">Important Dates</h2>
                </div>
                <p className="text-2xl text-neutral-700">
                  <span className="font-semibold">Application Period:</span> {scheme["Application Start Date"]}
                  {scheme["Last date"] && <span> to {scheme["Last date"]}</span>}
                </p>
              </section>
            )}

            {/* Eligibility */}
            {scheme["Eligibility Requirements"] && (
              <section className="bg-white border-2 border-neutral-200 rounded-3xl p-10">
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-20 h-20 bg-neutral-100 rounded-2xl flex items-center justify-center">
                    <Users size={32} className="text-neutral-900" />
                  </div>
                  <h2 className="text-4xl font-bold text-neutral-900">Eligibility Criteria</h2>
                </div>
                <p className="text-2xl text-neutral-700 leading-relaxed whitespace-pre-line">
                  {scheme["Eligibility Requirements"]}
                </p>
              </section>
            )}

            {/* Documents */}
            {scheme["Required Documents"] && (
              <section className="bg-white border-2 border-neutral-200 rounded-3xl p-10">
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-20 h-20 bg-neutral-100 rounded-2xl flex items-center justify-center">
                    <ClipboardList size={32} className="text-neutral-900" />
                  </div>
                  <h2 className="text-4xl font-bold text-neutral-900">Required Documents</h2>
                </div>
                <p className="text-2xl text-neutral-700 leading-relaxed whitespace-pre-line">
                  {scheme["Required Documents"]}
                </p>
              </section>
            )}

            {/* How to Apply */}
            {scheme["How To Apply"] && (
              <section className="bg-white border-2 border-neutral-200 rounded-3xl p-10">
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-20 h-20 bg-neutral-100 rounded-2xl flex items-center justify-center">
                    <FileCheck size={32} className="text-neutral-900" />
                  </div>
                  <h2 className="text-4xl font-bold text-neutral-900">How to Apply</h2>
                </div>
                <p className="text-2xl text-neutral-700 leading-relaxed whitespace-pre-line">
                  {scheme["How To Apply"]}
                </p>
              </section>
            )}

            {/* AI Overview */}
            {scheme["AI Overview"] && (
              <section className="bg-white border-2 border-neutral-200 rounded-3xl p-10">
                <div className="flex items-center gap-6 mb-10">
                  <div className="w-20 h-20 bg-neutral-100 rounded-2xl flex items-center justify-center">
                    <Info size={32} className="text-neutral-900" />
                  </div>
                  <h2 className="text-4xl font-bold text-neutral-900">Additional Information</h2>
                </div>
                <p className="text-2xl text-neutral-700 leading-relaxed whitespace-pre-line">
                  {scheme["AI Overview"]}
                </p>
              </section>
            )}
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-8">
            {/* Apply Card */}
            <div className="sticky top-24 bg-white border-2 border-neutral-200 rounded-3xl p-10">
              <h3 className="text-4xl font-bold text-neutral-900 mb-10">Apply Now</h3>
              
              <a
                href={scheme["Website Link"]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-6 bg-neutral-900 hover:bg-black text-white text-1xl font-semibold rounded-2xl mb-6 transition-colors"
              >
                Apply on Official Portal
                <ExternalLink size={28} />
              </a>
              
              <button className="flex items-center justify-center gap-3 w-full py-6 border-2 text-black border-neutral-200 hover:border-neutral-300 text-1xl font-semibold rounded-2xl transition-colors mb-10">
  <a
                href={scheme["PDF Link"]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-6 bg-green-800 hover:bg-black text-white text-1xl font-semibold rounded-2xl mb-6 transition-colors"
              >
                Download Application Form
                <ExternalLink size={28} />
              </a>              </button>

              {/* Applied Status */}
              <div className="mb-10 pb-10 border-b-2 border-neutral-100">
                <h4 className="text-3xl font-bold text-neutral-900 mb-8">Applied?</h4>
                <div className="space-y-6">
                  <button
                    onClick={() => onApplyStatusChange('applied')}
                    className={`w-full flex items-center gap-6 p-6 rounded-2xl border-2 transition-all ${
                      appliedStatus === 'applied'
                        ? 'bg-green-100 text-green-900 border-green-300'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded border-2 flex items-center justify-center ${
                      appliedStatus === 'applied' ? 'bg-green-600 border-green-600' : 'border-neutral-300'
                    }`}>
                      {appliedStatus === 'applied' && (
                        <CheckSquare size={24} className="text-white" />
                      )}
                    </div>
                    <span className="text-xl text-black font-medium">Yes, I have applied</span>
                  </button>
                  
                  <button
                    onClick={() => onApplyStatusChange('not-applied')}
                    className={`w-full flex items-center gap-6 p-6 rounded-2xl border-2 transition-all ${
                      appliedStatus === 'not-applied'
                        ? 'bg-red-100 text-red-900 border-red-300'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded border-2 flex items-center justify-center ${
                      appliedStatus === 'not-applied' ? 'bg-red-600 border-red-600' : 'border-neutral-300'
                    }`}>
                      {appliedStatus === 'not-applied' && (
                        <X size={24} className="text-white" />
                      )}
                    </div>
                    <span className="text-xl text-black  font-medium">No, not applied yet</span>
                  </button>
                  
                  <button
                    onClick={() => onApplyStatusChange('pending')}
                    className={`w-full flex items-center gap-6 p-6 rounded-2xl border-2 transition-all ${
                      appliedStatus === 'pending'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded border-2 flex items-center justify-center ${
                      appliedStatus === 'pending' ? 'bg-amber-600 border-amber-600' : 'border-neutral-300'
                    }`}>
                      {appliedStatus === 'pending' && (
                        <ClockIcon size={24} className="text-white" />
                      )}
                    </div>
                    <span className="text-xl text-black  font-medium">Application in progress</span>
                  </button>
                </div>
              </div>
              
              {/* Quick Info */}
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Shield size={28} className="text-neutral-600" />
                    <span className="text-2xl font-semibold text-neutral-900">Scheme Status</span>
                  </div>
                  <p className="text-xl text-neutral-700">Active & Government Verified</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Clock size={28} className="text-neutral-600" />
                    <span className="text-2xl font-semibold text-neutral-900">Processing Time</span>
                  </div>
                  <p className="text-xl text-neutral-700">15-30 Working Days</p>
                </div>
                
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <CheckSquare size={28} className="text-neutral-600" />
                    <span className="text-2xl font-semibold text-neutral-900">Success Rate</span>
                  </div>
                  <p className="text-xl text-neutral-700">92% Approval Rate</p>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-white border-2 border-neutral-200 rounded-3xl p-10">
              <h3 className="text-4xl font-bold text-neutral-900 mb-10">Need Help?</h3>
              <div className="space-y-8">
                <div>
                  <p className="text-xl font-semibold text-neutral-900 mb-3">24/7 Helpline</p>
                  <p className="text-3xl text-neutral-700">1800-XXX-XXXX</p>
                </div>
                
                <div>
                  <p className="text-xl font-semibold text-neutral-900 mb-3">Email Support</p>
                  <p className="text-2xl text-neutral-700">support@farmseva.gov.in</p>
                </div>
                
                <div>
                  <p className="text-xl font-semibold text-neutral-900 mb-3">Office Hours</p>
                  <p className="text-2xl text-neutral-700">Monday to Friday, 9 AM - 6 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 mt-24">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center">
                <Home size={28} className="text-white" />
              </div>
              <span className="text-3xl font-bold text-neutral-900">FarmSeva</span>
            </div>
            <div className="text-2xl text-neutral-600">
              Ministry of Agriculture & Farmers Welfare
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}