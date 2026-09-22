-- A hero leírásában félkövér arany színnel megjelenő, szerkeszthető kiemelés.
-- A giveaway_prize (például „Ford Fiesta”) ettől teljesen független marad.
alter table public.hero
  add column if not exists promotion_text text not null default 'Vezess nálunk 30 órát és részt veszel a nyitási promóciónkban!';

update public.hero
set
  promotion_text = 'Vezess nálunk 30 órát és részt veszel a nyitási promóciónkban!',
  description = replace(
    description,
    'Vezess nálunk 30 órát és részt veszel a nyereményjátékban!',
    'Vezess nálunk 30 órát és részt veszel a nyitási promóciónkban!'
  )
where coalesce(trim(promotion_text), '') = ''
   or description like '%Vezess nálunk 30 órát és részt veszel a nyereményjátékban!%';
