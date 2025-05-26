/*
  # Add booking time and limit daily bookings

  1. Changes
    - Add booking_time column to bookings table
    - Create function to check daily booking limits
    - Add trigger to enforce max 3 bookings per day

  2. Security
    - No changes to existing RLS policies
*/

-- Add booking time column with a default value
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS booking_time time DEFAULT '09:00:00'::time NOT NULL;

-- Update existing records to have a default time
UPDATE bookings SET booking_time = '09:00:00'::time WHERE booking_time IS NULL;

-- Function to count bookings per day
CREATE OR REPLACE FUNCTION check_daily_booking_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT COUNT(*)
    FROM bookings
    WHERE service_date = NEW.service_date
    AND status != 'cancelled'
  ) >= 3 THEN
    RAISE EXCEPTION 'Maximum bookings reached for this day';
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