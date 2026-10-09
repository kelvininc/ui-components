import React from 'react';
import type { ErrorSchema } from '@rjsf/utils';
import { describe, expect, it, vi } from 'vitest';
import { EComponentSize, setThemeMode, StyleMode } from '@kelvininc/ui-components';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../test-utils/browser';
import { KvSchemaForm } from './SchemaForm';
import {
	BROKER_FORM_DATA,
	BROKER_SCHEMA,
	ERROR_SHAPES,
	FLAT_OBJECT_SHAPES,
	L2_ELIGIBILITY_SHAPES,
	L2_PRESENTATION_SHAPES,
	REQUIRED_MARKER_TABLE_SHAPE,
	L2_SIZE_SHAPES,
	L2_LABEL_SHAPES,
	L2_DESCRIPTION_SHAPES,
	L2_ITEM_GUIDANCE_SHAPES,
	L2_REGISTRY_OVERRIDES,
	L2_NUMERIC_DISPATCH_SHAPES,
	L2_ROW_ERROR_SHAPES,
	LIST_OPTIONS,
	R5_ARRAY_ACTIONS
} from './test-utils/matrix';
import tableStyles from './Templates/ArrayFieldTemplate/TableLayout.module.scss';

const rootRows = (container: HTMLElement) => Array.from(container.querySelectorAll<HTMLElement>('[data-schema-form-list="root"] > div > div > [data-schema-form-list-item]'));
const controls = (row: HTMLElement) =>
	Array.from(row.querySelectorAll<HTMLElement>('[data-table-cell]')).map(cell => cell.querySelector<HTMLElement>('kv-text-field[id],kv-single-select-dropdown[id]')!);

it.each([479, 480])('keeps table and narrow cell required suffixes at %ipx', async width => {
	const row = REQUIRED_MARKER_TABLE_SHAPE;
	const screen = await render(
		<div style={{ width }}>
			<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={row.uiSchema} />
		</div>
	);
	await whenAllKelvinReady(screen.container);
	const header = screen.getByRole('columnheader', { name: 'Name, required', exact: true }).element();
	const labels = [header, ...screen.container.querySelectorAll<HTMLElement>(`[data-table-cell="name"] .${tableStyles.CellLabel}`)];
	expect(labels).toHaveLength(1 + row.formData.length);
	for (const label of labels) {
		const marker = label.querySelector(`.${tableStyles.Required}`)!;
		expect(marker.getAttribute('aria-hidden')).toBe('true');
		expect(marker.previousElementSibling!.textContent).toBe('Name');
		expect(marker.nextElementSibling!.tagName).toBe('KV-TOGGLE-TIP');
		if (label !== header) expect(label.checkVisibility({ checkVisibilityCSS: true })).toBe(width < 480);
	}
	const headerRow = header.parentElement!;
	expect(getComputedStyle(headerRow).clipPath).toBe(width < 480 ? 'inset(50%)' : 'none');
	if (width < 480) expect(headerRow.getBoundingClientRect().height).toBe(1);
	for (const [index, host] of Array.from(screen.container.querySelectorAll<HTMLKvTextFieldElement>('[data-table-cell="name"] kv-text-field')).entries()) {
		await expect.element(screen.getByRole('textbox', { name: `Name, Variable ${index + 1}`, exact: true })).toBeVisible();
		expect(host.accessibleLabel).toBe(`Name, Variable ${index + 1}`);
	}
});

