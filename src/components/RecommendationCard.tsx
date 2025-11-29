import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { type TriageResult } from "@/types/triage";
import {
  AlertTriangle,
  Ambulance,
  Building2,
  Stethoscope,
  Home,
  Pill,
  Phone,
  MapPin,
  RefreshCw,
} from "lucide-react";

interface RecommendationCardProps {
  result: TriageResult;
  onStartOver: () => void;
}

const CARE_LEVEL_CONFIG = {
  emergency: {
    icon: Ambulance,
    bgColor: "bg-emergency/10",
    borderColor: "border-emergency/30",
    iconColor: "text-emergency",
    accentColor: "bg-emergency",
  },
  urgent: {
    icon: Building2,
    bgColor: "bg-urgent/10",
    borderColor: "border-urgent/30",
    iconColor: "text-urgent",
    accentColor: "bg-urgent",
  },
  gp: {
    icon: Stethoscope,
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
    iconColor: "text-primary",
    accentColor: "bg-primary",
  },
  pharmacist: {
    icon: Pill,
    bgColor: "bg-accent/10",
    borderColor: "border-accent/30",
    iconColor: "text-accent",
    accentColor: "bg-accent",
  },
  "self-care": {
    icon: Home,
    bgColor: "bg-safe/10",
    borderColor: "border-safe/30",
    iconColor: "text-safe",
    accentColor: "bg-safe",
  },
};

export function RecommendationCard({ result, onStartOver }: RecommendationCardProps) {
  const config = CARE_LEVEL_CONFIG[result.careLevel];
  const Icon = config.icon;

  return (
    <div className="animate-slide-up space-y-6">
      {/* Main Recommendation */}
      <Card
        className={`p-8 shadow-card border-2 ${config.bgColor} ${config.borderColor}`}
      >
        <div className="space-y-6">
          {/* Icon & Title */}
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-full ${config.accentColor}`}>
              <Icon className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <h2 className={`text-2xl font-bold mb-2 ${config.iconColor}`}>
                {result.title}
              </h2>
              <p className="text-foreground/90 text-lg">
                {result.description}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">What to do:</h3>
            <ul className="space-y-2">
              {result.actions.map((action, index) => (
                <li key={index} className="flex gap-3">
                  <span className={`${config.accentColor} text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0`}>
                    {index + 1}
                  </span>
                  <span className="text-foreground/90">{action}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Warnings */}
          {result.warnings.length > 0 && (
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-2 text-urgent">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="font-semibold">Important</h3>
              </div>
              <ul className="space-y-2">
                {result.warnings.map((warning, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    • {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        {result.careLevel === "emergency" && (
          <Button
            className="h-16 text-lg bg-emergency hover:bg-emergency/90"
            size="lg"
          >
            <Phone className="h-5 w-5 mr-2" />
            Call 000
          </Button>
        )}
        
        <Button
          variant="outline"
          className="h-16 text-lg"
          size="lg"
        >
          <MapPin className="h-5 w-5 mr-2" />
          Find Nearest {result.careLevel === "emergency" ? "ED" : result.careLevel === "urgent" ? "Urgent Care" : "GP"}
        </Button>

        {result.careLevel !== "emergency" && result.careLevel !== "self-care" && (
          <Button
            variant="outline"
            className="h-16 text-lg"
            size="lg"
          >
            <Phone className="h-5 w-5 mr-2" />
            Nurse-on-Call
          </Button>
        )}
      </div>

      {/* Additional Resources */}
      <Card className="p-6 bg-muted/50">
        <h3 className="font-semibold mb-3">Additional Resources</h3>
        <div className="space-y-2 text-sm">
          <a href="#" className="block text-primary hover:underline">
            → Healthdirect symptom checker
          </a>
          <a href="#" className="block text-primary hover:underline">
            → Find health services near you
          </a>
          <a href="#" className="block text-primary hover:underline">
            → Mental health support services
          </a>
        </div>
      </Card>

      {/* Start Over */}
      <div className="text-center pt-4">
        <Button
          variant="ghost"
          onClick={onStartOver}
          className="text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Check different symptoms
        </Button>
      </div>

      {/* Disclaimer */}
      <Card className="p-4 bg-muted/30 border-dashed">
        <p className="text-xs text-muted-foreground text-center">
          This recommendation is based on the information you provided and should not replace 
          professional medical advice. If you feel your condition is worsening or you're unsure, 
          seek immediate medical attention.
        </p>
      </Card>
    </div>
  );
}
