create sequence "public"."advice_id_seq";

create sequence "public"."document_id_seq";

create sequence "public"."faqs_id_seq";

create sequence "public"."job_categories_id_seq";

create sequence "public"."jobs_id_seq";

create sequence "public"."profile_id_seq";

create table "public"."advice" (
    "id" bigint not null default nextval('advice_id_seq'::regclass),
    "title" text,
    "subtitle" text,
    "slug" text,
    "description" text,
    "active" boolean default false
);


alter table "public"."advice" enable row level security;

create table "public"."document" (
    "id" integer not null default nextval('document_id_seq'::regclass),
    "title" text not null,
    "content" text not null,
    "type" text not null,
    "active" boolean default true
);


alter table "public"."document" enable row level security;

create table "public"."faqs" (
    "id" integer not null default nextval('faqs_id_seq'::regclass),
    "question" text not null,
    "answer" text not null
);


alter table "public"."faqs" enable row level security;

create table "public"."job_categories" (
    "id" integer not null default nextval('job_categories_id_seq'::regclass),
    "name" text not null
);


alter table "public"."job_categories" enable row level security;

create table "public"."jobs" (
    "id" integer not null default nextval('jobs_id_seq'::regclass),
    "title" text not null,
    "description" text,
    "location" text,
    "category_id" integer,
    "posted_by" uuid,
    "created_at" timestamp with time zone default now(),
    "active" boolean default true,
    "salary" numeric,
    "hours_per_day" integer
);


alter table "public"."jobs" enable row level security;

create table "public"."profile" (
    "id" integer not null default nextval('profile_id_seq'::regclass),
    "user_id" uuid,
    "first_name" text,
    "last_name" text,
    "job_title" text,
    "working_status" text,
    "email" text,
    "resume_url" text,
    "role" text default 'jobseeker'::text
);


alter table "public"."profile" enable row level security;

alter sequence "public"."advice_id_seq" owned by "public"."advice"."id";

alter sequence "public"."document_id_seq" owned by "public"."document"."id";

alter sequence "public"."faqs_id_seq" owned by "public"."faqs"."id";

alter sequence "public"."job_categories_id_seq" owned by "public"."job_categories"."id";

alter sequence "public"."jobs_id_seq" owned by "public"."jobs"."id";

alter sequence "public"."profile_id_seq" owned by "public"."profile"."id";

CREATE UNIQUE INDEX advice_pkey ON public.advice USING btree (id);

CREATE UNIQUE INDEX document_pkey ON public.document USING btree (id);

CREATE UNIQUE INDEX faqs_pkey ON public.faqs USING btree (id);

CREATE INDEX idx_jobs_category ON public.jobs USING btree (category_id);

CREATE INDEX idx_jobs_posted_by ON public.jobs USING btree (posted_by);

CREATE INDEX idx_profile_role ON public.profile USING btree (role);

CREATE INDEX idx_profile_user_id ON public.profile USING btree (user_id);

CREATE UNIQUE INDEX job_categories_name_key ON public.job_categories USING btree (name);

CREATE UNIQUE INDEX job_categories_pkey ON public.job_categories USING btree (id);

CREATE UNIQUE INDEX jobs_pkey ON public.jobs USING btree (id);

CREATE UNIQUE INDEX profile_email_key ON public.profile USING btree (email);

CREATE UNIQUE INDEX profile_pkey ON public.profile USING btree (id);

alter table "public"."advice" add constraint "advice_pkey" PRIMARY KEY using index "advice_pkey";

alter table "public"."document" add constraint "document_pkey" PRIMARY KEY using index "document_pkey";

alter table "public"."faqs" add constraint "faqs_pkey" PRIMARY KEY using index "faqs_pkey";

alter table "public"."job_categories" add constraint "job_categories_pkey" PRIMARY KEY using index "job_categories_pkey";

alter table "public"."jobs" add constraint "jobs_pkey" PRIMARY KEY using index "jobs_pkey";

alter table "public"."profile" add constraint "profile_pkey" PRIMARY KEY using index "profile_pkey";

alter table "public"."job_categories" add constraint "job_categories_name_key" UNIQUE using index "job_categories_name_key";

alter table "public"."jobs" add constraint "jobs_category_id_fkey" FOREIGN KEY (category_id) REFERENCES job_categories(id) not valid;

