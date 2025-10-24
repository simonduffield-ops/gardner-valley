# 🏡 Gardner Valley - Property Management PWA

**Version 2.0** - A modern, mobile-optimized Progressive Web App for managing your property with ease. **Now with shared backend support** - everyone sees the same data, no login required!

Perfect for families managing a vacation home, rental property, or any shared property.

## 🎯 Key Highlights

- ✅ **Zero Configuration** - Works immediately out of the box
- ✅ **Mobile-First** - Optimized for phones and tablets
- ✅ **Offline-Ready** - PWA works without internet (local mode)
- ✅ **No Login Required** - Simple shared access for families
- ✅ **Optional Backend** - Use locally OR sync via Supabase
- ✅ **Data Safety** - Built-in export/import for backups
- ✅ **Modern UI** - Beautiful, intuitive interface with toast notifications

## 📱 Browser Compatibility

**Fully Supported:**
- iOS Safari 14+
- Chrome 90+ (Android, Desktop)
- Edge 90+
- Firefox 88+

**Features:**
- Progressive Web App (installable)
- Touch gestures (pinch-zoom, drag-and-drop)
- File upload (images, PDFs, documents)
- LocalStorage (10MB+ capacity)
- Service Worker (offline support)

## Features

### 📍 Property Map
- Interactive property map with customizable markers
- Pinch-to-zoom and pan support for mobile devices
- Add labels for trees, buildings, irrigation/electrical lines, and equipment
- 5 color-coded marker types (🌳 Tree, 🏠 Building, 💧 Irrigation, ⚡ Electrical, 🔧 Equipment)
- **Synced across all devices** ☁️

### ℹ️ Important Information
- Store key contacts and information
- Organized by categories (Utilities, Services, Other)
- Editable fields with inline editing
- Perfect for utility providers, service schedules, WiFi passwords, gate codes, etc.

### 📋 Lists
Four dynamic list types to organize your property:
1. **Shopping** - Shopping list with sections (Produce, Dairy, etc.)
2. **Tasks** - Daily to-do items with completion tracking
3. **Projects** - Track ongoing property projects
4. **Things to Buy** - Future purchases and wish list

### 📖 Reference Guides
Two reference checklists that stay visible:
1. **Leaving Checklist** - Items stay visible when checked (uncheck all when you return)
2. **Annual Jobs** - Seasonal maintenance reminders by month

All lists support:
- Drag-and-drop reordering (works on desktop and mobile/iOS)
- Section headers for organization
- Completion status tracking

### 📅 Visits Calendar
- Track who's at the property and when
- Add guest names with check-in/check-out dates
- **Shared bookings** - everyone sees the same calendar ☁️
- Visual "Currently Occupied" indicator
- Automatic duration calculation
- Sorted chronologically

### 📄 Documents
- Upload and store manuals, images, warranties, and receipts
- Support for images, PDFs, and documents (max 5MB per file)
- Multiple file upload support
- Organize by categories (Manuals, Images, Warranties, Receipts, Other)
- Image preview and download functionality
- Smart category auto-detection

---

## 🚀 Quick Start

### Option 1: Use Locally (Simplest)
1. Clone or download this repository
2. Open `index.html` in a web browser
3. Start using the app immediately!
4. All data stays on your device (localStorage)
5. Use export/import to share data between devices

**Perfect for:** Single user, maximum privacy, no setup required

### Option 2: Deploy to GitHub Pages (Free Hosting)
1. Fork this repository or create a new one
2. Copy all files to your repository
3. Go to Settings → Pages
4. Set Source to "main branch"
5. Save and wait 1-2 minutes
6. Access at `https://yourusername.github.io/repository-name/`
7. Share the URL with family members

**Perfect for:** Multiple users, accessible from anywhere, still using local storage

### Option 3: Shared Backend with Supabase (Family Use)
**Everyone sees the same data - perfect for families!**

