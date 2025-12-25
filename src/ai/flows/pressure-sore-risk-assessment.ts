'use server';
/**
 * @fileOverview Assesses the risk of pressure sores for patients using GenAI.
 *
 * - assessPressureSoreRisk - A function that assesses the risk of pressure sores.
 * - PressureSoreRiskInput - The input type for the assessPressureSoreRisk function.
 * - PressureSoreRiskOutput - The return type for the assessPressureSoreRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PressureSoreRiskInputSchema = z.object({
  patientData: z
    .string()
    .describe(
      'Comprehensive patient data, including age, mobility, nutrition, skin condition, and medical history.'
    ),
});
export type PressureSoreRiskInput = z.infer<typeof PressureSoreRiskInputSchema>;

const PressureSoreRiskOutputSchema = z.object({
  riskLevel: z
    .string()
    .describe(
      'The risk level of pressure sores, which should be one of: High, Medium, Low.'
    ),
  reasoning: z
    .string()
    .describe('The detailed reasoning behind the risk level assessment.'),
  recommendations: z
    .string()
    .describe('Preventive measures and recommendations based on the risk assessment.'),
});
export type PressureSoreRiskOutput = z.infer<typeof PressureSoreRiskOutputSchema>;

export async function assessPressureSoreRisk(
  input: PressureSoreRiskInput
): Promise<PressureSoreRiskOutput> {
  return assessPressureSoreRiskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'pressureSoreRiskPrompt',
  input: {schema: PressureSoreRiskInputSchema},
  output: {schema: PressureSoreRiskOutputSchema},
  prompt: `You are an expert healthcare professional specializing in pressure sore prevention.

You will use the patient data provided to assess the risk of pressure sores. Based on the data and your expert knowledge, determine the risk level (High, Medium, or Low), provide detailed reasoning behind the assessment, and offer preventive measures and recommendations.

Patient Data: {{{patientData}}}`,
});

const assessPressureSoreRiskFlow = ai.defineFlow(
  {
    name: 'assessPressureSoreRiskFlow',
    inputSchema: PressureSoreRiskInputSchema,
    outputSchema: PressureSoreRiskOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
