# Item Vertical View - monday.com App

## 📋 Overview

**Item Vertical View** is a monday.com Item View app that solves the horizontal scrolling problem on boards with many columns. Instead of scrolling horizontally to see all fields, this app displays all item data in a clean, vertical list format - making it easy to view everything in one place.

### The Problem We Solve

On boards with 20+ columns, users face:
- **Excessive horizontal scrolling** to view all task data
- **Hidden information** that's easy to miss off-screen
- **Inefficient workflows** when reviewing item details
- **Frustration** from constantly scrolling back and forth

### The Solution

Item Vertical View provides:
- ✅ **All fields visible** in one scrollable vertical panel
- ✅ **Inline editing** for quick updates without leaving the view
- ✅ **Export to CSV/PDF** for sharing and offline viewing
- ✅ **Search functionality** to quickly find specific fields
- ✅ **Auto-refresh** every 30 seconds to stay in sync
- ✅ **Permissions-aware** with read-only mode for guests/viewers

---

## 🚀 Installation

### From monday.com Marketplace

1. Go to your monday.com board
2. Click on any item to open the item card
3. Click **"Add View"** → Search for **"Item Vertical View"**
4. Click **Install** and authorize the app
5. The app will now appear as a tab in your item cards

### For Development (Monorepo Setup)

This app is part of a larger monday.com apps monorepo. To work with it:

```bash
# From the monorepo root
cd monday-apps

# Install all dependencies
npm install

# Build the shared components first
npm run build --workspace=@npm-workspace-demo/components

# Install dependencies for this specific app
npm install @npm-workspace-demo/components --workspace=@npm-workspace-demo/item-vertical-view-ui

# Start the app
npm run start --workspace=@npm-workspace-demo/item-vertical-view-ui
```

The app will open at `http://localhost:3000`

---

## 📖 User Guide

### Viewing All Fields

1. **Open an item** on your board
2. **Click the "Item Vertical View" tab** in the item card
3. **Scroll vertically** to see all fields

All columns from your board are displayed as rows with:
- **Field Name** (on the left)
- **Field Type** (below the name)
- **Field Value** (on the right)

### Editing Fields

**For users with Edit permissions:**

1. **Click on any field value** (editable fields have a hover effect)
2. The field transforms into an **inline editor**
3. **Make your changes**
4. Click **"Save"** or press **Enter** (Cancel with Escape)
5. You'll see a "Saving..." then "Saved successfully!" notification

**Supported field types for editing:**
- Text & Long Text
- Status
- Date
- People
- Numbers
- Dropdown
- Timeline
- Tags
- Link, Email, Phone
- Checkbox

**Read-only fields** (shown with an info icon):
- Formula
- Auto-number
- Progress
- Creation Log
- Last Updated

### Exporting Data

#### Export to CSV
1. Click the **"Export"** button in the top-right
2. Select **"Export to CSV"**
3. A CSV file downloads with all field names, values, and types

#### Export to PDF
1. Click the **"Export"** button
2. Select **"Export to PDF"**
3. A PDF snapshot of the current view downloads

**Use cases:**
- Share item details via email
- Create offline records
- Print physical copies
- Archive task information

### Searching Fields

1. Click the **Search icon** (🔍) in the top-right
2. Your browser's search dialog opens (Ctrl/Cmd + F)
3. Type any field name or value to jump to it

### Refreshing Data

The app automatically refreshes every 30 seconds, but you can also:

1. Click the **Refresh icon** (🔄) in the top-right
2. Data reloads immediately

---

## 🛠️ Developer Documentation

### Architecture Overview

This is a **100% client-side React application** with:
- **No backend server** - all operations run in the browser
- **Direct API communication** - GraphQL calls via `monday-sdk-js`
- **Vibe UI components** - Uses `monday-ui-react-core` for native look & feel
- **Monorepo structure** - Part of `@npm-workspace-demo` workspace

### Technology Stack

- **React 18.3** - UI framework
- **monday-sdk-js** - monday.com API integration
- **monday-ui-react-core** - Official Vibe UI component library
- **papaparse** - CSV export functionality
- **html2pdf.js** - PDF generation
- **react-window** - Virtual scrolling for performance (optional)

### Project Structure

