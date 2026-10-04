import { playwright } from '@vitest/browser-playwright';
import { configDefaults, defineConfig } from 'vitest/config';

// Interaction tests (focus, Tab order, keyboard, roles, paste, anything inside a shadow root) run
// against the real Stencil components in Chromium; everything else runs in Node or jsdom
const BROWSER_TESTS = 'src/**/*.browser.test.{ts,tsx}';

export default defineConfig({
	test: {
		projects: [
			{
				extends: true,
				test: {
					name: 'unit',
					include: ['src/**/*.test.{ts,tsx}'],
					exclude: [...configDefaults.exclude, BROWSER_TESTS]
				}
			},
			{
				extends: true,
				test: {
					name: 'browser',
					include: [BROWSER_TESTS],
					browser: {
						enabled: true,
						provider: playwright(),
						headless: true,
						instances: [{ browser: 'chromium' }]
					}
				}
			}
		]
	}
});
