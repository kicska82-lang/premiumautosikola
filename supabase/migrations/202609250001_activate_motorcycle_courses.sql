update public.courses
set status = 'published'::public.content_status
where title in (
  'AM kategória',
  'A kategória',
  'A1 kategória',
  'A2 kategória',
  'A kategória (2 éven belüli A korl. vagy A2)',
  'A kategória (2 éven túli A korl. vagy A2)',
  'A kategória (2 éven belüli A1)',
  'A kategória (2 éven túli A1)',
  'A2 kategória (2 éven belüli A1)',
  'A2 kategória (2 éven túli A1)'
);
