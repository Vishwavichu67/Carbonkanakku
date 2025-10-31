'use server';

/**
 * @fileOverview A sustainability report generation agent that analyzes textile data based on Indian emission rules.
 *
 * - generateSustainabilityReport - A function that handles the generation of sustainability reports.
 * - GenerateSustainabilityReportInput - The input type for the generateSustainabilityReport function.
 * - GenerateSustainabilityReportOutput - The return type for the generateSustainabilityReport function.
 */

import { z } from 'zod';

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


function getNumericValue(data: any, key: string, unit: string): number {
    const record = data.find((d: any) => d.Parameter === key && d.Unit.toLowerCase().includes(unit.toLowerCase()));
    const value = record ? record['Sample Value'] : 0;
    return typeof value === 'number' ? value : 0;
}

export async function generateSustainabilityReport(input: GenerateSustainabilityReportInput): Promise<GenerateSustainabilityReportOutput> {
    const data = JSON.parse(input.excelData);

    const electricityKwh = getNumericValue(data, 'Electricity usage', 'kwh');
    const dieselLitres = getNumericValue(data, 'Diesel usage', 'litres');
    const coalTons = getNumericValue(data, 'Coal usage', 'tons');

    const emissionsElectricity = 0.82 * electricityKwh; // kg CO2e
    const emissionsDiesel = 2.68 * dieselLitres; // kg CO2e
    const emissionsCoal = 2420 * coalTons; // 2.42 kg/kg * 1000 kg/ton = 2420 kg CO2e per ton

    const totalMonthlyKg = emissionsElectricity + emissionsDiesel + emissionsCoal;
    const totalYearlyTons = (totalMonthlyKg * 12) / 1000;

    let score = 'Needs Improvement';
    let recommendations = [
        'Investigate energy-efficient motors (BEE Star Rating 3+).',
        'Explore using LPG instead of diesel for heating (1.51 kg CO2/kg).',
        'Review water usage; aim for under 100 L/kg of fabric.',
        'Implement a Zero Liquid Discharge (ZLD) system for effluent.'
    ];

    if (totalYearlyTons < 100) {
        score = 'Good';
        recommendations = [
            'Explore renewable energy sources to further reduce your footprint.',
            'Optimize transportation routes to reduce fuel consumption.',
            'Increase usage of recycled water to over 30%.'
        ];
    } else if (totalYearlyTons < 250) {
        score = 'Compliant';
    }


    const reportHtml = `
    <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; border-bottom: 2px solid #006400; padding-bottom: 10px; }
          .header h1 { color: #006400; margin: 0; }
          .header p { margin: 0; font-size: 1.1em; }
          .section { margin-top: 30px; }
          .section h2 { color: #006400; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          .card { background: #f9f9f9; border: 1px solid #eee; border-radius: 8px; padding: 15px; }
          .card h3 { margin-top: 0; color: #333; }
          .summary-card { background-color: #e8f5e9; border-left: 5px solid #4CAF50; padding: 20px; margin-top: 20px; }
          .summary-card .value { font-size: 2em; font-weight: bold; color: #4CAF50; }
          ul { padding-left: 20px; }
          li { margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Sustainability Report</h1>
            <p>For: ${input.companyName}</p>
          </div>
    
          <div class="section">
            <h2>Executive Summary</h2>
            <div class="summary-card">
              <div>Total Annual Carbon Footprint</div>
              <div class="value">${totalYearlyTons.toFixed(2)} tCO₂e</div>
              <div>ESG Rating: <strong>${score}</strong></div>
            </div>
            <p style="margin-top: 15px;">This report details the carbon emissions based on the data provided for a typical operational month, extrapolated to an annual figure. The primary emission sources are electricity consumption and the use of diesel and coal for thermal energy.</p>
          </div>
    
          <div class="section">
            <h2>Emission Breakdown (Monthly)</h2>
            <div class="grid">
              <div class="card">
                <h3>Electricity</h3>
                <p><strong>Usage:</strong> ${electricityKwh.toLocaleString()} kWh</p>
                <p><strong>Emissions:</strong> ${emissionsElectricity.toFixed(2)} kg CO₂e</p>
              </div>
              <div class="card">
                <h3>Diesel</h3>
                <p><strong>Usage:</strong> ${dieselLitres.toLocaleString()} litres</p>
                <p><strong>Emissions:</strong> ${emissionsDiesel.toFixed(2)} kg CO₂e</p>
              </div>
              <div class="card">
                <h3>Coal</h3>
                <p><strong>Usage:</strong> ${coalTons.toLocaleString()} tons</p>
                <p><strong>Emissions:</strong> ${emissionsCoal.toFixed(2)} kg CO₂e</p>
              </div>
              <div class="card">
                <h3>Total Monthly</h3>
                <p><strong>Total:</strong> ${totalMonthlyKg.toFixed(2)} kg CO₂e</p>
              </div>
            </div>
            <div style="text-align: center; margin-top: 20px; color: #666;">[Chart: Bar graph showing monthly emissions by source: Electricity, Diesel, Coal]</div>
          </div>
          
          <div class="section">
            <h2>Recommendations</h2>
            <ul>
              ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
            </ul>
          </div>
        </div>
      </body>
    </html>
    `;

    return {
        reportHtml,
        totalEmissions: totalYearlyTons,
        sustainabilityScore: score,
        recommendations,
    };
}
