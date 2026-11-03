import { useState } from 'preact/hooks';
import { Badge } from '../../ui/Badge';
import type { FileView, ImageView, LinkView } from './assess/image';

/** Image: прев'ю ліворуч; праворуч alt, адреса, розміри й вага. */
export function ImageRow({ image }: { image: ImageView }) {
  return (
    <li data-testid={image.id} class="flex gap-2.5 border-b border-line px-3.5 py-2">
      <Preview src={image.preview} />
      <div class="min-w-0 flex-1">
        <div class="text-ink wrap-anywhere">
          {image.alt.kind === 'text' ? (
            image.alt.text
          ) : (
            <>
              <span class="text-muted">alt </span>
              <Badge badge={image.alt.badge} />
            </>
          )}
        </div>
        <div class="mt-0.5 font-mono text-xs wrap-anywhere">
          <Address link={image.link} />
        </div>
        <div data-testid="file" class="mt-0.5 font-mono text-xs text-muted">
          <FileInfo file={image.file} />
        </div>
      </div>
    </li>
  );
}

/** Попап сам завантажує файл; хотлінк-захист або потреба в cookies дають плейсхолдер. */
function Preview({ src }: { src: string | null }) {
  const [failed, setFailed] = useState(false);
  const box = 'size-14 shrink-0 rounded bg-surface-2';
  if (src === null || failed) {
    return <div data-testid="preview-placeholder" aria-hidden="true" class={box} />;
  }
  return (
    <img
      data-testid="preview"
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      class={`${box} object-contain`}
      onError={() => setFailed(true)}
    />
  );
}

function Address({ link }: { link: LinkView }) {
  if (link.kind === 'badge') {
    return (
      <>
        <span class="text-muted">src </span>
        <Badge badge={link.badge} />
      </>
    );
  }
  if (link.kind === 'data') return <span class="text-muted">{link.text}</span>;
  return (
    <a href={link.href} target="_blank" rel="noreferrer" class="text-accent hover:underline">
      {link.href}
    </a>
  );
}

function FileInfo({ file }: { file: FileView }) {
  if (file.kind === 'badge') return <Badge badge={file.badge} />;
  const { size } = file;
  return (
    <>
      {file.dimensions} ·{' '}
      {size.kind === 'badge' ? (
        <Badge badge={size.badge} />
      ) : (
        <span
          data-testid="size"
          data-heavy={size.heavy ? 'true' : undefined}
          class={size.heavy ? 'font-semibold text-bad' : undefined}
        >
          {size.text}
        </span>
      )}
    </>
  );
}
