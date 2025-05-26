/*
  # Add booking time and limit daily bookings

  1. Changes
    - Add booking_time column to bookings table
    - Set default time for existing bookings
    - Add function and trigger to limit daily bookings to 3

  2. Security
    - Maintains existing RLS policies
*/

-- Add booking time column with a default value
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS booking_time time DEFAULT '09:00:00'::time NOT NULL;

-- Update existing records to have a default time
UPDATE bookings SET booking_time = '09:00:00'::time WHERE booking_time IS NULL;

-- Function to count bookings per day
CREATE OR REPLACE FUNCTION check_daily_booking_limit()
RETURNS TRIGGER AS $$
DECLARE
  daily_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO daily_count
  FROM bookings
  WHERE service_date = NEW.service_date
  AND status != 'cancelled';

  IF daily_count >= 3 THEN
    RAISE EXCEPTION 'Maximum bookings reached for this day';
  END IF;

  -- Check if time slot is available
  IF EXISTS (
    SELECT 1 
    FROM bookings 
    WHERE service_date = NEW.service_date 
    AND booking_time = NEW.booking_time
    AND status != 'cancelled'
  ) THEN
    RAISE EXCEPTION 'This time slot is already booked';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to enforce daily booking limit
DROP TRIGGER IF EXISTS enforce_daily_booking_limit ON bookings;
CREATE TRIGGER enforce_daily_booking_limit
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION check_daily_booking_limit();