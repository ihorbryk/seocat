# 0001. Знімок Page через `scripting.executeScript` з файлом, без content script

Статус: прийнято (2026-11-03), змінено того ж дня: два кроки `executeScript`

## Контекст

seocat показує Metrics про Page у попапі тулбара. Дані потрібні лише в момент відкриття попапа, живе відстеження DOM не входить у v1. Safari Web Extension дає два шляхи: content script плюс обмін повідомленнями або `scripting.executeScript` з попапа. У `executeScript` можна передати `func` або `files`.

## Рішення

- MV3, дозволи лише `activeTab` і `scripting`, без host permissions. Відкриття попапа надає `activeTab` без запиту (перевірено на Safari 27.2).
- Попап викликає `browser.scripting.executeScript({ target: { tabId }, files: ['extract.js'] })` і читає повернене значення (Safari 17+).
- `extract.js` збирається Vite як IIFE, яка синхронно реєструє `globalThis.__seocatMeasure` в ізольованому світі розширення і останнім виразом повертає `true`.
- Другий виклик `executeScript({ func: () => globalThis.__seocatMeasure?.() })` запускає вимірювання і повертає Promise JSON-серіалізованого конверта зі знімком. Екстракція асинхронна (Images читає HTTP-кеш, ADR 0005), а Safari відкидає Promise як результат `files` («результат непідтримуваного типу»), хоча на Promise з `func` чекає (перевірено на Safari 27.2).
- `func` як єдиний крок відхилено: Safari серіалізує функцію через `toString()`, тому вона не може нічого імпортувати, і логіку екстракції не можна було б ділити з тестами. `func` лише викликає вже зареєстровану функцію, тому її ім'я в `browser-port.ts` записано літералом.
- Content script відхилено: він потребує попереднього доступу до сайту і додає messaging, який виправдала б лише жива синхронізація.

## Наслідки

- `permissions.contains` не показує грант `activeTab`, тож його не можна використовувати, щоб передбачити доступ.
- Живе відстеження DOM у майбутньому потребуватиме нового рішення (content script).
