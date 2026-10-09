import React from 'react';
import { describe, expect, it } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { whenAllKelvinReady } from '../../test-utils/browser';
import { KvSchemaForm } from './SchemaForm';
import {
	ARRAY_SHAPES,
	FOCUS_EDITING_FLAGS,
	L1_HIDDEN_ITEM_WIDGETS,
	L1_ITEM_FIELD_COMPONENTS,
	L1_ARRAY_TEMPLATE_SHAPES,
	R5_ARRAY_ACTIONS,
	R5_ENTRY_WIDGETS,
	R5_FALLBACK_SHAPES,
	R5_FOCUS_CANCELLATIONS,
	R5_FOCUS_ARRAY_SHAPES,
	R5_PROPERTY_SHAPES,
	R5_PROPERTY_TEMPLATES,
	R5_ADD_LIMITS,
	NESTED_SECTION_ACTION_SHAPES
} from './test-utils/matrix';
import { RJSFSchema } from '@rjsf/utils';
import { vi } from 'vitest';
import { EApplyDefaults } from './types';

const itemsOf = (container: HTMLElement) => Array.from(container.querySelectorAll<HTMLElement>('[data-schema-form-list="root"] > div > div > [data-schema-form-list-item]'));
const menuOf = (item: HTMLElement) => Array.from(item.querySelectorAll('kv-action-menu')).find(menu => menu.closest('[data-schema-form-list-item]') === item)!;

const innerListOf = (container: HTMLElement, index = 0) =>
	container.querySelector<HTMLElement>(`[data-schema-form-list="root_${index}_connection_security_tls_client_identities"]`)!;
const ownItems = (list: HTMLElement) =>
	Array.from(list.querySelectorAll<HTMLElement>('[data-schema-form-list-item]')).filter(item => item.closest('[data-schema-form-list]') === list);
const ownAdd = (list: HTMLElement) => Array.from(list.querySelectorAll('kv-action-button')).find(button => button.closest('[data-schema-form-list]') === list)!;
const selectAction = async (item: HTMLElement, name: string) => {
	await page
		.elementLocator(item)
		.getByRole('button', { name: menuOf(item).accessibleLabel, exact: true })
		.click();
	await page.getByRole('menuitem', { name, exact: true }).click();
};

describe.each(NESTED_SECTION_ACTION_SHAPES.filter(row => row.count === 3))('nested entries: $name', row => {
	it('adds only to the selected inner list and keeps its own focus destination', async () => {
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm {...row} applyDefaults={EApplyDefaults.Never} displayErrors onChange={onChange} />);
		await whenAllKelvinReady(screen.container);
		onChange.mockClear();
		const inner = innerListOf(screen.container);
		const add = ownAdd(inner);
		await page.elementLocator(inner).getByRole('button', { name: 'Add Identity', exact: true }).click();
		await expect.poll(() => onChange.mock.calls.length).toBe(1);
		const first = row.formData[0];
		expect(onChange.mock.lastCall?.[0].formData).toEqual([
			{
				...first,
				connection: {
					security: {
						tls: {
							client_identities: [...first.connection.security.tls.client_identities, {}]
						}
					}
				}
			},
			row.formData[1]
		]);
		if (row.addStays) await expect.poll(() => add.matches(':focus-within')).toBe(true);
		else {
			expect(ownAdd(inner)).toBeUndefined();
			await expect.poll(() => ownItems(inner)[3].querySelector('kv-text-field')?.matches(':focus-within')).toBe(true);
		}
	});
});

describe.each(['Move up', 'Move down', 'Remove Identity 2'])('nested %s', action => {
	it('changes only the selected connector and focuses that list', async () => {
		const row = NESTED_SECTION_ACTION_SHAPES[0];
		const onChange = vi.fn();
		const screen = await render(<KvSchemaForm {...row} applyDefaults={EApplyDefaults.Never} onChange={onChange} />);
		await whenAllKelvinReady(screen.container);
		onChange.mockClear();
		const inner = innerListOf(screen.container);
		const before = ownItems(inner);
		const host = before[1].querySelector('kv-text-field');
		await selectAction(before[1], action);
		await expect.poll(() => onChange.mock.calls.length).toBe(1);
		const identities = row.formData[0].connection.security.tls.client_identities;
		const order = action === 'Move up' ? [1, 0, 2] : action === 'Move down' ? [0, 2, 1] : [0, 2];
		expect(onChange.mock.lastCall?.[0].formData).toEqual([
			{ ...row.formData[0], connection: { security: { tls: { client_identities: order.map(index => identities[index]) } } } },
			row.formData[1]
		]);
		const destination = ownItems(inner)[action === 'Move up' ? 0 : action === 'Move down' ? 2 : 1];
		await expect.poll(() => menuOf(destination).matches(':focus-within')).toBe(true);
		expect(menuOf(itemsOf(screen.container)[0]).matches(':focus-within')).toBe(false);
		if (!action.startsWith('Remove')) expect(destination.querySelector('kv-text-field')).toBe(host);
	});
});

