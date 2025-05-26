/*
  # Add update policies for bookings

  1. Changes
    - Add policies for authenticated users to update bookings
    - Add policies for users to update their own bookings

  2. Security
    - Maintains existing RLS policies
*/

-- Allow authenticated users to update any booking
CREATE POLICY "Authenticated users can update bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow users to update their own bookings
CREATE POLICY "Users can update their own bookings"
  ON bookings
  FOR UPDATE
  TO public
  USING (email = current_user)
  WITH CHECK (email = current_user);