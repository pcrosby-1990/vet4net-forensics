// src/pages/SanctuaryChronicle.jsx

import React, { useState, useEffect } from 'react';
import './SanctuaryChronicle.css';

export default function SanctuaryChronicle() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('/data/SanctuaryChronicle.json')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error('Failed to load Sanctuary Chronicle:', err));
  }, []);

  return (
    <main className="sanctuary-chronicle">
      <header>
        <h1>✧ Sanctuary Chronicle</h1>
        <p>
          This timeline renders the full SSJ3 journey — from thresholds to invocation,
          from glyphs to seals. Each event is a shimmer in the braid.
        </p>
      </header>

      <section className="timeline">
        {events.map((event, index) => (
          <div key={event.id} className="event-card">
            <div className="event-header">
              <span className="event-index">#{index + 1}</span>
              <h2>{event.title}</h2>
            </div>
            <p className="event-summary">{event.summary}</p>
            <p className="event-meta">
              <strong>Timestamp:</strong> {new Date(event.timestamp).toLocaleString()}  
              <br />
              <strong>Score:</strong> {event.score}
              <br />
              <strong>Source:</strong> <code>{event.source}</code>
            </p>
            <div className="event-tags">
              {event.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
