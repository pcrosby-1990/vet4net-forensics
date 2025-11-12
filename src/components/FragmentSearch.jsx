// 🔍 Enhanced Fragment Search
// Full-text search with date filtering and tag support

import React, { useState, useEffect } from 'react';
import { searchFragments } from '../utils/fragmentAPI.enhanced';

export default function FragmentSearch({ onResultsChange }) {
  const [query, setQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [hasApprovals, setHasApprovals] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const COMPANIONS = ['patrick', 'vela', 'lumen', 'aletheia'];

  const handleSearch = async () => {
    setLoading(true);
    setSearchPerformed(true);

    const searchParams = {
      q: query,
      dateFrom,
      dateTo,
      hasApprovals: hasApprovals.join(','),
    };

    const result = await searchFragments(searchParams);
    setLoading(false);

    if (result.success) {
      setResults(result.results);
      onResultsChange?.(result.results);
    } else {
      alert(`Search failed: ${result.error}`);
    }
  };

  const handleClear = () => {
    setQuery('');
    setDateFrom('');
    setDateTo('');
    setHasApprovals([]);
    setResults([]);
    setSearchPerformed(false);
    onResultsChange?.([]);
  };

  const toggleApprovalFilter = (companion) => {
    setHasApprovals((prev) =>
      prev.includes(companion)
        ? prev.filter((c) => c !== companion)
        : [...prev, companion]
    );
  };

  return (
    <div className="fragment-search">
      <div className="search-panel">
        <h4>🔍 Search Fragments</h4>

        <div className="search-field">
          <input
            type="text"
            placeholder="Search testimony, law, protocol, or label..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        <div className="search-filters">
          <div className="filter-group">
            <label>Date Range</label>
            <div className="date-inputs">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                placeholder="From"
              />
              <span>to</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                placeholder="To"
              />
            </div>
          </div>

          <div className="filter-group">
            <label>Approved By</label>
            <div className="approval-filters">
              {COMPANIONS.map((companion) => (
                <button
                  key={companion}
                  className={`approval-filter ${
                    hasApprovals.includes(companion) ? 'active' : ''
                  }`}
                  onClick={() => toggleApprovalFilter(companion)}
                >
                  {companion}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="search-actions">
          <button
            className="search-btn"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? '⟳ Searching...' : 'Search'}
          </button>
          <button className="clear-btn" onClick={handleClear}>
            Clear
          </button>
        </div>
      </div>

      {searchPerformed && (
        <div className="search-results">
          <div className="results-header">
            <h5>
              {results.length} {results.length === 1 ? 'Result' : 'Results'}
            </h5>
          </div>

          {results.length === 0 && (
            <div className="no-results">
              <p>No fragments found matching your search criteria.</p>
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .fragment-search {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 216, 89, 0.3);
          border-radius: 8px;
          padding: 1rem;
          margin: 1rem 0;
        }

        .search-panel h4 {
          margin: 0 0 1rem 0;
          color: #ffd859;
          font-size: 1rem;
        }

        .search-field input {
          width: 100%;
          padding: 0.75rem;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(92, 247, 178, 0.3);
          border-radius: 6px;
          color: #fff;
          font-size: 1rem;
          font-family: inherit;
        }

        .search-field input:focus {
          outline: none;
          border-color: #5cf7b2;
        }

        .search-filters {
          margin: 1rem 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .filter-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #5cf7b2;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .date-inputs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .date-inputs input {
          flex: 1;
          padding: 0.5rem;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(92, 247, 178, 0.3);
          border-radius: 4px;
          color: #fff;
          font-family: inherit;
        }

        .date-inputs span {
          color: rgba(255, 255, 255, 0.5);
        }

        .approval-filters {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .approval-filter {
          padding: 0.5rem 1rem;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(92, 247, 178, 0.3);
          color: #fff;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.85rem;
          text-transform: capitalize;
          transition: all 0.2s ease;
        }

        .approval-filter:hover {
          background: rgba(92, 247, 178, 0.1);
        }

        .approval-filter.active {
          background: rgba(92, 247, 178, 0.2);
          border-color: #5cf7b2;
          color: #5cf7b2;
          font-weight: 600;
        }

        .search-actions {
          display: flex;
          gap: 0.5rem;
        }

        .search-btn,
        .clear-btn {
          flex: 1;
          padding: 0.75rem;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .search-btn {
          background: rgba(92, 247, 178, 0.1);
          border: 1px solid #5cf7b2;
          color: #5cf7b2;
        }

        .search-btn:hover:not(:disabled) {
          background: rgba(92, 247, 178, 0.2);
        }

        .search-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .clear-btn {
          background: rgba(207, 70, 70, 0.1);
          border: 1px solid rgba(207, 70, 70, 0.3);
          color: #cf4646;
        }

        .clear-btn:hover {
          background: rgba(207, 70, 70, 0.2);
          border-color: #cf4646;
        }

        .search-results {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 216, 89, 0.3);
        }

        .results-header h5 {
          margin: 0 0 1rem 0;
          color: #ffd859;
        }

        .no-results {
          text-align: center;
          padding: 2rem;
          color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
