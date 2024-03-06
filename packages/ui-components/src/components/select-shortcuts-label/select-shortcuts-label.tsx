import { Component, Host, h } from '@stencil/core';
import { EIconName } from '../icon/icon.types';

@Component({
	tag: 'kv-select-shortcuts-label',
	styleUrl: 'select-shortcuts-label.scss',
	shadow: false
})
export class KvSelectShortcutsLabel {
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
						<div class="group">
							<div class="icons">
								<div class="icon">esc</div>
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