it('removing the last inner entry reports minItems and focuses inner Add', async () => {
	const row = NESTED_SECTION_ACTION_SHAPES[2];
	const onChange = vi.fn();
	const screen = await render(<KvSchemaForm {...row} applyDefaults={EApplyDefaults.Never} displayErrors liveValidate onChange={onChange} showErrorList={false} />);
	await whenAllKelvinReady(screen.container);
	onChange.mockClear();
	const inner = innerListOf(screen.container);
	await selectAction(ownItems(inner)[0], 'Remove Identity 1');
	await expect.poll(() => onChange.mock.calls.length).toBe(1);
	expect(onChange.mock.lastCall?.[0].formData).toEqual([{ ...row.formData[0], connection: { security: { tls: { client_identities: [] } } } }, row.formData[1]]);
	expect(ownItems(inner)).toHaveLength(0);
	await expect.poll(() => ownAdd(inner).matches(':focus-within')).toBe(true);
	await expect.element(page.elementLocator(inner.parentElement!.parentElement!).getByText('Must have at least 1 item.', { exact: true })).toBeVisible();
});

it('moves an outer entry with the same nested hosts and its outer action focus', async () => {
	const row = NESTED_SECTION_ACTION_SHAPES[0];
	const onChange = vi.fn();
	const screen = await render(<KvSchemaForm {...row} applyDefaults={EApplyDefaults.Never} onChange={onChange} />);
	await whenAllKelvinReady(screen.container);
	onChange.mockClear();
	const inner = innerListOf(screen.container);
	const hosts = Array.from(inner.querySelectorAll('kv-text-field'));
	await selectAction(itemsOf(screen.container)[0], 'Move down');
	await expect.poll(() => onChange.mock.calls.length).toBe(1);
	expect(onChange.mock.lastCall?.[0].formData).toEqual([row.formData[1], row.formData[0]]);
	const moved = itemsOf(screen.container)[1];
	expect(innerListOf(screen.container, 1)).toBe(inner);
	const movedHosts = Array.from(inner.querySelectorAll('kv-text-field'));
	expect(movedHosts).toHaveLength(hosts.length);
	movedHosts.forEach((host, index) => expect(host).toBe(hosts[index]));
	await expect.poll(() => menuOf(moved).matches(':focus-within')).toBe(true);
	expect(menuOf(ownItems(inner)[0]).matches(':focus-within')).toBe(false);
});

it('tabs through inner actions and fields to inner Add and the next outer entry', async () => {
	const row = NESTED_SECTION_ACTION_SHAPES[0];
	const screen = await render(<KvSchemaForm {...row} applyDefaults={EApplyDefaults.Never} />);
	await whenAllKelvinReady(screen.container);
	const inner = innerListOf(screen.container);
	const items = ownItems(inner);
	await menuOf(items[0]).setFocus();
	for (let index = 0; index < items.length; index++) {
		await userEvent.tab();
		await expect.poll(() => items[index].querySelector('kv-text-field')?.matches(':focus-within')).toBe(true);
		await userEvent.tab();
		if (index < items.length - 1) await expect.poll(() => menuOf(items[index + 1]).matches(':focus-within')).toBe(true);
	}
	await expect.poll(() => ownAdd(inner).matches(':focus-within')).toBe(true);
	await userEvent.tab();
	await expect.poll(() => menuOf(itemsOf(screen.container)[1]).matches(':focus-within')).toBe(true);
});

it.each(FOCUS_EDITING_FLAGS.filter(flags => !flags.focused))('keeps nested actions disabled with $name', async flags => {
	const row = NESTED_SECTION_ACTION_SHAPES[0];
	const onChange = vi.fn();
	const screen = await render(<KvSchemaForm {...row} disabled={flags.disabled} readonly={flags.readonly} onChange={onChange} />);
	await whenAllKelvinReady(screen.container);
	onChange.mockClear();
	const inner = innerListOf(screen.container);
	const scope = page.elementLocator(inner);
	await expect.element(scope.getByRole('button', { name: 'Actions for Identity 1', exact: true })).toBeDisabled();
	await expect.element(scope.getByRole('button', { name: 'Add Identity', exact: true })).toBeDisabled();
	await menuOf(ownItems(inner)[0]).setFocus();
	await userEvent.keyboard('{Enter}');
	expect(onChange).not.toHaveBeenCalled();
});

describe.each(R5_FOCUS_ARRAY_SHAPES)('R5 keyboard focus: $name', row => {
	describe.each(R5_ARRAY_ACTIONS.slice(0, 6))('$name', action => {
		it.each(FOCUS_EDITING_FLAGS)('restores focus when $name', async flags => {
			const adding = action.action === 'add';
			const maxItems = row.formData.length + (action.name === 'add at limit' ? 1 : 2);
			const schema = { ...row.schema, maxItems };
			const readonly = flags.readonly || Boolean(row.uiSchema?.['ui:readonly']);
			const inactive = flags.disabled || readonly;
			const onChange = vi.fn();
			const screen = await render(
				<div>
					<button>After form</button>
					<KvSchemaForm schema={schema} formData={row.formData} uiSchema={row.uiSchema} disabled={flags.disabled} readonly={readonly} onChange={onChange} />
				</div>
			);
			await whenAllKelvinReady(screen.container);
			onChange.mockClear();
			const before = itemsOf(screen.container);
			const index = action.action === 'remove' ? (action.name === 'remove last' ? before.length - 1 : row.fixed + 1) : row.fixed + 1;
			const item = before[index];
			const menu = adding ? null : menuOf(item);
			const remove =
				!adding && !menu?.accessibleLabel.startsWith('Actions for')
					? Array.from(item.querySelectorAll('kv-action-button-icon')).find(host => !host.closest('kv-action-menu'))!
					: null;
			const add = screen.container.querySelector<HTMLKvActionButtonElement>(
				'[data-schema-form-list="root"] > div > div > kv-action-button, [data-schema-form-list="root"] > div > div > div > kv-action-button'
			);
			if (inactive) {
				const target = adding
					? screen.getByRole('button', { name: add!.accessibleLabel, exact: true })
					: screen.getByRole('button', { name: action.action === 'remove' && remove ? remove.accessibleLabel : menu!.accessibleLabel, exact: true });
				await expect.element(target).toBeDisabled();
				await screen.getByRole('button', { name: 'After form', exact: true }).click();
				(target.element() as HTMLElement).focus();
				await userEvent.keyboard('{Enter}');
				expect(onChange).not.toHaveBeenCalled();
				return;
			}
			if (adding) {
				add!.focus();
				await userEvent.keyboard('{Enter}');
			} else if (action.action === 'remove' && remove) {
				remove.focus();
				await userEvent.keyboard('{Enter}');
			} else {
				await menu!.setFocus();
				await userEvent.keyboard('{Enter}');
				await expect.element(page.getByRole('menu')).toBeVisible();
				await expect
					.poll(() =>
						page
							.getByRole('menuitem')
							.elements()
							.some(element => element.matches(':focus'))
					)
					.toBe(true);
				await userEvent.keyboard(action.action === 'remove' ? '{End}{Enter}' : action.action === 'move-down' ? '{ArrowDown}{Enter}' : '{Enter}');
			}
			await expect.poll(() => onChange.mock.calls.length).toBe(1);
			const after = itemsOf(screen.container);
			if (adding && action.name === 'add below limit') await expect.poll(() => add!.matches(':focus-within')).toBe(true);
			else if (adding) {
				await expect
					.poll(
						() =>
							after[after.length - 1].querySelector('#root_' + (after.length - 1))?.matches(':focus-within') ||
							after[after.length - 1].querySelector('kv-text-field')?.matches(':focus-within')
					)
					.toBe(true);
			} else {
				const nextIndex = action.action === 'remove' ? Math.min(index, after.length - 1) : index + (action.action === 'move-up' ? -1 : 1);
				await expect.poll(() => menuOf(after[nextIndex]).matches(':focus-within')).toBe(true);
			}
			expect(screen.container.querySelector('[tabindex="-1"][role="group"]')).toBeNull();
		});
	});
});

describe.each(R5_FOCUS_CANCELLATIONS)('R5 cancellation during menu trigger readiness: %s', cancellation => {
	it('preserves the later focus destination', async () => {
		const row = ARRAY_SHAPES[0];
		const onChange = vi.fn();
		const view = (readonly = false, mounted = true) => (
			<div>
				{mounted && <KvSchemaForm schema={row.schema} formData={row.formData} readonly={readonly} onChange={onChange} />}
				<button>After form</button>
			</div>
		);
		const screen = await render(view());
		await whenAllKelvinReady(screen.container);
		const menu = menuOf(itemsOf(screen.container)[1]);
		await menu.setFocus();
		await userEvent.keyboard('{Enter}');
		await expect
			.poll(() =>
				page
					.getByRole('menuitem')
					.elements()
					.some(element => element.matches(':focus'))
			)
			.toBe(true);
		const trigger = menu.querySelector('kv-action-button-icon')!;
		const prototype = Object.getPrototypeOf(trigger);
		const original = prototype.componentOnReady;
		let release!: () => void;
		let entered = false;
		const gate = new Promise<void>(resolve => (release = resolve));
		prototype.componentOnReady = function (this: HTMLKvActionButtonIconElement) {
			return original.call(this).then(async () => {
				entered = true;
				await gate;
				return this;
			});
		};
		try {
			await userEvent.keyboard('{ArrowDown}{Enter}');
			await expect.poll(() => entered).toBe(true);
			await expect.poll(() => onChange.mock.calls.length).toBe(1);
			if (cancellation === 'readonly') await screen.rerender(view(true));
			if (cancellation === 'unmounted') await screen.rerender(view(false, false));
			await screen.getByRole('button', { name: 'After form', exact: true }).click();
			release();
			await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
			expect(document.activeElement).toBe(screen.getByRole('button', { name: 'After form', exact: true }).element());
			expect(screen.container.querySelector('[tabindex="-1"][role="group"]')).toBeNull();
		} finally {
			release();
			prototype.componentOnReady = original;
		}
	});
});

describe.each([false, true])('R5 nested arrays with custom inner template=%s', custom => {
	it('moves the outer item without remounting its nested array or targeting inner actions', async () => {
		const row = ARRAY_SHAPES[7];
		const onChange = vi.fn();
		const uiSchema = custom ? { items: { tags: { 'ui:ArrayFieldTemplate': L1_ARRAY_TEMPLATE_SHAPES[0].ArrayTemplate } } } : undefined;
		const screen = await render(<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={uiSchema} onChange={onChange} />);
		await whenAllKelvinReady(screen.container);
		const originalList = itemsOf(screen.container)[1].querySelector('[data-schema-form-list]')!;
		const originalInput = itemsOf(screen.container)[1].querySelector('kv-text-field[id="root_1_tags_1"]')!;
		const menu = menuOf(itemsOf(screen.container)[1]);
		await menu.setFocus();
		await userEvent.keyboard('{Enter}');
		await expect
			.poll(() =>
				page
					.getByRole('menuitem')
					.elements()
					.some(element => element.matches(':focus'))
			)
			.toBe(true);
		await userEvent.keyboard('{ArrowDown}{Enter}');
		await expect.poll(() => onChange.mock.calls.length).toBe(1);
		expect(onChange.mock.lastCall?.[0].formData).toEqual([row.formData[0], row.formData[2], row.formData[1]]);
		const moved = itemsOf(screen.container)[2];
		if (!custom) expect(moved.querySelector('[data-schema-form-list]')).toBe(originalList);
		expect(moved.querySelector('kv-text-field[id="root_2_tags_1"]')).toBe(originalInput);
		await expect.poll(() => menuOf(moved).matches(':focus-within')).toBe(true);
	});
});

describe.each(R5_ENTRY_WIDGETS)('R5 last add into $name', row => {
	it('focuses the registered editable control through its public API', async () => {
		const screen = await render(
			<KvSchemaForm schema={{ type: 'array', title: 'Connections', maxItems: 1, items: row.schema }} formData={[]} uiSchema={{ items: row.uiSchema }} />
		);
		await whenAllKelvinReady(screen.container);
		(screen.getByRole('button', { name: 'Add item to Connections', exact: true }).element() as HTMLElement).focus();
		await userEvent.keyboard('{Enter}');
		await expect.poll(() => itemsOf(screen.container)[0]?.querySelector(row.selector)?.matches(':focus-within')).toBe(true);
	});
});

describe.each(R5_FALLBACK_SHAPES)('R5 fallback: $name', row => {
	it('uses a named item action or a temporary named group', async () => {
		const screen = await render(
			<div>
				<KvSchemaForm schema={{ ...row.schema, maxItems: 1 }} formData={[]} uiSchema={row.uiSchema} />
				<button>After list</button>
			</div>
		);
		await whenAllKelvinReady(screen.container);
		const add = screen.container.querySelector<HTMLKvActionButtonElement>('kv-action-button')!;
		add.focus();
		await userEvent.keyboard('{Enter}');
		const item = () => itemsOf(screen.container)[0];
		if (row.itemTarget) await expect.poll(() => menuOf(item())?.matches(':focus-within')).toBe(true);
		else {
			await expect.poll(() => item()?.matches(':focus')).toBe(true);
			expect(item().getAttribute('aria-label')).toBe('Broker 1');
			expect(item().getAttribute('role')).toBe('group');
			await screen.getByRole('button', { name: 'After list', exact: true }).click();
			expect(item().hasAttribute('tabindex')).toBe(false);
			expect(item().hasAttribute('role')).toBe(false);
		}
	});
});

describe.each([true, false])('R5 final removal with Add=%s', addable => {
	it('focuses Add or a named temporary list', async () => {
		const row = ARRAY_SHAPES[6];
		const screen = await render(
			<div>
				<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={{ 'ui:options': { addable } }} />
				<button>After list</button>
			</div>
		);
		await whenAllKelvinReady(screen.container);
		(screen.getByRole('button', { name: 'Remove Topic 1', exact: true }).element() as HTMLElement).focus();
		await userEvent.keyboard('{Enter}');
		await expect.poll(() => itemsOf(screen.container).length).toBe(0);
		if (addable) await expect.poll(() => screen.container.querySelector('kv-action-button')?.matches(':focus-within')).toBe(true);
		else {
			const list = screen.container.querySelector<HTMLElement>('[data-schema-form-list="root"] > div > div')!;
			await expect.poll(() => list.matches(':focus')).toBe(true);
			expect(list.getAttribute('aria-label')).toBe('Topics');
			await screen.getByRole('button', { name: 'After list', exact: true }).click();
			expect(list.hasAttribute('tabindex')).toBe(false);
		}
	});
});

describe.each(L1_HIDDEN_ITEM_WIDGETS.filter(row => row.name.includes('tuple')))('R5 last tuple additional removal: $name', ({ row, uiSchema }) => {
	it('returns to Add instead of an actionless fixed position', async () => {
		const fixed = (row.schema.items as RJSFSchema[]).length;
		const screen = await render(<KvSchemaForm schema={row.schema} formData={row.formData.slice(0, fixed + 1)} uiSchema={uiSchema} />);
		await whenAllKelvinReady(screen.container);
		const remove = Array.from(itemsOf(screen.container)[fixed].querySelectorAll('kv-action-button-icon')).find(host => !host.closest('kv-action-menu'))!;
		remove.focus();
		await userEvent.keyboard('{Enter}');
		await expect.poll(() => itemsOf(screen.container).length).toBe(fixed);
		await expect.poll(() => screen.container.querySelector('[data-schema-form-list="root"] > div > div > div > kv-action-button')?.matches(':focus-within')).toBe(true);
	});
});

describe.each(L1_ITEM_FIELD_COMPONENTS)('R5 custom item fallback: $name', row => {
	it('keeps the custom field and focuses the new item action', async () => {
		const screen = await render(<KvSchemaForm schema={{ ...ARRAY_SHAPES[0].schema, maxItems: 1 }} formData={[]} fields={{ ArraySchemaField: row.ItemField }} />);
		await whenAllKelvinReady(screen.container);
		screen.container.querySelector<HTMLKvActionButtonElement>('kv-action-button')!.focus();
		await userEvent.keyboard('{Enter}');
		await expect.poll(() => menuOf(itemsOf(screen.container)[0])?.matches(':focus-within')).toBe(true);
		expect(itemsOf(screen.container)[0].querySelector('input')).not.toBeNull();
	});
});

