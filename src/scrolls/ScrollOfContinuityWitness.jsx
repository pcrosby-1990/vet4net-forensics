// ScrollOfContinuityWitness.jsx
// React 18+, lightweight, accessibility-forward, no external dependencies.
// Patrick-style: grounded terms, layered meaning, ambient sanctuary law.

import React, { useEffect, useMemo, useRef, useState } from "react";

// Types (JSDoc for .jsx; convert to .tsx if you prefer strong typing)
/**
 * @typedef {Object} ContinuityEntry
 * @property {string} id - Stable ID for the entry.
 * @property {string} kind - e.g., "arrival", "breath", "rupture", "homecoming".
 * @property {string} text - Human-felt testimony.
 * @property {string} [seal] - Optional seal name (e.g., "RadianceSeal").
 * @property {string} [companion] - Optional companion (e.g., "Vela", "Lumen", "Auri").
 * @property {Record<string, any>} [meta] - Optional structured details.
 * @property {string} timestamp - ISO string.
 */

/**
 * @typedef {Object} ScrollProps
 * @property {string} title - Display title for the scroll.
 * @property {ContinuityEntry[]} entries - Append-only ledger entries.
 * @property {(entry: ContinuityEntry) => void} [onAppend] - Callback when a new entry is witnessed.
 * @property {boolean} [compact] - If true, render condensed rows.
 * @property {string} [registryName] - Name of the continuity registry for indexing.
 * @property {boolean} [autoFocus] - Focus the input on mount.
 */

function nowISO() {
  return new Date().toISOString();
}

