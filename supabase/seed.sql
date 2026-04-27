-- =============================================================================
-- Celebr8 — Seed data: plans + 50 launch templates
-- Idempotent: uses ON CONFLICT for plans and matches templates by slug.
-- =============================================================================

-- Plans -----------------------------------------------------------------------
insert into public.plans (key, name, price_usd, max_events, max_guests_per_event, premium_templates, remove_watermark, csv_import, rsvp_dashboard, stripe_price_id) values
  ('free',     'Free Preview', 0.00,    0,    0,    false, false, false, false, null),
  ('starter',  'Starter',      4.99,    1,    50,   false, true,  false, true,  null),
  ('premium',  'Premium',      9.99,    1,    250,  true,  true,  true,  true,  null),
  ('family',   'Family',       14.99,   5,    500,  true,  true,  true,  true,  null),
  ('corporate','Corporate',    0.00,    null, null, true,  true,  true,  true,  null)
on conflict (key) do update set
  name = excluded.name,
  price_usd = excluded.price_usd,
  max_events = excluded.max_events,
  max_guests_per_event = excluded.max_guests_per_event,
  premium_templates = excluded.premium_templates,
  remove_watermark = excluded.remove_watermark,
  csv_import = excluded.csv_import,
  rsvp_dashboard = excluded.rsvp_dashboard;

-- Templates -------------------------------------------------------------------
-- Helper: 10 base layouts referenced from the template renderer
--  centered-card, photo-hero, split-card, mandap-frame, minimal-luxe,
--  festival-poster, kids-playful, corporate-clean, temple-arch, floral-frame

-- Use a single insert ... values block for atomicity, then de-dup via slug.

insert into public.templates
  (slug, name, category, base_layout, is_premium, supports_photo, supported_languages, thumbnail_url, preview_image_url, config, default_copy, status, sort_order)
values
-- =================== WEDDING (15) ===================
('wed-royal-mandap',   'Royal Mandap',         'wedding','mandap-frame',  true,  true,  array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#7F1F2C','accent','#C68A12','background','#FFF8EC','text','#15131A'), 'motif','mandap'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Aarav & Anika','headline','Together with our families','message','Join us as we begin our forever.'),
    'te', jsonb_build_object('hostNames','ఆరవ్ & అనిక','headline','మా కుటుంబాలతో కలిసి','message','మా జీవిత ప్రయాణం ప్రారంభించటానికి మాతో చేరండి.'),
    'hi', jsonb_build_object('hostNames','आरव & अनिका','headline','हमारे परिवारों के साथ','message','हमारे जीवन की नई शुरुआत में हमारे साथ शामिल हों।')
  ),
  'active', 1),
('wed-floral-arch',    'Floral Arch',          'wedding','floral-frame',  false, false, array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#A53743','accent','#F5C04C','background','#FFFCF6','text','#15131A'), 'motif','flowers'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Karthik & Keerthi','headline','Two souls, one journey','message','Witness our union and celebrate with us.'),
    'te', jsonb_build_object('hostNames','కార్తిక్ & కీర్తి','headline','రెండు ఆత్మలు, ఒక ప్రయాణం','message','మా వివాహాన్ని ఆశీర్వదించండి.'),
    'hi', jsonb_build_object('hostNames','कार्तिक & कीर्ति','headline','दो आत्माएँ, एक यात्रा','message','हमारे विवाह में पधारकर हमें आशीर्वाद दें।')
  ),
  'active', 2),
('wed-temple-arch',    'Temple Arch',          'wedding','temple-arch',   true,  false, array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#5A1320','accent','#E8A92B','background','#FFF1D8','text','#15131A'), 'motif','temple'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Surya & Sruthi','headline','With divine blessings','message','We invite you to grace our wedding.'),
    'te', jsonb_build_object('hostNames','సూర్య & శ్రుతి','headline','దైవ ఆశీర్వాదాలతో','message','మా వివాహ వేడుకకు తప్పక రావాలి.'),
    'hi', jsonb_build_object('hostNames','सूर्य & श्रुति','headline','दैवीय आशीर्वाद के साथ','message','हमारे विवाह में अपनी उपस्थिति देकर अनुग्रह करें।')
  ),
  'active', 3),