#### Setup (10 minutes):
1. **Create Supabase account**
   - Go to [supabase.com](https://supabase.com)
   - Create a free account
   - Create a new project (remember your password)

2. **Set up database**
   - In Supabase dashboard → SQL Editor
   - Click "New Query"
   - Copy/paste entire contents of `database-schema.sql`
   - Click "Run" (you should see "Success" messages)

3. **Get your credentials**
   - Supabase → Settings → API
   - Copy these two values:
     - **Project URL** (looks like: `https://xxxxx.supabase.co`)
     - **anon public key** (long string starting with `eyJ...`)

4. **Configure the app**
   - Open `supabase-config.js` in a text editor
   - Replace the placeholder values:
   ```javascript
   const SUPABASE_CONFIG = {
       url: 'https://your-project.supabase.co',  // Your Project URL
       anonKey: 'your-anon-key-here'             // Your anon public key
   };
   ```
   - Save the file

5. **Deploy**
   ```bash
   git add .
   git commit -m "Enable shared backend"
   git push origin main
   ```

6. **Wait and test**
   - Wait 1-2 minutes for GitHub Pages to rebuild
   - Refresh the app
   - You should see **"☁️ Backend Active"** indicator
   - Test by adding an item on one device, checking on another

#### What You Get:
- Everyone sees the same bookings, lists, contacts
- No login required - just share the link
- Multi-device sync (updates in 1-2 seconds)
- Automatic backups via Supabase
- Real-time updates
- Up to 500MB database storage (free tier)
- Unlimited API requests (free tier)

**Note**: The app shows "☁️ Backend Active" when successfully connected to Supabase.

---

## 📱 Installation

### iOS Safari:
1. Open the app in Safari
2. Tap the Share button (box with arrow)
3. Scroll down and tap "Add to Home Screen"
4. Name it "Gardner Valley" and tap "Add"
5. App icon will appear on your home screen

### Android Chrome:
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Tap "Install app" or "Add to Home Screen"
4. Confirm by tapping "Install"

### Desktop (Chrome, Edge):
1. Look for the install icon in the address bar
2. Click it and confirm installation
3. App will open in its own window

### GitHub Pages:
The app typically runs at: `https://yourusername.github.io/gardner-valley/`

**Note**: Replace `yourusername` with your actual GitHub username.

---

## 🔧 File Structure

```
gardner-valley/
├── index.html              # Main HTML
├── app.js                  # React application (with backend integration)
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker
├── supabase-config.js      # Backend configuration
├── api-service.js          # Supabase API layer
├── database-schema.sql     # Database setup script
└── README.md              # This file
```

---

## 💾 Data Management

### Local Storage Mode (Default)
When used without backend configuration:
- All data stored locally in browser localStorage
- Data persists between sessions
- Use export/import to share data between devices
- Maximum privacy - nothing leaves your device

### Backend Mode (Supabase)
When configured with Supabase:
- **"☁️ Backend Active"** indicator shown in app
- Real-time sync across all devices
- Everyone sees the same data - no login required
- Automatic backups via Supabase
- localStorage still used as local cache

### Export/Import
- **Export**: Creates a JSON backup file of all your data
  - Includes: maps, contacts, lists, calendar, documents
  - Timestamp in filename for easy organization
- **Import**: Restores from a JSON backup file
  - Safely replaces current data
  - Works in both local and backend modes

---

## 🔄 Making Database Changes

When you need to change the database structure (add fields, new tables, etc.):

### Steps:

1. **Update `database-schema.sql`**
   - Add your changes to the file (for documentation)
   - This keeps a record of your full schema

2. **Run changes in Supabase**
   - Go to Supabase → SQL Editor → New Query
   - Write ONLY the new changes:
   ```sql
   -- Example: Add a notes field to bookings
   ALTER TABLE calendar_bookings ADD COLUMN notes TEXT;
   
   -- Example: Add a new table
   CREATE TABLE IF NOT EXISTS property_expenses (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       amount DECIMAL NOT NULL,
       description TEXT NOT NULL,
       date DATE NOT NULL,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```
   - Click Run

3. **Update `api-service.js`** (if needed)
   - Add new API methods for the changes
   ```javascript
   async addExpense(expense) {
       const { data, error } = await supabase
           .from('property_expenses')
           .insert(expense)
           .select()
           .single();
       if (error) throw error;
       return data;
   }
   ```

4. **Update `app.js`** (if needed)
   - Use the new fields/tables in your UI

5. **Deploy**
   ```bash
   git add .
   git commit -m "Add expense tracking"
   git push
   ```

**Note:** Changes are immediate - anyone using the app will automatically use the new schema!

---

## 🐛 Troubleshooting

### Backend Not Working?
1. **Check browser console** (F12 or right-click → Inspect → Console) for errors
2. **Verify credentials** in `supabase-config.js`:
   - URL should be `https://your-project.supabase.co`
   - anonKey should be your Supabase anon/public key
3. **Check Supabase dashboard** → Table Editor (should see all tables)
4. **Hard refresh** to clear cache:
   - Chrome/Edge: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Safari: `Cmd+Option+R`
5. **Check Row Level Security** is disabled (see database-schema.sql)

### Common Issues

**"Failed to sync data"**
- Check internet connection
- Verify Supabase project is still active
- Check browser console for specific error messages

**"Storage quota exceeded"**
- Delete some documents to free up space
- Export your data and consider using backend mode
- Documents stored as base64 can be large

**"Old cached version"**
- Hard refresh the page (see above)
- Clear browser cache for your site
- In PWA mode: Uninstall and reinstall the app

**App shows blank screen**
- Check browser console for JavaScript errors
- Try clearing cache and hard refresh
- Make sure you're using a modern browser (Chrome, Safari, Edge, Firefox)

**Map not showing**
- Check that `gardner-valley-map.png` exists in the root directory
- Verify image file path is correct
- Check browser console for 404 errors

**Changes not saving**
- In local mode: Check browser console for localStorage errors
- In backend mode: Check network tab (F12) for failed API calls
- Verify you're not in incognito/private browsing mode (local mode only)

### Debug Commands (Browser Console)

Open browser console (F12) and try these commands:

```javascript
// Check if backend is configured
isSupabaseConfigured()  // Should return true if configured

// Check if API is initialized
propertyAPI.initialized  // Should return true if backend working

// View stored data (local mode only)
JSON.parse(localStorage.getItem('propertyData'))

// Clear all local data (⚠️ careful!)
localStorage.removeItem('propertyData')
```

### Performance Tips

1. **Large document storage**: Consider using backend mode if storing many documents
2. **Slow loading**: Export data, clear storage, reimport to remove fragmentation
3. **Memory issues**: Limit document uploads to necessary files only
4. **Sync delays**: Changes should appear in 1-2 seconds; if slower, check connection

---

## 🔐 Security

**With Backend:**
- Access controlled by your GitHub Pages URL
- Only people with the link can access
- Good for trusted family/friends
- Can add password protection if needed

**Without Backend:**
- 100% local to your device
- Maximum privacy

---

## 🌟 Tech Stack

- **Frontend**: React 18, Tailwind CSS (via CDN)
- **Backend**: Supabase (PostgreSQL)
- **Hosting**: GitHub Pages (or any static host)
- **PWA**: Service Worker, Web App Manifest
- **Icons**: Lucide icons (inline SVG)

---

## 🎨 Version 2.0 Improvements

### Data Safety & Reliability
- **Export/Import Functionality**: Backup and restore your data with one click
- **Storage Quota Checking**: Prevents data loss from exceeding storage limits
- **Error Boundaries**: App gracefully handles errors without crashing
- **Debounced Saves**: Performance optimized - saves occur every 500ms

### User Experience
- **Toast Notifications**: Beautiful, non-blocking notifications
- **Confirmation Dialogs**: All delete actions require confirmation
- **Success Feedback**: Every action provides clear visual feedback
- **Smooth Animations**: Toast notifications slide in elegantly

### Technical Improvements
- **React 18 API**: Using modern `createRoot` API
- **Robust ID Generation**: Collision-resistant IDs
- **File Upload Validation**: Type checking, size limits, error handling
- **localStorage Error Handling**: Graceful quota exceeded handling

---

## ❓ Frequently Asked Questions

### General Questions

**Q: Do I need to create an account to use this app?**
A: No! The app works immediately without any login. If you enable the Supabase backend, it's still accessible to everyone who has the URL - no individual accounts needed.

**Q: Can multiple people use the app at the same time?**
A: Yes! With backend mode enabled, everyone sees the same data in real-time. Without backend, each device has its own data (use export/import to sync).

**Q: Is my data safe?**
A: 
- **Local mode**: Data never leaves your device. Use the export feature for backups.
- **Backend mode**: Data stored in Supabase (industry-standard security). No authentication means anyone with the URL can access it - perfect for trusted family members.

**Q: What happens if I lose my device?**
A:
- **Local mode**: Data is lost unless you've exported backups
- **Backend mode**: Your data is safe in Supabase, just access from any device

**Q: How much does this cost?**
A: Free! The app is open-source. Supabase offers a generous free tier (500MB database, unlimited API requests).

### Technical Questions

**Q: Can I use this offline?**
A: Yes! Once installed as a PWA, the app works offline in local mode. Backend mode requires internet for syncing.

**Q: How do I update to a new version?**
A: 
1. Pull the latest code from GitHub
2. Hard refresh your browser (`Ctrl+Shift+R`)
3. Your data is preserved (stored separately from app code)

**Q: Can I customize the property map?**
A: Yes! Replace `gardner-valley-map.png` with your own property image. The app will automatically use it.

**Q: What's the maximum file size for documents?**
A: 5MB per file. This is to ensure good performance and prevent storage issues.

**Q: Can I host this on my own domain?**
A: Yes! This is a static web app. You can host it on any web server, not just GitHub Pages. Popular options: Netlify, Vercel, Cloudflare Pages, or your own server.

**Q: Is there a mobile app?**
A: This IS a mobile app (PWA - Progressive Web App). When installed, it works like a native app with an icon on your home screen.

---

## 🛠️ Customization

### Change App Name & Icon
Edit `manifest.json`:
```json
{
    "name": "Your Property Name",
    "short_name": "Property",
    "description": "Your description",
    "icons": [
        // Change the emoji in the SVG data URLs
    ]
}
```

### Change Theme Colors
Edit these values in `manifest.json`:
```json
{
    "background_color": "#10b981",  // Emerald green
    "theme_color": "#10b981"
}
```

And update CSS in `index.html` to match.

### Change Property Map
Replace `gardner-valley-map.png` with your own image:
- Recommended size: 2000x2000px or larger
- Format: PNG, JPG, or WebP
- Keep the same filename, or update the path in `app.js` line 656

### Add Custom Marker Types
Edit `app.js` line 426-432:
```javascript
const markerColors = {
    tree: 'bg-green-500',
    building: 'bg-blue-500',
    irrigation: 'bg-cyan-500',
    electrical: 'bg-yellow-500',
    equipment: 'bg-purple-500',
    // Add your own:
    yourtype: 'bg-red-500',
};
```

---

## 📝 License

Free to use and modify for personal use.

---

## 🤝 Contributing

Found a bug or have a feature request? 
- Open an issue on GitHub
- Submit a pull request
- Fork and customize for your needs

---

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [PWA Guide](https://web.dev/progressive-web-apps/)

---

## 🙏 Acknowledgments

Built with:
- React 18 (UI framework)
- Tailwind CSS (styling)
- Supabase (backend)
- Lucide Icons (inline SVG icons)
- Love and coffee ☕

---

**Built with ❤️ for Gardner Valley**

*Last updated: Version 2.0 - October 2024*
