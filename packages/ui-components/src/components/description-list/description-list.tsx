import { Component, Fragment, Host, Prop, h } from '@stencil/core';
import { IDescriptionList, IDescriptionListItem, IDescriptionListItemToggletipConfig } from './description-list.types';
import { DEFAULT_ICON_TOGGLETIP_CONFIG, DEFAULT_TEXT_TOOLTIP_CONFIG } from './description-list.config';
import { getTooltipText } from './description-list.helper';
import { ComputePositionConfig } from '@floating-ui/dom';

@Component({
	tag: 'kv-description-list',
	styleUrl: 'description-list.scss',
	shadow: true
})
export class KvDescriptionList implements IDescriptionList {
	/** @inheritdoc */
	@Prop({ reflect: true }) items!: IDescriptionListItem[];
	/** @inheritdoc */
	@Prop({ reflect: true }) descriptionTooltipConfig?: Partial<ComputePositionConfig> = DEFAULT_TEXT_TOOLTIP_CONFIG;
	/** @inheritdoc */
	@Prop({ reflect: true }) iconToggletipConfig?: IDescriptionListItemToggletipConfig = DEFAULT_ICON_TOGGLETIP_CONFIG;

	render() {
		return (
			<Host>
				<div class="description-list-container">
					{this.items?.map(({ title, description, popoverInfo }) => (
						<Fragment>
							<div class="title">{title}</div>
							<div class="description">
								<kv-tooltip text={getTooltipText(popoverInfo)} options={this.descriptionTooltipConfig}>
									{description}
								</kv-tooltip>
								{popoverInfo?.icon && (
									<kv-toggle-tip text={popoverInfo.text} {...this.iconToggletipConfig} exportparts="toggle-tip-container">
										<kv-icon name={popoverInfo.icon} customClass={'icon-16'} slot="open-element-slot" />
									</kv-toggle-tip>
								)}
							</div>
						</Fragment>
					))}
				</div>
			</Host>
		);
	}
}