('wed-modern-minimal', 'Modern Minimal',       'wedding','minimal-luxe',  false, false, array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#15131A','accent','#C68A12','background','#FFFFFF','text','#15131A'), 'motif','line-art'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Ravi & Riya','headline','We''re getting married','message','Save the date and join us for the celebration.'),
    'te', jsonb_build_object('hostNames','రవి & రియా','headline','మేము పెళ్లి చేసుకుంటున్నాము','message','మా ప్రత్యేక రోజులో మాతో చేరండి.'),
    'hi', jsonb_build_object('hostNames','रवि & रिया','headline','हम शादी कर रहे हैं','message','हमारे ख़ास दिन को यादगार बनाने आइए।')
  ),
  'active', 4),
('wed-couple-photo',   'Couple Photo Hero',    'wedding','photo-hero',    true,  true,  array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#392671','accent','#F5C04C','background','#F1EEFB','text','#15131A'), 'motif','soft-glow'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Aditya & Meera','headline','The wedding of','message','We can''t wait to celebrate with you.'),
    'te', jsonb_build_object('hostNames','ఆదిత్య & మీరా','headline','వివాహ శుభలేఖ','message','మాతో పాటు ఆనందించండి.'),
    'hi', jsonb_build_object('hostNames','आदित्य & मीरा','headline','विवाह की शुभकामनाएँ','message','हम आपके साथ जश्न मनाने को उत्सुक हैं।')
  ),
  'active', 5),
('wed-south-trad',     'South Indian Traditional','wedding','floral-frame',true,false, array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#7F1F2C','accent','#E8A92B','background','#FFF8EC','text','#15131A'), 'motif','kalasham'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Naveen & Lakshmi','headline','Shubh Vivah','message','Be a part of our sacred journey.'),
    'te', jsonb_build_object('hostNames','నవీన్ & లక్ష్మి','headline','శుభ వివాహం','message','మా పవిత్ర ప్రయాణంలో పాలుపంచుకోండి.'),
    'hi', jsonb_build_object('hostNames','नवीन & लक्ष्मी','headline','शुभ विवाह','message','हमारी पवित्र यात्रा का हिस्सा बनें।')
  ),
  'active', 6),
('wed-classic-cream',  'Classic Cream',        'wedding','centered-card', false, false, array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#5A1320','accent','#C68A12','background','#FFFCF6','text','#15131A'), 'motif','classic'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Vikram & Pooja','headline','Wedding Invitation','message','Together with their families.'),
    'te', jsonb_build_object('hostNames','విక్రమ్ & పూజ','headline','వివాహ ఆహ్వానం','message','కుటుంబాలతో కలిసి.'),
    'hi', jsonb_build_object('hostNames','विक्रम & पूजा','headline','विवाह आमंत्रण','message','परिवार के साथ मिलकर।')
  ),
  'active', 7),
('wed-emerald-luxe',   'Emerald Luxe',         'wedding','minimal-luxe',  true,  false, array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#1D9E75','accent','#F5C04C','background','#E6F7EF','text','#15131A'), 'motif','emerald'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Rahul & Sneha','headline','A timeless love','message','Witness the start of forever.'),
    'te', jsonb_build_object('hostNames','రాహుల్ & స్నేహ','headline','శాశ్వత ప్రేమ','message','శాశ్వత ప్రయాణాన్ని చూడండి.'),
    'hi', jsonb_build_object('hostNames','राहुल & स्नेहा','headline','अनंत प्रेम','message','हमेशा की शुरुआत के साक्षी बनें।')
  ),
  'active', 8),
('wed-rose-gold',      'Rose Gold Elegance',   'wedding','floral-frame',  true,  false, array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#C95F69','accent','#F5C04C','background','#FBEBEC','text','#15131A'), 'motif','rose'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Arjun & Kavya','headline','Our happily ever after','message','Cherish this beautiful moment with us.'),
    'te', jsonb_build_object('hostNames','అర్జున్ & కావ్య','headline','మా శాశ్వత ఆనందం','message','ఈ అందమైన క్షణాన్ని పంచుకోండి.'),
    'hi', jsonb_build_object('hostNames','अर्जुन & काव्या','headline','हमारा सदा सुख','message','इस सुंदर क्षण को हमारे साथ साझा करें।')
  ),
  'active', 9),
('wed-traditional-tel','Telugu Traditional',   'wedding','mandap-frame',  false, false, array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#7F1F2C','accent','#E8A92B','background','#FFF1D8','text','#15131A'), 'motif','kalyanam'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Krishna & Priya','headline','Kalyanam Subhashunni','message','Bless the couple with your presence.'),
    'te', jsonb_build_object('hostNames','కృష్ణ & ప్రియ','headline','కల్యాణం శుభం','message','మీ ఆశీర్వాదాలతో పాల్గొనండి.'),
    'hi', jsonb_build_object('hostNames','कृष्ण & प्रिया','headline','शुभ कल्याण','message','अपने आशीर्वाद से शामिल हों।')
  ),
  'active', 10),
