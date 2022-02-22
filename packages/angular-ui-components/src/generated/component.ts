/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone } from '@angular/core';
import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

import { Components } from '@kelvininc/ui-components';




export declare interface KvActionButton extends Components.KvActionButton {
  /**
   *  
   */
  buttonClick: EventEmitter<CustomEvent<MouseEvent>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['buttonClass', 'buttonId', 'enabled', 'fixedWidth', 'icon', 'smallSize', 'text', 'type']
})
@Component({
  selector: 'kv-action-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['buttonClass', 'buttonId', 'enabled', 'fixedWidth', 'icon', 'smallSize', 'text', 'type']
})
export class KvActionButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['buttonClick']);
  }
}


export declare interface KvLink extends Components.KvLink {
  /**
   * Emitted when clicking the label 
   */
  labelClick: EventEmitter<CustomEvent<MouseEvent>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['href', 'label', 'subtitle', 'target']
})
@Component({
  selector: 'kv-link',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['href', 'label', 'subtitle', 'target']
})
export class KvLink {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['labelClick']);
  }
}

import type { ESwitchButtonState as IKvSwitchButtonESwitchButtonState } from '@kelvininc/ui-components';
export declare interface KvSwitchButton extends Components.KvSwitchButton {
  /**
   * Emitted when switch's state changes 
   */
  switchStateChange: EventEmitter<CustomEvent<IKvSwitchButtonESwitchButtonState>>;

}

@ProxyCmp({
  defineCustomElementFn: undefined,
  inputs: ['disabled', 'label', 'state']
})
@Component({
  selector: 'kv-switch-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['disabled', 'label', 'state']
})
export class KvSwitchButton {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['switchStateChange']);
  }
}