describe.each(FLAT_OBJECT_SHAPES)('L2 layout matrix: $name', row => {
	describe.each(LIST_OPTIONS)('$name', option => {
		describe.each([false, true])('opt-out=%s', optedOut => {
			it.each([479, 480])('uses the %ipx container in both editing modes', async width => {
				for (const readonly of [false, true]) {
					const screen = await render(
						<div style={{ width: `${width}px` }}>
							<KvSchemaForm
								schema={row.schema}
								formData={row.formData}
								readonly={readonly}
								uiSchema={{ ...row.uiSchema, 'ui:options': { ...option.options, layout: optedOut ? 'sections' : undefined } }}
							/>
						</div>
					);
					await whenAllKelvinReady(screen.container);
					await document.fonts.ready;
					const list = screen.container.querySelector('[data-schema-form-list="root"]')!;
					const table = list.querySelector('[role="table"]');
					expect(Boolean(table)).toBe(row.isFlat && !optedOut);
					if (table) {
						const rows = rootRows(screen.container);
						expect(rows).toHaveLength(row.formData.length);
						for (const [index, item] of rows.entries()) {
							const inputs = controls(item);
							const tops = inputs.map(input => input.getBoundingClientRect().top);
							if (width < 480) expect(new Set(tops).size).toBe(inputs.length);
							else expect(Math.max(...tops) - Math.min(...tops)).toBeLessThanOrEqual(1);
							const rowHeader = item.querySelector('[role="rowheader"]')!;
							expect(rowHeader.textContent).toBe(`row ${index + 1}`);
							for (const cell of item.querySelectorAll<HTMLElement>('[data-table-cell]')) {
								const ids = cell.getAttribute('aria-labelledby')!.split(' ');
								expect(ids[1]).toBe(rowHeader.id);
								expect(document.getElementById(ids[0])?.getAttribute('role')).toBe('columnheader');
								const host = cell.querySelector<HTMLKvTextFieldElement | HTMLKvSingleSelectDropdownElement>('kv-text-field[id],kv-single-select-dropdown[id]')!;
								const columnName = document.getElementById(ids[0])!.textContent!.trim();
								expect(host.accessibleLabel).toBe(`${columnName}, row ${index + 1}`);
								const control = screen.getByLabelText(host.accessibleLabel, { exact: true });
								await expect.element(control).toBeVisible();
								if (readonly) await expect.element(control).toBeDisabled();
								else await expect.element(control).toBeEnabled();
								const label = cell.querySelector<HTMLElement>('[aria-hidden="true"]')!;
								expect(label.checkVisibility({ checkVisibilityCSS: true })).toBe(width < 480);
							}
							if (option.options.orderable !== false) {
								const grip = screen.getByRole('button', { name: `Reorder row ${index + 1}`, exact: true });
								if (readonly) await expect.element(grip).toBeDisabled();
								else await expect.element(grip).toBeEnabled();
							}
							if (option.options.removable !== false) {
								const remove = screen.getByRole('button', { name: `Remove row ${index + 1}`, exact: true });
								if (readonly) await expect.element(remove).toBeDisabled();
								else await expect.element(remove).toBeEnabled();
							}
						}
						if (option.options.addable !== false) expect(list.querySelector('kv-action-button')?.closest('[role="table"]')).toBeNull();
					}
					await screen.unmount();
				}
			});
		});
	});
});

it.each(L2_ELIGIBILITY_SHAPES)('L2 real widget eligibility: $name', async row => {
	const screen = await render(<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={'uiSchema' in row ? row.uiSchema : undefined} />);
	await whenAllKelvinReady(screen.container);
	expect(Boolean(screen.container.querySelector('[role="table"]'))).toBe(row.isFlat);
});

