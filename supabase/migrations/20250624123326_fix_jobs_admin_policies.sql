create policy "Admins can manage all jobs"
on "public"."jobs"
as permissive
for all
to public
using (is_admin())
with check (is_admin());



