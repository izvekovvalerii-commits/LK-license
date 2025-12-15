-- Create test tasks for managers (10 tasks per manager)
-- Manager 1 (ID: 2) - Петров Петр
-- Manager 2 (ID: 3) - Сидорова Мария

-- Tasks for Manager 1 (Петров Петр, ID: 2)
INSERT INTO tasks (title, description, license_type, action_type, status, store_id, assignee_id, created_by_id, deadline_date, created_at, updated_at) VALUES
('Получение алкогольной лицензии для магазина №101', 'Оформление новой лицензии на розничную продажу алкоголя', 'ALCOHOL', 'NEW', 'IN_PROGRESS', 1, 2, 1, CURRENT_DATE + INTERVAL '30 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Продление табачной лицензии магазина №205', 'Продление действующей лицензии на продажу табака', 'TOBACCO', 'RENEWAL', 'ASSIGNED', 2, 2, 1, CURRENT_DATE + INTERVAL '45 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Алкогольная лицензия для магазина на Невском', 'Новая лицензия для открывшегося магазина', 'ALCOHOL', 'NEW', 'IN_PROGRESS', 3, 2, 1, CURRENT_DATE + INTERVAL '20 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Продление алкогольной лицензии №А-12345', 'Плановое продление лицензии', 'ALCOHOL', 'RENEWAL', 'DONE', 4, 2, 1, CURRENT_DATE - INTERVAL '5 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Табачная лицензия магазин Центральный', 'Получение новой табачной лицензии', 'TOBACCO', 'NEW', 'IN_PROGRESS', 5, 2, 1, CURRENT_DATE + INTERVAL '25 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Замена алкогольной лицензии из-за смены адреса', 'Переоформление в связи с изменением юридического адреса', 'ALCOHOL', 'NEW', 'ASSIGNED', 1, 2, 1, CURRENT_DATE + INTERVAL '35 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Продление табачной лицензии №Т-67890', 'Продление истекающей лицензии', 'TOBACCO', 'RENEWAL', 'IN_PROGRESS', 2, 2, 1, CURRENT_DATE + INTERVAL '15 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Срочное получение алкогольной лицензии', 'Ускоренное оформление для нового магазина', 'ALCOHOL', 'NEW', 'IN_PROGRESS', 3, 2, 1, CURRENT_DATE + INTERVAL '10 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Продление алкогольной лицензии Магазин №7', 'Плановое продление действующей лицензии', 'ALCOHOL', 'RENEWAL', 'DONE', 4, 2, 1, CURRENT_DATE - INTERVAL '10 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Табачная лицензия для сети Пятёрочка', 'Новая лицензия для магазина сети', 'TOBACCO', 'NEW', 'ASSIGNED', 5, 2, 1, CURRENT_DATE + INTERVAL '40 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Tasks for Manager 2 (Сидорова Мария, ID: 3)
INSERT INTO tasks (title, description, license_type, action_type, status, store_id, assignee_id, created_by_id, deadline_date, created_at, updated_at) VALUES
('Алкогольная лицензия для ТЦ Галерея', 'Оформление лицензии для магазина в торговом центре', 'ALCOHOL', 'NEW', 'IN_PROGRESS', 1, 3, 1, CURRENT_DATE + INTERVAL '28 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Продление табачной лицензии магазина на Ленина', 'Продление истекающей лицензии', 'TOBACCO', 'RENEWAL', 'IN_PROGRESS', 2, 3, 1, CURRENT_DATE + INTERVAL '18 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Новая алкогольная лицензия супермаркет Перекресток', 'Получение лицензии для нового супермаркета', 'ALCOHOL', 'NEW', 'ASSIGNED', 3, 3, 1, CURRENT_DATE + INTERVAL '50 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Продление алкогольной лицензии №А-98765', 'Плановое продление', 'ALCOHOL', 'RENEWAL', 'DONE', 4, 3, 1, CURRENT_DATE - INTERVAL '3 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Табачная лицензия магазин у метро', 'Новая лицензия для точки у станции метро', 'TOBACCO', 'NEW', 'IN_PROGRESS', 5, 3, 1, CURRENT_DATE + INTERVAL '22 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Переоформление алкогольной лицензии', 'Смена организационно-правовой формы', 'ALCOHOL', 'NEW', 'ASSIGNED', 1, 3, 1, CURRENT_DATE + INTERVAL '33 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Продление табачной лицензии №Т-11111', 'Продление на 5 лет', 'TOBACCO', 'RENEWAL', 'IN_PROGRESS', 2, 3, 1, CURRENT_DATE + INTERVAL '12 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Алкогольная лицензия Гипермаркет Лента', 'Новая лицензия для гипермаркета', 'ALCOHOL', 'NEW', 'SUSPENDED', 3, 3, 1, CURRENT_DATE + INTERVAL '60 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Продление алкогольной лицензии Магазин №15', 'Плановое продление', 'ALCOHOL', 'RENEWAL', 'DONE', 4, 3, 1, CURRENT_DATE - INTERVAL '7 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Табачная лицензия для франчайзи', 'Оформление лицензии для франшизы', 'TOBACCO', 'NEW', 'ASSIGNED', 5, 3, 1, CURRENT_DATE + INTERVAL '38 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
