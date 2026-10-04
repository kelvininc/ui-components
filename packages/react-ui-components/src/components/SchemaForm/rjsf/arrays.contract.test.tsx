// @vitest-environment jsdom

import Form from '@rjsf/core';
import { ArrayFieldItemButtonsTemplateProps, ArrayFieldItemTemplateProps, ArrayFieldTemplateProps, RJSFSchema, UiSchema, getTemplate, getUiOptions } from '@rjsf/utils';
import React, { act, isValidElement } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getDefaultValidator } from '../../../utils';
import { ARRAY_SHAPES } from '../test-utils/matrix';

const validator = getDefaultValidator();
let container: HTMLDivElement;
let root: Root;

beforeEach(() => {
	container = document.createElement('div');
	root = createRoot(container);
});

afterEach(async () => {
	await act(async () => root.unmount());
});

const captureTemplates = () => {
	const arrays: ArrayFieldTemplateProps[] = [];
	const items = new Map<number, ArrayFieldItemTemplateProps>();
	const buttons = new Map<number, ArrayFieldItemButtonsTemplateProps>();
	const ArrayFieldTemplate = (props: ArrayFieldTemplateProps) => {
		arrays.push(props);
		return <div>{props.items}</div>;
	};
	const ArrayFieldItemButtonsTemplate = (props: ArrayFieldItemButtonsTemplateProps): null => {
		buttons.set(props.index, props);
		return null;
	};
	const ArrayFieldItemTemplate = (props: ArrayFieldItemTemplateProps) => {
		items.set(props.index, props);
		const Buttons = getTemplate('ArrayFieldItemButtonsTemplate', props.registry, getUiOptions(props.uiSchema));
		return (
			<div>
				{props.children}
				<Buttons {...props.buttonsProps} />
			</div>
		);
	};
	return { arrays, items, buttons, templates: { ArrayFieldTemplate, ArrayFieldItemTemplate, ArrayFieldItemButtonsTemplate } };
};

describe('RJSF 6 array contracts', () => {
	it('supplies rendered React elements that a custom array template renders directly', async () => {
		const topics = ARRAY_SHAPES.find(row => row.name === 'string list')!;
		const capture = captureTemplates();
		await act(async () => root.render(<Form schema={topics.schema} formData={topics.formData} validator={validator} templates={capture.templates} />));

		const array = capture.arrays[capture.arrays.length - 1];
		expect(array.items).toHaveLength(3);
		expect(array.items.every(item => isValidElement(item))).toBe(true);
		expect([...container.querySelectorAll('input')].map(input => input.value)).toEqual(topics.formData);
		expect(array.fieldPathId).toMatchObject({ $id: 'root', path: [] });
	});

	it('binds move and remove callbacks to each item in a separate button template', async () => {
		const topics = ARRAY_SHAPES.find(row => row.name === 'string list')!;
		const capture = captureTemplates();
		const onChange = vi.fn();
		await act(async () => root.render(<Form schema={topics.schema} formData={topics.formData} validator={validator} templates={capture.templates} onChange={onChange} />));

		expect(capture.buttons.get(0)).toMatchObject({ hasMoveUp: false, hasMoveDown: true, fieldPathId: { $id: 'root_0', path: [0] } });
		expect(capture.buttons.get(2)).toMatchObject({ hasMoveUp: true, hasMoveDown: false });
		await act(async () => capture.buttons.get(0)!.onMoveDownItem());
		expect(onChange.mock.lastCall?.[0].formData).toEqual(['alarms', 'telemetry', 'commands']);
		await act(async () => capture.buttons.get(1)!.onMoveUpItem());
		expect(onChange.mock.lastCall?.[0].formData).toEqual(topics.formData);
		await act(async () => capture.buttons.get(1)!.onRemoveItem());
		expect(onChange.mock.lastCall?.[0].formData).toEqual(['telemetry', 'commands']);
	});

	it('keeps the bound button callbacks when an item value changes', async () => {
		const topics = ARRAY_SHAPES.find(row => row.name === 'string list')!;
		const capture = captureTemplates();
		await act(async () => root.render(<Form schema={topics.schema} formData={topics.formData} validator={validator} templates={capture.templates} />));
		const first = capture.buttons.get(0)!;
		await act(async () => root.render(<Form schema={topics.schema} formData={['status', 'alarms', 'commands']} validator={validator} templates={capture.templates} />));

		expect(container.querySelector('input')?.value).toBe('status');
		const updated = capture.buttons.get(0)!;
		expect(updated.onMoveUpItem).toBe(first.onMoveUpItem);
		expect(updated.onMoveDownItem).toBe(first.onMoveDownItem);
		expect(updated.onRemoveItem).toBe(first.onRemoveItem);
	});

	const hintCases: { name: string; itemSchema: RJSFSchema; value: unknown; uiSchema?: UiSchema; displayLabel: boolean; hasDescription: boolean }[] = [
		{ name: 'string', itemSchema: { type: 'string', title: 'Topic' }, value: 'telemetry', displayLabel: true, hasDescription: false },
		{
			name: 'string with a description',
			itemSchema: { type: 'string', title: 'Topic', description: 'The broker topic.' },
			value: 'telemetry',
			displayLabel: true,
			hasDescription: true
		},
		{
			name: 'hidden label and UI description',
			itemSchema: { type: 'string', title: 'Topic' },
			value: 'telemetry',
			uiSchema: { items: { 'ui:label': false, 'ui:description': 'The broker topic.' } },
			displayLabel: false,
			hasDescription: true
		},
		{ name: 'object', itemSchema: { type: 'object', properties: { host: { type: 'string' } } }, value: { host: 'broker-1.local' }, displayLabel: false, hasDescription: false },
		{
			name: 'object with a description',
			itemSchema: { type: 'object', description: 'A broker connection.', properties: { host: { type: 'string' } } },
			value: { host: 'broker-1.local' },
			displayLabel: false,
			hasDescription: true
		}
	];

	it.each(hintCases)('provides label and description hints for $name items', async ({ itemSchema, value, uiSchema, displayLabel, hasDescription }) => {
		const capture = captureTemplates();
		await act(async () =>
			root.render(<Form schema={{ type: 'array', items: itemSchema }} formData={[value]} uiSchema={uiSchema} validator={validator} templates={capture.templates} />)
		);

		expect(capture.items.get(0)).toMatchObject({ displayLabel, hasDescription });
	});
});
