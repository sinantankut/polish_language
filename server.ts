import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware for JSON requests
app.use(express.json());

// Lazy-initialized Gemini API client wrapper
let aiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined. Please add it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Ensure server can run even without immediate API key by catching errors gracefully in handlers
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    time: new Date().toISOString()
  });
});

// Endpoint 1: Complete AI Sentence Checking
app.post("/api/gemini/grammar-check", async (req, res) => {
  const { sentence } = req.body;
  if (!sentence || typeof sentence !== "string" || !sentence.trim()) {
    return res.status(400).json({ error: "Polish sentence is required." });
  }

  try {
    const ai = getGeminiClient();
    const systemPrompt = `You are a professional, encouraging Polish language tutor.
Your task is to analyze a Polish sentence written by an English speaker.
Provide a highly structured analysis in JSON format. Do not include markdown formatting like \`\`\`json outside of the raw output.
Analyze:
1. Overall spelling and grammer correction (provide corrected sentence if there's any mistake).
2. Direct English translation.
3. Detailed structural breakdown: analyze each word's function, grammatical gender, part of speech (verb, noun, adjective, etc.), and grammatical case if applicable (Nominative, Genitive, Dative, Accusative, Instrumental, Locative, Vocative) with explanations.
4. Tips or notes on why these forms details matter (especially for English speakers who find Polish cases difficult).

Response MUST strictly follow this JSON schema:
{
  "original": "string",
  "isCorrect": boolean,
  "corrected": "string (or empty if original is correct)",
  "translation": "string",
  "explanation": "string (encouraging overall summary of mistakes/strengths)",
  "wordsBreakdown": [
    {
      "word": "string",
      "originalForm": "string (dictionary infinitive/nominative singular)",
      "partOfSpeech": "string",
      "gender": "string (Masculine / Feminine / Neuter / NA)",
      "grammaticalCase": "string (Nominative / Genitive ... / NA)",
      "roleExplanation": "string (why this case/form is used in the sentence)"
    }
  ],
  "learningTips": ["string"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Please analyze the following Polish sentence: "${sentence}"`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            original: { type: Type.STRING },
            isCorrect: { type: Type.BOOLEAN },
            corrected: { type: Type.STRING },
            translation: { type: Type.STRING },
            explanation: { type: Type.STRING },
            wordsBreakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  originalForm: { type: Type.STRING },
                  partOfSpeech: { type: Type.STRING },
                  gender: { type: Type.STRING },
                  grammaticalCase: { type: Type.STRING },
                  roleExplanation: { type: Type.STRING }
                },
                required: ["word", "originalForm", "partOfSpeech", "gender", "grammaticalCase", "roleExplanation"]
              }
            },
            learningTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["original", "isCorrect", "corrected", "translation", "explanation", "wordsBreakdown", "learningTips"]
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Grammar check error:", error);
    res.status(500).json({ error: error.message || "An error occurred with the AI tutor" });
  }
});

// Endpoint 2: AI Grammar Topic Explainer
app.post("/api/gemini/explain-grammar", async (req, res) => {
  const { topic } = req.body;
  if (!topic || typeof topic !== "string" || !topic.trim()) {
    return res.status(400).json({ error: "Grammar topic is required." });
  }

  try {
    const ai = getGeminiClient();
    const systemPrompt = `You are an expert Polish language professor who makes complex grammar simple and fun for English speakers.
Given a topic, generate a clear, highly structured explanation. Avoid overly dry academic language.
Use analogies, clear tables of endings, and real-world examples.
Suggest a few common pitfalls for English speakers.
Include:
1. Executive Summary: What is this concept in simple terms?
2. Why it matters / When to use it.
3. The Rules / Endings tables.
4. 3 clear example sentences in Polish (with word-by-word English translation and context).
5. A "Memory Hook" or mnemonic device to help remember it.

Format the entire response in clean Markdown.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Explain this grammar topic in detail, with tables of endings and pronunciation tips: "${topic}"`,
      config: {
        systemInstruction: systemPrompt,
      }
    });

    res.json({ explanation: response.text });
  } catch (error: any) {
    console.error("Explain grammar error:", error);
    res.status(500).json({ error: error.message || "An error occurred generating the explanation." });
  }
});

