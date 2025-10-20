import { Component, Host, Prop, State, h } from '@stencil/core';
import { VNode, Watch } from '@stencil/core/internal';
import { debounce, throttle } from 'lodash-es';
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
	@Prop({ reflect: true }) renderItem: RenderItemFunc;
	/** @inheritdoc */
	@Prop({ reflect: true }) overscanCount: number = 5;

	private containerElement: HTMLDivElement;

	// create an Observer instance
	private resizeObserver = new ResizeObserver(() => this.debounceResize());

	@Watch('itemHeight')
	@Watch('itemCount')
	updateTotalHeight() {
		this.totalHeight = this.itemHeight * this.itemCount;
	}

	@Watch('renderItem')
	renderItemHandle() {
		this.updateVisibleElements();
	}

	@State() totalHeight = 1;
	@State() scrollTop: number = 0;
	@State() elements: VNode[];

	componentDidLoad() {
		if (!this.containerElement) return;

		this.containerElement.addEventListener('scroll', this.throttledScroll);
		this.resizeObserver.observe(this.containerElement);
		this.updateTotalHeight();
		this.updateVisibleElements();
	}

	disconnectedCallback() {
		this.containerElement?.removeEventListener('scroll', this.throttledScroll);
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
		this.scrollTop = this.containerElement?.scrollTop ?? 0;
	};

	private updateVisibleElements = () => {
		this.elements = this.getVisibleElements();
	};

	private getVisibleElements = (): VNode[] => {
		const containerHeight = this.containerElement?.clientHeight ?? 0;

		const elements: VNode[] = [];
		let accumulator = 0;
		const overscanHeight = this.overscanCount * this.itemHeight;

		for (let index = 0; index < this.itemCount; index++) {
			let itemkey = this.getItemKey(index);

			// Check if the item is above the viewport
			if (this.scrollTop - overscanHeight > accumulator + this.itemHeight) {
				accumulator += this.itemHeight;
				continue;
			}

			// Check if the item is below the viewport
			if (this.scrollTop + containerHeight + overscanHeight < accumulator) {
				break;
			}

			elements.push(buildElement(index, itemkey, this.itemHeight, accumulator, this.renderItem));
			accumulator += this.itemHeight;
		}

		return elements;
	};

	render() {
		return (
			<Host>
				<div class="container" ref={el => (this.containerElement = el as HTMLDivElement)}>
					<div class="inner" style={{ height: `${this.totalHeight}px` }}>
						{this.elements}
					</div>
				</div>
			</Host>
		);
	}
}
