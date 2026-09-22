-- Csak akkor szükséges, ha a 202608010002_b_gyors_and_exam_fees.sql
-- már korábban lefutott a Supabase adatbázisban.

update public.courses
set price_details = '[
  {"label":"Elmélet","value":"40 000 Ft"},
  {"label":"Járműkezelési órák","value":"9 × 11 000 Ft"},
  {"label":"Forgalmi órák + vizsgaóra","value":"21 × 11 000 Ft"},
  {"label":"Pótóra","value":"11 000 Ft"}
]'::jsonb
where title = 'B gyors';
