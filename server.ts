import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini client on the server side with correct User-Agent for telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "healthy", time: new Date().toISOString() });
  });

  // API Route: AI Story Generator (Mystery Stories)
  app.post("/api/gemini/generate-story", async (req, res) => {
    try {
      const { category, length, keywords, customSetting } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API Key is not configured." });
      }

      // Dynamic length details
      let lengthTarget = "300 words";
      if (length === "medium") lengthTarget = "600 words";
      if (length === "long") lengthTarget = "1200 words";

      const systemPrompt = `You are "Unknown Tamizha", a master storyteller, documentarian, and expert in ancient history, occult mysteries, unexplained phenomena, and spine-chilling horror. Your style is highly engaging, cinematic, suspenseful, and professional. You write in beautiful, elegant, and modern English with magnificent narrative flow.`;

      const prompt = `Write a gripping, highly suspenseful mystery story in English based on the following criteria:
- Category (Type): ${category || "mystery"}
- Length: Around ${lengthTarget}
- Core Keywords/Elements: ${keywords || "ancient temple, forgotten ritual, hidden chambers"}
- Setting/Detail: ${customSetting || "ancient ruins, mysterious village, or dark forest"}

Keep it immersive, with deep suspense, authentic historical/mythological details, and a jaw-dropping twist or cliffhanger. Format the story with clear paragraphs. Add a beautiful engaging title in English at the beginning. Use markdown for styling.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.8,
        }
      });

      const storyText = response.text;
      res.json({ story: storyText });
    } catch (err: any) {
      console.error("AI Story Generation Error:", err);
      res.status(500).json({ error: err.message || "Failed to generate story." });
    }
  });

  // API Route: YouTube Creator Tools
  app.post("/api/gemini/youtube-generator", async (req, res) => {
    try {
      const { topic, category, style } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "Gemini API Key is not configured." });
      }

      const prompt = `You are a YouTube viral growth expert for channels like "Unknown Tamizha".
Generate professional YouTube metadata for the following video topic:
- Topic: "${topic}"
- Category: "${category || "mystery"}" (Mystery/Horror/History/Ancient Secrets)
- Style: "${style || "cinematic"}" (Cinematic, Thrilling, Informative)

Provide the response strictly in JSON format matching the following schema. Use creative, high-click-through-rate (CTR) ideas, writing titles and descriptions in professional and catchy English.

Ensure the return matches this JSON structure:
{
  "titles": ["List of 3 highly catchy clickbait and mysterious titles in English"],
  "thumbnailPrompt": "A highly detailed, cinematic SDXL/Imagen image-generation prompt in English for creating a spine-chilling, mysterious thumbnail. Specify deep contrasts, dark red/gold palette, mist, high resolution, and extreme detail.",
  "description": "Engaging, SEO-optimized description paragraph in English outlining the mystery, including a professional disclaimer and timestamps, with mystery/horror tags.",
  "hashtags": ["List of 6 viral hashtags with #, e.g. #UnknownTamizha, #Mysteries, #HorrorStories"]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              titles: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Array of 3 trending viral video titles in English"
              },
              thumbnailPrompt: {
                type: Type.STRING,
                description: "Thumbnail design prompt for AI image compilers"
              },
              description: {
                type: Type.STRING,
                description: "SEO-optimized descriptions"
              },
              hashtags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Viral hashtags list"
              }
            },
            required: ["titles", "thumbnailPrompt", "description", "hashtags"]
          }
        }
      });

      const result = JSON.parse(response.text || "{}");
      res.json(result);
    } catch (err: any) {
      console.error("YouTube Metadata Generator Error:", err);
      res.status(500).json({ error: err.message || "Failed to generate video metadata." });
    }
  });

  // Vite Developer Server middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
