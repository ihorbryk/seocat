# Як влаштовано код seocat

Терміни (Page, Metric, Group, Missing, Empty, Duplicate, Length rating) визначено в `GLOSSARY.md`, правила вимірювання — в ADR 0003.

## Шари

Дані проходять шлях `extract → envelope → classify → assess → View`:

- `src/groups/<group>/extract/`: чисте читання DOM на Page, повертає JSON-серіалізовний `PageSnapshot`. Імпорти дозволені, бо все збирається в один `extract.js`.
- `src/extract/run.ts`: вхід `extract.js`. Перевіряє `contentType` і загортає Groups у `try/catch`, повертаючи конверт (`src/shared/envelope.ts`).
- `src/popup/classify.ts`: результат `executeScript` або виняток перетворює на `Outcome`; Unreadable визначає лише попап (ADR 0002).
- `src/groups/<group>/assess/`: чиста функція `PageSnapshot → GroupView` без DOM. Тут народжуються Missing / Empty / Duplicate і Length rating.
- `src/popup/Popup.tsx`: першим рядком назва і версія з `public/manifest.json` (імпорт під час збірки), далі чистий вибір екрана за `Outcome` (таблиця Group або `StateScreen`). Його рендерять шел `App` і showcase.
- `src/ui/`: Group-незалежні компоненти (`Row`, `Table`, `Badge`, `UrlBlock`), які малюють `RowView` / `SectionView` з `src/ui/types.ts`. Новий рядок таблиці не потребує нового компонента.

## Додати Metric

1. Поле в `PageSnapshot` (`src/groups/seo-basics/types.ts`).
2. `extract/<metric>.ts` і один рядок у `extract/index.ts`.
3. `assess/<metric>.ts`, що повертає `RowView`, і один рядок у потрібній секції `assess/index.ts`. Хедерні числа йдуть через `assess/header.ts`.
4. Значення за замовчуванням у `tests/snapshot.ts` і очікуваний знімок у `tests/extract/build.test.ts`.
5. Тести: `extract` на HTML-фікстурах у `tests/fixtures/<metric>-<case>.html` (через `loadFixture`), `assess` на `snapshot({ ...override })`.

Тести будують `PageSnapshot` лише через `snapshot()` з `tests/snapshot.ts`. Тоді нове поле — це одна правка, а паралельні гілки не конфліктують у кожному тестовому файлі.

## Додати Group

Тека `src/groups/<id>/` з тими самими шарами, запис у `src/groups/registry.ts` і ключ у `GroupSnapshots` (`src/shared/envelope.ts`). `src/popup/App.tsx` у v1 малює `groups[0]` без перемикача; друга Group потребує рішення про перемикач.

## Showcase

`mise run showcase` піднімає dev-сервер Vite на `http://localhost:5180`. `/?scenario=<id>` малює один попап через `Popup` без `browser.*`, а `/` показує список сценаріїв. Сценарії лежать у `dev/showcase/scenarios.ts`: `PageSnapshot` через `snapshot()` проходить справжній `assess`, і кожен не-ok `Outcome` має свій сценарій. Новий стан, який варто бачити, додається одним записом; `tests/showcase/scenarios.test.tsx` рендерить кожен. У `dist/` showcase не потрапляє, бо входи `vite build` фіксовані.

Після зміни в `src/ui/`, `src/popup/` або `View`/`Header` якоїсь Group агент запускає showcase, відкриває зачеплені сценарії через chrome-devtools MCP і знімає їх у світлій і темній темі (`emulate` з `colorScheme`; `popup.css` перемикається лише через `prefers-color-scheme`).

- **Перевіряється в Chrome:** структура і порядок елементів, набір і кольори бейджів, токени в обох темах, ширина 460px, перенесення довгих значень, екрани станів.
- **Лишається для Safari (у звіт):** шрифт SF і метрики тексту, піксельні відступи, рамка і висота справжнього попапа (обмеження 600px у WebKit), поведінка на реальних сторінках.

## Конвенції

- **Empty-sentinel.** Записи списків (canonical, robots, hreflang) зберігають Empty як `''`; `TextTag.value` — `null` для Missing і `''` для Empty.
- **Текст і довжина.** `Intl.Segmenter` лише через `src/shared/` (`graphemes.ts`, `words.ts`); межі Length rating — константи поруч з `assess/<metric>.ts`.
- **Кольори.** Лише семантичні токени з `@theme` у `src/popup/popup.css` (`text-good`, `bg-warn-bg`, …); `check:rules` відхиляє класи палітри.
- **Мова.** UI англійською, коментарі, назви тестів, коміти і документація українською.

## Пастки

- **Останній вираз `extract.js`.** `executeScript({ files })` повертає значення останнього виразу скрипта. Rollup загортає IIFE у `var … =`, і плагін у `vite.config.ts` це присвоєння прибирає. `tests/extract/build.test.ts` збирає справжній бандл і охороняє контракт.
- **Два проходи збірки.** `vite build` (попап) і `vite build --mode extract` пишуть в один `dist/` і не очищають його; очищає задача mise. Запуск `vite build` напряму залишить застарілі файли.
- **`mise run xcode:init` перезаписує закомічений Xcode-проєкт.** Packager генерує нові id і власні імена іконок (`mac-icon-*.png`), які розходяться з `mise run icons`. Потрібен лише при зміні структури `dist/`; новий файл у `dist/` додається рядком у ресурси `xcode/seocat/seocat.xcodeproj/project.xcproj`, а `tests/xcode/resources.test.ts` перевіряє, що нічого не пропущено.
- **Версія в трьох місцях.** Джерело правди — `version` у `public/manifest.json` (її показує попап), але бандли застосунку і розширення отримують версію з `MARKETING_VERSION` обох таргетів у `project.xcproj`. Піднімай усі три разом; `tests/xcode/version.test.ts` ловить розбіжність, зокрема відкат до `1.0` після `mise run xcode:init`.
- **Safari недоступний агентам.** Вигляд дивись у showcase (розділ вище); людині лишаються лише критерії з «Лишається для Safari», перелічуй їх у звіті.
