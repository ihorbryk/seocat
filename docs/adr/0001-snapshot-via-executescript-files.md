# 0001. Знімок Page через `scripting.executeScript` з файлом, без content script

Статус: прийнято (2026-11-03)

## Контекст

seocat показує Metrics про Page у попапі тулбара. Дані потрібні лише в момент відкриття попапа, живе відстеження DOM не входить у v1. Safari Web Extension дає два шляхи: content script плюс обмін повідомленнями або `scripting.executeScript` з попапа. У `executeScript` можна передати `func` або `files`.

## Рішення

- MV3, дозволи лише `activeTab` і `scripting`, без host permissions. Відкриття попапа надає `activeTab` без запиту (перевірено на Safari 27.2).
- Попап викликає `browser.scripting.executeScript({ target: { tabId }, files: ['extract.js'] })` і читає повернене значення (Safari 17+).
- `extract.js` збирається Vite як IIFE, останній вираз якого обчислюється в JSON-серіалізований конверт зі знімком.
- `func` відхилено: Safari серіалізує функцію через `toString()`, тому вона не може нічого імпортувати, і логіку екстракції не можна було б ділити з тестами.
- Content script відхилено: він потребує попереднього доступу до сайту і додає messaging, який виправдала б лише жива синхронізація.

## Наслідки

- `permissions.contains` не показує грант `activeTab`, тож його не можна використовувати, щоб передбачити доступ.
- Живе відстеження DOM у майбутньому потребуватиме нового рішення (content script).
