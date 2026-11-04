/**
 * Search (`GLOSSARY.md`): підрядок без урахування регістру в тексті або адресі запису.
 * `assess` готує рядки один раз, `View` на кожне натискання лише порівнює.
 */

/** Рядки для Search у нижньому регістрі: тексти як є, адреси сирими й декодованими. */
export function searchTexts({ texts, addresses }: { texts: string[]; addresses: string[] }) {
  const out = new Set<string>();
  for (const text of texts) if (text) out.add(text.toLowerCase());
  for (const address of addresses) {
    if (!address) continue;
    out.add(address.toLowerCase());
    out.add(decode(address).toLowerCase());
  }
  return [...out];
}

/** Порожній запит (після обрізання пробілів) пропускає все. */
export function matchesSearch(search: string[], query: string): boolean {
  const q = query.trim().toLowerCase();
  return q === '' || search.some((s) => s.includes(q));
}

/** Битий percent-escape лишає адресу сирою. */
function decode(address: string): string {
  try {
    return decodeURI(address);
  } catch {
    return address;
  }
}