alter table "public"."jobs" validate constraint "jobs_category_id_fkey";

alter table "public"."jobs" add constraint "jobs_posted_by_fkey" FOREIGN KEY (posted_by) REFERENCES auth.users(id) not valid;

alter table "public"."jobs" validate constraint "jobs_posted_by_fkey";

alter table "public"."profile" add constraint "profile_email_key" UNIQUE using index "profile_email_key";

alter table "public"."profile" add constraint "profile_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profile" validate constraint "profile_user_id_fkey";

grant delete on table "public"."advice" to "anon";

grant insert on table "public"."advice" to "anon";

grant references on table "public"."advice" to "anon";

grant select on table "public"."advice" to "anon";

grant trigger on table "public"."advice" to "anon";

grant truncate on table "public"."advice" to "anon";

grant update on table "public"."advice" to "anon";

grant delete on table "public"."advice" to "authenticated";

grant insert on table "public"."advice" to "authenticated";

grant references on table "public"."advice" to "authenticated";

grant select on table "public"."advice" to "authenticated";

grant trigger on table "public"."advice" to "authenticated";

grant truncate on table "public"."advice" to "authenticated";

grant update on table "public"."advice" to "authenticated";

grant delete on table "public"."advice" to "service_role";

grant insert on table "public"."advice" to "service_role";

grant references on table "public"."advice" to "service_role";

grant select on table "public"."advice" to "service_role";

grant trigger on table "public"."advice" to "service_role";

grant truncate on table "public"."advice" to "service_role";

grant update on table "public"."advice" to "service_role";

grant delete on table "public"."document" to "anon";

grant insert on table "public"."document" to "anon";

grant references on table "public"."document" to "anon";

grant select on table "public"."document" to "anon";

grant trigger on table "public"."document" to "anon";

grant truncate on table "public"."document" to "anon";

grant update on table "public"."document" to "anon";

grant delete on table "public"."document" to "authenticated";

grant insert on table "public"."document" to "authenticated";

grant references on table "public"."document" to "authenticated";

grant select on table "public"."document" to "authenticated";

grant trigger on table "public"."document" to "authenticated";

grant truncate on table "public"."document" to "authenticated";

grant update on table "public"."document" to "authenticated";

grant delete on table "public"."document" to "service_role";

grant insert on table "public"."document" to "service_role";

grant references on table "public"."document" to "service_role";

grant select on table "public"."document" to "service_role";

grant trigger on table "public"."document" to "service_role";

grant truncate on table "public"."document" to "service_role";

grant update on table "public"."document" to "service_role";

grant delete on table "public"."faqs" to "anon";

grant insert on table "public"."faqs" to "anon";

grant references on table "public"."faqs" to "anon";

grant select on table "public"."faqs" to "anon";

grant trigger on table "public"."faqs" to "anon";

grant truncate on table "public"."faqs" to "anon";

grant update on table "public"."faqs" to "anon";

grant delete on table "public"."faqs" to "authenticated";

grant insert on table "public"."faqs" to "authenticated";

grant references on table "public"."faqs" to "authenticated";

grant select on table "public"."faqs" to "authenticated";

grant trigger on table "public"."faqs" to "authenticated";

grant truncate on table "public"."faqs" to "authenticated";

grant update on table "public"."faqs" to "authenticated";

grant delete on table "public"."faqs" to "service_role";

grant insert on table "public"."faqs" to "service_role";

grant references on table "public"."faqs" to "service_role";

grant select on table "public"."faqs" to "service_role";

grant trigger on table "public"."faqs" to "service_role";

grant truncate on table "public"."faqs" to "service_role";

grant update on table "public"."faqs" to "service_role";

grant delete on table "public"."job_categories" to "anon";

grant insert on table "public"."job_categories" to "anon";

grant references on table "public"."job_categories" to "anon";

grant select on table "public"."job_categories" to "anon";

grant trigger on table "public"."job_categories" to "anon";

grant truncate on table "public"."job_categories" to "anon";

grant update on table "public"."job_categories" to "anon";

grant delete on table "public"."job_categories" to "authenticated";

grant insert on table "public"."job_categories" to "authenticated";

