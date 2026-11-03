import { cleanup } from '@testing-library/preact';
import { afterEach } from 'vitest';

// Без `globals: true` Testing Library не реєструє авто-очищення сам.
afterEach(cleanup);
