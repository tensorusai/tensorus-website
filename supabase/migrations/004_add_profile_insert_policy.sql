-- Add INSERT policy for profiles table
-- This allows users to create their own profile record

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);