describe.each(L2_SIZE_SHAPES)('L2 action sizing: $name', row => {
	describe.each([StyleMode.Light, StyleMode.Night])('theme=%s', theme => {
		it.each([479, 480])('aligns actions with the first visible control at %ipx', async width => {
			setThemeMode(theme);
			try {
				const screen = await render(
					<div style={{ width: `${width}px` }}>
						<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={row.uiSchema} formContext={row.formContext} />
					</div>
				);
				await whenAllKelvinReady(screen.container);
				await document.fonts.ready;
				const center = (element: Element) => {
					const rect = element.getBoundingClientRect();
					return rect.top + rect.height / 2;
				};
				const rows = rootRows(screen.container);
				for (const item of rows) {
					const first = controls(item)[0];
					const name = item.querySelector('[role="rowheader"]')!.textContent!;
					for (const label of [`Reorder ${name}`, `Remove ${name}`]) {
						const action = screen.getByRole('button', { name: label, exact: true }).element();
						expect(action.getBoundingClientRect().height).toBe(row.actionSize === EComponentSize.Small ? 32 : 40);
						expect(Math.abs(center(action) - center(first))).toBeLessThanOrEqual(1);
					}
				}
				const firstCell = rows[0].querySelector('[data-table-cell]')!;
				const add = screen.container.querySelector('kv-action-button')!;
				expect(add.querySelector('span')!.getBoundingClientRect().left).toBeCloseTo(firstCell.getBoundingClientRect().left, 0);
				const plus = add.querySelector('kv-icon')!.shadowRoot!.querySelector('.icon')!.getBoundingClientRect();
				const grip = screen.getByRole('button', { name: 'Reorder row 1', exact: true }).element().getBoundingClientRect();
				expect(plus.left + plus.width / 2).toBeCloseTo(grip.left + grip.width / 2, 0);
				if (width >= 480)
					expect(screen.container.querySelector('[role="columnheader"][aria-colindex="2"]')!.getBoundingClientRect().left).toBeCloseTo(
						firstCell.getBoundingClientRect().left,
						0
					);
				const inputs = controls(rows[0]);
				const native = (host: HTMLElement) => screen.getByLabelText((host as HTMLKvTextFieldElement).accessibleLabel, { exact: true }).element() as HTMLElement;
				native(inputs[0]).focus();
				await userEvent.keyboard('{Tab}');
				expect(native(inputs[1]).matches(':focus')).toBe(true);
				for (const name of ['Reorder row 1', 'Remove row 1']) {
					await userEvent.keyboard('{Tab}');
					expect(screen.getByRole('button', { name, exact: true }).element().matches(':focus')).toBe(true);
				}
				await userEvent.keyboard('{Tab}');
				expect(native(controls(rows[1])[0]).matches(':focus')).toBe(true);
			} finally {
				setThemeMode(StyleMode.Night);
			}
		});
	});
});

it.each(L2_REGISTRY_OVERRIDES)('L2 real registered override: $name', async ({ name: _name, ...overrides }) => {
	const row = FLAT_OBJECT_SHAPES[0];
	const screen = await render(<KvSchemaForm schema={row.schema} formData={row.formData} {...overrides} />);
	await whenAllKelvinReady(screen.container);
	expect(screen.container.querySelector('[role="table"]')).toBeNull();
});

it.each(L2_NUMERIC_DISPATCH_SHAPES)('L2 real numeric widget dispatch: $name', async row => {
	const screen = await render(<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={row.uiSchema} widgets={row.widgets} />);
	await whenAllKelvinReady(screen.container);
	expect(Boolean(screen.container.querySelector('[role="table"]'))).toBe(row.isFlat);
	expect(screen.container.querySelector('#root_0_retries')!.tagName).toBe(row.custom ? 'INPUT' : 'KV-TEXT-FIELD');
});

it.each(L2_PRESENTATION_SHAPES)('L2 header presentation: $name', async row => {
	const screen = await render(
		<div style={{ width: '640px' }}>
			<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={row.uiSchema} />
		</div>
	);
	await whenAllKelvinReady(screen.container);
	const headers = screen.container.querySelectorAll('[role="columnheader"]');
	expect(headers[1].textContent).toBe('Value');
	expect(headers[2].textContent).toBe(row.name === 'required' ? 'Name*' : 'Name');
	const labelCenter = (header: Element) => {
		const label = header.querySelector('span')!.getBoundingClientRect();
		return label.top + label.height / 2;
	};
	expect(labelCenter(headers[1])).toBeCloseTo(labelCenter(headers[2]), 0);
	expect(
		Array.from(screen.container.querySelectorAll<HTMLElement>('[data-table-cell] kv-info-label,[data-table-cell] kv-toggle-tip,[data-table-cell] kv-form-help-text')).filter(
			element => element.checkVisibility({ checkVisibilityCSS: true })
		)
	).toHaveLength(0);
	if (row.name === 'description' || row.name === 'help') {
		const tip = headers[2].querySelector('kv-toggle-tip')!;
		await userEvent.click(tip.querySelector('[slot="open-element-slot"]')!);
		await expect
			.poll(() =>
				page
					.getByText('Starts with a letter or underscore.', { exact: true })
					.elements()
					.some(element => element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }))
			)
			.toBe(true);
	}
});

