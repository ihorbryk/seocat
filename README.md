
## Розробка

Передумови: [mise](https://mise.jdx.dev) (ставить Node 26) і Xcode (ручна передумова для обгортки Safari).

```
mise run setup   # npm ci + git-хук pre-commit (check і test перед кожним комітом)
mise run build   # dist/: попап + extract.js
mise run dev     # перезбирає dist/ при змінах
mise run test    # Vitest + jsdom
mise run check   # tsc --noEmit + Prettier --check + механічні правила (check:rules)
mise run fmt     # Prettier --write
mise run icons   # PNG-іконки з assets/icons/*.svg (вручну при зміні SVG; результат комітиться)
```

Завантаження в Safari для розробки: Develop › Add Temporary Extension… і тека `dist/`.

## Повна збірка через Xcode

Передумова: встановлений Xcode (ставиться вручну, mise його не ставить).

```
mise run xcode:init   # один раз: генерує xcode/ через safari-web-extension-packager
mise run xcode        # build + xcodebuild (Sign to Run Locally) → xcode/build/Build/Products/Debug/seocat.app
```

`xcode:init` не копіює ресурси: проєкт посилається на `dist/` відносними шляхами, тож `mise run build` достатньо, щоб Xcode побачив свіжу збірку. Згенерований проєкт закомічено; повторювати `xcode:init` не треба (він перезапише `xcode/`).

Кроки ввімкнення:

1. `mise run xcode`, потім відкрийте `xcode/build/Build/Products/Debug/seocat.app` (достатньо один раз запустити).
2. Safari › Develop › Allow Unsigned Extensions (потрібен пароль).
3. Safari › Settings › Extensions: увімкніть seocat і дозвольте доступ.

Увага: «Allow Unsigned Extensions» скидається після виходу з Safari, тож крок 2 треба повторювати щоразу.

## Цикл розробки

- Швидко: `mise run dev` + Develop › Add Temporary Extension… (тека `dist/`).
- Повна збірка: `mise run xcode`, як описано вище.
