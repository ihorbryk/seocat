import { assess } from './assess';
import type { ImagesSnapshot } from './types';
import { View } from './View';

/** Половина попапа Group Images: прев'ю, alt, адреса, розміри й вага кожного Image. */
export const images = {
  id: 'images' as const,
  label: 'Images',
  Panel: ({ snapshot }: { snapshot: ImagesSnapshot }) => <View view={assess(snapshot)} />,
};
