drop policy "Users can delete their own jobs" on "public"."jobs";

drop policy "Users can insert their own jobs" on "public"."jobs";

drop policy "Users can update their own jobs" on "public"."jobs";

drop policy "Users can view their own jobs" on "public"."jobs";

alter table "public"."jobs" drop constraint "jobs_category_id_fkey";

alter table "public"."jobs" drop constraint "jobs_posted_by_fkey";

drop index if exists "public"."idx_jobs_category";

alter table "public"."jobs" drop column "category_id";

alter table "public"."jobs" add column "modified_at" timestamp with time zone default now();

alter table "public"."jobs" alter column "contract_length" set data type numeric using "contract_length"::numeric;

alter table "public"."jobs" alter column "posted_by" set data type text using "posted_by"::text;


