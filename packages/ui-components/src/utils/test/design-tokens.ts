import { readFileSync } from 'fs';
import { join } from 'path';

export const DESIGN_TOKEN_CSS = ['core.css', 'component_semantics.css']
	.map(file => readFileSync(join(__dirname, '../../assets/styles/style-dictionary/tokens', file), 'utf8'))
	.join('\n');