('wed-photo-storybook','Photo Storybook',      'wedding','photo-hero',    true,  true,  array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#392671','accent','#F5C04C','background','#FFFFFF','text','#15131A'), 'motif','storybook'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Manoj & Anjali','headline','Our love story','message','Be part of our next chapter.'),
    'te', jsonb_build_object('hostNames','మనోజ్ & అంజలి','headline','మా ప్రేమ కథ','message','తదుపరి అధ్యాయంలో పాల్గొనండి.'),
    'hi', jsonb_build_object('hostNames','मनोज & अंजली','headline','हमारी प्रेम कहानी','message','अगले अध्याय में शामिल हों।')
  ),
  'active', 11),
('wed-deco-gold',      'Art Deco Gold',        'wedding','minimal-luxe',  true,  false, array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#15131A','accent','#F5C04C','background','#FFF8EC','text','#15131A'), 'motif','deco'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Sahil & Tanvi','headline','A glamorous celebration','message','Dress up. We''re celebrating love.'),
    'te', jsonb_build_object('hostNames','సాహిల్ & తన్వి','headline','గ్లామరస్ వేడుక','message','ప్రేమను జరుపుకుందాం.'),
    'hi', jsonb_build_object('hostNames','साहिल & तन्वी','headline','भव्य उत्सव','message','प्यार का जश्न मनाएँ।')
  ),
  'active', 12),
('wed-paisley-print',  'Paisley Print',        'wedding','floral-frame',  false, false, array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#7F1F2C','accent','#1D9E75','background','#FFFCF6','text','#15131A'), 'motif','paisley'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Vinay & Sunitha','headline','With paisley patterns','message','We invite you with all our heart.'),
    'te', jsonb_build_object('hostNames','వినయ్ & సునీత','headline','మాంగల్య శుభం','message','మనస్ఫూర్తిగా ఆహ్వానం.'),
    'hi', jsonb_build_object('hostNames','विनय & सुनीता','headline','मांगलिक उत्सव','message','दिल से आमंत्रण।')
  ),
  'active', 13),
('wed-modern-split',   'Modern Split',         'wedding','split-card',    false, true,  array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#4F389B','accent','#F5C04C','background','#F1EEFB','text','#15131A'), 'motif','split'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Yash & Ishita','headline','Two stories, one beginning','message','Save the date.'),
    'te', jsonb_build_object('hostNames','యష్ & ఇషిత','headline','రెండు కథలు, ఒక మొదలు','message','తేదీ గుర్తుంచుకోండి.'),
    'hi', jsonb_build_object('hostNames','यश & इशिता','headline','दो कहानियाँ, एक शुरुआत','message','तारीख याद रखें।')
  ),
  'active', 14),
('wed-coral-blush',    'Coral Blush',          'wedding','centered-card', false, false, array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#D85A30','accent','#F5C04C','background','#FFF1D8','text','#15131A'), 'motif','blush'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Rohit & Neha','headline','Coral & blush','message','A warm celebration awaits.'),
    'te', jsonb_build_object('hostNames','రోహిత్ & నేహా','headline','రంగుల వేడుక','message','మీ ఆగమనం కోసం ఎదురుచూస్తున్నాము.'),
    'hi', jsonb_build_object('hostNames','रोहित & नेहा','headline','कोरल & ब्लश','message','गर्मजोशी से उत्सव।')
  ),
  'active', 15),

-- =================== BIRTHDAY (10) ===================
('bday-first-cake',    'First Birthday Cake',  'birthday','kids-playful', false, true,  array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#D85A30','accent','#F5C04C','background','#FFF8EC','text','#15131A'), 'motif','cake'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Baby Aarav','headline','Turning One!','message','Celebrate our little one''s first year.'),
    'te', jsonb_build_object('hostNames','బేబీ ఆరవ్','headline','తొలి పుట్టినరోజు','message','మా చిన్నారి తొలి పుట్టినరోజును జరుపుకుందాం.'),
    'hi', jsonb_build_object('hostNames','बेबी आरव','headline','पहला जन्मदिन','message','हमारे नन्हें का पहला साल मनाएँ।')
  ),
  'active', 16),
