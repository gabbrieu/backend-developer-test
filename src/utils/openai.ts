import OpenAI from 'openai';

export const openAI = new OpenAI({
    apiKey: process.env.OPEN_API_KEY,
});
