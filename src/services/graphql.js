// GraphQL queries and mutations for monday.com API

/**
 * Get user permissions query
 */
export const GET_USER_PERMISSIONS = `
  query {
    me {
      id
      name
      email
      is_guest
      is_view_only
    }
  }
`;

/**
 * Get item details with all column values
 * @param {string} itemId - The item ID
 */
export const GET_ITEM_DETAILS = `
  query GetItemDetails($itemId: ID!) {
    items(ids: [$itemId]) {
      id
      name
      board {
        id
        name
      }
      column_values {
        id
        title
        type
        text
        value
      }
    }
  }
`;

/**
 * Get board columns metadata
 * @param {string} boardId - The board ID
 */
export const GET_BOARD_COLUMNS = `
  query GetBoardColumns($boardId: ID!) {
    boards(ids: [$boardId]) {
      id
      name
      columns {
        id
        title
        type
        settings_str
      }
    }
  }
`;

/**
 * Change column value mutation
 */
export const CHANGE_COLUMN_VALUE = `
  mutation ChangeColumnValue($boardId: ID!, $itemId: ID!, $columnId: String!, $value: JSON!) {
    change_column_value(
      board_id: $boardId,
      item_id: $itemId,
      column_id: $columnId,
      value: $value
    ) {
      id
      column_values {
        id
        text
        value
      }
    }
  }
`;

/**
 * Change simple column value mutation (for text-based columns)
 */
export const CHANGE_SIMPLE_COLUMN_VALUE = `
  mutation ChangeSimpleColumnValue($boardId: ID!, $itemId: ID!, $columnId: String!, $value: String!) {
    change_simple_column_value(
      board_id: $boardId,
      item_id: $itemId,
      column_id: $columnId,
      value: $value
    ) {
      id
      column_values {
        id
        text
        value
      }
    }
  }
`;

/**
 * Get status column settings (for dropdown options)
 */
export const GET_STATUS_COLUMN_SETTINGS = `
  query GetStatusColumnSettings($boardId: ID!, $columnId: String!) {
    boards(ids: [$boardId]) {
      columns(ids: [$columnId]) {
        id
        title
        settings_str
      }
    }
  }
`;

/**
 * Helper function to build column value JSON for different column types
 * @param {string} columnType - The column type
 * @param {any} value - The value to set
 * @returns {string} - JSON string for the mutation
 */
export const buildColumnValue = (columnType, value) => {
  switch (columnType) {
    case 'status':
      return JSON.stringify({ label: value });
    
    case 'date':
      return JSON.stringify({ date: value });
    
    case 'numbers':
    case 'numeric':
      return JSON.stringify(value.toString());
    
    case 'text':
      return JSON.stringify(value);
    
    case 'long-text':
      return JSON.stringify({ text: value });
    
    case 'checkbox':
      return JSON.stringify({ checked: value ? 'true' : 'false' });
    
    case 'email':
      return JSON.stringify({ email: value, text: value });
    
    case 'phone':
      return JSON.stringify({ phone: value, countryShortName: '' });
    
    case 'link':
      return JSON.stringify({ url: value, text: value });
    
    case 'dropdown':
      return JSON.stringify({ labels: Array.isArray(value) ? value : [value] });
    
    case 'people':
      return JSON.stringify({ 
        personsAndTeams: Array.isArray(value) 
          ? value.map(id => ({ id, kind: 'person' }))
          : [{ id: value, kind: 'person' }]
      });
    
    case 'timeline':
      return JSON.stringify({ 
        from: value.from, 
        to: value.to 
      });
    
    case 'tags':
      return JSON.stringify({ 
        tag_ids: Array.isArray(value) ? value : [value] 
      });
    
    case 'rating':
      return JSON.stringify({ rating: parseInt(value) });
    
    case 'color':
      return JSON.stringify({ color: value });
    
    default:
      return JSON.stringify(value);
  }
};

/**
 * Helper function to parse column value from API response
 * @param {string} columnType - The column type
 * @param {string} valueJson - The JSON value string from API
 * @returns {any} - Parsed value
 */
export const parseColumnValue = (columnType, valueJson) => {
  if (!valueJson) return null;
  
  try {
    const parsed = JSON.parse(valueJson);
    
    switch (columnType) {
      case 'status':
        return parsed.label;
      
      case 'date':
        return parsed.date;
      
      case 'numbers':
      case 'numeric':
        return parsed;
      
      case 'checkbox':
        return parsed.checked === 'true' || parsed.checked === true;
      
      case 'people':
        return parsed.personsAndTeams?.map(p => p.name).join(', ');
      
      case 'timeline':
        return `${parsed.from} - ${parsed.to}`;
      
      case 'dropdown':
        return parsed.labels?.join(', ');
      
      case 'tags':
        return parsed.tag_ids?.join(', ');
      
      case 'rating':
        return parsed.rating;
      
      case 'link':
        return parsed.url;
      
      case 'email':
        return parsed.email;
      
      case 'phone':
        return parsed.phone;
      
      default:
        return parsed;
    }
  } catch {
    return valueJson;
  }
};
