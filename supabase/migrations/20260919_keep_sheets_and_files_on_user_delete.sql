-- Keep origin sheets and design files when an employee's account is deleted
--
-- Both tables referenced auth.users with ON DELETE CASCADE, so deleting a
-- user silently deleted every origin sheet and design file they had created.
-- Company work must outlive the account that produced it.
--
-- origin_sheets
--   user_id -> ON DELETE SET NULL (the column was already nullable). The sheet
--   stays; access is unchanged apart from "owner" rules no longer matching:
--   every signed-in user can view it, QA and above (level >= 50) can edit it,
--   admins (level >= 80) can delete it.
--
-- diseno_files
--   user_id nullable + ON DELETE SET NULL. Every policy on this table is
--   "own files only", so an orphaned file would be invisible to everyone.
--   Admins (level >= 80) may now view and delete orphaned files; through the
--   existing app routes (RLS-driven list and delete) they appear in admins'
--   file list and delete removes the Vercel Blob object too. The files
--   themselves live in Vercel Blob and were never removed by the cascade.
--
-- Applied to production 2026-09-19. The shared database's nightly security
-- check (rhino-product-code-description, supabase/diagnostics/
-- security-invariants.sql) rejects ON DELETE SET NULL into a NOT NULL column.

-- --------------------------------------------
-- origin_sheets
-- --------------------------------------------
ALTER TABLE public.origin_sheets
  DROP CONSTRAINT origin_sheets_user_id_fkey,
  ADD CONSTRAINT origin_sheets_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

-- --------------------------------------------
-- diseno_files
-- --------------------------------------------
ALTER TABLE public.diseno_files ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE public.diseno_files
  DROP CONSTRAINT diseno_files_user_id_fkey,
  ADD CONSTRAINT diseno_files_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;

COMMENT ON COLUMN public.diseno_files.user_id IS
  'Uploader. NULL once their account is deleted; admins can then view and delete the file.';

DROP POLICY IF EXISTS "Admins can view orphaned files" ON public.diseno_files;
CREATE POLICY "Admins can view orphaned files"
  ON public.diseno_files
  FOR SELECT
  TO authenticated
  USING (user_id IS NULL AND (SELECT public.current_user_hierarchy_level()) >= 80);

DROP POLICY IF EXISTS "Admins can delete orphaned files" ON public.diseno_files;
CREATE POLICY "Admins can delete orphaned files"
  ON public.diseno_files
  FOR DELETE
  TO authenticated
  USING (user_id IS NULL AND (SELECT public.current_user_hierarchy_level()) >= 80);
