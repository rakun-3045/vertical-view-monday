// FieldRenderer component - Renders field values based on their type
import React from 'react';
import './FieldRenderer.css';

const FieldRenderer = ({ column, canEdit, isReadOnlyFieldType }) => {
  const renderValue = () => {
    if (!column.value && !column.text) {
      return <span className="field-empty">—</span>;
    }

    try {
      const parsedValue = column.value ? JSON.parse(column.value) : null;

      switch (column.type) {
        case 'status':
          return renderStatus(parsedValue, column.text);
        case 'people':
        case 'multiple-person':
          return renderPeople(parsedValue, column.text);
        case 'date':
          return renderDate(parsedValue, column.text);
        case 'timeline':
          return renderTimeline(parsedValue, column.text);
        case 'tags':
          return renderTags(parsedValue, column.text);
        case 'dropdown':
          return renderDropdown(parsedValue, column.text);
        case 'checkbox':
          return renderCheckbox(parsedValue, column.text);
        case 'rating':
          return renderRating(parsedValue, column.text);
        case 'link':
          return renderLink(parsedValue, column.text);
        case 'email':
          return renderEmail(column.text);
        case 'phone':
          return renderPhone(column.text);
        case 'long-text':
          return renderLongText(column.text);
        case 'numbers':
        case 'numeric':
          return renderNumbers(column.text);
        case 'color':
          return renderColor(parsedValue, column.text);
        case 'progress':
          return renderProgress(parsedValue, column.text);
        case 'formula':
          return renderFormula(column.text);
        case 'auto-number':
          return renderAutoNumber(column.text);
        case 'creation-log':
        case 'last-updated':
          return renderTimestamp(column.text);
        case 'location':
          return renderLocation(parsedValue, column.text);
        case 'country':
          return renderCountry(parsedValue, column.text);
        case 'text':
        default:
          return <span className="field-text">{column.text || '—'}</span>;
      }
    } catch (error) {
      console.error('Error rendering field:', error);
      return <span className="field-text">{column.text || '—'}</span>;
    }
  };

  // Status label with color
  const renderStatus = (value, text) => {
    const label = value?.label || text;
    const color = value?.color || '#c4c4c4';
    return (
      <span 
        className="status-label" 
        style={{ backgroundColor: color, color: getContrastColor(color) }}
      >
        {label || '—'}
      </span>
    );
  };

  // People chips
  const renderPeople = (value, text) => {
    const people = value?.personsAndTeams || [];
    if (people.length === 0) {
      return <span className="field-empty">{text || 'No one assigned'}</span>;
    }
    return (
      <div className="people-chips">
        {people.map((person, idx) => (
          <span key={idx} className="person-chip">
            <span className="person-avatar">{person.name.charAt(0).toUpperCase()}</span>
            <span className="person-name">{person.name}</span>
          </span>
        ))}
      </div>
    );
  };

  // Date display
  const renderDate = (value, text) => {
    const dateStr = value?.date || text;
    if (!dateStr) return <span className="field-empty">No date</span>;
    
    const date = new Date(dateStr);
    const formatted = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    return <span className="date-value">{formatted}</span>;
  };

  // Timeline range
  const renderTimeline = (value, text) => {
    if (!value?.from && !value?.to) {
      return <span className="field-empty">{text || 'No timeline'}</span>;
    }
    const from = value?.from ? new Date(value.from).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '?';
    const to = value?.to ? new Date(value.to).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '?';
    return (
      <span className="timeline-value">
        <span className="timeline-from">{from}</span>
        <span className="timeline-arrow">→</span>
        <span className="timeline-to">{to}</span>
      </span>
    );
  };

  // Tags chips
  const renderTags = (value, text) => {
    const tags = value?.tag_ids || [];
    if (tags.length === 0) {
      return <span className="field-empty">{text || 'No tags'}</span>;
    }
    return (
      <div className="tags-container">
        {tags.map((tag, idx) => (
          <span key={idx} className="tag-chip">
            {typeof tag === 'object' ? tag.name : tag}
          </span>
        ))}
      </div>
    );
  };

  // Dropdown value
  const renderDropdown = (value, text) => {
    const labels = value?.labels || [];
    if (labels.length === 0) {
      return <span className="field-text">{text || '—'}</span>;
    }
    return (
      <div className="dropdown-values">
        {labels.map((label, idx) => (
          <span key={idx} className="dropdown-chip">{label}</span>
        ))}
      </div>
    );
  };

  // Checkbox
  const renderCheckbox = (value, text) => {
    const checked = value?.checked || text === 'true' || text === 'Yes';
    return (
      <span className={`checkbox-display ${checked ? 'checked' : ''}`}>
        {checked ? '✓' : ''}
      </span>
    );
  };

  // Star rating
  const renderRating = (value, text) => {
    const rating = value?.rating || parseInt(text) || 0;
    const maxRating = 5;
    return (
      <div className="rating-display">
        {Array.from({ length: maxRating }, (_, i) => (
          <span key={i} className={`star ${i < rating ? 'filled' : ''}`}>★</span>
        ))}
      </div>
    );
  };

  // Link
  const renderLink = (value, text) => {
    const url = value?.url || text;
    const displayText = value?.text || text || url;
    if (!url) return <span className="field-empty">No link</span>;
    return (
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="link-value"
        onClick={(e) => e.stopPropagation()}
      >
        🔗 {displayText}
      </a>
    );
  };

  // Email
  const renderEmail = (text) => {
    if (!text) return <span className="field-empty">No email</span>;
    return (
      <a 
        href={`mailto:${text}`} 
        className="email-value"
        onClick={(e) => e.stopPropagation()}
      >
        📧 {text}
      </a>
    );
  };

  // Phone
  const renderPhone = (text) => {
    if (!text) return <span className="field-empty">No phone</span>;
    return (
      <a 
        href={`tel:${text}`} 
        className="phone-value"
        onClick={(e) => e.stopPropagation()}
      >
        📞 {text}
      </a>
    );
  };

  // Long text (multiline)
  const renderLongText = (text) => {
    if (!text) return <span className="field-empty">—</span>;
    return (
      <div className="long-text-value">
        {text}
      </div>
    );
  };

  // Numbers
  const renderNumbers = (text) => {
    return <span className="number-value">{text || '0'}</span>;
  };

  // Color swatch
  const renderColor = (value, text) => {
    const color = value?.color || text || '#cccccc';
    return (
      <div className="color-display">
        <span className="color-swatch" style={{ backgroundColor: color }}></span>
        <span className="color-text">{color}</span>
      </div>
    );
  };

  // Progress bar
  const renderProgress = (value, text) => {
    const percentage = value?.percentage || parseInt(text) || 0;
    return (
      <div className="progress-display">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${Math.min(percentage, 100)}%` }}></div>
        </div>
        <span className="progress-text">{percentage}%</span>
      </div>
    );
  };

  // Formula result
  const renderFormula = (text) => {
    return <span className="formula-value">ƒ {text || '—'}</span>;
  };

  // Auto number
  const renderAutoNumber = (text) => {
    return <span className="auto-number-value">{text || '—'}</span>;
  };

  // Timestamp (creation log, last updated)
  const renderTimestamp = (text) => {
    return <span className="timestamp-value">🕐 {text || '—'}</span>;
  };

  // Location
  const renderLocation = (value, text) => {
    const address = value?.address || text;
    return <span className="location-value">📍 {address || '—'}</span>;
  };

  // Country
  const renderCountry = (value, text) => {
    const countryName = value?.countryName || text;
    return <span className="country-value">🌍 {countryName || '—'}</span>;
  };

  // Helper: Get contrasting text color for status background
  const getContrastColor = (hexColor) => {
    if (!hexColor || !hexColor.startsWith('#')) return '#ffffff';
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#323338' : '#ffffff';
  };

  return (
    <div className={`field-renderer ${canEdit && !isReadOnlyFieldType ? 'editable' : 'read-only'}`}>
      {renderValue()}
    </div>
  );
};

export default FieldRenderer;
