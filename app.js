const { useState, useEffect, useRef, useCallback } = React;

// Toast notification system
function Toast({ message, type = 'success', onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const bgColor = type === 'success' ? 'bg-emerald-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';

    return (
        <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in flex items-center gap-2`}>
            <span>{message}</span>
            <button onClick={onClose} className="ml-2 hover:opacity-80">
                <Icons.X />
            </button>
        </div>
    );
}

// Confirmation dialog component
function ConfirmDialog({ message, onConfirm, onCancel }) {
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
}

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

// Utility: Generate unique IDs
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Utility: Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
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

// Lucide icons as inline SVGs
const Icons = {
    Map: () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
    ),
    Info: () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    List: () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
    ),
    Calendar: () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    Plus: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
    ),
    X: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
    ),
    Check: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
    ),
    ClipboardList: () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
    ),
    Edit: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
    ),
    Trash: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
    ),
    Document: () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
    ),
    Download: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
    ),
    Image: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
    ),
    File: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    Upload: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
    ),
    MapPin: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    ),
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

    const tabs = [
        { id: 'map', label: 'Map', icon: Icons.Map },
        { id: 'info', label: 'Info', icon: Icons.Info },
        { id: 'lists', label: 'Lists', icon: Icons.List },
        { id: 'reference', label: 'Guides', icon: Icons.ClipboardList },
        { id: 'calendar', label: 'Visits', icon: Icons.Calendar },
        { id: 'documents', label: 'Docs', icon: Icons.Document },
    ];

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
                    <a
                        href="https://maps.app.goo.gl/4c9phER1pxvepQjy7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-lg transition-colors"
                        title="Open in Google Maps"
                    >
                        <Icons.MapPin />
                    </a>
                    <h1 className="text-xl font-bold">Gardner Valley</h1>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 overflow-y-auto pb-20">
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
    const [touchStart, setTouchStart] = useState(null);
    const [touchCurrent, setTouchCurrent] = useState(null);

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
        if (useBackend) {
            const item = data.lists[activeList].find(i => i.id === id);
            const newValue = !item.completed;
            
            await updateData(async () => {
                await propertyAPI.updateListItem(id, { completed: newValue });
            });
        } else {
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
        }
    };

    const deleteItem = async (id) => {
        if (useBackend) {
            await updateData(async () => {
                await propertyAPI.deleteListItem(id);
            });
        } else {
            setData({
                ...data,
                lists: {
                    ...data.lists,
                    [activeList]: data.lists[activeList].filter(item => item.id !== id),
                },
            });
        }
        
        setConfirmDelete(null);
        showToast('Item deleted');
    };

    const reorderItems = async (startIndex, endIndex) => {
        const items = Array.from(data.lists[activeList]);
        const [removed] = items.splice(startIndex, 1);
        items.splice(endIndex, 0, removed);

        if (useBackend) {
            // Update all items with new order
            setData({
                ...data,
                lists: {
                    ...data.lists,
                    [activeList]: items,
                },
            });
            
            // Update order in backend for all items
            try {
                await Promise.all(
                    items.map((item, index) => 
                        propertyAPI.updateListItem(item.id, { sort_order: index })
                    )
                );
            } catch (error) {
                console.error('Error reordering items:', error);
                showToast('Failed to save order', 'error');
            }
        } else {
            setData({
                ...data,
                lists: {
                    ...data.lists,
                    [activeList]: items,
                },
            });
        }
    };

    // Desktop drag handlers
    const handleDragStart = (e, index) => {
        setDraggedItem(index);
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
        }
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedItem === null || draggedItem === index) return;
        
        reorderItems(draggedItem, index);
        setDraggedItem(index);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
        setTouchStart(null);
        setTouchCurrent(null);
    };

    // Touch handlers for mobile (iOS)
    const handleTouchStart = (e, index) => {
        const touch = e.touches[0];
        setTouchStart({ x: touch.clientX, y: touch.clientY, index });
        setDraggedItem(index);
    };

    const handleTouchMove = (e, index) => {
        if (touchStart === null) return;
        
        const touch = e.touches[0];
        setTouchCurrent({ x: touch.clientX, y: touch.clientY });
        
        // Calculate which item we're over
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        if (element) {
            const itemElement = element.closest('[data-item-index]');
            if (itemElement) {
                const newIndex = parseInt(itemElement.getAttribute('data-item-index'));
                if (newIndex !== draggedItem && newIndex !== null && !isNaN(newIndex)) {
                    reorderItems(draggedItem, newIndex);
                    setDraggedItem(newIndex);
                    setTouchStart({ ...touchStart, index: newIndex });
                }
            }
        }
    };

    const handleTouchEnd = () => {
        setDraggedItem(null);
        setTouchStart(null);
        setTouchCurrent(null);
    };

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
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                    {showAddSection ? '− Cancel' : '+ Add Section'}
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
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            onTouchStart={(e) => handleTouchStart(e, index)}
                            onTouchMove={(e) => handleTouchMove(e, index)}
                            onTouchEnd={handleTouchEnd}
                            className={`bg-gradient-to-r from-gray-100 to-gray-50 p-3 rounded-lg flex items-center gap-3 cursor-move active:opacity-50 transition-opacity border-l-4 border-emerald-500 ${
                                draggedItem === index ? 'opacity-50' : ''
                            }`}
                        >
                            <div className="text-gray-400 cursor-grab active:cursor-grabbing">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                                </svg>
                            </div>
                            <span className="flex-1 font-bold text-gray-700 uppercase text-sm tracking-wide">
                                {item.text}
                            </span>
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
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            onTouchStart={(e) => handleTouchStart(e, index)}
                            onTouchMove={(e) => handleTouchMove(e, index)}
                            onTouchEnd={handleTouchEnd}
                            className={`bg-white p-4 rounded-lg shadow flex items-center gap-3 cursor-move active:opacity-50 transition-opacity ${
                                draggedItem === index ? 'opacity-50' : ''
                            }`}
                        >
                            <div className="text-gray-400 cursor-grab active:cursor-grabbing">
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
    const [touchStart, setTouchStart] = useState(null);
    const [touchCurrent, setTouchCurrent] = useState(null);

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
        if (useBackend) {
            const item = data.lists[activeList].find(i => i.id === id);
            const newValue = !item.checked;
            
            await updateData(async () => {
                await propertyAPI.updateListItem(id, { checked: newValue });
            });
        } else {
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
        }
    };

    const deleteItem = async (id) => {
        if (useBackend) {
            await updateData(async () => {
                await propertyAPI.deleteListItem(id);
            });
        } else {
            setData({
                ...data,
                lists: {
                    ...data.lists,
                    [activeList]: data.lists[activeList].filter(item => item.id !== id),
                },
            });
        }
        
        setConfirmDelete(null);
        showToast('Item deleted');
    };

    const uncheckAll = async () => {
        if (useBackend) {
            await updateData(async () => {
                // Update all items in current list to unchecked
                const updatePromises = data.lists[activeList].map(item => 
                    propertyAPI.updateListItem(item.id, { checked: false })
                );
                await Promise.all(updatePromises);
            });
        } else {
            setData({
                ...data,
                lists: {
                    ...data.lists,
                    [activeList]: data.lists[activeList].map(item => ({ ...item, checked: false })),
                },
            });
        }
        showToast('All items unchecked');
    };

    const reorderItems = async (startIndex, endIndex) => {
        const items = Array.from(data.lists[activeList]);
        const [removed] = items.splice(startIndex, 1);
        items.splice(endIndex, 0, removed);

        if (useBackend) {
            setData({
                ...data,
                lists: {
                    ...data.lists,
                    [activeList]: items,
                },
            });
            
            try {
                await Promise.all(
                    items.map((item, index) => 
                        propertyAPI.updateListItem(item.id, { order: index })
                    )
                );
            } catch (error) {
                console.error('Error reordering items:', error);
                showToast('Failed to save order', 'error');
            }
        } else {
            setData({
                ...data,
                lists: {
                    ...data.lists,
                    [activeList]: items,
                },
            });
        }
    };

    // Desktop drag handlers
    const handleDragStart = (e, index) => {
        setDraggedItem(index);
        if (e.dataTransfer) {
            e.dataTransfer.effectAllowed = 'move';
        }
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedItem === null || draggedItem === index) return;
        
        reorderItems(draggedItem, index);
        setDraggedItem(index);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
        setTouchStart(null);
        setTouchCurrent(null);
    };

    // Touch handlers for mobile (iOS)
    const handleTouchStart = (e, index) => {
        const touch = e.touches[0];
        setTouchStart({ x: touch.clientX, y: touch.clientY, index });
        setDraggedItem(index);
    };

    const handleTouchMove = (e, index) => {
        if (touchStart === null) return;
        
        const touch = e.touches[0];
        setTouchCurrent({ x: touch.clientX, y: touch.clientY });
        
        // Calculate which item we're over
        const element = document.elementFromPoint(touch.clientX, touch.clientY);
        if (element) {
            const itemElement = element.closest('[data-item-index]');
            if (itemElement) {
                const newIndex = parseInt(itemElement.getAttribute('data-item-index'));
                if (newIndex !== draggedItem && newIndex !== null && !isNaN(newIndex)) {
                    reorderItems(draggedItem, newIndex);
                    setDraggedItem(newIndex);
                    setTouchStart({ ...touchStart, index: newIndex });
                }
            }
        }
    };

    const handleTouchEnd = () => {
        setDraggedItem(null);
        setTouchStart(null);
        setTouchCurrent(null);
    };

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
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDragEnd={handleDragEnd}
                        onTouchStart={(e) => handleTouchStart(e, index)}
                        onTouchMove={(e) => handleTouchMove(e, index)}
                        onTouchEnd={handleTouchEnd}
                        className={`bg-white p-4 rounded-lg shadow flex items-center gap-3 cursor-move active:opacity-50 transition-opacity ${
                            draggedItem === index ? 'opacity-50' : ''
                        }`}
                    >
                        <div className="text-gray-400 cursor-grab active:cursor-grabbing">
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

function CalendarView({ data, setData, showToast, useBackend, updateData }) {
    const [showAddBooking, setShowAddBooking] = useState(false);
    const [newBooking, setNewBooking] = useState({
        startDate: '',
        endDate: '',
        guest: '',
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
        
        setNewBooking({ startDate: '', endDate: '', guest: '' });
        setShowAddBooking(false);
        showToast('Booking added successfully!');
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

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Occupancy Calendar</h2>
                <button
                    onClick={() => setShowAddBooking(!showAddBooking)}
                    className={`p-2 rounded-full ${
                        showAddBooking ? 'bg-red-500' : 'bg-emerald-500'
                    } text-white shadow-lg`}
                >
                    {showAddBooking ? <Icons.X /> : <Icons.Plus />}
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
                    <button
                        onClick={addBooking}
                        disabled={!newBooking.guest || !newBooking.startDate || !newBooking.endDate}
                        className="w-full bg-emerald-500 text-white py-2 rounded disabled:bg-gray-300"
                    >
                        Add Booking
                    </button>
                </div>
            )}

            <div className="space-y-3">
                {data.calendar.map(booking => {
                    const isActive = new Date() >= new Date(booking.startDate) &&
                                    new Date() <= new Date(booking.endDate);
                    
                    return (
                        <div
                            key={booking.id}
                            className={`bg-white rounded-lg shadow p-4 border-l-4 ${
                                isActive ? 'border-emerald-500' : 'border-blue-500'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="font-bold text-lg text-gray-800">
                                        {booking.guest}
                                    </div>
                                    {isActive && (
                                        <span className="inline-block bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full">
                                            Currently Occupied
                                        </span>
                                    )}
                                </div>
                                <button
                                    onClick={() => setConfirmDelete(booking.id)}
                                    className="text-red-500 p-1"
                                >
                                    <Icons.Trash />
                                </button>
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
                })}
                {data.calendar.length === 0 && (
                    <div className="text-center text-gray-400 py-8">
                        No bookings scheduled. Add your first booking above!
                    </div>
                )}
            </div>

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
                const dataUrl = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = (event) => resolve(event.target.result);
                    reader.onerror = (error) => reject(error);
                    reader.readAsDataURL(file);
                });

                const doc = {
                    name: file.name,
                    category: guessCategory(file.type, file.name),
                    type: file.type,
                    size: formatFileSize(file.size),
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
