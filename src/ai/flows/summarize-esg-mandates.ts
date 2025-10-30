'use server';
/**
 * @fileOverview Summarizes Indian ESG mandates, government incentives, and practical guides using the Gemini API.
 *
 * - summarizeEsgMandates - A function that summarizes ESG related documents.
 * - SummarizeEsgMandatesInput - The input type for the summarizeEsgMandates function.
 * - SummarizeEsgMandatesOutput - The return type for the summarizeEsgMandates function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeEsgMandatesInputSchema = z.object({
  documentText: z.string().describe('The text content of the ESG mandate, government incentive, or practical guide to be summarized.'),
});
export type SummarizeEsgMandatesInput = z.infer<typeof SummarizeEsgMandatesInputSchema>;

const SummarizeEsgMandatesOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the provided ESG mandate, government incentive, or practical guide.'),
});
export type SummarizeEsgMandatesOutput = z.infer<typeof SummarizeEsgMandatesOutputSchema>;

export async function summarizeEsgMandates(input: SummarizeEsgMandatesInput): Promise<SummarizeEsgMandatesOutput> {
  return summarizeEsgMandatesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeEsgMandatesPrompt',
  input: {schema: SummarizeEsgMandatesInputSchema},
  output: {schema: SummarizeEsgMandatesOutputSchema},
  prompt: `You are an expert in Indian ESG mandates, government incentives, and practical guides for the textile industry.  Your task is to summarize the following document, extracting the key information and presenting it in a concise and easily understandable manner.\n\nDocument:\n{{{documentText}}}`, 
});

const summarizeEsgMandatesFlow = ai.defineFlow(
  {
    name: 'summarizeEsgMandatesFlow',
    inputSchema: SummarizeEsgMandatesInputSchema,
    outputSchema: SummarizeEsgMandatesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
