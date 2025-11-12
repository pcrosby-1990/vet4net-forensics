import React, { useEffect, useRef, useState } from 'react';
import { threadingManager } from '../utils/fragmentThreading';

/**
 * Fragment Constellation Graph
 * Visualizes fragments and their relationships as an interactive network
 */
export default function FragmentConstellationGraph({ 
  fragments, 
  centerFragmentId = null,
  width = 800, 
  height = 600 
}) {
  const canvasRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [selectedNode, setSelectedNode] = useState(centerFragmentId);

  useEffect(() => {
    if (!fragments || fragments.length === 0) return;

    // Build node positions
    const nodeMap = new Map();
    const relationships = threadingManager.getAllRelationships();

    // If we have a center fragment, position around it
    if (centerFragmentId && fragments.find(f => f.id === centerFragmentId)) {
      const centerFrag = fragments.find(f => f.id === centerFragmentId);
      nodeMap.set(centerFragmentId, {
        id: centerFragmentId,
        fragment: centerFrag,
        x: width / 2,
        y: height / 2,
        vx: 0,
        vy: 0,
      });

      // Position connected fragments in a circle around center
      const connected = threadingManager.getConnectedFragments(centerFragmentId);
      const radius = 150;
      connected.forEach((fragId, index) => {
        const frag = fragments.find(f => f.id === fragId);
        if (!frag) return;
        
        const angle = (index / connected.length) * Math.PI * 2;
        nodeMap.set(fragId, {
          id: fragId,
          fragment: frag,
          x: width / 2 + Math.cos(angle) * radius,
          y: height / 2 + Math.sin(angle) * radius,
          vx: 0,
          vy: 0,
        });
      });

      // Position remaining fragments randomly
      fragments.forEach(frag => {
        if (!nodeMap.has(frag.id)) {
          nodeMap.set(frag.id, {
            id: frag.id,
            fragment: frag,
            x: Math.random() * width,
            y: Math.random() * height,
            vx: 0,
            vy: 0,
          });
        }
      });
    } else {
      // No center - use force-directed layout starting positions
      fragments.forEach(frag => {
        nodeMap.set(frag.id, {
          id: frag.id,
          fragment: frag,
          x: Math.random() * width,
          y: Math.random() * height,
          vx: 0,
          vy: 0,
        });
      });
    }

    // Build edges from relationships
    const edgeList = relationships
      .filter(rel => nodeMap.has(rel.sourceId) && nodeMap.has(rel.targetId))
      .map(rel => ({
        id: rel.id,
        source: rel.sourceId,
        target: rel.targetId,
        type: rel.type,
        strength: rel.strength,
      }));

    setNodes(Array.from(nodeMap.values()));
    setEdges(edgeList);
  }, [fragments, centerFragmentId, width, height]);

  // Simple force simulation
  useEffect(() => {
    if (nodes.length === 0) return;

    let animationId;
    const simulate = () => {
      const newNodes = [...nodes];
      
      // Apply forces
      for (let i = 0; i < newNodes.length; i++) {
        const nodeA = newNodes[i];
        
        // Repulsion between all nodes
        for (let j = i + 1; j < newNodes.length; j++) {
          const nodeB = newNodes[j];
          const dx = nodeB.x - nodeA.x;
          const dy = nodeB.y - nodeA.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          const force = 500 / (dist * dist);
          
          nodeA.vx -= (dx / dist) * force;
          nodeA.vy -= (dy / dist) * force;
          nodeB.vx += (dx / dist) * force;
          nodeB.vy += (dy / dist) * force;
        }

        // Attraction along edges
        edges.forEach(edge => {
          if (edge.source === nodeA.id) {
            const nodeB = newNodes.find(n => n.id === edge.target);
            if (!nodeB) return;
            const dx = nodeB.x - nodeA.x;
            const dy = nodeB.y - nodeA.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const force = dist * 0.01 * edge.strength;
            
            nodeA.vx += (dx / dist) * force;
            nodeA.vy += (dy / dist) * force;
          }
        });

        // Center gravity
        const centerX = width / 2;
        const centerY = height / 2;
        nodeA.vx += (centerX - nodeA.x) * 0.001;
        nodeA.vy += (centerY - nodeA.y) * 0.001;

        // Apply velocity with damping
        nodeA.x += nodeA.vx;
        nodeA.y += nodeA.vy;
        nodeA.vx *= 0.8;
        nodeA.vy *= 0.8;

        // Keep in bounds
        nodeA.x = Math.max(20, Math.min(width - 20, nodeA.x));
        nodeA.y = Math.max(20, Math.min(height - 20, nodeA.y));
      }

      setNodes(newNodes);
      animationId = requestAnimationFrame(simulate);
    };

    animationId = requestAnimationFrame(simulate);
    const timeout = setTimeout(() => cancelAnimationFrame(animationId), 5000); // Stop after 5s

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(timeout);
    };
  }, [edges, width, height]);

  // Draw to canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);

    // Draw edges
    edges.forEach(edge => {
      const source = nodes.find(n => n.id === edge.source);
      const target = nodes.find(n => n.id === edge.target);
      if (!source || !target) return;

      ctx.beginPath();
      ctx.moveTo(source.x, source.y);
      ctx.lineTo(target.x, target.y);
      ctx.strokeStyle = `rgba(145, 227, 246, ${edge.strength * 0.5})`;
      ctx.lineWidth = edge.strength * 2;
      ctx.stroke();
    });

    // Draw nodes
    nodes.forEach(node => {
      const isSelected = node.id === selectedNode;
      const isHovered = node.id === hoveredNode;
      const radius = isSelected ? 12 : isHovered ? 10 : 8;

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? '#ffd859' : isHovered ? '#91e3f6' : '#5cf7b2';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label (if hovered or selected)
      if (isHovered || isSelected) {
        const text = node.fragment.text.slice(0, 30) + '...';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(node.x + 15, node.y - 10, text.length * 6 + 10, 20);
        ctx.fillStyle = '#fff';
        ctx.font = '12px monospace';
        ctx.fillText(text, node.x + 20, node.y + 4);
      }
    });
  }, [nodes, edges, hoveredNode, selectedNode, width, height]);

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Find hovered node
    const hovered = nodes.find(node => {
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 12;
    });

    setHoveredNode(hovered?.id || null);
  };

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const clicked = nodes.find(node => {
      const dx = node.x - x;
      const dy = node.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 12;
    });

    if (clicked) {
      setSelectedNode(clicked.id);
    }
  };

  return (
    <div className="fragment-constellation">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        style={{
          border: '2px solid rgba(92, 247, 178, 0.3)',
          borderRadius: '8px',
          background: 'rgba(0, 0, 0, 0.8)',
          cursor: hoveredNode ? 'pointer' : 'default',
        }}
      />
      {selectedNode && (
        <div className="selected-fragment-info" style={{
          marginTop: '1rem',
          padding: '1rem',
          background: 'rgba(92, 247, 178, 0.1)',
          borderRadius: '8px',
          border: '1px solid rgba(92, 247, 178, 0.3)',
        }}>
          <h4>Selected Fragment:</h4>
          <p>{nodes.find(n => n.id === selectedNode)?.fragment.text}</p>
          <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.7 }}>
            Connected to {threadingManager.getConnectedFragments(selectedNode).length} fragments
          </div>
        </div>
      )}
    </div>
  );
}
