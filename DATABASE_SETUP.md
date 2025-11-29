# Инструкция по настройке базы данных PostgreSQL

## Проблема
Backend не может запуститься, так как PostgreSQL база данных не настроена.

## Решение

### Вариант 1: Использовать H2 in-memory базу (для быстрого демо)

Изменить конфигурацию в `backend/pom.xml` и `application.yml` для использования H2 вместо PostgreSQL.

### Вариант 2: Настроить PostgreSQL

1. **Установить PostgreSQL** (если не установлен):
   - macOS: `brew install postgresql@15`
   - Запустить: `brew services start postgresql@15`

2. **Создать базу данных:**
```bash
psql postgres
CREATE DATABASE licensing_portal;
\q
```

3. **Обновить настройки в `backend/src/main/resources/application.yml`:**
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/licensing_portal  # измените порт на 5432
    username: ВАШ_USERNAME                                   # обычно ваше имя пользователя
    password: ВАШ_ПАРОЛЬ                                     # или пустая строка
``` 

4. **Перезапустить backend:**
```bash
cd backend
./mvnw spring-boot:run
```

## Текущий статус
- ✅ Frontend: http://localhost:5175
- ❌ Backend: ожидает подключения к PostgreSQL