('bday-kids-rainbow',  'Kids Rainbow',         'birthday','kids-playful', false, true,  array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#2C72C7','accent','#EF9F27','background','#FFFCF6','text','#15131A'), 'motif','rainbow'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Diya','headline','Let''s party!','message','Games, cake & lots of fun.'),
    'te', jsonb_build_object('hostNames','దియా','headline','పార్టీ చేద్దాం!','message','ఆటలు, కేక్, ఆనందం.'),
    'hi', jsonb_build_object('hostNames','दिया','headline','चलो पार्टी करें!','message','खेल, केक और मज़ा।')
  ),
  'active', 17),
('bday-milestone-30',  'Milestone Celebration','birthday','minimal-luxe', true,  true,  array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#15131A','accent','#F5C04C','background','#FFFCF6','text','#15131A'), 'motif','milestone'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Arjun','headline','Cheers to 30','message','Join us for an evening of memories.'),
    'te', jsonb_build_object('hostNames','అర్జున్','headline','30కి ఆనందం','message','జ్ఞాపకాల సాయంత్రం కోసం రండి.'),
    'hi', jsonb_build_object('hostNames','अर्जुन','headline','30 की सलामी','message','यादों भरी शाम में शामिल हों।')
  ),
  'active', 18),
('bday-elegant-adult', 'Elegant Adult',        'birthday','minimal-luxe', true,  true,  array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#392671','accent','#C68A12','background','#F1EEFB','text','#15131A'), 'motif','elegant'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Pooja','headline','An elegant evening','message','Cocktails, dinner and laughter.'),
    'te', jsonb_build_object('hostNames','పూజ','headline','సొగసైన సాయంత్రం','message','విందు, పానీయాలు.'),
    'hi', jsonb_build_object('hostNames','पूजा','headline','एक भव्य शाम','message','डिनर और हँसी का जश्न।')
  ),
  'active', 19),
('bday-photo-burst',   'Photo Burst',          'birthday','photo-hero',   true,  true,  array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#A53743','accent','#F5C04C','background','#FFFCF6','text','#15131A'), 'motif','photo-burst'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Sara','headline','Through the years','message','A photo-filled celebration.'),
    'te', jsonb_build_object('hostNames','సారా','headline','ఏళ్ల ద్వారా','message','ఫోటోల వేడుక.'),
    'hi', jsonb_build_object('hostNames','सारा','headline','सालों के साथ','message','फ़ोटो भरा जश्न।')
  ),
  'active', 20),
('bday-party-pop',     'Party Pop',            'birthday','kids-playful', false, true,  array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#7F77DD','accent','#EF9F27','background','#FFF8EC','text','#15131A'), 'motif','confetti'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Kabir','headline','Pop, fizz, clink','message','It''s a party!'),
    'te', jsonb_build_object('hostNames','కబీర్','headline','పార్టీ సమయం','message','ఆనందమయ సాయంత్రం.'),
    'hi', jsonb_build_object('hostNames','कबीर','headline','पार्टी टाइम','message','मज़ेदार शाम।')
  ),
  'active', 21),
('bday-cinema-night',  'Cinema Night',         'birthday','split-card',   true,  true,  array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#15131A','accent','#F5C04C','background','#FFFFFF','text','#15131A'), 'motif','cinema'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Rahul','headline','A movie-themed night','message','Lights, camera, action!'),
    'te', jsonb_build_object('hostNames','రాహుల్','headline','సినిమా రాత్రి','message','లైట్స్, కామెరా, యాక్షన్!'),
    'hi', jsonb_build_object('hostNames','राहुल','headline','सिनेमा रात','message','लाइट्स, कैमरा, एक्शन!')
  ),
  'active', 22),
('bday-floral-femme',  'Floral Feminine',      'birthday','floral-frame', false, false, array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#C95F69','accent','#F5C04C','background','#FBEBEC','text','#15131A'), 'motif','floral'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Anika','headline','Bloom','message','A garden-style celebration.'),
    'te', jsonb_build_object('hostNames','అనిక','headline','పూల వేడుక','message','గార్డెన్ స్టైల్ ఈవెంట్.'),
    'hi', jsonb_build_object('hostNames','अनिका','headline','फूलों का जश्न','message','गार्डन थीम पार्टी।')
  ),
  'active', 23),
