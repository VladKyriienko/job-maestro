alter table "public"."jobs" add column "job_category" text;

alter table "public"."jobs" alter column "contract_length" set data type numeric using "contract_length"::numeric;


