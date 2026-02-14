-- M3: 精霊マスターデータ追加
INSERT INTO public.spirits (id, name, description, rarity, sprite_url, appear_condition) VALUES
  ('forest_sprite', '森の精霊', '穏やかな森の精霊。緑に包まれた空間を好む。', 'common', null, '{"theme": ["forest", "light"], "min_minutes": 5}'),
  ('rain_spirit', '雨の精霊', '雨音に引き寄せられる水の精霊。', 'common', null, '{"ambient": "rain", "min_minutes": 10}'),
  ('ocean_fairy', '海の妖精', '波の音とともに現れる小さな妖精。', 'common', null, '{"theme": ["ocean"], "min_minutes": 10}'),
  ('fire_wisp', '炎のウィスプ', '暖炉の炎に宿る光の精霊。', 'uncommon', null, '{"ambient": "fire", "min_minutes": 15}'),
  ('night_owl', '夜のフクロウ', '夜更かしする者のそばに現れる。', 'uncommon', null, '{"time_range": [22, 4], "min_minutes": 20}'),
  ('dawn_sparrow', '暁のスズメ', '早朝に作業する者を祝福する。', 'uncommon', null, '{"time_range": [5, 7], "min_minutes": 15}'),
  ('sakura_spirit', '桜の精霊', '桜吹雪とともに現れる春の精霊。', 'rare', null, '{"theme": ["sakura"], "min_minutes": 25}'),
  ('autumn_fox', '紅葉の狐', '秋の紅葉の中に潜む神秘的な狐。', 'rare', null, '{"theme": ["autumn"], "min_minutes": 25}'),
  ('winter_crystal', '冬の結晶', '冬の静寂の中で生まれる氷の精霊。', 'rare', null, '{"theme": ["winter"], "min_minutes": 30}'),
  ('sunset_phoenix', '夕焼けの不死鳥', '夕暮れ時にのみ姿を見せる伝説の鳥。', 'legendary', null, '{"theme": ["sunset"], "time_range": [17, 19], "min_minutes": 45}'),
  ('star_dragon', '星のドラゴン', '100時間の集中から生まれる伝説の龍。', 'legendary', null, '{"total_hours": 100}'),
  ('harmony_spirit', '調和の精霊', 'すべての環境音を同時に感じた者に現れる。', 'legendary', null, '{"all_ambient": true, "min_minutes": 30}')
ON CONFLICT (id) DO NOTHING;
