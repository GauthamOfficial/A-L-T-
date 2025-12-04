-- Migration: Make description field optional
-- Run this if you already created the notes table with description as NOT NULL

-- Alter the description column to allow NULL values
ALTER TABLE notes 
ALTER COLUMN description DROP NOT NULL;

-- This migration makes the description field optional in the database
-- After running this, users can upload notes without providing a description

