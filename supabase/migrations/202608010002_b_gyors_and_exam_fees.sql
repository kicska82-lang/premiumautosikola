-- Egységes vizsgadíj és B gyors képzés.
-- Futtasd a Supabase SQL Editorban, mielőtt a B gyors kártyát élesítenéd.

update public.courses
set exam_fee = '17 300 Ft';

insert into public.courses (
  title, price, icon, minimum_age, exam_fee, features, price_details, sort_order, status
)
select
  'B gyors',
  '370 000 Ft',
  '🚗',
  '16,5 év',
  '17 300 Ft',
  '["Online KRESZ tanfolyam", "Intenzív, rugalmas vezetési időpontok", "30 kötelező gyakorlati óra"]'::jsonb,
  '[{"label":"Elmélet","value":"40 000 Ft"},{"label":"Járműkezelési órák","value":"9 × 11 000 Ft"},{"label":"Forgalmi órák + vizsgaóra","value":"21 × 11 000 Ft"},{"label":"Pótóra","value":"11 000 Ft"}]'::jsonb,
  2,
  'published'
where not exists (
  select 1 from public.courses where title = 'B gyors'
);

update public.courses
set
  price = '370 000 Ft',
  icon = '🚗',
  minimum_age = '16,5 év',
  exam_fee = '17 300 Ft',
  features = '["Online KRESZ tanfolyam", "Intenzív, rugalmas vezetési időpontok", "30 kötelező gyakorlati óra"]'::jsonb,
  price_details = '[{"label":"Elmélet","value":"40 000 Ft"},{"label":"Járműkezelési órák","value":"9 × 11 000 Ft"},{"label":"Forgalmi órák + vizsgaóra","value":"21 × 11 000 Ft"},{"label":"Pótóra","value":"11 000 Ft"}]'::jsonb,
  sort_order = 2,
  status = 'published'
where title = 'B gyors';
