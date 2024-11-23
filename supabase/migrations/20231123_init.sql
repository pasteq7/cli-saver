-- Create commands table
CREATE TABLE IF NOT EXISTS public.commands (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    command TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create RLS policies
ALTER TABLE public.commands ENABLE ROW LEVEL SECURITY;

-- Commands policies
CREATE POLICY "Users can view their own commands"
    ON public.commands FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own commands"
    ON public.commands FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own commands"
    ON public.commands FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own commands"
    ON public.commands FOR DELETE
    USING (auth.uid() = user_id);
