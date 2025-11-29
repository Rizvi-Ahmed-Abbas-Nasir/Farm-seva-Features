import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

const DiseaseAlertsDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  // Google Sheets CSV export URL
  const SHEET_URL = "https://docs.google.com/spreadsheets/d/1GYaSR_EL4c-oKNyiTyx1XOv2aI-ON8WmGJ0G491j35E/export?format=csv";

  useEffect(() => {
    fetchSheetData();
  }, []);

  useEffect(() => {
    filterAlerts();
  }, [alerts, searchTerm, selectedType]);

  const fetchSheetData = async () => {
    try {
      setLoading(true);
      Papa.parse(SHEET_URL, {
        download: true,
        header: true,
        complete: (result) => {
          // Remove empty rows and clean data
          const data = result.data
            .filter(row => row.Type && row.DiseaseName) // Remove empty rows
            .map((row, index) => ({
              id: index + 1,
              ...row
            }));
          
          setAlerts(data);
          setFilteredAlerts(data);
          setLoading(false);
        },
        error: (error) => {
          setError('Failed to fetch data from Google Sheets');
          setLoading(false);
          console.error('Error fetching data:', error);
        }
      });
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
      console.error('Error:', err);
    }
  };

  const filterAlerts = () => {
    let filtered = alerts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(alert =>
        alert.DiseaseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert.Locations?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        alert['Disease Overview']?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(alert =>
        alert.Type?.toLowerCase() === selectedType.toLowerCase()
      );
    }

    setFilteredAlerts(filtered);
  };

  const openAlertDetails = (alert) => {
    setSelectedAlert(alert);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAlert(null);
  };

  const getSeverityColor = (type) => {
    if (!type) return 'bg-gray-100 text-gray-800 border-gray-200';
    
    switch (type.toLowerCase()) {
      case 'outbreak':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'alert':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityBadge = (type) => {
    if (!type) return 'bg-gray-500';
    
    switch (type.toLowerCase()) {
      case 'outbreak':
        return 'bg-red-500';
      case 'alert':
        return 'bg-orange-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Get unique types for filter
  const alertTypes = ['all', ...new Set(alerts.map(alert => alert.Type).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading disease alerts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg">{error}</p>
          <button 
            onClick={fetchSheetData}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">
                🏥 Disease Alerts & Prevention
              </h1>
              <p className="text-gray-600 mt-2">
                Real-time disease outbreak information and preventive measures for farmers
              </p>
            </div>
            <div className="text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
              <div>Last Updated: {new Date().toLocaleDateString('en-IN')}</div>
              <div className="font-semibold">{alerts.length} Active Alerts</div>
            </div>
          </div>
        </div>
      </header>

      {/* Filters and Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search Input */}
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Diseases & Locations
              </label>
              <input
                type="text"
                id="search"
                placeholder="Search by disease name, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            {/* Type Filter */}
            <div>
              <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Alert Type
              </label>
              <select
                id="typeFilter"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {alertTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{alerts.length}</div>
            <div className="text-gray-600 text-sm">Total Alerts</div>
          </div>
          <div className="bg-red-50 rounded-xl shadow-sm p-4 text-center border border-red-200">
            <div className="text-2xl font-bold text-red-600">
              {alerts.filter(a => a.Type?.toLowerCase() === 'outbreak').length}
            </div>
            <div className="text-red-700 text-sm">Outbreaks</div>
          </div>
          <div className="bg-orange-50 rounded-xl shadow-sm p-4 text-center border border-orange-200">
            <div className="text-2xl font-bold text-orange-600">
              {alerts.filter(a => a.Type?.toLowerCase() === 'alert').length}
            </div>
            <div className="text-orange-700 text-sm">Alerts</div>
          </div>
          <div className="bg-blue-50 rounded-xl shadow-sm p-4 text-center border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">
              {[...new Set(alerts.flatMap(a => a.Locations?.split(',').map(l => l.trim())).filter(Boolean))].length}
            </div>
            <div className="text-blue-700 text-sm">Affected Regions</div>
          </div>
        </div>

        {/* Alerts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border cursor-pointer transform hover:-translate-y-1"
              onClick={() => openAlertDetails(alert)}
            >
              {/* Alert Header */}
              <div className={`p-4 rounded-t-xl border-b ${getSeverityColor(alert.Type)}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${getSeverityBadge(alert.Type)}`}></div>
                    <span className="font-semibold text-sm uppercase tracking-wide">
                      {alert.Type || 'Alert'}
                    </span>
                  </div>
                  <span className="text-sm font-medium bg-white bg-opacity-50 px-2 py-1 rounded">
                    {alert.MonthYear}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {alert.DiseaseName}
                </h3>
              </div>

              {/* Alert Body */}
              <div className="p-4">
                <div className="mb-4">
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <span className="mr-2">📍</span>
                    <span className="font-medium">Affected Areas:</span>
                  </div>
                  <p className="text-gray-800 font-semibold text-sm">
                    {alert.Locations}
                  </p>
                </div>

                <div className="mb-3">
                  <div className="flex items-center text-sm text-gray-600 mb-1">
                    <span className="mr-2">📝</span>
                    <span className="font-medium">Overview:</span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {alert['Disease Overview'] || 'No overview available.'}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mt-4 pt-3 border-t">
                  <span>Updated: {alert.UpdatedDate || 'N/A'}</span>
                  <button className="text-green-600 hover:text-green-700 font-medium flex items-center">
                    View Details 
                    <span className="ml-1">→</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredAlerts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No alerts found
            </h3>
            <p className="text-gray-500">
              {searchTerm || selectedType !== 'all' 
                ? 'Try adjusting your search filters' 
                : 'No active disease alerts at the moment'}
            </p>
            {(searchTerm || selectedType !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedType('all');
                }}
                className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modal for Detailed View */}
      {isModalOpen && selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
            {/* Modal Header */}
            <div className={`p-6 ${getSeverityColor(selectedAlert.Type)} rounded-t-xl`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${getSeverityBadge(selectedAlert.Type)}`}></div>
                    <span className="font-semibold text-sm uppercase tracking-wide">
                      {selectedAlert.Type}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedAlert.DiseaseName}
                  </h2>
                  <div className="flex items-center text-sm text-gray-600 mt-2 flex-wrap gap-2">
                    <span>📅 {selectedAlert.MonthYear}</span>
                    <span>•</span>
                    <span>🔄 Updated: {selectedAlert.UpdatedDate || 'N/A'}</span>
                    {selectedAlert.UpdatedOn && (
                      <>
                        <span>•</span>
                        <span>Via: {selectedAlert.UpdatedOn}</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl ml-4 flex-shrink-0"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Locations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2 text-xl">📍</span>
                  Affected Locations
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <p className="text-gray-800 font-medium">{selectedAlert.Locations}</p>
                </div>
              </div>

              {/* Disease Overview */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2 text-xl">🔍</span>
                  Disease Overview
                </h3>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-gray-800 leading-relaxed">
                    {selectedAlert['Disease Overview'] || 'No overview available.'}
                  </p>
                </div>
              </div>

              {/* Preventive Measures */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="mr-2 text-xl">🛡️</span>
                  Preventive Measures
                </h3>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  {selectedAlert['Possible Preventive Measure'] ? (
                    <div className="space-y-2">
                      {selectedAlert['Possible Preventive Measure'].split('\n').map((measure, index) => (
                        measure.trim() && (
                          <div key={index} className="flex items-start">
                            <span className="text-green-600 mr-3 mt-1">•</span>
                            <span className="text-gray-800 flex-1">{measure.trim()}</span>
                          </div>
                        )
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 italic">No preventive measures listed.</p>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-center bg-gray-50 rounded-lg p-3 border">
                  <div className="text-gray-600">Updated On</div>
                  <div className="font-semibold text-gray-900">{selectedAlert.UpdatedOn || 'N/A'}</div>
                </div>
                <div className="text-center bg-gray-50 rounded-lg p-3 border">
                  <div className="text-gray-600">Alert ID</div>
                  <div className="font-semibold text-gray-900">{selectedAlert.OBTID || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t px-6 py-4">
              <button
                onClick={closeModal}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseaseAlertsDashboard;