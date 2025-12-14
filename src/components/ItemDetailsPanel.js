// ItemDetailsPanel component - Main panel displaying all fields in a vertical view
import React, { useState, useEffect, useCallback } from 'react';
import mondaySdk from 'monday-sdk-js';
import useItemData from '../hooks/useItemData';
import ActionBar from './ActionBar';
import FieldRow from './FieldRow';
import LoadingSkeleton from './LoadingSkeleton';
import './ItemDetailsPanel.css';

const monday = mondaySdk();
const PANEL_ID = 'item-details-panel-content';
const AUTO_REFRESH_INTERVAL = 30000; // 30 seconds

// Comprehensive demo data simulating a real project management board with 35+ columns
const getDemoItemData = () => ({
  id: 'demo-item-001',
  name: 'Website Redesign Project - Phase 2',
  board: { id: 'board-001', name: 'Enterprise Projects 2024' },
  column_values: [
    // Basic Information
    { id: 'name', title: 'Task Name', type: 'text', text: 'Website Redesign Project - Phase 2', value: null, category: 'Basic Info' },
    { id: 'status', title: 'Status', type: 'status', text: 'In Progress', value: JSON.stringify({ label: 'In Progress', color: '#fdab3d' }), category: 'Basic Info' },
    { id: 'priority', title: 'Priority', type: 'status', text: 'High', value: JSON.stringify({ label: 'High', color: '#e2445c' }), category: 'Basic Info' },
    { id: 'item_id', title: 'Item ID', type: 'auto-number', text: 'PRJ-2024-0847', value: null, category: 'Basic Info' },
    
    // People & Ownership
    { id: 'owner', title: 'Project Owner', type: 'people', text: 'Sarah Chen', value: JSON.stringify({ personsAndTeams: [{ id: '101', name: 'Sarah Chen', kind: 'person' }] }), category: 'People' },
    { id: 'assigned_to', title: 'Assigned Team', type: 'people', text: 'John Doe, Emily Wilson, Mike Ross', value: JSON.stringify({ personsAndTeams: [{ id: '102', name: 'John Doe', kind: 'person' }, { id: '103', name: 'Emily Wilson', kind: 'person' }, { id: '104', name: 'Mike Ross', kind: 'person' }] }), category: 'People' },
    { id: 'stakeholder', title: 'Stakeholder', type: 'people', text: 'David Miller', value: JSON.stringify({ personsAndTeams: [{ id: '105', name: 'David Miller', kind: 'person' }] }), category: 'People' },
    { id: 'qa_lead', title: 'QA Lead', type: 'people', text: 'Lisa Park', value: JSON.stringify({ personsAndTeams: [{ id: '106', name: 'Lisa Park', kind: 'person' }] }), category: 'People' },
    
    // Dates & Timeline
    { id: 'start_date', title: 'Start Date', type: 'date', text: '2024-12-01', value: JSON.stringify({ date: '2024-12-01' }), category: 'Timeline' },
    { id: 'due_date', title: 'Due Date', type: 'date', text: '2025-02-28', value: JSON.stringify({ date: '2025-02-28' }), category: 'Timeline' },
    { id: 'timeline', title: 'Project Timeline', type: 'timeline', text: 'Dec 1, 2024 → Feb 28, 2025', value: JSON.stringify({ from: '2024-12-01', to: '2025-02-28' }), category: 'Timeline' },
    { id: 'milestone_date', title: 'Next Milestone', type: 'date', text: '2025-01-15', value: JSON.stringify({ date: '2025-01-15' }), category: 'Timeline' },
    { id: 'created_at', title: 'Created Date', type: 'creation-log', text: 'Nov 15, 2024 by Sarah Chen', value: null, category: 'Timeline' },
    { id: 'last_updated', title: 'Last Updated', type: 'last-updated', text: 'Dec 9, 2024 at 2:45 PM', value: null, category: 'Timeline' },
    
    // Budget & Finance
    { id: 'budget', title: 'Budget', type: 'numbers', text: '$125,000', value: JSON.stringify({ value: 125000 }), category: 'Finance' },
    { id: 'spent', title: 'Amount Spent', type: 'numbers', text: '$47,500', value: JSON.stringify({ value: 47500 }), category: 'Finance' },
    { id: 'remaining', title: 'Budget Remaining', type: 'formula', text: '$77,500', value: null, category: 'Finance' },
    { id: 'hourly_rate', title: 'Avg. Hourly Rate', type: 'numbers', text: '$150', value: JSON.stringify({ value: 150 }), category: 'Finance' },
    { id: 'estimated_hours', title: 'Estimated Hours', type: 'numbers', text: '840', value: JSON.stringify({ value: 840 }), category: 'Finance' },
    { id: 'actual_hours', title: 'Actual Hours Logged', type: 'numbers', text: '312', value: JSON.stringify({ value: 312 }), category: 'Finance' },
    
    // Progress & Tracking
    { id: 'progress', title: 'Progress', type: 'progress', text: '38%', value: JSON.stringify({ percentage: 38 }), category: 'Progress' },
    { id: 'phase', title: 'Current Phase', type: 'status', text: 'Design', value: JSON.stringify({ label: 'Design', color: '#9d50dd' }), category: 'Progress' },
    { id: 'sprint', title: 'Sprint', type: 'dropdown', text: 'Sprint 4', value: JSON.stringify({ labels: ['Sprint 4'] }), category: 'Progress' },
    { id: 'story_points', title: 'Story Points', type: 'numbers', text: '21', value: JSON.stringify({ value: 21 }), category: 'Progress' },
    { id: 'completed_tasks', title: 'Completed Tasks', type: 'formula', text: '24 of 63', value: null, category: 'Progress' },
    
    // Client & Contact Info
    { id: 'client_name', title: 'Client Name', type: 'text', text: 'Acme Corporation', value: null, category: 'Client' },
    { id: 'client_contact', title: 'Client Contact', type: 'text', text: 'Jennifer Adams', value: null, category: 'Client' },
    { id: 'client_email', title: 'Client Email', type: 'email', text: 'jadams@acmecorp.com', value: JSON.stringify({ email: 'jadams@acmecorp.com', text: 'jadams@acmecorp.com' }), category: 'Client' },
    { id: 'client_phone', title: 'Client Phone', type: 'phone', text: '+1 (555) 234-5678', value: JSON.stringify({ phone: '+15552345678', countryShortName: 'US' }), category: 'Client' },
    { id: 'account_manager', title: 'Account Manager', type: 'people', text: 'Rachel Green', value: JSON.stringify({ personsAndTeams: [{ id: '107', name: 'Rachel Green', kind: 'person' }] }), category: 'Client' },
    
    // Documentation & Links
    { id: 'project_brief', title: 'Project Brief', type: 'link', text: 'View Document', value: JSON.stringify({ url: 'https://docs.google.com/document/d/project-brief', text: 'View Document' }), category: 'Links' },
    { id: 'figma_designs', title: 'Figma Designs', type: 'link', text: 'Open in Figma', value: JSON.stringify({ url: 'https://figma.com/file/xyz123', text: 'Open in Figma' }), category: 'Links' },
    { id: 'github_repo', title: 'GitHub Repository', type: 'link', text: 'View Repository', value: JSON.stringify({ url: 'https://github.com/acme/website-redesign', text: 'View Repository' }), category: 'Links' },
    { id: 'staging_url', title: 'Staging URL', type: 'link', text: 'https://staging.acmecorp.com', value: JSON.stringify({ url: 'https://staging.acmecorp.com', text: 'https://staging.acmecorp.com' }), category: 'Links' },
    { id: 'prod_url', title: 'Production URL', type: 'link', text: 'https://www.acmecorp.com', value: JSON.stringify({ url: 'https://www.acmecorp.com', text: 'https://www.acmecorp.com' }), category: 'Links' },
    
    // Tags & Categories
    { id: 'tags', title: 'Tags', type: 'tags', text: 'Frontend, UX, High-Priority, Q1-2025', value: JSON.stringify({ tag_ids: [{ id: 1, name: 'Frontend' }, { id: 2, name: 'UX' }, { id: 3, name: 'High-Priority' }, { id: 4, name: 'Q1-2025' }] }), category: 'Categories' },
    { id: 'department', title: 'Department', type: 'dropdown', text: 'Product Development', value: JSON.stringify({ labels: ['Product Development'] }), category: 'Categories' },
    { id: 'project_type', title: 'Project Type', type: 'dropdown', text: 'Client Work', value: JSON.stringify({ labels: ['Client Work'] }), category: 'Categories' },
    { id: 'complexity', title: 'Complexity', type: 'status', text: 'Complex', value: JSON.stringify({ label: 'Complex', color: '#bb3354' }), category: 'Categories' },
    
    // Description & Notes
    { id: 'description', title: 'Description', type: 'long-text', text: 'Complete redesign of Acme Corporation\'s corporate website including new information architecture, responsive design implementation, CMS migration to headless architecture, and performance optimization. The project includes stakeholder interviews, competitive analysis, wireframing, visual design, development, QA testing, and deployment phases.', value: null, category: 'Details' },
    { id: 'notes', title: 'Internal Notes', type: 'long-text', text: 'Client has requested weekly status calls every Tuesday at 10 AM EST. Key decision maker is the VP of Marketing. Budget approval pending for additional animation work.', value: null, category: 'Details' },
    { id: 'risk_notes', title: 'Risk Assessment', type: 'long-text', text: 'Medium risk due to tight timeline. Dependencies on third-party API integration may cause delays. Mitigation: Started API integration work early in sprint 3.', value: null, category: 'Details' },
    
    // Additional Fields
    { id: 'rating', title: 'Client Satisfaction', type: 'rating', text: '4', value: JSON.stringify({ rating: 4 }), category: 'Metrics' },
    { id: 'billable', title: 'Billable', type: 'checkbox', text: 'Yes', value: JSON.stringify({ checked: true }), category: 'Metrics' },
    { id: 'contract_signed', title: 'Contract Signed', type: 'checkbox', text: 'Yes', value: JSON.stringify({ checked: true }), category: 'Metrics' },
    { id: 'nda_signed', title: 'NDA Signed', type: 'checkbox', text: 'Yes', value: JSON.stringify({ checked: true }), category: 'Metrics' },
    { id: 'color_code', title: 'Color Code', type: 'color', text: '#6161FF', value: JSON.stringify({ color: '#6161FF' }), category: 'Metrics' },
    { id: 'location', title: 'Office Location', type: 'location', text: 'New York, NY', value: JSON.stringify({ lat: 40.7128, lng: -74.0060, address: 'New York, NY' }), category: 'Metrics' },
    { id: 'country', title: 'Country', type: 'country', text: 'United States', value: JSON.stringify({ countryCode: 'US', countryName: 'United States' }), category: 'Metrics' },
  ]
});

const ItemDetailsPanel = () => {
  const [bgColor, setBgColor] = useState('#ffffff');
  const [fontColor, setFontColor] = useState('#323338');
  
  const { itemData: realItemData, loading: realLoading, fetchItemData, context } = useItemData();
  const [demoData, setDemoData] = useState(null);
  
  const itemData = realItemData || demoData;
  const loading = (context ? realLoading : !demoData);

  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'positive' });
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [canEdit, setCanEdit] = useState(true); // Demo mode: edit enabled
  const [viewMode, setViewMode] = useState('horizontal'); // Default to horizontal view (problem state)

  const handleToggleView = () => {
    setViewMode(prev => prev === 'horizontal' ? 'vertical' : 'horizontal');
  };

  // Theme handling
  useEffect(() => {
    const fetchContext = async () => {
      try {
        const res = await monday.get('context');
        if (res.data) {
          updateTheme(res.data?.theme || 'light');
        }
      } catch (error) {
        console.warn('Running in demo mode (no monday context)');
        setBgColor('#ffffff');
        setFontColor('#323338');
      }
    };
    fetchContext();
  }, []);

  const updateTheme = (theme) => {
    switch (theme) {
      case 'light':
        setBgColor('#ffffff');
        setFontColor('#323338');
        break;
      case 'dark':
        setBgColor('#1c1f3b');
        setFontColor('#f5f6f8');
        break;
      case 'black':
        setBgColor('#111111');
        setFontColor('#ffffff');
        break;
      default:
        setBgColor('#ffffff');
        setFontColor('#323338');
    }
  };

  // Toast helper
  const showToast = useCallback((message, type = 'positive') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  }, []);

  // Refresh handler
  const handleRefresh = useCallback((silent = false) => {
    if (!silent) {
      setRefreshing(true);
    }
    
    if (context) {
        fetchItemData().then(() => {
            setLastRefresh(new Date());
            setRefreshing(false);
            if (!silent) {
                showToast('Data refreshed successfully', 'positive');
            }
        });
    } else {
        setTimeout(() => {
            setDemoData(getDemoItemData());
            setLastRefresh(new Date());
            setRefreshing(false);
            
            if (!silent) {
                showToast('Data refreshed successfully', 'positive');
            }
        }, 800);
    }
  }, [showToast, context, fetchItemData]);

  // Load demo data if no context
  useEffect(() => {
    if (!context && !realLoading && !realItemData) {
        setDemoData(getDemoItemData());
    }
  }, [context, realLoading, realItemData]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleRefresh(true);
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, [handleRefresh]);

  // Search handler - triggers browser native search
  const handleSearch = () => {
    if (window.find) {
      window.find();
    } else {
      // Fallback for browsers that don't support window.find
      const searchInput = prompt('Search for:');
      if (searchInput) {
        setSearchQuery(searchInput.toLowerCase());
      }
    }
  };

  // Update field handler
  const handleFieldUpdate = async (columnId, value, columnType) => {
    showToast('Saving changes...', 'normal');
    
    if (context) {
        try {
            let formattedValue = value;
            
            // Format value based on column type for monday.com API
            switch (columnType) {
                case 'status':
                case 'dropdown':
                    formattedValue = { label: value };
                    break;
                case 'date':
                    formattedValue = { date: value };
                    break;
                case 'checkbox':
                    formattedValue = { checked: value === 'Yes' || value === true };
                    break;
                case 'rating':
                    formattedValue = { rating: parseInt(value) };
                    break;
                case 'numbers':
                case 'numeric':
                    formattedValue = value; 
                    break;
                case 'text':
                case 'long-text':
                case 'name':
                    formattedValue = value; 
                    break;
                case 'email':
                    formattedValue = { email: value, text: value };
                    break;
                case 'link':
                    formattedValue = { url: value, text: value };
                    break;
                default:
                    formattedValue = value;
            }

            const mutation = `mutation ($itemId: Int!, $boardId: Int!, $columnId: String!, $value: JSON!) {
                change_column_value (item_id: $itemId, board_id: $boardId, column_id: $columnId, value: $value) {
                    id
                }
            }`;
            
            const valueStr = JSON.stringify(formattedValue);
            
            await monday.api(mutation, { 
                itemId: parseInt(itemData.id), 
                boardId: parseInt(itemData.board.id), 
                columnId, 
                value: valueStr 
            });
            
            showToast('Changes saved successfully!', 'positive');
            fetchItemData(); 
            return { success: true };
            
        } catch (e) {
            console.error(e);
            showToast('Error saving changes', 'negative');
            return { success: false };
        }
    } else {
        // Simulate API call
        return new Promise((resolve) => {
          setTimeout(() => {
            // Update local state
            setDemoData(prev => ({
              ...prev,
              column_values: prev.column_values.map(col => 
                col.id === columnId 
                  ? { ...col, text: String(value) }
                  : col
              )
            }));
            
            showToast('Changes saved successfully!', 'positive');
            resolve({ success: true });
          }, 1000);
        });
    }
  };

  // Filter columns by search query
  const getFilteredColumns = () => {
    if (!itemData?.column_values) return [];
    if (!searchQuery) return itemData.column_values;
    
    return itemData.column_values.filter(col => 
      col.title.toLowerCase().includes(searchQuery) ||
      (col.text && col.text.toLowerCase().includes(searchQuery))
    );
  };

  // Group columns by category
  const getGroupedColumns = () => {
    const columns = getFilteredColumns();
    const grouped = {};
    
    columns.forEach(col => {
      const category = col.category || 'Other';
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(col);
    });
    
    return grouped;
  };

  // Render loading state
  if (loading) {
    return (
      <div className="item-details-panel loading" style={{ backgroundColor: bgColor, color: fontColor }}>
        <LoadingSkeleton />
      </div>
    );
  }

  const groupedColumns = getGroupedColumns();

  return (
    <div 
      className="item-details-panel" 
      style={{ backgroundColor: bgColor, color: fontColor }}
    >
      {/* Action Bar */}
      <ActionBar
        onRefresh={() => handleRefresh(false)}
        onSearch={handleSearch}
        itemData={itemData}
        elementId={PANEL_ID}
        loading={refreshing}
        lastRefresh={lastRefresh}
        canEdit={canEdit}
        viewMode={viewMode}
        onToggleView={handleToggleView}
      />

      {/* Demo Mode Banner */}
      <div className="demo-banner">
        <div className="demo-banner-content">
          <span className="demo-icon">{viewMode === 'horizontal' ? '📋' : '✅'}</span>
          <div className="demo-text">
            <span className="demo-title">
              {viewMode === 'horizontal' 
                ? 'Demo Mode: Showing "Horizontal Scroll" problem (Standard View)' 
                : 'Demo Mode: Showing "Item Vertical View" solution'}
            </span>
            <span className="demo-subtitle">
              {viewMode === 'horizontal'
                ? 'Notice how you have to scroll sideways to see all fields.'
                : `This panel displays ${itemData?.column_values?.length || 0} fields in a scrollable vertical view • Auto-refreshes every 30s`}
            </span>
          </div>
        </div>
      </div>

      {/* Permissions Banner */}
      {!canEdit && (
        <div className="permissions-banner">
          <span>👁️ View Only Mode - You don't have permission to edit this item</span>
        </div>
      )}

      {/* Search Results Info */}
      {searchQuery && (
        <div className="search-results-banner">
          <span>Showing {getFilteredColumns().length} results for "{searchQuery}"</span>
          <button className="clear-search" onClick={() => setSearchQuery('')}>
            Clear
          </button>
        </div>
      )}

      {/* Fields Container - Grouped by Category */}
      <div id={PANEL_ID} className={`fields-container ${viewMode === 'horizontal' ? 'horizontal-view' : ''}`}>
        {Object.entries(groupedColumns).map(([category, columns]) => (
          <div key={category} className="field-category">
            <div className="category-header">
              <span className="category-title">{category}</span>
              <span className="category-count">{columns.length} fields</span>
            </div>
            <div className="category-fields">
              {columns.map((column) => (
                <FieldRow
                  key={column.id}
                  column={column}
                  canEdit={canEdit}
                  onUpdate={handleFieldUpdate}
                  updating={false}
                  fontColor={fontColor}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer with stats */}
      <div className="panel-footer">
        <span className="footer-text">
          Total Fields: {itemData?.column_values?.length || 0} • 
          Last Refresh: {lastRefresh.toLocaleTimeString()} • 
          {canEdit ? '✏️ Edit Mode' : '👁️ View Only'}
        </span>
      </div>

      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.message}
        </div>
      )}

      {/* Refreshing Indicator */}
      {refreshing && (
        <div className="refresh-indicator">
          <div className="spinner"></div>
          <span>Refreshing...</span>
        </div>
      )}
    </div>
  );
};

export default ItemDetailsPanel;
