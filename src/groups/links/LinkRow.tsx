import { Badge } from '../../ui/Badge';
import { TextOrAlt } from '../../ui/TextOrAlt';
import type { AddressView, LinkView } from './assess/link';

/** Link: Anchor text зверху; під ним адреса, External і значення `rel` Nofollow. */
export function LinkRow({ link }: { link: LinkView }) {
  return (
    <li data-testid={link.id} class="border-b border-line px-3.5 py-2">
      <div class="text-ink wrap-anywhere">
        <TextOrAlt value={link.anchor} />
      </div>
      <div class="mt-0.5 font-mono text-xs wrap-anywhere">
        <Address address={link.address} />
        {link.badges.map((b) => (
          <span key={b.text} class="font-sans">
            {' '}
            <Badge badge={b} />
          </span>
        ))}
      </div>
    </li>
  );
}

function Address({ address }: { address: AddressView }) {
  if (address.kind === 'badge')
    return (
      <>
        <span class="text-muted">href </span>
        <Badge badge={address.badge} />
      </>
    );
  if (address.kind === 'text') return <span class="text-muted">{address.text}</span>;
  return (
    <a href={address.href} target="_blank" rel="noreferrer" class="text-accent hover:underline">
      {address.href}
    </a>
  );
}
