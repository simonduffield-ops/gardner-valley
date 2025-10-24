# 🏡 Gardner Valley - Property Management PWA

A modern, mobile-optimized Progressive Web App for managing your property with ease. **Now with shared backend support** - everyone sees the same data, no login required!

## Features

### 📍 Property Map
- Interactive property map with customizable markers
- Add labels for trees, buildings, irrigation/electrical lines, and equipment
- Color-coded marker types for easy identification
- **Synced across all devices** ☁️

### ℹ️ Important Information
- Store key contacts and information
- Organized by categories (Utilities, Services, Other)
- Perfect for utility providers, service schedules, WiFi passwords, etc.

### 📋 Lists
Six different list types to organize your property:
1. **Leaving Checklist** - Items stay visible when checked
2. **Projects** - Track ongoing property projects
3. **Tasks** - Daily to-do items
4. **Annual Jobs** - Seasonal maintenance reminders
5. **Shopping** - Shopping list
6. **Things to Buy** - Future purchases

### 📅 Occupancy Calendar
- Track who's at the property and when
- Add guest names with check-in/check-out dates
- **Shared bookings** - everyone sees the same calendar ☁️
- Visual indicator for current occupancy

### 📄 Documents
- Upload and store manuals, images, warranties, and receipts
- Support for images, PDFs, and documents (max 5MB per file)
- Organize by categories

---

## 🚀 Quick Start

### Option 1: Local Storage Only (Simple)
1. Open the app - works immediately!
2. All data stays on your device
3. Use export/import to share data

### Option 2: Shared Backend (Family Use)
**Everyone sees the same data - perfect for families!**

#### Setup (10 minutes):
1. Create free account at [supabase.com](https://supabase.com)
2. Create new project
3. Run database script:
   - In Supabase → SQL Editor → New Query
   - Copy/paste contents of `database-schema.sql`
   - Click Run
4. Get your credentials:
   - Supabase → Settings → API
   - Copy Project URL and anon public key
5. Add credentials to `supabase-config.js`:
   ```javascript
   url: 'https://your-project.supabase.co'
   anonKey: 'your-anon-key'
   ```
6. Deploy:
   ```bash
   git add .
   git commit -m "Enable shared backend"
   git push origin main
   ```
7. Wait 1-2 minutes, then refresh!

#### What You Get:
- ✅ Everyone sees the same bookings, lists, contacts
- ✅ No login required - just share the link
- ✅ Multi-device sync
- ✅ Automatic backups
- ✅ Real-time updates

**The app shows "☁️ Backend Active" when connected to Supabase**

---

## 📱 Installation

### iOS Safari:
1. Open the app in Safari
2. Tap Share → "Add to Home Screen"
3. Name it "Gardner Valley"

### Android Chrome:
1. Open in Chrome
2. Tap menu → "Install app"

### GitHub Pages:
The app runs at: `https://yourusername.github.io/gardner-valley/`

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

### Export/Import
- **Export**: Download icon in header → saves JSON backup
- **Import**: Upload icon in header → restores from JSON

### Backend Status
- **"☁️ Backend Active"** = Using Supabase (shared data)
- **No indicator** = Using localStorage (device-only)

---

## 🐛 Troubleshooting

### Backend Not Working?
1. Check browser console (F12) for errors
2. Verify credentials in `supabase-config.js`
3. Check Supabase dashboard → Table Editor (should see tables)
4. Hard refresh (Ctrl+Shift+R)

### Common Issues:
- **Old cached version**: Clear cache or hard refresh
- **Tables missing**: Run `database-schema.sql` again
- **RLS errors**: Make sure Row Level Security is DISABLED

### Debug Commands (Browser Console):
```javascript
isSupabaseConfigured()  // Should return true
propertyAPI.initialized // Should return true
```

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

- **Frontend**: React, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Hosting**: GitHub Pages
- **PWA**: Service Worker, Web App Manifest

---

## 📝 License

Free to use and modify for personal use.

---

Built with ❤️ for Gardner Valley
