import {genkit} from 'genkit';
import deepSeek from '@genkit-ai/compat-oai/deepseek';

export const ai = genkit({
  plugins: [deepSeek({apiKey: process.env.DEEPSEEK_API_KEY})],
  model: deepSeek.model('deepseek-chat'),
});
