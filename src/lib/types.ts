export interface VitalSignHistory {
  time: string;
  value: number | { systolic: number; diastolic: number };
}

export interface Vitals {
  bloodPressure: string;
  pulse: number;
  temperature: number;
  spo2: number;
  respiratoryRate: number;
  history: {
    bloodPressure: VitalSignHistory[];
    pulse: VitalSignHistory[];
    temperature: VitalSignHistory[];
  };
}

export interface Alert {
  id: string;
  type: 'Fall Detection' | 'High BP' | 'Low SpO2' | 'Fever';
  priority: 'Emergency' | 'High' | 'Medium' | 'Low';
  timestamp: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  status: 'Taken' | 'Due' | 'Missed';
}

export interface Reminder {
  id: string;
  type: 'Food' | 'Water' | 'Medicine';
  time: string;
  title: string;
}

export interface Patient {
  id: string;
  name: string;
  bedId: string;
  age: number;
  sex: 'Male' | 'Female';
  vitals: Vitals;
  movement: {
    lastMoved: string;
    sleepPatterns: { time: string, level: number }[];
  };
  bed: {
    position: 'Flat' | 'Inclined' | 'Upright';
    railsUp: boolean;
  };
  medications: Medication[];
  alerts: Alert[];
  reminders: Reminder[];
  // For AI Assessment
  medicalHistory: string[];
  mobility: string;
  skinCondition: string;
  nutrition: string;
}
