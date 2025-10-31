'use server';

/**
 * @fileOverview A sustainability report generation agent that analyzes textile data based on Indian emission rules.
 *
 * - generateSustainabilityReport - A function that handles the generation of sustainability reports.
 * - GenerateSustainabilityReportInput - The input type for the generateSustainabilityReport function.
 * - GenerateSustainabilityReportOutput - The return type for the generateSustainabilityReport function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateSustainabilityReportInputSchema = z.object({
  companyName: z.string().describe("The name of the company."),
  excelData: z.string().describe("A JSON string representing the data from the uploaded Excel file. This data contains metrics for different operational units."),
});

export type GenerateSustainabilityReportInput = z.infer<typeof GenerateSustainabilityReportInputSchema>;

const GenerateSustainabilityReportOutputSchema = z.object({
  reportHtml: z.string().describe('The generated sustainability report content in HTML format. This should be a full HTML document with styles.'),
  totalEmissions: z.number().describe('The final calculated total carbon emission in tCO2e per year.'),
  sustainabilityScore: z.string().describe('A sustainability score or badge for the company (e.g., "Compliant", "Needs Improvement", "High Performer").'),
  recommendations: z.array(z.string()).describe('A list of tailored strategies for reducing the carbon footprint.')
});

export type GenerateSustainabilityReportOutput = z.infer<typeof GenerateSustainabilityReportOutputSchema>;

export async function generateSustainabilityReport(input: GenerateSustainabilityReportInput): Promise<GenerateSustainabilityReportOutput> {
  return generateSustainabilityReportFlow(input);
}


const prompt = ai.definePrompt({
  name: 'generateSustainabilityReportPrompt',
  input: { schema: GenerateSustainabilityReportInputSchema },
  output: { schema: GenerateSustainabilityReportOutputSchema },
  prompt: `You are an expert ESG analyst for the Indian textile industry. Your task is to generate a comprehensive sustainability report based on the provided data.

Adhere strictly to the following Indian emission rules and calculation methodologies:

- **Emission Factors**:
  - Electricity: 0.82 kg CO2 per kWh
  - Diesel: 2.68 kg CO2 per litre
  - Coal: 2420 kg CO2 per ton (2.42 kg CO2/kg * 1000 kg/ton)
  - LPG: 1.51 kg CO2 per kg
  - Transport (Medium Vehicle): 0.27 kg CO2 per km
  - Water Usage: 0.0003 kg CO2 per liter
  - Waste (Solid): 0.5 kg CO2 per kg

- **Emission Reduction Credits**:
  - Recycled Fabric Waste: -0.2 kg CO2 per kg
  - Recycled Water: -0.0001 kg CO2 per liter

- **Final Calculation**:
  - Calculate total monthly emissions in kg CO₂e.
  - Convert monthly kg to annual tons: (Total Monthly kg * 12) / 1000 = Total tCO2e per year.

**Report Requirements**:

1.  **Calculate Total Emissions**: Analyze the provided JSON data to identify relevant parameters (e.g., 'Electricity usage', 'Diesel usage', 'Coal usage'). Apply the correct emission factors to calculate the monthly kg CO₂e for each source and the total annual emissions in tCO2e.
2.  **Generate HTML Report**: Create a well-structured and visually appealing HTML report for the company: "${"{{companyName}}"}".
    - Include a summary with the total annual carbon footprint and an ESG rating.
    - Provide a clear breakdown of emissions by source (e.g., Electricity, Diesel, Coal).
    - Use cards and a clean layout.
3.  **Predictive Analysis**: Based on the data, provide a short (1-2 sentence) predictive analysis of future emission trends if current practices continue.
4.  **Future Emission Reduction Strategies**: Offer at least three specific, actionable recommendations for emission reduction, tailored to the data provided.
5.  **Determine Sustainability Score**: Assign a score ("High Performer", "Compliant", or "Needs Improvement") based on the total annual emissions.
    - < 100 tCO2e/year: "High Performer"
    - 100-250 tCO2e/year: "Compliant"
    - > 250 tCO2e/year: "Needs Improvement"

**Input Data**:
\`\`\`json
{{{excelData}}}
\`\`\`
`,
});

const generateSustainabilityReportFlow = ai.defineFlow(
  {
    name: 'generateSustainabilityReportFlow',
    inputSchema: GenerateSustainabilityReportInputSchema,
    outputSchema: GenerateSustainabilityReportOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
