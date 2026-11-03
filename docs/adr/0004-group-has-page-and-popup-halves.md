# 0004. Group має дві половини: Page і попап

Статус: прийнято (2026-11-03)

## Контекст

`extract.js` інжектується в кожну Page (ADR 0001). Group була одним об'єктом `{ id, label, extract, assess, View }`, і реєстр, який імпортує `run`, тягнув у бандл усе: `assess`, `View`, `src/ui/` і preact. Із 31 КБ `extract.js` лише близько чверті було кодом, що читає DOM. До того ж зв'язок «id → тип знімка → `assess` → `View`» тримався на кастах у `run` і `Popup`, а `GroupSnapshots` перелічував Groups удруге, вручну.

## Рішення

- Кожна Group має рівно два входи: `page.ts` (`{ id, extract }`) і `popup.tsx` (`{ id, label, Panel }`). Спільного `index.ts` немає.
- `src/groups/page-registry.ts` імпортує лише `page.ts`; з нього виводяться `GroupId` і `GroupSnapshots` (`ReturnType` кожного `extract`). Його використовує `run`.
- `src/groups/popup-registry.tsx` імпортує лише `popup.tsx`, задає порядок вкладок і типами вимагає половину попапа для кожної Group з `page-registry`.
- `Panel({ snapshot })` ховає `assess` і `View`: попап не знає, як Group будує view.
- Конверт (`src/extract/envelope.ts`) живе поруч із `run`, що його створює; `src/shared/` не залежить від `src/groups/`.
- `tests/extract/build.test.ts` перевіряє, що в зібраному `extract.js` немає preact, `src/ui/` і модулів `assess`/`View`/`popup`.

## Відхилені варіанти

- **Metric як один модуль** (`extract` і `assess` одного Metric в одному файлі): зменшив би кількість файлів на Metric, але знову зшив би код Page і попапа, тепер на рівні Metric.
- **Динамічний `import()` у реєстрі**: IIFE-бандл не ділиться на чанки, а розрізання файлів дає той самий результат простіше.

## Наслідки

- Нова Group — два входи і по рядку в кожному реєстрі; забута половина попапа або тестова фабрика в `tests/snapshot.ts` не збираються.
- `extract.js` зменшився з 31 КБ до 7 КБ.
