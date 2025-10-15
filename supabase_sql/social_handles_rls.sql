-- Enable RLS on social_handles table
ALTER TABLE social_handles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can view their own social handles" ON social_handles;
DROP POLICY IF EXISTS "Users can insert their own social handles" ON social_handles;
DROP POLICY IF EXISTS "Users can update their own social handles" ON social_handles;
DROP POLICY IF EXISTS "Users can delete their own social handles" ON social_handles;

-- Policy: Users can view their own social handles
CREATE POLICY "Users can view their own social handles"
ON social_handles
FOR SELECT
USING (
  profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )
);

-- Policy: Users can insert their own social handles
CREATE POLICY "Users can insert their own social handles"
ON social_handles
FOR INSERT
WITH CHECK (
  profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )
);

-- Policy: Users can update their own social handles
CREATE POLICY "Users can update their own social handles"
ON social_handles
FOR UPDATE
USING (
  profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )
);

-- Policy: Users can delete their own social handles
CREATE POLICY "Users can delete their own social handles"
ON social_handles
FOR DELETE
USING (
  profile_id IN (
    SELECT id FROM profiles WHERE user_id = auth.uid()
  )
);
