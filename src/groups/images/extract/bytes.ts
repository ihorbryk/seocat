/** Скільки чекати на файл з кешу, щоб попап не завис на повільній мережі. */
const FETCH_TIMEOUT_MS = 3000;

/**
 * Вага завантаженого файлу (ADR 0005): для `data:` з самого URI, інакше `encodedBodySize`
 * з Resource Timing, а коли там 0 або запису немає, то розмір файлу з HTTP-кешу через `fetch`.
 * Resource Timing дає 0 для cross-origin без `Timing-Allow-Origin`, а Safari ще й для кожної
 * картинки з кешу. Запису може не бути (кеш у пам'яті, переповнений буфер).
 * null, коли браузер не віддає вагу жодним способом (cross-origin без CORS, файлу немає).
 */
export async function fileBytes(src: string): Promise<number | null> {
  if (src.startsWith('data:')) return dataUriBytes(src);
  const entry = globalThis.performance?.getEntriesByName(src, 'resource')[0] as
    PerformanceResourceTiming | undefined;
  return entry?.encodedBodySize || cachedBytes(src);
}

async function cachedBytes(src: string): Promise<number | null> {
  try {
    const response = await fetch(src, {
      cache: 'force-cache',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!response.ok) return null;
    return (await response.blob()).size;
  } catch {
    return null;
  }
}

function dataUriBytes(uri: string): number {
  const comma = uri.indexOf(',');
  const meta = uri.slice(5, comma);
  const data = uri.slice(comma + 1);
  if (meta.endsWith(';base64')) {
    const clean = data.replace(/\s/g, '');
    const padding = clean.endsWith('==') ? 2 : clean.endsWith('=') ? 1 : 0;
    return Math.floor((clean.length * 3) / 4) - padding;
  }
  return new TextEncoder().encode(safeDecode(data)).length;
}

function safeDecode(text: string): string {
  try {
    return decodeURIComponent(text);
  } catch {
    return text;
  }
}
