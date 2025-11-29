-- Add new columns to stores table
ALTER TABLE stores ADD COLUMN IF NOT EXISTS mvz VARCHAR(10);
ALTER TABLE stores ADD COLUMN IF NOT EXISTS cfo VARCHAR(10);
ALTER TABLE stores ADD COLUMN IF NOT EXISTS oktmo VARCHAR(11);
ALTER TABLE stores ADD COLUMN IF NOT EXISTS has_restriction BOOLEAN DEFAULT FALSE;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS mun_area VARCHAR(100);
ALTER TABLE stores ADD COLUMN IF NOT EXISTS mun_district VARCHAR(100);
ALTER TABLE stores ADD COLUMN IF NOT EXISTS be VARCHAR(200);
ALTER TABLE stores ADD COLUMN IF NOT EXISTS close_date DATE;

-- Update existing stores with mock data
UPDATE stores SET 
    mvz = '13CT0979',
    cfo = 'E1028750',
    oktmo = '45339000',
    has_restriction = FALSE,
    mun_area = 'Москва',
    mun_district = 'Москва',
    be = 'ООО «Агроторг»',
    close_date = NULL
WHERE id = 1;

UPDATE stores SET 
    mvz = '13CTY216',
    cfo = 'E1028750',
    oktmo = '45339000',
    has_restriction = TRUE,
    mun_area = 'Москва',
    mun_district = 'Москва',
    be = 'ООО «Агроторг»',
    close_date = NULL
WHERE id = 2;

UPDATE stores SET 
    mvz = '13CTX378',
    cfo = 'E1028750',
    oktmo = '45339000',
    has_restriction = FALSE,
    mun_area = 'Москва',
    mun_district = 'Москва',
    be = 'ООО «Агроторг»',
    close_date = NULL
WHERE id = 3;

UPDATE stores SET 
    mvz = '13CST179',
    cfo = 'E1028750',
    oktmo = '45339000',
    has_restriction = FALSE,
    mun_area = 'Санкт-Петербург',
    mun_district = 'Центральный',
    be = 'ООО «Перекресток»',
    close_date = NULL
WHERE id = 4;

UPDATE stores SET 
    mvz = '13CTY234',
    cfo = 'E1028750',
    oktmo = '45780000',
    has_restriction = TRUE,
    mun_area = 'Санкт-Петербург',
    mun_district = 'Невский',
    be = 'ООО «Перекресток»',
    close_date = '2025-02-01'
WHERE id = 5;

UPDATE stores SET 
    mvz = '13CT339V',
    cfo = 'E1028750',
    oktmo = '45339000',
    has_restriction = FALSE,
    mun_area = 'Москва',
    mun_district = 'Москва',
    be = 'ООО «Агроторг»',
    close_date = NULL
WHERE id = 6;

UPDATE stores SET 
    mvz = '13CTJ464',
    cfo = 'E1028750',
    oktmo = '45339000',
    has_restriction = FALSE,
    mun_area = 'Москва',
    mun_district = 'Москва',
    be = 'ООО «Агроторг»',
    close_date = NULL
WHERE id = 7;

UPDATE stores SET 
    mvz = '13CT30GR',
    cfo = 'E1028750',
    oktmo = '45339000',
    has_restriction = FALSE,
    mun_area = 'Москва',
    mun_district = 'Москва',
    be = 'ООО «Агроторг»',
    close_date = NULL
WHERE id = 8;

UPDATE stores SET 
    mvz = '13CT3A91',
    cfo = 'E1028750',
    oktmo = '45339000',
    has_restriction = FALSE,
    mun_area = 'Москва',
    mun_district = 'Москва',
    be = 'ООО «Агроторг»',
    close_date = NULL
WHERE id = 9;

UPDATE stores SET 
    mvz = '13CT0286',
    cfo = 'E1028750',
    oktmo = '45339000',
    has_restriction = FALSE,
    mun_area = 'Москва',
    mun_district = 'Москва',
    be = 'ООО «Агроторг»',
    close_date = NULL
WHERE id = 10;
