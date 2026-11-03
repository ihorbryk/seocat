import { run } from './run';

// IIFE-вхід для `scripting.executeScript({ files: ['extract.js'] })`.
// Vite-плагін (vite.config.ts) лишає `(function(){ ...; return envelope })();`,
// тому останній вираз скрипта обчислюється в конверт.
export default run(document);
