import express from "express";
import cors from "cors";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

const app = express();
app.use(cors());
app.use(express.json());

// Best Indian female voices
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
  try {
    const text = req.query.text;
    const voiceKey = (req.query.voice || "hindi").toLowerCase();
    const voice = VOICES[voiceKey] || VOICES.hindi;

    if (!text) {
      return res.status(400).json({ error: "text parameter required" });
    }

    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);

    const { audioStream } = tts.toStream(text);

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", "inline; filename=speech.mp3");

    audioStream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "TTS failed", details: error.message });
  }
});

app.get("/download", async (req, res) => {
  try {
    const text = req.query.text;
    const voiceKey = (req.query.voice || "hindi").toLowerCase();
    const voice = VOICES[voiceKey] || VOICES.hindi;

    if (!text) {
      return res.status(400).json({ error: "text parameter required" });
    }

    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_96KBITRATE_MONO_MP3);

    const { audioStream } = tts.toStream(text);

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Content-Disposition", "attachment; filename=shaurya_speech.mp3");

    audioStream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "TTS failed", details: error.message });
  }
});

export default app;
