# 🏡 Property Manager PWA

A modern, mobile-optimized Progressive Web App for managing your property with ease.

## Features

### 📍 Property Map
- Interactive property map with customizable markers
- Add labels for trees, buildings, irrigation/electrical lines, and equipment
- Color-coded marker types for easy identification
- Tap to place new markers, delete existing ones
- Visual legend for all marker types

### ℹ️ Important Information
- Store key contacts and information
- Organized by categories (Utilities, Services, Other)
- Easy add, edit, and delete functionality
- Perfect for utility providers, service schedules, WiFi passwords, etc.

### 📋 Lists
Five different list types to organize your property tasks:

1. **Leaving Checklist** - Items stay visible when checked (perfect for shared use)
2. **Projects** - Track ongoing property projects
3. **Tasks** - Daily to-do items
4. **Annual Jobs** - Seasonal maintenance reminders
5. **Shopping** - Things to buy for the property

All lists support:
- Add new items with one tap
- Check/uncheck items
- Delete items
- Persistent storage (saves automatically)

### 📅 Occupancy Calendar
- Track who's at the property and when
- Add guest names with check-in/check-out dates
- Visual indicator for current occupancy
- Automatic sorting by date
- Duration calculation

### 📄 Documents
- Upload and store manuals, images, warranties, and receipts
- Automatic categorization by file type
- Support for images, PDFs, and documents (max 5MB per file)
- Visual thumbnails for images
- Full-screen preview for images
- Download any document
- Organize by categories: Manuals, Images, Warranties, Receipts, Other
- Edit categories for each document
- Grid view optimized for mobile browsing

## Technical Features

### Progressive Web App (PWA)
- ✅ Install to home screen on mobile devices
- ✅ Works offline with service worker caching
- ✅ App-like experience with no browser chrome
- ✅ Fast loading and smooth animations
- ✅ Automatic data persistence with localStorage
- ✅ Error boundary for graceful error handling
- ✅ Debounced saves for optimal performance

### Mobile-Optimized Design
- Responsive layout optimized for phones
- Touch-friendly tap targets
- Bottom navigation for easy thumb access
- Clean, modern aesthetic with Tailwind CSS
- Smooth transitions and animations
- Beautiful toast notifications
- Confirmation dialogs for destructive actions

### Data Persistence & Safety
- All your data is automatically saved to your device's local storage
- **Data Export/Import**: Backup and restore your data with JSON export/import
- Storage quota checking to prevent data loss
- Comprehensive error handling for file operations
- No internet connection required after initial load!
- Debounced saves prevent performance issues

## Installation

### On Mobile (iOS/Android)

#### iOS Safari:
1. Open the app in Safari
2. Tap the Share button (square with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Name it "Property Manager" and tap "Add"

#### Android Chrome:
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Tap "Install app" or "Add to Home Screen"
4. Confirm the installation

### On Desktop
1. Open in Chrome or Edge
2. Look for the install icon in the address bar
3. Click "Install"

## Running Locally

To run this app locally:

1. Place all files in a directory
2. Serve with any static file server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js http-server
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```
3. Open http://localhost:8000 in your browser

## Data Management

### Backup Your Data
Click the **download icon** in the header to export all your data as a JSON file. This creates a complete backup you can save to your computer or cloud storage.

### Restore Your Data
Click the **upload icon** in the header and select a previously exported JSON file to restore your data. Perfect for:
- Moving between devices
- Creating regular backups
- Recovering from issues
- Sharing setup with family members

## File Structure

```
property-manager/
├── index.html          # Main HTML file
├── app.js             # React application code
├── manifest.json      # PWA manifest
├── sw.js             # Service worker for offline support
└── README.md         # This file
```

## Future Enhancement Ideas

The app is designed to be easily extensible. Future features could include:

- **Map Enhancements:**
  - Photo attachments for markers
  - Drawing tools for property boundaries
  - Measurement tools
  - GPS coordinates

- **Smart Lists:**
  - Recurring tasks with reminders
  - Task assignments
  - Progress tracking
  - Due dates

- **Calendar:**
  - Integration with device calendar
  - Booking conflicts detection
  - Guest communication
  - Cleaning schedules

- **Documents:**
  - Upload and store property documents
  - Warranty information
  - Maintenance records
  - Photos and videos

- **Expenses:**
  - Track property expenses
  - Budget management
  - Receipt storage
  - Financial reports

- **Weather Integration:**
  - Local weather forecast
  - Alerts for property
  - Seasonal recommendations

## Browser Compatibility

- ✅ iOS Safari 12+
- ✅ Chrome/Edge (all platforms)
- ✅ Firefox
- ✅ Samsung Internet

## License

Free to use and modify for personal use.

## Support

This is a standalone PWA that runs entirely in your browser. All data is stored locally on your device. No account, server, or internet connection required after installation!

---

Built with ❤️ using React and Tailwind CSS
