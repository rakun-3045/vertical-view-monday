// Custom hook for updating field values
import { useState, useCallback } from 'react';
import mondaySdk from 'monday-sdk-js';
import { CHANGE_COLUMN_VALUE_MUTATION } from '../services/graphql';

const monday = mondaySdk();

export const useFieldUpdate = (boardId, itemId, onSuccess, onError) => {
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  const updateField = useCallback(async (columnId, value, columnType) => {
    if (!boardId || !itemId || !columnId) {
      const error = 'Missing required parameters for field update';
      setUpdateError(error);
      if (onError) onError(error);
      return { success: false, error };
    }

    setUpdating(true);
    setUpdateError(null);

    try {
      // Format value based on column type
      const formattedValue = formatValueForMutation(value, columnType);

      // Show loading notice
      monday.execute('notice', {
        message: 'Saving...',
        type: 'info',
        timeout: 2000
      });

      // Execute mutation
      const response = await monday.api(CHANGE_COLUMN_VALUE_MUTATION, {
        variables: {
          boardId: parseInt(boardId),
          itemId: parseInt(itemId),
          columnId: columnId,
          value: formattedValue
        }
      });

      if (response.data?.change_column_value) {
        // Show success notice
        monday.execute('notice', {
          message: 'Saved successfully!',
          type: 'success',
          timeout: 2000
        });

        if (onSuccess) {
          onSuccess(columnId, value);
        }

        setUpdating(false);
        return { success: true };
      } else {
        throw new Error('Failed to update field');
      }
    } catch (err) {
      console.error('Error updating field:', err);
      const errorMessage = err.message || 'Failed to save changes';
      setUpdateError(errorMessage);

      // Show error notice
      monday.execute('notice', {
        message: errorMessage,
        type: 'error',
        timeout: 3000
      });

      if (onError) {
        onError(errorMessage);
      }

      setUpdating(false);
      return { success: false, error: errorMessage };
    }
  }, [boardId, itemId, onSuccess, onError]);

  return {
    updateField,
    updating,
    updateError
  };
};

/**
 * Format value for GraphQL mutation based on column type
 * @param {*} value - The value to format
 * @param {string} columnType - The column type
 * @returns {string} JSON stringified value
 */
const formatValueForMutation = (value, columnType) => {
  switch (columnType) {
    case 'text':
    case 'long-text':
    case 'email':
    case 'phone':
    case 'link':
      return JSON.stringify(value);

    case 'numeric':
    case 'numbers':
      return JSON.stringify(value.toString());

    case 'status':
      return JSON.stringify({ label: value });

    case 'dropdown':
      return JSON.stringify({ labels: Array.isArray(value) ? value : [value] });

    case 'date':
      return JSON.stringify({ date: value });

    case 'timeline':
      return JSON.stringify({ 
        from: value.from, 
        to: value.to 
      });

    case 'people':
    case 'multiple-person':
      return JSON.stringify({ 
        personsAndTeams: Array.isArray(value) ? value.map(id => ({ id, kind: 'person' })) : [] 
      });

    case 'tags':
      return JSON.stringify({ 
        tag_ids: Array.isArray(value) ? value : [] 
      });

    case 'checkbox':
      return JSON.stringify({ checked: value === true || value === 'true' });

    case 'rating':
      return JSON.stringify({ rating: parseInt(value) || 0 });

    case 'location':
      return JSON.stringify({
        lat: value.lat,
        lng: value.lng,
        address: value.address
      });

    default:
      // For unknown types, try to stringify as-is
      return typeof value === 'string' ? value : JSON.stringify(value);
  }
};

export default useFieldUpdate;
