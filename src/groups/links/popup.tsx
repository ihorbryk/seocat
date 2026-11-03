import { assess } from './assess';
import type { LinksSnapshot } from './types';
import { View } from './View';

/** Половина попапа Group Links: Anchor text, адреса, External і Nofollow кожного Link, плитки-фільтри. */
export const links = {
  id: 'links' as const,
  label: 'Links',
  Panel: ({ snapshot }: { snapshot: LinksSnapshot }) => <View view={assess(snapshot)} />,
};
