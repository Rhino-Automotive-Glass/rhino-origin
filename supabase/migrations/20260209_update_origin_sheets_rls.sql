-- Update origin_sheets RLS policies to be role-aware
-- Uses current_user_hierarchy_level() function created by rhino-access migration

-- Drop old restrictive policies
DROP POLICY IF EXISTS "Users can view own origin sheets" ON public.origin_sheets;
DROP POLICY IF EXISTS "Users can insert own origin sheets" ON public.origin_sheets;
DROP POLICY IF EXISTS "Users can delete own origin sheets" ON public.origin_sheets;

-- SELECT: All authenticated users can view all sheets
CREATE POLICY "Authenticated users can view all origin sheets"
  ON public.origin_sheets
  FOR SELECT
  TO authenticated
  USING (true);

-- INSERT: Editors and above (hierarchy >= 60) can insert their own sheets
CREATE POLICY "Editors and above can insert own origin sheets"
  ON public.origin_sheets
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND current_user_hierarchy_level() >= 60
  );

-- UPDATE: Owners with editor+ can update own sheets, QA+ can update any (for verification)
CREATE POLICY "Editors can update own sheets and QA can update any"
  ON public.origin_sheets
  FOR UPDATE
  TO authenticated
  USING (
    (auth.uid() = user_id AND current_user_hierarchy_level() >= 60)
    OR current_user_hierarchy_level() >= 50
  )
  WITH CHECK (
    (auth.uid() = user_id AND current_user_hierarchy_level() >= 60)
    OR current_user_hierarchy_level() >= 50
  );

-- DELETE: Owners with editor+ can delete own sheets, admins+ can delete any
CREATE POLICY "Editors can delete own sheets and admins can delete any"
  ON public.origin_sheets
  FOR DELETE
  TO authenticated
  USING (
    (auth.uid() = user_id AND current_user_hierarchy_level() >= 60)
    OR current_user_hierarchy_level() >= 80
  );
