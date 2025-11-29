import React, { useEffect, useState } from "react";
import Papa from "papaparse";
import { ChevronDown, ChevronUp, ExternalLink, HelpCircle, Search, Filter } from "lucide-react";

export default function GovtScheme() {
  const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/11oh6nVyIGXoy9oTfA_UWgAD3JxCvVeO0K4n9ncqVeyw/export?format=csv";

  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAnimalFilter, setSelectedAnimalFilter] = useState("All");

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
  }, []);

  useEffect(() => {
    let filtered = schemes;
    
    if (searchTerm) {
      filtered = filtered.filter(scheme =>
        scheme["Govt Scheme Name"]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme["Scheme Description"]?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== "All") {
      filtered = filtered.filter(scheme => 
        scheme["Scheme Category"] === selectedCategory
      );
    }
    
    // Apply animal filters
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
    
    setFilteredSchemes(filtered);
  }, [searchTerm, selectedCategory, selectedAnimalFilter, schemes]);

  const categories = ["All", ...new Set(schemes.map(scheme => scheme["Scheme Category"]).filter(Boolean))];
  const animalFilters = ["All", "Pig", "Poultry"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🌾</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-700 to-green-600 bg-clip-text text-transparent">
              Farmer Government Schemes
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover and apply for government schemes designed to support farmers and agriculture
          </p>
        </div>

        <div className="mb-12 max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-emerald-100">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search schemes by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300 text-lg"
                />
              </div>
              
              <div className="lg:w-64">
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-500 w-5 h-5" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 appearance-none transition-all duration-300 text-lg"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="lg:w-64">
                <div className="relative">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                  <select
                    value={selectedAnimalFilter}
                    onChange={(e) => setSelectedAnimalFilter(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-all duration-300 text-lg"
                  >
                    {animalFilters.map(filter => (
                      <option key={filter} value={filter}>
                        {filter === "All" ? "All Animals" : filter}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            {/* Active filters display */}
            <div className="flex flex-wrap gap-2 mt-4">
              {selectedCategory !== "All" && (
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                  Category: {selectedCategory}
                  <button 
                    onClick={() => setSelectedCategory("All")}
                    className="hover:text-emerald-900"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedAnimalFilter !== "All" && (
                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                  Animal: {selectedAnimalFilter}
                  <button 
                    onClick={() => setSelectedAnimalFilter("All")}
                    className="hover:text-blue-900"
                  >
                    ×
                  </button>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                  Search: {searchTerm}
                  <button 
                    onClick={() => setSearchTerm("")}
                    className="hover:text-gray-900"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mb-8 text-center">
          <p className="text-lg text-emerald-700 font-semibold">
            Found {filteredSchemes.length} scheme{filteredSchemes.length !== 1 ? 's' : ''}
            {selectedAnimalFilter !== "All" && ` for ${selectedAnimalFilter}`}
          </p>
        </div>

        <div className="max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {filteredSchemes.map((scheme, i) => (
            <SchemeCard key={i} scheme={scheme} index={i} />
          ))}
        </div>

        {filteredSchemes.length === 0 && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No schemes found</h3>
            <p className="text-gray-500 text-lg">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SchemeCard({ scheme, index }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div 
      className="group bg-white rounded-3xl shadow-2xl border border-emerald-100/50 p-8 hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 backdrop-blur-sm"
      style={{
        animationDelay: `${index * 100}ms`,
        animation: `slideInUp 0.6s ease-out ${index * 100}ms both`
      }}
    >
      <div className="flex justify-between items-start gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-3">
            {scheme["Scheme Category"] || "Farmer Support"}
          </div>
          <h2 className="text-2xl font-bold text-gray-900 leading-tight line-clamp-2">
            {scheme["Govt Scheme Name"]}
          </h2>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-shrink-0 p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 group-hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl border border-emerald-200"
        >
          {expanded ? 
            <ChevronUp size={24} className="text-emerald-700" /> : 
            <ChevronDown size={24} className="text-emerald-700" />
          }
        </button>
      </div>

      <div className="space-y-4">
        {renderPreview(scheme)}
      </div>

      {expanded && (
        <div className="mt-8 pt-8 border-t border-emerald-200/50 space-y-6 animate-fadeIn">
          {renderFullInfo(scheme)}

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <a
              href={scheme["Website Link"]}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Apply Now 
              <ExternalLink size={20} className="flex-shrink-0" />
            </a>

            <button className="flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Get Help
              <HelpCircle size={20} className="flex-shrink-0" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function renderPreview(scheme) {
  const previewFields = [
    "Scheme Description",
    "Ministry / Department Name",
    "Benefits Provided",
    "Eligibility Requirements",
    "How To Apply",
  ];

  return previewFields.map((field) =>
    scheme[field] ? (
      <div 
        key={field} 
        className="bg-gradient-to-br from-emerald-50 to-green-50 p-5 rounded-2xl border border-emerald-100/70 hover:border-emerald-200 transition-all duration-300 group hover:shadow-md"
      >
        <p className="font-bold text-emerald-800 text-sm uppercase tracking-wide mb-2">
          {field}
        </p>
        <p className="text-gray-800 leading-relaxed text-base line-clamp-3 group-hover:line-clamp-none transition-all">
          {scheme[field]}
        </p>
      </div>
    ) : null
  ).filter(Boolean);
}

function renderFullInfo(scheme) {
  const fields = [
    "Required Documents",
    "Application Start Date",
    "Last date",
    "AI Overview",
  ];

  return fields.map((field) =>
    scheme[field] ? (
      <div 
        key={field} 
        className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-2xl border border-blue-100/70 hover:border-blue-200 transition-all duration-300 group hover:shadow-md"
      >
        <p className="font-bold text-blue-800 text-sm uppercase tracking-wide mb-2">
          {field}
        </p>
        <p className="text-gray-800 leading-relaxed text-base">
          {scheme[field]}
        </p>
      </div>
    ) : null
  ).filter(Boolean);
}

// Add CSS animations
const styles = `
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  
  .animate-fadeIn {
    animation: fadeIn 0.4s ease-out;
  }
  
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .shadow-3xl {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
`;

const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);