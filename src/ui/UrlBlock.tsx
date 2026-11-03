/** Повний URL вкладки моноширинним вторинним текстом (Header і StateScreen). */
export function UrlBlock({ url }: { url: string }) {
  return (
    <span class="block font-mono text-xs wrap-anywhere text-muted" data-testid="url">
      {url}
    </span>
  );
}