('bday-superhero',     'Superhero',            'birthday','kids-playful', false, true,  array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#2C72C7','accent','#C03744','background','#EEF4FF','text','#15131A'), 'motif','superhero'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Veer','headline','Super day','message','Wear your cape!'),
    'te', jsonb_build_object('hostNames','వీర్','headline','సూపర్ పుట్టినరోజు','message','కేప్ ధరించి రండి!'),
    'hi', jsonb_build_object('hostNames','वीर','headline','सुपर बर्थडे','message','केप पहनकर आइए!')
  ),
  'active', 24),
('bday-gold-classic',  'Gold Classic',         'birthday','centered-card',false, false, array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#15131A','accent','#F5C04C','background','#FFF8EC','text','#15131A'), 'motif','gold'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Reema','headline','A golden year','message','You''re invited.'),
    'te', jsonb_build_object('hostNames','రీమా','headline','బంగారు సంవత్సరం','message','మీకు ఆహ్వానం.'),
    'hi', jsonb_build_object('hostNames','रीमा','headline','सुनहरा साल','message','आप आमंत्रित हैं।')
  ),
  'active', 25),

-- =================== HOUSEWARMING (8) ===================
('hw-gruhapravesam',   'Gruhapravesam Classic','housewarming','temple-arch',false,false,array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#7F1F2C','accent','#E8A92B','background','#FFF1D8','text','#15131A'), 'motif','kalasam'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Rao Family','headline','Gruhapravesam','message','Bless our new home with your presence.'),
    'te', jsonb_build_object('hostNames','రావ్ కుటుంబం','headline','గృహప్రవేశం','message','మా కొత్త ఇంటిని ఆశీర్వదించండి.'),
    'hi', jsonb_build_object('hostNames','राव परिवार','headline','गृहप्रवेश','message','हमारे नए घर को आशीर्वाद दें।')
  ),
  'active', 26),
('hw-satya-vratham',   'Satyanarayana Vratham','housewarming','temple-arch',true, false,array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#5A1320','accent','#E8A92B','background','#FFF8EC','text','#15131A'), 'motif','vratham'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Sharma Family','headline','Satyanarayana Vratham','message','Join us for the puja and blessings.'),
    'te', jsonb_build_object('hostNames','శర్మ కుటుంబం','headline','సత్యనారాయణ వ్రతం','message','పూజ, ఆశీర్వాదాల కోసం రండి.'),
    'hi', jsonb_build_object('hostNames','शर्मा परिवार','headline','सत्यनारायण व्रत','message','पूजा और आशीर्वाद के लिए पधारें।')
  ),
  'active', 27),
('hw-modern-home',     'Modern Home',          'housewarming','minimal-luxe',false,true, array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#15131A','accent','#1D9E75','background','#FFFCF6','text','#15131A'), 'motif','modern'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','The Reddys','headline','We''re home','message','Come see our new beginning.'),
    'te', jsonb_build_object('hostNames','రెడ్డి కుటుంబం','headline','కొత్త ఇంటికి స్వాగతం','message','మా కొత్త ప్రారంభాన్ని చూడండి.'),
    'hi', jsonb_build_object('hostNames','रेड्डी परिवार','headline','नया घर','message','नई शुरुआत देखने आइए।')
  ),
  'active', 28),
('hw-diya-glow',       'Diya Glow',            'housewarming','floral-frame',false,false,array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#7F1F2C','accent','#F5C04C','background','#FFF8EC','text','#15131A'), 'motif','diya'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Patel Family','headline','Light upon our home','message','Bring blessings, share joy.'),
    'te', jsonb_build_object('hostNames','పటేల్ కుటుంబం','headline','మా ఇంటికి కాంతి','message','ఆనందాన్ని పంచుకోండి.'),
    'hi', jsonb_build_object('hostNames','पटेल परिवार','headline','घर में उजाला','message','खुशियाँ साझा करें।')
  ),
  'active', 29),
('hw-kalasam-frame',   'Kalasam Frame',        'housewarming','mandap-frame',true, false,array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#7F1F2C','accent','#E8A92B','background','#FFF1D8','text','#15131A'), 'motif','kalasam'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Rao & Family','headline','Auspicious housewarming','message','Bless this home.'),
    'te', jsonb_build_object('hostNames','రావ్ కుటుంబం','headline','శుభ గృహప్రవేశం','message','ఈ ఇంటిని ఆశీర్వదించండి.'),
    'hi', jsonb_build_object('hostNames','राव परिवार','headline','शुभ गृहप्रवेश','message','इस घर को आशीर्वाद दें।')
  ),
  'active', 30),
