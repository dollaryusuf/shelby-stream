import "dotenv/config";
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { getShelbyNode } from "./src/lib/shelby-server";
import { db } from "./src/lib/firebase-server";

const upload = multer({ storage: multer.memoryStorage() });

async function startServer() {
  const app = express();
  const PORT = 3000;

  console.log(`Starting server in ${process.env.NODE_ENV || 'development'} mode...`);

  app.use(express.json());

  // Task 1: Upload API Route
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      const file = req.file;
      const { creator_wallet_address, title, thumbnail_url, content_type } = req.body;

      if (!file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      if (!creator_wallet_address || !title || !content_type) {
        return res.status(400).json({ error: "Missing required metadata" });
      }

      // Initialize Shelby Node Client
      const shelbyNode = getShelbyNode();

      // Upload to Shelby Fiber network
      const blob_id = await shelbyNode.uploadBlob(file.buffer);

      // Task 4: Metadata Indexer (Firebase)
      const metadata = {
        blob_id,
        creator_wallet_address,
        title,
        thumbnail_url: thumbnail_url || "",
        content_type,
        created_at: new Date().toISOString(),
      };

      // Save metadata to Firestore
      await db.collection("content").add(metadata);

      res.json({ success: true, blob_id, metadata });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ error: "Failed to upload content" });
    }
  });

  // Fetch Logic: Fetch content records to populate the "Explore Content" page
  app.get("/api/content", async (req, res) => {
    try {
      const snapshot = await db.collection("content").orderBy("created_at", "desc").get();
      const content = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(content);
    } catch (error) {
      console.error("Fetch content error:", error);
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      console.log(`Serving static files from: ${distPath}`);
      app.use(express.static(distPath));
      app.get('*all', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    } else {
      console.error(`Critical Error: dist directory not found at ${distPath}`);
      // Fallback for debugging
      app.get('*all', (req, res) => {
        res.status(500).send("Production build (dist) missing. Please run 'npm run build'.");
      });
    }
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
