import type { Patient } from './types';

const generateVitalsHistory = () => {
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const time = new Date();
    time.setHours(time.getHours() - i * 4);
    data.push({
      time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      value: 70 + Math.random() * 20,
    });
  }
  return data;
};

const generateBPHistory = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const time = new Date();
      time.setHours(time.getHours() - i * 4);
      data.push({
        time: time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        value: {
          systolic: 110 + Math.floor(Math.random() * 20),
          diastolic: 70 + Math.floor(Math.random() * 15),
        }
      });
    }
    return data;
}

const generateSleepPatterns = () => {
  const data = [];
  for (let i = 8; i >= 0; i--) {
    const time = new Date();
    time.setHours(time.getHours() - i);
    data.push({
      time: `${22 - i}:00`,
      level: Math.floor(Math.random() * 4) + 1, // 1: Awake, 2: Light, 3: Deep, 4: REM
    });
  }
  return data;
}

export const mockPatients: Patient[] = [
  {
    id: '1',
    name: 'John Doe',
    bedId: '101A',
    age: 78,
    sex: 'Male',
    vitals: {
      bloodPressure: '128/84',
      pulse: 72,
      temperature: 37.1,
      spo2: 98,
      respiratoryRate: 16,
      history: {
        bloodPressure: generateBPHistory(),
        pulse: generateVitalsHistory(),
        temperature: generateVitalsHistory(),
      },
    },
    movement: {
      lastMoved: '15 minutes ago',
      sleepPatterns: generateSleepPatterns(),
    },
    bed: {
      position: 'Inclined',
      railsUp: true,
    },
    medications: [
      { id: 'med1', name: 'Lisinopril', dosage: '10mg', time: '08:00', status: 'Taken' },
      { id: 'med2', name: 'Metformin', dosage: '500mg', time: '20:00', status: 'Due' },
    ],
    alerts: [
      { id: 'alert1', type: 'High BP', priority: 'Medium', timestamp: '2 hours ago' },
    ],
    reminders: [
      { id: 'rem1', type: 'Water', time: '14:00', title: 'Drink a glass of water' },
      { id: 'rem2', type: 'Medicine', time: '20:00', title: 'Take Metformin' },
    ],
    medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
    mobility: 'Ambulatory with assistance',
    skinCondition: 'Intact, no signs of redness',
    nutrition: 'Regular diet, good appetite',
  },
  {
    id: '2',
    name: 'Jane Smith',
    bedId: '102B',
    age: 85,
    sex: 'Female',
    vitals: {
      bloodPressure: '145/90',
      pulse: 88,
      temperature: 36.8,
      spo2: 95,
      respiratoryRate: 20,
      history: {
        bloodPressure: generateBPHistory(),
        pulse: generateVitalsHistory(),
        temperature: generateVitalsHistory(),
      },
    },
    movement: {
      lastMoved: '2 hours ago',
      sleepPatterns: generateSleepPatterns(),
    },
    bed: {
      position: 'Flat',
      railsUp: true,
    },
    medications: [
      { id: 'med3', name: 'Aspirin', dosage: '81mg', time: '09:00', status: 'Taken' },
      { id: 'med4', name: 'Atorvastatin', dosage: '20mg', time: '21:00', status: 'Due' },
    ],
    alerts: [
      { id: 'alert2', type: 'Fall Detection', priority: 'Emergency', timestamp: '5 minutes ago' },
      { id: 'alert3', type: 'Low SpO2', priority: 'High', timestamp: '30 minutes ago' },
    ],
    reminders: [
        { id: 'rem3', type: 'Food', time: '18:00', title: 'Dinner time' },
    ],
    medicalHistory: ['Coronary Artery Disease', 'History of falls'],
    mobility: 'Bed-bound',
    skinCondition: 'Redness observed on sacrum',
    nutrition: 'Soft diet, requires feeding assistance',
  },
  {
    id: '3',
    name: 'Robert Johnson',
    bedId: '103C',
    age: 65,
    sex: 'Male',
    vitals: {
      bloodPressure: '110/70',
      pulse: 65,
      temperature: 38.5,
      spo2: 99,
      respiratoryRate: 18,
      history: {
        bloodPressure: generateBPHistory(),
        pulse: generateVitalsHistory(),
        temperature: generateVitalsHistory(),
      },
    },
    movement: {
      lastMoved: '30 minutes ago',
      sleepPatterns: generateSleepPatterns(),
    },
    bed: {
      position: 'Upright',
      railsUp: false,
    },
    medications: [
        { id: 'med5', name: 'Paracetamol', dosage: '1g', time: '12:00', status: 'Taken' },
    ],
    alerts: [
        { id: 'alert4', type: 'Fever', priority: 'High', timestamp: '1 hour ago' },
    ],
    reminders: [],
    medicalHistory: ['Pneumonia'],
    mobility: 'Independent',
    skinCondition: 'Intact, warm to touch',
    nutrition: 'Clear fluid diet',
  },
  {
    id: '4',
    name: 'Emily White',
    bedId: '104D',
    age: 92,
    sex: 'Female',
    vitals: {
      bloodPressure: '130/78',
      pulse: 76,
      temperature: 36.9,
      spo2: 97,
      respiratoryRate: 17,
      history: {
        bloodPressure: generateBPHistory(),
        pulse: generateVitalsHistory(),
        temperature: generateVitalsHistory(),
      },
    },
    movement: {
      lastMoved: '45 minutes ago',
      sleepPatterns: generateSleepPatterns(),
    },
    bed: {
      position: 'Inclined',
      railsUp: true,
    },
    medications: [
      { id: 'med6', name: 'Furosemide', dosage: '40mg', time: '10:00', status: 'Taken' },
      { id: 'med7', name: 'Potassium', dosage: '20mEq', time: '10:00', status: 'Taken' },
    ],
    alerts: [],
    reminders: [
        { id: 'rem4', type: 'Water', time: '16:00', title: 'Drink a glass of water' },
    ],
    medicalHistory: ['Congestive Heart Failure', 'Chronic Kidney Disease'],
    mobility: 'Wheelchair-bound',
    skinCondition: 'Dry, fragile skin',
    nutrition: 'Low sodium diet, fair appetite',
  },
];
