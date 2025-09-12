import { Component, Fragment, Host, Prop, h } from '@stencil/core';
import { IDescriptionList, IDescriptionListItem, IDescriptionListItemToggletipConfig } from './description-list.types';
import { DEFAULT_ICON_TOGGLETIP_CONFIG, DEFAULT_TEXT_TOOLTIP_CONFIG } from './description-list.config';
import { getTooltipText } from './description-list.helper';
import { ComputePositionConfig } from '@floating-ui/dom';
import { CustomCssClass } from '../../types';
import { getClassMap } from '../../utils/css-class.helper';

/**
 * @part row - The description list row element.
 */
@Component({
	tag: 'kv-description-list',
	styleUrl: 'description-list.scss',
	shadow: false
})
export class KvDescriptionList implements IDescriptionList {
	/** @inheritdoc */
	@Prop({ reflect: true }) items!: IDescriptionListItem[];
	/** @inheritdoc */
	@Prop({ reflect: true }) descriptionTooltipConfig?: Partial<ComputePositionConfig> = DEFAULT_TEXT_TOOLTIP_CONFIG;
	/** @inheritdoc */
	@Prop({ reflect: true }) iconToggletipConfig?: IDescriptionListItemToggletipConfig = DEFAULT_ICON_TOGGLETIP_CONFIG;
	/** @inheritdoc */
	@Prop({ reflect: true }) customClass?: CustomCssClass = '';

	customRenderDescription({ description, popoverInfo, copiableTextConfig }: IDescriptionListItem) {
		if (copiableTextConfig) {
			return <kv-copy-to-clipboard {...copiableTextConfig}>{description}</kv-copy-to-clipboard>;
		}

		return (
			<Fragment>
				<kv-tooltip text={getTooltipText(popoverInfo)} options={this.descriptionTooltipConfig} customClass="description-list-tooltip-container">
					{description}
				</kv-tooltip>
				{popoverInfo?.icon && (
					<kv-toggle-tip text={popoverInfo.text} {...this.iconToggletipConfig} customClass="description-list-tooltip-container">
						<kv-icon name={popoverInfo.icon} customClass="icon-16" slot="open-element-slot" />
					</kv-toggle-tip>
				)}
			</Fragment>
		);
	}

	render() {
		return (
			<Host>
				<div
					class={{
						'description-list-container': true,
						...getClassMap(this.customClass)
					}}
				>
					{this.items?.map(item => (
						<div class="row" part="row">
							<div class="title">{item.title}</div>
							<div class="description">{this.customRenderDescription(item)}</div>
						</div>
					))}
				</div>
			</Host>
		);
	}
}
