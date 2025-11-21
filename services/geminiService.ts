import { GoogleGenAI } from "@google/genai";
import { Message, Sender, Attachment, SearchSource } from "../types";

interface GeminiResponse {
    text: string;
    searchSources?: SearchSource[];
    detectedMode?: string;
}

export const sendMessageToGemini = async (
  history: Message[],
  currentMessage: string,
  systemInstruction: string,
  attachment?: Attachment,
  baseUrl?: string
): Promise<GeminiResponse> => {
  try {
    // Initialize client securely using environment variable AND optional custom Base URL
    const ai = new GoogleGenAI({ 
        apiKey: process.env.API_KEY,
        baseUrl: baseUrl && baseUrl.trim() !== '' ? baseUrl : undefined
    });

    const modelName = 'gemini-2.5-flash';

    // Convert internal message format to history format suitable for context
    // We map the history to the format expected by the SDK
    const context = history.slice(-10).map(msg => {
      const parts: any[] = [];
      
      if (msg.attachment) {
        parts.push({
          inlineData: {
            mimeType: msg.attachment.mimeType,
            data: msg.attachment.data
          }
        });
      }
      
      if (msg.text && msg.text.trim()) {
        // Strip internal tags like <mode> or <thinking> from context passed back to model 
        // to prevent recursion confusion, though mostly fine to leave. 
        // We will just pass raw text for simplicity.
        parts.push({ text: msg.text });
      } else if (!msg.attachment) {
         // Fallback for empty text messages in history
         parts.push({ text: "..." });
      }

      return {
        role: msg.sender === Sender.User ? 'user' : 'model',
        parts: parts
      };
    });

    const chat = ai.chats.create({
      model: modelName,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
        // Enable Google Search Grounding
        tools: [{ googleSearch: {} }]
      },
      history: context
    });

    // Construct the current message payload
    let messagePayload: any;

    let textContent = currentMessage || "";
    
    // Inject explicit filename instructions for file editing tasks
    if (attachment && attachment.fileName) {
        const ext = attachment.fileName.split('.').pop();
        textContent += `\n\n[SYSTEM NOTE: User attached file "${attachment.fileName}". If the user asks to edit or fix this file, YOU MUST output the FULL content in a code block using the language tag "${ext}" or the appropriate language.]`;
    }

    if (attachment) {
        messagePayload = [
            {
                inlineData: {
                    mimeType: attachment.mimeType,
                    data: attachment.data
                }
            }
        ];
        if (textContent.trim()) {
            messagePayload.push({ text: textContent });
        }
    } else {
        // If no attachment, send just the text string to avoid object union issues
        messagePayload = textContent || "...";
    }

    const result = await chat.sendMessage({ 
        message: messagePayload 
    });
    
    let responseText = result.text || "No response text generated.";
    let detectedMode: string | undefined;

    // Extract <mode> tag if present (for Auto Mode)
    const modeMatch = responseText.match(/<mode>(.*?)<\/mode>/);
    if (modeMatch) {
        detectedMode = modeMatch[1].trim();
        responseText = responseText.replace(modeMatch[0], '').trim();
    }
    
    // Extract search sources (Grounding Metadata)
    let searchSources: SearchSource[] = [];
    const groundingMetadata = result.candidates?.[0]?.groundingMetadata;
    
    if (groundingMetadata && groundingMetadata.groundingChunks) {
        groundingMetadata.groundingChunks.forEach((chunk: any) => {
            if (chunk.web) {
                searchSources.push({
                    title: chunk.web.title || 'Source',
                    uri: chunk.web.uri
                });
            }
        });
    }

    return {
        text: responseText,
        searchSources: searchSources.length > 0 ? searchSources : undefined,
        detectedMode
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
        text: `Error: The connection to the truth server was interrupted. Please check your VPN or Base URL settings. (Details: ${error instanceof Error ? error.message : String(error)})`
    };
  }
};

export const generateChatTitle = async (history: Message[], language: string, baseUrl?: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ 
        apiKey: process.env.API_KEY,
        baseUrl: baseUrl && baseUrl.trim() !== '' ? baseUrl : undefined
    });
    
    const modelName = 'gemini-2.5-flash';
    // Create a simple prompt based on the conversation
    const conversationText = history
      .slice(0, 4) // Only look at the beginning
      .map(m => `${m.sender}: ${m.text}`)
      .join('\n');
    
    const prompt = `
      Analyze the conversation start and generate a chat title.
      RULES:
      1. EXTREMELY SHORT (max 2-4 words).
      2. No quotes. No punctuation.
      3. Language: "${language}" (must match this language code).
      
      Conversation:
      ${conversationText}
    `;

    const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
    });

    return response.text?.trim() || "New Chat";
  } catch (error) {
    console.error("Title Generation Error:", error);
    return "";
  }
};