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
