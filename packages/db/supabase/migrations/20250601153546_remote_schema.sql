drop policy "clients_owner_policy" on "public"."clients";

drop policy "follow_ups_owner_policy" on "public"."follow_ups";

drop policy "notes_owner_policy" on "public"."notes";

drop policy "payments_owner_policy" on "public"."payments";

drop policy "program_enrollments_owner_policy" on "public"."program_enrollments";

drop policy "programs_owner_policy" on "public"."programs";

drop policy "services_owner_policy" on "public"."services";

drop policy "session_attendees_owner_policy" on "public"."session_attendees";

drop policy "sessions_owner_policy" on "public"."sessions";

alter table "public"."notes" drop constraint "notes_program_id_fkey";

alter table "public"."payments" drop constraint "payments_external_payment_id_key";

alter table "public"."payments" drop constraint "payments_service_id_fkey";

alter table "public"."payments" drop constraint "payments_session_id_fkey";

alter table "public"."payments" drop constraint "payments_status_check";

alter table "public"."program_enrollments" drop constraint "program_enrollments_program_id_client_id_key";

alter table "public"."program_enrollments" drop constraint "program_enrollments_status_check";

alter table "public"."session_attendees" drop constraint "session_attendees_attendance_status_check";

alter table "public"."session_attendees" drop constraint "session_attendees_session_id_client_id_key";

alter table "public"."sessions" drop constraint "sessions_status_check";

alter table "public"."notes" drop constraint "notes_session_id_fkey";

alter table "public"."sessions" drop constraint "sessions_client_id_fkey";

drop index if exists "public"."clients_user_id_email_unique_idx";

drop index if exists "public"."idx_clients_user_id";

drop index if exists "public"."idx_followups_client_id";

drop index if exists "public"."idx_followups_due_date";

drop index if exists "public"."idx_followups_session_id";

drop index if exists "public"."idx_followups_user_id";

drop index if exists "public"."idx_notes_client_id";

drop index if exists "public"."idx_notes_program_id";

drop index if exists "public"."idx_notes_session_id";

drop index if exists "public"."idx_notes_user_id";

drop index if exists "public"."idx_payments_client_id";

drop index if exists "public"."idx_payments_external_payment_id";

drop index if exists "public"."idx_payments_program_id";

drop index if exists "public"."idx_payments_service_id";

drop index if exists "public"."idx_payments_session_id";

drop index if exists "public"."idx_payments_user_id";

drop index if exists "public"."idx_program_enrollments_client_id";

drop index if exists "public"."idx_program_enrollments_program_id";

drop index if exists "public"."idx_program_enrollments_user_id";

drop index if exists "public"."idx_session_attendees_client_id";

drop index if exists "public"."idx_session_attendees_session_id";

drop index if exists "public"."idx_session_attendees_user_id";

drop index if exists "public"."idx_sessions_program_id";

drop index if exists "public"."idx_sessions_service_id";

drop index if exists "public"."idx_sessions_start_time";

drop index if exists "public"."payments_external_payment_id_key";

drop index if exists "public"."program_enrollments_program_id_client_id_key";

drop index if exists "public"."session_attendees_session_id_client_id_key";

alter table "public"."clients" drop column "address_city";

alter table "public"."clients" drop column "address_country";

alter table "public"."clients" drop column "address_postal_code";

alter table "public"."clients" drop column "address_state";

alter table "public"."clients" drop column "address_street";

alter table "public"."clients" drop column "date_of_birth";

alter table "public"."clients" drop column "enrichment_data";

alter table "public"."clients" drop column "social_profiles";

alter table "public"."clients" add column "birthday" date;

alter table "public"."clients" add column "enriched_data" jsonb;

alter table "public"."clients" add column "enrichment_status" text default 'pending'::text;

alter table "public"."clients" add column "linkedin_profile" text;

alter table "public"."clients" add column "twitter_profile" text;

alter table "public"."clients" add column "website" text;

alter table "public"."clients" alter column "created_at" set default timezone('utc'::text, now());

alter table "public"."clients" alter column "email" set not null;

alter table "public"."clients" alter column "tags" set data type text using "tags"::text;

