import { Component, Host, h, Prop, Event, EventEmitter, Element, Fragment } from '@stencil/core';
import { isNil, omitBy } from 'lodash-es';
import { CLEAR_SELECTION_LABEL, SELECT_ALL_LABEL } from './select.config';
import { ISelect, ISelectEvents } from './select.types';
import { isElementVisible } from './select.helper';
import { EComponentSize } from '../../types';

/**
 * @part select - The select container.
 */
@Component({
	tag: 'kv-select',
	styleUrl: 'select.scss',
	shadow: true
})
export class KvSelect implements ISelect, ISelectEvents {
	/** @inheritdoc */
	@Prop({ reflect: true }) searchable?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) searchValue?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) searchPlaceholder?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectionClearable?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectionClearEnabled?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) clearSelectionLabel?: string = CLEAR_SELECTION_LABEL;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectionAll?: boolean = false;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectionAllEnabled?: boolean;
	/** @inheritdoc */
	@Prop({ reflect: true }) selectAllLabel?: string = SELECT_ALL_LABEL;
	/** @inheritdoc */
	@Prop({ reflect: true }) minHeight?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) maxHeight?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) minWidth?: string;
	/** @inheritdoc */
	@Prop({ reflect: true }) maxWidth?: string;

	/** @inheritdoc */
	@Event() searchChange: EventEmitter<string>;
	/** @inheritdoc */
	@Event() clearSelection: EventEmitter<void>;
	/** @inheritdoc */
	@Event() selectAll: EventEmitter<void>;

	@Element() el: HTMLKvSelectElement;

	private onSearchChange = (event: CustomEvent<string>) => {
		event.stopPropagation();
		this.searchChange.emit(event.detail);
	};

	private onClearSelection = () => {
		this.clearSelection.emit();
	};

	private onSelectAll = () => {
		this.selectAll.emit();
	};

	private get customStyle() {
		return omitBy(
			{
				'--select-max-height': this.maxHeight,
				'--select-min-height': this.minHeight,
				'--select-max-width': this.maxWidth,
				'--select-min-width': this.minWidth
			},
			isNil
		);
	}

	private get hasActionsSlot() {
		return isElementVisible(this.el, '[slot="select-header-actions"]');
	}

	private get hasLabelSlot() {
		return isElementVisible(this.el, '[slot="select-header-label"]');
	}

	render() {
		const hasLabels = this.selectionAll || this.selectionClearable || this.hasActionsSlot || this.hasLabelSlot;
		const hasHeader = this.searchable || hasLabels;

		return (
			<Host style={this.customStyle}>
				<div class="select-container" part="select">
					{hasHeader && (
						<div class="select-header-container">
							{this.searchable && (
								<kv-search size={EComponentSize.Small} value={this.searchValue} placeholder={this.searchPlaceholder} onTextChange={this.onSearchChange} />
							)}
							{hasLabels && (
								<div class="search-footer">
									<div class="footer-actions">
										{this.selectionAll && (
											<div
												class={{
													'action': true,
													'action--disabled': !this.selectionAllEnabled
												}}
												onClick={this.onSelectAll}
											>
												{this.selectAllLabel}
											</div>
										)}
										{this.selectionClearable && (
											<Fragment>
												{this.selectionAll && <div class="divider" />}
												<div
													class={{
														'action': true,
														'action--disabled': !this.selectionClearEnabled
													}}
													onClick={this.onClearSelection}
												>
													{this.clearSelectionLabel}
												</div>
												{this.hasActionsSlot && <div class="divider" />}
											</Fragment>
										)}
										<slot name="select-header-actions" />
									</div>
									<slot name="select-header-label" />
								</div>
							)}
						</div>
					)}
					<div class="select-options-container">
						<slot></slot>
					</div>
					<slot name="select-footer" />
				</div>
			</Host>
		);
	}
}
