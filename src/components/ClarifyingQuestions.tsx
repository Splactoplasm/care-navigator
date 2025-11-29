import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { type SymptomData } from "@/types/triage";
import { ChevronLeft } from "lucide-react";

interface ClarifyingQuestionsProps {
  symptomData: SymptomData;
  onComplete: (data: Partial<SymptomData>) => void;
  onBack: () => void;
}

const RED_FLAG_QUESTIONS = [
  {
    id: "chestPain",
    question: "Are you experiencing chest pain or pressure?",
  },
  {
    id: "breathingDifficulty",
    question: "Are you having severe difficulty breathing?",
  },
  {
    id: "suddenWeakness",
    question: "Do you have sudden weakness on one side of your body?",
  },
  {
    id: "severeHeadache",
    question: "Is this the worst headache you've ever experienced?",
  },
  {
    id: "uncontrolledBleeding",
    question: "Do you have bleeding that won't stop?",
  },
  {
    id: "confusion",
    question: "Are you feeling confused or disoriented?",
  },
];

export function ClarifyingQuestions({
  symptomData,
  onComplete,
  onBack,
}: ClarifyingQuestionsProps) {
  const [severity, setSeverity] = useState(symptomData.severity);
  const [duration, setDuration] = useState(symptomData.duration || "");
  const [redFlags, setRedFlags] = useState<Record<string, boolean>>({});

  const handleRedFlagChange = (id: string, value: boolean) => {
    setRedFlags((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    onComplete({
      severity,
      duration,
      redFlags,
    });
  };

  return (
    <div className="animate-slide-up space-y-6">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Card className="p-8 shadow-card">
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              Help us understand better
            </h2>
            <p className="text-muted-foreground">
              Answer a few quick questions about your symptoms
            </p>
          </div>

          {/* Severity Slider */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">
              How severe are your symptoms? ({severity}/10)
            </Label>
            <div className="space-y-2">
              <Slider
                value={[severity]}
                onValueChange={(value) => setSeverity(value[0])}
                max={10}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Mild</span>
                <span>Moderate</span>
                <span>Severe</span>
              </div>
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              How long have you had these symptoms?
            </Label>
            <RadioGroup value={duration} onValueChange={setDuration}>
              <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="hours" id="hours" />
                <Label htmlFor="hours" className="cursor-pointer flex-1">
                  Less than 24 hours
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="days" id="days" />
                <Label htmlFor="days" className="cursor-pointer flex-1">
                  1-3 days
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="week" id="week" />
                <Label htmlFor="week" className="cursor-pointer flex-1">
                  More than 3 days
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Red Flag Questions */}
          <div className="space-y-4">
            <Label className="text-base font-semibold">
              Important safety questions
            </Label>
            <div className="space-y-3">
              {RED_FLAG_QUESTIONS.map((q) => (
                <Card key={q.id} className="p-4 bg-muted/30">
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm">{q.question}</p>
                    <RadioGroup
                      value={redFlags[q.id] ? "yes" : "no"}
                      onValueChange={(value) =>
                        handleRedFlagChange(q.id, value === "yes")
                      }
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id={`${q.id}-yes`} />
                        <Label htmlFor={`${q.id}-yes`} className="cursor-pointer">
                          Yes
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id={`${q.id}-no`} />
                        <Label htmlFor={`${q.id}-no`} className="cursor-pointer">
                          No
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!duration}
            className="w-full h-12 text-lg shadow-button"
            size="lg"
          >
            Get Recommendation
          </Button>
        </div>
      </Card>
    </div>
  );
}
