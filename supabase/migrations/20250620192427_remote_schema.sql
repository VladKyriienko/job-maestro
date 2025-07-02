drop policy "Anyone can view advice" on "public"."advice";

drop policy "Anyone can view active documents" on "public"."document";

drop policy "Anyone can view FAQs" on "public"."faqs";

drop policy "Anyone can view job categories" on "public"."job_categories";

drop policy "Anyone can view active jobs" on "public"."jobs";

drop policy "Users can delete their own jobs" on "public"."jobs";

drop policy "Users can insert their own jobs" on "public"."jobs";

drop policy "Users can update their own jobs" on "public"."jobs";

drop policy "Users can view their own jobs" on "public"."jobs";

drop policy "Allow authenticated users to insert profiles" on "public"."profile";

drop policy "Users can insert their own profile" on "public"."profile";

drop policy "Users can update their own profile" on "public"."profile";

drop policy "Users can view their own profile" on "public"."profile";

revoke delete on table "public"."advice" from "anon";

revoke insert on table "public"."advice" from "anon";

revoke references on table "public"."advice" from "anon";

revoke select on table "public"."advice" from "anon";

revoke trigger on table "public"."advice" from "anon";

revoke truncate on table "public"."advice" from "anon";

revoke update on table "public"."advice" from "anon";

revoke delete on table "public"."advice" from "authenticated";

revoke insert on table "public"."advice" from "authenticated";

revoke references on table "public"."advice" from "authenticated";

revoke select on table "public"."advice" from "authenticated";

revoke trigger on table "public"."advice" from "authenticated";

revoke truncate on table "public"."advice" from "authenticated";

revoke update on table "public"."advice" from "authenticated";

revoke delete on table "public"."advice" from "service_role";

revoke insert on table "public"."advice" from "service_role";

revoke references on table "public"."advice" from "service_role";

revoke select on table "public"."advice" from "service_role";

revoke trigger on table "public"."advice" from "service_role";

revoke truncate on table "public"."advice" from "service_role";

revoke update on table "public"."advice" from "service_role";

revoke delete on table "public"."document" from "anon";

revoke insert on table "public"."document" from "anon";

revoke references on table "public"."document" from "anon";

revoke select on table "public"."document" from "anon";

revoke trigger on table "public"."document" from "anon";

revoke truncate on table "public"."document" from "anon";

revoke update on table "public"."document" from "anon";

revoke delete on table "public"."document" from "authenticated";

revoke insert on table "public"."document" from "authenticated";

revoke references on table "public"."document" from "authenticated";

revoke select on table "public"."document" from "authenticated";

revoke trigger on table "public"."document" from "authenticated";

revoke truncate on table "public"."document" from "authenticated";

revoke update on table "public"."document" from "authenticated";

revoke delete on table "public"."document" from "service_role";

revoke insert on table "public"."document" from "service_role";

revoke references on table "public"."document" from "service_role";

revoke select on table "public"."document" from "service_role";

revoke trigger on table "public"."document" from "service_role";

revoke truncate on table "public"."document" from "service_role";

revoke update on table "public"."document" from "service_role";

revoke delete on table "public"."faqs" from "anon";

revoke insert on table "public"."faqs" from "anon";

revoke references on table "public"."faqs" from "anon";

revoke select on table "public"."faqs" from "anon";

revoke trigger on table "public"."faqs" from "anon";

revoke truncate on table "public"."faqs" from "anon";

revoke update on table "public"."faqs" from "anon";

revoke delete on table "public"."faqs" from "authenticated";

revoke insert on table "public"."faqs" from "authenticated";

revoke references on table "public"."faqs" from "authenticated";

revoke select on table "public"."faqs" from "authenticated";

revoke trigger on table "public"."faqs" from "authenticated";

revoke truncate on table "public"."faqs" from "authenticated";

revoke update on table "public"."faqs" from "authenticated";

revoke delete on table "public"."faqs" from "service_role";

revoke insert on table "public"."faqs" from "service_role";

revoke references on table "public"."faqs" from "service_role";

revoke select on table "public"."faqs" from "service_role";

revoke trigger on table "public"."faqs" from "service_role";

revoke truncate on table "public"."faqs" from "service_role";

revoke update on table "public"."faqs" from "service_role";

revoke delete on table "public"."job_categories" from "anon";

revoke insert on table "public"."job_categories" from "anon";

revoke references on table "public"."job_categories" from "anon";

revoke select on table "public"."job_categories" from "anon";

revoke trigger on table "public"."job_categories" from "anon";

revoke truncate on table "public"."job_categories" from "anon";

revoke update on table "public"."job_categories" from "anon";

revoke delete on table "public"."job_categories" from "authenticated";

revoke insert on table "public"."job_categories" from "authenticated";

revoke references on table "public"."job_categories" from "authenticated";

revoke select on table "public"."job_categories" from "authenticated";

revoke trigger on table "public"."job_categories" from "authenticated";

revoke truncate on table "public"."job_categories" from "authenticated";

revoke update on table "public"."job_categories" from "authenticated";

revoke delete on table "public"."job_categories" from "service_role";

revoke insert on table "public"."job_categories" from "service_role";

revoke references on table "public"."job_categories" from "service_role";

revoke select on table "public"."job_categories" from "service_role";

revoke trigger on table "public"."job_categories" from "service_role";

revoke truncate on table "public"."job_categories" from "service_role";

revoke update on table "public"."job_categories" from "service_role";

revoke delete on table "public"."jobs" from "anon";

revoke insert on table "public"."jobs" from "anon";

revoke references on table "public"."jobs" from "anon";

revoke select on table "public"."jobs" from "anon";

revoke trigger on table "public"."jobs" from "anon";

revoke truncate on table "public"."jobs" from "anon";

