alter table public.cars add column if not exists gallery_images jsonb not null default '[]'::jsonb;
update public.cars set gallery_images = jsonb_build_array(image) where jsonb_array_length(gallery_images) = 0 and image is not null;
