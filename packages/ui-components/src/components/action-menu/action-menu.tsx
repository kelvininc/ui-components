/* eslint @stencil-community/required-prefix: "off" -- This rule can't statically evaluate an imported stylesheet. */
import { Component, Element, Event, EventEmitter, forceUpdate, h, Host, Method, Prop, State, Watch } from '@stencil/core';
import { EComponentSize } from '../../utils/types';
import { getNextEnabledIndex } from '../../utils/keyboard-navigation.helper';
import { EActionButtonType } from '../action-button/action-button.types';
import { DEFAULT_POSITION_CONFIG } from '../dropdown-base/dropdown-base.config';
import { EIconName } from '../icon/icon.types';
import { IActionMenu, IActionMenuEvents, IActionMenuItem } from './action-menu.types';
import menuStyles from './action-menu.scss';

const FOCUS_WAIT_MS = 1000;

@Component({ tag: 'kv-action-menu', styles: menuStyles, shadow: false, scoped: true })
export class KvActionMenu implements IActionMenu, IActionMenuEvents {
	/** @inheritdoc */
	@Prop() accessibleLabel!: string;
	/** @inheritdoc */
	@Prop() items?: readonly IActionMenuItem[] = [];
	/** @inheritdoc */
	@Prop() icon?: EIconName = EIconName.More;
	/** @inheritdoc */
	@Prop({ reflect: true }) disabled = false;
	/** @inheritdoc */
	@Prop() size?: EComponentSize = EComponentSize.Small;
	/** @inheritdoc */
	@Prop() triggerTabIndex?: number;
	/** @inheritdoc */
	@Event() itemSelected: EventEmitter<string>;
	@Element() element: HTMLKvActionMenuElement;
	@State() isOpen = false;
	@State() private dropdownGeneration = 0;

	private hasConnected = false;
	private reconnectPending = false;
	private trigger?: HTMLKvActionButtonIconElement;
	private menu?: HTMLDivElement;
	private focusFrame?: number;
	private focusRequest?: { id?: string };

	private get actions(): readonly IActionMenuItem[] {
		return this.items ?? [];
	}
	private get buttons(): HTMLButtonElement[] {
		return Array.from(this.menu?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') ?? []);
	}

	/** Waits for readiness, then focuses the enabled trigger without opening or choosing an action. */
	@Method()
	async setFocus(): Promise<void> {
		let deadline: number | undefined;
		let readyTrigger: HTMLKvActionButtonIconElement | undefined;
		let ready = false;
		while (!this.disabled && this.element.isConnected) {
			const trigger = this.trigger;
			if (!this.reconnectPending && trigger?.isConnected) {
				if (readyTrigger !== trigger) {
					readyTrigger = trigger;
					ready = false;
					deadline = undefined;
					void Promise.resolve(trigger.componentOnReady?.()).then(() => {
						if (readyTrigger === trigger) ready = true;
					});
				}
				if (ready) {
					deadline ??= performance.now() + FOCUS_WAIT_MS;
					trigger.focus();
					if ((trigger.getRootNode() as Document | ShadowRoot).activeElement === trigger) return;
					if (performance.now() >= deadline) return;
				}
			}
			await new Promise<void>(resolve => window.requestAnimationFrame(() => resolve()));
		}
	}

	@Watch('disabled')
	disabledChanged(disabled: boolean) {
		if (disabled) this.closeMenu(false);
	}
	@Watch('items')
	itemsChanged() {
		if (this.isOpen && this.menu?.contains(document.activeElement)) {
			this.requestMenuFocus((document.activeElement as HTMLElement).dataset.actionId);
		}
	}

	private cancelFocus = () => {
		if (this.focusFrame !== undefined) window.cancelAnimationFrame(this.focusFrame);
		this.focusFrame = undefined;
		this.focusRequest = undefined;
	};
	private closeMenu = (restoreFocus: boolean) => {
		this.cancelFocus();
		this.isOpen = false;
		if (restoreFocus && !this.disabled) this.trigger?.focus();
	};
	private requestMenuFocus = (id?: string) => {
		this.cancelFocus();
		this.focusRequest = { id };
		forceUpdate(this.element);
	};
	private focusMenuWhenVisible = (preferredId?: string) => {
		this.cancelFocus();
		const deadline = performance.now() + FOCUS_WAIT_MS;
		const focus = () => {
			this.focusFrame = undefined;
			if (!this.isOpen || this.disabled || !this.element.isConnected) return;
			const preferred = this.actions.findIndex(item => item.id === preferredId && !item.disabled);
			const index = preferred >= 0 ? preferred : getNextEnabledIndex(this.actions, -1, 1);
			const target = index < 0 ? this.menu : this.buttons.find(button => button.dataset.actionId === this.actions[index].id && !button.disabled);
			target?.focus();
			if (target && document.activeElement === target) return;
			if (performance.now() < deadline) this.focusFrame = window.requestAnimationFrame(focus);
		};
		this.focusFrame = window.requestAnimationFrame(focus);
	};
	private selectItem = (id: string) => {
		const item = this.actions.find(action => action.id === id);
		if (!this.isOpen || this.disabled || !item || item.disabled) return;
		this.closeMenu(true);
		this.itemSelected.emit(item.id);
	};
	private onTriggerClick = (event: CustomEvent<MouseEvent>) => {
		event.stopPropagation();
		event.detail.stopPropagation();
		if (this.disabled) return;
		if (this.isOpen) this.closeMenu(true);
		else {
			this.isOpen = true;
			this.requestMenuFocus();
		}
	};
	private ignoresKey = (event: KeyboardEvent) => event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey;
	private closeWithKey = (event: KeyboardEvent) => {
		if (event.key !== 'Tab' && event.key !== 'Escape') return false;
		if (event.key === 'Escape') event.preventDefault();
		event.stopPropagation();
		// Start native Tab movement at the trigger, because the focused panel lives in a body portal.
		this.closeMenu(true);
		return true;
	};
	private onTriggerKeyDown = (event: KeyboardEvent) => {
		if (this.disabled || this.ignoresKey(event)) return;
		if (this.isOpen && this.closeWithKey(event)) return;
		if (event.key !== 'ArrowDown') return;
		event.preventDefault();
		event.stopPropagation();
		if (!event.repeat) {
			this.isOpen = true;
			this.requestMenuFocus();
		}
	};
	private onMenuKeyDown = (event: KeyboardEvent) => {
		if (!this.isOpen || this.ignoresKey(event) || this.closeWithKey(event)) return;
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			event.stopPropagation();
			const id = (event.target as HTMLElement).dataset.actionId;
			if (!event.repeat && id !== undefined) this.selectItem(id);
			return;
		}
		if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
		event.preventDefault();
		event.stopPropagation();
		const buttons = this.buttons;
		const from = event.key === 'Home' || event.key === 'End' ? -1 : buttons.indexOf(event.target as HTMLButtonElement);
		const step = event.key === 'ArrowUp' || event.key === 'End' ? -1 : 1;
		buttons[getNextEnabledIndex(this.actions, from, step)]?.focus();
	};
	private onOpenStateChange = (event: CustomEvent<boolean>) => {
		event.stopPropagation();
		if (!event.detail) this.closeMenu(false);
	};

