import type { TextOrAltView } from '../shared/text-or-alt';
import { Badge } from './Badge';

/** Текст, alt Image з приміткою `img` або бейдж Empty. */
export function TextOrAlt({ value }: { value: TextOrAltView }) {
  if (value.kind === 'text') return <>{value.text}</>;
  if (value.kind === 'image')
    return (
      <>
        <span class="text-muted">img </span>
        {value.text}
      </>
    );
  return <Badge badge={value.badge} />;
}
