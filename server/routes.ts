import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import { insertReportSchema } from "@shared/schema";
import { z } from "zod";

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 }, // 4MB to fit Vercel limits
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Mock Google Vision API analysis
async function analyzeImageContent(imageBuffer: Buffer): Promise<string> {
  // In production, integrate with Google Vision API
  // For now, return a mock analysis result
  const mockAnalyses = [
    "Billboard contains commercial advertisement for consumer products",
    "Digital display showing promotional content",
    "Large format outdoor advertising sign",
    "Highway billboard with commercial messaging",
  ];

  return mockAnalyses[Math.floor(Math.random() * mockAnalyses.length)];
}

export async function registerRoutes(app: Express): Promise<Server> {
  // POST /api/reports - Submit new report
  app.post("/api/reports", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
      }

      // Convert image to base64 URL for storage (in production, upload to cloud storage)
      const imageUrl = `data:${
        req.file.mimetype
      };base64,${req.file.buffer.toString("base64")}`;

      // Analyze image content
      const aiAnalysis = await analyzeImageContent(req.file.buffer);

      const reportData = {
        ...req.body,
        imageUrl,
        latitude: parseFloat(req.body.latitude),
        longitude: parseFloat(req.body.longitude),
        timestamp: new Date().toISOString(),
        aiAnalysis,
      };

      const validatedData = insertReportSchema.parse(reportData);
      const report = await storage.createReport(validatedData);

      res.json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation failed",
          errors: error.errors,
        });
      }
      console.error("Error creating report:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // GET /api/reports - Get all reports
  app.get("/api/reports", async (req, res) => {
    try {
      const reports = await storage.getReports();
      res.json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  // GET /api/heatmap - Get heatmap data
  app.get("/api/heatmap", async (req, res) => {
    try {
      const heatmapData = await storage.getHeatmapData();
      res.json(heatmapData);
    } catch (error) {
      console.error("Error fetching heatmap data:", error);
      res.status(500).json({ message: "Failed to fetch heatmap data" });
    }
  });

  // GET /api/stats - Get dashboard statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getReportStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  // PATCH /api/reports/:id/status - Update report status
  app.patch("/api/reports/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!["Pending", "Under Review", "Resolved"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value" });
      }

      const updatedReport = await storage.updateReportStatus(id, status);

      if (!updatedReport) {
        return res.status(404).json({ message: "Report not found" });
      }

      res.json(updatedReport);
    } catch (error) {
      console.error("Error updating report status:", error);
      res.status(500).json({ message: "Failed to update report status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
