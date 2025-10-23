// Supabase Configuration
// Replace these with your actual Supabase project credentials
// Get them from: https://app.supabase.com/project/_/settings/api

const SUPABASE_CONFIG = {
    url: 'https://codeqqdwriqhiekukopa.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNvZGVxcWR3cmlxaGlla3Vrb3BhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNDI3NDcsImV4cCI6MjA3NjgxODc0N30.3iNaCl3iV3OiF0pHZt47nZbRNrf7SfJkyDZWDvHPSd8',
};

// Initialize Supabase client (will be loaded from CDN)
let supabase = null;

function initSupabase() {
    if (typeof supabase === 'undefined' || supabase === null) {
        if (window.supabase && SUPABASE_CONFIG.url !== 'YOUR_SUPABASE_URL') {
            supabase = window.supabase.createClient(
                SUPABASE_CONFIG.url,
                SUPABASE_CONFIG.anonKey
            );
            console.log('Supabase initialized');
            return true;
        } else {
            console.warn('Supabase not configured or library not loaded');
            return false;
        }
    }
    return true;
}

// Check if Supabase is configured
function isSupabaseConfigured() {
    return SUPABASE_CONFIG.url !== 'YOUR_SUPABASE_URL' && 
           SUPABASE_CONFIG.anonKey !== 'YOUR_SUPABASE_ANON_KEY';
}

