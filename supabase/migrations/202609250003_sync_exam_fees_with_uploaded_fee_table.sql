-- Vizsgadíjak az „Irasbeli tajekoza zto kesz.docx.pdf” 9-10. oldalának táblázata szerint.
-- A képzési díjakat ez a migráció nem módosítja.

update public.courses
set exam_fee = case
  when title in ('B kategória', 'B kategória (automata váltós)', 'B gyors') then '17 300 Ft'
  when title = 'AM kategória' then '30 100 Ft'
  when title in ('A1 kategória', 'A kategória', 'A2 kategória') then '52 600 Ft'
  when title in (
    'A kategória (2 éven belüli A korl. vagy A2)',
    'A kategória (2 éven belüli A1)',
    'A2 kategória (2 éven belüli A1)'
  ) then '39 900 Ft'
  when title in (
    'A kategória (2 éven túli A korl. vagy A2)',
    'A kategória (2 éven túli A1)',
    'A2 kategória (2 éven túli A1)'
  ) then '52 600 Ft'
  else exam_fee
end;
