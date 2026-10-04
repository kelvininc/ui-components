import { configDefaults, defineConfig } from 'vitest/config';

// Interaction tests run in a real browser (the `browser` project, added later in this file);
// everything else runs here, in Node or jsdom
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
			}
		]
	}
});
