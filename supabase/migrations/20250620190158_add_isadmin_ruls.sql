set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.is_admin()
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select exists(
    select 1 from profile
    where user_id = auth.uid() and role = 'admin'
  );
$function$
;

create policy "Only admins can manage advice"
on "public"."advice"
as permissive
for all
to public
using (is_admin())
with check (is_admin());


create policy "Only admins can manage documents"
on "public"."document"
as permissive
for all
to public
using (is_admin())
with check (is_admin());


create policy "Only admins can manage FAQs"
on "public"."faqs"
as permissive
for all
to public
using (is_admin())
with check (is_admin());



