import { useState } from "react";
import { SymptomEntry } from "@/components/SymptomEntry";
import { ClarifyingQuestions } from "@/components/ClarifyingQuestions";
import { RecommendationCard } from "@/components/RecommendationCard";
import { type SymptomData, type TriageResult } from "@/types/triage";
import { evaluateTriage } from "@/utils/triageLogic";

type FlowStep = "entry" | "clarifying" | "recommendation";

const Index = () => {
  const [step, setStep] = useState<FlowStep>("entry");
  const [symptomData, setSymptomData] = useState<SymptomData>({
    symptoms: [],
    severity: 5,
    duration: "",
    additionalInfo: "",
  });
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);

  const handleSymptomSubmit = (data: Partial<SymptomData>) => {
    setSymptomData((prev) => ({ ...prev, ...data }));
    setStep("clarifying");
  };

  const handleClarifyingComplete = (data: Partial<SymptomData>) => {
    const finalData = { ...symptomData, ...data };
    setSymptomData(finalData);
    
    // Evaluate triage based on all collected data
    const result = evaluateTriage(finalData);
    setTriageResult(result);
    setStep("recommendation");
  };

  const handleStartOver = () => {
    setStep("entry");
    setSymptomData({
      symptoms: [],
      severity: 5,
      duration: "",
      additionalInfo: "",
    });
    setTriageResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3">
            CarePath
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Helping you find the right care, when you need it
          </p>
        </header>

        {/* Main Content */}
        <main>
          {step === "entry" && (
            <SymptomEntry onSubmit={handleSymptomSubmit} />
          )}

          {step === "clarifying" && (
            <ClarifyingQuestions
              symptomData={symptomData}
              onComplete={handleClarifyingComplete}
              onBack={() => setStep("entry")}
            />
          )}

          {step === "recommendation" && triageResult && (
            <RecommendationCard
              result={triageResult}
              onStartOver={handleStartOver}
            />
          )}
        </main>

        {/* Footer disclaimer */}
        <footer className="mt-16 text-center text-sm text-muted-foreground max-w-2xl mx-auto">
          <p className="border-t border-border pt-6">
            <strong>Important:</strong> CarePath is a decision support tool, not a diagnostic service. 
            If you're experiencing a medical emergency, call <strong>000</strong> immediately.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
