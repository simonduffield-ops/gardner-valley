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
    const [syncing, setSyncing] = useState(false);
    const [showMapChoice, setShowMapChoice] = useState(false);

    // Initialize - check for Supabase and load data
    useEffect(() => {
        async function initializeData() {
            setLoading(true);
            
            // Try to initialize Supabase
            const backendAvailable = isSupabaseConfigured();
            
            if (backendAvailable) {
                try {
                    await propertyAPI.initialize();
                    console.log('Backend initialized, loading from Supabase...');
                    
                    // Load all data from backend
                    const backendData = await propertyAPI.getAllData();
                    setData(backendData);
                    setUseBackend(true);
                    console.log('Data loaded from backend:', backendData);
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
        
        const address = "Gardner Valley"; // You can customize this
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

    // Helper function to update data with backend sync
    const updateData = useCallback(async (updateFn) => {
        if (useBackend) {
            setSyncing(true);
        }
        try {
            await updateFn();
            if (useBackend) {
                // Reload data from backend to ensure consistency
                const backendData = await propertyAPI.getAllData();
                setData(backendData);
            }
        } catch (error) {
            console.error('Error updating data:', error);
            showToast('Failed to sync data. Please try again.', 'error');
        } finally {
            if (useBackend) {
                setSyncing(false);
            }
        }
    }, [useBackend, showToast]);

    // Memoize tabs array to prevent re-creation on every render
    const tabs = useMemo(() => [
        { id: 'map', label: 'Map', icon: Icons.Map },
        { id: 'info', label: 'Info', icon: Icons.Info },
        { id: 'lists', label: 'Lists', icon: Icons.List },
        { id: 'reference', label: 'Guides', icon: Icons.ClipboardList },
        { id: 'calendar', label: 'Visits', icon: Icons.Calendar },
        { id: 'documents', label: 'Docs', icon: Icons.Document },
    ], []);

    // Show loading screen while initializing
    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-500">
                <div className="text-center text-white">
                    <div className="text-6xl mb-4">🏡</div>
                    <h2 className="text-2xl font-bold mb-2">Gardner Valley</h2>
                    <p className="animate-pulse">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            {/* Sync status indicator */}
            {syncing && (
                <div className="fixed top-4 left-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 text-sm flex items-center gap-2">
                    <div className="animate-spin">⟳</div>
                    <span>Syncing...</span>
                </div>
            )}
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
                    <h1 className="text-xl font-bold">Gardner Valley</h1>
                </div>
            </header>

            {/* Content */}
            <main key={activeTab} className="flex-1 overflow-y-auto pb-20" style={{ WebkitOverflowScrolling: 'touch' }}>
                {activeTab === 'map' && <MapView data={data} setData={setData} showToast={showToast} useBackend={useBackend} updateData={updateData} />}
                {activeTab === 'info' && <InfoView data={data} setData={setData} showToast={showToast} useBackend={useBackend} updateData={updateData} />}
                {activeTab === 'lists' && <ListsView data={data} setData={setData} showToast={showToast} useBackend={useBackend} updateData={updateData} />}
                {activeTab === 'reference' && <ReferenceListsView data={data} setData={setData} showToast={showToast} useBackend={useBackend} updateData={updateData} />}
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
                            className={`flex-1 flex flex-col items-center py-3 px-2 transition-colors ${
                                activeTab === tab.id
                                    ? 'text-emerald-500'
                                    : 'text-gray-400'
                            }`}
                        >
                            <tab.icon />
                            <span className="text-xs mt-1">{tab.label}</span>
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
        
        if (useBackend) {
            await updateData(async () => {
                await propertyAPI.addMapMarker(newMarker);
            });
        } else {
            const marker = {
                id: generateId(),
                ...newMarker,
            };
            setData({ ...data, mapMarkers: [...data.mapMarkers, marker] });
        }
        
        setNewMarker({ x: 50, y: 50, label: '', type: 'tree' });
        setShowAddMarker(false);
        showToast('Marker added successfully!');
    };

    const deleteMarker = async (id) => {
        if (useBackend) {
            await updateData(async () => {
                await propertyAPI.deleteMapMarker(id);
            });
        } else {
            setData({
                ...data,
                mapMarkers: data.mapMarkers.filter(m => m.id !== id),
            });
        }
        
        setConfirmDelete(null);
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
                        backgroundSize: window.innerWidth < 768 ? 'auto 100%' : 'contain',
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
        
        if (useBackend) {
            await updateData(async () => {
                await propertyAPI.addContact(newContact);
            });
        } else {
            const contact = { id: generateId(), ...newContact };
            setData({ ...data, contacts: [...data.contacts, contact] });
        }
        
        setNewContact({ category: 'Utilities', name: '', value: '' });
        setShowAddContact(false);
        showToast('Contact added successfully!');
    };

    const deleteContact = async (id) => {
        if (useBackend) {
            await updateData(async () => {
                await propertyAPI.deleteContact(id);
            });
        } else {
            setData({
                ...data,
                contacts: data.contacts.filter(c => c.id !== id),
            });
        }
        
        setConfirmDelete(null);
        showToast('Contact deleted');
    };

    const updateContact = async (id, field, value) => {
        if (useBackend) {
            await updateData(async () => {
                await propertyAPI.updateContact(id, { [field]: value });
            });
        } else {
            setData({
                ...data,
                contacts: data.contacts.map(c =>
                    c.id === id ? { ...c, [field]: value } : c
                ),
            });
        }
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
                                                className="text-emerald-500 font-semibold"
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
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setEditingId(contact.id)}
                                                        className="text-blue-500 p-1"
                                                    >
                                                        <Icons.Edit />
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmDelete(contact.id)}
                                                        className="text-red-500 p-1"
                                                    >
                                                        <Icons.Trash />
                                                    </button>
                                                </div>
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

function ListsView({ data, setData, showToast, useBackend, updateData }) {
    const [activeList, setActiveList] = useState('shopping');
    const [newItemText, setNewItemText] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [draggedItem, setDraggedItem] = useState(null);
    const [showAddSection, setShowAddSection] = useState(false);
    const [newSectionName, setNewSectionName] = useState('');
    const draggedRef = useRef(null);
    const longPressTimer = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const isLongPressingRef = useRef(false);
    const touchStartY = useRef(0);
    const touchStartX = useRef(0);
    const hasMoved = useRef(false);
    const saveOrderTimer = useRef(null);
    const pendingSave = useRef(false);

    const listTypes = [
        { id: 'shopping', label: 'Shopping' },
        { id: 'tasks', label: 'Tasks' },
        { id: 'projects', label: 'Projects' },
        { id: 'thingsToBuy', label: 'Things to Buy' },
    ];

    const addItem = async () => {
        if (!newItemText.trim()) return;
        
        const newItem = {
            text: newItemText,
            completed: false,
            is_section: false,
        };
        
        if (useBackend) {
            await updateData(async () => {
                await propertyAPI.addListItem(activeList, newItem);
            });
        } else {
            newItem.id = generateId();
            setData({
                ...data,
                lists: {
                    ...data.lists,
                    [activeList]: [...data.lists[activeList], newItem],
                },
            });
        }
        
        setNewItemText('');
        showToast('Item added!');
    };

    const addSection = async () => {
        if (!newSectionName.trim()) return;
        
        const newSection = {
            text: newSectionName,
            is_section: true,
            completed: false,
        };
        
        if (useBackend) {
            await updateData(async () => {
                await propertyAPI.addListItem(activeList, newSection);
            });
        } else {
            newSection.id = generateId();
            setData({
                ...data,
                lists: {
                    ...data.lists,
                    [activeList]: [...data.lists[activeList], newSection],
                },
            });
        }
        
        setNewSectionName('');
        setShowAddSection(false);
        showToast('Section added!');
    };

    const toggleItem = async (id) => {
        const item = data.lists[activeList].find(i => i.id === id);
        const newValue = !item.completed;
        
        // Optimistic update - update UI immediately
        setData({
            ...data,
            lists: {
                ...data.lists,
                [activeList]: data.lists[activeList].map(item =>
                    item.id === id
                        ? { ...item, completed: !item.completed }
                        : item
                ),
            },
        });
        
        // Sync with backend in background
        if (useBackend) {
            try {
                await propertyAPI.updateListItem(id, { completed: newValue });
            } catch (error) {
                console.error('Error updating item:', error);
                showToast('Failed to update item', 'error');
                // Revert on error
                setData({
                    ...data,
                    lists: {
                        ...data.lists,
                        [activeList]: data.lists[activeList].map(item =>
                            item.id === id
                                ? { ...item, completed: !newValue }
                                : item
                        ),
                    },
                });
            }
        }
    };

    const deleteItem = async (id) => {
        // Store the item in case we need to revert
        const deletedItem = data.lists[activeList].find(item => item.id === id);
        const deletedIndex = data.lists[activeList].findIndex(item => item.id === id);
        
        // Optimistic update - remove from UI immediately
        setData({
            ...data,
            lists: {
                ...data.lists,
                [activeList]: data.lists[activeList].filter(item => item.id !== id),
            },
        });
        
        setConfirmDelete(null);
        showToast('Item deleted');
        
        // Sync with backend in background
        if (useBackend) {
            try {
                await propertyAPI.deleteListItem(id);
            } catch (error) {
                console.error('Error deleting item:', error);
                showToast('Failed to delete item', 'error');
                // Revert on error - restore the item
                setData({
                    ...data,
                    lists: {
                        ...data.lists,
                        [activeList]: [
                            ...data.lists[activeList].slice(0, deletedIndex),
                            deletedItem,
                            ...data.lists[activeList].slice(deletedIndex)
                        ],
                    },
                });
            }
        }
    };

    // Save all items' sort order to backend (debounced)
    const saveOrderToBackend = async (items) => {
        if (!useBackend) return;
        
        try {
            // Single batch update - only affected items
            await Promise.all(
                items.map((item, index) => 
                    propertyAPI.updateListItem(item.id, { sort_order: index })
                )
            );
            pendingSave.current = false;
        } catch (error) {
            console.error('Error saving order:', error);
            showToast('Failed to save order', 'error');
        }
    };

    const reorderItems = (startIndex, endIndex) => {
        const items = Array.from(data.lists[activeList]);
        const [removed] = items.splice(startIndex, 1);
        items.splice(endIndex, 0, removed);

        // Optimistic update - UI updates immediately
        setData({
            ...data,
            lists: {
                ...data.lists,
                [activeList]: items,
            },
        });

        // Debounce the save - wait until user stops dragging
        if (useBackend) {
            pendingSave.current = true;
            clearTimeout(saveOrderTimer.current);
            
            // Save 300ms after last reorder (user stopped dragging)
            saveOrderTimer.current = setTimeout(() => {
                saveOrderToBackend(items);
            }, 300);
        }
    };

    // Desktop drag handlers
    const handleDesktopDragStart = (e, index) => {
        setDraggedItem(index);
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
        }
    };

    const handleDesktopDragOver = (e, index) => {
        e.preventDefault();
        if (draggedItem === null || draggedItem === index) return;
        
        reorderItems(draggedItem, index);
        setDraggedItem(index);
    };

    const handleDesktopDragEnd = () => {
        setDraggedItem(null);
    };

    // Mobile touch handlers - DRAG HANDLE ONLY (simple & reliable!)
    const handleDragHandleTouchStart = (e, index) => {
        // Prevent default to stop scrolling
        e.preventDefault();
        
        // Start drag immediately when touching handle
        draggedRef.current = index;
        setDraggedItem(index);
        setIsDragging(true);
        
        // Haptic feedback
        if (window.navigator.vibrate) {
            window.navigator.vibrate(50);
        }
        
        // Store the touch identifier
        const touchId = e.touches[0].identifier;
        
        const handleTouchMove = (moveEvent) => {
            // Prevent scrolling while dragging
            if (moveEvent.cancelable) {
                moveEvent.preventDefault();
            }
            
            // Find the touch that matches our identifier
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
            // Check if our touch ended
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
                
                // Remove listeners from document
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
                document.removeEventListener('touchcancel', handleTouchEnd);
            }
        };
        
        // Add listeners to document so they work even when finger moves off the handle
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: false });
        document.addEventListener('touchcancel', handleTouchEnd, { passive: false });
    };

    // Cleanup on unmount (when switching tabs)
    useEffect(() => {
        return () => {
            clearTimeout(saveOrderTimer.current);
            draggedRef.current = null;
        };
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Lists</h2>

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
                        onKeyPress={(e) => e.key === 'Enter' && addItem()}
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
                            onKeyPress={(e) => e.key === 'Enter' && addSection()}
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
            </div>

            {/* Items */}
            <div className="space-y-2">
                {data.lists[activeList].map((item, index) => (
                    item.is_section ? (
                        // Section Header
                        <div
                            key={item.id}
                            data-item-index={index}
                            draggable
                            onDragStart={(e) => handleDesktopDragStart(e, index)}
                            onDragOver={(e) => handleDesktopDragOver(e, index)}
                            onDragEnd={handleDesktopDragEnd}
                            className={`bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex items-center gap-3 transition-all select-none ${
                                draggedItem === index ? 'opacity-50 scale-105 shadow-xl' : ''
                            }`}
                            style={{
                                cursor: draggedItem === index ? 'grabbing' : 'default',
                                WebkitUserSelect: 'none',
                                userSelect: 'none'
                            }}
                        >
                            <div 
                                className="text-gray-400 p-2 -m-2 touch-none active:bg-gray-200 rounded cursor-grab"
                                onTouchStart={(e) => handleDragHandleTouchStart(e, index)}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                </svg>
                            </div>
                            <div className="flex-1 flex items-center gap-2">
                                <span className="text-emerald-600 text-lg">📑</span>
                                <span className="font-bold text-emerald-700 uppercase text-sm tracking-wide">
                                    {item.text}
                                </span>
                            </div>
                            <button
                                onClick={() => setConfirmDelete(item.id)}
                                className="text-red-500 p-1 hover:bg-red-50 rounded"
                            >
                                <Icons.Trash />
                            </button>
                        </div>
                    ) : (
                        // Regular Item
                        <div
                            key={item.id}
                            data-item-index={index}
                            draggable
                            onDragStart={(e) => handleDesktopDragStart(e, index)}
                            onDragOver={(e) => handleDesktopDragOver(e, index)}
                            onDragEnd={handleDesktopDragEnd}
                            className={`bg-white p-4 rounded-lg shadow flex items-center gap-3 transition-all select-none ${
                                draggedItem === index ? 'opacity-50 scale-105 shadow-xl' : ''
                            }`}
                            style={{
                                cursor: draggedItem === index ? 'grabbing' : 'default',
                                WebkitUserSelect: 'none',
                                userSelect: 'none'
                            }}
                        >
                            <div 
                                className="text-gray-400 p-2 -m-2 touch-none active:bg-gray-200 rounded cursor-grab"
                                onTouchStart={(e) => handleDragHandleTouchStart(e, index)}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                </svg>
                            </div>
                            <button
                                onClick={() => toggleItem(item.id)}
                                className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                    item.completed
                                        ? 'bg-emerald-500 border-emerald-500'
                                        : 'border-gray-300'
                                }`}
                            >
                                {item.completed && (
                                    <Icons.Check />
                                )}
                            </button>
                            <span
                                className={`flex-1 ${
                                    item.completed
                                        ? 'line-through text-gray-400'
                                        : 'text-gray-800'
                                }`}
                            >
                                {item.text}
                            </span>
                            <button
                                onClick={() => setConfirmDelete(item.id)}
                                className="text-red-500 p-1"
                            >
                                <Icons.Trash />
                            </button>
                        </div>
                    )
                ))}
                {data.lists[activeList].length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                        No items yet. Add your first item above!
                    </div>
                )}
            </div>

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

function ReferenceListsView({ data, setData, showToast, useBackend, updateData }) {
    const [activeList, setActiveList] = useState('leaving');
    const [newItemText, setNewItemText] = useState('');
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [draggedItem, setDraggedItem] = useState(null);
    const draggedRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const saveOrderTimer = useRef(null);
    const pendingSave = useRef(false);

    const listTypes = [
        { id: 'leaving', label: 'Leaving Checklist' },
        { id: 'annual', label: 'Annual Jobs' },
    ];

    const addItem = async () => {
        if (!newItemText.trim()) return;
        
        const newItem = {
            text: newItemText,
            checked: false,
        };
        
        if (useBackend) {
            await updateData(async () => {
                await propertyAPI.addListItem(activeList, newItem);
            });
        } else {
            newItem.id = generateId();
            setData({
                ...data,
                lists: {
                    ...data.lists,
                    [activeList]: [...data.lists[activeList], newItem],
                },
            });
        }
        
        setNewItemText('');
        showToast('Item added!');
    };

    const toggleItem = async (id) => {
        const item = data.lists[activeList].find(i => i.id === id);
        const newValue = !item.checked;
        
        // Optimistic update - update UI immediately
        setData({
            ...data,
            lists: {
                ...data.lists,
                [activeList]: data.lists[activeList].map(item =>
                    item.id === id
                        ? { ...item, checked: !item.checked }
                        : item
                ),
            },
        });
        
        // Sync with backend in background
        if (useBackend) {
            try {
                await propertyAPI.updateListItem(id, { checked: newValue });
            } catch (error) {
                console.error('Error updating item:', error);
                showToast('Failed to update item', 'error');
                // Revert on error
                setData({
                    ...data,
                    lists: {
                        ...data.lists,
                        [activeList]: data.lists[activeList].map(item =>
                            item.id === id
                                ? { ...item, checked: !newValue }
                                : item
                        ),
                    },
                });
            }
        }
    };

    const deleteItem = async (id) => {
        // Store the item in case we need to revert
        const deletedItem = data.lists[activeList].find(item => item.id === id);
        const deletedIndex = data.lists[activeList].findIndex(item => item.id === id);
        
        // Optimistic update - remove from UI immediately
        setData({
            ...data,
            lists: {
                ...data.lists,
                [activeList]: data.lists[activeList].filter(item => item.id !== id),
            },
        });
        
        setConfirmDelete(null);
        showToast('Item deleted');
        
        // Sync with backend in background
        if (useBackend) {
            try {
                await propertyAPI.deleteListItem(id);
            } catch (error) {
                console.error('Error deleting item:', error);
                showToast('Failed to delete item', 'error');
                // Revert on error - restore the item
                setData({
                    ...data,
                    lists: {
                        ...data.lists,
                        [activeList]: [
                            ...data.lists[activeList].slice(0, deletedIndex),
                            deletedItem,
                            ...data.lists[activeList].slice(deletedIndex)
                        ],
                    },
                });
            }
        }
    };

    const uncheckAll = async () => {
        // Optimistic update - update UI immediately
        setData({
            ...data,
            lists: {
                ...data.lists,
                [activeList]: data.lists[activeList].map(item => ({ ...item, checked: false })),
            },
        });
        
        showToast('All items unchecked');
        
        // Sync with backend in background
        if (useBackend) {
            try {
                const updatePromises = data.lists[activeList].map(item => 
                    propertyAPI.updateListItem(item.id, { checked: false })
                );
                await Promise.all(updatePromises);
            } catch (error) {
                console.error('Error unchecking all items:', error);
                showToast('Failed to sync changes', 'error');
            }
        }
    };

    // Save all items' sort order to backend (debounced)
    const saveOrderToBackend = async (items) => {
        if (!useBackend) return;
        
        try {
            // Single batch update - only affected items
            await Promise.all(
                items.map((item, index) => 
                    propertyAPI.updateListItem(item.id, { sort_order: index })
                )
            );
            pendingSave.current = false;
        } catch (error) {
            console.error('Error saving order:', error);
            showToast('Failed to save order', 'error');
        }
    };

    const reorderItems = (startIndex, endIndex) => {
        const items = Array.from(data.lists[activeList]);
        const [removed] = items.splice(startIndex, 1);
        items.splice(endIndex, 0, removed);

        // Optimistic update - UI updates immediately
        setData({
            ...data,
            lists: {
                ...data.lists,
                [activeList]: items,
            },
        });

        // Debounce the save - wait until user stops dragging
        if (useBackend) {
            pendingSave.current = true;
            clearTimeout(saveOrderTimer.current);
            
            // Save 300ms after last reorder (user stopped dragging)
            saveOrderTimer.current = setTimeout(() => {
                saveOrderToBackend(items);
            }, 300);
        }
    };

    // Desktop drag handlers
    const handleDesktopDragStart = (e, index) => {
        setDraggedItem(index);
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
        }
    };

    const handleDesktopDragOver = (e, index) => {
        e.preventDefault();
        if (draggedItem === null || draggedItem === index) return;
        
        reorderItems(draggedItem, index);
        setDraggedItem(index);
    };

    const handleDesktopDragEnd = () => {
        setDraggedItem(null);
    };

    // Mobile touch handlers - DRAG HANDLE ONLY (simple & reliable!)
    const handleDragHandleTouchStart = (e, index) => {
        // Prevent default to stop scrolling
        e.preventDefault();
        
        // Start drag immediately when touching handle
        draggedRef.current = index;
        setDraggedItem(index);
        setIsDragging(true);
        
        // Haptic feedback
        if (window.navigator.vibrate) {
            window.navigator.vibrate(50);
        }
        
        // Store the touch identifier
        const touchId = e.touches[0].identifier;
        
        const handleTouchMove = (moveEvent) => {
            // Prevent scrolling while dragging
            if (moveEvent.cancelable) {
                moveEvent.preventDefault();
            }
            
            // Find the touch that matches our identifier
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
            // Check if our touch ended
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
                
                // Remove listeners from document
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
                document.removeEventListener('touchcancel', handleTouchEnd);
            }
        };
        
        // Add listeners to document so they work even when finger moves off the handle
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: false });
        document.addEventListener('touchcancel', handleTouchEnd, { passive: false });
    };

    // Cleanup on unmount (when switching tabs)
    useEffect(() => {
        return () => {
            clearTimeout(saveOrderTimer.current);
            draggedRef.current = null;
        };
    }, []);

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Reference Lists</h2>
                <button
                    onClick={uncheckAll}
                    disabled={data.lists[activeList].length === 0}
                    className="px-3 py-1 bg-gray-500 text-white rounded-lg text-sm font-semibold hover:bg-gray-600 disabled:bg-gray-300"
                >
                    Uncheck All
                </button>
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
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder={`Add to ${listTypes.find(t => t.id === activeList)?.label}`}
                        value={newItemText}
                        onChange={(e) => setNewItemText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addItem()}
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
            </div>

            {/* Items - Checkboxes that stay visible */}
            <div className="space-y-2">
                {data.lists[activeList].map((item, index) => (
                    <div
                        key={item.id}
                        data-item-index={index}
                        draggable
                        onDragStart={(e) => handleDesktopDragStart(e, index)}
                        onDragOver={(e) => handleDesktopDragOver(e, index)}
                        onDragEnd={handleDesktopDragEnd}
                        className={`bg-white p-4 rounded-lg shadow flex items-center gap-3 transition-all select-none ${
                            draggedItem === index ? 'opacity-50 scale-105 shadow-xl' : ''
                        }`}
                        style={{
                            cursor: draggedItem === index ? 'grabbing' : 'default',
                            WebkitUserSelect: 'none',
                            userSelect: 'none'
                        }}
                    >
                        <div 
                            className="text-gray-400 p-2 -m-2 touch-none active:bg-gray-200 rounded cursor-grab"
                            onTouchStart={(e) => handleDragHandleTouchStart(e, index)}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                            </svg>
                        </div>
                        <button
                            onClick={() => toggleItem(item.id)}
                            className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                item.checked
                                    ? 'bg-emerald-500 border-emerald-500'
                                    : 'border-gray-300'
                            }`}
                        >
                            {item.checked && (
                                <Icons.Check />
                            )}
                        </button>
                        <span className="flex-1 text-gray-800">
                            {item.text}
                        </span>
                        <button
                            onClick={() => setConfirmDelete(item.id)}
                            className="text-red-500 p-1"
                        >
                            <Icons.Trash />
                        </button>
                    </div>
                ))}
                {data.lists[activeList].length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                        No items yet. Add your first item above!
                    </div>
                )}
            </div>

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

