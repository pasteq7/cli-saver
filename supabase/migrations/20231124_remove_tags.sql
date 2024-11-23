-- Drop the junction table first (due to foreign key constraints)
DROP TABLE IF EXISTS public.command_tags;

-- Drop the tags table
DROP TABLE IF EXISTS public.tags;

-- Remove the tags column from commands if it exists
ALTER TABLE public.commands DROP COLUMN IF EXISTS tags;
