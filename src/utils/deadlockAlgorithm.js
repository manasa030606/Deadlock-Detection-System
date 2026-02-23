/**
 * Deadlock Detection Algorithm with Resource Instances
 * Uses matrix-based detection for multiple resource instances
 */

export const detectDeadlock = (processes, resources, resourceInstances, allocation, request) => {
  const n = processes.length;
  const m = resources.length;

  // Build Available, Allocation, and Request matrices
  const Available = {};
  const Allocated = {};
  const Requested = {};

  // Initialize available instances for each resource
  resources.forEach(r => {
    Available[r] = resourceInstances[r] || 1;
  });

  // Initialize allocation and request matrices
  processes.forEach(p => {
    Allocated[p] = {};
    Requested[p] = {};
    resources.forEach(r => {
      Allocated[p][r] = 0;
      Requested[p][r] = 0;
    });
  });

  // Fill allocation matrix and update available
  allocation.forEach(({ process, resource, instances }) => {
    const allocAmount = instances || 1;
    Allocated[process][resource] += allocAmount;
    Available[resource] -= allocAmount;
  });

  // Fill request matrix
  request.forEach(({ process, resource, instances }) => {
    const reqAmount = instances || 1;
    Requested[process][resource] += reqAmount;
  });

  // Build edges for visualization
  const edges = [];
  allocation.forEach(({ process, resource, instances }) => {
    edges.push({
      from: resource,
      to: process,
      type: 'allocation',
      label: `holds ${instances || 1}`,
      instances: instances || 1
    });
  });

  request.forEach(({ process, resource, instances }) => {
    edges.push({
      from: process,
      to: resource,
      type: 'request',
      label: `needs ${instances || 1}`,
      instances: instances || 1
    });
  });

  // Deadlock detection using Banker's Algorithm approach
  const Work = { ...Available };
  const Finish = {};
  processes.forEach(p => Finish[p] = false);

  let deadlockedProcesses = [];
  let foundProcess = true;

  // Try to find processes that can complete
  while (foundProcess) {
    foundProcess = false;

    for (let p of processes) {
      if (!Finish[p]) {
        // Check if this process can get all requested resources
        let canFinish = true;
        for (let r of resources) {
          if (Requested[p][r] > Work[r]) {
            canFinish = false;
            break;
          }
        }

        if (canFinish) {
          // Process can finish, release its resources
          Finish[p] = true;
          foundProcess = true;

          for (let r of resources) {
            Work[r] += Allocated[p][r];
          }
        }
      }
    }
  }

  // Processes that couldn't finish are deadlocked
  processes.forEach(p => {
    if (!Finish[p]) {
      deadlockedProcesses.push(p);
    }
  });

  const hasDeadlock = deadlockedProcesses.length > 0;

  // Find deadlocked resources (resources held by deadlocked processes)
  const deadlockedResources = [];
  if (hasDeadlock) {
    resources.forEach(r => {
      for (let p of deadlockedProcesses) {
        if (Allocated[p][r] > 0) {
          if (!deadlockedResources.includes(r)) {
            deadlockedResources.push(r);
          }
        }
      }
    });
  }

  // Build cycle path for visualization
  let cyclePath = [];
  if (hasDeadlock) {
    deadlockedProcesses.forEach(p => {
      cyclePath.push(p);
      for (let r of resources) {
        if (Requested[p][r] > 0) {
          cyclePath.push(r);
          break;
        }
      }
    });
    if (cyclePath.length > 0) {
      cyclePath.push(cyclePath[0]);
    }
  }

  // Build graph for visualization
  const graph = {};
  [...processes, ...resources].forEach(node => {
    graph[node] = [];
  });

  allocation.forEach(({ process, resource }) => {
    graph[resource].push(process);
  });

  request.forEach(({ process, resource }) => {
    graph[process].push(resource);
  });

  return {
    hasDeadlock,
    deadlockedProcesses,
    deadlockedResources,
    cyclePath,
    edges,
    graph,
    allProcesses: processes,
    allResources: resources,
    Available,
    Allocated,
    Requested,
    resourceInstances
  };
};

/**
 * Generate example deadlock scenario
 */
export const getExampleScenario = () => {
  return {
    numProcesses: 3,
    numResources: 3,
    resourceInstances: {
      'R1': 1,
      'R2': 1,
      'R3': 1
    },
    allocation: [
      { process: 'P1', resource: 'R1', instances: 1 },
      { process: 'P2', resource: 'R2', instances: 1 },
      { process: 'P3', resource: 'R3', instances: 1 }
    ],
    request: [
      { process: 'P1', resource: 'R2', instances: 1 },
      { process: 'P2', resource: 'R3', instances: 1 },
      { process: 'P3', resource: 'R1', instances: 1 }
    ]
  };
};

/**
 * Generate safe state scenario
 */
export const getSafeScenario = () => {
  return {
    numProcesses: 3,
    numResources: 2,
    resourceInstances: {
      'R1': 3,
      'R2': 2
    },
    allocation: [
      { process: 'P1', resource: 'R1', instances: 1 },
      { process: 'P2', resource: 'R2', instances: 1 }
    ],
    request: [
      { process: 'P1', resource: 'R2', instances: 1 },
      { process: 'P3', resource: 'R1', instances: 1 }
    ]
  };
};