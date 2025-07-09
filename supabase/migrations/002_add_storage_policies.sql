-- Create storage bucket for project files
INSERT INTO storage.buckets (id, name, public) VALUES ('project-files', 'project-files', true);

-- Create storage policies for project files
CREATE POLICY "Users can upload their own files" ON storage.objects
    FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own files" ON storage.objects
    FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own files" ON storage.objects
    FOR UPDATE USING (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own files" ON storage.objects
    FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);

-- Create function to increment API key usage
CREATE OR REPLACE FUNCTION increment_api_key_usage(key_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.api_keys 
    SET usage_count = usage_count + 1,
        last_used_at = NOW()
    WHERE id = key_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;