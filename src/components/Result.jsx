import React from 'react';
import { AlertTriangle, CheckCircle, Zap, Shield } from 'lucide-react';
import './Result.css';

const Result = ({ result }) => {
  if (!result) return null;

  const { hasDeadlock, deadlockedProcesses, deadlockedResources } = result;

  return (
    <div className={`result-container ${hasDeadlock ? 'result-deadlock' : 'result-safe'}`}>
      <div className="result-content">
        <div className="result-icon-wrapper">
          {hasDeadlock ? (
            <div className="icon-danger">
              <AlertTriangle size={48} />
            </div>
          ) : (
            <div className="icon-success">
              <CheckCircle size={48} />
            </div>
          )}
        </div>

        <div className="result-header">
          <h2>{hasDeadlock ? 'DEADLOCK DETECTED' : 'SAFE STATE'}</h2>
          <div className="status-badge">
            {hasDeadlock ? (
              <>
                <Zap size={16} />
                <span>SYSTEM BLOCKED</span>
              </>
            ) : (
              <>
                <Shield size={16} />
                <span>SYSTEM OPERATIONAL</span>
              </>
            )}
          </div>
        </div>

        <div className="result-body">
          {hasDeadlock ? (
            <>
              <p className="result-message danger-message">
                A circular wait condition has been identified in the system. 
                Multiple processes are permanently blocked, waiting for resources held by each other.
              </p>

              <div className="details-section">
                <div className="detail-block">
                  <h3>
                    <span className="detail-icon">⚠️</span>
                    Deadlocked Processes
                  </h3>
                  <div className="badge-list">
                    {deadlockedProcesses.map(p => (
                      <span key={p} className="entity-badge process-badge">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="detail-block">
                  <h3>
                    <span className="detail-icon">🔒</span>
                    Involved Resources
                  </h3>
                  <div className="badge-list">
                    {deadlockedResources.map(r => (
                      <span key={r} className="entity-badge resource-badge">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="recovery-section">
                <h3>
                  <span className="recovery-icon">💡</span>
                  Recovery Strategies
                </h3>
                <ul className="recovery-list">
                  <li>
                    <strong>Process Termination:</strong> Abort one or more deadlocked processes 
                    to break the circular wait
                  </li>
                  <li>
                    <strong>Resource Preemption:</strong> Forcibly remove resources from processes 
                    and reallocate them
                  </li>
                  <li>
                    <strong>Rollback:</strong> Return the system to a previous safe state using checkpoints
                  </li>
                </ul>
              </div>

              <div className="alert-box danger-alert">
                <AlertTriangle size={20} />
                <div>
                  <strong>Critical:</strong> Immediate action required to restore system functionality. 
                  Consider terminating <strong>{deadlockedProcesses[0]}</strong> as the first recovery step.
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="result-message success-message">
                All processes can complete their execution without circular dependencies. 
                The system is operating in a safe state with proper resource allocation.
              </p>

              <div className="success-stats">
                <div className="stat-card">
                  <div className="stat-value">{result.allProcesses.length}</div>
                  <div className="stat-label">Active Processes</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{result.allResources.length}</div>
                  <div className="stat-label">Available Resources</div>
                </div>
                <div className="stat-card">
                  <div className="stat-value">{result.edges.length}</div>
                  <div className="stat-label">Total Edges</div>
                </div>
              </div>

              <div className="alert-box success-alert">
                <CheckCircle size={20} />
                <div>
                  <strong>System Status:</strong> No circular wait detected. 
                  All resource requests can be satisfied without causing deadlock.
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Result;
