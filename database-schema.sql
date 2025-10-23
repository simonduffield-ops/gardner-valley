-- Gardner Valley Database Schema for Supabase (Shared Access - No Login)
-- Run this in your Supabase SQL Editor: https://app.supabase.com/project/_/sql
-- Everyone sees and edits the same data - perfect for family properties!

-- Create map_markers table
CREATE TABLE IF NOT EXISTS map_markers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    x DECIMAL NOT NULL,
    y DECIMAL NOT NULL,
    label TEXT NOT NULL,
    type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    value TEXT NOT NULL,
    link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lists table (stores list items for all list types)
CREATE TABLE IF NOT EXISTS list_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    list_type TEXT NOT NULL, -- 'leaving', 'projects', 'tasks', 'annual', 'shopping', 'thingsToBuy'
    text TEXT NOT NULL,
    checked BOOLEAN DEFAULT FALSE,
    completed BOOLEAN DEFAULT FALSE,
    month TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create calendar bookings table
CREATE TABLE IF NOT EXISTS calendar_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    guest TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table (stores metadata, actual files in Supabase Storage)
CREATE TABLE IF NOT EXISTS documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    type TEXT NOT NULL,
    size TEXT NOT NULL,
    upload_date DATE NOT NULL,
    storage_path TEXT, -- Path to file in Supabase Storage
    data TEXT, -- Base64 data for small files (backward compatibility)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_list_items_type ON list_items(list_type);
CREATE INDEX IF NOT EXISTS idx_calendar_bookings_dates ON calendar_bookings(start_date, end_date);

-- Disable Row Level Security - Everyone has full access
ALTER TABLE map_markers DISABLE ROW LEVEL SECURITY;
ALTER TABLE contacts DISABLE ROW LEVEL SECURITY;
ALTER TABLE list_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_bookings DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_map_markers_updated_at BEFORE UPDATE ON map_markers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_list_items_updated_at BEFORE UPDATE ON list_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calendar_bookings_updated_at BEFORE UPDATE ON calendar_bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant full permissions to anonymous users (no login required)
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Done! All users see and can edit the same data.
-- Perfect for family property management.

