import { initialize, setThemeMode, StyleMode } from '@kelvininc/ui-components';
// The design tokens and fonts the components are styled with, as in Storybook
import '@kelvininc/ui-components/assets/styles/style-dictionary/tokens/index.css';
import '@kelvininc/ui-components/assets/fonts/font-proxima-nova.css';
import '@kelvininc/ui-components/assets/fonts/font-incosolata.css';

// Icons load the symbols file from the built core package, which the test server serves
initialize({ styleMode: StyleMode.Night, baseAssetsUrl: '/node_modules/@kelvininc/ui-components/dist/assets/' });
setThemeMode(StyleMode.Night);