describe.each(L2_PRESENTATION_SHAPES.filter(row => row.name === 'description' || row.name === 'help'))('L2 responsive keyboard help: $name', row => {
	it.each([479, 480])('tabs to a named tip and toggles it with Enter and Space at %ipx', async width => {
		const screen = await render(
			<div style={{ width: `${width}px` }}>
				<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={row.uiSchema} />
			</div>
		);
		await whenAllKelvinReady(screen.container);
		const firstInput = screen.getByRole('textbox', { name: 'Value, Variable 1', exact: true }).element() as HTMLElement;
		firstInput.focus();
		await userEvent.keyboard(width < 480 ? '{Tab}' : '{Shift>}{Tab}{/Shift}');
		const helpButton = screen.getByRole('button', { name: width < 480 ? 'Help for Name, Variable 1' : 'Help for Name', exact: true });
		expect(helpButton.element().matches(':focus')).toBe(true);
		const visibleTips = () =>
			page
				.getByText('Starts with a letter or underscore.', { exact: true })
				.elements()
				.filter(element => element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })).length;
		for (const key of ['{Enter}', ' '] as const) {
			await userEvent.keyboard(key);
			await expect.poll(visibleTips).toBe(1);
			await userEvent.keyboard(key);
			await expect.poll(visibleTips).toBe(0);
		}
		if (width >= 480) {
			await userEvent.keyboard('{Tab}');
			expect(firstInput.matches(':focus')).toBe(true);
		}
		await userEvent.keyboard('{Tab}');
		expect(screen.getByRole('textbox', { name: 'Name, Variable 1', exact: true }).element().matches(':focus')).toBe(true);
		for (const name of ['Reorder Variable 1', 'Remove Variable 1']) {
			await userEvent.keyboard('{Tab}');
			const action = screen.getByRole('button', { name, exact: true }).element();
			expect(action.matches(':focus')).toBe(true);
			const center = (element: Element) => element.getBoundingClientRect().top + element.getBoundingClientRect().height / 2;
			expect(Math.abs(center(action) - center(firstInput))).toBeLessThanOrEqual(1);
		}
		await userEvent.keyboard('{Tab}');
		expect(screen.getByRole('textbox', { name: 'Value, Variable 2', exact: true }).element().matches(':focus')).toBe(true);
	});
});

describe.each(L2_PRESENTATION_SHAPES)('L2 accessible header and cell names: $name', row => {
	it.each([479, 480])('keeps help separate from names at %ipx', async width => {
		const screen = await render(
			<div style={{ width: `${width}px` }}>
				<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={row.uiSchema} />
			</div>
		);
		await whenAllKelvinReady(screen.container);
		const name = row.name === 'required' ? 'Name, required' : 'Name';
		expect(screen.getByRole('columnheader', { name, exact: true }).element()).toBe(screen.container.querySelectorAll('[role="columnheader"]')[2]);
		for (let index = 0; index < row.formData.length; index++) {
			expect(
				screen
					.getByRole('cell', { name: `${name} Variable ${index + 1}`, exact: true })
					.element()
					.getAttribute('data-table-cell')
			).toBe('name');
			expect(
				screen
					.getByRole('cell', { name: `Value Variable ${index + 1}`, exact: true })
					.element()
					.getAttribute('data-table-cell')
			).toBe('value');
		}
	});
});

