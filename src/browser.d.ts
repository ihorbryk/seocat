// Safari дає нативний promise-API у глобальному `browser`; типи беремо з
// @types/webextension-polyfill (devDependency), самого поліфілу в рантаймі немає.
declare const browser: import('webextension-polyfill').Browser;
