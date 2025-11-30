import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import StepFormWizard from "./components/StepFormWizard";
import RiskResultPage from "./components/RiskResultPage"; // import the new page
import GovtScheme from "./components/GovtScheme"; // import the new page
import OutBreak from "./components/OutBreak"; // import the new page
import VetConnect from "./components/VetConnect"; // import the new page


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-main">
        <Routes>
          {/* Dashboard on root URL */}
          <Route path="/" element={<Dashboard />} />

          {/* Risk Assessment form */}
          <Route path="/risk-assignment" element={<StepFormWizard />} />
                    <Route path="/Govt-schemes" element={<GovtScheme />} />
                    <Route path="/Live-OutBreak" element={<OutBreak />} />
                                        <Route path="/VetConnect" element={<VetConnect />} />



          {/* Risk Result page */}
          <Route path="/risk-result" element={<RiskResultPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