	componentDidRender() {
		this.reconnectPending = false;
		if (this.isOpen && this.focusRequest) this.focusMenuWhenVisible(this.focusRequest.id);
	}

	connectedCallback() {
		if (this.hasConnected) {
			this.closeMenu(false);
			this.reconnectPending = true;
			// Moving a row destroys dropdown-base's portal; recreate this menu's dropdown on reconnect.
			this.dropdownGeneration++;
		}
		this.hasConnected = true;
	}

	disconnectedCallback() {
		this.cancelFocus();
	}

	render() {
		return (
			<Host>
				<kv-dropdown-base
					key={this.dropdownGeneration}
					isOpen={this.isOpen}
					actionElement={this.trigger}
					listElement={this.menu}
					options={{ ...DEFAULT_POSITION_CONFIG, placement: 'bottom-end' }}
					onOpenStateChange={this.onOpenStateChange}
				>
					<kv-action-button-icon
						slot="action"
						icon={this.icon ?? EIconName.More}
						type={EActionButtonType.Tertiary}
						size={this.size ?? EComponentSize.Small}
						accessibleLabel={this.accessibleLabel}
						disabled={this.disabled}
						menuExpanded={this.isOpen}
						menuTabIndex={this.triggerTabIndex}
						ref={element => {
							if (element) this.trigger = element;
						}}
						onClickButton={this.onTriggerClick}
						onKeyDown={this.onTriggerKeyDown}
					/>
					<div
						slot="list"
						class={{ 'action-menu-panel': true, 'action-menu-panel--closed': !this.isOpen }}
						role="menu"
						aria-label={this.accessibleLabel}
						tabIndex={-1}
						aria-hidden={String(!this.isOpen)}
						ref={element => {
							if (element) this.menu = element;
						}}
						onKeyDown={this.onMenuKeyDown}
					>
						{/* Keep scoped styles with the panel when it leaves an enclosing shadow root. */}
						<style>{menuStyles}</style>
						{this.actions.map(item => [
							item.separatorBefore && <div key={`separator:${item.id}`} class="action-menu-separator" role="separator" />,
							<button
								key={`item:${item.id}`}
								type="button"
								role="menuitem"
								tabIndex={-1}
								disabled={item.disabled}
								aria-disabled={String(!!item.disabled)}
								data-action-id={item.id}
								class={{ 'action-menu-item': true, 'action-menu-item--destructive': !!item.destructive }}
								onClick={event => {
									event.stopPropagation();
									this.selectItem(item.id);
								}}
							>
								{item.icon && <kv-icon name={item.icon} aria-hidden="true" />}
								{item.label}
							</button>
						])}
					</div>
				</kv-dropdown-base>
			</Host>
		);
	}
}
