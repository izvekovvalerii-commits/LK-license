UPDATE regions
SET
    counterparty_code = floor(100000 + random() * 900000)::text,
    counterparty_inn = floor(1000000000 + random() * 9000000000)::text,
    kpp = floor(100000000 + random() * 900000000)::text,
    settlement_bik = '04' || floor(1000000 + random() * 9000000)::text
WHERE counterparty_code IS NULL OR counterparty_code = '';
