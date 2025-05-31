/*
  # Add status localization and constraints

  1. Changes
    - Update status column to use Portuguese values
    - Add check constraint for valid status values
    - Update default value to 'pendente'
    - Convert existing status values to Portuguese
*/

-- Add check constraint for status values
ALTER TABLE bookings 
  DROP CONSTRAINT IF EXISTS bookings_status_check;

ALTER TABLE bookings
  ADD CONSTRAINT bookings_status_check 
  CHECK (status IN ('pendente', 'completado', 'cancelado'));

-- Update default value
ALTER TABLE bookings 
  ALTER COLUMN status SET DEFAULT 'pendente';

-- Update existing status values
UPDATE bookings SET status = 
  CASE status
    WHEN 'pending' THEN 'pendente'
    WHEN 'completed' THEN 'completado'
    WHEN 'cancelled' THEN 'cancelado'
    ELSE 'pendente'
  END;