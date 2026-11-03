
## Розробка

Передумови: [mise](https://mise.jdx.dev) (ставить Node 26) і Xcode (ручна передумова для обгортки Safari).

```
mise run setup   # npm ci
mise run build   # dist/: попап + extract.js
mise run dev     # перезбирає dist/ при змінах
mise run test    # Vitest + jsdom
mise run check   # tsc --noEmit + Prettier --check
mise run fmt     # Prettier --write
```

Завантаження в Safari для розробки: Develop › Add Temporary Extension… і тека `dist/`.
