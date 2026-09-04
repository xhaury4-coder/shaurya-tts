import express from "express";
import cors from "cors";
import { EdgeTTS } from "edge-tts";   // package name check kar lena

const app = express();
app.use(cors());
app.use(express.json());

const VOICES = {
  hindi: "hi-IN-SwaraNeural",
  english: "en-IN-NeerjaNeural",
  expressive: "en-IN-NeerjaExpressiveNeural"
};

app.get("/", (req, res) => {
  res.json({
    message: "Indian Woman TTS API by Shaurya 🔥",
    endpoints: {
      speak: "/speak?text=नमस्ते&voice=hindi",
      download: "/download?text=Hello&voice=english"
    },
    voices: Object.keys(VOICES)
  });
});

app.get("/speak", async (req, res) => {
  const text = req.query.text;
  const voiceKey = (req.query.voice || "hindi").toLowerCase();
  const voice = VOICES[voiceKey] || VOICES.hindi;

  if (!text) {
    return res.status(400).json({ error: "text parameter is required" });
  }

  try {
    const tts = new EdgeTTS(text, voice);
    const result = await tts.synthesize();

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": "inline; filename=speech.mp3"
    });
    res.send(Buffer.from(result.audio));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "TTS failed", details: error.message });
  }
});

app.get("/download", async (req, res) => {
  const text = req.query.text;
  const voiceKey = (req.query.voice || "hindi").toLowerCase();
  const voice = VOICES[voiceKey] || VOICES.hindi;

  if (!text) {
    return res.status(400).json({ error: "text parameter is required" });
  }

  try {
    const tts = new EdgeTTS(text, voice);
    const result = await tts.synthesize();

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": "attachment; filename=shaurya_speech.mp3"
    });
    res.send(Buffer.from(result.audio));
  } catch (error) {
    res.status(500).json({ error: "TTS failed", details: error.message });
  }
});

// Vercel ke liye export
export default app;
