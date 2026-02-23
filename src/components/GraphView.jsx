import { Activity } from 'lucide-react';
import { useEffect, useRef } from 'react';
import './GraphView.css';

const GraphView = ({ result }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (result && svgRef.current) {
      drawGraph(result);
    }
  }, [result]);

  const drawGraph = (data) => {
    const { allProcesses, allResources, edges, cyclePath} = data;
    
    const svg = svgRef.current;
    svg.innerHTML = '';

    const width = 800;
    const height = 600;
    const centerX = width / 2;
    const centerY = height / 2;
    const processRadius = 220;
    const resourceRadius = 130;

    // Calculate positions
    const processPositions = {};
    const resourcePositions = {};

    allProcesses.forEach((p, i) => {
      const angle = (i / allProcesses.length) * 2 * Math.PI - Math.PI / 2;
      processPositions[p] = {
        x: centerX + processRadius * Math.cos(angle),
        y: centerY + processRadius * Math.sin(angle)
      };
    });

    allResources.forEach((r, i) => {
      const angle = (i / allResources.length) * 2 * Math.PI - Math.PI / 2;
      resourcePositions[r] = {
        x: centerX + resourceRadius * Math.cos(angle),
        y: centerY + resourceRadius * Math.sin(angle)
      };
    });

    const isInCycle = (node) => cyclePath && cyclePath.includes(node);
    const isEdgeInCycle = (from, to) => {
      if (!cyclePath || cyclePath.length === 0) return false;
      for (let i = 0; i < cyclePath.length - 1; i++) {
        if (cyclePath[i] === from && cyclePath[i + 1] === to) return true;
      }
      return false;
    };

    // Create SVG defs
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
    // Arrow markers
    const createMarker = (id, color) => {
      const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
      marker.setAttribute('id', id);
      marker.setAttribute('markerWidth', '12');
      marker.setAttribute('markerHeight', '12');
      marker.setAttribute('refX', '11');
      marker.setAttribute('refY', '6');
      marker.setAttribute('orient', 'auto');
      
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M 0 0 L 12 6 L 0 12 z');
      path.setAttribute('fill', color);
      marker.appendChild(path);
      
      return marker;
    };

    defs.appendChild(createMarker('arrow-normal', '#6b7280'));
    defs.appendChild(createMarker('arrow-cycle', '#ef4444'));
    
    // Glow filter
    const filter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
    filter.setAttribute('id', 'glow');
    
    const feGaussianBlur = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur');
    feGaussianBlur.setAttribute('stdDeviation', '4');
    feGaussianBlur.setAttribute('result', 'coloredBlur');
    filter.appendChild(feGaussianBlur);
    
    const feMerge = document.createElementNS('http://www.w3.org/2000/svg', 'feMerge');
    const feMergeNode1 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode1.setAttribute('in', 'coloredBlur');
    const feMergeNode2 = document.createElementNS('http://www.w3.org/2000/svg', 'feMergeNode');
    feMergeNode2.setAttribute('in', 'SourceGraphic');
    feMerge.appendChild(feMergeNode1);
    feMerge.appendChild(feMergeNode2);
    filter.appendChild(feMerge);
    
    defs.appendChild(filter);
    svg.appendChild(defs);

    // Draw edges with instance labels
    edges.forEach((edge) => {
      const fromPos = processPositions[edge.from] || resourcePositions[edge.from];
      const toPos = processPositions[edge.to] || resourcePositions[edge.to];
      const inCycle = isEdgeInCycle(edge.from, edge.to);

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', inCycle ? 'edge-cycle' : 'edge-normal');

      // Draw line
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', fromPos.x);
      line.setAttribute('y1', fromPos.y);
      line.setAttribute('x2', toPos.x);
      line.setAttribute('y2', toPos.y);
      line.setAttribute('stroke', inCycle ? '#ef4444' : '#6b7280');
      line.setAttribute('stroke-width', inCycle ? '3' : '2');
      line.setAttribute('marker-end', inCycle ? 'url(#arrow-cycle)' : 'url(#arrow-normal)');
      line.setAttribute('opacity', inCycle ? '1' : '0.5');
      
      if (inCycle) {
        line.setAttribute('stroke-dasharray', '8 4');
        line.setAttribute('class', 'animated-dash');
      }
      
      g.appendChild(line);

      // Add instance count label on edge
      if (edge.instances && edge.instances > 1) {
        const midX = (fromPos.x + toPos.x) / 2;
        const midY = (fromPos.y + toPos.y) / 2;
        
        const labelBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        labelBg.setAttribute('cx', midX);
        labelBg.setAttribute('cy', midY);
        labelBg.setAttribute('r', '14');
        labelBg.setAttribute('fill', inCycle ? '#7f1d1d' : '#374151');
        labelBg.setAttribute('stroke', inCycle ? '#ef4444' : '#6b7280');
        labelBg.setAttribute('stroke-width', '2');
        g.appendChild(labelBg);
        
        const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        labelText.setAttribute('x', midX);
        labelText.setAttribute('y', midY + 4);
        labelText.setAttribute('text-anchor', 'middle');
        labelText.setAttribute('font-size', '12');
        labelText.setAttribute('font-weight', '700');
        labelText.setAttribute('fill', inCycle ? '#fca5a5' : '#d1d5db');
        labelText.setAttribute('font-family', "'SF Mono', monospace");
        labelText.textContent = edge.instances;
        g.appendChild(labelText);
      }
      
      svg.appendChild(g);
    });

    // Draw processes (circles)
    allProcesses.forEach((p) => {
      const pos = processPositions[p];
      const inCycle = isInCycle(p);

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', inCycle ? 'node-deadlocked process-node' : 'node-safe process-node');

      // Outer glow circle (for deadlock)
      if (inCycle) {
        const glowCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        glowCircle.setAttribute('cx', pos.x);
        glowCircle.setAttribute('cy', pos.y);
        glowCircle.setAttribute('r', '50');
        glowCircle.setAttribute('fill', 'none');
        glowCircle.setAttribute('stroke', '#ef4444');
        glowCircle.setAttribute('stroke-width', '2');
        glowCircle.setAttribute('opacity', '0.3');
        glowCircle.setAttribute('class', 'glow-ring');
        g.appendChild(glowCircle);
      }

      // Main circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', pos.x);
      circle.setAttribute('cy', pos.y);
      circle.setAttribute('r', '40');
      circle.setAttribute('fill', inCycle ? '#fecaca' : '#bfdbfe');
      circle.setAttribute('stroke', inCycle ? '#ef4444' : '#3b82f6');
      circle.setAttribute('stroke-width', inCycle ? '4' : '3');
      if (inCycle) {
        circle.setAttribute('filter', 'url(#glow)');
      }
      g.appendChild(circle);

      // Text
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', pos.x);
      text.setAttribute('y', pos.y + 6);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '18');
      text.setAttribute('font-weight', '700');
      text.setAttribute('fill', inCycle ? '#991b1b' : '#1e3a8a');
      text.setAttribute('font-family', "'SF Mono', monospace");
      text.textContent = p;
      g.appendChild(text);

      svg.appendChild(g);
    });

    // Draw resources (rounded squares) with instance counts
    allResources.forEach((r) => {
      const pos = resourcePositions[r];
      const inCycle = isInCycle(r);
      const instances = data.resourceInstances?.[r] || 1;

      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('class', inCycle ? 'node-deadlocked resource-node' : 'node-safe resource-node');

      // Outer glow rect (for deadlock)
      if (inCycle) {
        const glowRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        glowRect.setAttribute('x', pos.x - 42);
        glowRect.setAttribute('y', pos.y - 42);
        glowRect.setAttribute('width', '84');
        glowRect.setAttribute('height', '84');
        glowRect.setAttribute('rx', '12');
        glowRect.setAttribute('fill', 'none');
        glowRect.setAttribute('stroke', '#f59e0b');
        glowRect.setAttribute('stroke-width', '2');
        glowRect.setAttribute('opacity', '0.3');
        glowRect.setAttribute('class', 'glow-ring');
        g.appendChild(glowRect);
      }

      // Main rectangle
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', pos.x - 35);
      rect.setAttribute('y', pos.y - 35);
      rect.setAttribute('width', '70');
      rect.setAttribute('height', '70');
      rect.setAttribute('rx', '10');
      rect.setAttribute('fill', inCycle ? '#fef3c7' : '#d1fae5');
      rect.setAttribute('stroke', inCycle ? '#f59e0b' : '#10b981');
      rect.setAttribute('stroke-width', inCycle ? '4' : '3');
      if (inCycle) {
        rect.setAttribute('filter', 'url(#glow)');
      }
      g.appendChild(rect);

      // Resource label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', pos.x);
      text.setAttribute('y', pos.y - 5);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '18');
      text.setAttribute('font-weight', '700');
      text.setAttribute('fill', inCycle ? '#92400e' : '#065f46');
      text.setAttribute('font-family', "'SF Mono', monospace");
      text.textContent = r;
      g.appendChild(text);

      // Instance count badge - MORE PROMINENT
      const badgeText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      badgeText.setAttribute('x', pos.x);
      badgeText.setAttribute('y', pos.y + 15);
      badgeText.setAttribute('text-anchor', 'middle');
      badgeText.setAttribute('font-size', '16');
      badgeText.setAttribute('font-weight', '700');
      badgeText.setAttribute('fill', inCycle ? '#78350f' : '#047857');
      badgeText.setAttribute('font-family', "'SF Mono', monospace");
      badgeText.textContent = `[${instances}]`;
      g.appendChild(badgeText);

      svg.appendChild(g);
    });
  };

  return (
    <div className="graph-view">
      <div className="graph-header">
        <div className="header-icon graph-icon">
          <Activity size={28} />
        </div>
        <div className="header-content">
          <h2>Resource Allocation Graph</h2>
          <p>Visual representation with resource instances</p>
        </div>
      </div>

      <div className="graph-container">
        {result ? (
          <>
            <svg
              ref={svgRef}
              viewBox="0 0 800 600"
              preserveAspectRatio="xMidYMid meet"
              className="graph-svg"
            />
            <div className="graph-legend">
              <div className="legend-item">
                <div className="legend-circle process-legend"></div>
                <span>Process</span>
              </div>
              <div className="legend-item">
                <div className="legend-square resource-legend"></div>
                <span>Resource [instances]</span>
              </div>
              <div className="legend-item">
                <div className="legend-line normal-legend"></div>
                <span>Edge</span>
              </div>
              {result.hasDeadlock && (
                <div className="legend-item">
                  <div className="legend-line cycle-legend"></div>
                  <span>Deadlock Cycle</span>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="graph-empty">
            <Activity size={64} strokeWidth={1.5} />
            <h3>No Graph Generated</h3>
            <p>Configure the system and click "Detect Deadlock" to visualize the Resource Allocation Graph</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphView;