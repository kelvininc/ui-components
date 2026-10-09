import { setThemeMode, StyleMode } from '@kelvininc/ui-components';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../test-utils/browser';
import { KvSchemaForm } from './SchemaForm';
import {
	SECTION_LAYOUT_COMPATIBILITY_SHAPES,
	SECTION_LAYOUT_CONNECTORS,
	SECTION_LAYOUT_DEEP,
	SECTION_LAYOUT_NESTED_OPTIONS,
	SECTION_LAYOUT_SHAPES,
	SECTION_LAYOUT_WIDTHS
} from './test-utils/matrix';
import { EApplyDefaults } from './types';

const chooseOption = async (label: string) => {
	const options = () =>
		Array.from(document.querySelectorAll('kv-select-multi-options')).flatMap(host =>
			Array.from(host.shadowRoot?.querySelector('kv-virtualized-list')?.shadowRoot?.querySelectorAll<HTMLKvSelectOptionElement>('kv-select-option') ?? [])
		);
	await expect.poll(() => options().find(option => option.label === label)).toBeDefined();
	const option = options().find(option => option.label === label)!;
	await option.componentOnReady();
	await userEvent.click(option.shadowRoot!.querySelector('[part="option-container"]')!);
};

describe.each(SECTION_LAYOUT_SHAPES)('real section hierarchy: $name', row => {
	it('draws the owned guides and visual heading levels', async () => {
		const screen = await render(
			<div style={{ width: 640 }}>
				<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} />
			</div>
		);
		await whenAllKelvinReady(screen.container);
		await document.fonts.ready;
		const headings = Array.from(screen.container.querySelectorAll('h2,h3,h4,h5,h6')).filter(element => !element.closest('[hidden]'));
		expect(headings.map(element => element.textContent)).toEqual(row.headings.map(heading => heading.title));
		headings.forEach((element, index) => {
			const style = getComputedStyle(element);
			expect([style.fontSize, style.lineHeight, style.fontWeight, style.letterSpacing, style.textTransform]).toEqual([
				row.headings[index].kind === 'major' ? '14px' : '12px',
				row.headings[index].kind === 'major' ? '20px' : '16px',
				'600',
				'1.5px',
				'uppercase'
			]);
		});
		const boundaries = Array.from(screen.container.querySelectorAll<HTMLElement>('[data-schema-form-boundary]'));
		expect(
			boundaries.map(element => ({
				fieldId: element.dataset.schemaFormBoundaryField,
				kind: element.dataset.schemaFormBoundary,
				depth: Number(element.dataset.schemaFormBoundaryDepth)
			}))
		).toEqual(row.boundaries);
		for (const boundary of boundaries.filter(element => element.dataset.schemaFormBoundary !== 'item')) {
			const style = getComputedStyle(boundary);
			expect(style.paddingInlineStart).toBe('16px');
			expect(style.borderInlineStartWidth).toBe('1px');
		}
		for (const object of screen.container.querySelectorAll<HTMLElement>('[data-schema-form-object]')) {
			if (Number(object.dataset.schemaFormSectionLevel) <= 1) continue;
			expect(getComputedStyle(object).rowGap).toBe('20px');
			for (const child of Array.from(object.children).filter(element => element.hasAttribute('data-schema-form-row'))) {
				const style = getComputedStyle(child);
				expect([style.borderTopWidth, style.paddingTop, style.marginTop]).toEqual(['0px', '0px', '0px']);
			}
		}
	});
});

it('keeps nested descriptions, defaults and errors at the control edge through error visibility, Discard and Reset', async () => {
	const defaultData = SECTION_LAYOUT_CONNECTORS.formData.map(connector => ({
		...connector,
		connection: { ...connector.connection, security: { ...connector.connection.security, tls: { ...connector.connection.security.tls, server_name: 'kafka-line-1.internal' } } }
	}));
	const props = {
		...SECTION_LAYOUT_CONNECTORS,
		uiSchema: { ...SECTION_LAYOUT_CONNECTORS.uiSchema, 'ui:submitButtonOptions': { norender: false } },
		schema: { ...SECTION_LAYOUT_CONNECTORS.schema, default: defaultData },
		formContext: { showDefaultValueHelper: true },
		applyDefaults: EApplyDefaults.Never,
		submittedData: SECTION_LAYOUT_CONNECTORS.formData,
		allowDiscardChanges: true,
		allowResetToDefaults: true,
		liveValidate: true,
		showErrorList: false as const
	};
	const screen = await render(
		<div style={{ width: 390 }}>
			<KvSchemaForm {...props} />
		</div>
	);
	await whenAllKelvinReady(screen.container);
	const hostId = '#root_0_connection_security_tls_server_name';
	const checkAlignment = () => {
		const host = screen.container.querySelector(hostId)!;
		const field = host.closest('[data-schema-form-field]')!;
		const texts = Array.from(field.querySelectorAll('kv-form-help-text')).flatMap(helper => Array.from(helper.shadowRoot!.querySelectorAll('.help-text')));
		expect(texts.length).toBeGreaterThan(0);
		for (const text of texts) expect(text.getBoundingClientRect().left).toBeCloseTo(host.getBoundingClientRect().left, 0);
		for (const group of screen.container.querySelectorAll('[role="group"][aria-describedby]')) {
			for (const id of group.getAttribute('aria-describedby')!.split(' ')) expect(screen.container.querySelectorAll(`[id="${id}"]`)).toHaveLength(1);
		}
		const help = texts.map(text => text.textContent);
		expect(help.filter(text => text === 'Default value is: kafka-line-1.internal')).toHaveLength(1);
		return help;
	};
	expect(checkAlignment()).toContain('Hostname expected in the server certificate.');
	await screen.rerender(
		<div style={{ width: 390 }}>
			<KvSchemaForm {...props} displayErrors />
		</div>
	);
	await whenAllKelvinReady(screen.container);
	expect(checkAlignment()).toContain('Must be a valid hostname.');
	await screen.getByRole('textbox', { name: 'Server name', exact: true }).fill('broker-2.internal');
	await screen.getByRole('button', { name: 'Discard changes', exact: true }).click();
	await whenAllKelvinReady(screen.container);
	await expect.element(screen.getByRole('textbox', { name: 'Server name', exact: true })).toHaveValue('kafka_line_1');
	checkAlignment();
	await screen.getByRole('button', { name: 'Reset to defaults', exact: true }).click();
	await whenAllKelvinReady(screen.container);
	await expect.element(screen.getByRole('textbox', { name: 'Server name', exact: true })).toHaveValue('kafka-line-1.internal');
	checkAlignment();
});

it('uses ordinary configured gaps below root page separators', async () => {
	const screen = await render(
		<div style={{ 'width': 640, '--schema-form-fields-y-gap': '28px' } as React.CSSProperties}>
			<KvSchemaForm schema={SECTION_LAYOUT_SHAPES[0].schema} />
		</div>
	);
	await whenAllKelvinReady(screen.container);
	// SchemaForm owns defaults; consumer overrides use its public custom class/cascade.
	const rootObject = screen.container.querySelector('[data-schema-form-object]')!;
	const form = rootObject.closest('form')!.parentElement!;
	form.style.setProperty('--schema-form-fields-y-gap', '28px');
	const nestedObjects = Array.from(screen.container.querySelectorAll<HTMLElement>('[data-schema-form-object]')).slice(1);
	for (const object of nestedObjects) expect(getComputedStyle(object).rowGap).toBe('28px');
	const row = rootObject.querySelector('[data-schema-form-row="connection"]')!;
	expect(getComputedStyle(row).borderTopWidth).toBe('1px');
	for (const object of nestedObjects) for (const child of Array.from(object.children)) expect(getComputedStyle(child).paddingTop).toBe('0px');
});

it('switches dependency sections with the actual port selection', async () => {
	const row = SECTION_LAYOUT_SHAPES.find(shape => shape.name === 'dependency host configuration')!;
	const onChange = vi.fn();
	const screen = await render(<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} onChange={onChange} />);
	await whenAllKelvinReady(screen.container);
	onChange.mockClear();
	const headingId = screen.getByRole('heading', { name: 'Port 1', exact: true }).element().id;
	await screen.getByRole('textbox', { name: 'Port type', exact: true }).click();
	await chooseOption('service');
	await whenAllKelvinReady(screen.container);
	await expect.element(screen.getByRole('heading', { name: 'Service configuration', exact: true })).toBeVisible();
	expect(screen.container.querySelectorAll('[data-schema-form-boundary="section"]')).toHaveLength(1);
	expect(screen.getByRole('heading', { name: 'Port 1', exact: true }).element().id).toBe(headingId);
	expect(onChange.mock.lastCall?.[0].formData).toEqual([{ type: 'service', configuration: { port: 4840 } }]);
});

it.each(['oneOf', 'anyOf'])('switches %s geometry without duplicate branch boundaries', async keyword => {
	const row = SECTION_LAYOUT_SHAPES.find(shape => shape.name === `${keyword} object and deeper section`)!;
	const onChange = vi.fn();
	const screen = await render(<KvSchemaForm schema={row.schema} uiSchema={row.uiSchema} formData={row.formData} onChange={onChange} />);
	await whenAllKelvinReady(screen.container);
	const rootHeadingId = screen.getByRole('heading', { name: 'Plant', exact: true }).element().id;
	await screen.getByRole('textbox', { name: 'Authentication', exact: true }).click();
	await chooseOption('Secret reference');
	await whenAllKelvinReady(screen.container);
	expect(screen.container.querySelectorAll('[data-schema-form-boundary="option"]')).toHaveLength(1);
	expect(screen.container.querySelector('[data-schema-form-boundary="section"]')).toBeNull();
	expect(screen.getByRole('heading', { name: 'Plant', exact: true }).element().id).toBe(rootHeadingId);
	await screen.getByRole('textbox', { name: 'Authentication', exact: true }).click();
	await chooseOption('Broker credentials');
	await whenAllKelvinReady(screen.container);
	expect(screen.container.querySelectorAll('[data-schema-form-boundary="option"]')).toHaveLength(1);
	expect(screen.container.querySelectorAll('[data-schema-form-boundary="section"]')).toHaveLength(1);
	expect(onChange).toHaveBeenCalled();
});

describe.each([StyleMode.Light, StyleMode.Night])('entry frames and capped padding in %s', theme => {
	it.each(SECTION_LAYOUT_WIDTHS)('uses the actual %ipx form width', async width => {
		setThemeMode(theme);
		try {
			const screen = await render(
				<div style={{ width }}>
					<KvSchemaForm {...SECTION_LAYOUT_DEEP} applyDefaults={EApplyDefaults.Never} displayErrors />
				</div>
			);
			await whenAllKelvinReady(screen.container);
			await document.fonts.ready;
			const boundaries = Array.from(screen.container.querySelectorAll<HTMLElement>('[data-schema-form-boundary]'));
			expect(new Set(boundaries.map(boundary => Number(boundary.dataset.schemaFormBoundaryDepth)))).toEqual(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]));
			const probe = document.createElement('span');
			probe.style.color = 'var(--border-container-impact-neutral-default)';
			screen.container.append(probe);
			const frameColor = getComputedStyle(probe).color;
			probe.remove();
			for (const boundary of boundaries) {
				const depth = Number(boundary.dataset.schemaFormBoundaryDepth);
				const capped = width < 480 && depth > 6;
				const style = getComputedStyle(boundary);
				expect(boundary.dataset.schemaFormNarrowInset).toBe(depth > 6 ? 'capped' : undefined);
				if (boundary.dataset.schemaFormBoundary === 'item') {
					expect([style.borderTopWidth, style.borderRightWidth, style.borderBottomWidth, style.borderLeftWidth]).toEqual(['1px', '1px', '1px', '1px']);
					expect([style.borderTopColor, style.borderRightColor, style.borderBottomColor, style.borderLeftColor]).toEqual([
						frameColor,
						frameColor,
						frameColor,
						frameColor
					]);
					expect([style.borderRadius, style.paddingTop, style.paddingBottom]).toEqual(['4px', '16px', '16px']);
					expect([style.paddingInlineStart, style.paddingInlineEnd]).toEqual([capped ? '0px' : '16px', capped ? '0px' : '16px']);
				} else {
					expect(style.paddingInlineStart).toBe(capped ? '0px' : width < 480 ? '8px' : '16px');
					expect(style.borderInlineStartWidth).toBe('1px');
				}
				expect(boundary.scrollWidth).toBeLessThanOrEqual(boundary.clientWidth + 1);
			}
			for (const list of screen.container.querySelectorAll<HTMLElement>('[data-schema-form-list]')) {
				const items = Array.from(list.querySelectorAll<HTMLElement>('[data-schema-form-list-item]')).filter(item => item.closest('[data-schema-form-list]') === list);
				if (items.length > 1) expect(items[1].getBoundingClientRect().top - items[0].getBoundingClientRect().bottom).toBeCloseTo(12, 0);
				const add = Array.from(list.querySelectorAll('kv-action-button')).find(button => button.closest('[data-schema-form-list]') === list);
				expect(add).toBeDefined();
				expect(add!.getBoundingClientRect().left - items[0].getBoundingClientRect().left).toBeCloseTo(0, 0);
				for (const menu of items.flatMap(item => Array.from(item.querySelectorAll('kv-action-menu')))) {
					expect(menu.getBoundingClientRect().right).toBeLessThanOrEqual(list.getBoundingClientRect().right + 1);
				}
			}
		} finally {
			setThemeMode(StyleMode.Night);
		}
	});
});

describe.each(SECTION_LAYOUT_COMPATIBILITY_SHAPES)('section compatibility: $name', row => {
	it('retains caller layouts and independent table queries', async () => {
		const width = row.name.startsWith('nested table') ? 640 : 390;
		const screen = await render(
			<div style={{ width }}>
				<KvSchemaForm
					schema={row.schema}
					uiSchema={row.uiSchema}
					formData={row.formData}
					templates={'templates' in row ? row.templates : undefined}
					applyDefaults={EApplyDefaults.Never}
				/>
			</div>
		);
		await whenAllKelvinReady(screen.container);
		if (row.name.startsWith('custom root') || row.name.startsWith('tuple object')) {
			const object = screen.container.querySelector<HTMLElement>('[data-schema-form-object]')!;
			const container = object.closest('form')!.parentElement!;
			container.style.setProperty('--schema-form-fields-y-gap', '28px');
			container.style.setProperty('--schema-form-sections-y-gap', '40px');
			expect(getComputedStyle(object).rowGap).toBe('28px');
			const customRoot = row.name.startsWith('custom root');
			const qualifyingRows = Array.from(object.children).filter(element => ['connection', 'audit'].includes(element.getAttribute('data-schema-form-row')!));
			expect(qualifyingRows).toHaveLength(2);
			for (const child of qualifyingRows) {
				const style = getComputedStyle(child);
				expect([style.borderTopWidth, style.paddingTop, style.marginTop]).toEqual(customRoot ? ['1px', '40px', '12px'] : ['0px', '0px', '0px']);
			}
			if (customRoot) expect(getComputedStyle(screen.container.querySelector('[data-custom-section-body]')!).paddingInlineStart).toBe('24px');
			else expect(object.closest('[data-schema-form-boundary="item"]')).not.toBeNull();
			return;
		}
		if (row.name.startsWith('nested table')) {
			const table = screen.container.querySelector<HTMLElement>('[data-schema-form-list]')!;
			const controls = Array.from(table.querySelectorAll('kv-text-field'));
			expect(controls).toHaveLength(2);
			const guide = table.closest<HTMLElement>('[data-schema-form-boundary]')!;
			expect(getComputedStyle(guide).paddingInlineStart).toBe('16px');
			expect(table.getBoundingClientRect().width).toBeCloseTo(479, 0);
			expect(controls[1].getBoundingClientRect().top).toBeGreaterThan(controls[0].getBoundingClientRect().bottom);
			expect(table.querySelector('[data-schema-form-boundary="item"]')).toBeNull();
			await screen.rerender(
				<div style={{ width }}>
					<KvSchemaForm schema={row.schema} uiSchema={{ connection: { 'ui:options': { inputWidth: '497px' } } }} formData={row.formData} />
				</div>
			);
			await whenAllKelvinReady(screen.container);
			expect(table.getBoundingClientRect().width).toBeCloseTo(480, 0);
			expect(controls[1].getBoundingClientRect().top).toBeCloseTo(controls[0].getBoundingClientRect().top, 0);
			const resizedControls = Array.from(table.querySelectorAll('kv-text-field'));
			expect(resizedControls).toHaveLength(controls.length);
			resizedControls.forEach((control, index) => expect(control).toBe(controls[index]));
			return;
		}
		const item = screen.container.querySelector<HTMLElement>('[data-schema-form-boundary="item"]');
		if (row.name.startsWith('custom item')) {
			expect(item).toBeNull();
			expect(getComputedStyle(screen.container.querySelector('[data-custom-section-item]')!).paddingInlineStart).toBe('24px');
			return;
		}
		expect(item?.dataset.schemaFormBoundaryDepth).toBe('7');
		if (row.name.startsWith('deep fieldset')) {
			const style = getComputedStyle(item!);
			expect([style.paddingInlineStart, style.paddingInlineEnd, style.paddingBottom]).toEqual(['12px', '12px', '12px']);
			const header = item!.querySelector('[data-schema-form-item-header]')!;
			expect(getComputedStyle(header).transform).not.toBe('none');
			expect(getComputedStyle(header).marginBottom).toBe('-16px');
		} else {
			expect(getComputedStyle(screen.container.querySelector('[data-custom-section-body]')!).paddingInlineStart).toBe('24px');
		}
		const child = item!.querySelector<HTMLElement>('[data-schema-form-boundary="section"]')!;
		expect(child.dataset.schemaFormBoundaryDepth).toBe('8');
		expect(getComputedStyle(child).paddingInlineStart).toBe('0px');
	});
});

describe.each(SECTION_LAYOUT_NESTED_OPTIONS)('nested option ownership: $name', row => {
	it.each([StyleMode.Light, StyleMode.Night].flatMap(theme => [390, 480].map(width => ({ theme, width }))))(
		'counts and caps each guide at $width px in $theme',
		async ({ theme, width }) => {
			setThemeMode(theme);
			try {
				const screen = await render(
					<div style={{ width }}>
						<KvSchemaForm schema={row.schema} formData={row.formData} applyDefaults={EApplyDefaults.Never} />
					</div>
				);
				await whenAllKelvinReady(screen.container);
				const branches = Array.from(screen.container.querySelectorAll<HTMLElement>('[data-schema-form-option-branch]'));
				expect(branches).toHaveLength(8);
				expect(branches.map(branch => branch.dataset.schemaFormBoundaryDepth)).toEqual(['1', '2', '3', '4', '5', '6', '7', '8']);
				const boundaries = Array.from(screen.container.querySelectorAll<HTMLElement>('[data-schema-form-boundary]'));
				expect(
					boundaries.map(element => ({
						fieldId: element.dataset.schemaFormBoundaryField,
						kind: element.dataset.schemaFormBoundary,
						depth: Number(element.dataset.schemaFormBoundaryDepth)
					}))
				).toEqual(row.boundaries);
				for (const boundary of boundaries) {
					const depth = Number(boundary.dataset.schemaFormBoundaryDepth);
					const style = getComputedStyle(boundary);
					expect(style.borderInlineStartWidth).toBe('1px');
					expect(style.paddingInlineStart).toBe(width < 480 ? (depth > 6 ? '0px' : '8px') : '16px');
					expect(boundary.scrollWidth).toBeLessThanOrEqual(boundary.clientWidth + 1);
				}
			} finally {
				setThemeMode(StyleMode.Night);
			}
		}
	);
});

it.each([StyleMode.Light, StyleMode.Night])('uses the divider token and logical guides in %s and RTL', async theme => {
	setThemeMode(theme);
	try {
		const row = SECTION_LAYOUT_SHAPES[0];
		const screen = await render(
			<div dir="rtl" style={{ width: 640 }}>
				<KvSchemaForm schema={row.schema} />
			</div>
		);
		await whenAllKelvinReady(screen.container);
		const boundary = screen.container.querySelector<HTMLElement>('[data-schema-form-boundary="section"]')!;
		expect(boundary).not.toBeNull();
		const probe = document.createElement('span');
		probe.style.color = 'var(--border-container-divider-default)';
		boundary.append(probe);
		try {
			expect(getComputedStyle(boundary).borderRightColor).toBe(getComputedStyle(probe).color);
		} finally {
			probe.remove();
		}
		const style = getComputedStyle(boundary);
		expect([style.borderRightWidth, style.borderLeftWidth, style.paddingRight, style.paddingLeft]).toEqual(['1px', '0px', '16px', '0px']);
		const heading = boundary.querySelector('h2,h3,h4,h5,h6')!;
		expect(boundary.getBoundingClientRect().right - heading.getBoundingClientRect().right).toBeCloseTo(17, 0);
	} finally {
		setThemeMode(StyleMode.Night);
	}
});

it('wraps long entry headings beside an inline-end menu in RTL', async () => {
	const row = SECTION_LAYOUT_SHAPES.find(shape => shape.name === 'outer and inner object entries')!;
	const screen = await render(
		<div dir="rtl" style={{ width: 320 }}>
			<KvSchemaForm
				schema={row.schema}
				uiSchema={{
					...row.uiSchema,
					'ui:itemPrefix': 'Failover broker connector for the production packaging line'
				}}
				formData={row.formData}
			/>
		</div>
	);
	await whenAllKelvinReady(screen.container);
	await document.fonts.ready;
	const item = screen.container.querySelector<HTMLElement>('[data-schema-form-boundary="item"]')!;
	const header = item.querySelector('[data-schema-form-item-header]')!;
	const menu = header.querySelector('kv-action-menu')!;
	const heading = header.querySelector('h2,h3,h4,h5,h6')!;
	const headingBox = heading.getBoundingClientRect();
	const menuBox = menu.getBoundingClientRect();
	expect(headingBox.height).toBeGreaterThan(20);
	expect(headingBox.left).toBeGreaterThanOrEqual(menuBox.right);
	expect(menuBox.left - item.getBoundingClientRect().left).toBeCloseTo(17, 0);
	expect(headingBox.right).toBeCloseTo(item.getBoundingClientRect().right - 17, 0);
	expect(menuBox.top + menuBox.height / 2).toBeCloseTo(headingBox.top + headingBox.height / 2, 0);
	expect(item.scrollWidth).toBeLessThanOrEqual(item.clientWidth + 1);
});

it('keeps additional-property key controls inside their section guide', async () => {
	const row = SECTION_LAYOUT_SHAPES.find(shape => shape.name === 'additional property object')!;
	const screen = await render(
		<div style={{ width: 390 }}>
			<KvSchemaForm schema={row.schema} formData={row.formData} />
		</div>
	);
	await whenAllKelvinReady(screen.container);
	const guide = screen.container.querySelector<HTMLElement>('[data-schema-form-boundary-field="root_connections_primary"]')!;
	const key = screen.getByRole('textbox', { name: 'primary Key', exact: true }).element();
	const keyHost = screen.container.querySelector('#root_connections_primary-key')!;
	expect(guide.contains(keyHost)).toBe(true);
	expect(keyHost.getBoundingClientRect().left).toBeCloseTo(guide.getBoundingClientRect().left + 9, 0);
	expect(key.getBoundingClientRect().left).toBeGreaterThan(keyHost.getBoundingClientRect().left);
	for (const host of guide.querySelectorAll('kv-text-field,kv-action-button-icon')) {
		expect(host.getBoundingClientRect().right).toBeLessThanOrEqual(guide.getBoundingClientRect().right + 1);
	}
});
