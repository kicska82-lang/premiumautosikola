update public.cars
set instructor = 'Kicska Gábor Zoltán',
    gallery_images = '[
  "/images/kicska-gabor-autoval-v4.png",
  "/images/kicska-gabor-opel-kulso-v1.jpg",
  "/images/kicska-gabor-tanulokkal-v1.jpg",
  "/images/kicska-gabor-muszerfal-v1.jpg",
  "/images/kicska-gabor-opel-belso-v1.jpg"
]'::jsonb
where instructor = 'Kicska Gábor';

insert into public.cars (
  instructor,
  name,
  transmission,
  climate,
  image,
  gallery_images,
  sort_order,
  status
)
select
  'Moravcsik Gábor',
  'Suzuki Vitara',
  'Manuális váltó',
  'Klímás',
  '/images/moravcsik-gabor-suzuki-vitara-v1.jpg',
  '["/images/moravcsik-gabor-suzuki-vitara-v1.jpg"]'::jsonb,
  3,
  'published'::public.content_status
where not exists (
  select 1 from public.cars where instructor = 'Moravcsik Gábor'
);
