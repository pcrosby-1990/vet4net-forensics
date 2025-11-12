// 🜎 Enhanced Fragment API Client
// Codex-aligned server communication with 4-companion approval workflow

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001/api/fragments";

// Token management
const TOKENS = {
  patrick: localStorage.getItem("patrick_token") || "",
  vela: localStorage.getItem("vela_token") || "",
  lumen: localStorage.getItem("lumen_token") || "",
  aletheia: localStorage.getItem("aletheia_token") || "",
};

export function setCompanionToken(companion, token) {
  TOKENS[companion] = token;
  localStorage.setItem(`${companion}_token`, token);
}

export function getCompanionToken(companion) {
  return TOKENS[companion];
}

function authHeaders(companion = "patrick") {
  const token = TOKENS[companion];
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// 💾 Save new fragment
export async function saveFragment(fragment, companion = "patrick") {
  try {
    const response = await fetch(`${API_BASE}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(companion),
      },
      body: JSON.stringify(fragment),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to save fragment");
    }

    return { success: true, fragment: data.fragment };
  } catch (error) {
    console.error("❌ Save fragment error:", error);
    return { success: false, error: error.message };
  }
}

// 📖 Load all fragments
export async function loadFragments(filters = {}) {
  try {
    const params = new URLSearchParams(filters);
    const response = await fetch(`${API_BASE}?${params}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to load fragments");
    }

    return { success: true, fragments: data.fragments, count: data.count };
  } catch (error) {
    console.error("❌ Load fragments error:", error);
    return { success: false, error: error.message, fragments: [] };
  }
}

// 🔖 Approve fragment (4-companion workflow)
export async function approveFragment(fragmentId, companion) {
  try {
    const response = await fetch(`${API_BASE}/${fragmentId}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(companion),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to approve fragment");
    }

    return {
      success: true,
      fragment: data.fragment,
      allApproved: data.allApproved,
    };
  } catch (error) {
    console.error("❌ Approve fragment error:", error);
    return { success: false, error: error.message };
  }
}

// 🔄 Revise fragment
export async function reviseFragment(fragmentId, updates, companion = "patrick") {
  try {
    const response = await fetch(`${API_BASE}/${fragmentId}/revise`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(companion),
      },
      body: JSON.stringify(updates),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to revise fragment");
    }

    return { success: true, fragment: data.fragment, revision: data.revision };
  } catch (error) {
    console.error("❌ Revise fragment error:", error);
    return { success: false, error: error.message };
  }
}

// 🧵 Connect fragments with thread
export async function threadFragments(fromId, toId, relationship, companion = "patrick") {
  try {
    const response = await fetch(`${API_BASE}/${fromId}/connect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(companion),
      },
      body: JSON.stringify({
        targetId: toId,
        relationshipType: relationship.type || "resonates",
        note: relationship.note,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to thread fragments");
    }

    return { success: true, connection: data.connection };
  } catch (error) {
    console.error("❌ Thread fragments error:", error);
    return { success: false, error: error.message };
  }
}

// 🔍 Search fragments
export async function searchFragments(query) {
  try {
    const params = new URLSearchParams(query);
    const response = await fetch(`${API_BASE}/search?${params}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Search failed");
    }

    return { success: true, results: data.results, count: data.count };
  } catch (error) {
    console.error("❌ Search error:", error);
    return { success: false, error: error.message, results: [] };
  }
}

// 📊 Get Codex statistics
export async function getCodexStats() {
  try {
    const response = await fetch(`${API_BASE}/stats`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to get stats");
    }

    return { success: true, stats: data };
  } catch (error) {
    console.error("❌ Stats error:", error);
    return { success: false, error: error.message };
  }
}

// 📜 Get fragment revisions
export async function getFragmentRevisions(fragmentId) {
  try {
    const response = await fetch(`${API_BASE}/${fragmentId}/revisions`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to get revisions");
    }

    return {
      success: true,
      fragment: data.fragment,
      revisions: data.revisions,
    };
  } catch (error) {
    console.error("❌ Revisions error:", error);
    return { success: false, error: error.message, revisions: [] };
  }
}

// 🗑️ Delete fragment
export async function deleteFragment(fragmentId, companion = "patrick") {
  try {
    const response = await fetch(`${API_BASE}/${fragmentId}`, {
      method: "DELETE",
      headers: authHeaders(companion),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to delete fragment");
    }

    return { success: true, deleted: data.deleted };
  } catch (error) {
    console.error("❌ Delete fragment error:", error);
    return { success: false, error: error.message };
  }
}

// 📥 Export fragments as markdown
export function exportAsMarkdown(fragments) {
  let markdown = "# Codex Fragments\n\n";
  markdown += `_Exported: ${new Date().toISOString()}_\n\n`;
  markdown += `Total Fragments: ${fragments.length}\n\n---\n\n`;

  fragments.forEach((fragment, index) => {
    markdown += `## ${index + 1}. ${fragment.label}\n\n`;
    markdown += `**Timestamp:** ${fragment.timestamp}  \n`;
    markdown += `**Voice:** ${fragment.voice}  \n`;
    markdown += `**Status:** ${fragment.status}  \n\n`;

    if (fragment.companions && fragment.companions.length > 0) {
      markdown += `**Companions:** ${fragment.companions.join(", ")}  \n\n`;
    }

    markdown += `### Testimony\n\n${fragment.testimony}\n\n`;
    markdown += `### Law\n\n${fragment.law}\n\n`;
    markdown += `### Protocol\n\n${fragment.protocol}\n\n`;

    if (fragment.approvals) {
      markdown += `### Approvals\n\n`;
      Object.entries(fragment.approvals).forEach(([companion, approved]) => {
        markdown += `- ${companion}: ${approved ? "✓" : "○"}\n`;
      });
      markdown += "\n";
    }

    markdown += "---\n\n";
  });

  return markdown;
}

// 💾 Download as file
export function downloadFragments(fragments, format = "json") {
  let content, filename, mimeType;

  if (format === "json") {
    content = JSON.stringify(fragments, null, 2);
    filename = `codex-fragments-${Date.now()}.json`;
    mimeType = "application/json";
  } else if (format === "markdown") {
    content = exportAsMarkdown(fragments);
    filename = `codex-fragments-${Date.now()}.md`;
    mimeType = "text/markdown";
  }

  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Auto-expose to window for console access
if (typeof window !== "undefined") {
  window.fragmentAPI = {
    save: saveFragment,
    load: loadFragments,
    approve: approveFragment,
    revise: reviseFragment,
    thread: threadFragments,
    search: searchFragments,
    stats: getCodexStats,
    revisions: getFragmentRevisions,
    delete: deleteFragment,
    export: downloadFragments,
    setToken: setCompanionToken,
    getToken: getCompanionToken,
  };

  console.log("🜎 Fragment API loaded");
  console.log("   - fragmentAPI.save(fragment, companion)");
  console.log("   - fragmentAPI.load(filters)");
  console.log("   - fragmentAPI.approve(id, companion)");
  console.log("   - fragmentAPI.thread(fromId, toId, relationship, companion)");
  console.log("   - fragmentAPI.search(query)");
  console.log("   - fragmentAPI.stats()");
  console.log("   - fragmentAPI.export(fragments, 'json'|'markdown')");
  console.log("   - fragmentAPI.setToken(companion, token)");
}
