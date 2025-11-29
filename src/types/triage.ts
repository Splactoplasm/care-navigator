export type CareLevel = "emergency" | "urgent" | "gp" | "pharmacist" | "self-care";

export interface SymptomData {
  symptoms: string[];
  severity: number; // 0-10
  duration: string;
  additionalInfo: string;
  redFlags?: {
    chestPain?: boolean;
    breathingDifficulty?: boolean;
    suddenWeakness?: boolean;
    severeHeadache?: boolean;
    uncontrolledBleeding?: boolean;
    confusion?: boolean;
    blueLips?: boolean;
  };
}

export interface TriageResult {
  careLevel: CareLevel;
  title: string;
  description: string;
  actions: string[];
  warnings: string[];
  reasoning: string;
}
