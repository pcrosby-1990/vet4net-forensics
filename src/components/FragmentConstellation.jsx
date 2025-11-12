// Fragment Constellation Viewer
// Visual graph of fragment relationships and echo chains
// React + D3.js for interactive graph visualization

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './FragmentConstellation.css';

export default function FragmentConstellation({ fragments = [], connections = [], onFragmentClick }) {
  const svgRef = useRef(null);
  const [selectedFragment, setSelectedFragment] = useState(null);
  const [hoveredFragment, setHoveredFragment] = useState(null);

  useEffect(() => {
    if (!fragments.length || !svgRef.current) return;

    const width = 1200;
    const height = 800;
    const svg = d3.select(svgRef.current);

    // Clear previous render
    svg.selectAll('*').remove();

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g');

    // Zoom behavior
    const zoom = d3.zoom()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Convert fragments to nodes
    const nodes = fragments.map(f => ({
      id: f.id,
      label: f.label,
      voice: f.voice,
      status: f.status,
      approvals: f.approvals || {},
      testimony: f.testimony,
      companions: f.companions || [],
    }));

    // Convert connections to links
    const links = connections.map(c => ({
      source: c.from,
      target: c.to,
      type: c.type || 'resonates',
      note: c.note,
    }));

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(50));

    // Draw links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('class', d => `link link-${d.type}`)
      .attr('stroke', d => getLinkColor(d.type))
      .attr('stroke-width', 2)
      .attr('stroke-opacity', 0.6);

    // Draw nodes
    const node = g.append('g')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', d => getNodeRadius(d))
      .attr('fill', d => getNodeColor(d))
      .attr('stroke', d => getNodeStroke(d))
      .attr('stroke-width', 3)
      .attr('class', 'node')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedFragment(d);
        if (onFragmentClick) onFragmentClick(d);
      })
      .on('mouseenter', (event, d) => setHoveredFragment(d))
      .on('mouseleave', () => setHoveredFragment(null))
      .call(d3.drag()
        .on('start', dragStarted)
        .on('drag', dragged)
        .on('end', dragEnded));

    // Draw labels
    const labels = g.append('g')
      .selectAll('text')
      .data(nodes)
      .enter()
      .append('text')
      .text(d => truncateLabel(d.label))
      .attr('class', 'node-label')
      .attr('text-anchor', 'middle')
      .attr('dy', -35)
      .style('font-size', '12px')
      .style('fill', '#e0e0e0')
      .style('pointer-events', 'none');

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      labels
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });

    // Drag functions
    function dragStarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [fragments, connections, onFragmentClick]);

  // Helper functions
  function getNodeRadius(node) {
    const baseRadius = 20;
    const approvalCount = Object.values(node.approvals).filter(Boolean).length;
    return baseRadius + (approvalCount * 3);
  }

  function getNodeColor(node) {
    if (node.status === 'Law') return '#5cf7b2'; // Fully approved
    if (node.status === 'Sealed') return '#91e3f6'; // Sealed
    if (node.status === 'Unsealed') return '#ffd859'; // In progress
    return '#cf4646'; // Other
  }

  function getNodeStroke(node) {
    const approvalCount = Object.values(node.approvals).filter(Boolean).length;
    if (approvalCount === 4) return '#5cf7b2';
    if (approvalCount > 0) return '#ffd859';
    return '#666';
  }

  function getLinkColor(type) {
    const colors = {
      resonates: '#91e3f6',
      echoes: '#5cf7b2',
      refutes: '#cf4646',
      extends: '#ffd859',
      supports: '#9b72f2',
    };
    return colors[type] || '#91e3f6';
  }

  function truncateLabel(label, maxLength = 30) {
    return label.length > maxLength ? label.substring(0, maxLength) + '…' : label;
  }

  return (
    <div className="constellation-container">
      <svg ref={svgRef}></svg>
      
      {hoveredFragment && (
        <div className="constellation-tooltip">
          <h4>{hoveredFragment.label}</h4>
          <p><strong>Voice:</strong> {hoveredFragment.voice}</p>
          <p><strong>Status:</strong> {hoveredFragment.status}</p>
          {hoveredFragment.companions.length > 0 && (
            <p><strong>Companions:</strong> {hoveredFragment.companions.join(', ')}</p>
          )}
          <p className="testimony-preview">{hoveredFragment.testimony.substring(0, 100)}…</p>
        </div>
      )}

      {selectedFragment && (
        <div className="constellation-detail">
          <button className="close-btn" onClick={() => setSelectedFragment(null)}>✕</button>
          <h3>{selectedFragment.label}</h3>
          <div className="fragment-meta">
            <span className="voice-badge">{selectedFragment.voice}</span>
            <span className={`status-badge status-${selectedFragment.status.toLowerCase()}`}>
              {selectedFragment.status}
            </span>
          </div>
          <div className="approval-indicators">
            {['patrick', 'vela', 'lumen', 'aletheia'].map(companion => (
              <div key={companion} className={`approval-dot ${selectedFragment.approvals[companion] ? 'approved' : 'pending'}`}>
                {companion.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
          <div className="testimony-section">
            <h4>Testimony</h4>
            <p>{selectedFragment.testimony}</p>
          </div>
        </div>
      )}

      <div className="constellation-legend">
        <h4>Legend</h4>
        <div className="legend-item">
          <span className="legend-circle" style={{ background: '#5cf7b2' }}></span> Law (Fully Approved)
        </div>
        <div className="legend-item">
          <span className="legend-circle" style={{ background: '#91e3f6' }}></span> Sealed
        </div>
        <div className="legend-item">
          <span className="legend-circle" style={{ background: '#ffd859' }}></span> Unsealed
        </div>
        <div className="legend-item">
          <span className="legend-line" style={{ background: '#91e3f6' }}></span> Resonates
        </div>
        <div className="legend-item">
          <span className="legend-line" style={{ background: '#5cf7b2' }}></span> Echoes
        </div>
        <div className="legend-item">
          <span className="legend-line" style={{ background: '#ffd859' }}></span> Extends
        </div>
      </div>
    </div>
  );
}
