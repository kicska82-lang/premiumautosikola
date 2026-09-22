-- Az alap képzési díj a kötelező díjtételek összege; a pótóra nem része annak.
with updated_details as (
  select
    c.id,
    jsonb_agg(
      case
        when detail->>'label' = 'Elmélet' and detail->>'value' <> '–'
          then jsonb_set(detail, '{value}', '"40 000 Ft"'::jsonb)
        else detail
      end
    order by position) as price_details
  from public.courses c
  cross join lateral jsonb_array_elements(c.price_details) with ordinality as item(detail, position)
  group by c.id
)
update public.courses c
set price_details = updated_details.price_details
from updated_details
where c.id = updated_details.id;

update public.courses
set price = case title
  when 'B kategória' then '310 000 Ft'
  when 'B kategória (automata váltós)' then '370 000 Ft'
  when 'AM kategória' then '139 000 Ft'
  when 'A kategória' then '283 000 Ft'
  when 'A1 kategória' then '193 000 Ft'
  when 'A2 kategória' then '193 000 Ft'
  when 'A kategória (2 éven belüli A korl. vagy A2)' then '117 000 Ft'
  when 'A kategória (2 éven túli A korl. vagy A2)' then '121 000 Ft'
  when 'A kategória (2 éven belüli A1)' then '153 000 Ft'
  when 'A kategória (2 éven túli A1)' then '139 000 Ft'
  when 'A2 kategória (2 éven belüli A1)' then '117 000 Ft'
  when 'A2 kategória (2 éven túli A1)' then '121 000 Ft'
  else price
end;
