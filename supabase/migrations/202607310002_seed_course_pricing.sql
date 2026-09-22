-- Imported course categories and published pricing from the acquired school.
do $$
declare
  item record;
begin
  for item in
    select * from jsonb_to_recordset($data$
      [
        {"title":"B kategória","price":"330 000 Ft","icon":"🚗","minimum_age":"16,5 év","exam_fee":"15 600 Ft","features":["Online KRESZ tanfolyam","Járműkezelési és forgalmi oktatás","Vizsgafelkészítés"],"price_details":[{"label":"Elmélet","value":"60 000 Ft"},{"label":"Járműkezelési órák","value":"9 × 9 000 Ft"},{"label":"Forgalmi órák + vizsgaóra","value":"21 × 9 000 Ft"},{"label":"Pótóra","value":"9 000 Ft"}],"sort_order":1},
        {"title":"B kategória (automata váltós)","price":"390 000 Ft","icon":"🚗","minimum_age":"16,5 év","exam_fee":"15 600 Ft","features":["Online KRESZ tanfolyam","Automata váltós oktatóautó","Járműkezelési és forgalmi oktatás"],"price_details":[{"label":"Elmélet","value":"60 000 Ft"},{"label":"Járműkezelési órák","value":"9 × 11 000 Ft"},{"label":"Forgalmi órák + vizsgaóra","value":"21 × 11 000 Ft"},{"label":"Pótóra","value":"11 000 Ft"}],"sort_order":2},
        {"title":"AM kategória","price":"159 000 Ft","icon":"🛵","minimum_age":"13,5 év","exam_fee":"27 000 Ft","features":["Segédmotor képzés","Járműkezelési és forgalmi oktatás","Vizsgafelkészítés"],"price_details":[{"label":"Elmélet","value":"60 000 Ft"},{"label":"Járműkezelési órák","value":"4 × 9 000 Ft"},{"label":"Forgalmi órák + vizsgaóra","value":"7 × 9 000 Ft"},{"label":"Pótóra","value":"9 000 Ft"}],"sort_order":3},
        {"title":"A kategória","price":"303 000 Ft","icon":"🏍️","minimum_age":"24 év","exam_fee":"47 400 Ft","features":["Motoros KRESZ","Járműkezelési és forgalmi oktatás","Vizsgafelkészítés"],"price_details":[{"label":"Elmélet","value":"60 000 Ft"},{"label":"Járműkezelési órák","value":"10 × 9 000 Ft"},{"label":"Forgalmi órák + vizsgaóra","value":"17 × 9 000 Ft"},{"label":"Pótóra","value":"9 000 Ft"}],"sort_order":4},
        {"title":"A1 kategória","price":"213 000 Ft","icon":"🏍️","minimum_age":"15,5 év","exam_fee":"47 400 Ft","features":["Motoros KRESZ","Járműkezelési és forgalmi oktatás","Vizsgafelkészítés"],"price_details":[{"label":"Elmélet","value":"60 000 Ft"},{"label":"Járműkezelési órák","value":"6 × 9 000 Ft"},{"label":"Forgalmi órák + vizsgaóra","value":"11 × 9 000 Ft"},{"label":"Pótóra","value":"9 000 Ft"}],"sort_order":5},
        {"title":"A2 kategória","price":"213 000 Ft","icon":"🏍️","minimum_age":"17,5 év","exam_fee":"47 400 Ft","features":["Motoros KRESZ","Járműkezelési és forgalmi oktatás","Vizsgafelkészítés"],"price_details":[{"label":"Elmélet","value":"60 000 Ft"},{"label":"Járműkezelési órák","value":"6 × 9 000 Ft"},{"label":"Forgalmi órák + vizsgaóra","value":"11 × 9 000 Ft"},{"label":"Pótóra","value":"9 000 Ft"}],"sort_order":6},
        {"title":"A kategória (2 éven belüli A korl. vagy A2)","price":"117 000 Ft","icon":"🏍️","minimum_age":"","exam_fee":"36 000 Ft","features":["Rövidített motoros képzés","Járműkezelési és forgalmi oktatás","Vizsgafelkészítés"],"price_details":[{"label":"Elmélet","value":"–"},{"label":"Járműkezelési órák","value":"4 × 9 000 Ft"},{"label":"Forgalmi órák + vizsgaóra","value":"9 × 9 000 Ft"},{"label":"Pótóra","value":"9 000 Ft"}],"sort_order":7},
        {"title":"A kategória (2 éven túli A korl. vagy A2)","price":"141 000 Ft","icon":"🏍️","minimum_age":"","exam_fee":"47 400 Ft","features":["Rövidített motoros képzés","Járműkezelési és forgalmi oktatás","Vizsgafelkészítés"],"price_details":[{"label":"Elmélet","value":"60 000 Ft"},{"label":"Járműkezelési órák","value":"2 × 9 000 Ft"},{"label":"Forgalmi órák + vizsgaóra","value":"7 × 9 000 Ft"},{"label":"Pótóra","value":"9 000 Ft"}],"sort_order":8},
        {"title":"A kategória (2 éven belüli A1)","price":"153 000 Ft","icon":"🏍️","minimum_age":"","exam_fee":"36 000 Ft","features":["Rövidített motoros képzés","Járműkezelési és forgalmi oktatás","Vizsgafelkészítés"],"price_details":[{"label":"Elmélet","value":"–"},{"label":"Járműkezelési órák","value":"6 × 9 000 Ft"},{"label":"Forgalmi órák + vizsgaóra","value":"11 × 9 000 Ft"},{"label":"Pótóra","value":"9 000 Ft"}],"sort_order":9},
        {"title":"A kategória (2 éven túli A1)","price":"159 000 Ft","icon":"🏍️","minimum_age":"","exam_fee":"47 400 Ft","features":["Rövidített motoros képzés","Járműkezelési és forgalmi oktatás","Vizsgafelkészítés"],"price_details":[{"label":"Elmélet","value":"60 000 Ft"},{"label":"Járműkezelési órák","value":"4 × 9 000 Ft"},{"label":"Forgalmi órák + vizsgaóra","value":"7 × 9 000 Ft"},{"label":"Pótóra","value":"9 000 Ft"}],"sort_order":10},
        {"title":"A2 kategória (2 éven belüli A1)","price":"117 000 Ft","icon":"🏍️","minimum_age":"","exam_fee":"36 000 Ft","features":["Rövidített motoros képzés","Járműkezelési és forgalmi oktatás","Vizsgafelkészítés"],"price_details":[{"label":"Elmélet","value":"–"},{"label":"Járműkezelési órák","value":"4 × 9 000 Ft"},{"label":"Forgalmi órák + vizsgaóra","value":"9 × 9 000 Ft"},{"label":"Pótóra","value":"9 000 Ft"}],"sort_order":11},
        {"title":"A2 kategória (2 éven túli A1)","price":"141 000 Ft","icon":"🏍️","minimum_age":"","exam_fee":"47 400 Ft","features":["Rövidített motoros képzés","Járműkezelési és forgalmi oktatás","Vizsgafelkészítés"],"price_details":[{"label":"Elmélet","value":"60 000 Ft"},{"label":"Járműkezelési órák","value":"2 × 9 000 Ft"},{"label":"Forgalmi órák + vizsgaóra","value":"7 × 9 000 Ft"},{"label":"Pótóra","value":"9 000 Ft"}],"sort_order":12}
      ]
    $data$::jsonb) as data(title text, price text, icon text, minimum_age text, exam_fee text, features jsonb, price_details jsonb, sort_order integer)
  loop
    update public.courses
    set price = item.price, icon = item.icon, minimum_age = nullif(item.minimum_age, ''), exam_fee = item.exam_fee,
        features = item.features, price_details = item.price_details, sort_order = item.sort_order, status = 'published'
    where title = item.title;

    if not found then
      insert into public.courses (title, price, icon, minimum_age, exam_fee, features, price_details, sort_order, status)
      values (item.title, item.price, item.icon, nullif(item.minimum_age, ''), item.exam_fee, item.features, item.price_details, item.sort_order, 'published');
    end if;
  end loop;

  update public.courses set status = 'draft' where title = 'Utánképzés';
end;
$$;
