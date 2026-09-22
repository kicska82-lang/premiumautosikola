-- A Hero másodlagos gombjának tartalma az admin felületen is a jelenlegi navigációt tükrözze.
update public.hero
set
  secondary_button_text = 'Képzéseink',
  secondary_button_link = '/#kepzesek';
