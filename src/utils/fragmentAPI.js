// src/utils/fragmentAPI.js
// Client-side API utilities for fragment storage

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Get auth token from environment or localStorage
function getAuthToken() {
  return (
    import.meta.env.VITE_FRAGMENT_TOKEN ||
    localStorage.getItem("codex_auth_token")
  );
}

// 💾 Save a new fragment to the Codex
export async function saveFragment(fragment) {
  const token = getAuthToken();

  if (!token) {
    throw new Error("No authentication token found. Please set VITE_FRAGMENT_TOKEN or login.");
  }

  const response = await fetch(`${API_BASE_URL}/api/fragments/save`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(fragment),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to save fragment");
  }

  return response.json();
}

// 📖 Get all fragments with optional filtering
export async function getFragments(filters = {}) {
  const params = new URLSearchParams(filters);
  const response = await fetch(
    `${API_BASE_URL}/api/fragments?${params.toString()}`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch fragments");
  }

  return response.json();
}

// 🔄 Revise an existing fragment
export async function reviseFragment(fragmentId, updates) {
  const token = getAuthToken();

  if (!token) {
    throw new Error("No authentication token found. Please set VITE_FRAGMENT_TOKEN or login.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/fragments/${fragmentId}/revise`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to revise fragment");
  }

  return response.json();
}

// 📜 Get all revisions for a fragment
export async function getFragmentRevisions(fragmentId) {
  const response = await fetch(
    `${API_BASE_URL}/api/fragments/${fragmentId}/revisions`
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch revisions");
  }

  return response.json();
}

// 🗑️ Delete a fragment
export async function deleteFragment(fragmentId) {
  const token = getAuthToken();

  if (!token) {
    throw new Error("No authentication token found. Please set VITE_FRAGMENT_TOKEN or login.");
  }

  const response = await fetch(
    `${API_BASE_URL}/api/fragments/${fragmentId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete fragment");
  }

  return response.json();
}

// 📊 Get Codex statistics
export async function getFragmentStats() {
  const response = await fetch(`${API_BASE_URL}/api/fragments/stats`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch stats");
  }

  return response.json();
}

// 🔐 Set authentication token in localStorage
export function setAuthToken(token) {
  localStorage.setItem("codex_auth_token", token);
}

// 🚪 Clear authentication token
export function clearAuthToken() {
  localStorage.removeItem("codex_auth_token");
}

// ✅ Check if user is authenticated
export function isAuthenticated() {
  return !!getAuthToken();
}