grant references on table "public"."job_categories" to "authenticated";

grant select on table "public"."job_categories" to "authenticated";

grant trigger on table "public"."job_categories" to "authenticated";

grant truncate on table "public"."job_categories" to "authenticated";

grant update on table "public"."job_categories" to "authenticated";

grant delete on table "public"."job_categories" to "service_role";

grant insert on table "public"."job_categories" to "service_role";

grant references on table "public"."job_categories" to "service_role";

grant select on table "public"."job_categories" to "service_role";

grant trigger on table "public"."job_categories" to "service_role";

grant truncate on table "public"."job_categories" to "service_role";

grant update on table "public"."job_categories" to "service_role";

grant delete on table "public"."jobs" to "anon";

grant insert on table "public"."jobs" to "anon";

grant references on table "public"."jobs" to "anon";

grant select on table "public"."jobs" to "anon";

grant trigger on table "public"."jobs" to "anon";

grant truncate on table "public"."jobs" to "anon";

grant update on table "public"."jobs" to "anon";

grant delete on table "public"."jobs" to "authenticated";

grant insert on table "public"."jobs" to "authenticated";

grant references on table "public"."jobs" to "authenticated";

grant select on table "public"."jobs" to "authenticated";

grant trigger on table "public"."jobs" to "authenticated";

grant truncate on table "public"."jobs" to "authenticated";

grant update on table "public"."jobs" to "authenticated";

grant delete on table "public"."jobs" to "service_role";

grant insert on table "public"."jobs" to "service_role";

grant references on table "public"."jobs" to "service_role";

grant select on table "public"."jobs" to "service_role";

grant trigger on table "public"."jobs" to "service_role";

grant truncate on table "public"."jobs" to "service_role";

grant update on table "public"."jobs" to "service_role";

grant delete on table "public"."profile" to "anon";

grant insert on table "public"."profile" to "anon";

grant references on table "public"."profile" to "anon";

grant select on table "public"."profile" to "anon";

grant trigger on table "public"."profile" to "anon";

grant truncate on table "public"."profile" to "anon";

grant update on table "public"."profile" to "anon";

grant delete on table "public"."profile" to "authenticated";

grant insert on table "public"."profile" to "authenticated";

grant references on table "public"."profile" to "authenticated";

grant select on table "public"."profile" to "authenticated";

grant trigger on table "public"."profile" to "authenticated";

grant truncate on table "public"."profile" to "authenticated";

grant update on table "public"."profile" to "authenticated";

grant delete on table "public"."profile" to "service_role";

grant insert on table "public"."profile" to "service_role";

grant references on table "public"."profile" to "service_role";

grant select on table "public"."profile" to "service_role";

grant trigger on table "public"."profile" to "service_role";

grant truncate on table "public"."profile" to "service_role";

grant update on table "public"."profile" to "service_role";

create policy "Anyone can view advice"
on "public"."advice"
as permissive
for select
to public
using (true);


create policy "Anyone can view active documents"
on "public"."document"
as permissive
for select
to public
using ((active = true));


create policy "Anyone can view FAQs"
on "public"."faqs"
as permissive
for select
to public
using (true);


create policy "Anyone can view job categories"
on "public"."job_categories"
as permissive
for select
to public
using (true);


create policy "Anyone can view active jobs"
on "public"."jobs"
as permissive
for select
to public
using ((active = true));


create policy "Users can delete their own jobs"
on "public"."jobs"
as permissive
for delete
to public
using ((auth.uid() = posted_by));


create policy "Users can insert their own jobs"
on "public"."jobs"
as permissive
for insert
to public
with check ((auth.uid() = posted_by));


create policy "Users can update their own jobs"
on "public"."jobs"
as permissive
for update
to public
using ((auth.uid() = posted_by));


create policy "Users can view their own jobs"
on "public"."jobs"
as permissive
for select
to public
using ((auth.uid() = posted_by));


create policy "Allow authenticated users to insert profiles"
on "public"."profile"
as permissive
for insert
to public
with check ((auth.role() = 'authenticated'::text));


create policy "Users can insert their own profile"
on "public"."profile"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can update their own profile"
on "public"."profile"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can view their own profile"
on "public"."profile"
as permissive
for select
to public
using ((auth.uid() = user_id));



