# Инструкция по дальнейшей разработке

## 📍 Текущее состояние

Вы находитесь в директории проекта:
```
/Users/valeriy.izvekov/Documents/Чижик_Портал ИК/portal-razvitie
```

**Dev-сервер запущен**: http://localhost:4200/

## 🚀 Быстрый старт

### Просмотр приложения
1. Откройте браузер
2. Перейдите по адресу: **http://localhost:4200/**
3. Вы увидите:
   - Шапку с навигацией
   - Желтый баннер с заголовком
   - Иллюстрацию с анимированными птичками
   - Подвал с копирайтом

### Остановка dev-сервера
```bash
# Нажмите Ctrl+C в терминале где запущен npm start
```

### Перезапуск dev-сервера
```bash
npm start
```

## 📝 Следующие шаги разработки

### 1. Создание страницы "Проекты"

```bash
# Создать компонент страницы
npx @angular/cli generate component pages/projects --skip-tests

# Создать компонент списка проектов
npx @angular/cli generate component components/project-list --skip-tests

# Создать компонент карточки проекта
npx @angular/cli generate component components/project-card --skip-tests
```

**Добавить роут в `app.routes.ts`:**
```typescript
import { Routes } from '@angular/router';
import { ProjectsComponent } from './pages/projects/projects';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'projects', component: ProjectsComponent },
];
```

### 2. Создание API сервиса

```bash
# Создать сервис для работы с API
npx @angular/cli generate service services/api --skip-tests
```

**Пример сервиса (`api.service.ts`):**
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/projects`);
  }

  getProject(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/projects/${id}`);
  }
}
```

**Добавить HttpClient в `app.config.ts`:**
```typescript
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient()
  ]
};
```

### 3. Добавление функциональности кнопкам

**В `header.ts`:**
```typescript
export class HeaderComponent {
  menuItems = [
    { label: 'Магазины', link: '/stores' },
    { label: 'Проекты', link: '/projects' },
    { label: 'Задачи', link: '/tasks' },
    { label: 'Заявки', link: '/requests' },
    { label: 'Согласования', link: '/approvals' },
    { label: 'Отчеты', link: '/reports' }
  ];

  onHelpClick() {
    // Открыть модальное окно помощи
  }

  onMailClick() {
    // Открыть почту
  }

  onNotificationsClick() {
    // Открыть панель уведомлений
  }

  onSettingsClick() {
    // Открыть настройки
  }

  onProfileClick() {
    // Открыть профиль пользователя
  }
}
```

**В `hero.ts`:**
```typescript
import { Router } from '@angular/router';

export class HeroComponent {
  constructor(private router: Router) {}

  onStartClick() {
    this.router.navigate(['/projects']);
  }
}
```

### 4. Создание модальных окон

```bash
# Создать компонент модального окна
npx @angular/cli generate component components/modal --skip-tests
```

### 5. Добавление state management (NgRx Signals)

```bash
# Установить NgRx Signals
npm install @ngrx/signals

# Создать store для проектов
npx @angular/cli generate service store/projects-store --skip-tests
```

**Пример store:**
```typescript
import { signalStore, withState, withMethods } from '@ngrx/signals';
import { inject } from '@angular/core';
import { ApiService } from '../services/api.service';

interface ProjectsState {
  projects: any[];
  loading: boolean;
  error: string | null;
}

export const ProjectsStore = signalStore(
  { providedIn: 'root' },
  withState<ProjectsState>({
    projects: [],
    loading: false,
    error: null
  }),
  withMethods((store, apiService = inject(ApiService)) => ({
    async loadProjects() {
      // Логика загрузки проектов
    }
  }))
);
```

## 🎨 Стилизация новых компонентов

Используйте существующие CSS переменные и классы:

```css
/* Цвета */
--primary-yellow: #FFD700;
--primary-black: #000000;
--text-primary: #333333;
--text-secondary: #666666;
--border-color: #e0e0e0;

/* Отступы */
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;

/* Шрифты */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

## 📦 Полезные команды

```bash
# Генерация компонента
npx @angular/cli generate component components/название

# Генерация сервиса
npx @angular/cli generate service services/название

# Генерация guard
npx @angular/cli generate guard guards/название

# Сборка production
npm run build

# Проверка типов
npx tsc --noEmit

# Форматирование кода
npx prettier --write "src/**/*.{ts,html,css}"
```

## 🔧 Настройка VS Code

Установите расширения:
- Angular Language Service
- Auto Rename Tag
- Prettier
- ESLint

## 📚 Полезные ссылки

- [Angular Documentation](https://angular.dev/)
- [Angular Router](https://angular.dev/guide/routing)
- [Angular HttpClient](https://angular.dev/guide/http)
- [NgRx Signals](https://ngrx.io/guide/signals)
- [Angular Material](https://material.angular.io/) (если понадобится UI библиотека)

## 🎯 Рекомендуемый порядок разработки

1. ✅ **Базовый UI** (выполнено)
2. **Роутинг и навигация**
   - Создать все страницы
   - Настроить роуты
   - Добавить навигацию в header
3. **API интеграция**
   - Создать сервисы
   - Настроить HTTP запросы
   - Обработка ошибок
4. **Формы и валидация**
   - Reactive Forms
   - Кастомные валидаторы
   - Error handling
5. **Аутентификация**
   - Login/Logout
   - JWT токены
   - Route guards
6. **State management**
   - NgRx Signals или другое решение
   - Централизованное управление состоянием
7. **Тестирование**
   - Unit тесты
   - E2E тесты
8. **Оптимизация**
   - Lazy loading
   - Performance optimization
   - Bundle size optimization

---

**Примечание**: Текущая версия - это MVP с реализованным UI. Все кнопки и ссылки пока не функциональны, но готовы к добавлению логики.
