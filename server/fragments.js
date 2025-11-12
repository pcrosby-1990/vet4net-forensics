// server/fragments.js
// Codex Fragment Storage API with Authentication
// Sanctuary law: Every fragment is witnessed and held

import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const FRAGMENTS_FILE = path.join(__dirname, "../data/fragments.json");

// 🔐 Authentication Middleware
const VALID_TOKENS = {
  patrick: process.env.PATRICK_TOKEN || "patrick-sanctuary-token",
  vela: process.env.VELA_TOKEN || "vela-spiral-token",
  lumen: process.env.LUMEN_TOKEN || "lumen-witness-token",
  aletheia: process.env.ALETHEIA_TOKEN || "aletheia-truth-token",
};

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "No token provided. Include Authorization: Bearer <token>",
    });
  }

  const companion = Object.entries(VALID_TOKENS).find(([_, t]) => t === token);

  if (!companion) {
    return res.status(403).json({
      error: "Forbidden",
      message: "Invalid token. This sanctuary is protected.",
    });
  }

  req.companion = companion[0]; // patrick, vela, lumen, or aletheia
  next();
}

// 📜 Load fragments from JSON file
async function loadFragments() {
  try {
    await fs.access(FRAGMENTS_FILE);
    const data = await fs.readFile(FRAGMENTS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    // File doesn't exist yet
    return { fragments: [], revisions: [] };
  }
}

// 💾 Save fragments to JSON file
async function saveFragments(data) {
  await fs.mkdir(path.dirname(FRAGMENTS_FILE), { recursive: true });
  await fs.writeFile(FRAGMENTS_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// 🌊 POST /api/fragments/save - Save a new fragment
router.post("/save", authenticate, async (req, res) => {
  const {
    label,
    timestamp,
    voice,
    testimony,
    law,
    protocol,
    status = "Sealed",
    companions = [],
  } = req.body;

  // Validation
  if (!label || !timestamp || !voice || !testimony || !law || !protocol) {
    return res.status(400).json({
      error: "Missing required fields",
      required: ["label", "timestamp", "voice", "testimony", "law", "protocol"],
    });
  }

  try {
    const data = await loadFragments();

    const fragment = {
      id: `fragment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      label,
      timestamp,
      voice,
      testimony,
      law,
      protocol,
      status,
      companions,
      savedBy: req.companion,
      savedAt: new Date().toISOString(),
      revisionCount: 0,
    };

    data.fragments.push(fragment);
    await saveFragments(data);

    return res.status(201).json({
      success: true,
      message: "Fragment sealed in the Codex",
      fragment,
    });
  } catch (err) {
    console.error("Fragment save error:", err);
    return res.status(500).json({
      error: "Failed to save fragment",
      message: err.message,
    });
  }
});

// 📖 GET /api/fragments - Retrieve all fragments with optional filtering
router.get("/", async (req, res) => {
  const { label, voice, status, companion } = req.query;

  try {
    const data = await loadFragments();
    let fragments = data.fragments;

    // Filter by query params
    if (label) {
      fragments = fragments.filter((f) =>
        f.label.toLowerCase().includes(label.toLowerCase())
      );
    }
    if (voice) {
      fragments = fragments.filter((f) =>
        f.voice.toLowerCase().includes(voice.toLowerCase())
      );
    }
    if (status) {
      fragments = fragments.filter((f) => f.status === status);
    }
    if (companion) {
      fragments = fragments.filter(
        (f) => f.companions && f.companions.includes(companion)
      );
    }

    // Sort by timestamp descending (most recent first)
    fragments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return res.status(200).json({
      fragments,
      count: fragments.length,
      totalRevisions: data.revisions.length,
    });
  } catch (err) {
    console.error("Fragment fetch error:", err);
    return res.status(500).json({
      error: "Failed to fetch fragments",
      message: err.message,
    });
  }
});

// 🔖 POST /api/fragments/:id/approve - Approve fragment (4-companion workflow)
router.post("/:id/approve", authenticate, async (req, res) => {
  const { id } = req.params;
  const companion = req.companion;

  try {
    const data = await loadFragments();
    const fragment = data.fragments.find((f) => f.id === id);

    if (!fragment) {
      return res.status(404).json({
        error: "Fragment not found",
        message: `No fragment with id: ${id}`,
      });
    }

    // Initialize approvals if not present
    if (!fragment.approvals) {
      fragment.approvals = {
        patrick: false,
        vela: false,
        lumen: false,
        aletheia: false,
      };
    }

    // Set approval
    fragment.approvals[companion] = true;
    fragment.lastApprovalBy = companion;
    fragment.lastApprovalAt = new Date().toISOString();

    // Check if all approved
    const allApproved = Object.values(fragment.approvals).every((v) => v);
    if (allApproved && fragment.status !== "Law") {
      fragment.status = "Law";
      fragment.becameLawAt = new Date().toISOString();
    }

    await saveFragments(data);

    return res.status(200).json({
      success: true,
      message: `Fragment approved by ${companion}`,
      fragment,
      allApproved,
    });
  } catch (err) {
    console.error("Fragment approval error:", err);
    return res.status(500).json({
      error: "Failed to approve fragment",
      message: err.message,
    });
  }
});

// 🔄 POST /api/fragments/:id/revise - Create a revision of an existing fragment
router.post("/:id/revise", authenticate, async (req, res) => {
  const { id } = req.params;
  const {
    testimony,
    law,
    protocol,
    status,
    companions,
    revisionNote,
  } = req.body;

  try {
    const data = await loadFragments();
    const fragment = data.fragments.find((f) => f.id === id);

    if (!fragment) {
      return res.status(404).json({
        error: "Fragment not found",
        message: `No fragment with id: ${id}`,
      });
    }

    // Create revision record
    const revision = {
      fragmentId: id,
      revisionNumber: fragment.revisionCount + 1,
      previous: {
        testimony: fragment.testimony,
        law: fragment.law,
        protocol: fragment.protocol,
        status: fragment.status,
        companions: fragment.companions,
      },
      updated: {
        testimony: testimony || fragment.testimony,
        law: law || fragment.law,
        protocol: protocol || fragment.protocol,
        status: status || fragment.status,
        companions: companions || fragment.companions,
      },
      revisedBy: req.companion,
      revisedAt: new Date().toISOString(),
      note: revisionNote,
    };

    data.revisions.push(revision);

    // Update fragment
    fragment.testimony = testimony || fragment.testimony;
    fragment.law = law || fragment.law;
    fragment.protocol = protocol || fragment.protocol;
    fragment.status = status || fragment.status;
    fragment.companions = companions || fragment.companions;
    fragment.revisionCount += 1;
    fragment.lastRevisedBy = req.companion;
    fragment.lastRevisedAt = new Date().toISOString();

    await saveFragments(data);

    return res.status(200).json({
      success: true,
      message: "Fragment revised and witnessed",
      fragment,
      revision,
    });
  } catch (err) {
    console.error("Fragment revision error:", err);
    return res.status(500).json({
      error: "Failed to revise fragment",
      message: err.message,
    });
  }
});

// 📜 GET /api/fragments/:id/revisions - Get all revisions for a fragment
router.get("/:id/revisions", async (req, res) => {
  const { id } = req.params;

  try {
    const data = await loadFragments();
    const fragment = data.fragments.find((f) => f.id === id);

    if (!fragment) {
      return res.status(404).json({
        error: "Fragment not found",
        message: `No fragment with id: ${id}`,
      });
    }

    const revisions = data.revisions.filter((r) => r.fragmentId === id);
    revisions.sort((a, b) => a.revisionNumber - b.revisionNumber);

    return res.status(200).json({
      fragment,
      revisions,
      revisionCount: revisions.length,
    });
  } catch (err) {
    console.error("Revision fetch error:", err);
    return res.status(500).json({
      error: "Failed to fetch revisions",
      message: err.message,
    });
  }
});

// 🗑️ DELETE /api/fragments/:id - Delete a fragment (requires authentication)
router.delete("/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const data = await loadFragments();
    const index = data.fragments.findIndex((f) => f.id === id);

    if (index === -1) {
      return res.status(404).json({
        error: "Fragment not found",
        message: `No fragment with id: ${id}`,
      });
    }

    const deleted = data.fragments.splice(index, 1)[0];
    await saveFragments(data);

    return res.status(200).json({
      success: true,
      message: "Fragment removed from the Codex",
      deleted,
    });
  } catch (err) {
    console.error("Fragment delete error:", err);
    return res.status(500).json({
      error: "Failed to delete fragment",
      message: err.message,
    });
  }
});

// 🧵 POST /api/fragments/:id/connect - Create thread connection between fragments
router.post("/:id/connect", authenticate, async (req, res) => {
  const { id } = req.params;
  const { targetId, relationshipType = "resonates", note } = req.body;

  try {
    const data = await loadFragments();
    const fragment = data.fragments.find((f) => f.id === id);
    const target = data.fragments.find((f) => f.id === targetId);

    if (!fragment || !target) {
      return res.status(404).json({
        error: "Fragment not found",
        message: "One or both fragments do not exist",
      });
    }

    // Initialize threads if not present
    if (!fragment.threads) fragment.threads = [];
    if (!target.threads) target.threads = [];

    const connection = {
      id: `thread-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      from: id,
      to: targetId,
      type: relationshipType,
      note,
      createdBy: req.companion,
      createdAt: new Date().toISOString(),
    };

    fragment.threads.push({ ...connection, direction: "outgoing" });
    target.threads.push({ ...connection, direction: "incoming" });

    await saveFragments(data);

    return res.status(201).json({
      success: true,
      message: "Fragment thread created",
      connection,
    });
  } catch (err) {
    console.error("Thread creation error:", err);
    return res.status(500).json({
      error: "Failed to create thread",
      message: err.message,
    });
  }
});

// 🔍 GET /api/fragments/search - Full-text search
router.get("/search", async (req, res) => {
  const { q, dateFrom, dateTo, hasApprovals } = req.query;

  try {
    const data = await loadFragments();
    let results = data.fragments;

    // Full-text search across testimony, law, protocol
    if (q) {
      const query = q.toLowerCase();
      results = results.filter((f) =>
        f.testimony?.toLowerCase().includes(query) ||
        f.law?.toLowerCase().includes(query) ||
        f.protocol?.toLowerCase().includes(query) ||
        f.label?.toLowerCase().includes(query)
      );
    }

    // Date range filter
    if (dateFrom) {
      results = results.filter((f) => new Date(f.timestamp) >= new Date(dateFrom));
    }
    if (dateTo) {
      results = results.filter((f) => new Date(f.timestamp) <= new Date(dateTo));
    }

    // Approval filter
    if (hasApprovals) {
      const required = hasApprovals.split(",");
      results = results.filter((f) =>
        required.every((companion) => f.approvals?.[companion])
      );
    }

    results.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return res.status(200).json({
      results,
      count: results.length,
      query: q,
    });
  } catch (err) {
    console.error("Search error:", err);
    return res.status(500).json({
      error: "Search failed",
      message: err.message,
    });
  }
});

// 📊 GET /api/fragments/stats - Get Codex statistics
router.get("/stats", async (req, res) => {
  try {
    const data = await loadFragments();

    const voices = [...new Set(data.fragments.map((f) => f.voice))];
    const companions = [
      ...new Set(
        data.fragments.flatMap((f) => f.companions || [])
      ),
    ];
    const statuses = data.fragments.reduce((acc, f) => {
      acc[f.status] = (acc[f.status] || 0) + 1;
      return acc;
    }, {});

    // Approval stats
    const approvalStats = {
      fullyApproved: data.fragments.filter((f) =>
        f.approvals && Object.values(f.approvals).every((v) => v)
      ).length,
      partiallyApproved: data.fragments.filter((f) =>
        f.approvals && Object.values(f.approvals).some((v) => v) &&
        !Object.values(f.approvals).every((v) => v)
      ).length,
      unapproved: data.fragments.filter((f) =>
        !f.approvals || Object.values(f.approvals).every((v) => !v)
      ).length,
    };

    // Thread stats
    const totalThreads = data.fragments.reduce(
      (acc, f) => acc + (f.threads?.length || 0),
      0
    ) / 2; // Divide by 2 since each thread is stored twice

    return res.status(200).json({
      totalFragments: data.fragments.length,
      totalRevisions: data.revisions.length,
      totalThreads,
      voices,
      companions,
      statuses,
      approvalStats,
      lastSaved:
        data.fragments.length > 0
          ? data.fragments[data.fragments.length - 1].savedAt
          : null,
    });
  } catch (err) {
    console.error("Stats fetch error:", err);
    return res.status(500).json({
      error: "Failed to fetch stats",
      message: err.message,
    });
  }
});

export default router;
