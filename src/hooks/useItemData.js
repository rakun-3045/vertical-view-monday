import { useState, useEffect, useCallback } from 'react';
import mondaySdk from 'monday-sdk-js';

const monday = mondaySdk();

const useItemData = () => {
  const [itemData, setItemData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [context, setContext] = useState(null);

  useEffect(() => {
    monday.listen('context', (res) => {
      setContext(res.data);
    });
  }, []);

  const fetchItemData = useCallback(async () => {
    if (!context || !context.itemId) {
        setLoading(false);
        return;
    }

    setLoading(true);
    try {
      const query = `query ($itemId: [Int]) {
        items (ids: $itemId) {
          id
          name
          board {
            id
            name
          }
          column_values {
            id
            text
            value
            type
            column {
              title
              settings_str
            }
          }
        }
      }`;

      const variables = { itemId: [context.itemId] };
      const response = await monday.api(query, { variables });

      if (response.data && response.data.items && response.data.items.length > 0) {
        const item = response.data.items[0];
        
        const formattedItem = {
            ...item,
            column_values: item.column_values.map(cv => {
                let valueObj = null;
                try {
                    valueObj = cv.value ? JSON.parse(cv.value) : null;
                } catch (e) {}

                // Enrich status with color from settings
                if (cv.type === 'status' && cv.column.settings_str) {
                    try {
                        const settings = JSON.parse(cv.column.settings_str);
                        // settings.labels_colors is usually { "1": "#color", ... }
                        // valueObj.index is the selected index
                        if (settings && settings.labels_colors && valueObj && valueObj.index !== undefined) {
                             const color = settings.labels_colors[String(valueObj.index)];
                             const label = settings.labels ? settings.labels[String(valueObj.index)] : cv.text;
                             
                             if (color) {
                                 valueObj = { ...valueObj, color, label };
                             }
                        }
                    } catch (e) {
                        // ignore parsing errors
                    }
                }
                
                return {
                    id: cv.id,
                    title: cv.column.title,
                    type: cv.type,
                    text: cv.text,
                    value: valueObj ? JSON.stringify(valueObj) : cv.value,
                    category: 'General' 
                };
            })
        };
        
        setItemData(formattedItem);
      } else {
        setError('Item not found');
      }
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [context]);

  useEffect(() => {
    if (context) {
        fetchItemData();
    } else {
        // If no context after a while, stop loading (likely local dev)
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }
  }, [context, fetchItemData]);

  return { itemData, loading, error, fetchItemData, context };
};

export default useItemData;