describe.each(L2_PRESENTATION_SHAPES.filter(row => row.name === 'description' || row.name === 'help'))('L2 responsive help: $name', row => {
	it.each([479, 480])('keeps the tip visible at %ipx', async width => {
		const screen = await render(
			<div style={{ width: `${width}px` }}>
				<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={row.uiSchema} />
			</div>
		);
		await whenAllKelvinReady(screen.container);
		const headerTip = screen.container.querySelector<HTMLElement>('[role="columnheader"] kv-toggle-tip')!;
		const cellTips = Array.from(screen.container.querySelectorAll<HTMLElement>('[data-table-cell="name"] kv-toggle-tip'));
		if (width < 480) expect(cellTips).toHaveLength(row.formData.length);
		expect(getComputedStyle(headerTip).display === 'none').toBe(width < 480);
		for (const tip of cellTips) expect(tip.checkVisibility({ checkVisibilityCSS: true })).toBe(width < 480);
		const target = width < 480 ? cellTips[0] : headerTip;
		await userEvent.click(target.querySelector('[slot="open-element-slot"]')!);
		await expect
			.poll(() =>
				page
					.getByText('Starts with a letter or underscore.', { exact: true })
					.elements()
					.some(element => element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }))
			)
			.toBe(true);
	});
	it('hides a popup when resizing hides its trigger', async () => {
		const view = (width: number) => (
			<div style={{ width: `${width}px` }}>
				<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={row.uiSchema} />
			</div>
		);
		const screen = await render(view(480));
		await whenAllKelvinReady(screen.container);
		const visibleTips = () =>
			page
				.getByText('Starts with a letter or underscore.', { exact: true })
				.elements()
				.filter(element => element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })).length;
		await userEvent.click(screen.container.querySelector('[role="columnheader"] [slot="open-element-slot"]')!);
		await expect.poll(visibleTips).toBe(1);
		await screen.rerender(view(479));
		await expect.poll(visibleTips).toBe(0);
		await userEvent.click(screen.container.querySelector('[data-table-cell="name"] [slot="open-element-slot"]')!);
		await expect.poll(visibleTips).toBe(1);
		await screen.rerender(view(480));
		await expect.poll(visibleTips).toBe(0);
	});
});

it.each(L2_ITEM_GUIDANCE_SHAPES)('L2 real item guidance: $name', async row => {
	const screen = await render(<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={row.uiSchema} formContext={row.formContext} />);
	await whenAllKelvinReady(screen.container);
	expect(Boolean(screen.container.querySelector('[role="table"]'))).toBe(row.isFlat);
	if (row.message) {
		const tip = screen.container.querySelector('kv-toggle-tip');
		if (tip) await userEvent.click(tip.querySelector('[slot="open-element-slot"]')!);
		await expect
			.poll(() =>
				page
					.getByText(row.message!, { exact: true })
					.elements()
					.some(element => element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }))
			)
			.toBe(true);
	}
	if (row.helper)
		await expect
			.poll(() =>
				page
					.getByText(/^Default: /)
					.elements()
					.some(element => element.checkVisibility({ checkVisibilityCSS: true }))
			)
			.toBe(true);
});

it.each(L2_LABEL_SHAPES)('L2 real configured labels: $name', async row => {
	const screen = await render(
		<div style={{ width: '640px' }}>
			<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={row.uiSchema} />
		</div>
	);
	await whenAllKelvinReady(screen.container);
	expect(Boolean(screen.container.querySelector('[role="table"]'))).toBe(row.isFlat);
	expect(
		page
			.getByText('Name', { exact: true })
			.elements()
			.filter(element => element.checkVisibility({ checkVisibilityCSS: true }))
	).toHaveLength(row.isFlat ? 1 : 0);
});

it('shows the configured default helper in opted-out sections', async () => {
	const row = L2_PRESENTATION_SHAPES.find(row => row.name === 'default helper')!;
	const screen = await render(<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={{ ...row.uiSchema, 'ui:options': { layout: 'sections' } }} />);
	await whenAllKelvinReady(screen.container);
	await expect
		.poll(() =>
			page
				.getByText('Default: LOG_LEVEL', { exact: true })
				.elements()
				.some(element => element.checkVisibility({ checkVisibilityCSS: true }))
		)
		.toBe(true);
});

