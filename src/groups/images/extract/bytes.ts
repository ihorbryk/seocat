/**
 * Вага завантаженого файлу: для `data:` з самого URI, інакше `encodedBodySize` з Resource Timing.
 * null, коли браузер її не віддає: cross-origin без `Timing-Allow-Origin` дає 0,
 * а запису може не бути (кеш у пам'яті, переповнений буфер).
 */
export function fileBytes(src: string): number | null {
  if (src.startsWith('data:')) return dataUriBytes(src);
  const entry = globalThis.performance?.getEntriesByName(src, 'resource')[0] as
    PerformanceResourceTiming | undefined;
  return entry?.encodedBodySize || null;
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
