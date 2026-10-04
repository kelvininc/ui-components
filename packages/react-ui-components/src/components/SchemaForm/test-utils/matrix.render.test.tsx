// @vitest-environment jsdom

import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { describe, expect, it, vi } from 'vitest';
import { propsOf } from '../../../test-utils';
import { KvSchemaForm } from '../SchemaForm';
import { BROKER_FORM_DATA, BROKER_SCHEMA, ERROR_SHAPES } from './matrix';

vi.mock('../../../stencil-generated', async () => (await import('../../../test-utils')).stencilMocks);

const EXPECTED_IDS = [...new Set(ERROR_SHAPES.flatMap(({ messages }) => messages.map(({ id }) => id)))];

describe('the broker form ERROR_SHAPES apply to', () => {
	it.each(EXPECTED_IDS)('renders a field with the id %s, so the errors expected there have somewhere to show', async id => {
		vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true);
		const root = createRoot(document.createElement('div'));
		await act(async () => root.render(<KvSchemaForm schema={BROKER_SCHEMA} formData={BROKER_FORM_DATA} />));

		expect(propsOf(id).id).toBe(id);

		await act(async () => root.unmount());
		vi.unstubAllGlobals();
	});
});