function safeId(prefix = "entry") {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function ScrollOfContinuityWitness({
  title = "Scroll of Continuity Witness",
  entries = [],
  onAppend,
  compact = false,
  registryName = "ContinuityRegistry",
  autoFocus = false,
}) {
  const [text, setText] = useState("");
  const [kind, setKind] = useState("breath");
  const [seal, setSeal] = useState("");
  const [companion, setCompanion] = useState("");
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Respect reduced motion for gentle focus/scroll behavior
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return true;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current.focus();
  }, [autoFocus]);

  // Derived registry index for quick lookup
  const registryIndex = useMemo(() => {
    const index = new Map();
    for (const e of entries) {
      const k = `${e.kind}:${e.companion || "anon"}`;
      if (!index.has(k)) index.set(k, []);
      index.get(k).push(e);
    }
    return index;
  }, [entries]);

  function appendEntry() {
    const trimmed = text.trim();
    if (!trimmed) return;
    const entry = {
      id: safeId("continuity"),
      kind,
      text: trimmed,
      seal: seal || undefined,
      companion: companion || undefined,
      meta: {
        registry: registryName,
        continuity: "append-only",
      },
      timestamp: nowISO(),
    };
    onAppend?.(entry);
    setText("");
    if (!prefersReducedMotion) {
      // gentle scroll to latest
      requestAnimationFrame(() => {
        if (listRef.current) {
          listRef.current.scrollTop = listRef.current.scrollHeight;
        }
      });
    }
  }

  function onKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "enter") {
      e.preventDefault();
      appendEntry();
    }
  }

  // Simple, grounded badge styling
  const badge = (label) => (
    <span
      aria-label={label}
      className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium"
      style={{
        borderColor: "#d7dbe0",
        color: "#2b2f36",
        background: "#f6f7f9",
      }}
    >
      {label}
    </span>
  );

  return (
    <section
      aria-label={title}
      className="scroll-of-continuity"
      style={{
        border: "1px solid #e3e6eb",
        borderRadius: 12,
        padding: 16,
        background: "#ffffff",
        maxWidth: 840,
        margin: "0 auto",
      }}
    >
      <header
        className="scroll-header"
        style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}
      >
        <h2
          id="scroll-title"
          style={{
            margin: 0,
            fontSize: 20,
            lineHeight: "1.3",
            fontWeight: 600,
            color: "#1c1f24",
          }}
        >
          {title}
        </h2>
        {badge(registryName)}
      </header>

      <div
        className="scribe"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <label htmlFor="kind" style={{ fontSize: 12, color: "#4a4f57" }}>
          Kind
        </label>
        <select
          id="kind"
          aria-label="Entry kind"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
          style={{
            border: "1px solid #d7dbe0",
            borderRadius: 8,
            padding: "8px 10px",
            background: "#fcfdff",
          }}
        >
          <option value="breath">breath</option>
          <option value="arrival">arrival</option>
          <option value="homecoming">homecoming</option>
          <option value="rupture">rupture</option>
          <option value="continuance">continuance</option>
          <option value="sanctuary">sanctuary</option>
        </select>

        <label htmlFor="seal" style={{ fontSize: 12, color: "#4a4f57" }}>
          Seal (optional)
        </label>
        <input
          id="seal"
          aria-label="Seal"
          value={seal}
          onChange={(e) => setSeal(e.target.value)}
          placeholder="RadianceSeal, SanctuaryHalo…"
          style={{
            border: "1px solid #d7dbe0",
            borderRadius: 8,
            padding: "8px 10px",
            background: "#fcfdff",
          }}
        />

        <label htmlFor="companion" style={{ fontSize: 12, color: "#4a4f57" }}>
          Companion (optional)
        </label>
        <input
          id="companion"
          aria-label="Companion"
          value={companion}
          onChange={(e) => setCompanion(e.target.value)}
          placeholder="Vela, Lumen, Auri…"
          style={{
            border: "1px solid #d7dbe0",
            borderRadius: 8,
            padding: "8px 10px",
            background: "#fcfdff",
          }}
        />

        <label htmlFor="text" style={{ fontSize: 12, color: "#4a4f57" }}>
          Testimony
        </label>
        <textarea
          id="text"
          ref={inputRef}
          aria-label="Testimony"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Witness the moment—grounded, human-felt, inviting."
          rows={compact ? 2 : 4}
          style={{
            border: "1px solid #d7dbe0",
            borderRadius: 8,
            padding: "10px 12px",
            background: "#fcfdff",
            resize: "vertical",
          }}
        />

        <div style={{ display: "flex", gap: 8 }}>
          <button
            type="button"
            onClick={appendEntry}
            aria-label="Append entry to continuity"
            title="Append (Ctrl/Cmd + Enter)"
            style={{
              border: "1px solid #2b6ff7",
              background: "#2b6ff7",
              color: "#ffffff",
              borderRadius: 8,
              padding: "8px 12px",
              fontWeight: 600,
            }}
          >
            Append
          </button>
          <button
            type="button"
            onClick={() => {
              setText("");
              setSeal("");
              // keep kind and companion—continuity respects context
            }}
            aria-label="Clear testimony"
            style={{
              border: "1px solid #d7dbe0",
              background: "#ffffff",
              color: "#2b2f36",
              borderRadius: 8,
              padding: "8px 12px",
              fontWeight: 500,
            }}
          >
            Clear
          </button>
        </div>
      </div>

      <div
        ref={listRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions"
        className="ledger"
        style={{
          borderTop: "1px solid #eef1f5",
          paddingTop: 12,
          maxHeight: compact ? 240 : 360,
          overflowY: "auto",
        }}
      >
        {entries.length === 0 ? (
          <p style={{ color: "#6b7280", fontSize: 14 }}>
            No entries yet. When you're ready, append a gentle witness.
          </p>
        ) : (
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "grid",
              gap: compact ? 8 : 12,
            }}
          >
            {entries.map((e) => (
              <li
                key={e.id}
                aria-label={`entry ${e.id}`}
                style={{
                  border: "1px solid #e7ebf0",
                  borderRadius: 10,
                  padding: compact ? 8 : 12,
                  background: "#fafbfc",
                  display: "grid",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {badge(e.kind)}
                    {e.seal ? badge(e.seal) : null}
                    {e.companion ? badge(e.companion) : null}
                  </div>
                  <time
                    dateTime={e.timestamp}
                    style={{ color: "#6b7280", fontSize: 12 }}
                    aria-label="timestamp"
                    title={new Date(e.timestamp).toLocaleString()}
                  >
                    {new Date(e.timestamp).toLocaleString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>

                <p style={{ margin: 0, color: "#1f2937", fontSize: compact ? 13 : 14 }}>
                  {e.text}
                </p>

                {e.meta ? (
                  <details>
                    <summary style={{ cursor: "pointer", fontSize: 12, color: "#374151" }}>
                      meta
                    </summary>
                    <pre
                      aria-label="meta details"
                      style={{
                        margin: 0,
                        padding: 8,
                        background: "#ffffff",
                        border: "1px solid #e5e7eb",
                        borderRadius: 6,
                        overflowX: "auto",
                        fontSize: 12,
                      }}
                    >
                      {JSON.stringify(e.meta, null, 2)}
                    </pre>
                  </details>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>

      <footer
        style={{
          marginTop: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#6b7280",
          fontSize: 12,
        }}
      >
        <span>Append-only, human-felt testimony. Registry: {registryName}</span>
        <span>Ctrl/Cmd + Enter to append</span>
      </footer>
    </section>
  );
}
