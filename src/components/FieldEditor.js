// FieldEditor component - Inline editor for field values
import React, { useState, useEffect, useRef } from 'react';
import './FieldEditor.css';

// Field types that support inline editing
const EDITABLE_TYPES = [
  'text', 'long-text', 'status', 'date', 'people', 'numbers', 
  'dropdown', 'timeline', 'tags', 'link', 'email', 'phone', 
  'checkbox', 'rating', 'color', 'location'
];

const FieldEditor = ({ column, onSave, onCancel, updating }) => {
  const [value, setValue] = useState('');
  const [checked, setChecked] = useState(false);
  const [rating, setRating] = useState(0);
  const inputRef = useRef(null);

  const isEditableType = EDITABLE_TYPES.includes(column.type);

  useEffect(() => {
    // Initialize value based on column type
    try {
      const parsedValue = column.value ? JSON.parse(column.value) : null;
      
      switch (column.type) {
        case 'status':
        case 'dropdown':
          setValue(parsedValue?.label || (parsedValue?.labels && parsedValue.labels[0]) || column.text || '');
          break;
        case 'people':
          const peopleNames = parsedValue?.personsAndTeams?.map(p => p.name).join(', ') || column.text || '';
          setValue(peopleNames);
          break;
        case 'tags':
          const tagNames = parsedValue?.tag_ids?.map(t => typeof t === 'object' ? t.name : t).join(', ') || column.text || '';
          setValue(tagNames);
          break;
        case 'date':
          setValue(parsedValue?.date || column.text || '');
          break;
        case 'checkbox':
          setChecked(parsedValue?.checked || column.text === 'true' || column.text === 'Yes');
          break;
        case 'rating':
          setRating(parsedValue?.rating || parseInt(column.text) || 0);
          break;
        case 'numeric':
        case 'numbers':
          setValue(column.text || '0');
          break;
        case 'color':
          setValue(parsedValue?.color || column.text || '#000000');
          break;
        case 'link':
          setValue(parsedValue?.url || column.text || '');
          break;
        default:
          setValue(column.text || '');
      }
    } catch (error) {
      console.error('Error initializing editor value:', error);
      setValue(column.text || '');
    }

    // Focus input on mount
    setTimeout(() => {
      if (inputRef.current && inputRef.current.focus) {
        inputRef.current.focus();
        if (inputRef.current.select) {
          inputRef.current.select();
        }
      }
    }, 50);
  }, [column]);

  const handleSave = () => {
    if (!isEditableType) return;
    
    let valueToSave = value;
    if (column.type === 'checkbox') {
      valueToSave = checked ? 'Yes' : 'No';
    } else if (column.type === 'rating') {
      valueToSave = String(rating);
    }
    
    onSave(column.id, valueToSave, column.type);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && column.type !== 'long-text') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  const renderEditor = () => {
    if (!isEditableType) {
      return (
        <div className="editor-readonly">
          <span>This field type cannot be edited inline</span>
        </div>
      );
    }

    switch (column.type) {
      case 'long-text':
        return (
          <textarea
            ref={inputRef}
            className="editor-textarea"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Enter ${column.title}...`}
            disabled={updating}
            rows={4}
          />
        );

      case 'numbers':
      case 'numeric':
        return (
          <input
            ref={inputRef}
            type="number"
            className="editor-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter number..."
            disabled={updating}
          />
        );

      case 'date':
        return (
          <input
            ref={inputRef}
            type="date"
            className="editor-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={updating}
          />
        );

      case 'color':
        return (
          <div className="editor-color-wrapper">
            <input
              ref={inputRef}
              type="color"
              className="editor-color"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={updating}
            />
            <input
              type="text"
              className="editor-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="#000000"
              disabled={updating}
            />
          </div>
        );

      case 'checkbox':
        return (
          <label className="editor-checkbox-wrapper">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => {
                setChecked(e.target.checked);
                // Auto-save checkbox changes
                setTimeout(() => onSave(column.id, e.target.checked ? 'Yes' : 'No', column.type), 100);
              }}
              disabled={updating}
            />
            <span className="editor-checkbox-label">{checked ? 'Checked' : 'Unchecked'}</span>
          </label>
        );

      case 'rating':
        return (
          <div className="editor-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`rating-star ${star <= rating ? 'filled' : ''}`}
                onClick={() => {
                  setRating(star);
                  // Auto-save rating changes
                  setTimeout(() => onSave(column.id, String(star), column.type), 100);
                }}
                disabled={updating}
              >
                ★
              </button>
            ))}
          </div>
        );

      case 'status':
      case 'dropdown':
        // Simple dropdown simulation with common options
        const options = getDropdownOptions(column.type);
        return (
          <select
            ref={inputRef}
            className="editor-select"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            disabled={updating}
          >
            <option value="">Select {column.title}...</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );

      case 'email':
        return (
          <input
            ref={inputRef}
            type="email"
            className="editor-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="email@example.com"
            disabled={updating}
          />
        );

      case 'phone':
        return (
          <input
            ref={inputRef}
            type="tel"
            className="editor-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="+1 (555) 000-0000"
            disabled={updating}
          />
        );

      case 'link':
        return (
          <input
            ref={inputRef}
            type="url"
            className="editor-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://..."
            disabled={updating}
          />
        );

      case 'text':
      case 'people':
      case 'tags':
      case 'location':
      default:
        return (
          <input
            ref={inputRef}
            type="text"
            className="editor-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Enter ${column.title}...`}
            disabled={updating}
          />
        );
    }
  };

  // Get dropdown options based on field type
  const getDropdownOptions = (type) => {
    if (type === 'status') {
      return [
        { value: 'Not Started', label: 'Not Started' },
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Stuck', label: 'Stuck' },
        { value: 'Done', label: 'Done' },
        { value: 'Ready for Review', label: 'Ready for Review' },
      ];
    }
    // Generic dropdown options
    return [
      { value: 'High', label: 'High' },
      { value: 'Medium', label: 'Medium' },
      { value: 'Low', label: 'Low' },
      { value: 'None', label: 'None' },
    ];
  };

  const showActionButtons = !['checkbox', 'rating'].includes(column.type) && isEditableType;

  return (
    <div className="field-editor">
      <div className="editor-input-wrapper">
        {renderEditor()}
      </div>
      
      {showActionButtons && (
        <div className="editor-actions">
          <button
            type="button"
            className="editor-btn save"
            onClick={handleSave}
            disabled={updating}
          >
            {updating ? (
              <span className="btn-spinner"></span>
            ) : (
              '✓'
            )}
          </button>
          <button
            type="button"
            className="editor-btn cancel"
            onClick={onCancel}
            disabled={updating}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default FieldEditor;
