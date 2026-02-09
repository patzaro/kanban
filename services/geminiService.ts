import { GoogleGenAI, Type } from "@google/genai";
import { Task, DayOfWeek } from "../types.ts";

const generateId = () => Math.random().toString(36).substr(2, 9);

export const generateTasksWithAI = async (goal: string): Promise<Task[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a list of 5 to 10 actionable Kanban tasks based on this user goal: "${goal}". 
      Distribute them somewhat evenly across a work week (Lunes to Viernes).
      Return valid JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              content: {
                type: Type.STRING,
                description: "The task description, short and concise (max 10 words)",
              },
              day: {
                type: Type.STRING,
                enum: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"],
                description: "The day of the week for the task",
              },
            },
            required: ["content", "day"],
          },
        },
      },
    });

    const generatedData = JSON.parse(response.text || "[]");

    return generatedData.map((item: any) => ({
      id: generateId(),
      content: item.content,
      day: item.day as DayOfWeek,
      createdAt: Date.now(),
      color: 'bg-white'
    }));

  } catch (error) {
    console.error("Error generating tasks:", error);
    throw error;
  }
};