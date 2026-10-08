import { playwright } from '@vitest/browser-playwright';
import { configDefaults, defineConfig } from 'vitest/config';

// Interaction tests (focus, Tab order, keyboard, roles, paste, anything inside a shadow root) run
// against the real Stencil components in Chromium; everything else runs in Node or jsdom
const TESTS = 'src/**/*.{test,spec}.{ts,tsx}';
const BROWSER_TESTS = 'src/**/*.browser.{test,spec}.{ts,tsx}';

export default defineConfig({
	test: {
		// Stencil's dev warnings and dev errors include the element and its React internals.
		// Vitest reads this filter only from the root config and can strip %c from the styled prefix.
		onConsoleLog: log => !log.startsWith('STENCIL:') && !log.startsWith('%cstencil') && !log.startsWith('stencil '),
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
				// SchemaForm's stylesheets `@use 'node_modules/@kelvininc/ui-components/...'`, which rollup
				// resolves from the package root; the browser project compiles them, so Sass needs that root too
				css: { preprocessorOptions: { scss: { loadPaths: [import.meta.dirname] } } },
				// When Vite detects an AI agent, it copies the browser console into the terminal, Stencil's dev
				// warnings included, each with the element and its React internals: over 600 KB for one file of
				// SchemaForm tests. Vitest reports what tests log on its own.
				server: { forwardConsole: false },
				test: {
					name: 'browser',
					include: [BROWSER_TESTS],
					// Tokens, fonts, icons and the Night theme, as in Storybook, so layout assertions measure real styles
					setupFiles: ['src/test-utils/setup-browser.ts'],
					browser: {
						enabled: true,
						// Keep native scrollbars so headless layout checks match a visible browser.
						provider: playwright({ launchOptions: { ignoreDefaultArgs: ['--hide-scrollbars'] } }),
						headless: true,
						instances: [{ browser: 'chromium' }],
						// A desktop width, above every container breakpoint; tests that need a narrow layout size their container
						viewport: { width: 1280, height: 800 },
						// Screenshots of failing tests go here, ignored by git, apart from the reference images
						// visual tests keep in __screenshots__ next to each test
						screenshotDirectory: '.vitest-screenshots'
					}
				}
			}
		]
	}
});
