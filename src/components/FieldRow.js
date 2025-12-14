// FieldRow component - Individual row displaying a field name and value
import React, { useState } from 'react';
import FieldRenderer from './FieldRenderer';
import FieldEditor from './FieldEditor';
import './FieldRow.css';

// Read-only field types that cannot be edited
const READ_ONLY_TYPES = [
  'formula', 
  'auto-number', 
  'progress', 
  'creation-log', 
  'last-updated', 
  'file',
  'dependency',
  'mirror',
  'board-relation'
];

const FieldRow = ({ column, canEdit, onUpdate, updating, fontColor }) => {
  const [isEditing, setIsEditing] = useState(false);

  const isReadOnlyFieldType = READ_ONLY_TYPES.includes(column.type);
  const effectiveCanEdit = canEdit && !isReadOnlyFieldType;

  const handleClick = () => {
    if (effectiveCanEdit && !isEditing) {
      setIsEditing(true);
    }
  };

  const handleSave = async (columnId, value, columnType) => {
    const result = await onUpdate(columnId, value, columnType);
    if (result && result.success) {
      setIsEditing(false);
    }
    return result;
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  // Get type icon
  const getTypeIcon = () => {
    const iconMap = {
      'text': '📝',
      'long-text': '📄',
      'numbers': '🔢',
      'status': '🔵',
      'date': '📅',
      'timeline': '📊',
      'people': '👤',
      'dropdown': '📋',
      'checkbox': '☑️',
      'rating': '⭐',
      'link': '🔗',
      'email': '📧',
      'phone': '📞',
      'tags': '🏷️',
      'formula': '🧮',
      'auto-number': '#️⃣',
      'progress': '📈',
      'creation-log': '📝',
      'last-updated': '🕐',
      'file': '📎',
      'color': '🎨',
      'location': '📍',
      'country': '🌍'
    };
    return iconMap[column.type] || '📋';
  };

  return (
    <div 
      className={`field-row ${effectiveCanEdit && !isEditing ? 'editable' : ''} ${isEditing ? 'editing' : ''}`}
      onClick={!isEditing && effectiveCanEdit ? handleClick : undefined}
    >
      <div className="field-label">
        <span className="field-type-icon" title={column.type}>
          {getTypeIcon()}
        </span>
        <div className="field-label-text">
          <span className="field-title">{column.title}</span>
          <span className="field-type-name">{column.type}</span>
        </div>
        {isReadOnlyFieldType && (
          <span className="read-only-badge" title="This field is read-only">
            🔒
          </span>
        )}
      </div>
      
      <div className="field-content">
        {isEditing ? (
          <FieldEditor
            column={column}
            onSave={handleSave}
            onCancel={handleCancel}
            updating={updating}
          />
        ) : (
          <FieldRenderer
            column={column}
            canEdit={effectiveCanEdit}
            isReadOnlyFieldType={isReadOnlyFieldType}
          />
        )}
        
        {effectiveCanEdit && !isEditing && (
          <span className="edit-hint" title="Click to edit">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </span>
        )}
      </div>
    </div>
  );
};

export default FieldRow;
