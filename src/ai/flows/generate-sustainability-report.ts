'use server';

/**
 * @fileOverview A sustainability report generation AI agent.
 *
 * - generateSustainabilityReport - A function that handles the generation of sustainability reports.
 * - GenerateSustainabilityReportInput - The input type for the generateSustainabilityReport function.
 * - GenerateSustainabilityReportOutput - The return type for the generateSustainabilityReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSustainabilityReportInputSchema = z.object({
  companyName: z.string().describe('The name of the company.'),
  industrySubdomain: z.string().describe('The industry subdomain of the company (e.g., Spinning Unit, Dyeing Plant).'),
  companyInfo: z.string().describe('Detailed information about the company, including capacity, employees, and yearly output.'),
  location: z.string().describe('The location of the company, used for fetching region-specific emission factors.'),
  complianceLevel: z.string().describe('The compliance level of the company (e.g., basic, intermediate, certified).'),
  existingReports: z.string().optional().describe('Optional existing sustainability reports uploaded by the company.'),
  keyMetrics: z.string().describe('Key metrics and data points specific to the industry subdomain, used for emissions tracking.'),
});

export type GenerateSustainabilityReportInput = z.infer<typeof GenerateSustainabilityReportInputSchema>;

const GenerateSustainabilityReportOutputSchema = z.object({
  reportContent: z.string().describe('The generated sustainability report content in PDF or HTML format.'),
  sustainabilityScore: z.string().describe('A sustainability score badge for the company.'),
  predictedCarbonFootprint: z.string().describe('The predicted future carbon footprint based on current trends.'),
  reductionStrategies: z.string().describe('Tailored strategies for reducing the carbon footprint.'),
});

export type GenerateSustainabilityReportOutput = z.infer<typeof GenerateSustainabilityReportOutputSchema>;

export async function generateSustainabilityReport(input: GenerateSustainabilityReportInput): Promise<GenerateSustainabilityReportOutput> {
  return generateSustainabilityReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSustainabilityReportPrompt',
  input: {schema: GenerateSustainabilityReportInputSchema},
  output: {schema: GenerateSustainabilityReportOutputSchema},
  prompt: `You are an AI assistant specialized in generating detailed sustainability reports for textile companies. You will take information about the company, its industry, location and key metrics to output a report.

  Company Name: {{{companyName}}}
  Industry Subdomain: {{{industrySubdomain}}}
  Company Information: {{{companyInfo}}}
  Location: {{{location}}}
  Compliance Level: {{{complianceLevel}}}
  Existing Sustainability Reports: {{{existingReports}}}
  Key Metrics: {{{keyMetrics}}}

  Based on the provided information, generate a comprehensive sustainability report. The report should include:

  - An overview of the company's current sustainability performance.
  - Trend analysis of emission changes over time.
  - Comparative benchmarks against industry averages.
  - AI-driven insights and recommendations for improvement.
  - A sustainability score badge reflecting the company's performance.
  - Predicted future carbon footprint based on current trends.
  - Tailored reduction strategies for minimizing environmental impact.

  Ensure the report is well-structured and suitable for sharing with stakeholders and for ESG certifications.
  Format the report in HTML.
  Make sure to include data visualization suggestions (but do not actually render the charts).
  Be sure to include all required data points, and provide context about why each is important.

  Output the sustainability report, sustainability score, predicted carbon footprint, and reduction strategies in a JSON format, with descriptions for each field.
`,
});

const generateSustainabilityReportFlow = ai.defineFlow(
  {
    name: 'generateSustainabilityReportFlow',
    inputSchema: GenerateSustainabilityReportInputSchema,
    outputSchema: GenerateSustainabilityReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
