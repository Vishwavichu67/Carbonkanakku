import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI({
    // NOTE: Passing an empty API key forces Genkit to use Application Default Credentials.
    apiKey: process.env.GENKIT_ENV === 'prod' ? '' : process.env.GOOGLE_GENAI_API_KEY,
  })],
  model: 'googleai/gemini-2.5-flash',
});
