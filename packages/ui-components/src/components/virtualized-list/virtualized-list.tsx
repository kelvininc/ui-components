import { Component, Host, Prop, State, h, Element } from '@stencil/core';
import { VNode, Watch } from '@stencil/core/internal';
import { debounce, throttle } from 'lodash';
import { buildElement } from './virtualized-list.helper';
import { IVirtualizedList, RenderItemFunc } from './virtualized-list.types';

@Component({
	tag: 'kv-virtualized-list',
	styleUrl: 'virtualized-list.scss',
	shadow: true
})
export class KvVirtualizedList implements IVirtualizedList {
	/** @inheritdoc */
	@Prop({ reflect: true }) itemCount: number;
	/** @inheritdoc */
	@Prop({ reflect: true }) itemHeight: number;
	/** @inheritdoc */
	@Prop({ reflect: true }) getItemKey: (index: number) => string;
	/** @inheritdoc */
	@Prop({ reflect: true }) getItemHeight?: (index: number) => number;
	/** @inheritdoc */
	@Prop({ reflect: true }) renderItem: RenderItemFunc;

	@Element() element: HTMLKvVirtualizedListElement;

	// create an Observer instance
	private resizeObserver = new ResizeObserver(() => this.debounceResize());

	@Watch('itemHeight')
	@Watch('getItemHeight')
	updateTotalHeight() {
		let totalHeight = 0;
		for (let index = 0; index < this.itemCount; index++) {
			totalHeight += this.getHeight(index);
		}

		this.totalHeight = totalHeight;
	}

	@Watch('renderItem')
	renderItemHandle() {
		this.updateVisibleElements();
	}

	@State() totalHeight = 1;
	@State() scrollTop: number = 0;
	@State() elements: VNode[];

	connectedCallback() {
		this.element.addEventListener('scroll', this.throttledScroll);
		this.resizeObserver.observe(this.element);
		this.updateTotalHeight();
	}

	disconnectedCallback() {
		this.element.removeEventListener('scroll', this.throttledScroll);
		this.resizeObserver.disconnect();
	}

	private debounceResize = debounce(() => this.updateVisibleElements(), 100);
	private throttledScroll = throttle(
		() => {
			this.updateScrollTop();
			this.updateVisibleElements();
		},
		16,
		{
			trailing: true
		}
	);

	private updateScrollTop = () => {
		this.scrollTop = this.element.scrollTop ?? 0;
	};

	private updateVisibleElements = () => {
		this.elements = this.getVisibleElements();
	};

	private getHeight = (index: number): number => this.getItemHeight?.(index) ?? this.itemHeight;

	private getVisibleElements = (): VNode[] => {
		const containerHeight = this.element.clientHeight ?? 0;

		const elements: VNode[] = [];
		let accumulator = 0;
		for (let index = 0; index < this.itemCount; index++) {
			let itemHeight = this.getHeight(index);
			let itemkey = this.getItemKey(index);

			// Check if the item is above the viewport
			if (this.scrollTop > accumulator + itemHeight) {
				accumulator += itemHeight;
				continue;
			}

			// Check if the item is below the viewport
			if (this.scrollTop + containerHeight < accumulator) {
				break;
			}

			elements.push(buildElement(index, itemkey, itemHeight, accumulator, this.renderItem));
			accumulator += itemHeight;
		}

		return elements;
	};

	render() {
		return (
			<Host>
				<div class="inner" style={{ height: `${this.totalHeight}px` }}>
					{this.elements}
				</div>
			</Host>
		);
	}
}
