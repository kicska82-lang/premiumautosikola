-- A képzési díjak a weboldalon megjelenő tételes árlista alapján.
-- Teljes képzéseknél: 40 000 Ft elmélet + kötelező gyakorlati órák.
-- A pótóra nem része az alap képzési díjnak.
update public.courses
set price = case title
  when 'B kategória' then '310 000 Ft'
  when 'B kategória (automata váltós)' then '370 000 Ft'
  when 'B gyors' then '370 000 Ft'
  when 'AM kategória' then '139 000 Ft'
  when 'A1 kategória' then '193 000 Ft'
  when 'A kategória' then '283 000 Ft'
  when 'A kategória (2 éven belüli A korl. vagy A2)' then '117 000 Ft'
  when 'A kategória (2 éven belüli A1)' then '153 000 Ft'
  when 'A kategória (2 éven túli A korl. vagy A2)' then '121 000 Ft'
  when 'A kategória (2 éven túli A1)' then '139 000 Ft'
  when 'A2 kategória' then '193 000 Ft'
  when 'A2 kategória (2 éven belüli A1)' then '117 000 Ft'
  when 'A2 kategória (2 éven túli A1)' then '121 000 Ft'
  else price
end;