alter table "public"."clients" alter column "updated_at" set default timezone('utc'::text, now());

alter table "public"."follow_ups" drop column "completed_at";

alter table "public"."follow_ups" add column "completed" boolean not null default false;

alter table "public"."follow_ups" alter column "created_at" set default timezone('utc'::text, now());

alter table "public"."follow_ups" alter column "due_date" set not null;

alter table "public"."follow_ups" alter column "id" set default gen_random_uuid();

alter table "public"."follow_ups" alter column "id" drop identity;

alter table "public"."follow_ups" alter column "id" set data type uuid using "id"::uuid;

alter table "public"."follow_ups" alter column "session_id" set data type uuid using "session_id"::uuid;

alter table "public"."follow_ups" alter column "updated_at" set default timezone('utc'::text, now());

alter table "public"."groups" add column "emoji" text;

alter table "public"."notes" drop column "is_pinned";

alter table "public"."notes" drop column "note_text";

alter table "public"."notes" drop column "program_id";

alter table "public"."notes" drop column "title";

alter table "public"."notes" add column "content" text not null;

alter table "public"."notes" alter column "client_id" set not null;

alter table "public"."notes" alter column "created_at" set default timezone('utc'::text, now());

alter table "public"."notes" alter column "id" set default gen_random_uuid();

alter table "public"."notes" alter column "id" drop identity;

alter table "public"."notes" alter column "id" set data type uuid using "id"::uuid;

alter table "public"."notes" alter column "session_id" set data type uuid using "session_id"::uuid;

alter table "public"."notes" alter column "updated_at" set default timezone('utc'::text, now());

alter table "public"."payments" drop column "currency";

alter table "public"."payments" drop column "external_payment_id";

alter table "public"."payments" drop column "method";

alter table "public"."payments" drop column "notes";

alter table "public"."payments" drop column "paid_at";

alter table "public"."payments" drop column "service_id";

alter table "public"."payments" drop column "session_id";

alter table "public"."payments" add column "payment_date" timestamp with time zone not null;

alter table "public"."payments" add column "payment_method" text;

alter table "public"."payments" alter column "created_at" set default timezone('utc'::text, now());

alter table "public"."payments" alter column "id" set default gen_random_uuid();

alter table "public"."payments" alter column "id" drop identity;

alter table "public"."payments" alter column "id" set data type uuid using "id"::uuid;

alter table "public"."payments" alter column "program_id" set data type uuid using "program_id"::uuid;

alter table "public"."payments" alter column "updated_at" set default timezone('utc'::text, now());

alter table "public"."program_enrollments" drop column "completion_date";

alter table "public"."program_enrollments" drop column "enrolled_at";

alter table "public"."program_enrollments" add column "enrollment_date" timestamp with time zone not null default timezone('utc'::text, now());

alter table "public"."program_enrollments" alter column "created_at" set default timezone('utc'::text, now());

alter table "public"."program_enrollments" alter column "id" set default gen_random_uuid();

alter table "public"."program_enrollments" alter column "id" drop identity;

alter table "public"."program_enrollments" alter column "id" set data type uuid using "id"::uuid;

alter table "public"."program_enrollments" alter column "program_id" set data type uuid using "program_id"::uuid;

alter table "public"."program_enrollments" alter column "status" drop default;

alter table "public"."program_enrollments" alter column "updated_at" set default timezone('utc'::text, now());

alter table "public"."programs" drop column "price";

alter table "public"."programs" add column "is_active" boolean default true;

alter table "public"."programs" alter column "created_at" set default timezone('utc'::text, now());

alter table "public"."programs" alter column "id" set default gen_random_uuid();

alter table "public"."programs" alter column "id" drop identity;

alter table "public"."programs" alter column "id" set data type uuid using "id"::uuid;

alter table "public"."programs" alter column "updated_at" set default timezone('utc'::text, now());

alter table "public"."programs" alter column "user_id" set default auth.uid();

alter table "public"."services" drop column "duration";

alter table "public"."services" add column "duration_minutes" integer;

alter table "public"."services" alter column "created_at" set default timezone('utc'::text, now());

alter table "public"."services" alter column "id" set default gen_random_uuid();

