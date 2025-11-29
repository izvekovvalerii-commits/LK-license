-- Переименование всех магазинов в формат ТС5_NNNN
UPDATE stores 
SET name = 'ТС5_' || LPAD(id::text, 4, '0');
