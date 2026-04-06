import { join } from 'path';
import daisyui from 'daisyui';
import typography from '@tailwindcss/typography'; // Import this properly
import { createGlobPatternsForDependencies } from '@nx/angular/tailwind';

export default {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    fontFamily: {
      sans: 'Inter var, ui-sans-serif, system-ui',
      serif: 'Inter var, ui-sans-serif, system-ui',
    },
    extend: {},
  },
  plugins: [
    typography, // Use the imported variable
    daisyui
  ],
  daisyui: {
    themes: [
      {
        fantasy: {
          // Note: Setting primary and primary-content both to white 
          // might make your text invisible on buttons!
          'primary': '#ffffff', 
          'primary-content': '#000000', // Changed to black for visibility
          'secondary': '#F6F6F6',
          'neutral': '#E8E8E8',
          'base-100': '#ffc0cb', // 'pink'
        },
      },
    ],
    base: true,
    styled: true,
    utils: true,
    prefix: '',
    logs: true,
    themeRoot: ':root',
  },
};