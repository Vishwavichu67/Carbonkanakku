// Implemented Genkit flow for suggesting tailored reduction strategies using AI.

'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting tailored reduction strategies using AI.
 *
 * - getTailoredReductionStrategies - A function that calls the tailoredReductionStrategiesFlow to get reduction strategies.
 * - TailoredReductionStrategiesInput - The input type for the getTailoredReductionStrategies function.
 * - TailoredReductionStrategiesOutput - The output type for the getTailoredReductionStrategies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TailoredReductionStrategiesInputSchema = z.object({
  industrySubdomain: z.string().describe('The industry subdomain of the user (e.g., Spinning Unit, Dyeing Unit).'),
  companyInfo: z.string().describe('Information about the company, including capacity, employees, and yearly output.'),
  location: z.string().describe('The location of the company, used to fetch emission factors region-wise.'),
  complianceLevel: z.string().describe('The compliance level of the company (e.g., basic, intermediate, certified).'),
  recentActivitySummary: z.string().describe('A summary of the recent activity of the user.'),
  currentCarbonFootprint: z.number().describe('The current carbon footprint of the company (in CO₂e).'),
  inputData: z.record(z.any()).describe('Custom data points based on the selected industry subdomain.'),
});

export type TailoredReductionStrategiesInput = z.infer<typeof TailoredReductionStrategiesInputSchema>;

const TailoredReductionStrategiesOutputSchema = z.object({
  reductionStrategies: z.array(z.string()).describe('A list of tailored reduction strategies for the user.'),
  sustainabilityScoreBadge: z.string().optional().describe('A sustainability score badge for high performers (if applicable).'),
});

export type TailoredReductionStrategiesOutput = z.infer<typeof TailoredReductionStrategiesOutputSchema>;

export async function getTailoredReductionStrategies(
  input: TailoredReductionStrategiesInput
): Promise<TailoredReductionStrategiesOutput> {
  return tailoredReductionStrategiesFlow(input);
}

const tailoredReductionStrategiesPrompt = ai.definePrompt({
  name: 'tailoredReductionStrategiesPrompt',
  input: {schema: TailoredReductionStrategiesInputSchema},
  output: {schema: TailoredReductionStrategiesOutputSchema},
  prompt: `You are an expert sustainability consultant for the textile industry.

  Based on the information provided, suggest tailored reduction strategies for the user.

  Industry Subdomain: {{{industrySubdomain}}}
  Company Info: {{{companyInfo}}}
  Location: {{{location}}}
  Compliance Level: {{{complianceLevel}}}
  Recent Activity Summary: {{{recentActivitySummary}}}
  Current Carbon Footprint: {{{currentCarbonFootprint}}}
  Input Data: {{{inputData}}}

  Provide a list of actionable reduction strategies that the user can implement to improve their sustainability.
  Also, if the user is a high performer, suggest a sustainability score badge that they can use to showcase their achievements.
  Ensure the strategies are specific to the textile industry and the user's specific subdomain.
  Consider all provided information when generating the strategies.`,
});

const tailoredReductionStrategiesFlow = ai.defineFlow(
  {
    name: 'tailoredReductionStrategiesFlow',
    inputSchema: TailoredReductionStrategiesInputSchema,
    outputSchema: TailoredReductionStrategiesOutputSchema,
  },
  async input => {
    const {output} = await tailoredReductionStrategiesPrompt(input);
    return output!;
  }
);
