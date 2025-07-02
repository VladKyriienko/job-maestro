create extension if not exists "pgjwt" with schema "extensions";


drop policy "Only admins can manage advice" on "public"."advice";

drop policy "Only admins can manage documents" on "public"."document";

drop policy "Only admins can manage FAQs" on "public"."faqs";


