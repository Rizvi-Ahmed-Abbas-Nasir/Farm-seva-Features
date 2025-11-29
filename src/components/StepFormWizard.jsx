import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import AnimalHealthForm from "./RiskForm/AnimalHealthForm";
import FeedNutritionForm from "./RiskForm/FeedNutritionForm";
import EnvironmentalForm from "./RiskForm/EnvironmentalForm";
import OperationalForm from "./RiskForm/OperationalForm";
import BiosecurityForm from "./RiskForm/BiosecurityForm";

const steps = [
  "Animal Health Risks",
  "Feed & Nutrition Risks",
  "Environmental Risks",
  "Operational Risks",
  "Biosecurity Risks",
];

export default function StepFormWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [riskResult, setRiskResult] = useState(null);

  const formRef = useRef(null);
  const stepRefs = useRef([]);

  const updateFormData = (stepKey, data) => {
    setFormData((prev) => ({ ...prev, [stepKey]: data }));
  };
const [showRiskModal, setShowRiskModal] = useState(false);
  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () =>
    setCurrentStep((prev) => Math.max(prev - 1, 0));

  // Animate form when step changes
  useEffect(() => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      );
    }

    // Animate stepper progress
    stepRefs.current.forEach((el, i) => {
      if (i <= currentStep && el) {
        gsap.to(el, { backgroundColor: "#16a34a", duration: 0.5 }); // green
      } else if (el) {
        gsap.to(el, { backgroundColor: "#d1d5db", duration: 0.5 }); // gray
      }
    });
  }, [currentStep]);
const submitDataToGemini = async () => {
  setLoading(true);
  try {
    const userText = `
      You are a farm risk assessment assistant.
      Analyze the following farm data and provide a score (0-10) for each section:
      - Animal Health
      - Feed & Nutrition
      - Environmental
      - Operational
      - Biosecurity

      Threshold for each section is 5.
      For each section, if the score is below 5, mention it is low and give the numeric compliance score.

      Also calculate:
      - Overall numeric score as sum of all section scores (0-50)
      - Overall fraction as OverallScore / 50

      Farm Data:
      ${JSON.stringify(formData, null, 2)}

      Provide output in this format:
      Section: <section name>
      Score: <0-10>
      Status: <Low/Good>
      Notes: <any observations>

      Overall Score: <numeric sum>
      Overall Fraction: <numeric sum>/50
    `;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": "AIzaSyDiCcX3A6hYX7oRcuaYMJNa9bmf_kUKt64",
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: userText }] }],
        }),
      }
    );

    const result = await response.json();

    let generatedText = "No response from Gemini";

    const firstCandidate = result?.candidates?.[0];
    if (firstCandidate?.content?.parts?.length > 0) {
      generatedText = firstCandidate.content.parts
        .map((part) => part.text?.trim() || "")
        .filter(Boolean)
        .join("\n\n");
    }

    setRiskResult(generatedText);

    // Redirect to result page with state
    navigate("/risk-result", {
      state: { formData, riskResult: generatedText },
    });
  } catch (err) {
    console.error(err);
    alert("Failed to get risk assessment. Check your API key and network.");
  } finally {
    setLoading(false);
  }
};






// Auto-show modal when riskResult arrives
useEffect(() => {
  if (riskResult) setShowRiskModal(true);
}, [riskResult]);

// JSX for modal
{riskResult && showRiskModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white w-11/12 max-w-4xl max-h-[80vh] rounded-2xl shadow-lg overflow-y-auto p-6 relative">
      
      {/* Close button */}
      <button
        onClick={() => setShowRiskModal(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
      >
        ×
      </button>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-green-700 mb-4">
        Farm Risk Assessment Result
      </h2>

      {/* Content */}
      <pre className="text-sm whitespace-pre-wrap break-words">
        {riskResult}
      </pre>
    </div>
  </div>
)}


  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <AnimalHealthForm
            onNext={nextStep}
            data={formData.animalHealth}
            setData={(d) => updateFormData("animalHealth", d)}
          />
        );
      case 1:
        return (
          <FeedNutritionForm
            onNext={nextStep}
            onBack={prevStep}
            data={formData.feedNutrition}
            setData={(d) => updateFormData("feedNutrition", d)}
          />
        );
      case 2:
        return (
          <EnvironmentalForm
            onNext={nextStep}
            onBack={prevStep}
            data={formData.environmental}
            setData={(d) => updateFormData("environmental", d)}
          />
        );
      case 3:
        return (
          <OperationalForm
            onNext={nextStep}
            onBack={prevStep}
            data={formData.operational}
            setData={(d) => updateFormData("operational", d)}
          />
        );
      case 4:
        return (
          <BiosecurityForm
            onBack={prevStep}
            data={formData.biosecurity}
            setData={(d) => updateFormData("biosecurity", d)}
            onSubmit={submitDataToGemini} // new prop for last step
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-green-50 min-h-screen flex items-center justify-center text-black">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-6 overflow-hidden">
        {/* Stepper */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={index} className="flex-1 flex items-center">
              <div
                ref={(el) => (stepRefs.current[index] = el)}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-white`}
              >
                {index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 bg-gray-300`}
                  style={{ transition: "background-color 0.3s ease" }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-green-700 mb-4">
          {steps[currentStep]}
        </h2>

        {/* Animated Form */}
        <div ref={formRef}>{renderStep()}</div>

        {/* Submit Button on Last Step */}
        {currentStep === steps.length - 1 && (
          <div className="flex justify-end mt-4">
            <button
              onClick={submitDataToGemini}
              disabled={loading}
              className={`bg-green-600 text-white px-4 py-2 rounded-lg ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Assessing..." : "Submit & Assess Risk"}
            </button>
          </div>
        )}

        {/* Optional: show Gemini result */}
       {riskResult && showRiskModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white w-11/12 max-w-4xl max-h-[80vh] rounded-2xl shadow-lg overflow-y-auto p-6 relative">
      
      {/* Close button */}
      <button
        onClick={() => setShowRiskModal(false)}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
      >
        ×
      </button>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-green-700 mb-4">
        Farm Risk Assessment Result
      </h2>

      {/* Content */}
      <pre className="text-sm whitespace-pre-wrap break-words">
        {riskResult}
      </pre>
    </div>
  </div>
)}


      </div>
    </div>
  );
}
