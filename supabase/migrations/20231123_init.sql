-- Create commands table
CREATE TABLE IF NOT EXISTS public.commands (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    command TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create tags table
CREATE TABLE IF NOT EXISTS public.tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create command_tags junction table
CREATE TABLE IF NOT EXISTS public.command_tags (
    command_id UUID REFERENCES public.commands(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (command_id, tag_id)
);

-- Create RLS policies
ALTER TABLE public.commands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.command_tags ENABLE ROW LEVEL SECURITY;

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

-- Tags policies
CREATE POLICY "Users can view their own tags"
    ON public.tags FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tags"
    ON public.tags FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tags"
    ON public.tags FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tags"
    ON public.tags FOR DELETE
    USING (auth.uid() = user_id);

-- Command tags policies
CREATE POLICY "Users can view their own command tags"
    ON public.command_tags FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.commands
            WHERE commands.id = command_tags.command_id
            AND commands.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own command tags"
    ON public.command_tags FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.commands
            WHERE commands.id = command_tags.command_id
            AND commands.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own command tags"
    ON public.command_tags FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.commands
            WHERE commands.id = command_tags.command_id
            AND commands.user_id = auth.uid()
        )
    );
