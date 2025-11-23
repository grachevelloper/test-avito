

![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)
![MobX](https://img.shields.io/badge/MobX-State%20Management-FF9955?logo=mobx)
![Chakra UI](https://img.shields.io/badge/Chakra%20UI-Component%20Library-319795?logo=chakraui)
![Docker](https://img.shields.io/badge/Docker-Containers-2496ED?logo=docker)

# Система модерации объявлений

Современное веб-приложение для управления и модерации объявлений с интуитивным интерфейсом

</div>

##  Быстрый запуск


1. **Настройте окружение для разработки**
- Перейдите в папку `fe` и создайте файл `.env`:
```bash
cd fe
echo "VITE_API_URL=http://localhost:3001/api/v1" > .env
```

- Для запуска через dev-режим измените в `fe/vite.config.js` строку:
```javascript
target: 'http://server:3001'  // замените на 'http://localhost:3001' для локального запуска
```

2. **Запустите приложение**
```bash
docker-compose up --build
```

Приложение будет доступно по адресу: [http://localhost:5173](http://localhost:5173)

## Технологии

- **Фронтенд:** React 19, TypeScript 5.x
- **UI-библиотека:** Chakra UI v3
- **Управление состоянием:** MobX 6
- **Маршрутизация:** React Router DOM
- **HTTP-клиент:** Axios
- **Сборка:** Vite 7
- **Тестирование:** Jest, Testing Library
- **Контейнеризация:** Docker, Docker Compose

## Структура проекта

```
test-avito/
├── fe/                 # Frontend приложение
│   ├── src/
│   │   ├── components/ # React компоненты
│   │   ├── store/      # MobX stores
│   │   ├── shared/     # Утилиты и API
│   │   └── __tests__/  # Тесты
│   ├── vite.config.js  # Конфигурация Vite
│   └── package.json
├── be/                 # Backend API
└── docker-compose.yml  # Docker конфигурация
```



