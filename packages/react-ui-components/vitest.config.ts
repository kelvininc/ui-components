import { playwright } from '@vitest/browser-playwright';
import { configDefaults, defineConfig } from 'vitest/config';

// Interaction tests (focus, Tab order, keyboard, roles, paste, anything inside a shadow root) run
// against the real Stencil components in Chromium; everything else runs in Node or jsdom
const TESTS = 'src/**/*.{test,spec}.{ts,tsx}';
const BROWSER_TESTS = 'src/**/*.browser.{test,spec}.{ts,tsx}';

export default defineConfig({
	test: {
		projects: [
			{
				extends: true,
				test: {
					name: 'unit',
					include: [TESTS],
					exclude: [...configDefaults.exclude, BROWSER_TESTS],
					setupFiles: ['src/test-utils/setup-unit.ts']
				}
			},
			{
				extends: true,
				// Tests and components must share one React, or hooks fail with "Invalid hook call"
				resolve: { dedupe: ['react', 'react-dom'] },
				test: {
					name: 'browser',
					include: [BROWSER_TESTS],
					browser: {
						enabled: true,
						provider: playwright(),
						headless: true,
						instances: [{ browser: 'chromium' }],
						// Screenshots of failing tests go here, ignored by git, apart from the reference images
						// visual tests keep in __screenshots__ next to each test
						screenshotDirectory: '.vitest-screenshots'
					}
				}
			}
		]
	}
});
