import { assess } from './assess';
import type { IndexingSnapshot } from './types';
import { View } from './View';

/** Половина попапа Group Indexing: canonical, robots, hreflang. */
export const indexing = {
  id: 'indexing' as const,
  label: 'Indexing',
  Panel: ({ snapshot }: { snapshot: IndexingSnapshot }) => <View view={assess(snapshot)} />,
};