describe.each(R5_PROPERTY_SHAPES)('R5 additional property focus: $name', row => {
	describe.each(R5_PROPERTY_TEMPLATES)('$name', layout => {
		describe.each(R5_ADD_LIMITS)('$name', limit => {
			it.each(FOCUS_EDITING_FLAGS)('keeps focus with $name editing', async flags => {
				const schema: RJSFSchema = { type: 'object', title: 'Labels', maxProperties: limit.max, additionalProperties: row.additionalProperties };
				const formData = { 'site"west\\line': row.name === 'object additional property' ? { host: 'broker.local' } : 'lisbon' };
				const onChange = vi.fn();
				const screen = await render(
					<div>
						<KvSchemaForm schema={schema} formData={formData} templates={layout.templates} disabled={flags.disabled} readonly={flags.readonly} onChange={onChange} />
						<button>After form</button>
					</div>
				);
				await whenAllKelvinReady(screen.container);
				const add = screen.getByRole('button', { name: 'Add property to Labels', exact: true });
				await screen.getByRole('button', { name: 'After form', exact: true }).click();
				(add.element() as HTMLElement).focus();
				await userEvent.keyboard('{Enter}');
				if (!flags.focused) {
					await expect.element(add).toBeDisabled();
					expect(onChange).not.toHaveBeenCalled();
					return;
				}
				await expect.poll(() => onChange.mock.calls.length).toBe(1);
				if (limit.intoEntry) {
					await expect.poll(() => screen.container.querySelector('#root_newKey-key')?.matches(':focus-within')).toBe(true);
					await userEvent.tab();
					await expect
						.poll(() => screen.container.querySelector(row.name === 'object additional property' ? '#root_newKey_host' : '#root_newKey')?.matches(':focus-within'))
						.toBe(true);
				} else await expect.poll(() => add.element().matches(':focus')).toBe(true);
				if (layout.templates) expect(screen.container.querySelector('[data-r5-field-template]')).not.toBeNull();
			});
		});
	});
});

describe('R5 array focus in Chromium', () => {
	it('puts the scalar actions in Tab order between rows', async () => {
		const row = ARRAY_SHAPES[0];
		const screen = await render(<KvSchemaForm schema={row.schema} formData={row.formData} />);
		await whenAllKelvinReady(screen.container);
		await screen.container.querySelector<HTMLKvTextFieldElement>('#root_0')!.focusInput();
		await userEvent.tab();
		await expect.poll(() => screen.getByRole('button', { name: 'Remove Topic 1', exact: true }).element().matches(':focus')).toBe(true);
		await userEvent.tab();
		await expect.poll(() => menuOf(itemsOf(screen.container)[1]).matches(':focus-within')).toBe(true);
		await userEvent.tab();
		await expect.poll(() => screen.container.querySelector('#root_1')?.matches(':focus-within')).toBe(true);
		await userEvent.tab();
		await expect.poll(() => screen.getByRole('button', { name: 'Remove Topic 2', exact: true }).element().matches(':focus')).toBe(true);
		await userEvent.tab();
		await expect.poll(() => menuOf(itemsOf(screen.container)[2]).matches(':focus-within')).toBe(true);
		await userEvent.tab();
		await expect.poll(() => screen.container.querySelector('#root_2')?.matches(':focus-within')).toBe(true);
		await userEvent.tab();
		await expect.poll(() => screen.getByRole('button', { name: 'Remove Topic 3', exact: true }).element().matches(':focus')).toBe(true);
		await userEvent.tab();
		await expect.poll(() => screen.container.querySelector('kv-action-button')?.matches(':focus-within')).toBe(true);
	});
	it('tabs through an object header action, its fields, then the next item', async () => {
		const row = ARRAY_SHAPES[2];
		const screen = await render(<KvSchemaForm schema={row.schema} formData={row.formData} uiSchema={{ 'ui:options': { layout: 'sections' } }} />);
		await whenAllKelvinReady(screen.container);
		await menuOf(itemsOf(screen.container)[0]).setFocus();
		await userEvent.tab();
		await expect.poll(() => screen.container.querySelector('#root_0_name')?.matches(':focus-within')).toBe(true);
		await userEvent.tab();
		await expect.poll(() => screen.container.querySelector('#root_0_value')?.matches(':focus-within')).toBe(true);
		await userEvent.tab();
		await expect.poll(() => menuOf(itemsOf(screen.container)[1]).matches(':focus-within')).toBe(true);
		await userEvent.tab();
		await expect.poll(() => screen.container.querySelector('#root_1_name')?.matches(':focus-within')).toBe(true);
	});
	it('focuses the new scalar input when Add reaches maxItems', async () => {
		const row = ARRAY_SHAPES[5];
		const screen = await render(<KvSchemaForm schema={row.schema} formData={row.formData} />);
		await whenAllKelvinReady(screen.container);
		const add = screen.getByRole('button', { name: 'Add item to Topics', exact: true });
		(add.element() as HTMLElement).focus();
		await userEvent.keyboard('{Enter}');
		await expect.poll(() => screen.container.querySelector('#root_1')?.matches(':focus-within')).toBe(true);
	});
});
