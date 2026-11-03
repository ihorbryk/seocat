# Як влаштовано код seocat

Терміни (Page, Metric, Group, Image, Missing, Empty, Duplicate, Not loaded, Size unknown, Length rating) визначено в `GLOSSARY.md`, правила вимірювання — в ADR 0003 (виняток для Images — ADR 0005), поділ Group на дві половини — в ADR 0004.

## Шари

Дані проходять шлях `extract → envelope → measure → assess → View`:

- `src/groups/<group>/extract/`: чисте читання DOM на Page, повертає JSON-серіалізовний знімок Group (`ContentSnapshot`, `IndexingSnapshot`, `ImagesSnapshot`). Лише Images читає стан завантаження (`naturalWidth`, `currentSrc`, Resource Timing, HTTP-кеш через `fetch`) і тому асинхронна; її тести підставляють ці значення на jsdom. Імпорти дозволені, бо все збирається в один `extract.js`.
- `src/extract/run.ts`: вхід `extract.js`. Перевіряє `contentType` і загортає половини Page з `src/groups/page-registry.ts` у `try/catch`, повертаючи конверт (`src/extract/envelope.ts`).
- `src/popup/measure.ts`: `measure(port)` бере активну вкладку і результат `executeScript` через `TabPort` і повертає URL та `Outcome`; Unreadable визначає лише він (ADR 0002). Адаптер над `browser.*` — `src/popup/browser-port.ts`, у тестах — фейк.
- `src/groups/<group>/assess/`: чиста функція «знімок → view Group» (`ContentView`, `IndexingView`) без DOM. Тут народжуються Missing / Empty / Duplicate і Length rating.
- `src/popup/Popup.tsx`: каркас попапа. Першим рядком назва і версія з `public/manifest.json` (імпорт під час збірки), під ним смуга URL з `tab.url`, далі для `ok` вкладки Groups (`src/ui/Tabs.tsx`, порядок за `src/groups/popup-registry.tsx`, панель — `GroupPanel`), інакше `StateScreen`. Початкову вкладку отримує пропсом `initialTab`, про перемикання повідомляє `onTabChange`. Його рендерять шел `App` (`measure(browserPort)`, остання вкладка в `localStorage` через `src/popup/last-tab.ts`) і showcase.
- `src/ui/`: Group-незалежні компоненти (`Row`, `Table`, `Badge`, `Tile`, `UrlBlock`, `Tabs`), які малюють `RowView` / `SectionView` з `src/ui/types.ts`. Новий рядок таблиці не потребує нового компонента. Images малює не таблицю, а власний список (`src/groups/images/ImageRow.tsx`) з прев'ю, яке попап завантажує сам.

## Додати Metric

1. Поле в знімку Group (`src/groups/<group>/types.ts`).
2. `extract/<metric>.ts` і один рядок у `extract/index.ts`.
3. `assess/<metric>.ts`, що повертає `RowView`, і один рядок у потрібній секції `assess/index.ts`. Хедерні числа Content йдуть через `content/assess/header.ts`. Розділювач секції `Table` малює лише тоді, коли секцій у Group більше однієї.
4. Значення за замовчуванням у `contentSnapshot()` / `indexingSnapshot()` з `tests/snapshot.ts` і очікуваний знімок у `tests/extract/build.test.ts`.
5. Тести: `extract` на HTML-фікстурах у `tests/fixtures/<metric>-<case>.html` (через `loadFixture`), `assess` на `snapshot({ ...override })`.

Тести будують знімки лише через `contentSnapshot()` / `indexingSnapshot()` (і `okOutcome()` для `Outcome`) з `tests/snapshot.ts`. Тоді нове поле — це одна правка, а паралельні гілки не конфліктують у кожному тестовому файлі.

## Додати Group

Тека `src/groups/<id>/` з тими самими шарами і двома входами (ADR 0004):

- `page.ts` → `{ id, extract }`, рядок у `src/groups/page-registry.ts`. Звідси виводяться `GroupId` і `GroupSnapshots`.
- `popup.tsx` → `{ id, label, Panel }`, де `Panel({ snapshot })` викликає `assess` і малює `View`; рядок у `src/groups/popup-registry.tsx` (порядок = порядок вкладок, перша — вкладка за замовчуванням).
- Фабрика знімка в `tests/snapshot.ts` і запис у `factories`.

