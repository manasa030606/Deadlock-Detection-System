/**
 * Deadlock Detection Algorithm
 * Uses Depth-First Search (DFS) to detect cycles in Resource Allocation Graph
 */

export const detectDeadlock = (processes, resources, allocation, request) => {
  const n = processes.length;
  const m = resources.length;
  
  // Build adjacency list representation of the graph
  const graph = {};
  const inDegree = {};
  
  // Initialize graph nodes
  [...processes, ...resources].forEach(node => {
    graph[node] = [];
    inDegree[node] = 0;
  });
  
  // Build edges array for visualization
  const edges = [];
  
  // Allocation edges: Resource → Process (resource is allocated to process)
  allocation.forEach(({ process, resource }) => {
    graph[resource].push(process);
    inDegree[process]++;
    edges.push({ 
      from: resource, 
      to: process, 
      type: 'allocation',
      label: 'holds'
    });
  });
  
  // Request edges: Process → Resource (process requests resource)
  request.forEach(({ process, resource }) => {
    graph[process].push(resource);
    inDegree[resource]++;
    edges.push({ 
      from: process, 
      to: resource, 
      type: 'request',
      label: 'requests'
    });
  });
  
  // Cycle detection using DFS
  const visited = {};
  const recStack = {};
  let cycleFound = false;
  let cyclePath = [];
  
  const dfs = (node, path) => {
    visited[node] = true;
    recStack[node] = true;
    path.push(node);
    
    if (graph[node]) {
      for (let neighbor of graph[node]) {
        if (!visited[neighbor]) {
          if (dfs(neighbor, [...path])) {
            return true;
          }
        } else if (recStack[neighbor]) {
          // Cycle detected!
          const cycleStartIndex = path.indexOf(neighbor);
          cyclePath = path.slice(cycleStartIndex);
          cyclePath.push(neighbor); // Complete the cycle
          return true;
        }
      }
    }
    
    recStack[node] = false;
    return false;
  };
  
  // Check for cycles starting from each unvisited node
  for (let node in graph) {
    if (!visited[node]) {
      if (dfs(node, [])) {
        cycleFound = true;
        break;
      }
    }
  }
  
  // Extract deadlocked processes from cycle
  const deadlockedProcesses = cycleFound 
    ? [...new Set(cyclePath.filter(node => processes.includes(node)))]
    : [];
  
  // Extract deadlocked resources from cycle
  const deadlockedResources = cycleFound
    ? [...new Set(cyclePath.filter(node => resources.includes(node)))]
    : [];
  
  return {
    hasDeadlock: cycleFound,
    deadlockedProcesses,
    deadlockedResources,
    cyclePath,
    edges,
    graph,
    allProcesses: processes,
    allResources: resources
  };
};

/**
 * Generate example deadlock scenario
 */
export const getExampleScenario = () => {
  return {
    numProcesses: 4,
    numResources: 4,
    allocation: [
      { process: 'P1', resource: 'R1' },
      { process: 'P2', resource: 'R2' },
      { process: 'P3', resource: 'R3' },
      { process: 'P4', resource: 'R4' }
    ],
    request: [
      { process: 'P1', resource: 'R2' },
      { process: 'P2', resource: 'R3' },
      { process: 'P3', resource: 'R4' },
      { process: 'P4', resource: 'R1' }
    ]
  };
};

/**
 * Generate safe state scenario
 */
export const getSafeScenario = () => {
  return {
    numProcesses: 3,
    numResources: 3,
    allocation: [
      { process: 'P1', resource: 'R1' },
      { process: 'P2', resource: 'R2' }
    ],
    request: [
      { process: 'P3', resource: 'R3' }
    ]
  };
};