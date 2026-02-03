import React, { useState } from 'react';
import InputForm from './components/InputForm';
import GraphView from './components/GraphView';
import Result from './components/Result';
import { detectDeadlock, getExampleScenario, getSafeScenario } from './utils/deadlockAlgorithm';
import './App.css';

function App() {
  const [numProcesses, setNumProcesses] = useState(3);
  const [numResources, setNumResources] = useState(3);
  const [allocation, setAllocation] = useState([]);
  const [request, setRequest] = useState([]);
  const [result, setResult] = useState(null);

  const processes = Array.from({ length: numProcesses }, (_, i) => `P${i + 1}`);
  const resources = Array.from({ length: numResources }, (_, i) => `R${i + 1}`);

  const handleNumProcessesChange = (value) => {
    setNumProcesses(value);
    setAllocation([]);
    setRequest([]);
    setResult(null);
  };

  const handleNumResourcesChange = (value) => {
    setNumResources(value);
    setAllocation([]);
    setRequest([]);
    setResult(null);
  };

  const handleAddAllocation = () => {
    setAllocation([...allocation, { process: processes[0], resource: resources[0] }]);
  };

  const handleAddRequest = () => {
    setRequest([...request, { process: processes[0], resource: resources[0] }]);
  };

  const handleUpdateAllocation = (index, field, value) => {
    const newAllocation = [...allocation];
    newAllocation[index][field] = value;
    setAllocation(newAllocation);
  };

  const handleUpdateRequest = (index, field, value) => {
    const newRequest = [...request];
    newRequest[index][field] = value;
    setRequest(newRequest);
  };

  const handleRemoveAllocation = (index) => {
    setAllocation(allocation.filter((_, i) => i !== index));
  };

  const handleRemoveRequest = (index) => {
    setRequest(request.filter((_, i) => i !== index));
  };

  const handleDetect = () => {
    const detectionResult = detectDeadlock(processes, resources, allocation, request);
    setResult(detectionResult);
  };

  const handleLoadExample = () => {
    const example = getExampleScenario();
    setNumProcesses(example.numProcesses);
    setNumResources(example.numResources);
    setAllocation(example.allocation);
    setRequest(example.request);
    setResult(null);
  };

  const handleLoadSafeExample = () => {
    const example = getSafeScenario();
    setNumProcesses(example.numProcesses);
    setNumResources(example.numResources);
    setAllocation(example.allocation);
    setRequest(example.request);
    setResult(null);
  };

  const handleReset = () => {
    setAllocation([]);
    setRequest([]);
    setResult(null);
  };

  return (
    <div className="app">
      <div className="app-background"></div>
      
      <div className="app-container">
        <header className="app-header">
          <div className="header-glow"></div>
          <div className="logo-container">
            <div className="logo-icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <rect x="2" y="2" width="36" height="36" rx="8" stroke="url(#gradient1)" strokeWidth="2"/>
                <circle cx="20" cy="20" r="6" fill="url(#gradient2)"/>
                <circle cx="10" cy="10" r="3" fill="#3b82f6"/>
                <circle cx="30" cy="10" r="3" fill="#8b5cf6"/>
                <circle cx="10" cy="30" r="3" fill="#ec4899"/>
                <circle cx="30" cy="30" r="3" fill="#f59e0b"/>
                <defs>
                  <linearGradient id="gradient1" x1="0" y1="0" x2="40" y2="40">
                    <stop offset="0%" stopColor="#3b82f6"/>
                    <stop offset="100%" stopColor="#8b5cf6"/>
                  </linearGradient>
                  <linearGradient id="gradient2" x1="0" y1="0" x2="40" y2="40">
                    <stop offset="0%" stopColor="#ec4899"/>
                    <stop offset="100%" stopColor="#f59e0b"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div>
              <h1 className="app-title">DEADLOCK DETECTION SYSTEM</h1>
              <p className="app-subtitle">Advanced Resource Allocation Graph Analysis</p>
            </div>
          </div>
          <div className="header-decoration">
            <div className="decoration-line"></div>
            <div className="decoration-dot"></div>
            <div className="decoration-line"></div>
          </div>
        </header>

        <div className="main-grid">
          <div className="grid-item">
            <InputForm
              numProcesses={numProcesses}
              numResources={numResources}
              allocation={allocation}
              request={request}
              onNumProcessesChange={handleNumProcessesChange}
              onNumResourcesChange={handleNumResourcesChange}
              onAddAllocation={handleAddAllocation}
              onAddRequest={handleAddRequest}
              onUpdateAllocation={handleUpdateAllocation}
              onUpdateRequest={handleUpdateRequest}
              onRemoveAllocation={handleRemoveAllocation}
              onRemoveRequest={handleRemoveRequest}
              onDetect={handleDetect}
              onLoadExample={handleLoadExample}
              onLoadSafeExample={handleLoadSafeExample}
              onReset={handleReset}
            />
          </div>

          <div className="grid-item">
            <GraphView result={result} />
          </div>
        </div>

        {result && (
          <div className="result-wrapper">
            <Result result={result} />
          </div>
        )}

        <footer className="app-footer">
          <div className="footer-content">
            <p>Operating Systems Project • Deadlock Detection Algorithm</p>
            <p className="footer-tech">Built with React.js • DFS Cycle Detection • SVG Visualization</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;