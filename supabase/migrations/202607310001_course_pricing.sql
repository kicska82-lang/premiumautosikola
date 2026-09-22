-- Detailed pricing fields for the public price list and Admin → Képzések editor.
alter table public.courses
  add column if not exists minimum_age text,
  add column if not exists price_details jsonb not null default '[]'::jsonb,
  add column if not exists exam_fee text;
