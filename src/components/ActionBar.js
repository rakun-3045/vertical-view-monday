// ActionBar component - Top bar with actions like refresh, search, and export
import React from 'react';
import { exportToCSV, exportToPDF } from '../services/exportService';
import './ActionBar.css';

const ActionBar = ({ onRefresh, onSearch, itemData, elementId, loading, lastRefresh, canEdit, viewMode, onToggleView }) => {
  const handleExportCSV = async () => {
    if (!itemData?.column_values) return;
    
    try {
      const result = await exportToCSV(itemData.column_values, itemData.name);
      if (result.success) {
        console.log('CSV exported successfully');
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleExportPDF = async () => {
    if (!elementId) return;
    
    try {
      const result = await exportToPDF(elementId, itemData?.name || 'item');
      if (result.success) {
        console.log('PDF exported successfully');
      }
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const formatLastRefreshTime = (date) => {
    if (!date) return '';
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="action-bar">
      <div className="action-bar-left">
        <h1 className="item-name">{itemData?.name || 'Item Details'}</h1>
        <div className="item-meta">
          <span className="board-name">📋 {itemData?.board?.name || 'Board'}</span>
          {lastRefresh && (
            <span className="last-refresh">
              🔄 {formatLastRefreshTime(lastRefresh)}
            </span>
          )}
        </div>
      </div>
      
      <div className="action-bar-right">
        {/* Toggle View Button */}
        <button 
          className="action-btn"
          onClick={onToggleView}
          title={viewMode === 'horizontal' ? "Switch to Vertical View" : "Switch to Horizontal View"}
        >
          <span>{viewMode === 'horizontal' ? '↔️ Toggle View' : '↕️ Toggle View'}</span>
        </button>

        {/* Refresh Button */}
        <button 
          className={`action-btn ${loading ? 'loading' : ''}`}
          onClick={onRefresh}
          disabled={loading}
          title="Refresh data (Auto-refreshes every 30s)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6"></path>
            <path d="M1 20v-6h6"></path>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
          </svg>
          <span>Refresh</span>
        </button>

        {/* Search Button */}
        <button 
          className="action-btn"
          onClick={onSearch}
          title="Search fields (Ctrl/Cmd + F)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <span>Search</span>
        </button>

        {/* Export Dropdown */}
        <div className="export-dropdown">
          <button className="action-btn export-trigger">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Export</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dropdown-arrow">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <div className="export-menu">
            <button className="export-item" onClick={handleExportCSV}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              Export to CSV
            </button>
            <button className="export-item" onClick={handleExportPDF}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
              Export to PDF
            </button>
          </div>
        </div>

        {/* Edit Mode Indicator */}
        {canEdit && (
          <span className="edit-mode-badge">
            ✏️ Edit Mode
          </span>
        )}
      </div>
    </div>
  );
};

export default ActionBar;
