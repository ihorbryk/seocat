import { assess } from './assess';
import type { ContentSnapshot } from './types';
import { View } from './View';

/** Половина попапа Group Content: meta title і description, хедер з плитками й діаграмою H1–H6. */
export const content = {
  id: 'content' as const,
  label: 'Content',
  Panel: ({ snapshot }: { snapshot: ContentSnapshot }) => <View view={assess(snapshot)} />,
};
