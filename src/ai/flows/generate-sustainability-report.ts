'use server';

/**
 * @fileOverview A sustainability report generation AI agent that analyzes textile data based on Indian emission rules.
 *
 * - generateSustainabilityReport - A function that handles the generation of sustainability reports.
 * - GenerateSustainabilityReportInput - The input type for the generateSustainabilityReport function.
 * - GenerateSustainabilityReportOutput - The return type for the generateSustainabilityReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSustainabilityReportInputSchema = z.object({
  companyName: z.string().describe("The name of the company."),
  excelData: z.string().describe("A JSON string representing the data from the uploaded Excel file. This data contains metrics for different operational units."),
});

export type GenerateSustainabilityReportInput = z.infer<typeof GenerateSustainabilityReportInputSchema>;

const GenerateSustainabilityReportOutputSchema = z.object({
  reportHtml: z.string().describe('The generated sustainability report content in HTML format. This should be a full HTML document with styles.'),
  totalEmissions: z.number().describe('The final calculated total carbon emission in tCO2e per year.'),
  sustainabilityScore: z.string().describe('A sustainability score or badge for the company (e.g., "Compliant", "Needs Improvement").'),
  recommendations: z.array(z.string()).describe('A list of tailored strategies for reducing the carbon footprint.')
});

export type GenerateSustainabilityReportOutput = z.infer<typeof GenerateSustainabilityReportOutputSchema>;

export async function generateSustainabilityReport(input: GenerateSustainabilityReportInput): Promise<GenerateSustainabilityReportOutput> {
  return generateSustainabilityReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSustainabilityReportPrompt',
  input: {schema: GenerateSustainabilityReportInputSchema},
  output: {schema: GenerateSustainabilityReportOutputSchema},
  prompt: `You are an expert ESG analyst for the Indian textile industry. Your task is to generate a detailed sustainability report based on the provided company data and a strict set of rules.

Company Name: {{{companyName}}}
Data (from Excel):
{{{excelData}}}

**MANDATORY RULES & CALCULATIONS:**
You must strictly follow these Indian textile industry emission rules. Do not use global or generic limits.

**1. Spinning Units (Yarn Production)**
- Rules:
  - Motors must be energy-efficient (BEE Star Rating 3+). Assume compliance if not specified.
  - Emission Limit: 0.82 kg CO2 per kWh.
  - Dust Particulate Limit: ≤ 150 mg/Nm3.
- Calculation:
  - E_spinning = Electricity (kWh) × 0.82

**2. Dyeing and Finishing Units**
- Rules:
  - Boilers must meet CPCB limits (PM ≤ 150 mg/Nm3, SO2 ≤ 100 mg/Nm3).
  - Effluent Discharge: < 100 mg/L COD and < 10 mg/L BOD.
  - Zero Liquid Discharge (ZLD) is recommended.
- Thermal Energy Factors:
  - Diesel = 2.68 kg CO2 per unit
  - Coal = 2.42 kg CO2 per unit
- Calculation:
  - E_dyeing = (Diesel_used × 2.68) + (Coal_used × 2.42) + (Electricity_kWh × 0.82)

**3. Finishing and Garmenting Units**
- Rules:
  - Prefer LPG over diesel (LPG factor = 1.51 kg CO2/kg).
  - Recommend at least 10% renewable energy usage.
- Calculation:
  - E_finishing = (LPG_used × 1.51) + (Electricity_kWh × 0.82) - (Recycled_waste_kg × 0.2)

**4. Transportation and Logistics**
- Rule: Fuel emission factor = 0.27 kg CO2 per km (for medium vehicles).
- Calculation:
  - E_transport = Distance (km) × 0.27

**5. Water Usage**
- Rules:
  - Usage Limit: 100 L/kg of fabric.
  - Effluent Treatment Plant (ETP) is mandatory.
  - Recommend recycled water ≥ 30% of total usage.
- Water Emission Factor: 0.0003 kg CO2 per liter.
- Calculation:
  - E_water = (Water_used_Liters × 0.0003) - (Recycled_water_Liters × 0.0001)

**6. Waste Generation**
- Rules:
  - Solid waste < 10% of total production weight.
  - At least 30% waste must be recycled.
- Calculation:
  - E_waste = (Waste_generated_kg × 0.5) - (Recycled_waste_kg × 0.2)

**7. Overall Carbon Emission Standard (India)**
- Benchmark: 1.7 to 2.5 tCO2e per ton of fabric produced.
- Compliance Limit: Below 2.5 tCO2e per ton fabric per year.

**FINAL CALCULATION:**
- Total_Carbon_Emission_kg = E_spinning + E_dyeing + E_finishing + E_transport + E_water + E_waste
- Total_Carbon_Emission_tCO2e = Total_Carbon_Emission_kg / 1000

**YOUR TASK:**
1.  Analyze the provided JSON data according to the rules above.
2.  Perform all calculations for each category and then calculate the final 'Total_Carbon_Emission_tCO2e'.
3.  Generate a visually appealing, well-structured HTML report. The HTML should be self-contained with CSS for styling.
4.  The report MUST include:
    - An executive summary.
    - A section for each emission category with the calculated emissions.
    - Graphical representations of the data (use placeholder descriptions for charts, e.g., "[Bar chart showing emissions by category]").
    - A comparison of the company's performance against the Indian benchmark (e.g., tCO2e per ton of fabric).
    - A "Sustainability Score" (e.g., Compliant, High Performer, Needs Improvement).
    - Actionable recommendations for improvement based on the analysis.
5.  Return the final HTML report, the total emissions number, the score, and a list of recommendations in the specified JSON format.
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
