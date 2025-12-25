"use server";

import { assessPressureSoreRisk, PressureSoreRiskInput, PressureSoreRiskOutput } from '@/ai/flows/pressure-sore-risk-assessment';
import type { Patient } from '@/lib/types';

export async function getPressureSoreRisk(patient: Patient): Promise<PressureSoreRiskOutput> {
  // Construct a detailed string of patient data for the AI model
  const patientData = `
    - Patient Name: ${patient.name}
    - Age: ${patient.age}
    - Sex: ${patient.sex}
    - Bed ID: ${patient.bedId}
    - Primary Medical History: ${patient.medicalHistory.join(', ')}
    - Mobility Status: ${patient.mobility}
    - Recent Skin Condition Assessment: '${patient.skinCondition}'.
    - Nutritional Status: ${patient.nutrition}
    - Current Vital Signs: Blood Pressure ${patient.vitals.bloodPressure} mmHg, Pulse ${patient.vitals.pulse} bpm, Temperature ${patient.vitals.temperature}°C, SpO2 ${patient.vitals.spo2}%, Respiratory Rate ${patient.vitals.respiratoryRate} breaths/min.
    - Bed Status: Position is ${patient.bed.position}, side rails are ${patient.bed.railsUp ? 'up' : 'down'}.
    - Recent Movement: Last significant movement was ${patient.movement.lastMoved}.
  `;

  const input: PressureSoreRiskInput = { patientData };
  
  try {
    const result = await assessPressureSoreRisk(input);
    return result;
  } catch (error) {
    console.error("Error assessing pressure sore risk:", error);
    // Return a structured error response
    return {
      riskLevel: "Error",
      reasoning: "An error occurred while processing the risk assessment. Please try again later.",
      recommendations: "No recommendations available due to an error.",
    };
  }
}
