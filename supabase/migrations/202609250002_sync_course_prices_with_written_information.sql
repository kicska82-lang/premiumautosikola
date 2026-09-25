-- Díjak a 2026.09.14-i írásbeli tájékoztató 13. pontjának táblázatai szerint.
-- A "price" a táblázat "Összesen" oszlopának értéke; a vizsgadíj külön fizetendő.

update public.courses
set price = case title
  when 'B kategória' then '315 000 Ft'
  when 'AM kategória' then '144 000 Ft'
  when 'A1 kategória' then '198 000 Ft'
  when 'A kategória' then '288 000 Ft'
  when 'A kategória (2 éven belüli A korl. vagy A2)' then '117 000 Ft'
  when 'A kategória (2 éven belüli A1)' then '153 000 Ft'
  when 'A kategória (2 éven túli A korl. vagy A2)' then '126 000 Ft'
  when 'A kategória (2 éven túli A1)' then '144 000 Ft'
  when 'A2 kategória' then '198 000 Ft'
  when 'A2 kategória (2 éven belüli A1)' then '117 000 Ft'
  when 'A2 kategória (2 éven túli A1)' then '126 000 Ft'
  else price
end,
exam_fee = case
  when title in ('B kategória', 'B kategória (automata váltós)', 'B gyors') then '15 600 Ft'
  when title = 'AM kategória' then '24 900 Ft'
  when title in (
    'A kategória (2 éven belüli A korl. vagy A2)',
    'A kategória (2 éven belüli A1)',
    'A2 kategória (2 éven belüli A1)'
  ) then '33 000 Ft'
  when title in (
    'A1 kategória',
    'A kategória',
    'A kategória (2 éven túli A korl. vagy A2)',
    'A kategória (2 éven túli A1)',
    'A2 kategória',
    'A2 kategória (2 éven túli A1)'
  ) then '43 500 Ft'
  else exam_fee
end;
