import { readFileSync } from 'fs';
import { resolve } from 'path';
import { optimize } from 'svgo';

// kv-icon renders <use href="…svg-symbols.svg#name"> against this external sprite.
// Firefox parses external <use> documents as strict XML, so a single malformed
// symbol blanks every icon (KFE-3090). The sprite is hand-maintained, so this
// guard fails the build if an edit leaves it malformed.
const SPRITE_PATH = resolve(__dirname, '../../../assets/svg-symbols.svg');

describe('svg-symbols.svg sprite', () => {
	const sprite = readFileSync(SPRITE_PATH, 'utf-8');

	it('is well-formed XML (Firefox rejects the whole sprite otherwise)', () => {
		expect(() => optimize(sprite, { path: SPRITE_PATH })).not.toThrow();
	});

	it('contains icon symbols', () => {
		expect(sprite.match(/<symbol\b/g)?.length ?? 0).toBeGreaterThan(0);
	});
});
