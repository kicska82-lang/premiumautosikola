-- The course totals already use a 40 000 Ft theory fee.  Keep every displayed
-- price-detail row in sync with those totals, including shortened motor courses.
with corrected_details as (
  select
    c.id,
    jsonb_agg(
      case
        when detail->>'label' = 'Elmélet' and detail->>'value' <> '–'
          then jsonb_set(detail, '{value}', '"40 000 Ft"'::jsonb)
        else detail
      end
      order by ordinality
    ) as price_details
  from public.courses c
  cross join lateral jsonb_array_elements(c.price_details) with ordinality as items(detail, ordinality)
  where c.status = 'published'
  group by c.id
)
update public.courses c
set price_details = corrected_details.price_details
from corrected_details
where c.id = corrected_details.id
  and c.price_details is distinct from corrected_details.price_details;
