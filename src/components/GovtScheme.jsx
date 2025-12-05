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
  XCircle,
  Filter
} from "lucide-react";

export default function GovtScheme() {
  const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/11oh6nVyIGXoy9oTfA_UWgAD3JxCvVeO0K4n9ncqVeyw/export?format=csv";

  const [schemes, setSchemes] = useState([]);
  const [filteredSchemes, setFilteredSchemes] = useState([]);
  const [currentView, setCurrentView] = useState("list");
  const [selectedScheme, setSelectedScheme] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [savedSchemes, setSavedSchemes] = useState([]);
  const [appliedSchemes, setAppliedSchemes] = useState([]);

  // Filters
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  useEffect(() => {
    Papa.parse(SHEET_URL, {
      download: true,
      header: true,
      complete: (result) => {
        const rawData = result.data.slice(2);

        // Strict Filtering Logic
        const allowedData = rawData.filter(scheme => {
          const text = (scheme["Govt Scheme Name"] + " " + scheme["Scheme Description"]).toLowerCase();

          // Allow if Pig or Poultry
          if (text.includes("pig") || text.includes("swine") || text.includes("poultry") || text.includes("chicken") || text.includes("hen") || text.includes("duck")) {
            return true;
          }

          // Exclude other specific animals
          if (text.includes("dairy") || text.includes("cattle") || text.includes("cow") || text.includes("buffalo") ||
            text.includes("fish") || text.includes("fishery") || text.includes("aquaculture") ||
            text.includes("sheep") || text.includes("goat") || text.includes("silk") || text.includes("bee")) {
            return false;
          }

          // Allow General (neither explicitly allowed animals nor explicitly excluded ones)
          return true;
        });

        setSchemes(allowedData);
        setFilteredSchemes(allowedData);

        // Analyze data to find categories for allowed schemes
        const foundCategories = new Set();
        allowedData.forEach(scheme => {
          const text = (scheme["Govt Scheme Name"] + " " + scheme["Scheme Description"]).toLowerCase();
          if (text.includes("pig") || text.includes("swine")) foundCategories.add("Pig Farming");
          if (text.includes("poultry") || text.includes("chicken") || text.includes("hen")) foundCategories.add("Poultry Farming");
        });
        // Always add General if not empty
        foundCategories.add("General Agriculture");

        setCategories(Array.from(foundCategories));
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

    // Search Filter
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

    // Category Filters
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(scheme => {
        const text = (scheme["Govt Scheme Name"] + " " + scheme["Scheme Description"] || "").toLowerCase();
        return selectedCategories.some(cat => {
          if (cat === "Pig Farming") return text.includes("pig") || text.includes("swine");
          if (cat === "Poultry Farming") return text.includes("poultry") || text.includes("chicken") || text.includes("hen");
          if (cat === "General Agriculture") {
            // General logic: Not Pig and Not Poultry
            const isPig = text.includes("pig") || text.includes("swine");
            const isPoultry = text.includes("poultry") || text.includes("chicken") || text.includes("hen");
            return !isPig && !isPoultry;
          }
          return false;
        });
      });
    }

    setFilteredSchemes(filtered);
  }, [schemes, searchQuery, selectedCategories]);

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

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

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
    <div className="min-h-screen bg-neutral-50 p-8 font-sans">
      <div className="max-w-[1600px] mx-auto">
        <button className="flex items-center text-blue-600 mb-8 font-medium hover:underline text-lg">
          <ArrowLeft size={24} className="mr-2" /> Back
        </button>

        <div className="flex flex-col md:flex-row gap-12">

          {/* Left Sidebar - Filters */}
          <div className="w-full md:w-1/4 flex-shrink-0">
            <div className="sticky top-6 bg-white rounded-xl shadow-sm p-8 border border-neutral-100 max-h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between mb-8 border-b border-neutral-100 pb-6">
                <h2 className="text-2xl font-bold text-neutral-800">Filter By</h2>
                <button
                  onClick={() => setSelectedCategories([])}
                  className="text-base text-green-600 font-medium hover:text-green-700"
                >
                  Reset Filters
                </button>
              </div>

              <div className="mb-8">
                <div className="flex items-center justify-between mb-4 text-neutral-800 font-semibold cursor-pointer">
                  <h3 className="text-lg">Scheme Category</h3>
                  <ChevronRight size={20} className="rotate-90 text-green-600" />
                </div>
                <div className="space-y-4 pl-1">
                  {categories.length > 0 ? categories.map((cat, i) => (
                    <label key={i} className="flex items-center gap-4 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-6 h-6 rounded border-neutral-300 text-green-600 focus:ring-green-500"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleCategory(cat)}
                      />
                      <span className="text-lg text-neutral-600 group-hover:text-neutral-900">{cat}</span>
                    </label>
                  )) : (
                    <p className="text-base text-neutral-400">Loading Categories...</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Listing */}
          <div className="flex-grow">
            {/* Search Bar */}
            <div className="relative mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-neutral-200 flex items-center overflow-hidden">
                <div className="pl-6 text-neutral-400">
                  <Search size={24} />
                </div>
                <input
                  type="text"
                  placeholder="Search for schemes, subsidies, or farming types..."
                  className="w-full py-5 px-6 text-xl text-neutral-700 focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="bg-green-700 text-white p-5 hover:bg-green-800 transition-colors">
                  <Search size={28} />
                </button>
              </div>
              <p className="text-sm text-neutral-500 mt-3 flex items-center gap-2">
                <Info size={16} />
                Try searching for specific terms like "Tractor Subsidy" or "Kisan Credit Card".
              </p>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-neutral-600">We found <span className="font-bold text-neutral-900">{filteredSchemes.length}</span> farmer personalized schemes</span>
                <button className="text-green-600 font-medium hover:underline flex items-center gap-1">
                  <Users size={14} /> Edit
                </button>
                <button className="text-blue-600 font-medium hover:underline ml-2">Save Profile</button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-600">Sort :</span>
                <select className="bg-transparent font-medium text-neutral-900 focus:outline-none cursor-pointer">
                  <option>Relevance</option>
                  <option>Newest</option>
                </select>
              </div>
            </div>

            {/* List */}
            <div className="space-y-4">
              {filteredSchemes.map((scheme, i) => (
                <SchemeCard
                  key={i}
                  scheme={scheme}
                  onClick={() => handleViewDetails(scheme)}
                />
              ))}

              {filteredSchemes.length === 0 && (
                <div className="text-center py-20 bg-white rounded-xl border border-neutral-200">
                  <p className="text-xl text-neutral-500">No schemes found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function SchemeCard({ scheme, onClick }) {
  const getTags = () => {
    const tags = [];
    const name = scheme["Govt Scheme Name"]?.toLowerCase() || "";
    const desc = scheme["Scheme Description"]?.toLowerCase() || "";

    // Auto-generate some tags based on content
    if (name.includes("sc") || name.includes("st")) tags.push("Scheduled Caste");
    if (name.includes("tribe")) tags.push("Scheduled Tribe");
    if (name.includes("woman") || name.includes("women") || name.includes("female")) tags.push("Women Farmers");

    // Farmer centric tags
    if (name.includes("pig") || desc.includes("pig")) tags.push("Pig Farming");
    if (name.includes("poultry") || desc.includes("poultry")) tags.push("Poultry Farming");
    if (name.includes("fish") || desc.includes("fish")) tags.push("Fisheries");
    if (name.includes("dairy") || desc.includes("dairy")) tags.push("Dairy Farming");

    // Always have some default tags if none matched
    if (tags.length === 0) tags.push("General Agriculture");
    if (scheme["Ministry / Department Name"]) tags.push(scheme["Ministry / Department Name"]);

    return tags.slice(0, 4); // Limit to 4 tags
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-8 shadow-sm border border-neutral-200 hover:shadow-md hover:border-green-200 transition-all cursor-pointer group"
    >
      <h3 className="text-2xl font-bold text-neutral-900 mb-3 group-hover:text-green-700 transition-colors">
        {scheme["Govt Scheme Name"]}
      </h3>
      <p className="text-base text-neutral-500 mb-4 font-medium">
        {scheme["Ministry / Department Name"] || "Government of India"}
      </p>

      <p className="text-lg text-neutral-600 mb-6 line-clamp-2 leading-relaxed">
        {scheme["Scheme Description"]}
      </p>

      <div className="flex flex-wrap gap-3">
        {getTags().map((tag, i) => (
          <span key={i} className="px-4 py-1.5 bg-white border border-green-200 text-green-700 rounded-full text-sm font-medium">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

const DUMMY_NEWS = [
  {
    id: 1,
    title: "PM-KISAN 16th Installment Released",
    date: "Feb 28, 2024",
    link: "#"
  },
  {
    id: 2,
    title: "New Subsidy Rates for Fertilizers Announced",
    date: "Mar 05, 2024",
    link: "#"
  },
  {
    id: 3,
    title: "Agri-Infrastructure Fund reaches new milestone",
    date: "Mar 10, 2024",
    link: "#"
  }
];

function SchemeDetailPage({ scheme, onBack, isSaved, onSaveToggle, appliedStatus, onApplyStatusChange }) {
  const [activeSection, setActiveSection] = useState("details");

  const sections = [
    { id: "details", label: "Details" },
    { id: "benefits", label: "Benefits" },
    { id: "eligibility", label: "Eligibility" },
    { id: "application", label: "Application Process" },
    { id: "documents", label: "Documents Required" },
    { id: "faq", label: "Frequently Asked Questions" },
    { id: "sources", label: "Sources And References" },
    { id: "feedback", label: "Feedback" }
  ];

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
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

  const ministry = scheme["Ministry / Department Name"] || "Government of India";
  const benefitsList = parseBenefits(scheme["Benefits Provided"]);

  return (
    <div className="min-h-screen bg-neutral-50 p-8 font-sans">
      <div className="max-w-[1600px] mx-auto">
        <button
          onClick={onBack}
          className="flex items-center text-blue-600 mb-8 font-medium hover:underline text-lg"
        >
          <ArrowLeft size={24} className="mr-2" /> Back
        </button>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* Left Sidebar - Navigation */}
          <div className="w-full lg:w-1/5 flex-shrink-0 hidden lg:block">
            <div className="sticky top-6">
              <div className="bg-neutral-50 rounded-xl p-3">
                <ul className="space-y-2">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <button
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full text-left px-5 py-4 rounded-lg text-base font-medium transition-colors ${activeSection === section.id
                          ? "bg-neutral-200 text-neutral-900 font-bold"
                          : "text-neutral-600 hover:bg-neutral-100"
                          }`}
                      >
                        {section.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Application Status Tracking */}
              <div className="bg-white rounded-xl p-5 mt-6 border border-neutral-200 shadow-sm">
                <h3 className="font-bold text-neutral-800 mb-4 text-lg">Application Status</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => onApplyStatusChange('applied')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${appliedStatus === 'applied'
                      ? "bg-green-50 border-green-500 text-green-700 font-bold shadow-sm"
                      : "bg-white border-neutral-200 text-neutral-600 hover:border-green-300"
                      }`}
                  >
                    <CheckCircle size={20} className={appliedStatus === 'applied' ? "fill-current" : ""} />
                    Applied
                  </button>

                  <button
                    onClick={() => onApplyStatusChange('pending')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${appliedStatus === 'pending'
                      ? "bg-amber-50 border-amber-500 text-amber-700 font-bold shadow-sm"
                      : "bg-white border-neutral-200 text-neutral-600 hover:border-amber-300"
                      }`}
                  >
                    <ClockIcon size={20} className={appliedStatus === 'pending' ? "fill-current" : ""} />
                    In Progress
                  </button>

                  <button
                    onClick={() => onApplyStatusChange('not-applied')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${appliedStatus === 'not-applied' || !appliedStatus
                      ? "bg-red-50 border-red-500 text-red-700 font-bold shadow-sm"
                      : "bg-white border-neutral-200 text-neutral-600 hover:border-red-300"
                      }`}
                  >
                    <XCircle size={20} className={appliedStatus === 'not-applied' || !appliedStatus ? "fill-current" : ""} />
                    Not Applied
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Center Content - Details */}
          <div className="flex-grow min-w-0">
            <div className="bg-white rounded-xl p-10 shadow-sm border border-neutral-100 mb-10" id="details">
              {/* Header Snippet */}
              <div className="mb-8">
                <span className="text-base text-neutral-500 font-medium">{ministry}</span>
                <div className="flex justify-between items-start mt-2">
                  <h1 className="text-4xl font-bold text-neutral-900 leading-tight">
                    {scheme["Govt Scheme Name"]}
                  </h1>
                  <button
                    onClick={onSaveToggle}
                    className="ml-6 p-2 text-neutral-400 hover:text-green-600 transition-colors"
                  >
                    {isSaved ? <BookmarkCheck size={32} /> : <Bookmark size={32} />}
                  </button>
                </div>

                <div className="flex items-center gap-3 mt-6 flex-wrap">
                  {/* Pills */}
                  {scheme["Govt Scheme Name"].includes("Coaching") && (
                    <span className="px-4 py-1.5 bg-white border border-green-600 text-green-700 rounded-full text-base font-medium">Coaching</span>
                  )}
                  <span className="px-4 py-1.5 bg-white border border-green-600 text-green-700 rounded-full text-base font-medium">Farmers</span>
                  {scheme["Govt Scheme Name"].toLowerCase().includes("sc") && (
                    <span className="px-4 py-1.5 bg-white border border-green-600 text-green-700 rounded-full text-base font-medium">Scheduled Caste</span>
                  )}
                </div>

                <div className="mt-10">
                  <a
                    href={scheme["Website Link"] || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-3 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800 transition-colors text-lg"
                  >
                    Apply on Official Portal <ExternalLink size={20} />
                  </a>

                  {/* Document PDF Link */}
                  {(scheme["PDF Link"] || scheme["Document Link"]) && (
                    <div className="mt-6">
                      <a
                        href={scheme["PDF Link"] || scheme["Document Link"]}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-3 text-blue-600 font-medium hover:underline text-lg"
                      >
                        <FileText size={22} />
                        Download Application Form / Guidelines (PDF)
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-neutral-100 pt-10 mt-10">
                <h2 className="text-3xl font-bold text-neutral-800 mb-6">Details</h2>
                <p className="text-xl text-neutral-700 leading-relaxed whitespace-pre-line">
                  {scheme["Scheme Description"]}
                </p>

                {scheme["AI Overview"] && (
                  <div className="bg-blue-50 p-8 rounded-xl mt-8 border border-blue-100">
                    <h3 className="flex items-center gap-3 font-bold text-blue-800 mb-3 text-xl">
                      <Info size={24} /> Overview
                    </h3>
                    <p className="text-blue-900 leading-relaxed text-lg">
                      {scheme["AI Overview"]}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-10 shadow-sm border border-neutral-100 mb-10" id="benefits">
              <h2 className="text-3xl font-bold text-neutral-800 mb-6">Benefits</h2>
              <div className="prose prose-xl prose-neutral max-w-none text-neutral-700">
                {benefitsList.length > 0 ? (
                  <ul className="list-disc pl-6 space-y-3">
                    {benefitsList.map((benefit, i) => (
                      <li key={i}>{benefit}</li>
                    ))}
                  </ul>
                ) : (
                  <p>{scheme["Benefits Provided"] || "Contact authorities for details."}</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl p-10 shadow-sm border border-neutral-100 mb-10" id="eligibility">
              <h2 className="text-3xl font-bold text-neutral-800 mb-6">Eligibility</h2>
              <p className="text-xl text-neutral-700 leading-relaxed whitespace-pre-line">
                {scheme["Eligibility Requirements"] || "See official guidelines."}
              </p>
            </div>

            <div className="bg-white rounded-xl p-10 shadow-sm border border-neutral-100 mb-10" id="application">
              <h2 className="text-3xl font-bold text-neutral-800 mb-6">Application Process</h2>
              <p className="text-xl text-neutral-700 leading-relaxed whitespace-pre-line">
                {scheme["How To Apply"] || "Visit the official website."}
              </p>
              <div className="mt-8">
                <a
                  href={scheme["Website Link"]}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 font-medium hover:underline flex items-center gap-2 text-lg"
                >
                  Visit Official Website <ExternalLink size={20} />
                </a>
              </div>
            </div>

            <div className="bg-white rounded-xl p-10 shadow-sm border border-neutral-100 mb-10" id="documents">
              <h2 className="text-3xl font-bold text-neutral-800 mb-6">Documents Required</h2>
              <p className="text-xl text-neutral-700 leading-relaxed whitespace-pre-line">
                {scheme["Required Documents"] || "Check the official brochure."}
              </p>
            </div>

            {/* Placeholder sections for scrolling demo */}
            <div className="bg-white rounded-xl p-10 shadow-sm border border-neutral-100 mb-10" id="faq">
              <h2 className="text-3xl font-bold text-neutral-800 mb-6">Frequently Asked Questions</h2>
              <p className="text-xl text-neutral-500 italic">No FAQs available regarding this scheme.</p>
            </div>

            <div className="bg-white rounded-xl p-10 shadow-sm border border-neutral-100 mb-10" id="sources">
              <h2 className="text-3xl font-bold text-neutral-800 mb-6">Sources And References</h2>
              <p className="text-xl text-neutral-500 italic">Data provided by Ministy of Agriculture.</p>
            </div>

            <div className="bg-white rounded-xl p-10 shadow-sm border border-neutral-100 mb-10" id="feedback">
              <h2 className="text-3xl font-bold text-neutral-800 mb-6">Feedback</h2>
              <textarea
                className="w-full border border-neutral-300 rounded-lg p-4 text-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                rows="4"
                placeholder="Was this information helpful?"
              ></textarea>
              <button className="mt-4 bg-neutral-900 text-white px-8 py-3 rounded-lg hover:bg-black transition-colors text-lg font-medium">
                Submit Feedback
              </button>
            </div>
          </div>

          {/* Right Sidebar - News & Share */}
          <div className="w-full lg:w-1/4 flex-shrink-0">
            <div className="sticky top-6 space-y-8">
              <div className="bg-neutral-50 rounded-xl p-8">
                <h3 className="font-bold text-neutral-800 mb-6 text-xl">News and Updates</h3>

                {DUMMY_NEWS.length > 0 ? (
                  <div className="space-y-6">
                    {DUMMY_NEWS.map(news => (
                      <a key={news.id} href={news.link} className="block group">
                        <h4 className="text-base font-medium text-neutral-900 group-hover:text-blue-600 line-clamp-2 leading-snug">
                          {news.title}
                        </h4>
                        <span className="text-sm text-neutral-500 mt-2 block">{news.date}</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-base text-neutral-500 font-medium">No new news and updates available</p>
                )}
              </div>

              <div className="bg-neutral-50 rounded-xl p-8">
                <h3 className="font-bold text-neutral-800 mb-6 text-xl">Share</h3>
                <div className="flex gap-4">
                  <button className="w-12 h-12 rounded-full bg-neutral-400 text-white flex items-center justify-center hover:bg-neutral-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" /></svg>
                  </button>
                  <button className="w-12 h-12 rounded-full bg-neutral-400 text-white flex items-center justify-center hover:bg-neutral-600 transition-colors">
                    <ExternalLink size={22} />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}