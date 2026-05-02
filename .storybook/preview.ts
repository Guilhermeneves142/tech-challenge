import type { Preview } from '@storybook/nextjs-vite';
// @ts-expect-error - CSS import not typed
import '../src/styles/globals.css';
// @ts-expect-error - CSS import not typed
import '../src/styles/typography.css';


const preview: Preview = {
  parameters: {
    backgrounds: {
      values: [
        { name: 'light', value: '#ffffff' },
      ],
      default: 'light',
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;