// API Service Layer for Supabase Integration (Shared Access - No Login)
// Everyone sees and edits the same data - perfect for family properties!

class PropertyAPI {
    constructor() {
        this.isOnline = true;
        this.initialized = false;
    }

    // Initialize Supabase connection
    async initialize() {
        if (!initSupabase()) {
            console.log('Supabase not configured, using localStorage fallback');
            return false;
        }

        this.initialized = true;
        this.isOnline = true;
        return true;
    }

    // Generic error handler
    handleError(error, context) {
        console.error(`Error in ${context}:`, error);
        this.isOnline = false;
        throw error;
    }

    // ==================== MAP MARKERS ====================

    async getMapMarkers() {
        try {
            const { data, error } = await supabase
                .from('map_markers')
                .select('*')
                .order('created_at');

            if (error) throw error;
            return data || [];
        } catch (error) {
            this.handleError(error, 'getMapMarkers');
        }
    }

    async addMapMarker(marker) {
        try {
            const { data, error } = await supabase
                .from('map_markers')
                .insert({
                    x: marker.x,
                    y: marker.y,
                    label: marker.label,
                    type: marker.type
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            this.handleError(error, 'addMapMarker');
        }
    }

    async updateMapMarker(id, updates) {
        try {
            const { data, error } = await supabase
                .from('map_markers')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            this.handleError(error, 'updateMapMarker');
        }
    }

    async deleteMapMarker(id) {
        try {
            const { error } = await supabase
                .from('map_markers')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            this.handleError(error, 'deleteMapMarker');
        }
    }

    // ==================== CONTACTS ====================

    async getContacts() {
        try {
            const { data, error } = await supabase
                .from('contacts')
                .select('*')
                .order('category', { ascending: true })
                .order('name', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (error) {
            this.handleError(error, 'getContacts');
        }
    }

    async addContact(contact) {
        try {
            const { data, error } = await supabase
                .from('contacts')
                .insert({
                    category: contact.category,
                    name: contact.name,
                    value: contact.value,
                    link: contact.link || null
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            this.handleError(error, 'addContact');
        }
    }

    async updateContact(id, updates) {
        try {
            const { data, error } = await supabase
                .from('contacts')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            this.handleError(error, 'updateContact');
        }
    }

    async deleteContact(id) {
        try {
            const { error } = await supabase
                .from('contacts')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            this.handleError(error, 'deleteContact');
        }
    }

    // ==================== LIST ITEMS ====================

    async getListItems(listType) {
        try {
            const { data, error } = await supabase
                .from('list_items')
                .select('*')
                .eq('list_type', listType)
                .order('sort_order', { ascending: true })
                .order('created_at', { ascending: true });

            if (error) throw error;
            return data || [];
        } catch (error) {
            this.handleError(error, 'getListItems');
        }
    }

    async getAllLists() {
        try {
            const { data, error } = await supabase
                .from('list_items')
                .select('*')
                .order('sort_order', { ascending: true });

            if (error) throw error;
            
            // Group by list_type
            const lists = {
                leaving: [],
                projects: [],
                tasks: [],
                annual: [],
                shopping: [],
                thingsToBuy: []
            };

            (data || []).forEach(item => {
                if (lists[item.list_type]) {
                    lists[item.list_type].push(item);
                }
            });

            return lists;
        } catch (error) {
            this.handleError(error, 'getAllLists');
        }
    }

    async addListItem(listType, item) {
        try {
            const { data, error } = await supabase
                .from('list_items')
                .insert({
                    list_type: listType,
                    text: item.text,
                    checked: item.checked || false,
                    completed: item.completed || false,
                    is_section: item.is_section || false,
                    month: item.month || null,
                    sort_order: item.sort_order || 0
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            this.handleError(error, 'addListItem');
        }
    }

    async updateListItem(id, updates) {
        try {
            const { data, error } = await supabase
                .from('list_items')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            this.handleError(error, 'updateListItem');
        }
    }

    async deleteListItem(id) {
        try {
            const { error } = await supabase
                .from('list_items')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            this.handleError(error, 'deleteListItem');
        }
    }

    // ==================== CALENDAR BOOKINGS ====================

    async getCalendarBookings() {
        try {
            const { data, error } = await supabase
                .from('calendar_bookings')
                .select('*')
                .order('start_date', { ascending: true });

            if (error) throw error;
            
            // Convert dates to strings for compatibility with app
            return (data || []).map(booking => ({
                ...booking,
                startDate: booking.start_date,
                endDate: booking.end_date
            }));
        } catch (error) {
            this.handleError(error, 'getCalendarBookings');
        }
    }

    async addCalendarBooking(booking) {
        try {
            const { data, error } = await supabase
                .from('calendar_bookings')
                .insert({
                    start_date: booking.startDate,
                    end_date: booking.endDate,
                    guest: booking.guest
                })
                .select()
                .single();

            if (error) throw error;
            
            return {
                ...data,
                startDate: data.start_date,
                endDate: data.end_date
            };
        } catch (error) {
            this.handleError(error, 'addCalendarBooking');
        }
    }

    async updateCalendarBooking(id, updates) {
        try {
            const dbUpdates = {};
            if (updates.startDate) dbUpdates.start_date = updates.startDate;
            if (updates.endDate) dbUpdates.end_date = updates.endDate;
            if (updates.guest) dbUpdates.guest = updates.guest;

            const { data, error } = await supabase
                .from('calendar_bookings')
                .update(dbUpdates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            
            return {
                ...data,
                startDate: data.start_date,
                endDate: data.end_date
            };
        } catch (error) {
            this.handleError(error, 'updateCalendarBooking');
        }
    }

    async deleteCalendarBooking(id) {
        try {
            const { error } = await supabase
                .from('calendar_bookings')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            this.handleError(error, 'deleteCalendarBooking');
        }
    }

    // ==================== DOCUMENTS ====================

    async getDocuments() {
        try {
            const { data, error } = await supabase
                .from('documents')
                .select('*')
                .order('upload_date', { ascending: false });

            if (error) throw error;
            
            // Convert date field for compatibility
            return (data || []).map(doc => ({
                ...doc,
                uploadDate: doc.upload_date
            }));
        } catch (error) {
            this.handleError(error, 'getDocuments');
        }
    }

    async addDocument(document) {
        try {
            const { data, error } = await supabase
                .from('documents')
                .insert({
                    name: document.name,
                    category: document.category,
                    type: document.type,
                    size: document.size,
                    upload_date: document.uploadDate,
                    data: document.data
                })
                .select()
                .single();

            if (error) throw error;
            
            return {
                ...data,
                uploadDate: data.upload_date
            };
        } catch (error) {
            this.handleError(error, 'addDocument');
        }
    }

    async updateDocument(id, updates) {
        try {
            const dbUpdates = {};
            if (updates.category) dbUpdates.category = updates.category;
            if (updates.name) dbUpdates.name = updates.name;

            const { data, error } = await supabase
                .from('documents')
                .update(dbUpdates)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            
            return {
                ...data,
                uploadDate: data.upload_date
            };
        } catch (error) {
            this.handleError(error, 'updateDocument');
        }
    }

    async deleteDocument(id) {
        try {
            const { error } = await supabase
                .from('documents')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            this.handleError(error, 'deleteDocument');
        }
    }

    // ==================== FULL DATA SYNC ====================

    async getAllData() {
        try {
            const [mapMarkers, contacts, lists, calendar, documents] = await Promise.all([
                this.getMapMarkers(),
                this.getContacts(),
                this.getAllLists(),
                this.getCalendarBookings(),
                this.getDocuments()
            ]);

            return {
                mapMarkers,
                contacts,
                lists,
                calendar,
                documents
            };
        } catch (error) {
            this.handleError(error, 'getAllData');
        }
    }
}

// Create global instance
const propertyAPI = new PropertyAPI();
