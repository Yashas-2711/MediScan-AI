import { GoogleGenerativeAI } from '@google/generative-ai';
import Constants from 'expo-constants';
export interface MedicineInfo {
  name: string;
  genericName: string;
  dosage: string;
  uses: string[];
  sideEffects: string[];
  warnings: string[];
  manufacturer: string;
  category: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface ScanResult {
  success: boolean;
  medicine?: MedicineInfo;
  rawText?: string;
  error?: string;
}

function fileUriToBase64(uri: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      const reader = new FileReader();
      reader.onloadend = function () {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.onerror = reject;
    xhr.open('GET', uri);
    xhr.responseType = 'blob';
    xhr.send();
  });
}

export async function analyzeMedicineImage(imageUri: string): Promise<ScanResult> {
  try {
    // Read at call-time so Expo always has the latest injected valueimport Constants from 'expo-constants';


const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    const MODEL_NAME = process.env.EXPO_PUBLIC_GEMINI_MODEL || 'gemini-3.1-flash-lite-preview';

    if (!API_KEY || API_KEY.trim() === '' || API_KEY === 'your_gemini_api_key_here') {
      throw new Error(
        'Gemini API key is not configured.\n\n' +
        'Open the .env file and set:\n' +
        'EXPO_PUBLIC_GEMINI_API_KEY=your_real_key_here\n\n' +
        'Then restart Expo with: npx expo start --clear'
      );
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const base64Image = await fileUriToBase64(imageUri);

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: 'image/jpeg',
      },
    };

    const prompt = `You are an expert pharmacist AI. Analyze this medicine image carefully and extract all visible information.

Respond ONLY with a valid JSON object in this exact format (no markdown, no extra text):
{
  "name": "Full brand name of the medicine",
  "genericName": "Generic/chemical name",
  "dosage": "Strength/dosage (e.g., 500mg, 10mg/5ml)",
  "uses": ["Use 1", "Use 2", "Use 3"],
  "sideEffects": ["Side effect 1", "Side effect 2"],
  "warnings": ["Warning 1", "Warning 2"],
  "manufacturer": "Company name if visible, else 'Not visible'",
  "category": "Category (e.g., Analgesic, Antibiotic, Antacid)",
  "confidence": "high"
}

If you cannot identify any medicine in the image, respond with:
{
  "error": "Could not identify medicine in the image. Please ensure the medicine strip or box is clearly visible."
}

Be accurate and only provide information that is visible on the medicine or commonly known facts about that medicine.`;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Clean up response - remove any markdown code blocks if present
    const cleanedText = text
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    const parsed = JSON.parse(cleanedText);

    if (parsed.error) {
      return {
        success: false,
        error: parsed.error,
        rawText: text,
      };
    }

    return {
      success: true,
      medicine: parsed as MedicineInfo,
      rawText: text,
    };
  } catch (err: any) {
    if (err instanceof SyntaxError) {
      return {
        success: false,
        error: 'Failed to parse medicine information. Please try again with a clearer image.',
      };
    }
    return {
      success: false,
      error: err.message || 'An unexpected error occurred.',
    };
  }
}
