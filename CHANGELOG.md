# Changelog

All notable changes to the Item Vertical View app will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2024-12-03

### Added
- Initial release of Item Vertical View app
- Core functionality: Display all item fields in a vertical list
- Inline editing support for:
  - Text & Long Text fields
  - Status columns
  - Date columns
  - People columns
  - Numbers fields
  - Dropdown columns
  - Timeline columns
  - Tags
  - Link, Email, Phone fields
  - Checkbox fields
- Read-only display for:
  - Formula columns
  - Auto-number columns
  - Progress tracking
  - Creation log
  - Last updated
- Export functionality:
  - Export to CSV
  - Export to PDF
- Search functionality (browser native search)
- Auto-refresh every 30 seconds
- Manual refresh button
- Permissions handling:
  - Respect user edit permissions
  - Read-only mode for guests/viewers
- Theme support:
  - Light theme
  - Dark theme
  - Black theme
- Responsive design
- Loading states and error handling
- User-friendly notifications for save operations
- Comprehensive documentation (README and DEPLOYMENT_GUIDE)

### Technical Details
- Built with React 18.3
- Uses monday-sdk-js for API communication
- Vibe UI (monday-ui-react-core) components
- Client-side only architecture (no backend)
- GraphQL API integration
- Monorepo structure with workspace support

### Known Limitations
- Some advanced column types may not support inline editing yet
- Virtual scrolling not yet implemented (performance may vary with 200+ columns)
- No custom field ordering yet
- No saved preferences (future: Storage API integration)

---

## [Unreleased]

### Planned Features
- Custom field visibility settings
- Field grouping and sections
- Bulk editing mode
- Field history and audit log
- Custom field ordering
- Saved view preferences
- Advanced search with filters
- Keyboard navigation shortcuts
- Support for more column types
- Performance optimization with virtual scrolling
- Offline mode support

---

## Version History

| Version | Date       | Description                    |
|---------|------------|--------------------------------|
| 0.1.0   | 2024-12-03 | Initial release (MVP)          |

---

## Contributing

When adding changes, please:
1. Add entry under `[Unreleased]` section
2. Categorize using: Added, Changed, Deprecated, Removed, Fixed, Security
3. When releasing, move unreleased items to new version section
4. Update version number in `package.json`
5. Tag the release in Git

---

## Support

For version-specific issues, please include the version number when reporting bugs or requesting features.

Check the current version:
- In the app: See `package.json`
- In monday.com: App info panel

---

*This changelog is automatically included with each release.*
