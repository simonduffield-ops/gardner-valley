const { useState, useEffect, useRef, useCallback, useMemo, memo } = React;

// Toast notification system - Memoized for performance
const Toast = memo(({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = useMemo(() => 
        type === 'success' ? 'bg-emerald-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500',
        [type]
    );

    return (
        <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in flex items-center gap-2`}>
            <span>{message}</span>
            <button onClick={onClose} className="ml-2 hover:opacity-80">
                <Icons.X />
            </button>
        </div>
    );
});

// Confirmation dialog component - Memoized
const ConfirmDialog = memo(({ message, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                <h3 className="text-lg font-semibold mb-4">{message}</h3>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
});

// Error Boundary Component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md">
                        <h2 className="text-2xl font-bold text-red-500 mb-4">Oops! Something went wrong</h2>
                        <p className="text-gray-600 mb-4">
                            Don't worry, your data is safe. Try refreshing the page.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-emerald-500 text-white py-2 rounded-lg font-semibold"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Utility: Generate unique IDs - Optimized with crypto API when available
function generateId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Utility: Optimized Debounce function with immediate execution option
function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
        const context = this;
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Utility: Check localStorage space
function checkStorageSpace(data) {
    try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, JSON.stringify(data));
        localStorage.removeItem(testKey);
        return { success: true };
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            return { success: false, error: 'Storage quota exceeded. Please delete some documents to free up space.' };
        }
        return { success: false, error: 'Storage error occurred.' };
    }
}

// Utility: Compress image before upload
async function compressImage(file, maxWidth = 1920, maxHeight = 1080, quality = 0.85) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                // Calculate new dimensions maintaining aspect ratio
                let width = img.width;
                let height = img.height;
                
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = Math.floor(width * ratio);
                    height = Math.floor(height * ratio);
                }
                
                // Create canvas and compress
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Convert to data URL with compression
                const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedDataUrl);
            };
            img.onerror = reject;
            img.src = e.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Lucide icons as inline SVGs - Memoized for performance
const Icons = {
    Map: memo(() => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
    )),
    Info: memo(() => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    )),
    List: memo(() => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
    )),
    Calendar: memo(() => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    )),
    Plus: memo(() => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
    )),
    X: memo(() => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    )),
    Check: memo(() => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    )),
    ClipboardList: memo(() => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
    )),
    Edit: memo(() => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
    )),
    Trash: memo(() => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    )),
    Document: memo(() => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
    )),
    Download: memo(() => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
    )),
    Image: memo(() => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    )),
    File: memo(() => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    )),
    Upload: memo(() => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
    )),
    MapPin: memo(() => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    )),
    DragHandle: memo(() => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
    )),
    ChevronDown: memo(() => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
    )),
    Kanban: memo(() => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
        </svg>
    )),
    MoreHorizontal: memo(() => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" />
        </svg>
    )),
    Label: memo(() => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
    )),
    Clock: memo(() => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    )),
    AlignLeft: memo(() => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h14" />
        </svg>
    )),
    Archive: memo(() => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
        </svg>
    )),
    ChevronLeft: memo(() => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
    )),
    ChevronRight: memo(() => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
    )),
};

// Initial data structure
// Initial data structure (empty - for new users without backend)
const initialData = {
    mapMarkers: [],
    contacts: [],
    lists: {
        leaving: [],
        projects: [],
        tasks: [],
        annual: [],
        shopping: [],
        thingsToBuy: [],
    },
    calendar: [],
    documents: [],
};

function PropertyManager() {
    const [activeTab, setActiveTab] = useState('map');
    const [data, setData] = useState(initialData);
    const [toast, setToast] = useState(null);
    const [useBackend, setUseBackend] = useState(false);
    const [loading, setLoading] = useState(true);

    const [showMapChoice, setShowMapChoice] = useState(false);

    // Initialize - check for Supabase and load data
    useEffect(() => {
        async function initializeData() {
            setLoading(true);
            
            // Try to initialize Supabase
            const backendAvailable = isSupabaseConfigured();
            
            if (backendAvailable) {
                try {
                    const initialized = await propertyAPI.initialize();
                    if (!initialized) {
                        console.warn('Supabase library failed to load (CDN timeout), falling back to localStorage');
                        setUseBackend(false);
                        loadFromLocalStorage();
                    } else {
                        console.log('Backend initialized, loading from Supabase...');
                        
                        // Load all data from backend
                        const backendData = await propertyAPI.getAllData();
                        setData(backendData);
                        setUseBackend(true);
                        console.log('Data loaded from backend:', backendData);
                    }
                } catch (error) {
                    console.error('Failed to load from backend, falling back to localStorage:', error);
                    setUseBackend(false);
                    loadFromLocalStorage();
                }
            } else {
                console.log('Backend not configured, using localStorage');
                setUseBackend(false);
                loadFromLocalStorage();
            }
            
            setLoading(false);
        }

        function loadFromLocalStorage() {
            try {
                const saved = localStorage.getItem('propertyData');
                if (saved) {
                    setData(JSON.parse(saved));
                }
            } catch (e) {
                console.error('Error loading from localStorage:', e);
            }
        }

        initializeData();
    }, []);

    // Realtime: subscribe to remote changes and reload data.
    // On iOS Safari, WebSocket connections are dropped when the app is backgrounded,
    // so we reconnect and do a fresh fetch whenever the page becomes visible again.
    //
    // Monotonic counter: incremented at the START of every mutation in updateData.
    // Realtime-triggered refetches compare their snapshot of the counter to the
    // current value — if it has changed, a newer mutation is in flight and the
    // stale refetch is discarded.  This eliminates the race where a realtime echo
    // of our own write (or a slow refetch) overwrites an optimistic update.
    const mutationEpochRef = React.useRef(0);

    useEffect(() => {
        if (!useBackend) return;

        let reloadTimeout = null;
        let unsubscribe = null;

        const scheduleReload = () => {
            clearTimeout(reloadTimeout);
            reloadTimeout = setTimeout(async () => {
                const epochAtStart = mutationEpochRef.current;
                try {
                    propertyAPI.clearCache();
                    const backendData = await propertyAPI.getAllData();
                    // Only apply if no mutation started while we were fetching
                    if (mutationEpochRef.current === epochAtStart) {
                        setData(backendData);
                    }
                } catch (e) {
                    console.error('Realtime reload failed:', e);
                }
            }, 500);
        };

        const connect = () => {
            if (unsubscribe) unsubscribe();
            unsubscribe = propertyAPI.subscribeToChanges(scheduleReload);
        };

        connect();

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                connect();
                scheduleReload();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            clearTimeout(reloadTimeout);
            if (unsubscribe) unsubscribe();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [useBackend]);

    // Save to localStorage (fallback and cache)
    const debouncedSave = useCallback(
        debounce((dataToSave) => {
            if (!useBackend) {
                try {
                    const storageCheck = checkStorageSpace(dataToSave);
                    if (storageCheck.success) {
                        localStorage.setItem('propertyData', JSON.stringify(dataToSave));
                    } else {
                        setToast({ message: storageCheck.error, type: 'error' });
                    }
                } catch (e) {
                    console.error('Error saving data:', e);
                    setToast({ message: 'Failed to save data. Please try again.', type: 'error' });
                }
            }
        }, 500),
        [useBackend]
    );

    useEffect(() => {
        if (!loading) {
            debouncedSave(data);
        }
    }, [data, debouncedSave, loading]);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    // Handle opening maps - detect platform and offer choice on mobile
    const handleOpenMaps = (e) => {
        e.preventDefault();
        
        const address = "Two One Four"; // You can customize this
        const googleMapsUrl = "https://maps.app.goo.gl/4c9phER1pxvepQjy7";
        
        // Detect platform
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const isAndroid = /Android/.test(navigator.userAgent);
        const isMobile = isIOS || isAndroid;
        
        // Desktop - open Google Maps directly
        if (!isMobile) {
            window.open(googleMapsUrl, '_blank');
            return;
        }
        
        // Mobile - show choice dialog
        setShowMapChoice(true);
    };

    const openInAppleMaps = () => {
        // Apple Maps URL scheme - opens directly in Apple Maps app
        window.location.href = "maps://?q=Gardner+Valley&sll=33.6672,-116.6561";
        setShowMapChoice(false);
    };

    const openInGoogleMaps = () => {
        // Google Maps URL - opens in Google Maps app if installed, otherwise browser
        window.location.href = "https://maps.app.goo.gl/4c9phER1pxvepQjy7";
        setShowMapChoice(false);
    };

    // updateData — central mutation helper.
    //
    // Options object (3rd arg, replaces old affectedLists array):
    //   affectedLists: string[]  — which lists to refetch (null = refetch all)
    //   skipRefetch: boolean     — if true, trust the optimistic update and
    //                              don't refetch after the write.  Use for
    //                              simple property changes (toggle, text edit)
    //                              on items that already have a real DB id.
    //
    // For backwards compat, passing a plain array as the 3rd arg still works.
    const updateData = useCallback(async (updateFn, optimisticUpdate, optsOrLists = null) => {
        const opts = Array.isArray(optsOrLists)
            ? { affectedLists: optsOrLists }
            : (optsOrLists || {});
        const { affectedLists = null, skipRefetch = false } = opts;

        const epoch = ++mutationEpochRef.current;
        if (optimisticUpdate) optimisticUpdate();

        try {
            await updateFn();

            if (useBackend && !skipRefetch) {
                await new Promise(r => setTimeout(r, 400));
                if (mutationEpochRef.current !== epoch) return;

                propertyAPI.clearCache();
                if (affectedLists && affectedLists.length > 0) {
                    const updatedLists = {};
                    await Promise.all(affectedLists.map(async (listName) => {
                        updatedLists[listName] = await propertyAPI.getListItems(listName);
                    }));
                    if (mutationEpochRef.current !== epoch) return;
                    setData(prev => ({ ...prev, lists: { ...prev.lists, ...updatedLists } }));
                } else {
                    const backendData = await propertyAPI.getAllData();
                    if (mutationEpochRef.current !== epoch) return;
                    setData(backendData);
                }
            }

            // Bump epoch again after our refetch (or after write if skipRefetch)
            // so any trailing realtime echo is discarded.
            mutationEpochRef.current++;
        } catch (error) {
            console.error('Error updating data:', error);
            showToast('Failed to sync data. Please try again.', 'error');
            if (useBackend) {
                try {
                    propertyAPI.clearCache();
                    const backendData = await propertyAPI.getAllData();
                    setData(backendData);
                } catch (e) {
                    console.error('Failed to restore state after error:', e);
                }
            }
        }
    }, [useBackend, showToast]);

    // Memoize tabs array to prevent re-creation on every render
    const tabs = useMemo(() => [
        { id: 'map', label: 'Map', icon: Icons.Map },
        { id: 'info', label: 'Info', icon: Icons.Info },
        { id: 'lists', label: 'Lists', icon: Icons.List },
        { id: 'projects', label: 'Projects', icon: Icons.Kanban },
        { id: 'calendar', label: 'Visits', icon: Icons.Calendar },
        { id: 'documents', label: 'Docs', icon: Icons.Document },
    ], []);

    // Show loading screen while initializing
    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 via-emerald-400 to-teal-500 overflow-hidden relative">
                {/* Sun */}
                <div className="absolute top-20 sun-rise">
                    <div className="text-8xl">☀️</div>
                    <div className="absolute inset-0 sun-rays opacity-30">
                        <div className="text-8xl">✨</div>
                    </div>
                </div>
                
                {/* Singing bird - positioned at bottom like sun at top */}
                <div className="absolute bottom-20 flex justify-center items-center w-full">
                    <div className="relative bird-hop">
                        <div className="text-6xl">🐤</div>
                        {/* Music notes */}
                        <div className="absolute -top-4 -right-10 text-2xl music-note music-note-1">♪</div>
                        <div className="absolute -top-8 -right-3 text-xl music-note music-note-2">♫</div>
                        <div className="absolute -top-10 -right-8 text-lg music-note music-note-3">♪</div>
                    </div>
                </div>
                
                {/* Main content */}
                <div className="text-center text-white relative z-10 -mt-8">
                    {/* House with float animation */}
                    <div className="text-7xl mb-6 float-anim">🏡</div>
                    
                    {/* Title */}
                    <h2 className="text-3xl font-bold mb-6 drop-shadow-lg">Two One Four</h2>
                    
                    {/* Growing plants */}
                    <div className="flex justify-center gap-4 text-5xl mb-4">
                        <span className="plant-grow-1">🌱</span>
                        <span className="plant-grow-2">🌿</span>
                        <span className="plant-grow-3">🌾</span>
                    </div>
                    
                    {/* Loading text */}
                    <p className="text-lg shimmer">Preparing your property...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 shadow-lg">
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleOpenMaps}
                        className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-colors"
                        title="Open in Maps"
                    >
                        <Icons.MapPin />
                    </button>
                    <h1 className="text-xl font-bold">Two One Four</h1>
                </div>
            </header>

            {/* Content */}
            <main key={activeTab} className={`flex-1 pb-20 ${activeTab === 'projects' ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'}`} style={{ WebkitOverflowScrolling: 'touch' }}>
                {activeTab === 'map' && <MapView data={data} setData={setData} showToast={showToast} useBackend={useBackend} updateData={updateData} />}
                {activeTab === 'info' && <InfoView data={data} setData={setData} showToast={showToast} useBackend={useBackend} updateData={updateData} />}
                {activeTab === 'lists' && <ListsView data={data} setData={setData} showToast={showToast} useBackend={useBackend} updateData={updateData} />}
                {activeTab === 'projects' && <KanbanView data={data} setData={setData} showToast={showToast} useBackend={useBackend} updateData={updateData} />}
                {activeTab === 'calendar' && <CalendarView data={data} setData={setData} showToast={showToast} useBackend={useBackend} updateData={updateData} />}
                {activeTab === 'documents' && <DocumentsView data={data} setData={setData} showToast={showToast} useBackend={useBackend} updateData={updateData} />}
            </main>

            {/* Bottom Navigation */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area">
                <div className="flex justify-around">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex-1 flex flex-col items-center py-2 px-1 transition-colors ${
                                activeTab === tab.id
                                    ? 'text-emerald-500'
                                    : 'text-gray-400'
                            }`}
                        >
                            <tab.icon />
                            <span className="text-[10px] sm:text-xs mt-0.5">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </nav>

            {/* Map Choice Dialog */}
            {showMapChoice && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                        <h3 className="text-lg font-semibold mb-4">Open in Maps</h3>
                        <p className="text-gray-600 mb-6">Choose which app to use:</p>
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={openInAppleMaps}
                                className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg font-semibold transition-colors"
                            >
                                🍎 Apple Maps
                            </button>
                            <button
                                onClick={openInGoogleMaps}
                                className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
                            >
                                🗺️ Google Maps
                            </button>
                            <button
                                onClick={() => setShowMapChoice(false)}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg font-semibold transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notifications */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}

function MapView({ data, setData, showToast, useBackend, updateData }) {
    const [showAddMarker, setShowAddMarker] = useState(false);
    const [newMarker, setNewMarker] = useState({ x: 50, y: 50, label: '', type: 'tree' });
    const [confirmDelete, setConfirmDelete] = useState(null);
    const mapRef = useRef(null);
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 767px)');
        const handler = (e) => setIsMobile(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    const markerColors = {
        tree: 'bg-green-500',
        building: 'bg-blue-500',
        irrigation: 'bg-cyan-500',
        electrical: 'bg-yellow-500',
        equipment: 'bg-purple-500',
    };

    // Pinch to zoom handling
    useEffect(() => {
        const mapElement = mapRef.current;
        if (!mapElement) return;

        let lastTouchDistance = 0;

        const handleTouchStart = (e) => {
            if (e.touches.length === 2) {
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                lastTouchDistance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );
            }
        };

        const handleTouchMove = (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const currentDistance = Math.hypot(
                    touch2.clientX - touch1.clientX,
                    touch2.clientY - touch1.clientY
                );

                if (lastTouchDistance > 0) {
                    const delta = currentDistance - lastTouchDistance;
                    const newScale = Math.max(1, Math.min(4, scale + delta * 0.01));
                    setScale(newScale);
                }

                lastTouchDistance = currentDistance;
            }
        };

        const handleWheel = (e) => {
            e.preventDefault();
            const delta = e.deltaY * -0.01;
            const newScale = Math.max(1, Math.min(4, scale + delta));
            setScale(newScale);
        };

        mapElement.addEventListener('touchstart', handleTouchStart, { passive: false });
        mapElement.addEventListener('touchmove', handleTouchMove, { passive: false });
        mapElement.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            mapElement.removeEventListener('touchstart', handleTouchStart);
            mapElement.removeEventListener('touchmove', handleTouchMove);
            mapElement.removeEventListener('wheel', handleWheel);
        };
    }, [scale]);

    // Pan handling
    const handleMouseDown = (e) => {
        if (showAddMarker) return;
        if (e.touches && e.touches.length !== 1) return;
        
        setIsDragging(true);
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        setDragStart({ x: clientX - position.x, y: clientY - position.y });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        setPosition({
            x: clientX - dragStart.x,
            y: clientY - dragStart.y,
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMapClick = (e) => {
        if (!showAddMarker || isDragging) return;
        
        const rect = mapRef.current.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        // Adjust for zoom and pan
        const x = ((clientX - rect.left - position.x) / scale / rect.width) * 100;
        const y = ((clientY - rect.top - position.y) / scale / rect.height) * 100;
        
        if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
            setNewMarker({ ...newMarker, x, y });
        }
    };

    const resetView = () => {
        setScale(1);
        setPosition({ x: 0, y: 0 });
    };

    const addMarker = async () => {
        if (!newMarker.label) return;
        const markerToAdd = { ...newMarker };
        setNewMarker({ x: 50, y: 50, label: '', type: 'tree' });
        setShowAddMarker(false);
        await updateData(async () => {
            if (useBackend) {
                await propertyAPI.addMapMarker(markerToAdd);
            } else {
                setData(prev => ({ ...prev, mapMarkers: [...prev.mapMarkers, { id: generateId(), ...markerToAdd }] }));
            }
        });
        showToast('Marker added successfully!');
    };

    const deleteMarker = async (id) => {
        setConfirmDelete(null);
        await updateData(async () => {
            if (useBackend) {
                await propertyAPI.deleteMapMarker(id);
            } else {
                setData(prev => ({ ...prev, mapMarkers: prev.mapMarkers.filter(m => m.id !== id) }));
            }
        });
        showToast('Marker deleted');
    };

    return (
        <div className="p-4 pb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Property Map</h2>
                <div className="flex gap-2">
                    {scale !== 1 && (
                        <button
                            onClick={resetView}
                            className="p-2 rounded-full bg-blue-500 text-white shadow-lg transition-colors text-sm"
                            title="Reset zoom"
                        >
                            ↺
                        </button>
                    )}
                    <button
                        onClick={() => setShowAddMarker(!showAddMarker)}
                        className={`p-2 rounded-full ${
                            showAddMarker ? 'bg-red-500' : 'bg-emerald-500'
                        } text-white shadow-lg transition-colors`}
                    >
                        {showAddMarker ? <Icons.X /> : <Icons.Plus />}
                    </button>
                </div>
            </div>

            {showAddMarker && (
                <div className="bg-white p-4 rounded-lg shadow mb-4 border border-emerald-200">
                    <h3 className="font-semibold mb-3 text-lg">Add New Marker</h3>
                    <input
                        type="text"
                        placeholder="Label (e.g., 'Apple Tree')"
                        value={newMarker.label}
                        onChange={(e) => setNewMarker({ ...newMarker, label: e.target.value })}
                        className="w-full p-3 border rounded-lg mb-3 text-base"
                    />
                    <select
                        value={newMarker.type}
                        onChange={(e) => setNewMarker({ ...newMarker, type: e.target.value })}
                        className="w-full p-3 border rounded-lg mb-3 text-base"
                    >
                        <option value="tree">🌳 Tree</option>
                        <option value="building">🏠 Building</option>
                        <option value="irrigation">💧 Irrigation</option>
                        <option value="electrical">⚡ Electrical</option>
                        <option value="equipment">🔧 Equipment</option>
                    </select>
                    <p className="text-sm text-gray-600 mb-3 bg-emerald-50 p-2 rounded">
                        👆 Tap on the map to place your marker
                    </p>
                    <button
                        onClick={addMarker}
                        disabled={!newMarker.label}
                        className="w-full bg-emerald-500 text-white py-3 rounded-lg font-semibold text-base disabled:bg-gray-300 active:scale-95 transition-transform"
                    >
                        Add Marker
                    </button>
                </div>
            )}

            <div
                ref={mapRef}
                onClick={handleMapClick}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
                className="relative rounded-lg shadow-lg overflow-hidden touch-none select-none"
                style={{ 
                    height: 'calc(100vh - 320px)',
                    minHeight: '400px',
                    maxHeight: '700px',
                    cursor: isDragging ? 'grabbing' : (showAddMarker ? 'crosshair' : 'grab'),
                    backgroundColor: '#f5f5f5'
                }}
            >
                <div
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundImage: 'url(gardner-valley-map.png)',
                        backgroundSize: isMobile ? 'auto 100%' : 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                        transformOrigin: 'center center',
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                    }}
                >
                {data.mapMarkers.map(marker => (
                    <div
                        key={marker.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
                        style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                    >
                        <div className="flex flex-col items-center cursor-pointer">
                            <div className={`w-8 h-8 ${markerColors[marker.type]} rounded-full shadow-lg border-3 border-white`} />
                            <div className="bg-white px-2 py-1 rounded-md shadow-md mt-1 text-xs font-medium whitespace-nowrap max-w-[120px] truncate">
                                {marker.label}
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setConfirmDelete(marker.id);
                                }}
                                className="mt-1 bg-red-500 text-white p-1.5 rounded-md text-xs shadow-md active:scale-95 transition-transform"
                            >
                                <Icons.Trash />
                            </button>
                        </div>
                    </div>
                ))}
                </div>
            </div>

            <div className="mt-4 bg-white p-4 rounded-lg shadow-md border border-gray-100">
                <h3 className="font-semibold mb-3 text-base">Legend</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.entries(markerColors).map(([type, color]) => (
                        <div key={type} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                            <div className={`w-5 h-5 ${color} rounded-full shadow-sm border border-white`} />
                            <span className="text-sm capitalize font-medium">{type}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Confirm Delete Dialog */}
            {confirmDelete && (
                <ConfirmDialog
                    message="Delete this marker?"
                    onConfirm={() => deleteMarker(confirmDelete)}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}
        </div>
    );
}

function InfoView({ data, setData, showToast, useBackend, updateData }) {
    const [showAddContact, setShowAddContact] = useState(false);
    const [newContact, setNewContact] = useState({ category: 'Utilities', name: '', value: '' });
    const [editingId, setEditingId] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);

    const addContact = async () => {
        if (!newContact.name || !newContact.value) return;
        const contactToAdd = { ...newContact };
        setNewContact({ category: 'Utilities', name: '', value: '' });
        setShowAddContact(false);
        await updateData(async () => {
            if (useBackend) {
                await propertyAPI.addContact(contactToAdd);
            } else {
                setData(prev => ({ ...prev, contacts: [...prev.contacts, { id: generateId(), ...contactToAdd }] }));
            }
        });
        showToast('Contact added successfully!');
    };

    const deleteContact = async (id) => {
        setConfirmDelete(null);
        await updateData(async () => {
            if (useBackend) {
                await propertyAPI.deleteContact(id);
            } else {
                setData(prev => ({ ...prev, contacts: prev.contacts.filter(c => c.id !== id) }));
            }
        });
        showToast('Contact deleted');
    };

    const updateContact = async (id, field, value) => {
        await updateData(async () => {
            if (useBackend) {
                await propertyAPI.updateContact(id, { [field]: value });
            } else {
                setData(prev => ({
                    ...prev,
                    contacts: prev.contacts.map(c => c.id === id ? { ...c, [field]: value } : c),
                }));
            }
        });
    };

    const groupedContacts = data.contacts.reduce((acc, contact) => {
        if (!acc[contact.category]) acc[contact.category] = [];
        acc[contact.category].push(contact);
        return acc;
    }, {});

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Important Info</h2>
                <button
                    onClick={() => setShowAddContact(!showAddContact)}
                    className={`p-2 rounded-full ${
                        showAddContact ? 'bg-red-500' : 'bg-emerald-500'
                    } text-white shadow-lg`}
                >
                    {showAddContact ? <Icons.X /> : <Icons.Plus />}
                </button>
            </div>

            {showAddContact && (
                <div className="bg-white p-4 rounded-lg shadow mb-4">
                    <h3 className="font-semibold mb-2">Add Contact</h3>
                    <select
                        value={newContact.category}
                        onChange={(e) => setNewContact({ ...newContact, category: e.target.value })}
                        className="w-full p-2 border rounded mb-2"
                    >
                        <option value="Utilities">Utilities</option>
                        <option value="Services">Services</option>
                        <option value="Other">Other</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Name"
                        value={newContact.name}
                        onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                        className="w-full p-2 border rounded mb-2"
                    />
                    <input
                        type="text"
                        placeholder="Value (phone, date, password, etc.)"
                        value={newContact.value}
                        onChange={(e) => setNewContact({ ...newContact, value: e.target.value })}
                        className="w-full p-2 border rounded mb-2"
                    />
                    <button
                        onClick={addContact}
                        disabled={!newContact.name || !newContact.value}
                        className="w-full bg-emerald-500 text-white py-2 rounded disabled:bg-gray-300"
                    >
                        Add Contact
                    </button>
                </div>
            )}

            <div className="space-y-4">
                {Object.entries(groupedContacts).map(([category, contacts]) => (
                    <div key={category} className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="bg-emerald-500 text-white px-4 py-2 font-semibold">
                            {category}
                        </div>
                        <div className="divide-y">
                            {contacts.map(contact => (
                                <div key={contact.id} className="p-4">
                                    {editingId === contact.id ? (
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-semibold text-gray-800">Edit Contact</h4>
                                                <button
                                                    onClick={() => {
                                                        setConfirmDelete(contact.id);
                                                        setEditingId(null);
                                                    }}
                                                    className="text-red-500 p-2 hover:bg-red-50 rounded"
                                                >
                                                    <Icons.Trash />
                                                </button>
                                            </div>
                                            <input
                                                type="text"
                                                value={contact.name}
                                                onChange={(e) => updateContact(contact.id, 'name', e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                            <input
                                                type="text"
                                                value={contact.value}
                                                onChange={(e) => updateContact(contact.id, 'value', e.target.value)}
                                                className="w-full p-2 border rounded"
                                            />
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="w-full bg-emerald-500 text-white py-2 rounded font-semibold"
                                            >
                                                Done
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="font-semibold text-gray-800">
                                                        {contact.name}
                                                    </div>
                                                    <div className="text-gray-600 mt-1">
                                                        {contact.link ? (
                                                            <>
                                                                {contact.value.split('calendar').map((part, index, array) => (
                                                                    <React.Fragment key={index}>
                                                                        {part}
                                                                        {index < array.length - 1 && (
                                                                            <a 
                                                                                href={contact.link}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="text-emerald-500 underline hover:text-emerald-600"
                                                                            >
                                                                                calendar
                                                                            </a>
                                                                        )}
                                                                    </React.Fragment>
                                                                ))}
                                                            </>
                                                        ) : (
                                                            contact.value
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setEditingId(contact.id)}
                                                    className="text-blue-500 p-1"
                                                >
                                                    <Icons.Edit />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Confirm Delete Dialog */}
            {confirmDelete && (
                <ConfirmDialog
                    message="Delete this contact?"
                    onConfirm={() => deleteContact(confirmDelete)}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}
        </div>
    );
}

// Draggable list component supporting per-list-type behavior overrides.
//
// Config props:
//   toggleField   – 'completed' or 'checked' (which boolean field to toggle)
//   hasSections   – whether section headers are supported
//   hasLogbook    – whether completed items collapse into a logbook
//   hasUncheckAll – whether an "Uncheck All" button is shown
function DraggableListView({ data, setData, showToast, useBackend, updateData, title, listTypes, defaultList, toggleField: defaultToggleField, hasSections: defaultHasSections, hasLogbook: defaultHasLogbook, hasUncheckAll: defaultHasUncheckAll }) {
    const [activeList, setActiveList] = useState(defaultList);
    const [newItemText, setNewItemText] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [draggedItem, setDraggedItem] = useState(null);
    const [showAddSection, setShowAddSection] = useState(false);
    const [newSectionName, setNewSectionName] = useState('');
    const [editingItem, setEditingItem] = useState(null);
    const [logbookExpanded, setLogbookExpanded] = useState(false);

    const activeType = listTypes.find(t => t.id === activeList) || {};
    const toggleField = activeType.toggleField ?? defaultToggleField;
    const hasSections = activeType.hasSections ?? defaultHasSections;
    const hasLogbook = activeType.hasLogbook ?? defaultHasLogbook;
    const hasUncheckAll = activeType.hasUncheckAll ?? defaultHasUncheckAll;
    const draggedRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const saveOrderTimer = useRef(null);
    const pendingSave = useRef(false);
    const reorderedItemsRef = useRef(null);

    const items = data.lists[activeList] || [];

    // Optimistic state helper: apply a state update locally and also as
    // the optimistic callback for updateData, eliminating the old pattern
    // where the same setData call was written twice.
    const optimisticListUpdate = useCallback((listName, updater) => {
        const apply = () => setData(prev => ({
            ...prev,
            lists: { ...prev.lists, [listName]: updater(prev.lists[listName]) },
        }));
        return apply;
    }, [setData]);

    const addItem = async () => {
        if (!newItemText.trim()) return;
        const text = newItemText;
        const listName = activeList;
        const tempId = generateId();
        const nextSortOrder = items.length;
        setNewItemText('');

        const newItem = { text, [toggleField]: false, is_section: false, sort_order: nextSortOrder };
        const apply = optimisticListUpdate(listName, list => [...list, { ...newItem, id: tempId }]);

        await updateData(
            async () => {
                if (useBackend) {
                    await propertyAPI.addListItem(listName, newItem);
                } else {
                    apply();
                }
            },
            apply,
            [listName]
        );
        showToast('Item added!');
    };

    const addSection = async () => {
        if (!newSectionName.trim()) return;
        const text = newSectionName;
        const listName = activeList;
        const tempId = generateId();
        const nextSortOrder = items.length;
        setNewSectionName('');
        setShowAddSection(false);

        const newSection = { text, is_section: true, [toggleField]: false, sort_order: nextSortOrder };
        const apply = optimisticListUpdate(listName, list => [...list, { ...newSection, id: tempId }]);

        await updateData(
            async () => {
                if (useBackend) {
                    await propertyAPI.addListItem(listName, newSection);
                } else {
                    apply();
                }
            },
            apply,
            [listName]
        );
        showToast('Section added!');
    };

    const toggleItem = async (id) => {
        const item = items.find(i => i.id === id);
        if (!item) return;
        const newValue = !item[toggleField];
        const listName = activeList;

        const apply = optimisticListUpdate(listName, list =>
            list.map(i => i.id === id ? { ...i, [toggleField]: newValue } : i)
        );

        await updateData(
            async () => {
                if (useBackend) {
                    await propertyAPI.updateListItem(id, { [toggleField]: newValue });
                } else {
                    apply();
                }
            },
            apply,
            { skipRefetch: true }
        );
    };

    const deleteItem = async (id) => {
        const listName = activeList;
        setConfirmDelete(null);

        const apply = optimisticListUpdate(listName, list => list.filter(item => item.id !== id));

        await updateData(
            async () => {
                if (useBackend) {
                    await propertyAPI.deleteListItem(id);
                } else {
                    apply();
                }
            },
            apply,
            { affectedLists: [listName] }
        );
        showToast('Item deleted');
    };

    const updateItem = async () => {
        if (!editingItem.text.trim()) return;
        const item = { ...editingItem };
        const listName = activeList;
        setEditingItem(null);

        const apply = optimisticListUpdate(listName, list =>
            list.map(i => i.id === item.id ? item : i)
        );

        await updateData(
            async () => {
                if (useBackend) {
                    await propertyAPI.updateListItem(item.id, { text: item.text });
                } else {
                    apply();
                }
            },
            apply,
            { skipRefetch: true }
        );
        showToast('Item updated');
    };

    const uncheckAll = async () => {
        if (!hasUncheckAll) return;
        const listName = activeList;

        const apply = optimisticListUpdate(listName, list =>
            list.map(item => ({ ...item, [toggleField]: false }))
        );

        await updateData(
            async () => {
                if (useBackend) {
                    await propertyAPI.uncheckAllListItems(listName);
                } else {
                    apply();
                }
            },
            apply,
            { skipRefetch: true }
        );
        showToast('All items unchecked');
    };

    const saveOrderToBackend = async (orderedItems) => {
        if (!useBackend) return;
        await updateData(
            async () => {
                await Promise.all(
                    orderedItems.map((item, index) =>
                        propertyAPI.updateListItem(item.id, { sort_order: index })
                    )
                );
                pendingSave.current = false;
            },
            null,
            { skipRefetch: true }
        );
    };

    // Fix: capture reordered items via setData return value to avoid stale closure
    const reorderItems = (startIndex, endIndex) => {
        const listName = activeList;
        setData(prev => {
            const reordered = Array.from(prev.lists[listName]);
            const [removed] = reordered.splice(startIndex, 1);
            reordered.splice(endIndex, 0, removed);
            reorderedItemsRef.current = reordered;
            return { ...prev, lists: { ...prev.lists, [listName]: reordered } };
        });

        if (useBackend) {
            pendingSave.current = true;
            clearTimeout(saveOrderTimer.current);
            saveOrderTimer.current = setTimeout(() => {
                if (reorderedItemsRef.current) {
                    saveOrderToBackend(reorderedItemsRef.current);
                }
            }, 300);
        }
    };

    const handleDesktopDragStart = (e, index) => {
        draggedRef.current = index;
        setDraggedItem(index);
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
        }
    };

    const handleDesktopDragOver = (e, index) => {
        e.preventDefault();
        if (draggedRef.current === null || draggedRef.current === index) return;
        reorderItems(draggedRef.current, index);
        draggedRef.current = index;
    };

    const handleDesktopDragEnd = () => {
        draggedRef.current = null;
        setDraggedItem(null);
    };

    const handleDragHandleTouchStart = (e, index) => {
        e.preventDefault();
        draggedRef.current = index;
        setDraggedItem(index);
        setIsDragging(true);

        if (window.navigator.vibrate) {
            window.navigator.vibrate(50);
        }

        const touchId = e.touches[0].identifier;

        const handleTouchMove = (moveEvent) => {
            if (moveEvent.cancelable) moveEvent.preventDefault();

            let touch = null;
            for (let i = 0; i < moveEvent.touches.length; i++) {
                if (moveEvent.touches[i].identifier === touchId) {
                    touch = moveEvent.touches[i];
                    break;
                }
            }
            if (!touch || draggedRef.current === null) return;

            const element = document.elementFromPoint(touch.clientX, touch.clientY);
            if (element) {
                const itemElement = element.closest('[data-item-index]');
                if (itemElement) {
                    const hoverIndex = parseInt(itemElement.getAttribute('data-item-index'));
                    if (hoverIndex !== draggedRef.current && !isNaN(hoverIndex)) {
                        reorderItems(draggedRef.current, hoverIndex);
                        draggedRef.current = hoverIndex;
                    }
                }
            }
        };

        const handleTouchEnd = (endEvent) => {
            let touchEnded = true;
            if (endEvent.touches) {
                for (let i = 0; i < endEvent.touches.length; i++) {
                    if (endEvent.touches[i].identifier === touchId) {
                        touchEnded = false;
                        break;
                    }
                }
            }
            if (touchEnded) {
                draggedRef.current = null;
                setDraggedItem(null);
                setIsDragging(false);
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
                document.removeEventListener('touchcancel', handleTouchEnd);
            }
        };

        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: false });
        document.addEventListener('touchcancel', handleTouchEnd, { passive: false });
    };

    useEffect(() => {
        return () => {
            clearTimeout(saveOrderTimer.current);
            draggedRef.current = null;
        };
    }, []);

    // Pre-compute filtered lists once (fixes issue 3: redundant .filter() calls)
    const activeItems = useMemo(
        () => hasLogbook ? items.filter(item => !item[toggleField]) : items,
        [items, toggleField, hasLogbook]
    );
    const completedItems = useMemo(
        () => hasLogbook ? items.filter(item => item[toggleField] && !item.is_section) : [],
        [items, toggleField, hasLogbook]
    );

    const renderDragHandle = (index) => (
        <div
            draggable={true}
            onDragStart={(e) => handleDesktopDragStart(e, index)}
            onDragEnd={handleDesktopDragEnd}
            className="text-gray-400 p-2 -m-2 touch-none active:bg-gray-200 rounded cursor-grab"
            onTouchStart={(e) => handleDragHandleTouchStart(e, index)}
        >
            <Icons.DragHandle />
        </div>
    );

    const renderItemRow = (item, index) => {
        const actualIndex = hasLogbook ? items.indexOf(item) : index;
        const isToggled = item[toggleField];

        if (item.is_section && hasSections) {
            return (
                <div
                    key={item.id}
                    data-item-index={actualIndex}
                    onDragOver={(e) => handleDesktopDragOver(e, actualIndex)}
                    className={`bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex items-center gap-3 transition-all ${
                        draggedItem === actualIndex ? 'opacity-50 scale-105 shadow-xl' : ''
                    }`}
                >
                    {renderDragHandle(actualIndex)}
                    <div
                        onClick={() => setEditingItem({ ...item })}
                        className="flex-1 flex items-center gap-2 cursor-pointer"
                    >
                        <span className="text-emerald-600 text-lg">📑</span>
                        <span className="font-bold text-emerald-700 uppercase text-sm tracking-wide">
                            {item.text}
                        </span>
                    </div>
                </div>
            );
        }

        return (
            <div
                key={item.id}
                data-item-index={actualIndex}
                onDragOver={(e) => handleDesktopDragOver(e, actualIndex)}
                className={`bg-white p-4 rounded-lg shadow flex items-center gap-3 transition-all ${
                    draggedItem === actualIndex ? 'opacity-50 scale-105 shadow-xl' : ''
                }`}
            >
                {renderDragHandle(actualIndex)}
                <button
                    onClick={() => toggleItem(item.id)}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                        isToggled ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300'
                    }`}
                >
                    {isToggled && <Icons.Check />}
                </button>
                <span
                    onClick={() => setEditingItem({ ...item })}
                    className={`flex-1 cursor-pointer ${
                        isToggled ? 'line-through text-gray-400' : 'text-gray-800'
                    }`}
                >
                    {item.text}
                </span>
            </div>
        );
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
                {hasUncheckAll && (
                    <button
                        onClick={uncheckAll}
                        disabled={items.length === 0}
                        className="px-3 py-1 bg-gray-500 text-white rounded-lg text-sm font-semibold hover:bg-gray-600 disabled:bg-gray-300"
                    >
                        Uncheck All
                    </button>
                )}
            </div>

            {/* List Type Selector */}
            <div className="flex overflow-x-auto gap-2 mb-4 pb-2">
                {listTypes.map(type => (
                    <button
                        key={type.id}
                        onClick={() => setActiveList(type.id)}
                        className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition-colors ${
                            activeList === type.id
                                ? 'bg-emerald-500 text-white'
                                : 'bg-white text-gray-700 border'
                        }`}
                    >
                        {type.label}
                    </button>
                ))}
            </div>

            {/* Add Item */}
            <div className="bg-white p-4 rounded-lg shadow mb-4">
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        placeholder={`Add to ${listTypes.find(t => t.id === activeList)?.label}`}
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addItem()}
                        className="flex-1 p-2 border rounded"
                    />
                    <button
                        onClick={addItem}
                        disabled={!newItemText.trim()}
                        className="bg-emerald-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
                    >
                        <Icons.Plus />
                    </button>
                </div>
                {hasSections && (
                    <>
                        <button
                            onClick={() => setShowAddSection(!showAddSection)}
                            className={`mt-3 px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                                showAddSection
                                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            }`}
                        >
                            {showAddSection ? (
                                <>
                                    <span className="text-lg">✕</span>
                                    <span>Cancel</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-lg">📑</span>
                                    <span>Add Section Header</span>
                                </>
                            )}
                        </button>
                        {showAddSection && (
                            <div className="flex gap-2 mt-2 pt-2 border-t">
                                <input
                                    type="text"
                                    placeholder="Section name (e.g., 'Produce', 'Dairy')"
                                    value={newSectionName}
                                    onChange={(e) => setNewSectionName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addSection()}
                                    className="flex-1 p-2 border rounded text-sm"
                                />
                                <button
                                    onClick={addSection}
                                    disabled={!newSectionName.trim()}
                                    className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300 text-sm"
                                >
                                    Add
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Items */}
            <div className="space-y-2">
                {activeItems.map((item, index) => renderItemRow(item, index))}
                {activeItems.length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                        No items yet. Add your first item above!
                    </div>
                )}
            </div>

            {/* Logbook Section - Completed Tasks */}
            {hasLogbook && completedItems.length > 0 && (
                <div className="mt-6">
                    <button
                        onClick={() => setLogbookExpanded(!logbookExpanded)}
                        className="w-full bg-gray-100 hover:bg-gray-200 p-4 rounded-lg flex items-center justify-between transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">📖</span>
                            <div className="text-left">
                                <h3 className="font-bold text-gray-800">Logbook</h3>
                                <p className="text-sm text-gray-500">
                                    {completedItems.length} completed {completedItems.length === 1 ? 'task' : 'tasks'}
                                </p>
                            </div>
                        </div>
                        <span className={`text-gray-600 transition-transform ${logbookExpanded ? 'rotate-180' : ''}`}>
                            <Icons.ChevronDown />
                        </span>
                    </button>

                    {logbookExpanded && (
                        <div className="mt-2 space-y-2">
                            {completedItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-gray-50 p-4 rounded-lg flex items-center gap-3"
                                >
                                    <button
                                        onClick={() => toggleItem(item.id)}
                                        className="w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 bg-emerald-500 border-emerald-500"
                                    >
                                        <Icons.Check />
                                    </button>
                                    <span className="flex-1 line-through text-gray-500">
                                        {item.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Edit Item Dialog */}
            {editingItem && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-xl">
                                {editingItem.is_section ? 'Edit Section' : 'Edit Item'}
                            </h3>
                            <button
                                onClick={() => {
                                    setConfirmDelete(editingItem.id);
                                    setEditingItem(null);
                                }}
                                className="text-red-500 p-2 hover:bg-red-50 rounded"
                            >
                                <Icons.Trash />
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder={editingItem.is_section ? "Section name" : "Item text"}
                            value={editingItem.text}
                            onChange={(e) => setEditingItem({ ...editingItem, text: e.target.value })}
                            onKeyDown={(e) => e.key === 'Enter' && updateItem()}
                            className="w-full p-2 border rounded mb-4"
                            autoFocus
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={updateItem}
                                disabled={!editingItem.text.trim()}
                                className="flex-1 bg-emerald-500 text-white py-2 rounded disabled:bg-gray-300"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={() => setEditingItem(null)}
                                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Delete Dialog */}
            {confirmDelete && (
                <ConfirmDialog
                    message="Delete this item?"
                    onConfirm={() => deleteItem(confirmDelete)}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}
        </div>
    );
}

// ==================== KANBAN / PROJECTS VIEW ====================

const KANBAN_LABEL_COLORS = [
    { id: 'green', bg: 'bg-emerald-400', text: 'text-white', light: 'bg-emerald-100 text-emerald-700', name: 'Green' },
    { id: 'yellow', bg: 'bg-yellow-400', text: 'text-white', light: 'bg-yellow-100 text-yellow-700', name: 'Yellow' },
    { id: 'orange', bg: 'bg-orange-400', text: 'text-white', light: 'bg-orange-100 text-orange-700', name: 'Orange' },
    { id: 'red', bg: 'bg-red-400', text: 'text-white', light: 'bg-red-100 text-red-700', name: 'Red' },
    { id: 'purple', bg: 'bg-purple-400', text: 'text-white', light: 'bg-purple-100 text-purple-700', name: 'Purple' },
    { id: 'blue', bg: 'bg-blue-400', text: 'text-white', light: 'bg-blue-100 text-blue-700', name: 'Blue' },
];

function KanbanView({ data, setData, showToast, useBackend, updateData }) {
    const [openCardId, setOpenCardId] = useState(null);
    const [addingToColumn, setAddingToColumn] = useState(null);
    const [newCardText, setNewCardText] = useState('');
    const [addingColumn, setAddingColumn] = useState(false);
    const [newColumnName, setNewColumnName] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [editingColumnId, setEditingColumnId] = useState(null);
    const [editingColumnName, setEditingColumnName] = useState('');
    const [columnMenuId, setColumnMenuId] = useState(null);

    const dragState = useRef({ type: null, sourceColIdx: null, cardIdx: null, overColIdx: null, overCardIdx: null });
    const touchTargetRef = useRef({ col: null, card: null });
    const [dragType, setDragType] = useState(null);
    const [dragSourceCol, setDragSourceCol] = useState(null);
    const [dragOverCol, setDragOverCol] = useState(null);
    const [dragOverCard, setDragOverCard] = useState(null);

    const saveOrderTimer = useRef(null);
    const pendingSave = useRef(false);
    const boardScrollRef = useRef(null);

    const items = data.lists.projects || [];

    const columns = useMemo(() => {
        const cols = [];
        let currentCol = null;
        const uncategorized = [];

        items.forEach(item => {
            if (item.is_section) {
                currentCol = { section: item, cards: [] };
                cols.push(currentCol);
            } else if (currentCol) {
                currentCol.cards.push(item);
            } else {
                uncategorized.push(item);
            }
        });

        if (uncategorized.length > 0 && cols.length === 0) {
            cols.push({ section: { id: '__uncategorized__', text: 'To Do', is_section: true }, cards: uncategorized });
        } else if (uncategorized.length > 0) {
            cols[0].cards = [...uncategorized, ...cols[0].cards];
        }

        return cols;
    }, [items]);

    const rebuildItemsFromColumns = useCallback((newColumns) => {
        const flat = [];
        newColumns.forEach(col => {
            if (col.section.id !== '__uncategorized__') {
                flat.push(col.section);
            }
            col.cards.forEach(card => flat.push(card));
        });
        return flat;
    }, []);

    const persistOrder = useCallback((newItems) => {
        setData(prev => ({
            ...prev,
            lists: { ...prev.lists, projects: newItems },
        }));

        if (useBackend) {
            pendingSave.current = true;
            clearTimeout(saveOrderTimer.current);
            saveOrderTimer.current = setTimeout(async () => {
                await updateData(
                    async () => {
                        await Promise.all(
                            newItems.map((item, index) =>
                                propertyAPI.updateListItem(item.id, { sort_order: index })
                            )
                        );
                        pendingSave.current = false;
                    },
                    null,
                    { skipRefetch: true }
                );
            }, 400);
        }
    }, [setData, useBackend, updateData]);

    const optimisticListUpdate = useCallback((updater) => {
        const apply = () => setData(prev => ({
            ...prev,
            lists: { ...prev.lists, projects: updater(prev.lists.projects) },
        }));
        return apply;
    }, [setData]);

    // ---- Card CRUD ----
    const addCard = async (columnIndex) => {
        if (!newCardText.trim()) return;
        const text = newCardText;
        const tempId = generateId();
        setNewCardText('');
        setAddingToColumn(null);

        const newCols = columns.map((col, i) => {
            if (i !== columnIndex) return col;
            return { ...col, cards: [...col.cards, { id: tempId, text, completed: false, is_section: false, description: '', labels: [], due_date: '' }] };
        });
        const newItems = rebuildItemsFromColumns(newCols);
        const nextSortOrder = newItems.length - 1;

        const newItem = { text, completed: false, is_section: false, sort_order: nextSortOrder };
        const apply = optimisticListUpdate(() => newItems);

        await updateData(
            async () => {
                if (useBackend) {
                    await propertyAPI.addListItem('projects', newItem);
                } else {
                    apply();
                }
            },
            apply,
            ['projects']
        );
        showToast('Card added!');
    };

    const addColumn = async () => {
        if (!newColumnName.trim()) return;
        const text = newColumnName;
        const tempId = generateId();
        setNewColumnName('');
        setAddingColumn(false);

        const newSection = { text, is_section: true, completed: false, sort_order: items.length };
        const apply = optimisticListUpdate(list => [...list, { ...newSection, id: tempId }]);

        await updateData(
            async () => {
                if (useBackend) {
                    await propertyAPI.addListItem('projects', newSection);
                } else {
                    apply();
                }
            },
            apply,
            ['projects']
        );
        showToast('Column added!');
    };

    const deleteItem = async (id) => {
        setConfirmDelete(null);
        setOpenCardId(null);
        const apply = optimisticListUpdate(list => list.filter(item => item.id !== id));

        await updateData(
            async () => {
                if (useBackend) {
                    await propertyAPI.deleteListItem(id);
                } else {
                    apply();
                }
            },
            apply,
            { affectedLists: ['projects'] }
        );
        showToast('Deleted');
    };

    const updateCardField = async (cardId, field, value) => {
        const apply = optimisticListUpdate(list =>
            list.map(item => item.id === cardId ? { ...item, [field]: value } : item)
        );

        const backendValue = field === 'due_date' && value === '' ? null : value;

        await updateData(
            async () => {
                if (useBackend) {
                    await propertyAPI.updateListItem(cardId, { [field]: backendValue });
                } else {
                    apply();
                }
            },
            apply,
            { skipRefetch: true }
        );
    };

    const renameColumn = async (sectionId, newName) => {
        setEditingColumnId(null);
        const apply = optimisticListUpdate(list =>
            list.map(item => item.id === sectionId ? { ...item, text: newName } : item)
        );
        await updateData(
            async () => {
                if (useBackend) {
                    await propertyAPI.updateListItem(sectionId, { text: newName });
                } else {
                    apply();
                }
            },
            apply,
            { skipRefetch: true }
        );
    };

    const toggleCardComplete = async (cardId) => {
        const card = items.find(i => i.id === cardId);
        if (!card) return;
        await updateCardField(cardId, 'completed', !card.completed);
    };

    // ---- Drag & Drop (HTML5) ----
    const handleColumnDragStart = (e, colIdx) => {
        dragState.current = { type: 'column', sourceColIdx: colIdx };
        setDragType('column');
        setDragSourceCol(colIdx);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', '');
    };

    const handleColumnDragOver = (e, colIdx) => {
        e.preventDefault();
        if (dragState.current.type !== 'column') return;
        setDragOverCol(colIdx);
    };

    const handleColumnDrop = (e, colIdx) => {
        e.preventDefault();
        if (dragState.current.type !== 'column') return;
        const from = dragState.current.sourceColIdx;
        if (from === colIdx) return;

        const newCols = Array.from(columns);
        const [moved] = newCols.splice(from, 1);
        newCols.splice(colIdx, 0, moved);
        persistOrder(rebuildItemsFromColumns(newCols));
    };

    const handleCardDragStart = (e, colIdx, cardIdx) => {
        e.stopPropagation();
        dragState.current = { type: 'card', sourceColIdx: colIdx, cardIdx };
        setDragType('card');
        setDragSourceCol(colIdx);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', '');
    };

    const handleCardDragOver = (e, colIdx, cardIdx) => {
        e.preventDefault();
        e.stopPropagation();
        if (dragState.current.type !== 'card') return;
        setDragOverCol(colIdx);
        setDragOverCard(cardIdx);
    };

    const handleColumnBodyDragOver = (e, colIdx) => {
        e.preventDefault();
        if (dragState.current.type !== 'card') return;
        setDragOverCol(colIdx);
        setDragOverCard(columns[colIdx]?.cards.length ?? 0);
    };

    const handleCardDrop = (e, targetColIdx, targetCardIdx) => {
        e.preventDefault();
        e.stopPropagation();
        if (dragState.current.type !== 'card') return;

        const { sourceColIdx, cardIdx } = dragState.current;
        const newCols = columns.map(col => ({ ...col, cards: [...col.cards] }));
        const [movedCard] = newCols[sourceColIdx].cards.splice(cardIdx, 1);
        const insertIdx = targetCardIdx !== undefined ? targetCardIdx : newCols[targetColIdx].cards.length;
        newCols[targetColIdx].cards.splice(insertIdx, 0, movedCard);
        persistOrder(rebuildItemsFromColumns(newCols));
    };

    const handleDragEnd = () => {
        dragState.current = { type: null };
        setDragType(null);
        setDragSourceCol(null);
        setDragOverCol(null);
        setDragOverCard(null);
    };

    // ---- Touch DnD for cards ----
    const handleCardTouchStart = (e, colIdx, cardIdx) => {
        const touch = e.touches[0];
        const touchId = touch.identifier;
        dragState.current = { type: 'card', sourceColIdx: colIdx, cardIdx, touchId, startX: touch.clientX, startY: touch.clientY, started: false };
        touchTargetRef.current = { col: null, card: null };

        const handleTouchMove = (moveEvent) => {
            let t = null;
            for (let i = 0; i < moveEvent.touches.length; i++) {
                if (moveEvent.touches[i].identifier === touchId) { t = moveEvent.touches[i]; break; }
            }
            if (!t) return;

            if (!dragState.current.started) {
                const dx = Math.abs(t.clientX - dragState.current.startX);
                const dy = Math.abs(t.clientY - dragState.current.startY);
                if (dx < 8 && dy < 8) return;
                dragState.current.started = true;
                setDragType('card');
                setDragSourceCol(colIdx);
                if (window.navigator.vibrate) window.navigator.vibrate(50);
            }

            if (moveEvent.cancelable) moveEvent.preventDefault();

            const el = document.elementFromPoint(t.clientX, t.clientY);
            if (el) {
                const colEl = el.closest('[data-kanban-col]');
                const cardEl = el.closest('[data-kanban-card]');
                if (colEl) {
                    const cIdx = parseInt(colEl.getAttribute('data-kanban-col'));
                    touchTargetRef.current.col = cIdx;
                    setDragOverCol(cIdx);
                    if (cardEl) {
                        const ci = parseInt(cardEl.getAttribute('data-kanban-card'));
                        touchTargetRef.current.card = ci;
                        setDragOverCard(ci);
                    } else {
                        touchTargetRef.current.card = columns[cIdx]?.cards.length ?? 0;
                        setDragOverCard(touchTargetRef.current.card);
                    }
                }
            }
        };

        const handleTouchEnd = (endEvent) => {
            let ended = true;
            if (endEvent.touches) {
                for (let i = 0; i < endEvent.touches.length; i++) {
                    if (endEvent.touches[i].identifier === touchId) { ended = false; break; }
                }
            }
            if (!ended) return;

            if (dragState.current.started && touchTargetRef.current.col !== null) {
                const { sourceColIdx: sCol, cardIdx: cIdx } = dragState.current;
                const targetCol = touchTargetRef.current.col;
                const targetCard = touchTargetRef.current.card;
                const newCols = columns.map(col => ({ ...col, cards: [...col.cards] }));
                const [movedCard] = newCols[sCol].cards.splice(cIdx, 1);
                const insertIdx = targetCard !== undefined && targetCard !== null ? targetCard : newCols[targetCol].cards.length;
                const adjustedIdx = (sCol === targetCol && cIdx < insertIdx) ? Math.max(0, insertIdx - 1) : insertIdx;
                newCols[targetCol].cards.splice(adjustedIdx, 0, movedCard);
                persistOrder(rebuildItemsFromColumns(newCols));
            }

            handleDragEnd();
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            document.removeEventListener('touchcancel', handleTouchEnd);
        };

        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: false });
        document.addEventListener('touchcancel', handleTouchEnd, { passive: false });
    };

    useEffect(() => {
        return () => clearTimeout(saveOrderTimer.current);
    }, []);

    // ---- Open card detail ----
    const openCard = items.find(i => i.id === openCardId);

    // ---- Render ----
    return (
        <div className="h-full flex flex-col">
            {/* Board Header */}
            <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
                <button
                    onClick={() => setAddingColumn(true)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-sm font-semibold hover:bg-emerald-600 transition-colors"
                >
                    <Icons.Plus />
                    <span className="hidden sm:inline">Add Column</span>
                </button>
            </div>

            {/* Kanban Board - horizontal scroll on desktop, vertical on mobile */}
            <div
                ref={boardScrollRef}
                className="flex-1 overflow-x-auto overflow-y-auto md:overflow-y-hidden px-4 pb-4 kanban-scroll"
            >
                <div className="flex flex-row gap-3 h-full items-start min-h-0 snap-x snap-mandatory md:snap-none pr-4">

                    {columns.map((col, colIdx) => (
                        <div
                            key={col.section.id}
                            data-kanban-col={colIdx}
                            draggable={true}
                            onDragStart={(e) => handleColumnDragStart(e, colIdx)}
                            onDragOver={(e) => handleColumnDragOver(e, colIdx)}
                            onDrop={(e) => {
                                if (dragState.current.type === 'column') handleColumnDrop(e, colIdx);
                                else if (dragState.current.type === 'card') handleCardDrop(e, colIdx);
                            }}
                            onDragEnd={handleDragEnd}
                            className={`
                                bg-gray-100 rounded-xl flex flex-col
                                w-[80vw] min-w-[80vw] md:w-72 md:min-w-[18rem] md:max-w-[18rem]
                                max-h-full flex-shrink-0 snap-center
                                transition-all duration-150
                                ${dragType === 'column' && dragOverCol === colIdx && dragSourceCol !== colIdx ? 'ring-2 ring-emerald-400 ring-offset-2' : ''}
                                ${dragType === 'column' && dragSourceCol === colIdx ? 'opacity-50' : ''}
                            `}
                        >
                            {/* Column Header */}
                            <div className="px-3 py-2.5 flex items-center gap-2 group">
                                <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-0.5 hidden md:block">
                                    <Icons.DragHandle />
                                </div>
                                {editingColumnId === col.section.id ? (
                                    <input
                                        type="text"
                                        value={editingColumnName}
                                        onChange={(e) => setEditingColumnName(e.target.value)}
                                        onBlur={() => {
                                            if (editingColumnName.trim()) renameColumn(col.section.id, editingColumnName.trim());
                                            else setEditingColumnId(null);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && editingColumnName.trim()) renameColumn(col.section.id, editingColumnName.trim());
                                            if (e.key === 'Escape') setEditingColumnId(null);
                                        }}
                                        className="flex-1 font-bold text-sm text-gray-700 bg-white px-2 py-1 rounded border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                        autoFocus
                                    />
                                ) : (
                                    <h3
                                        onClick={() => { setEditingColumnId(col.section.id); setEditingColumnName(col.section.text); }}
                                        className="flex-1 font-bold text-sm text-gray-700 uppercase tracking-wide cursor-pointer hover:text-emerald-600 truncate"
                                    >
                                        {col.section.text}
                                    </h3>
                                )}
                                <span className="text-xs text-gray-400 font-semibold bg-gray-200 px-1.5 py-0.5 rounded-full">{col.cards.length}</span>
                                <div className="relative">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setColumnMenuId(columnMenuId === col.section.id ? null : col.section.id); }}
                                        className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity md:opacity-100"
                                    >
                                        <Icons.MoreHorizontal />
                                    </button>
                                    {columnMenuId === col.section.id && (
                                        <>
                                            <div className="fixed inset-0 z-30" onClick={() => setColumnMenuId(null)} />
                                            <div className="absolute right-0 top-8 bg-white rounded-lg shadow-xl border z-40 py-1 w-44">
                                                <button
                                                    onClick={() => { setAddingToColumn(colIdx); setColumnMenuId(null); }}
                                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                                                >
                                                    <Icons.Plus /> Add a card
                                                </button>
                                                <button
                                                    onClick={() => { setEditingColumnId(col.section.id); setEditingColumnName(col.section.text); setColumnMenuId(null); }}
                                                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                                                >
                                                    <Icons.Edit /> Rename
                                                </button>
                                                {col.section.id !== '__uncategorized__' && (
                                                    <button
                                                        onClick={() => { setConfirmDelete(col.section.id); setColumnMenuId(null); }}
                                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                    >
                                                        <Icons.Trash /> Delete column
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Cards */}
                            <div
                                className="flex-1 overflow-y-auto px-2 pb-2 space-y-2 min-h-[4rem] kanban-scroll"
                                onDragOver={(e) => handleColumnBodyDragOver(e, colIdx)}
                                onDrop={(e) => { if (dragState.current.type === 'card') handleCardDrop(e, colIdx); }}
                            >
                                {col.cards.map((card, cardIdx) => (
                                    <div
                                        key={card.id}
                                        data-kanban-card={cardIdx}
                                        draggable={true}
                                        onDragStart={(e) => handleCardDragStart(e, colIdx, cardIdx)}
                                        onDragOver={(e) => handleCardDragOver(e, colIdx, cardIdx)}
                                        onDrop={(e) => handleCardDrop(e, colIdx, cardIdx)}
                                        onDragEnd={handleDragEnd}
                                        onTouchStart={(e) => {
                                            const handle = e.target.closest('[data-drag-handle]');
                                            if (handle) handleCardTouchStart(e, colIdx, cardIdx);
                                        }}
                                        onClick={() => setOpenCardId(card.id)}
                                        className={`
                                            bg-white rounded-lg shadow-sm border border-gray-200 p-3 cursor-pointer
                                            hover:shadow-md hover:border-gray-300 transition-all group/card
                                            ${card.completed ? 'opacity-60' : ''}
                                            ${dragType === 'card' && dragOverCol === colIdx && dragOverCard === cardIdx ? 'border-t-2 border-t-emerald-400' : ''}
                                            ${dragType === 'card' && dragSourceCol === colIdx && dragState.current.cardIdx === cardIdx ? 'opacity-30 scale-95' : ''}
                                        `}
                                    >
                                        {/* Labels */}
                                        {card.labels && card.labels.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-2">
                                                {card.labels.map(labelId => {
                                                    const lbl = KANBAN_LABEL_COLORS.find(l => l.id === labelId);
                                                    return lbl ? <span key={labelId} className={`${lbl.bg} h-2 w-10 rounded-full inline-block`} /> : null;
                                                })}
                                            </div>
                                        )}
                                        <div className="flex items-start gap-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleCardComplete(card.id); }}
                                                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                                                    card.completed ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 hover:border-emerald-400'
                                                }`}
                                            >
                                                {card.completed && <Icons.Check />}
                                            </button>
                                            <span className={`flex-1 text-sm leading-snug ${card.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                                                {card.text}
                                            </span>
                                            <div
                                                data-drag-handle
                                                className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing p-0.5 touch-none opacity-0 group-hover/card:opacity-100 md:opacity-60 transition-opacity"
                                            >
                                                <Icons.DragHandle />
                                            </div>
                                        </div>
                                        {/* Card badges */}
                                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                                            {card.due_date && (
                                                <span className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${
                                                    new Date(card.due_date) < new Date() && !card.completed ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                    <Icons.Clock />
                                                    {new Date(card.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                </span>
                                            )}
                                            {card.description && (
                                                <span className="flex items-center gap-1 text-xs text-gray-400">
                                                    <Icons.AlignLeft />
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {/* Drop zone indicator for empty columns or bottom */}
                                {dragType === 'card' && dragOverCol === colIdx && col.cards.length === 0 && (
                                    <div className="h-16 border-2 border-dashed border-emerald-300 rounded-lg bg-emerald-50 flex items-center justify-center">
                                        <span className="text-emerald-400 text-xs font-medium">Drop here</span>
                                    </div>
                                )}
                            </div>

                            {/* Add card button / form */}
                            {addingToColumn === colIdx ? (
                                <div className="px-2 pb-2">
                                    <textarea
                                        value={newCardText}
                                        onChange={(e) => setNewCardText(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); addCard(colIdx); } if (e.key === 'Escape') setAddingToColumn(null); }}
                                        placeholder="Enter a title for this card..."
                                        className="w-full p-2 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                        rows={2}
                                        autoFocus
                                    />
                                    <div className="flex items-center gap-2 mt-1">
                                        <button onClick={() => addCard(colIdx)} disabled={!newCardText.trim()} className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold disabled:bg-gray-300 hover:bg-emerald-600">
                                            Add card
                                        </button>
                                        <button onClick={() => { setAddingToColumn(null); setNewCardText(''); }} className="text-gray-500 hover:text-gray-700 p-1">
                                            <Icons.X />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setAddingToColumn(colIdx)}
                                    className="mx-2 mb-2 px-2 py-1.5 text-gray-500 hover:bg-gray-200 rounded-lg text-sm flex items-center gap-1 transition-colors"
                                >
                                    <Icons.Plus />
                                    <span>Add a card</span>
                                </button>
                            )}
                        </div>
                    ))}

                    {/* Add column */}
                    {addingColumn ? (
                        <div className="bg-gray-100 rounded-xl p-3 w-[80vw] min-w-[80vw] md:w-72 md:min-w-[18rem] flex-shrink-0 snap-center">
                            <input
                                type="text"
                                value={newColumnName}
                                onChange={(e) => setNewColumnName(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') addColumn(); if (e.key === 'Escape') setAddingColumn(false); }}
                                placeholder="Enter column title..."
                                className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 mb-2"
                                autoFocus
                            />
                            <div className="flex items-center gap-2">
                                <button onClick={addColumn} disabled={!newColumnName.trim()} className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm font-semibold disabled:bg-gray-300">Add column</button>
                                <button onClick={() => { setAddingColumn(false); setNewColumnName(''); }} className="text-gray-500 hover:text-gray-700 p-1"><Icons.X /></button>
                            </div>
                        </div>
                    ) : columns.length > 0 ? (
                        <button
                            onClick={() => setAddingColumn(true)}
                            className="bg-white bg-opacity-80 hover:bg-opacity-100 border-2 border-dashed border-gray-300 hover:border-emerald-400 rounded-xl p-4 w-[80vw] min-w-[80vw] md:w-72 md:min-w-[18rem] flex-shrink-0 snap-center text-gray-500 hover:text-emerald-600 font-semibold text-sm flex items-center justify-center gap-1 transition-all"
                        >
                            <Icons.Plus /> Add another column
                        </button>
                    ) : null}
                </div>
            </div>

            {/* Card Detail Modal - Trello-style */}
            {openCard && (
                <KanbanCardModal
                    card={openCard}
                    columnName={columns.find(c => c.cards.some(cd => cd.id === openCard.id))?.section.text || ''}
                    onClose={() => setOpenCardId(null)}
                    onUpdateField={updateCardField}
                    onToggleComplete={toggleCardComplete}
                    onDelete={(id) => setConfirmDelete(id)}
                    showToast={showToast}
                />
            )}

            {/* Confirm Delete */}
            {confirmDelete && (
                <ConfirmDialog
                    message="Delete this item? This cannot be undone."
                    onConfirm={() => deleteItem(confirmDelete)}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}
        </div>
    );
}

// Trello-style card detail modal
function KanbanCardModal({ card, columnName, onClose, onUpdateField, onToggleComplete, onDelete, showToast }) {
    const [editingTitle, setEditingTitle] = useState(false);
    const [titleText, setTitleText] = useState(card.text);
    const [descText, setDescText] = useState(card.description || '');
    const [editingDesc, setEditingDesc] = useState(false);
    const [showLabels, setShowLabels] = useState(false);
    const [showDueDate, setShowDueDate] = useState(false);
    const descRef = useRef(null);

    useEffect(() => {
        setTitleText(card.text);
        setDescText(card.description || '');
    }, [card.id, card.text, card.description]);

    const saveTitle = () => {
        if (titleText.trim() && titleText !== card.text) {
            onUpdateField(card.id, 'text', titleText.trim());
        }
        setEditingTitle(false);
    };

    const saveDescription = () => {
        if (descText !== (card.description || '')) {
            onUpdateField(card.id, 'description', descText);
            showToast('Description saved');
        }
        setEditingDesc(false);
    };

    const toggleLabel = (labelId) => {
        const currentLabels = card.labels || [];
        const newLabels = currentLabels.includes(labelId)
            ? currentLabels.filter(l => l !== labelId)
            : [...currentLabels, labelId];
        onUpdateField(card.id, 'labels', newLabels);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-start justify-center overflow-y-auto" onClick={onClose}>
            <div
                className="bg-gray-50 rounded-xl shadow-2xl w-full max-w-2xl my-8 mx-4 md:my-16 relative"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 z-10">
                    <Icons.X />
                </button>

                {/* Card cover labels bar */}
                {card.labels && card.labels.length > 0 && (
                    <div className="flex gap-1 p-4 pb-0">
                        {card.labels.map(labelId => {
                            const lbl = KANBAN_LABEL_COLORS.find(l => l.id === labelId);
                            return lbl ? <span key={labelId} className={`${lbl.bg} h-3 flex-1 rounded-t-lg max-w-[4rem]`} /> : null;
                        })}
                    </div>
                )}

                <div className="p-6">
                    {/* Title */}
                    <div className="flex items-start gap-3 mb-1">
                        <button
                            onClick={() => onToggleComplete(card.id)}
                            className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-colors ${
                                card.completed ? 'bg-emerald-500 border-emerald-500' : 'border-gray-300 hover:border-emerald-400'
                            }`}
                        >
                            {card.completed && <Icons.Check />}
                        </button>
                        {editingTitle ? (
                            <textarea
                                value={titleText}
                                onChange={(e) => setTitleText(e.target.value)}
                                onBlur={saveTitle}
                                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveTitle(); } if (e.key === 'Escape') { setTitleText(card.text); setEditingTitle(false); } }}
                                className="flex-1 text-xl font-bold text-gray-800 bg-white p-2 rounded border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                                rows={1}
                                autoFocus
                            />
                        ) : (
                            <h2
                                onClick={() => setEditingTitle(true)}
                                className={`flex-1 text-xl font-bold cursor-pointer hover:bg-gray-100 rounded px-2 py-1 -mx-2 -my-1 ${card.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}
                            >
                                {card.text}
                            </h2>
                        )}
                    </div>
                    <p className="text-xs text-gray-400 ml-9 mb-6">in column <span className="font-semibold text-gray-500">{columnName}</span></p>

                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Main content */}
                        <div className="flex-1 space-y-6 min-w-0">
                            {/* Labels display */}
                            {card.labels && card.labels.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Labels</h4>
                                    <div className="flex flex-wrap gap-1.5">
                                        {card.labels.map(labelId => {
                                            const lbl = KANBAN_LABEL_COLORS.find(l => l.id === labelId);
                                            return lbl ? (
                                                <span key={labelId} className={`${lbl.bg} ${lbl.text} text-xs font-semibold px-3 py-1 rounded cursor-pointer hover:opacity-80`} onClick={() => setShowLabels(true)}>
                                                    {lbl.name}
                                                </span>
                                            ) : null;
                                        })}
                                        <button onClick={() => setShowLabels(true)} className="text-gray-400 hover:bg-gray-200 rounded px-2 py-1 text-xs">+</button>
                                    </div>
                                </div>
                            )}

                            {/* Due date display */}
                            {card.due_date && (
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Due date</h4>
                                    <button
                                        onClick={() => setShowDueDate(true)}
                                        className={`flex items-center gap-2 text-sm px-3 py-1.5 rounded ${
                                            new Date(card.due_date) < new Date() && !card.completed
                                                ? 'bg-red-100 text-red-700'
                                                : card.completed
                                                    ? 'bg-emerald-100 text-emerald-700'
                                                    : 'bg-gray-200 text-gray-700'
                                        }`}
                                    >
                                        <Icons.Clock />
                                        {new Date(card.due_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                        {card.completed && <span className="bg-emerald-500 text-white text-xs px-1.5 py-0.5 rounded ml-1">Complete</span>}
                                    </button>
                                </div>
                            )}

                            {/* Description */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Icons.AlignLeft />
                                    <h4 className="text-sm font-bold text-gray-700">Description</h4>
                                    {!editingDesc && card.description && (
                                        <button onClick={() => setEditingDesc(true)} className="text-xs text-gray-400 hover:text-gray-600 bg-gray-200 hover:bg-gray-300 px-2 py-0.5 rounded ml-auto">
                                            Edit
                                        </button>
                                    )}
                                </div>
                                {editingDesc ? (
                                    <div>
                                        <textarea
                                            ref={descRef}
                                            value={descText}
                                            onChange={(e) => setDescText(e.target.value)}
                                            className="w-full p-3 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-400 min-h-[120px]"
                                            placeholder="Add a more detailed description..."
                                            autoFocus
                                        />
                                        <div className="flex items-center gap-2 mt-2">
                                            <button onClick={saveDescription} className="bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-emerald-600">Save</button>
                                            <button onClick={() => { setDescText(card.description || ''); setEditingDesc(false); }} className="text-gray-500 hover:text-gray-700 px-3 py-1.5 text-sm">Cancel</button>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        onClick={() => setEditingDesc(true)}
                                        className={`p-3 rounded-lg text-sm cursor-pointer min-h-[80px] ${
                                            card.description ? 'text-gray-700 bg-white border hover:bg-gray-50 whitespace-pre-wrap' : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                                        }`}
                                    >
                                        {card.description || 'Add a more detailed description...'}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Sidebar actions */}
                        <div className="md:w-44 space-y-2 flex-shrink-0">
                            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 hidden md:block">Add to card</h4>

                            <button
                                onClick={() => setShowLabels(!showLabels)}
                                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium py-2 px-3 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <Icons.Label /> Labels
                            </button>

                            <button
                                onClick={() => setShowDueDate(!showDueDate)}
                                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium py-2 px-3 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <Icons.Clock /> Due date
                            </button>

                            <hr className="my-3 border-gray-300" />

                            <button
                                onClick={() => onDelete(card.id)}
                                className="w-full bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium py-2 px-3 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <Icons.Trash /> Delete
                            </button>
                        </div>
                    </div>
                </div>

                {/* Labels picker popover */}
                {showLabels && (
                    <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-2xl border p-4 w-72 z-50">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-sm text-gray-700">Labels</h4>
                            <button onClick={() => setShowLabels(false)} className="text-gray-400 hover:text-gray-600"><Icons.X /></button>
                        </div>
                        <div className="space-y-1.5">
                            {KANBAN_LABEL_COLORS.map(lbl => (
                                <button
                                    key={lbl.id}
                                    onClick={() => toggleLabel(lbl.id)}
                                    className={`w-full flex items-center gap-2 p-2 rounded-lg hover:opacity-90 transition-colors ${lbl.bg} ${lbl.text}`}
                                >
                                    <span className="flex-1 text-sm font-semibold text-left">{lbl.name}</span>
                                    {(card.labels || []).includes(lbl.id) && <Icons.Check />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Due date picker popover */}
                {showDueDate && (
                    <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-2xl border p-4 w-72 z-50">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-sm text-gray-700">Due date</h4>
                            <button onClick={() => setShowDueDate(false)} className="text-gray-400 hover:text-gray-600"><Icons.X /></button>
                        </div>
                        <input
                            type="date"
                            value={card.due_date || ''}
                            onChange={(e) => { onUpdateField(card.id, 'due_date', e.target.value); }}
                            className="w-full p-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 mb-3"
                        />
                        <div className="flex gap-2">
                            <button onClick={() => setShowDueDate(false)} className="flex-1 bg-emerald-500 text-white py-2 rounded-lg text-sm font-semibold hover:bg-emerald-600">Done</button>
                            {card.due_date && (
                                <button onClick={() => { onUpdateField(card.id, 'due_date', ''); setShowDueDate(false); }} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300">
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

const ALL_LIST_TYPES = [
    { id: 'tasks', label: 'Tasks' },
    { id: 'thingsToBuy', label: 'Things to Buy' },
    { id: 'leaving', label: 'Leaving Checklist', toggleField: 'checked', hasSections: false, hasLogbook: false, hasUncheckAll: true },
    { id: 'annual', label: 'Annual Jobs', toggleField: 'checked', hasSections: false, hasLogbook: false, hasUncheckAll: true },
];

function ListsView(props) {
    return (
        <DraggableListView
            {...props}
            title="Lists"
            listTypes={ALL_LIST_TYPES}
            defaultList="tasks"
            toggleField="completed"
            hasSections={true}
            hasLogbook={true}
            hasUncheckAll={false}
        />
    );
}

// Calendar Grid Component for visual month view
const CalendarGrid = memo(({ bookings, startMonth, onDateClick }) => {
    // Pre-compute a lookup map: dateString -> booking[] for the visible month
    const bookingsByDate = useMemo(() => {
        const date = new Date(startMonth);
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const map = {};

        for (let day = 1; day <= daysInMonth; day++) {
            const checkDate = new Date(year, month, day);
            const key = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            map[key] = bookings.filter(booking => {
                const start = new Date(booking.startDate);
                const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
                const end = new Date(booking.endDate);
                const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
                return checkDate >= startDay && checkDate < endDay;
            });
        }
        return map;
    }, [bookings, startMonth]);

    const getDateKey = (date) =>
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    const getDayClass = (bookingsOnDate) => {
        if (bookingsOnDate.length === 0) return 'bg-green-100 hover:bg-green-50';
        const hasBooked = bookingsOnDate.some(b => b.status === 'Booked');
        const hasTentative = bookingsOnDate.some(b => b.status === 'Tentative');
        if (hasBooked && hasTentative) return 'bg-gradient-to-br from-red-300 to-yellow-300';
        if (hasBooked) return 'bg-red-300';
        if (hasTentative) return 'bg-yellow-300';
        return 'bg-green-100 hover:bg-green-50';
    };

    const renderMonth = (monthOffset) => {
        const date = new Date(startMonth);
        date.setMonth(date.getMonth() + monthOffset);
        
        const year = date.getFullYear();
        const month = date.getMonth();
        const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        const days = [];
        
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="h-10 md:h-12"></div>);
        }
        
        const todayStr = new Date().toDateString();

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, month, day);
            const key = getDateKey(currentDate);
            const bookingsOnDate = bookingsByDate[key] || [];
            const isToday = todayStr === currentDate.toDateString();
            
            days.push(
                <div
                    key={day}
                    onClick={() => onDateClick && onDateClick(currentDate, bookingsOnDate)}
                    className={`h-10 md:h-12 flex flex-col items-center justify-center text-sm cursor-pointer border border-gray-200 ${getDayClass(bookingsOnDate)} ${isToday ? 'ring-2 ring-emerald-500' : ''}`}
                >
                    <span className={`${isToday ? 'font-bold' : ''}`}>{day}</span>
                    {bookingsOnDate.length > 0 && (
                        <span className="text-xs text-gray-700">•</span>
                    )}
                </div>
            );
        }
        
        return (
            <div key={monthOffset} className="bg-white rounded-lg shadow-sm p-3 md:p-4">
                <h3 className="font-semibold text-gray-800 mb-2 text-center">{monthName}</h3>
                <div className="grid grid-cols-7 gap-0.5 md:gap-1 mb-1">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-xs font-semibold text-gray-600 text-center py-1">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-0.5 md:gap-1">
                    {days}
                </div>
            </div>
        );
    };

    return (
        <div>
            {renderMonth(0)}
        </div>
    );
});

function CalendarView({ data, setData, showToast, useBackend, updateData }) {
    const [showAddBooking, setShowAddBooking] = useState(false);
    const [editingBooking, setEditingBooking] = useState(null);
    const [showPastBookings, setShowPastBookings] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'calendar' or 'list' - default to list for easy access
    const [calendarStartMonth, setCalendarStartMonth] = useState(new Date());
    const [newBooking, setNewBooking] = useState({
        startDate: '',
        endDate: '',
        guest: '',
        status: 'Booked',
    });
    const [confirmDelete, setConfirmDelete] = useState(null);

    const addBooking = async () => {
        if (!newBooking.startDate || !newBooking.endDate || !newBooking.guest) return;
        const bookingToAdd = { ...newBooking };
        setNewBooking({ startDate: '', endDate: '', guest: '', status: 'Booked' });
        setShowAddBooking(false);
        await updateData(async () => {
            if (useBackend) {
                await propertyAPI.addCalendarBooking(bookingToAdd);
            } else {
                setData(prev => ({
                    ...prev,
                    calendar: [...prev.calendar, { id: generateId(), ...bookingToAdd }].sort((a, b) =>
                        new Date(a.startDate) - new Date(b.startDate)
                    ),
                }));
            }
        });
        showToast('Booking added successfully!');
    };

    const updateBooking = async () => {
        if (!editingBooking.startDate || !editingBooking.endDate || !editingBooking.guest) return;
        const booking = { ...editingBooking };
        setEditingBooking(null);
        await updateData(async () => {
            if (useBackend) {
                await propertyAPI.updateCalendarBooking(booking.id, {
                    startDate: booking.startDate,
                    endDate: booking.endDate,
                    guest: booking.guest,
                    status: booking.status,
                });
            } else {
                setData(prev => ({
                    ...prev,
                    calendar: prev.calendar.map(b => b.id === booking.id ? booking : b)
                        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate)),
                }));
            }
        });
        showToast('Booking updated successfully!');
    };

    const deleteBooking = async (id) => {
        setConfirmDelete(null);
        await updateData(async () => {
            if (useBackend) {
                await propertyAPI.deleteCalendarBooking(id);
            } else {
                setData(prev => ({ ...prev, calendar: prev.calendar.filter(b => b.id !== id) }));
            }
        });
        showToast('Booking deleted');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getDuration = (start, end) => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        return `${days} night${days !== 1 ? 's' : ''}`;
    };

    const isPast = (endDate) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return new Date(endDate) < today;
    };

    // Separate past and upcoming bookings
    const upcomingBookings = data.calendar.filter(b => !isPast(b.endDate));
    const pastBookings = data.calendar.filter(b => isPast(b.endDate)).sort((a, b) => 
        new Date(b.endDate) - new Date(a.endDate) // Most recent first
    );

    const renderBookingCard = (booking, isPastBooking = false) => {
        // Normalize today's date to midnight for accurate comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const start = new Date(booking.startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(booking.endDate);
        end.setHours(0, 0, 0, 0);
        
        // A booking is active from startDate (inclusive) to endDate (exclusive)
        // On checkout day (endDate), the property is no longer occupied
        const isActive = today >= start && today < end;
        const status = booking.status || 'Booked';
        
        return (
            <div
                key={booking.id}
                className={`bg-white rounded-lg shadow p-4 border-l-4 ${
                    isActive ? 'border-emerald-500' : 
                    status === 'Tentative' ? 'border-orange-500' : 'border-blue-500'
                } ${isPastBooking ? 'opacity-75' : ''}`}
            >
                <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                        <div className="font-bold text-lg text-gray-800">
                            {booking.guest}
                        </div>
                        <div className="flex gap-2 mt-1 flex-wrap">
                            {isActive && (
                                <span className="inline-block bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full">
                                    Currently Occupied
                                </span>
                            )}
                            <span className={`inline-block text-xs px-2 py-1 rounded-full ${
                                status === 'Tentative' 
                                    ? 'bg-orange-100 text-orange-700' 
                                    : 'bg-blue-100 text-blue-700'
                            }`}>
                                {status}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {!isPastBooking && (
                            <button
                                onClick={() => setEditingBooking(booking)}
                                className="text-blue-500 p-1"
                            >
                                <Icons.Edit />
                            </button>
                        )}
                    </div>
                </div>
                <div className="text-gray-600 text-sm space-y-1">
                    <div>
                        <span className="font-semibold">Check-in:</span>{' '}
                        {formatDate(booking.startDate)}
                    </div>
                    <div>
                        <span className="font-semibold">Check-out:</span>{' '}
                        {formatDate(booking.endDate)}
                    </div>
                    <div className="text-gray-500">
                        {getDuration(booking.startDate, booking.endDate)}
                    </div>
                </div>
            </div>
        );
    };

    const handleDateClick = (date, bookingsOnDate) => {
        if (bookingsOnDate.length > 0) {
            // If there's a booking, open edit modal with the first booking
            setEditingBooking(bookingsOnDate[0]);
        } else {
            // If date is free, open new booking modal with date pre-filled
            const dateStr = date.toISOString().split('T')[0];
            setNewBooking({
                startDate: dateStr,
                endDate: dateStr,
                guest: '',
                status: 'Booked',
            });
            setShowAddBooking(true);
        }
    };

    const navigateCalendar = (direction) => {
        const newDate = new Date(calendarStartMonth);
        newDate.setMonth(newDate.getMonth() + (direction === 'forward' ? 1 : -1));
        setCalendarStartMonth(newDate);
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Occupancy Calendar</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowAddBooking(!showAddBooking)}
                        className={`p-2 rounded-full ${
                            showAddBooking ? 'bg-red-500' : 'bg-emerald-500'
                        } text-white shadow-lg`}
                    >
                        {showAddBooking ? <Icons.X /> : <Icons.Plus />}
                    </button>
                </div>
            </div>

            {/* View Mode Toggle - Prominent Tabs */}
            <div className="flex gap-2 mb-4 border-b border-gray-200">
                <button
                    onClick={() => setViewMode('list')}
                    className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                        viewMode === 'list'
                            ? 'border-emerald-500 text-emerald-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <Icons.List />
                        <span className="hidden sm:inline">Bookings List</span>
                        <span className="sm:hidden">List</span>
                    </div>
                </button>
                <button
                    onClick={() => setViewMode('calendar')}
                    className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
                        viewMode === 'calendar'
                            ? 'border-emerald-500 text-emerald-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <div className="flex items-center gap-2">
                        <Icons.Calendar />
                        <span className="hidden sm:inline">Calendar View</span>
                        <span className="sm:hidden">Calendar</span>
                    </div>
                </button>
            </div>

            {showAddBooking && (
                <div className="bg-white p-4 rounded-lg shadow mb-4">
                    <h3 className="font-semibold mb-2">Add Booking</h3>
                    <input
                        type="text"
                        placeholder="Guest Name"
                        value={newBooking.guest}
                        onChange={(e) => setNewBooking({ ...newBooking, guest: e.target.value })}
                        className="w-full p-2 border rounded mb-2"
                    />
                    <label className="block text-sm text-gray-600 mb-1">Check-in</label>
                    <input
                        type="date"
                        value={newBooking.startDate}
                        onChange={(e) => setNewBooking({ ...newBooking, startDate: e.target.value })}
                        className="w-full p-2 border rounded mb-2"
                    />
                    <label className="block text-sm text-gray-600 mb-1">Check-out</label>
                    <input
                        type="date"
                        value={newBooking.endDate}
                        onChange={(e) => setNewBooking({ ...newBooking, endDate: e.target.value })}
                        className="w-full p-2 border rounded mb-2"
                    />
                    <label className="block text-sm text-gray-600 mb-1">Status</label>
                    <select
                        value={newBooking.status}
                        onChange={(e) => setNewBooking({ ...newBooking, status: e.target.value })}
                        className="w-full p-2 border rounded mb-2"
                    >
                        <option value="Booked">Booked</option>
                        <option value="Tentative">Tentative</option>
                    </select>
                    <button
                        onClick={addBooking}
                        disabled={!newBooking.guest || !newBooking.startDate || !newBooking.endDate}
                        className="w-full bg-emerald-500 text-white py-2 rounded disabled:bg-gray-300"
                    >
                        Add Booking
                    </button>
                </div>
            )}

            {/* Edit Booking Modal */}
            {editingBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-xl">Edit Booking</h3>
                            <button
                                onClick={() => {
                                    setConfirmDelete(editingBooking.id);
                                    setEditingBooking(null);
                                }}
                                className="text-red-500 p-2 hover:bg-red-50 rounded"
                            >
                                <Icons.Trash />
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="Guest Name"
                            value={editingBooking.guest}
                            onChange={(e) => setEditingBooking({ ...editingBooking, guest: e.target.value })}
                            className="w-full p-2 border rounded mb-2"
                        />
                        <label className="block text-sm text-gray-600 mb-1">Check-in</label>
                        <input
                            type="date"
                            value={editingBooking.startDate}
                            onChange={(e) => setEditingBooking({ ...editingBooking, startDate: e.target.value })}
                            className="w-full p-2 border rounded mb-2"
                        />
                        <label className="block text-sm text-gray-600 mb-1">Check-out</label>
                        <input
                            type="date"
                            value={editingBooking.endDate}
                            onChange={(e) => setEditingBooking({ ...editingBooking, endDate: e.target.value })}
                            className="w-full p-2 border rounded mb-2"
                        />
                        <label className="block text-sm text-gray-600 mb-1">Status</label>
                        <select
                            value={editingBooking.status || 'Booked'}
                            onChange={(e) => setEditingBooking({ ...editingBooking, status: e.target.value })}
                            className="w-full p-2 border rounded mb-4"
                        >
                            <option value="Booked">Booked</option>
                            <option value="Tentative">Tentative</option>
                        </select>
                        <div className="flex gap-2">
                            <button
                                onClick={updateBooking}
                                disabled={!editingBooking.guest || !editingBooking.startDate || !editingBooking.endDate}
                                className="flex-1 bg-emerald-500 text-white py-2 rounded disabled:bg-gray-300"
                            >
                                Save Changes
                            </button>
                            <button
                                onClick={() => setEditingBooking(null)}
                                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Calendar View Mode */}
            {viewMode === 'calendar' && (
                <div>
                    {/* Month/Year Picker */}
                    <div className="mb-4 flex gap-2">
                        <select
                            value={calendarStartMonth.getMonth()}
                            onChange={(e) => {
                                const newDate = new Date(calendarStartMonth);
                                newDate.setMonth(parseInt(e.target.value));
                                setCalendarStartMonth(newDate);
                            }}
                            className="flex-1 p-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium"
                        >
                            <option value="0">January</option>
                            <option value="1">February</option>
                            <option value="2">March</option>
                            <option value="3">April</option>
                            <option value="4">May</option>
                            <option value="5">June</option>
                            <option value="6">July</option>
                            <option value="7">August</option>
                            <option value="8">September</option>
                            <option value="9">October</option>
                            <option value="10">November</option>
                            <option value="11">December</option>
                        </select>
                        <select
                            value={calendarStartMonth.getFullYear()}
                            onChange={(e) => {
                                const newDate = new Date(calendarStartMonth);
                                newDate.setFullYear(parseInt(e.target.value));
                                setCalendarStartMonth(newDate);
                            }}
                            className="w-24 p-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium"
                        >
                            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 2 + i).map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>

                    {/* Calendar Navigation */}
                    <div className="flex justify-between items-center mb-4">
                        <button
                            onClick={() => navigateCalendar('backward')}
                            className="p-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            aria-label="Previous month"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setCalendarStartMonth(new Date())}
                            className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-medium hover:bg-emerald-600 transition-colors"
                        >
                            Today
                        </button>
                        <button
                            onClick={() => navigateCalendar('forward')}
                            className="p-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                            aria-label="Next month"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Calendar Grid */}
                    <CalendarGrid 
                        bookings={data.calendar} 
                        startMonth={calendarStartMonth}
                        onDateClick={handleDateClick}
                    />
                </div>
            )}

            {/* List View Mode */}
            {viewMode === 'list' && (
                <>
                    {/* Upcoming Bookings */}
                    <div className="space-y-3 mb-4">
                        {upcomingBookings.map(booking => renderBookingCard(booking))}
                        {upcomingBookings.length === 0 && (
                            <div className="text-center text-gray-400 py-8">
                                No upcoming bookings. Add your first booking above!
                            </div>
                        )}
                    </div>

                    {/* Past Bookings Section */}
                    {pastBookings.length > 0 && (
                        <div className="mt-6 border-t pt-4">
                            <button
                                onClick={() => setShowPastBookings(!showPastBookings)}
                                className="w-full flex justify-between items-center p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                <span className="font-semibold text-gray-700">
                                    Previous Bookings ({pastBookings.length})
                                </span>
                                <span className="transform transition-transform" style={{
                                    transform: showPastBookings ? 'rotate(180deg)' : 'rotate(0deg)'
                                }}>
                                    ▼
                                </span>
                            </button>
                            {showPastBookings && (
                                <div className="mt-3 space-y-3">
                                    {pastBookings.map(booking => renderBookingCard(booking, true))}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Confirm Delete Dialog */}
            {confirmDelete && (
                <ConfirmDialog
                    message="Delete this booking?"
                    onConfirm={() => deleteBooking(confirmDelete)}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}
        </div>
    );
}

function DocumentsView({ data, setData, showToast, useBackend, updateData }) {
    const [showUpload, setShowUpload] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [viewingDoc, setViewingDoc] = useState(null);
    const [editingDoc, setEditingDoc] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const fileInputRef = useRef(null);

    const categories = ['All', 'Manuals', 'Images', 'Warranties', 'Receipts', 'Other'];

    const handleFileUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        
        let successCount = 0;
        let errorCount = 0;

        for (const file of files) {
            // Limit file size to 5MB
            if (file.size > 5 * 1024 * 1024) {
                showToast(`${file.name} is too large. Maximum size is 5MB.`, 'error');
                errorCount++;
                continue;
            }

            // Validate file type
            const allowedTypes = ['image/', 'application/pdf', 'text/', 'application/msword', 'application/vnd.openxmlformats'];
            const isValidType = allowedTypes.some(type => file.type.startsWith(type));
            if (!isValidType && file.type) {
                showToast(`${file.name} has an unsupported file type.`, 'error');
                errorCount++;
                continue;
            }

            try {
                // Compress images before storing
                let dataUrl;
                if (file.type.startsWith('image/')) {
                    try {
                        dataUrl = await compressImage(file);
                        console.log(`Compressed ${file.name}: ${file.size} → ${Math.round(dataUrl.length * 0.75)} bytes`);
                    } catch (compressionError) {
                        console.warn('Compression failed, using original:', compressionError);
                        dataUrl = await new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = (event) => resolve(event.target.result);
                            reader.onerror = (error) => reject(error);
                            reader.readAsDataURL(file);
                        });
                    }
                } else {
                    dataUrl = await new Promise((resolve, reject) => {
                        const reader = new FileReader();
                        reader.onload = (event) => resolve(event.target.result);
                        reader.onerror = (error) => reject(error);
                        reader.readAsDataURL(file);
                    });
                }

                const doc = {
                    name: file.name,
                    category: guessCategory(file.type, file.name),
                    type: file.type.startsWith('image/') ? 'image/jpeg' : file.type,
                    size: formatFileSize(dataUrl.length * 0.75), // Approximate size of base64
                    uploadDate: new Date().toISOString().split('T')[0],
                    data: dataUrl,
                };

                if (useBackend) {
                    try {
                        await updateData(async () => {
                            await propertyAPI.addDocument(doc);
                        });
                    } catch (uploadError) {
                        console.error('Error uploading to backend:', uploadError);
                        showToast(`Failed to upload ${file.name} to server`, 'error');
                        errorCount++;
                        continue;
                    }
                } else {
                    doc.id = generateId();
                    const newData = {
                        ...data,
                        documents: [...data.documents, doc],
                    };
                    
                    const storageCheck = checkStorageSpace(newData);
                    if (storageCheck.success) {
                        setData(newData);
                    } else {
                        showToast(storageCheck.error, 'error');
                        errorCount++;
                        continue;
                    }
                }
                
                successCount++;
            } catch (error) {
                console.error('Error uploading file:', error);
                showToast(`Failed to upload ${file.name}`, 'error');
                errorCount++;
            }
        }

        if (successCount > 0) {
            showToast(`${successCount} file${successCount > 1 ? 's' : ''} uploaded successfully!`);
        }

        setShowUpload(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const guessCategory = (type, name) => {
        if (type.startsWith('image/')) return 'Images';
        if (name.toLowerCase().includes('manual') || name.toLowerCase().includes('instruction')) return 'Manuals';
        if (name.toLowerCase().includes('warranty')) return 'Warranties';
        if (name.toLowerCase().includes('receipt') || name.toLowerCase().includes('invoice')) return 'Receipts';
        return 'Other';
    };

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const deleteDocument = async (id) => {
        setViewingDoc(null);
        setConfirmDelete(null);
        await updateData(async () => {
            if (useBackend) {
                await propertyAPI.deleteDocument(id);
            } else {
                setData(prev => ({ ...prev, documents: prev.documents.filter(d => d.id !== id) }));
            }
        });
        showToast('Document deleted');
    };

    const downloadDocument = (doc) => {
        // Create a blob from the data URL
        const byteString = atob(doc.data.split(',')[1]);
        const mimeString = doc.data.split(',')[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        
        const blob = new Blob([ab], { type: mimeString });
        const url = URL.createObjectURL(blob);
        
        // Check if running as standalone PWA
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                            window.navigator.standalone === true;
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        
        if (isIOS && isStandalone) {
            // In standalone mode on iOS, create a link and trigger click
            // This should prompt iOS to handle the file
            const link = document.createElement('a');
            link.href = url;
            link.download = doc.name;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else if (isIOS) {
            // For iOS in browser, open in new window
            const newWindow = window.open(url, '_blank');
            if (!newWindow) {
                showToast('Please allow popups to view documents', 'error');
            }
        } else {
            // For other platforms, trigger download
            const link = document.createElement('a');
            link.href = url;
            link.download = doc.name;
            link.click();
        }
        
        // Clean up
        setTimeout(() => URL.revokeObjectURL(url), 100);
    };

    const updateDocCategory = async (id, newCategory) => {
        await updateData(async () => {
            if (useBackend) {
                await propertyAPI.updateDocument(id, { category: newCategory });
            } else {
                setData(prev => ({
                    ...prev,
                    documents: prev.documents.map(d => d.id === id ? { ...d, category: newCategory } : d),
                }));
            }
        });
    };

    const filteredDocs = selectedCategory === 'All'
        ? data.documents
        : data.documents.filter(d => d.category === selectedCategory);

    const isImage = (type) => type && type.startsWith('image/');
    const isPDF = (type) => type === 'application/pdf';

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Documents</h2>
                <button
                    onClick={() => setShowUpload(!showUpload)}
                    className={`p-2 rounded-full ${
                        showUpload ? 'bg-red-500' : 'bg-emerald-500'
                    } text-white shadow-lg`}
                >
                    {showUpload ? <Icons.X /> : <Icons.Plus />}
                </button>
            </div>

            {/* Upload Section */}
            {showUpload && (
                <div className="bg-white p-4 rounded-lg shadow mb-4">
                    <h3 className="font-semibold mb-2">Upload Documents</h3>
                    <p className="text-sm text-gray-600 mb-3">
                        Supported: Images, PDFs, and documents (max 5MB each)
                    </p>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,.pdf,.doc,.docx,.txt"
                        onChange={handleFileUpload}
                        className="w-full p-2 border rounded"
                    />
                </div>
            )}

            {/* Category Filter */}
            <div className="flex overflow-x-auto gap-2 mb-4 pb-2">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition-colors ${
                            selectedCategory === cat
                                ? 'bg-emerald-500 text-white'
                                : 'bg-white text-gray-700 border'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Documents Grid */}
            <div className="grid grid-cols-2 gap-3">
                {filteredDocs.map(doc => (
                    <div
                        key={doc.id}
                        onClick={() => setViewingDoc(doc)}
                        className="bg-white rounded-lg shadow overflow-hidden cursor-pointer active:scale-95 transition-transform"
                    >
                        {/* Thumbnail */}
                        <div className="h-32 bg-gray-100 flex items-center justify-center overflow-hidden">
                            {isImage(doc.type) ? (
                                <img
                                    src={doc.data}
                                    alt={doc.name}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-full h-full object-cover"
                                />
                            ) : isPDF(doc.type) ? (
                                <div className="text-red-500">
                                    <Icons.File />
                                    <div className="text-xs mt-1">PDF</div>
                                </div>
                            ) : (
                                <div className="text-gray-500">
                                    <Icons.Document />
                                    <div className="text-xs mt-1">DOC</div>
                                </div>
                            )}
                        </div>
                        {/* Info */}
                        <div className="p-2">
                            <div className="text-sm font-semibold truncate">{doc.name}</div>
                            <div className="text-xs text-gray-500">{doc.size}</div>
                            <div className="text-xs text-emerald-600 mt-1">{doc.category}</div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredDocs.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                    No documents yet. Upload your first document above!
                </div>
            )}

            {/* Document Viewer Modal */}
            {viewingDoc && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-start">
                            <div className="flex-1 pr-2">
                                <h3 className="font-bold text-lg break-words">{viewingDoc.name}</h3>
                                <div className="text-sm text-gray-600 mt-1">
                                    {viewingDoc.size} • {viewingDoc.uploadDate}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {editingDoc ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                setConfirmDelete(viewingDoc.id);
                                                setEditingDoc(false);
                                                setViewingDoc(null);
                                            }}
                                            className="text-red-500 p-2 hover:bg-red-50 rounded"
                                        >
                                            <Icons.Trash />
                                        </button>
                                        <button
                                            onClick={() => setEditingDoc(false)}
                                            className="text-emerald-500 p-2 hover:bg-emerald-50 rounded font-semibold"
                                        >
                                            Done
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setEditingDoc(true)}
                                        className="text-blue-500 p-2 hover:bg-blue-50 rounded"
                                    >
                                        <Icons.Edit />
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        setViewingDoc(null);
                                        setEditingDoc(false);
                                    }}
                                    className="text-gray-500 p-1"
                                >
                                    <Icons.X />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            {/* Preview */}
                            <div className="mb-4">
                                {isImage(viewingDoc.type) ? (
                                    <img
                                        src={viewingDoc.data}
                                        alt={viewingDoc.name}
                                        className="w-full rounded-lg"
                                    />
                                ) : isPDF(viewingDoc.type) ? (
                                    <div className="bg-gray-100 p-8 rounded-lg text-center">
                                        <Icons.File />
                                        <div className="mt-2 text-gray-600">PDF Document</div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            Click download to view
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gray-100 p-8 rounded-lg text-center">
                                        <Icons.Document />
                                        <div className="mt-2 text-gray-600">Document</div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            Click download to view
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Category Selector - Only in edit mode */}
                            {editingDoc && (
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold mb-2">Category</label>
                                    <select
                                        value={viewingDoc.category}
                                        onChange={(e) => updateDocCategory(viewingDoc.id, e.target.value)}
                                        className="w-full p-2 border rounded"
                                    >
                                        {categories.filter(c => c !== 'All').map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Actions */}
                            <button
                                onClick={() => downloadDocument(viewingDoc)}
                                className="w-full bg-emerald-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                            >
                                <Icons.Download />
                                Download
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirm Delete Dialog */}
            {confirmDelete && (
                <ConfirmDialog
                    message="Delete this document?"
                    onConfirm={() => deleteDocument(confirmDelete)}
                    onCancel={() => setConfirmDelete(null)}
                />
            )}
        </div>
    );
}

// Render App with Error Boundary
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ErrorBoundary>
        <PropertyManager />
    </ErrorBoundary>
);



