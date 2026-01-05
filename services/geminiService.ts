
import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from "../types";

export const generateImageFromPrompt = async (
  prompt: string,
  config: { aspectRatio: AspectRatio }
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: config.aspectRatio,
        },
      },
    });

    // Iterate through parts to find the image part
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }

    throw new Error("No image data found in the response parts.");
  } catch (error) {
    console.error("Gemini API Image Generation Error:", error);
    throw error;
  }
};
