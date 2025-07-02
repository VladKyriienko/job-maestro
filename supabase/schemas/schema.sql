-- User Profile Table (linked to Supabase Auth users)
create table if not exists profile (
    id serial primary key,
    user_id uuid references auth.users(id) on delete cascade,
    first_name text,
    last_name text,
    job_title text,
    working_status text,
    email text unique,
    resume_url text,
    role text default 'jobseeker'
);

-- is_admin function (create only if not exists to avoid conflicts)
create or replace function is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists(
    select 1 from profile
    where user_id = auth.uid() and role = 'admin'
  );
$$;

-- Grant execute permission
grant execute on function is_admin() to authenticated;

-- Enable RLS for profile
alter table profile enable row level security;

-- Profile RLS Policies (simplified to avoid recursion)
create policy "Users can view their own profile" on profile
    for select using (auth.uid() = user_id);

create policy "Users can update their own profile" on profile
    for update using (auth.uid() = user_id);

create policy "Users can insert their own profile" on profile
    for insert with check (auth.uid() = user_id);

create policy "Allow authenticated users to insert profiles" on profile
    for insert with check (auth.role() = 'authenticated');

-- Job Categories
create table if not exists job_categories (
    id serial primary key,
    name text not null unique
);

-- Enable RLS for job_categories
alter table job_categories enable row level security;

-- Job Categories RLS Policies
create policy "Anyone can view job categories" on job_categories
    for select using (true);

-- Temporarily disable admin-only policies to avoid issues
-- create policy "Only admins can manage job categories" on job_categories
--     for all using (
--         auth.is_admin()
--     );

-- Jobs Table
create table if not exists jobs (
    id serial primary key,
    title text not null,
    description text,
    location text,
    posted_by text,
    created_at timestamp with time zone default now(),
    modified_at timestamp with time zone default now(),
    active boolean default true,
    salary numeric,
    hours_per_day numeric,
    job_type text,
    contract_length numeric,
    contract_type text,
    job_category text
);

-- Enable RLS for jobs
alter table jobs enable row level security;

-- Jobs RLS Policies
create policy "Anyone can view active jobs" on jobs
    for select using (active = true);

-- Admin policies for jobs
create policy "Admins can manage all jobs" on jobs
    for all using (is_admin()) with check (is_admin());

-- Documents Table (for Terms, Privacy, etc.)
create table if not exists document (
    id serial primary key,
    title text not null,
    content text not null,
    type text not null, -- e.g. 'Jobseeker Terms and Conditions', 'Privacy Policy'
    active boolean default true
);

-- Enable RLS for document
alter table document enable row level security;

-- Document RLS Policies
create policy "Anyone can view active documents" on document
    for select using (active = true);

-- Temporarily disable admin policies
create policy "Only admins can manage documents" on document
    for all using (is_admin()) with check (is_admin());

-- Advice Table
create table if not exists advice (
    id bigserial primary key,
    title text,
    subtitle text,
    slug text,
    description text,
    active boolean default false
);

-- Enable RLS for advice
alter table advice enable row level security;

-- advice RLS Policies
create policy "Anyone can view advice" on advice
    for select using (true);

-- Temporarily disable admin policies
create policy "Only admins can manage advice" on advice
    for all using (is_admin()) with check (is_admin());

-- FAQs Table
create table if not exists faqs (
    id serial primary key,
    question text not null,
    answer text not null
);

-- Enable RLS for Faqs
alter table faqs enable row level security;

-- FAQs RLS Policies
create policy "Anyone can view FAQs" on faqs
    for select using (true);

-- Temporarily disable admin policies
create policy "Only admins can manage FAQs" on faqs
    for all using (is_admin()) with check (is_admin());

-- Indexes for performance (optional)
create index if not exists idx_jobs_posted_by on jobs(posted_by);
create index if not exists idx_profile_user_id on profile(user_id);
create index if not exists idx_profile_role on profile(role);

-- Create storage bucket for resumes
insert into storage.buckets (id, name, public) values ('resumes', 'resumes', true);

-- Storage policies for resumes bucket
create policy "Anyone can upload resumes" on storage.objects
    for insert with check (bucket_id = 'resumes');

create policy "Anyone can view resumes" on storage.objects
    for select using (bucket_id = 'resumes'); 