('hw-warm-ivory',      'Warm Ivory',           'housewarming','centered-card',false,false,array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#5A1320','accent','#C68A12','background','#FFFCF6','text','#15131A'), 'motif','warm'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Iyer Family','headline','Welcome home','message','We have a new address.'),
    'te', jsonb_build_object('hostNames','అయ్యర్ కుటుంబం','headline','కొత్త ఇంటికి స్వాగతం','message','మా చిరునామా మారింది.'),
    'hi', jsonb_build_object('hostNames','अय्यर परिवार','headline','नए घर का स्वागत','message','हमारा नया पता।')
  ),
  'active', 31),
('hw-floral-bless',    'Floral Blessing',      'housewarming','floral-frame',false,false,array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#A53743','accent','#1D9E75','background','#FBEBEC','text','#15131A'), 'motif','flowers'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','The Naidus','headline','A blossoming home','message','Share our happiness.'),
    'te', jsonb_build_object('hostNames','నాయుడు కుటుంబం','headline','పూవులతో ఆశీర్వాదం','message','ఆనందాన్ని పంచుకోండి.'),
    'hi', jsonb_build_object('hostNames','नायडू परिवार','headline','फूलों भरा घर','message','खुशियाँ बाँटें।')
  ),
  'active', 32),
('hw-arch-gold',       'Arch of Gold',         'housewarming','temple-arch',true, false,array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#5A1320','accent','#F5C04C','background','#FFF1D8','text','#15131A'), 'motif','arch'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','The Choudharys','headline','Sacred new beginnings','message','Grace our home.'),
    'te', jsonb_build_object('hostNames','చౌదరి కుటుంబం','headline','పవిత్ర ప్రారంభం','message','మా ఇంటిని ఆశీర్వదించండి.'),
    'hi', jsonb_build_object('hostNames','चौधरी परिवार','headline','पवित्र शुरुआत','message','हमारा घर पवित्र करें।')
  ),
  'active', 33),

-- =================== BABY (7) ===================
('baby-shower-pastel', 'Pastel Baby Shower',   'baby','floral-frame',     false, true,  array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#7F77DD','accent','#F5C04C','background','#F1EEFB','text','#15131A'), 'motif','pastel'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Riya & Sandeep','headline','Baby on the way','message','Shower the parents-to-be with love.'),
    'te', jsonb_build_object('hostNames','రియా & సందీప్','headline','పుట్టబోయే బిడ్డ','message','ప్రేమతో ఆశీర్వదించండి.'),
    'hi', jsonb_build_object('hostNames','रिया & संदीप','headline','नन्हें के स्वागत में','message','माता-पिता को आशीर्वाद दें।')
  ),
  'active', 34),
('baby-naming',        'Naming Ceremony',      'baby','temple-arch',      false, true,  array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#5A1320','accent','#E8A92B','background','#FFF8EC','text','#15131A'), 'motif','naming'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Baby Aanya','headline','Naming Ceremony','message','Bless our little one with a name.'),
    'te', jsonb_build_object('hostNames','బేబీ ఆన్య','headline','నామకరణం','message','మా చిన్నారిని ఆశీర్వదించండి.'),
    'hi', jsonb_build_object('hostNames','बेबी आन्या','headline','नामकरण','message','हमारे नन्हें को आशीर्वाद दें।')
  ),
  'active', 35),
('baby-annaprashana',  'Annaprashana',         'baby','temple-arch',      true,  true,  array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#7F1F2C','accent','#E8A92B','background','#FFF1D8','text','#15131A'), 'motif','rice'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Baby Aarav','headline','Annaprashana','message','First rice ceremony.'),
    'te', jsonb_build_object('hostNames','బేబీ ఆరవ్','headline','అన్నప్రాశన','message','తొలి అన్నం వేడుక.'),
    'hi', jsonb_build_object('hostNames','बेबी आरव','headline','अन्नप्राशन','message','पहला अन्न संस्कार।')
  ),
  'active', 36),
('baby-cradle',        'Cradle Ceremony',      'baby','floral-frame',     false, true,  array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#C95F69','accent','#1D9E75','background','#FBEBEC','text','#15131A'), 'motif','cradle'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Baby Diya','headline','Cradle Ceremony','message','Welcome home, little one.'),
    'te', jsonb_build_object('hostNames','బేబీ దియా','headline','ఊయల వేడుక','message','ఇంటికి స్వాగతం, చిన్నారి.'),
    'hi', jsonb_build_object('hostNames','बेबी दिया','headline','पालना समारोह','message','नन्हें का स्वागत।')
  ),
  'active', 37),
