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

// Async version that waits for the Supabase CDN library to load before giving up.
// On slow mobile connections the defer'd CDN script may not have executed yet
// when initSupabase() is first called, causing a silent fallback to localStorage.
function waitForSupabase(timeoutMs = 10000) {
    return new Promise((resolve) => {
        if (initSupabase()) {
            resolve(true);
            return;
        }
        const interval = 100;
        let elapsed = 0;
        const timer = setInterval(() => {
            elapsed += interval;
            if (initSupabase()) {
                clearInterval(timer);
                resolve(true);
            } else if (elapsed >= timeoutMs) {
                clearInterval(timer);
                console.warn('Timed out waiting for Supabase library to load');
                resolve(false);
            }
        }, interval);
    });
}

window.waitForSupabase = waitForSupabase;

// Check if Supabase is configured
function isSupabaseConfigured() {
    return SUPABASE_CONFIG.url !== 'YOUR_SUPABASE_URL' && 
           SUPABASE_CONFIG.anonKey !== 'YOUR_SUPABASE_ANON_KEY';
}

// Make functions available globally
window.initSupabase = initSupabase;
window.isSupabaseConfigured = isSupabaseConfigured;