it.each(L2_DESCRIPTION_SHAPES)('L2 real header description visibility: $name', async row => {
	const screen = await render(<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={row.uiSchema} />);
	await whenAllKelvinReady(screen.container);
	const header = screen.container.querySelectorAll('[role="columnheader"]')[1];
	const tip = header.querySelector('kv-toggle-tip');
	if (!row.expectedTip) expect(tip).toBeNull();
	else {
		await userEvent.click(tip!.querySelector('[slot="open-element-slot"]')!);
		await expect
			.poll(() =>
				page
					.getByText(row.expectedTip!, { exact: true })
					.elements()
					.some(element => element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true }))
			)
			.toBe(true);
	}
});

it.each(ERROR_SHAPES)('L2 browser cell errors: $name', async row => {
	const screen = await render(<KvSchemaForm schema={BROKER_SCHEMA} formData={BROKER_FORM_DATA} extraErrors={row.extraErrors as never} displayErrors />);
	await whenAllKelvinReady(screen.container);
	for (const message of row.messages.filter(message => message.id.includes('_brokers_'))) {
		const host = screen.container.querySelector<HTMLKvTextFieldElement>(`#${message.id}`)!;
		const cell = host.closest('[role="cell"]')!;
		const help = cell.querySelector<HTMLKvFormHelpTextElement>('kv-form-help-text')!;
		expect(help.helpText).toContain(message.message);
		expect(help.getBoundingClientRect().top).toBeGreaterThanOrEqual(host.getBoundingClientRect().bottom);
		expect(host.accessibleDescriptionElements).toContain(help.parentElement);
	}
});

it('keeps cells mounted when their container crosses the breakpoint', async () => {
	const row = FLAT_OBJECT_SHAPES[0];
	const view = (width: number) => (
		<div style={{ width: `${width}px` }}>
			<KvSchemaForm schema={row.schema} formData={row.formData} />
		</div>
	);
	const screen = await render(view(640));
	await whenAllKelvinReady(screen.container);
	const before = controls(rootRows(screen.container)[0]);
	await screen.rerender(view(320));
	const after = controls(rootRows(screen.container)[0]);
	expect(after).toEqual(before);
	expect(after[1].getBoundingClientRect().top).toBeGreaterThan(after[0].getBoundingClientRect().bottom);
});

it.each(L2_ROW_ERROR_SHAPES)('L2 object errors: $name', async row => {
	const shape = FLAT_OBJECT_SHAPES[0];
	// RJSF accepts numeric object keys for array errors; its type also requires array methods.
	const extraErrors = row.extraErrors as unknown as ErrorSchema<typeof shape.formData>;
	const screen = await render(
		<div style={{ width: '640px' }}>
			<KvSchemaForm schema={shape.schema} formData={shape.formData} extraErrors={extraErrors} displayErrors />
		</div>
	);
	await whenAllKelvinReady(screen.container);
	const item = rootRows(screen.container)[1];
	const error = document.getElementById(item.getAttribute('aria-describedby')!)!;
	expect(error.querySelector<HTMLKvFormHelpTextElement>('kv-form-help-text')!.helpText).toContain(row.message);
	expect(error.getBoundingClientRect().top).toBeGreaterThanOrEqual(controls(item)[0].getBoundingClientRect().bottom);
	const input = item.querySelector('kv-text-field')!.shadowRoot!.querySelector('input')!;
	const button = screen.getByRole('button', { name: 'Remove row 2', exact: true }).element();
	expect(
		Math.abs(button.getBoundingClientRect().top + button.getBoundingClientRect().height / 2 - (input.getBoundingClientRect().top + input.getBoundingClientRect().height / 2))
	).toBeLessThanOrEqual(1);
});

