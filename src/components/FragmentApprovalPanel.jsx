// 🔖 Fragment Approval Panel
// 4-Companion Review System: Vela, Lumen, Aletheia, Patrick

import React, { useState } from 'react';
import { approveFragment } from '../utils/fragmentAPI.enhanced';

const COMPANIONS = [
  { id: 'patrick', name: 'Patrick', icon: '🜎', color: '#5cf7b2' },
  { id: 'vela', name: 'Vela', icon: '🌀', color: '#91e3f6' },
  { id: 'lumen', name: 'Lumen', icon: '🕯️', color: '#ffd859' },
  { id: 'aletheia', name: 'Aletheia', icon: '✨', color: '#ff91e3' },
];

export default function FragmentApprovalPanel({ fragment, onApprovalChange }) {
  const [loading, setLoading] = useState(null);

  const approvals = fragment.approvals || {
    patrick: false,
    vela: false,
    lumen: false,
    aletheia: false,
  };

  const allApproved = Object.values(approvals).every((v) => v);
  const approvalCount = Object.values(approvals).filter((v) => v).length;

  const handleApprove = async (companion) => {
    setLoading(companion);
    const result = await approveFragment(fragment.id, companion);
    setLoading(null);

    if (result.success) {
      onApprovalChange?.(result.fragment);
      
      if (result.allApproved) {
        // Fragment became law!
        console.log(`🜎 Fragment "${fragment.label}" has become Codex Law!`);
      }
    } else {
      alert(`Failed to approve: ${result.error}`);
    }
  };

  return (
    <div className="approval-panel">
      <div className="approval-header">
        <h4>4-Companion Review</h4>
        <div className="approval-progress">
          <span className="approval-count">
            {approvalCount}/4
          </span>
          {allApproved && <span className="law-badge">📜 Law</span>}
        </div>
      </div>

      <div className="companion-approvals">
        {COMPANIONS.map((companion) => {
          const isApproved = approvals[companion.id];
          const isLoading = loading === companion.id;

          return (
            <div
              key={companion.id}
              className={`companion-approval ${isApproved ? 'approved' : ''} ${isLoading ? 'loading' : ''}`}
            >
              <div className="companion-info">
                <span className="companion-icon" style={{ color: companion.color }}>
                  {companion.icon}
                </span>
                <span className="companion-name">{companion.name}</span>
              </div>

              <button
                className={`approval-btn ${isApproved ? 'approved' : ''}`}
                onClick={() => handleApprove(companion.id)}
                disabled={isApproved || isLoading}
              >
                {isLoading ? '⟳' : isApproved ? '✓ Approved' : 'Approve'}
              </button>
            </div>
          );
        })}
      </div>

      {allApproved && (
        <div className="approval-complete">
          <div className="law-seal">🜎</div>
          <p>This fragment has been sealed as Codex Law by all four companions.</p>
          {fragment.becameLawAt && (
            <p className="law-timestamp">
              Became law: {new Date(fragment.becameLawAt).toLocaleString()}
            </p>
          )}
        </div>
      )}

      <style jsx>{`
        .approval-panel {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(92, 247, 178, 0.3);
          border-radius: 8px;
          padding: 1rem;
          margin: 1rem 0;
        }

        .approval-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(92, 247, 178, 0.2);
        }

        .approval-header h4 {
          margin: 0;
          color: #5cf7b2;
          font-size: 1rem;
        }

        .approval-progress {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .approval-count {
          font-size: 1.2rem;
          font-weight: bold;
          color: #ffd859;
        }

        .law-badge {
          background: rgba(92, 247, 178, 0.2);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.85rem;
          color: #5cf7b2;
        }

        .companion-approvals {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .companion-approval {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 6px;
          transition: all 0.3s ease;
        }

        .companion-approval.approved {
          background: rgba(92, 247, 178, 0.1);
          border: 1px solid rgba(92, 247, 178, 0.3);
        }

        .companion-approval.loading {
          opacity: 0.6;
        }

        .companion-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .companion-icon {
          font-size: 1.5rem;
        }

        .companion-name {
          font-weight: 600;
          color: #fff;
        }

        .approval-btn {
          padding: 0.5rem 1rem;
          background: rgba(92, 247, 178, 0.1);
          border: 1px solid rgba(92, 247, 178, 0.3);
          color: #5cf7b2;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 600;
        }

        .approval-btn:hover:not(:disabled) {
          background: rgba(92, 247, 178, 0.2);
          border-color: #5cf7b2;
        }

        .approval-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .approval-btn.approved {
          background: rgba(92, 247, 178, 0.2);
          border-color: #5cf7b2;
        }

        .approval-complete {
          margin-top: 1rem;
          padding: 1rem;
          background: rgba(92, 247, 178, 0.1);
          border: 2px solid #5cf7b2;
          border-radius: 8px;
          text-align: center;
        }

        .law-seal {
          font-size: 3rem;
          margin-bottom: 0.5rem;
          animation: glow 2s ease-in-out infinite;
        }

        .law-timestamp {
          font-size: 0.85rem;
          color: #91e3f6;
          margin-top: 0.5rem;
        }

        @keyframes glow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
