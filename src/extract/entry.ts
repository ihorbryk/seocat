import { run } from './run';

declare global {
  /** Реєструє `extract.js` в ізольованому світі розширення; викликає `browserPort` (ADR 0001). */
  var __seocatMeasure: (() => ReturnType<typeof run>) | undefined;
}

// IIFE-вхід для `scripting.executeScript({ files: ['extract.js'] })`.
// Safari відкидає Promise як результат `files` («непідтримуваний тип»), але чекає на Promise з `func`.
// Тому скрипт синхронно реєструє функцію вимірювання і повертає `true`, а другий виклик
// `executeScript({ func })` запускає її. Vite-плагін (vite.config.ts) лишає `(function(){ ...; return true })();`.
globalThis.__seocatMeasure = () => run(document);

export default true;