it('tabs through inputs, grip and trash before the next row', async () => {
	const row = FLAT_OBJECT_SHAPES[0];
	const screen = await render(<KvSchemaForm schema={row.schema} formData={row.formData} />);
	await whenAllKelvinReady(screen.container);
	const first = screen.getByRole('textbox', { name: 'Name, row 1', exact: true }).element();
	(first as HTMLElement).focus();
	for (const [role, name] of [
		['textbox', 'Value, row 1'],
		['button', 'Reorder row 1'],
		['button', 'Remove row 1'],
		['textbox', 'Name, row 2']
	] as const) {
		await userEvent.keyboard('{Tab}');
		expect(screen.getByRole(role, { name, exact: true }).element().matches(':focus')).toBe(true);
	}
});

it('uses 12px row gaps and centers row actions on their inputs', async () => {
	const row = FLAT_OBJECT_SHAPES[0];
	const screen = await render(
		<div style={{ width: '640px' }}>
			<KvSchemaForm schema={row.schema} formData={row.formData} />
		</div>
	);
	await whenAllKelvinReady(screen.container);
	await document.fonts.ready;
	const rows = rootRows(screen.container);
	expect(rows[1].getBoundingClientRect().top - rows[0].getBoundingClientRect().bottom).toBe(12);
	const host = rows[0].querySelector('kv-text-field')!;
	const nativeInput = host.shadowRoot!.querySelector('input')!;
	const center = (element: Element) => element.getBoundingClientRect().top + element.getBoundingClientRect().height / 2;
	for (const name of ['Reorder row 1', 'Remove row 1'])
		expect(Math.abs(center(screen.getByRole('button', { name, exact: true }).element()) - center(nativeInput))).toBeLessThanOrEqual(1);
});

it.each(R5_ARRAY_ACTIONS.slice(0, 6))('L2 focus after $name', async action => {
	const row = FLAT_OBJECT_SHAPES[0];
	const onChange = vi.fn();
	const screen = await render(<KvSchemaForm schema={{ ...row.schema, maxItems: action.name === 'add at limit' ? 4 : 5 }} formData={row.formData} onChange={onChange} />);
	await whenAllKelvinReady(screen.container);
	onChange.mockClear();
	const index = action.name === 'remove last' ? 2 : 1;
	if (action.action === 'add') {
		const add = screen.container.querySelector('kv-action-button')!;
		add.focus();
		await userEvent.keyboard('{Enter}');
	} else if (action.action === 'remove') {
		await screen.getByRole('button', { name: `Remove row ${index + 1}`, exact: true }).click();
	} else {
		const menu = rootRows(screen.container)[index].querySelector('kv-action-menu')!;
		await menu.setFocus();
		await userEvent.keyboard('{Enter}');
		await expect
			.poll(() =>
				page
					.getByRole('menuitem')
					.elements()
					.some(item => item.matches(':focus'))
			)
			.toBe(true);
		await userEvent.keyboard(action.action === 'move-up' ? '{Enter}' : '{ArrowDown}{Enter}');
	}
	await expect.poll(() => onChange.mock.calls.length).toBe(1);
	const data = onChange.mock.lastCall![0].formData;
	if (action.action === 'add') {
		expect(data).toHaveLength(4);
		if (action.name === 'add at limit') await expect.poll(() => screen.container.querySelector('#root_3_name')?.matches(':focus-within')).toBe(true);
		else await expect.poll(() => screen.container.querySelector('kv-action-button')?.matches(':focus-within')).toBe(true);
	} else {
		const target = action.action === 'remove' ? Math.min(index, 1) : index + (action.action === 'move-up' ? -1 : 1);
		await expect.poll(() => rootRows(screen.container)[target].querySelector('kv-action-menu')?.matches(':focus-within')).toBe(true);
		if (action.action === 'remove') expect(data).toEqual(row.formData.filter((_, position) => position !== index));
		else expect(data[target]).toEqual(row.formData[index]);
	}
});
