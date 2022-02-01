import { Component, Event, EventEmitter, h, Prop, State } from '@stencil/core';
import { PkActionButtonType } from './action-button.types';

@Component({
    tag: 'action-button',
    styleUrl: 'action-button.less',
    shadow: true,
})
export class ActionButton {
    @Prop({ reflect: true }) type!: PkActionButtonType;

    @Prop({ reflect: true }) text: string;
    @Prop({ reflect: true }) icon: string;
    @Prop({ reflect: true }) enabled = true;
    
    @Prop({ reflect: true }) buttonClass: string;
    @Prop({ reflect: true }) smallSize = false;
    @Prop({ reflect: true }) buttonId: string;
    @Prop({ reflect: true }) fixedWidth: number = null;

    @State() isButtonHovered = false;

    @Event() buttonClick: EventEmitter<MouseEvent>;

    onActionButtonClick(event: MouseEvent) {
        this.isButtonHovered = false;

        if (event) {
            event.preventDefault();
        }

        if (this.enabled) {
            this.buttonClick.emit(event);
        }
    }

    onMouseEnter() {
        if (this.enabled) {
            this.isButtonHovered = true;
        }
    }

    onMouseLeave() {
        this.isButtonHovered = false;
    }

    render() {
        console.log('rendered');
        return (
            <div class="action-btn-container">
                <div
                    id={this.buttonId}
                    class={{
                        'action-button': true,
                        [`${this.buttonClass ?? ''}`]: true,
                        [`${this.type}`]: true,
                        'hover': this.isButtonHovered,
                        'small': this.smallSize,
                        'icon-only': !this.text,
                    }}
                    aria-disabled={!this.enabled || null}
                    style={{ width: this.fixedWidth ? `${this.fixedWidth}px` : 'auto' }}
                    onClick={(ev) => this.onActionButtonClick(ev)}
                    onMouseEnter={() => this.onMouseEnter()}
                    onMouseLeave={() => this.onMouseLeave()}>
                    {this.text && (
                        <div class="button-wrapper">
                            <span class="button-title">
                                {this.text}
                            </span>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