('baby-playful-clouds','Playful Clouds',       'baby','kids-playful',     false, true,  array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#2C72C7','accent','#F5C04C','background','#EEF4FF','text','#15131A'), 'motif','clouds'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Baby Kabir','headline','Up in the clouds','message','A sky-themed celebration.'),
    'te', jsonb_build_object('hostNames','బేబీ కబీర్','headline','మేఘాల పైన','message','ఆకాశ థీమ్ వేడుక.'),
    'hi', jsonb_build_object('hostNames','बेबी कबीर','headline','बादलों के बीच','message','आसमान थीम पार्टी।')
  ),
  'active', 38),
('baby-pink-bow',      'Pink Bow',             'baby','floral-frame',     true,  true,  array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#C95F69','accent','#F5C04C','background','#FBEBEC','text','#15131A'), 'motif','bow'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Baby Anika','headline','It''s a girl','message','Pink bows and tiny toes.'),
    'te', jsonb_build_object('hostNames','బేబీ అనిక','headline','అమ్మాయి','message','గులాబీ రిబ్బన్లు, చిన్న పాదాలు.'),
    'hi', jsonb_build_object('hostNames','बेबी अनिका','headline','यह लड़की है','message','गुलाबी रिबन।')
  ),
  'active', 39),
('baby-blue-stars',    'Blue Stars',           'baby','kids-playful',     true,  true,  array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#2C72C7','accent','#F5C04C','background','#EEF4FF','text','#15131A'), 'motif','stars'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Baby Vihaan','headline','It''s a boy','message','Blue stars and big dreams.'),
    'te', jsonb_build_object('hostNames','బేబీ విహాన్','headline','అబ్బాయి','message','నీలి తారలు, పెద్ద కలలు.'),
    'hi', jsonb_build_object('hostNames','बेबी विहान','headline','यह लड़का है','message','नीले तारे, बड़े सपने।')
  ),
  'active', 40),

-- =================== FESTIVAL (5) ===================
('fest-diwali',        'Diwali Lights',        'festival','festival-poster',false,false,array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#7F1F2C','accent','#F5C04C','background','#FFF1D8','text','#15131A'), 'motif','diya'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Sharma Family','headline','Happy Diwali','message','A festival of lights and joy.'),
    'te', jsonb_build_object('hostNames','శర్మ కుటుంబం','headline','దీపావళి శుభాకాంక్షలు','message','దీపాల పండుగ.'),
    'hi', jsonb_build_object('hostNames','शर्मा परिवार','headline','शुभ दीपावली','message','रोशनी और खुशी का पर्व।')
  ),
  'active', 41),
('fest-sankranti',     'Sankranti Harvest',    'festival','festival-poster',true, false,array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#A53743','accent','#E8A92B','background','#FFF8EC','text','#15131A'), 'motif','sankranti'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','The Reddys','headline','Happy Sankranti','message','Celebrate the harvest with us.'),
    'te', jsonb_build_object('hostNames','రెడ్డి కుటుంబం','headline','సంక్రాంతి శుభాకాంక్షలు','message','పంట పండుగను జరుపుకుందాం.'),
    'hi', jsonb_build_object('hostNames','रेड्डी परिवार','headline','मकर संक्रांति','message','फसल का पर्व मनाएँ।')
  ),
  'active', 42),
('fest-ugadi',         'Ugadi New Year',       'festival','festival-poster',false,false,array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#1D9E75','accent','#F5C04C','background','#E6F7EF','text','#15131A'), 'motif','mango-leaves'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','The Naidus','headline','Happy Ugadi','message','New beginnings for a beautiful year.'),
    'te', jsonb_build_object('hostNames','నాయుడు కుటుంబం','headline','ఉగాది శుభాకాంక్షలు','message','కొత్త సంవత్సర ఆరంభం.'),
    'hi', jsonb_build_object('hostNames','नायडू परिवार','headline','शुभ उगादी','message','नए वर्ष की शुरुआत।')
  ),
  'active', 43),
('fest-holi',          'Holi Colors',          'festival','festival-poster',false,false,array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#7F77DD','accent','#EF9F27','background','#F1EEFB','text','#15131A'), 'motif','colors'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','The Guptas','headline','Happy Holi','message','Colors, music & sweets!'),
    'te', jsonb_build_object('hostNames','గుప్తా కుటుంబం','headline','హోలీ శుభాకాంక్షలు','message','రంగుల పండుగ.'),
    'hi', jsonb_build_object('hostNames','गुप्ता परिवार','headline','शुभ होली','message','रंगों का त्योहार।')
  ),
  'active', 44),