Пропущена половина попапа або фабрика ламає `tsc`. Нова Group автоматично стає вкладкою; її `label` — назва вкладки в UI. Перейменування id скидає збережену вкладку на першу.

## Showcase

`mise run showcase` піднімає dev-сервер Vite на `http://localhost:5180`. `/?scenario=<id>[&tab=<group id>]` малює один попап через `Popup` без `browser.*` (вкладка лише з `tab`, `localStorage` showcase не чіпає), а `/` показує список сценаріїв. Сценарії лежать у `dev/showcase/scenarios.ts`: знімки через `okOutcome()` проходять справжній `assess`, і кожен не-ok `Outcome` має свій сценарій. Новий стан, який варто бачити, додається одним записом; `tests/showcase/scenarios.test.tsx` рендерить кожен, `ok` — на кожній вкладці. У `dist/` showcase не потрапляє, бо входи `vite build` фіксовані.

Після зміни в `src/ui/`, `src/popup/` або `View`/`Header` якоїсь Group агент запускає showcase, відкриває зачеплені сценарії через chrome-devtools MCP і знімає їх у світлій і темній темі (`emulate` з `colorScheme`; `popup.css` перемикається лише через `prefers-color-scheme`).

- **Перевіряється в Chrome:** структура і порядок елементів, вкладки і їх липкість при прокрутці, набір і кольори бейджів, токени в обох темах, ширина 460px, перенесення довгих значень, екрани станів.
- **Лишається для Safari (у звіт):** шрифт SF і метрики тексту, піксельні відступи, рамка і висота справжнього попапа (обмеження 600px у WebKit), поведінка на реальних сторінках.

## Конвенції

- **Empty-sentinel.** Записи списків (canonical, robots, hreflang) зберігають Empty як `''`; `TextTag.value` — `null` для Missing і `''` для Empty.
- **Текст і довжина.** `Intl.Segmenter` лише через `src/shared/` (`graphemes.ts`, `words.ts`); межі Length rating — константи поруч з `assess/<metric>.ts`.
- **Кольори.** Лише семантичні токени з `@theme` у `src/popup/popup.css` (`text-good`, `bg-warn-bg`, `text-bad`, …); `check:rules` відхиляє класи палітри. Тони: `good`, `warn` (попередження), `bad` (червоний, лише важкий файл Image), `neutral` (стан без попередження: Empty alt, Not loaded, Size unknown).
- **Мова.** UI англійською, коментарі, назви тестів, коміти і документація українською.

## Пастки

- **Імпорт у `page.ts`.** Усе, що імпортує `page.ts` Group, інжектується в кожну Page. `assess`, `View`, `src/ui/` і preact туди не потрапляють; `tests/extract/build.test.ts` перевіряє склад бандла.
- **Останній вираз `extract.js`.** `executeScript({ files })` повертає значення останнього виразу скрипта, але Safari не приймає там Promise. Тому `extract.js` реєструє `__seocatMeasure` і повертає `true`, а `browserPort` другим викликом `executeScript({ func })` чекає на Promise конверта (ADR 0001). Rollup загортає IIFE у `var … =`, і плагін у `vite.config.ts` це присвоєння прибирає. `tests/extract/build.test.ts` збирає справжній бандл і охороняє контракт.
- **Два проходи збірки.** `vite build` (попап) і `vite build --mode extract` пишуть в один `dist/` і не очищають його; очищає задача mise. Запуск `vite build` напряму залишить застарілі файли.
- **`mise run xcode:init` перезаписує закомічений Xcode-проєкт.** Packager генерує нові id і власні імена іконок (`mac-icon-*.png`), які розходяться з `mise run icons`. Потрібен лише при зміні структури `dist/`; новий файл у `dist/` додається рядком у ресурси `xcode/seocat/seocat.xcodeproj/project.xcproj`, а `tests/xcode/resources.test.ts` перевіряє, що нічого не пропущено.
- **Версія в трьох місцях.** Джерело правди — `version` у `public/manifest.json` (її показує попап), але бандли застосунку і розширення отримують версію з `MARKETING_VERSION` обох таргетів у `project.xcproj`. Піднімай усі три разом; `tests/xcode/version.test.ts` ловить розбіжність, зокрема відкат до `1.0` після `mise run xcode:init`.
- **Safari недоступний агентам.** Вигляд дивись у showcase (розділ вище); людині лишаються лише критерії з «Лишається для Safari», перелічуй їх у звіті.