revoke update on table "public"."jobs" from "anon";

revoke delete on table "public"."jobs" from "authenticated";

revoke insert on table "public"."jobs" from "authenticated";

revoke references on table "public"."jobs" from "authenticated";

revoke select on table "public"."jobs" from "authenticated";

revoke trigger on table "public"."jobs" from "authenticated";

revoke truncate on table "public"."jobs" from "authenticated";

revoke update on table "public"."jobs" from "authenticated";

revoke delete on table "public"."jobs" from "service_role";

revoke insert on table "public"."jobs" from "service_role";

revoke references on table "public"."jobs" from "service_role";

revoke select on table "public"."jobs" from "service_role";

revoke trigger on table "public"."jobs" from "service_role";

revoke truncate on table "public"."jobs" from "service_role";

revoke update on table "public"."jobs" from "service_role";

revoke delete on table "public"."profile" from "anon";

revoke insert on table "public"."profile" from "anon";

revoke references on table "public"."profile" from "anon";

revoke select on table "public"."profile" from "anon";

revoke trigger on table "public"."profile" from "anon";

revoke truncate on table "public"."profile" from "anon";

revoke update on table "public"."profile" from "anon";

revoke delete on table "public"."profile" from "authenticated";

revoke insert on table "public"."profile" from "authenticated";

revoke references on table "public"."profile" from "authenticated";

revoke select on table "public"."profile" from "authenticated";

revoke trigger on table "public"."profile" from "authenticated";

revoke truncate on table "public"."profile" from "authenticated";

revoke update on table "public"."profile" from "authenticated";

revoke delete on table "public"."profile" from "service_role";

revoke insert on table "public"."profile" from "service_role";

revoke references on table "public"."profile" from "service_role";

revoke select on table "public"."profile" from "service_role";

revoke trigger on table "public"."profile" from "service_role";

revoke truncate on table "public"."profile" from "service_role";

revoke update on table "public"."profile" from "service_role";

alter table "public"."job_categories" drop constraint "job_categories_name_key";

alter table "public"."jobs" drop constraint "jobs_category_id_fkey";

alter table "public"."jobs" drop constraint "jobs_posted_by_fkey";

alter table "public"."profile" drop constraint "profile_email_key";

alter table "public"."profile" drop constraint "profile_user_id_fkey";

alter table "public"."advice" drop constraint "advice_pkey";

alter table "public"."document" drop constraint "document_pkey";

alter table "public"."faqs" drop constraint "faqs_pkey";

alter table "public"."job_categories" drop constraint "job_categories_pkey";

alter table "public"."jobs" drop constraint "jobs_pkey";

alter table "public"."profile" drop constraint "profile_pkey";

drop index if exists "public"."advice_pkey";

drop index if exists "public"."document_pkey";

drop index if exists "public"."faqs_pkey";

drop index if exists "public"."idx_jobs_category";

drop index if exists "public"."idx_jobs_posted_by";

drop index if exists "public"."idx_profile_role";

drop index if exists "public"."idx_profile_user_id";

drop index if exists "public"."job_categories_name_key";

drop index if exists "public"."job_categories_pkey";

drop index if exists "public"."jobs_pkey";

drop index if exists "public"."profile_email_key";

drop index if exists "public"."profile_pkey";

drop table "public"."advice";

drop table "public"."document";

drop table "public"."faqs";

drop table "public"."job_categories";

drop table "public"."jobs";

drop table "public"."profile";

create table "public"."TypeOfVacancy" (
    "id" uuid not null default gen_random_uuid(),
    "name" text not null
);


alter table "public"."TypeOfVacancy" enable row level security;

drop sequence if exists "public"."advice_id_seq";

drop sequence if exists "public"."document_id_seq";

drop sequence if exists "public"."faqs_id_seq";

drop sequence if exists "public"."job_categories_id_seq";

drop sequence if exists "public"."jobs_id_seq";

drop sequence if exists "public"."profile_id_seq";

CREATE UNIQUE INDEX "TypeOfVacancy_pkey" ON public."TypeOfVacancy" USING btree (id);

alter table "public"."TypeOfVacancy" add constraint "TypeOfVacancy_pkey" PRIMARY KEY using index "TypeOfVacancy_pkey";

grant delete on table "public"."TypeOfVacancy" to "anon";

grant insert on table "public"."TypeOfVacancy" to "anon";

grant references on table "public"."TypeOfVacancy" to "anon";

grant select on table "public"."TypeOfVacancy" to "anon";

grant trigger on table "public"."TypeOfVacancy" to "anon";

grant truncate on table "public"."TypeOfVacancy" to "anon";

grant update on table "public"."TypeOfVacancy" to "anon";

grant delete on table "public"."TypeOfVacancy" to "authenticated";

grant insert on table "public"."TypeOfVacancy" to "authenticated";

grant references on table "public"."TypeOfVacancy" to "authenticated";

grant select on table "public"."TypeOfVacancy" to "authenticated";

grant trigger on table "public"."TypeOfVacancy" to "authenticated";

grant truncate on table "public"."TypeOfVacancy" to "authenticated";

grant update on table "public"."TypeOfVacancy" to "authenticated";

grant delete on table "public"."TypeOfVacancy" to "service_role";

grant insert on table "public"."TypeOfVacancy" to "service_role";

grant references on table "public"."TypeOfVacancy" to "service_role";

grant select on table "public"."TypeOfVacancy" to "service_role";

grant trigger on table "public"."TypeOfVacancy" to "service_role";

grant truncate on table "public"."TypeOfVacancy" to "service_role";

grant update on table "public"."TypeOfVacancy" to "service_role";

create policy "Public read access"
on "public"."TypeOfVacancy"
as permissive
for select
to public
using (true);



