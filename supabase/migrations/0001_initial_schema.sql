-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Custom types
create type user_role as enum ('student', 'admin', 'reviewer');
create type project_status as enum ('draft', 'submitted', 'under_review', 'approved', 'revision_requested', 'rejected');
create type payment_status as enum ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled');
create type payment_method as enum ('credit_card', 'debit_card', 'net_banking', 'upi', 'wallet', 'other');

-- Users table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  student_id text unique,
  full_name text,
  avatar_url text,
  college text,
  department text,
  semester integer,
  contact_number text,
  address text,
  role user_role default 'student',
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint username_length check (char_length(full_name) >= 3)
);

-- Projects table
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  department text not null,
  semester integer not null,
  status project_status default 'draft',
  payment_status payment_status default 'pending',
  submission_date timestamp with time zone default timezone('utc'::text, now()) not null,
  last_updated timestamp with time zone default timezone('utc'::text, now()) not null,
  score integer,
  feedback text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamp with time zone,
  tags text[],
  is_published boolean default false,
  metadata jsonb,
  constraint title_length check (char_length(title) >= 5)
);

-- Project documents table
create table public.project_documents (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  name text not null,
  path text not null,
  size bigint,
  mime_type text,
  is_primary boolean default false,
  uploaded_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_primary_document 
    unique(project_id, is_primary) 
    deferrable initially deferred
);

-- Payments table
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.profiles(id) on delete cascade not null,
  project_id uuid references public.projects(id) on delete set null,
  amount numeric(10, 2) not null,
  currency varchar(3) default 'INR',
  status payment_status default 'pending',
  payment_method payment_method not null,
  payment_gateway text,
  transaction_id text unique,
  payment_date timestamp with time zone,
  receipt_url text,
  gateway_response jsonb,
  invoice_number text unique,
  tax_amount numeric(10, 2) default 0,
  discount_amount numeric(10, 2) default 0,
  discount_code text,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Refunds table
create table public.refunds (
  id uuid default uuid_generate_v4() primary key,
  payment_id uuid references public.payments(id) on delete cascade not null,
  amount numeric(10, 2) not null,
  reason text,
  status payment_status default 'pending',
  reference_id text,
  processed_at timestamp with time zone default timezone('utc'::text, now()) not null,
  processed_by uuid references public.profiles(id) on delete set null,
  gateway_response jsonb
);

-- Notifications table
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  message text not null,
  type text,
  is_read boolean default false,
  action_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  read_at timestamp with time zone
);

-- Create indexes for better performance
create index idx_projects_student_id on public.projects(student_id);
create index idx_projects_status on public.projects(status);
create index idx_project_documents_project_id on public.project_documents(project_id);
create index idx_payments_student_id on public.payments(student_id);
create index idx_payments_status on public.payments(status);
create index idx_notifications_user_id on public.notifications(user_id);

-- Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_documents enable row level security;
alter table public.payments enable row level security;
alter table public.refunds enable row level security;
alter table public.notifications enable row level security;

-- Create storage bucket for project documents
insert into storage.buckets (id, name, public) 
values ('project-documents', 'project-documents', true)
on conflict (id) do nothing;

-- Set up storage security policies
create policy "Project documents are publicly accessible"
on storage.objects for select
using (bucket_id = 'project-documents');

create policy "Users can upload their own project documents"
on storage.objects for insert
with check (
  bucket_id = 'project-documents' and
  (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can update their own project documents"
on storage.objects for update
using (
  bucket_id = 'project-documents' and
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create a trigger to update the updated_at column
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Apply the trigger to all tables with updated_at
create trigger update_profiles_updated_at
before update on public.profiles
for each row execute function update_updated_at_column();

create trigger update_projects_updated_at
before update on public.projects
for each row execute function update_updated_at_column();

create trigger update_payments_updated_at
before update on public.payments
for each row execute function update_updated_at_column();

-- Function to get user role
create or replace function get_user_role(user_id uuid)
returns user_role as $$
declare
  user_role user_role;
begin
  select role into user_role from public.profiles where id = user_id;
  return user_role;
end;
$$ language plpgsql security definer;

-- Function to check if user is admin
create or replace function is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.profiles 
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Set up RLS policies for profiles
create policy "Users can view their own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "Users can update their own profile"
on public.profiles for update
using (auth.uid() = id);

create policy "Admins can view all profiles"
on public.profiles for select
to authenticated
using (get_user_role(auth.uid()) = 'admin');

-- Set up RLS policies for projects
create policy "Users can view their own projects"
on public.projects for select
using (auth.uid() = student_id);

create policy "Users can create projects"
on public.projects for insert
with check (auth.uid() = student_id);

create policy "Users can update their own projects"
on public.projects for update
using (auth.uid() = student_id);

create policy "Admins can manage all projects"
on public.projects
using (get_user_role(auth.uid()) = 'admin');

-- Set up RLS policies for payments
create policy "Users can view their own payments"
on public.payments for select
using (auth.uid() = student_id);

create policy "Users can create payments"
on public.payments for insert
with check (auth.uid() = student_id);

create policy "Admins can manage all payments"
on public.payments
using (get_user_role(auth.uid()) = 'admin');

-- Set up RLS policies for notifications
create policy "Users can view their own notifications"
on public.notifications for select
using (auth.uid() = user_id);

create policy "Users can mark notifications as read"
on public.notifications for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Create a function to notify users
create or replace function notify_user(
  user_id uuid,
  title text,
  message text,
  type text default 'info',
  action_url text default null
) returns void as $$
begin
  insert into public.notifications (user_id, title, message, type, action_url)
  values (user_id, title, message, type, action_url);
  
  -- In a real app, you would also send a real-time notification here
  -- using Supabase's realtime functionality
  perform pg_notify('notifications', json_build_object(
    'user_id', user_id,
    'title', title,
    'message', message,
    'type', type,
    'action_url', action_url
  )::text);
end;
$$ language plpgsql security definer;
