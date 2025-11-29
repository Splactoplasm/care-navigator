import { type SymptomData, type TriageResult, type CareLevel } from "@/types/triage";

// Red flag symptoms that always require ED
const RED_FLAGS = {
  chestPain: ["chest pain", "chest pressure", "heart attack"],
  breathingDifficulty: ["can't breathe", "breathing difficulty", "gasping", "choking"],
  suddenWeakness: ["weakness one side", "face drooping", "arm weakness", "stroke"],
  severeHeadache: ["worst headache", "thunderclap headache", "sudden severe headache"],
  uncontrolledBleeding: ["heavy bleeding", "can't stop bleeding", "bleeding heavily"],
  confusion: ["confused", "disoriented", "not making sense"],
  blueLips: ["blue lips", "blue skin", "turning blue"],
};

// Urgent symptoms that need same-day or urgent care
const URGENT_SYMPTOMS = [
  "high fever", "persistent vomiting", "severe pain", "dehydration",
  "rash with fever", "difficulty swallowing", "severe allergic reaction",
  "injury", "sprain", "broken bone", "head injury"
];

// Common GP symptoms
const GP_SYMPTOMS = [
  "fever", "cough", "cold", "sore throat", "earache", "back pain",
  "rash", "infection", "persistent symptoms", "abdominal pain"
];

// Pharmacist/self-care symptoms
const MINOR_SYMPTOMS = [
  "mild headache", "minor rash", "mild cold", "constipation",
  "minor cut", "mild bruise", "hay fever", "minor aches"
];

export function evaluateTriage(data: SymptomData): TriageResult {
  const symptomsLower = data.symptoms.map(s => s.toLowerCase());
  const allText = [...symptomsLower, data.additionalInfo.toLowerCase()].join(" ");
  
  // Check for red flags first
  if (data.redFlags) {
    const hasRedFlag = Object.values(data.redFlags).some(flag => flag === true);
    if (hasRedFlag) {
      return createEmergencyResult("Critical symptoms detected");
    }
  }

  // Check text for red flag keywords
  for (const [flagType, keywords] of Object.entries(RED_FLAGS)) {
    if (keywords.some(keyword => allText.includes(keyword))) {
      return createEmergencyResult(`${flagType} detected`);
    }
  }

  // High severity always needs urgent attention
  if (data.severity >= 8) {
    return createUrgentResult();
  }

  // Check for urgent symptoms
  const hasUrgent = URGENT_SYMPTOMS.some(symptom => 
    allText.includes(symptom.toLowerCase())
  );
  if (hasUrgent && data.severity >= 6) {
    return createUrgentResult();
  }

  // Check for GP-appropriate symptoms
  const hasGPSymptom = GP_SYMPTOMS.some(symptom =>
    allText.includes(symptom.toLowerCase())
  );
  if (hasGPSymptom || data.severity >= 4) {
    return createGPResult();
  }

  // Check for minor symptoms
  const hasMinorSymptom = MINOR_SYMPTOMS.some(symptom =>
    allText.includes(symptom.toLowerCase())
  );
  if (hasMinorSymptom && data.severity < 4) {
    return createPharmacistResult();
  }

  // Default to self-care for very mild symptoms
  if (data.severity <= 2) {
    return createSelfCareResult();
  }

  // Safe default: GP visit
  return createGPResult();
}

function createEmergencyResult(reason: string): TriageResult {
  return {
    careLevel: "emergency",
    title: "Seek Emergency Care Immediately",
    description: "Based on your symptoms, you should go to an Emergency Department or call 000 right now.",
    actions: [
      "Call 000 for an ambulance if unable to travel safely",
      "Go to your nearest Emergency Department immediately",
      "Do not drive yourself if symptoms are severe"
    ],
    warnings: [
      "Do not delay seeking emergency care",
      "If symptoms worsen, call 000 immediately"
    ],
    reasoning: reason
  };
}

function createUrgentResult(): TriageResult {
  return {
    careLevel: "urgent",
    title: "Visit an Urgent Care Centre",
    description: "Your symptoms require prompt attention. Visit an Urgent Care Centre or see a GP within 24 hours.",
    actions: [
      "Visit an Urgent Care Centre today",
      "Book a same-day GP appointment if available",
      "Consider after-hours GP if outside business hours"
    ],
    warnings: [
      "If symptoms suddenly worsen, seek emergency care",
      "Don't wait more than 24 hours to be seen"
    ],
    reasoning: "Symptoms indicate need for prompt medical assessment"
  };
}

function createGPResult(): TriageResult {
  return {
    careLevel: "gp",
    title: "See Your General Practitioner",
    description: "Your symptoms are best addressed by your GP. Book an appointment in the next few days.",
    actions: [
      "Book an appointment with your regular GP",
      "Prepare a list of your symptoms and their duration",
      "Note any medications you're currently taking"
    ],
    warnings: [
      "If symptoms worsen significantly, seek urgent care",
      "Call your GP for advice if unsure"
    ],
    reasoning: "Symptoms are appropriate for GP consultation"
  };
}

function createPharmacistResult(): TriageResult {
  return {
    careLevel: "pharmacist",
    title: "Visit Your Local Pharmacist",
    description: "Your symptoms may be managed with pharmacy advice and over-the-counter treatments.",
    actions: [
      "Visit your local pharmacy for advice",
      "Ask the pharmacist about appropriate treatments",
      "Follow package instructions carefully"
    ],
    warnings: [
      "If symptoms don't improve in 2-3 days, see your GP",
      "If symptoms worsen, seek medical attention"
    ],
    reasoning: "Symptoms suitable for pharmacy management"
  };
}

function createSelfCareResult(): TriageResult {
  return {
    careLevel: "self-care",
    title: "Self-Care at Home",
    description: "Your symptoms are mild and can likely be managed at home with rest and basic care.",
    actions: [
      "Rest and stay hydrated",
      "Use over-the-counter pain relief if needed",
      "Monitor your symptoms over the next 24-48 hours"
    ],
    warnings: [
      "If symptoms worsen or persist beyond 3-5 days, see your GP",
      "Seek urgent care if new concerning symptoms develop"
    ],
    reasoning: "Symptoms are mild and suitable for home management"
  };
}