alter table "public"."services" alter column "id" drop identity;

alter table "public"."services" alter column "id" set data type uuid using "id"::uuid;

alter table "public"."services" alter column "is_active" drop not null;

alter table "public"."services" alter column "updated_at" set default timezone('utc'::text, now());

alter table "public"."services" alter column "user_id" set default auth.uid();

alter table "public"."session_attendees" drop column "attendance_status";

alter table "public"."session_attendees" drop column "check_in_time";

alter table "public"."session_attendees" add column "attended" boolean not null default false;

alter table "public"."session_attendees" alter column "created_at" set default timezone('utc'::text, now());

alter table "public"."session_attendees" alter column "id" set default gen_random_uuid();

alter table "public"."session_attendees" alter column "id" drop identity;

alter table "public"."session_attendees" alter column "id" set data type uuid using "id"::uuid;

alter table "public"."session_attendees" alter column "session_id" set data type uuid using "session_id"::uuid;

alter table "public"."session_attendees" alter column "updated_at" set default timezone('utc'::text, now());

alter table "public"."sessions" drop column "end_time";

alter table "public"."sessions" drop column "location";

alter table "public"."sessions" drop column "start_time";

alter table "public"."sessions" add column "session_time" timestamp with time zone not null;

alter table "public"."sessions" alter column "client_id" set not null;

alter table "public"."sessions" alter column "created_at" set default timezone('utc'::text, now());

alter table "public"."sessions" alter column "id" set default gen_random_uuid();

alter table "public"."sessions" alter column "id" drop identity;

alter table "public"."sessions" alter column "id" set data type uuid using "id"::uuid;

alter table "public"."sessions" alter column "program_id" set data type uuid using "program_id"::uuid;

alter table "public"."sessions" alter column "service_id" set data type uuid using "service_id"::uuid;

alter table "public"."sessions" alter column "status" drop not null;

alter table "public"."sessions" alter column "updated_at" set default timezone('utc'::text, now());

alter table "public"."sessions" alter column "user_id" set default auth.uid();

CREATE UNIQUE INDEX idx_clients_user_id_email ON public.clients USING btree (user_id, email);

CREATE INDEX idx_programs_name ON public.programs USING btree (user_id, name);

CREATE INDEX idx_services_name ON public.services USING btree (user_id, name);

CREATE INDEX idx_sessions_session_time ON public.sessions USING btree (session_time);

alter table "public"."notes" add constraint "notes_session_id_fkey" FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE SET NULL not valid;

alter table "public"."notes" validate constraint "notes_session_id_fkey";

alter table "public"."sessions" add constraint "sessions_client_id_fkey" FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE not valid;

alter table "public"."sessions" validate constraint "sessions_client_id_fkey";

create policy "Users can manage their own clients"
on "public"."clients"
as permissive
for all
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Users can delete their own follow_ups"
on "public"."follow_ups"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can insert their own follow_ups"
on "public"."follow_ups"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can update their own follow_ups"
on "public"."follow_ups"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can view their own follow_ups"
on "public"."follow_ups"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Users can delete their own notes"
on "public"."notes"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can insert their own notes"
on "public"."notes"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can update their own notes"
on "public"."notes"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can view their own notes"
on "public"."notes"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Users can delete their own payments"
on "public"."payments"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can insert their own payments"
on "public"."payments"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can update their own payments"
on "public"."payments"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can view their own payments"
on "public"."payments"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Users can delete their own program_enrollments"
on "public"."program_enrollments"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can insert their own program_enrollments"
on "public"."program_enrollments"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can update their own program_enrollments"
on "public"."program_enrollments"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can view their own program_enrollments"
on "public"."program_enrollments"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Users can manage their own programs"
on "public"."programs"
as permissive
for all
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Users can manage their own services"
on "public"."services"
as permissive
for all
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Users can delete their own session_attendees"
on "public"."session_attendees"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can insert their own session_attendees"
on "public"."session_attendees"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can update their own session_attendees"
on "public"."session_attendees"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can view their own session_attendees"
on "public"."session_attendees"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Users can manage their own sessions"
on "public"."sessions"
as permissive
for all
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));



