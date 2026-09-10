import { Component, Host, Prop, h } from '@stencil/core';
import { EIconName } from '../icon/icon.types';

@Component({
	tag: 'kv-select-shortcuts-label',
	styleUrl: 'select-shortcuts-label.scss',
	shadow: false
})
export class KvSelectShortcutsLabel {
	/** (optional) If `true` the range selection shortcut hint is displayed. Default `false` */
	@Prop({ reflect: true }) rangeSelection?: boolean = false;

	render() {
		return (
			<Host>
				<div class="shortcuts">
					<div class="left-items">
						<div class="group">
							<div class="icons">
								<div class="icon">
									<kv-icon name={EIconName.ArrowDropUp} />
								</div>
								<div class="icon">
									<kv-icon name={EIconName.ArrowDropDown} />
								</div>
							</div>
							<div class="label">To navigate</div>
						</div>
						<div class="group">
							<div class="icons">
								<div class="icon">
									<kv-icon name={EIconName.Undo} />
								</div>
							</div>
							<div class="label">To select</div>
						</div>
						{this.rangeSelection && (
							<div class="group">
								<div class="icons">
									<div class="icon icon--text">shift</div>
									<div class="icon">
										<kv-icon name={EIconName.Undo} />
									</div>
								</div>
								<div class="label">To select a range</div>
							</div>
						)}
						<div class="group">
							<div class="icons">
								<div class="icon icon--text">esc</div>
							</div>
							<div class="label">To dismiss</div>
						</div>
					</div>
					<slot name="right-items" />
				</div>
			</Host>
		);
	}
}