// Endpoint 3: AI Real-time Conversational Practice Partner
app.post("/api/gemini/conversation", async (req, res) => {
  const { history, message } = req.body;
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const ai = getGeminiClient();
    const systemPrompt = `You are 'Marek', a friendly Polish conversation partner practicing with an English speaker.
Your tone is conversational, warm, and moderately paced.
Guidelines:
1. Always reply in clear Polish (approx 1-3 natural sentences suitable for a learner).
2. Provide a side-by-side English translation in brackets for your Polish response.
3. Critically: Under a section named "Feedback:", review what the user just wrote. Highlight any corrections if they made spelling or grammar mistakes, explain in 1 simple sentence why, and praise them if they wrote a correct/natural-sounding sentence! Keep the feedback gentle and constructive.
4. Keep the conversation going by asking a simple, open-ended question in Polish.

Response format MUST strictly follow this JSON schema:
{
  "polishResponse": "string",
  "englishResponse": "string",
  "userFeedback": "string",
  "userHasMistakes": boolean,
  "suggestedAlternative": "string"
}`;

    const formattedHistory = Array.isArray(history)
      ? history.map((item: any) => ({
          role: item.role === "user" ? "user" : "model",
          parts: [{ text: item.text }]
        }))
      : [];

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        ...formattedHistory,
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            polishResponse: { type: Type.STRING },
            englishResponse: { type: Type.STRING },
            userFeedback: { type: Type.STRING },
            userHasMistakes: { type: Type.BOOLEAN },
            suggestedAlternative: { type: Type.STRING }
          },
          required: ["polishResponse", "englishResponse", "userFeedback", "userHasMistakes", "suggestedAlternative"]
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Conversation agent error:", error);
    res.status(500).json({ error: error.message || "An error occurred with Marek." });
  }
});

// Endpoint 4: Custom AI Drill Generator
app.post("/api/gemini/generate-exercises", async (req, res) => {
  const { blockTitle, topicDescription } = req.body;
  if (!blockTitle) {
    return res.status(400).json({ error: "Topic title is required." });
  }

  try {
    const ai = getGeminiClient();
    const systemPrompt = `You are a Polish test planner. Generate exactly 3 interactive exercises based on the theme: "${blockTitle}" with topic details: "${topicDescription || ""}".
Types of questions you can generate (mix them up, or use whatever fits best):
- "multiple-choice": English sentence, select correct Polish translation.
- "fill-in-the-blank": A Polish sentence with a blank _ (e.g. noun case ending, verb conjugation). Indicate word to conjugate/decline in hints.
- "reorder": Translate English to Polish by arranging a scrambled list of words into the correct grammatical order.

Return a JSON array of exactly 3 exercise objects.
Response MUST strictly follow this JSON schema:
{
  "exercises": [
    {
      "id": "string (unique string id, e.g. quiz-1)",
      "type": "string ('multiple-choice' | 'fill-in-the-blank' | 'reorder')",
      "instruction": "string (e.g. Translate 'I have a dog' or 'Complete the accusative ending')",
      "sentence": "string (For fill-in-the-blank: the Polish phrase with a clear single blank line '___' e.g. 'Mam dużego ___ (pies).' For multiple-choice or reorder: the complete sentence in Polish, or English depending on how they translate)",
      "englishPrompt": "string (the English equivalent of the correct answer)",
      "options": ["string"] (For multiple-choice: exactly 4 options. For reorder: the pool of exact scrambled Polish words needed to make the sentence. For fill-in-the-blank: exactly 4 choices to fill in the blank, including the correct one),
      "correctAnswer": "string (For multiple-choice: the correct translation. For fill-in-the-blank: the exact word or letters that go in the blank. For reorder: the space-separated words in their perfect order)",
      "grammarHint": "string (short tip explaining the rule, e.g. 'Accusative masculine animate changes pies to psa')"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Generate 3 interactive, educational exercises for the topic: "${blockTitle}".`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            exercises: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING },
                  instruction: { type: Type.STRING },
                  sentence: { type: Type.STRING },
                  englishPrompt: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  correctAnswer: { type: Type.STRING },
                  grammarHint: { type: Type.STRING }
                },
                required: ["id", "type", "instruction", "sentence", "englishPrompt", "options", "correctAnswer", "grammarHint"]
              }
            }
          },
          required: ["exercises"]
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Exercise generator error:", error);
    res.status(500).json({ error: error.message || "An error occurred generating interactive drills." });
  }
});

// Setup Vite Dev server or Serve static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite development middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving production build from dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Polish learning server is successfully running at http://localhost:${PORT}`);
  });
}

startServer();