```
item-vertical-view-ui/
├── src/
│   ├── components/
│   │   ├── ItemDetailsPanel.js       # Main container component
│   │   ├── ActionBar.js              # Top bar (refresh, search, export)
│   │   ├── ExportMenu.js             # Export dropdown menu
│   │   ├── FieldRow.js               # Single field row container
│   │   ├── FieldRenderer.js          # Displays field values
│   │   ├── FieldEditor.js            # Inline editing UI
│   │   └── *.css                     # Component styles
│   ├── hooks/
│   │   ├── useItemData.js            # Fetch item data with polling
│   │   ├── useFieldUpdate.js         # Update field values
│   │   └── usePermissions.js         # Check user permissions
│   ├── services/
│   │   ├── graphql.js                # GraphQL queries & mutations
│   │   └── exportService.js          # CSV/PDF export logic
│   ├── App.js                        # Root component
│   ├── index.js                      # Entry point
│   └── index.css                     # Global styles
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
└── package.json
```

### Core Components

#### 1. ItemDetailsPanel
**Main container** that orchestrates the entire view.

**Responsibilities:**
- Fetches monday.com context (itemId, boardId, theme)
- Manages theme colors (light/dark/black)
- Displays loading, error, and no-data states
- Renders the action bar and field rows
- Handles permissions banner

#### 2. FieldRow
**Displays a single field** with label and value.

**Props:**
- `column` - Column data object
- `canEdit` - Boolean for edit permissions
- `onUpdate` - Callback for field updates
- `updating` - Loading state during save

#### 3. FieldRenderer
**Renders field values** based on column type.

**Features:**
- Type-specific rendering (status, people, dates, etc.)
- Read-only field detection
- Click-to-edit interaction (when allowed)

#### 4. FieldEditor
**Inline editing interface** for supported field types.

**Features:**
- Type-appropriate input components
- Keyboard shortcuts (Enter to save, Escape to cancel)
- Loading states during save
- Auto-focus on mount

#### 5. ActionBar
**Top navigation bar** with actions.

**Features:**
- Item name display
- Refresh button
- Search button
- Export menu

### Custom Hooks

#### useItemData(itemId, boardId, pollingInterval)
Fetches and polls for item data.

**Returns:**
```javascript
{
  itemData,    // Item object with column_values
  loading,     // Boolean loading state
  error,       // Error message (if any)
  refresh      // Manual refresh function
}
```

**GraphQL Query Used:**
```graphql
query ($itemId: ID!) {
  items(ids: [$itemId]) {
    id
    name
    board { id name }
    column_values {
      id
      title
      type
      text
      value
      additional_info
    }
  }
}
```

#### useFieldUpdate(boardId, itemId, onSuccess, onError)
Handles field value updates.

**Returns:**
```javascript
{
  updateField,   // (columnId, value, columnType) => Promise
  updating,      // Boolean updating state
  updateError    // Error message (if any)
}
```

**GraphQL Mutation Used:**
```graphql
mutation ($boardId: ID!, $itemId: ID!, $columnId: String!, $value: JSON!) {
  change_column_value(
    board_id: $boardId, 
    item_id: $itemId, 
    column_id: $columnId, 
    value: $value
  ) {
    id
  }
}
```

**Value Formatting:**
The hook automatically formats values based on column type:
- Text fields: Direct string
- Status: `{ label: "Done" }`
- People: `{ personsAndTeams: [{ id, kind: "person" }] }`
- Date: `{ date: "2024-12-25" }`
- And more...

#### usePermissions()
Checks user edit permissions.

**Returns:**
```javascript
{
  canEdit,     // Boolean - can user edit fields
  isGuest,     // Boolean - is user a guest
  isViewOnly,  // Boolean - is user view-only
  loading      // Boolean - permissions loading
}
```

### Services

#### graphql.js
Contains all GraphQL queries and mutations:
- `FETCH_ITEM_QUERY` - Get item data
- `CHANGE_COLUMN_VALUE_MUTATION` - Update field
- `GET_USER_PERMISSIONS` - Check permissions
- `GET_BOARD_INFO` - Board metadata

#### exportService.js
Handles data export:

**exportToCSV(columnValues, itemName)**
```javascript
// Creates CSV with columns: Field Name, Field Value, Field Type
// Downloads as: {itemName}_details_YYYY-MM-DD.csv
```

**exportToPDF(elementId, itemName)**
```javascript
// Converts DOM element to PDF
// Downloads as: {itemName}_details_YYYY-MM-DD.pdf
```

