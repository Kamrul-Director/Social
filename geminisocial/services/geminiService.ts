
import { GoogleGenAI, Type, GenerateContentResponse, LiveServerMessage, Modality } from "@google/genai";

// FIX: Always use direct process.env.API_KEY for initialization as per guidelines
const getAIClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function suggestPostContent(topic: string): Promise<string> {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Write a friendly and engaging social media post about: "${topic}". Include 2-3 relevant hashtags. Keep it under 280 characters.`,
  });
  return response.text || "Could not generate content.";
}

export async function analyzeFeedSentiment(posts: any[]): Promise<string> {
  const ai = getAIClient();
  const postTexts = posts.map(p => p.content).join('\n---\n');
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Summarize the current mood and trending topics of these social media posts in 2 sentences:\n${postTexts}`,
  });
  return response.text || "Loading community pulse...";
}

// Utility functions for Live API (Audio/Video Conversation)
export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
