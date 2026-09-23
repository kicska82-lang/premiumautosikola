update public.cars
set gallery_images = jsonb_set(
  gallery_images,
  '{0}',
  '"/images/Kicska_Gabor_auto.jpg"'::jsonb
)
where instructor = 'Kicska Gábor Zoltán'
  and jsonb_array_length(gallery_images) > 0;