// Calendar Grid Component for visual month view
function CalendarGrid({ bookings, startMonth, onDateClick }) {
    const getBookingsForDate = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        return bookings.filter(booking => {
            const start = new Date(booking.startDate);
            const end = new Date(booking.endDate);
            return date >= start && date <= end;
        });
    };

    const getDayClass = (date) => {
        const bookingsOnDate = getBookingsForDate(date);
        if (bookingsOnDate.length === 0) return 'bg-green-100 hover:bg-green-50'; // Green for available
        
        // Check if all bookings are tentative or if there's at least one confirmed
        const hasBooked = bookingsOnDate.some(b => b.status === 'Booked');
        const hasTentative = bookingsOnDate.some(b => b.status === 'Tentative');
        
        if (hasBooked && hasTentative) return 'bg-gradient-to-br from-red-300 to-yellow-300'; // Mix of both
        if (hasBooked) return 'bg-red-300'; // Red for booked
        if (hasTentative) return 'bg-yellow-300'; // Yellow for tentative
        return 'bg-green-100 hover:bg-green-50'; // Green for available
    };

    const renderMonth = (monthOffset) => {
        const date = new Date(startMonth);
        date.setMonth(date.getMonth() + monthOffset);
        
        const year = date.getFullYear();
        const month = date.getMonth();
        const monthName = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
        // Get first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday
        
        const days = [];
        
        // Add empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="h-10 md:h-12"></div>);
        }
        
        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, month, day);
            const bookingsOnDate = getBookingsForDate(currentDate);
            const isToday = new Date().toDateString() === currentDate.toDateString();
            
            days.push(
                <div
                    key={day}
                    onClick={() => onDateClick && onDateClick(currentDate, bookingsOnDate)}
                    className={`h-10 md:h-12 flex flex-col items-center justify-center text-sm cursor-pointer border border-gray-200 ${getDayClass(currentDate)} ${isToday ? 'ring-2 ring-emerald-500' : ''}`}
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
}

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
        
        if (useBackend) {
            await updateData(async () => {
                await propertyAPI.addCalendarBooking(newBooking);
            });
        } else {
            const booking = {
                id: generateId(),
                ...newBooking,
            };
            
            setData({
                ...data,
                calendar: [...data.calendar, booking].sort((a, b) =>
                    new Date(a.startDate) - new Date(b.startDate)
                ),
            });
        }
        
        setNewBooking({ startDate: '', endDate: '', guest: '', status: 'Booked' });
        setShowAddBooking(false);
        showToast('Booking added successfully!');
    };

    const updateBooking = async () => {
        if (!editingBooking.startDate || !editingBooking.endDate || !editingBooking.guest) return;
        
        if (useBackend) {
            await updateData(async () => {
                await propertyAPI.updateCalendarBooking(editingBooking.id, {
                    startDate: editingBooking.startDate,
                    endDate: editingBooking.endDate,
                    guest: editingBooking.guest,
                    status: editingBooking.status,
                });
            });
        } else {
            setData({
                ...data,
                calendar: data.calendar.map(b => 
                    b.id === editingBooking.id ? editingBooking : b
                ).sort((a, b) => new Date(a.startDate) - new Date(b.startDate)),
            });
        }
        
        setEditingBooking(null);
        showToast('Booking updated successfully!');
    };

    const deleteBooking = async (id) => {
        if (useBackend) {
            await updateData(async () => {
                await propertyAPI.deleteCalendarBooking(id);
            });
        } else {
            setData({
                ...data,
                calendar: data.calendar.filter(b => b.id !== id),
            });
        }
        
        setConfirmDelete(null);
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
        const isActive = new Date() >= new Date(booking.startDate) &&
                        new Date() <= new Date(booking.endDate);
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
                        <h3 className="font-semibold mb-4 text-xl">Edit Booking</h3>
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
                        <button
                            onClick={() => {
                                setConfirmDelete(editingBooking.id);
                                setEditingBooking(null);
                            }}
                            className="w-full mt-4 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                        >
                            <Icons.Trash />
                            Delete Booking
                        </button>
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
                    await updateData(async () => {
                        await propertyAPI.addDocument(doc);
                    });
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
        if (useBackend) {
            await updateData(async () => {
                await propertyAPI.deleteDocument(id);
            });
        } else {
            setData({
                ...data,
                documents: data.documents.filter(d => d.id !== id),
            });
        }
        
        setViewingDoc(null);
        setConfirmDelete(null);
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
        if (useBackend) {
            await updateData(async () => {
                await propertyAPI.updateDocument(id, { category: newCategory });
            });
        } else {
            setData({
                ...data,
                documents: data.documents.map(d =>
                    d.id === id ? { ...d, category: newCategory } : d
                ),
            });
        }
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
                            <button
                                onClick={() => setViewingDoc(null)}
                                className="text-gray-500 p-1"
                            >
                                <Icons.X />
                            </button>
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

                            {/* Category Selector */}
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

                            {/* Actions */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => downloadDocument(viewingDoc)}
                                    className="flex-1 bg-emerald-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                                >
                                    <Icons.Download />
                                    Download
                                </button>
                                <button
                                    onClick={() => setConfirmDelete(viewingDoc.id)}
                                    className="flex-1 bg-red-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                                >
                                    <Icons.Trash />
                                    Delete
                                </button>
                            </div>
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



