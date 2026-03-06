# Иконки PWA для «МГИМО ENGLISH»

Для корректного отображения приложения при «Добавить на экран» и в каталогах нужны PNG-иконки в каталоге `public/`.

## Требуемые файлы

| Файл         | Размер   | Назначение                    |
|-------------|----------|-------------------------------|
| `icon-192.png` | 192×192 px | Иконка на главном экране (Android) |
| `icon-512.png` | 512×512 px | Splash / высокое разрешение       |

Манифест уже настроен в `vite.config.ts`: плагин PWA ожидает эти файлы в `public/`.

## Как получить иконки

### Вариант 1: PWA Asset Generator (рекомендуется)

Исходник — `public/favicon.svg`. В корне проекта:

```bash
npx pwa-asset-generator public/favicon.svg public --icon-only
```

Скрипт создаст `icon-192.png` и `icon-512.png` (и при необходимости другие размеры). При первом запуске будет установлен пакет.

### Вариант 2: PWA Builder Image Generator

1. Откройте [PWA Builder Image Generator](https://www.pwabuilder.com/imageGenerator).
2. Загрузите `public/favicon.svg` или изображение 512×512.
3. Скачайте пакет иконок и поместите `icon-192.png` и `icon-512.png` в `public/`.

### Вариант 3: Ручной экспорт (Figma / Inkscape)

1. Откройте `public/favicon.svg` в редакторе.
2. Экспортируйте в PNG 192×192 и 512×512.
3. Сохраните как `public/icon-192.png` и `public/icon-512.png`.

### Вариант 4: ImageMagick (если установлен)

```bash
convert -background none -resize 192x192 public/favicon.svg public/icon-192.png
convert -background none -resize 512x512 public/favicon.svg public/icon-512.png
```

## Проверка

После добавления файлов:

1. Выполните `npm run build`.
2. В папке `dist/` должны появиться `icon-192.png` и `icon-512.png`.
3. Откройте приложение в браузере и проверьте «Добавить на экран» — иконка должна отображаться корректно.

## Если иконок нет

Без PNG в `public/` манифест всё равно содержит ссылки на `icon-192.png` и `icon-512.png`. На устройствах может использоваться стандартная иконка или favicon. Для публикации в каталогах и лучшего UX рекомендуется добавить PNG по инструкции выше.