### Key Features Implementation

#### 1. Theme Support
The app listens to monday.com theme changes:

```javascript
monday.listen('context', (res) => {
  const theme = res.data.theme; // 'light', 'dark', or 'black'
  updateTheme(theme);
});
```

#### 2. Auto-Refresh (Polling)
Implemented in `useItemData`:

```javascript
useEffect(() => {
  const interval = setInterval(() => {
    fetchItemData();
  }, 30000); // 30 seconds
  
  return () => clearInterval(interval);
}, [itemId]);
```

#### 3. Optimistic UI Updates
When a field is saved, the UI updates immediately while the API call processes in the background.

#### 4. Error Handling
All API calls have try-catch blocks and show user-friendly notifications using `monday.execute('notice', ...)`.

---

## 🏃 Running the App

### Development Mode

```bash
# From monorepo root
npm run start --workspace=@npm-workspace-demo/item-vertical-view-ui
```

Opens at `http://localhost:3000`

**For local testing without monday.com:**
The app detects `localhost` and provides fallback values for testing.

### Production Build

```bash
# Build the app
npm run build --workspace=@npm-workspace-demo/item-vertical-view-ui

# Build output is in: apps/item-vertical-view-ui/build/
```

### Testing on monday.com

1. Build the app
2. Deploy to hosting (e.g., Vercel, Netlify, AWS)
3. Register the app in monday.com Apps Marketplace
4. Configure the Item View feature with your hosted URL
5. Install on a board and test

---

## 🐛 Troubleshooting

### "Editing is disabled" - Permission Error

**Cause:** User is a Guest, Viewer, or lacks edit permissions.

**Solution:**
- Check user role on the board
- Ensure user has "Edit" permissions
- Contact board admin to upgrade permissions

### Data Seems Stale / Not Updating

**Cause:** Polling might be paused or API rate limit reached.

**Solution:**
- Click the Refresh button manually
- Check browser console for API errors
- Verify monday.com API status

### Fields Not Rendering Correctly

**Cause:** Unsupported or new column type.

**Solution:**
- Check `FieldRenderer.js` for supported types
- Add rendering logic for new column types
- File an issue/PR for enhancements

### Export Not Working

**Cause:** Browser blocking downloads or missing data.

**Solution:**
- Allow pop-ups/downloads in browser settings
- Ensure item has data to export
- Check browser console for errors

### App Not Loading

**Cause:** Context not provided or API error.

**Solution:**
- Ensure app is properly installed as an Item View
- Check browser console for errors
- Verify monday.com SDK is initialized

---

## 🔧 Development Guidelines

### Adding Support for New Column Types

1. **Update FieldRenderer.js:**
```javascript
case 'new-type':
  return renderNewType(parsedValue, column.text);
```

2. **Update FieldEditor.js:**
```javascript
case 'new-type':
  return <NewTypeInput ... />;
```

3. **Update useFieldUpdate.js:**
```javascript
case 'new-type':
  return JSON.stringify({ new_format: value });
```

### Running Tests

```bash
npm run test --workspace=@npm-workspace-demo/item-vertical-view-ui
```

### Linting

```bash
npm run lint --workspace=@npm-workspace-demo/item-vertical-view-ui
```

### Building for Production

```bash
npm run build --workspace=@npm-workspace-demo/item-vertical-view-ui
```

---

## 📚 Additional Resources

- [monday.com Apps Framework Docs](https://developer.monday.com/)
- [monday.com GraphQL API](https://developer.monday.com/api-reference/docs)
- [Vibe UI Components](https://style.monday.com/)
- [monday-sdk-js Documentation](https://www.npmjs.com/package/monday-sdk-js)

---

## 🤝 Contributing

To contribute to this app:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is part of the monday-apps monorepo. See the root LICENSE file for details.

---

## 👥 Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Contact the development team
- Check the monday.com developer community

---

## 🎯 Roadmap

Future enhancements planned:
- [ ] Custom field visibility settings (hide/show specific fields)
- [ ] Field grouping and sections
- [ ] Bulk editing mode
- [ ] Field history and audit log
- [ ] Custom field ordering
- [ ] Saved view preferences (using Storage API)
- [ ] Advanced search with filters
- [ ] Keyboard navigation shortcuts

---

**Built with ❤️ for monday.com users who hate horizontal scrolling!**
