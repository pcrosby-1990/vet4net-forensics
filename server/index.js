// server/index.js
// Codex Fragment Storage Server
// Express backend for sanctuary fragment witness

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fragmentsRouter from "./fragments.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use("/api/fragments", fragmentsRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "alive",
    message: "Codex Fragment Server is shimmering",
    timestamp: new Date().toISOString(),
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "🜎 Codex Fragment Storage API",
    version: "2.0.0",
    companions: ["Patrick", "Vela", "Lumen", "Aletheia"],
    endpoints: {
      health: "GET /health",
      fragments: "GET /api/fragments (supports filters: label, voice, status, companion, dateFrom, dateTo, approvalStatus)",
      save: "POST /api/fragments/save (requires auth)",
      approve: "POST /api/fragments/:id/approve (requires auth)",
      revise: "POST /api/fragments/:id/revise (requires auth)",
      revisions: "GET /api/fragments/:id/revisions",
      connect: "POST /api/fragments/:id/connect (requires auth)",
      search: "GET /api/fragments/search (supports: q, dateFrom, dateTo, hasApprovals)",
      delete: "DELETE /api/fragments/:id (requires auth)",
      stats: "GET /api/fragments/stats",
      export: "GET /api/fragments/export?format=json|markdown",
      import: "POST /api/fragments/import (requires auth, body: {fragments: [], mode: 'merge'|'replace'})",
      constellation: "GET /api/fragments/constellation (graph data for visualization)",
      timeline: "GET /api/fragments/timeline?month=11&day=12 (fragments by date)",
    },
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log("");
  console.log("═══════════════════════════════════════");
  console.log("🜎 Codex Fragment Storage Server");
  console.log("═══════════════════════════════════════");
  console.log(`✨ Server shimmering on http://localhost:${PORT}`);
  console.log("");
  console.log("Endpoints:");
  console.log(`  GET    /health - Server status`);
  console.log(`  GET    /api/fragments - Retrieve fragments (with filtering)`);
  console.log(`  POST   /api/fragments/save - Save fragment (auth required)`);
  console.log(`  POST   /api/fragments/:id/approve - Approve fragment (auth required)`);
  console.log(`  POST   /api/fragments/:id/revise - Revise fragment (auth required)`);
  console.log(`  GET    /api/fragments/:id/revisions - Get fragment revisions`);
  console.log(`  POST   /api/fragments/:id/connect - Thread fragments (auth required)`);
  console.log(`  GET    /api/fragments/search - Full-text search`);
  console.log(`  DELETE /api/fragments/:id - Delete fragment (auth required)`);
  console.log(`  GET    /api/fragments/stats - Codex statistics`);
  console.log(`  GET    /api/fragments/export - Export as JSON/Markdown`);
  console.log(`  POST   /api/fragments/import - Import fragments (auth required)`);
  console.log(`  GET    /api/fragments/constellation - Graph visualization data`);
  console.log(`  GET    /api/fragments/timeline - Fragments by date`);
  console.log("");
  console.log("Authentication:");
  console.log("  Include header: Authorization: Bearer <token>");
  console.log("");
  console.log("Sanctuary law: Every fragment is witnessed and held 🕯️");
  console.log("═══════════════════════════════════════");
  console.log("");
});
