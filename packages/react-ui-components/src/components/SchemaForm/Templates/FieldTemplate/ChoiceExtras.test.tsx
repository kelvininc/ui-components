// @vitest-environment jsdom
import { getDefaultRegistry } from '@rjsf/core';
import { createSchemaUtils, FieldTemplateProps } from '@rjsf/utils';
import React, { act } from 'react';
import { createRoot } from 'react-dom/client';
import { expect, it, vi } from 'vitest';
import { getDefaultValidator } from '../../../../utils';
import { ChoiceControlContext, FormStateProvider } from '../../contexts';
import { CHOICE_INTERACTION_SHAPES, CHOICE_SCHEMAS } from '../../test-utils/matrix';
import widgets from '../../Widgets';
import ChoiceExtras from './ChoiceExtras';

vi.mock('../../../../stencil-generated', async () => (await import('../../../../test-utils')).stencilMocks);

it.each(CHOICE_INTERACTION_SHAPES.filter(row => row.name !== 'editable'))('cancels a delayed clear commit when the field becomes $name', async flags => {
	const container = document.createElement('div');
	const host = document.createElement('kv-radio-list') as HTMLKvRadioListElement;
	const setFocus = vi.fn().mockResolvedValue(undefined);
	host.setFocus = setFocus;
	document.body.append(container, host);
	const root = createRoot(container);
	const defaults = getDefaultRegistry();
	const registry = { ...defaults, widgets: { ...defaults.widgets, ...widgets }, schemaUtils: createSchemaUtils(getDefaultValidator(), CHOICE_SCHEMAS[0].schema) };
	const onChange = vi.fn();
	const ref = { current: host };
	const renderExtras = (formData: unknown, disabled = false, readonly = false) =>
		act(async () =>
			root.render(
				<FormStateProvider>
					<ChoiceControlContext.Provider value={ref}>
						<ChoiceExtras
							{...({
								id: 'root_choice',
								label: 'TLS',
								children: <></>,
								onKeyChange: () => () => {},
								onDropPropertyClick: () => () => {},
								schema: CHOICE_SCHEMAS[0].schema,
								uiSchema: {},
								registry,
								formData,
								disabled,
								readonly,
								required: false,
								onChange
							} satisfies FieldTemplateProps)}
						/>
					</ChoiceControlContext.Provider>
				</FormStateProvider>
			)
		);
	try {
		await renderExtras(false);
		await act(async () => container.querySelector('button')!.click());
		expect(onChange).toHaveBeenCalledExactlyOnceWith(undefined);
		// Eligibility can change before a caller commits the requested value.
		await renderExtras(false, flags.disabled, flags.readonly);
		await renderExtras(undefined, flags.disabled, flags.readonly);
		await renderExtras(undefined);
		expect(setFocus).not.toHaveBeenCalled();
	} finally {
		await act(async () => root.unmount());
		container.remove();
		host.remove();
	}
});
