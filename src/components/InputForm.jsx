import React from 'react';
import { Plus, Trash2, Cpu, Database, Play } from 'lucide-react';
import './InputForm.css';

const InputForm = ({
  numProcesses,
  numResources,
  allocation,
  request,
  onNumProcessesChange,
  onNumResourcesChange,
  onAddAllocation,
  onAddRequest,
  onUpdateAllocation,
  onUpdateRequest,
  onRemoveAllocation,
  onRemoveRequest,
  onDetect,
  onLoadExample,
  onLoadSafeExample,
  onReset
}) => {
  const processes = Array.from({ length: numProcesses }, (_, i) => `P${i + 1}`);
  const resources = Array.from({ length: numResources }, (_, i) => `R${i + 1}`);

  return (
    <div className="input-form">
      <div className="form-header">
        <div className="header-icon">
          <Cpu size={28} />
        </div>
        <div className="header-content">
          <h2>System Configuration</h2>
          <p>Define processes, resources, and their relationships</p>
        </div>
      </div>

      <div className="form-body">
        {/* System Setup */}
        <div className="section">
          <div className="section-title">
            <span className="title-dot"></span>
            System Setup
          </div>
          
          <div className="control-row">
            <div className="control-group">
              <label htmlFor="numProcesses">
                <Cpu size={16} />
                Processes
              </label>
              <input
                id="numProcesses"
                type="number"
                min="2"
                max="10"
                value={numProcesses}
                onChange={(e) => onNumProcessesChange(parseInt(e.target.value) || 2)}
                className="input-field"
              />
              <span className="input-hint">{processes.join(', ')}</span>
            </div>

            <div className="control-group">
              <label htmlFor="numResources">
                <Database size={16} />
                Resources
              </label>
              <input
                id="numResources"
                type="number"
                min="2"
                max="10"
                value={numResources}
                onChange={(e) => onNumResourcesChange(parseInt(e.target.value) || 2)}
                className="input-field"
              />
              <span className="input-hint">{resources.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Allocation Section */}
        <div className="section">
          <div className="section-title">
            <span className="title-dot allocation-dot"></span>
            Resource Allocation
            <span className="badge">{allocation.length}</span>
          </div>
          <p className="section-desc">Which process currently holds which resource</p>

          <div className="items-list">
            {allocation.length === 0 ? (
              <div className="empty-state">
                <Database size={32} strokeWidth={1.5} />
                <p>No allocations defined</p>
                <span>Click below to add resource allocation</span>
              </div>
            ) : (
              allocation.map((alloc, idx) => (
                <div key={idx} className="item-row allocation-row">
                  <div className="item-selects">
                    <select
                      value={alloc.process}
                      onChange={(e) => onUpdateAllocation(idx, 'process', e.target.value)}
                      className="select-field process-select"
                    >
                      {processes.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    
                    <div className="arrow-indicator">holds</div>
                    
                    <select
                      value={alloc.resource}
                      onChange={(e) => onUpdateAllocation(idx, 'resource', e.target.value)}
                      className="select-field resource-select"
                    >
                      {resources.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => onRemoveAllocation(idx)}
                    className="btn-icon btn-danger"
                    title="Remove allocation"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          <button onClick={onAddAllocation} className="btn-add">
            <Plus size={18} />
            Add Allocation
          </button>
        </div>

        {/* Request Section */}
        <div className="section">
          <div className="section-title">
            <span className="title-dot request-dot"></span>
            Resource Requests
            <span className="badge">{request.length}</span>
          </div>
          <p className="section-desc">Which process is waiting for which resource</p>

          <div className="items-list">
            {request.length === 0 ? (
              <div className="empty-state">
                <Database size={32} strokeWidth={1.5} />
                <p>No requests defined</p>
                <span>Click below to add resource request</span>
              </div>
            ) : (
              request.map((req, idx) => (
                <div key={idx} className="item-row request-row">
                  <div className="item-selects">
                    <select
                      value={req.process}
                      onChange={(e) => onUpdateRequest(idx, 'process', e.target.value)}
                      className="select-field process-select"
                    >
                      {processes.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    
                    <div className="arrow-indicator">requests</div>
                    
                    <select
                      value={req.resource}
                      onChange={(e) => onUpdateRequest(idx, 'resource', e.target.value)}
                      className="select-field resource-select"
                    >
                      {resources.map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => onRemoveRequest(idx)}
                    className="btn-icon btn-danger"
                    title="Remove request"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          <button onClick={onAddRequest} className="btn-add">
            <Plus size={18} />
            Add Request
          </button>
        </div>

        {/* Action Buttons */}
        <div className="action-section">
          <button onClick={onDetect} className="btn-primary">
            <Play size={20} />
            Detect Deadlock
          </button>
          
          <div className="action-grid">
            <button onClick={onLoadExample} className="btn-secondary">
              Load Deadlock Example
            </button>
            <button onClick={onLoadSafeExample} className="btn-secondary">
              Load Safe Example
            </button>
            <button onClick={onReset} className="btn-secondary">
              Reset All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputForm;