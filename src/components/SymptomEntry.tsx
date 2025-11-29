import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { type SymptomData } from "@/types/triage";
import { AlertCircle } from "lucide-react";

interface SymptomEntryProps {
  onSubmit: (data: Partial<SymptomData>) => void;
}

const COMMON_SYMPTOMS = [
  "Fever",
  "Headache",
  "Cough",
  "Chest Pain",
  "Difficulty Breathing",
  "Abdominal Pain",
  "Nausea",
  "Rash",
  "Injury",
  "Back Pain",
];

export function SymptomEntry({ onSubmit }: SymptomEntryProps) {
  const [text, setText] = useState("");
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = () => {
    const allSymptoms = [
      ...selectedSymptoms,
      ...text.split(",").map((s) => s.trim()).filter(Boolean),
    ];
    
    if (allSymptoms.length === 0) {
      return;
    }

    onSubmit({
      symptoms: allSymptoms,
      additionalInfo: text,
    });
  };

  return (
    <div className="animate-slide-up space-y-6">
      {/* Safety Notice */}
      <Card className="bg-emergency/10 border-emergency/20 p-4">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-emergency flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-emergency mb-1">
              Emergency? Call 000 immediately
            </p>
            <p className="text-muted-foreground">
              For severe chest pain, difficulty breathing, loss of consciousness, 
              severe bleeding, or other life-threatening situations.
            </p>
          </div>
        </div>
      </Card>

      {/* Main Entry Card */}
      <Card className="p-8 shadow-card">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              What brings you here today?
            </h2>
            <p className="text-muted-foreground">
              Select common symptoms or describe what you're experiencing
            </p>
          </div>

          {/* Common Symptoms */}
          <div>
            <label className="text-sm font-medium mb-3 block">
              Common symptoms
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_SYMPTOMS.map((symptom) => (
                <Badge
                  key={symptom}
                  variant={selectedSymptoms.includes(symptom) ? "default" : "outline"}
                  className="cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105"
                  onClick={() => toggleSymptom(symptom)}
                >
                  {symptom}
                </Badge>
              ))}
            </div>
          </div>

          {/* Text Entry */}
          <div>
            <label htmlFor="symptoms" className="text-sm font-medium mb-3 block">
              Describe your symptoms
            </label>
            <Textarea
              id="symptoms"
              placeholder="E.g., I have a headache and fever that started yesterday..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[120px] resize-none"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={selectedSymptoms.length === 0 && text.trim() === ""}
            className="w-full h-12 text-lg shadow-button"
            size="lg"
          >
            Continue
          </Button>
        </div>
      </Card>

      {/* Info Text */}
      <p className="text-center text-sm text-muted-foreground">
        This tool provides guidance only and is not a substitute for professional medical advice
      </p>
    </div>
  );
}
