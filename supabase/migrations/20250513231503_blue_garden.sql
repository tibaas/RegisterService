/*
  # Add delete policy for bookings table

  1. Changes
    - Add policy to allow authenticated users to delete bookings
    - Add policy to allow users to delete their own bookings

  2. Security
    - Only authenticated users can delete any booking
    - Public users can only delete their own bookings
*/

-- Allow authenticated users to delete any booking
CREATE POLICY "Authenticated users can delete bookings"
  ON bookings
  FOR DELETE
  TO authenticated
  USING (true);

-- Allow users to delete their own bookings
CREATE POLICY "Users can delete their own bookings"
  ON bookings
  FOR DELETE
  TO public
  USING (email = current_user);