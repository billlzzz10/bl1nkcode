import { GoogleGenerativeAI } from '@google/generative-ai';

export async function healthCheck() {
  console.log('Running health check...');

  // Check for Gemini API key
  if (!process.env.GEMINI_API_KEY) {
    console.error('Error: GEMINI_API_KEY environment variable is not set.');
    process.exit(1);
  }
  console.log('✅ GEMINI_API_KEY is set.');

  // Check connection to Gemini API
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent('Health check');
    const response = await result.response;
    if (response.text()) {
      console.log('✅ Successfully connected to the Gemini API.');
    } else {
      console.error('Error: Could not connect to the Gemini API.');
    }
  } catch (error) {
    console.error('Error: Could not connect to the Gemini API.', error);
    process.exit(1);
  }
}