('fest-eid',           'Eid Mubarak',          'festival','festival-poster',true, false,array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#1D9E75','accent','#F5C04C','background','#E6F7EF','text','#15131A'), 'motif','crescent'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','The Khans','headline','Eid Mubarak','message','Share the blessings of Eid.'),
    'te', jsonb_build_object('hostNames','ఖాన్ కుటుంబం','headline','ఈద్ ముబారక్','message','ఈద్ ఆశీర్వాదాలను పంచుకోండి.'),
    'hi', jsonb_build_object('hostNames','ख़ान परिवार','headline','ईद मुबारक','message','ईद की शुभकामनाएँ।')
  ),
  'active', 45),

-- =================== CORPORATE (5) ===================
('corp-grand-opening', 'Grand Opening',        'corporate','corporate-clean',false,false,array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#15131A','accent','#F5C04C','background','#FFFFFF','text','#15131A'), 'motif','ribbon'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Acme Co','headline','Grand Opening','message','Join us for the ribbon-cutting.'),
    'te', jsonb_build_object('hostNames','ఆక్మే కో','headline','గ్రాండ్ ఓపెనింగ్','message','రిబ్బన్ కట్టింగ్‌కు రండి.'),
    'hi', jsonb_build_object('hostNames','एक्मे को','headline','भव्य उद्घाटन','message','उद्घाटन में पधारें।')
  ),
  'active', 46),
('corp-office-party',  'Office Party',         'corporate','corporate-clean',false,false,array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#2C72C7','accent','#F5C04C','background','#EEF4FF','text','#15131A'), 'motif','party'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Team Acme','headline','Annual Party','message','Food, fun and team awards.'),
    'te', jsonb_build_object('hostNames','టీం ఆక్మే','headline','వార్షిక పార్టీ','message','విందు, ఆనందం, అవార్డులు.'),
    'hi', jsonb_build_object('hostNames','टीम एक्मे','headline','वार्षिक पार्टी','message','खाना, मज़ा, अवार्ड्स।')
  ),
  'active', 47),
('corp-inauguration',  'Inauguration',         'corporate','corporate-clean',true, false,array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#15131A','accent','#1D9E75','background','#FFFFFF','text','#15131A'), 'motif','inauguration'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Acme Group','headline','Inauguration','message','Be a part of our milestone.'),
    'te', jsonb_build_object('hostNames','ఆక్మే గ్రూప్','headline','ప్రారంభోత్సవం','message','మా మైలురాయిలో పాల్గొనండి.'),
    'hi', jsonb_build_object('hostNames','एक्मे ग्रुप','headline','उद्घाटन','message','हमारी उपलब्धि का हिस्सा बनें।')
  ),
  'active', 48),
('corp-conference',    'Conference',           'corporate','corporate-clean',true, false,array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#392671','accent','#F5C04C','background','#F1EEFB','text','#15131A'), 'motif','conference'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','Acme Conf 2026','headline','Annual Conference','message','Learn, connect and grow.'),
    'te', jsonb_build_object('hostNames','ఆక్మే కాన్ఫ్ 2026','headline','వార్షిక సమావేశం','message','నేర్చుకోండి, కలవండి.'),
    'hi', jsonb_build_object('hostNames','एक्मे कॉन्फ 2026','headline','वार्षिक सम्मेलन','message','सीखें, जुड़ें, बढ़ें।')
  ),
  'active', 49),
('corp-nri-reunion',   'NRI Family Reunion',   'corporate','minimal-luxe', false, true,  array['en','te','hi'], null, null,
  jsonb_build_object('colors', jsonb_build_object('primary','#7F1F2C','accent','#F5C04C','background','#FFF8EC','text','#15131A'), 'motif','reunion'),
  jsonb_build_object(
    'en', jsonb_build_object('hostNames','The Rao Family','headline','Family Reunion','message','Across borders, one family.'),
    'te', jsonb_build_object('hostNames','రావ్ కుటుంబం','headline','కుటుంబ సమావేశం','message','దేశాల అడ్డా, ఒకే కుటుంబం.'),
    'hi', jsonb_build_object('hostNames','राव परिवार','headline','पारिवारिक मिलन','message','सीमाओं पार, एक परिवार।')
  ),
  'active', 50)
on conflict (slug) do nothing;
