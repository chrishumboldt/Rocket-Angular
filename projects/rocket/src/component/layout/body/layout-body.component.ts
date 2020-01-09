/**
 * @author Chris Humboldt
 */

import { Component, HostBinding, Input } from '@angular/core';

import { SizeType } from '../../../store/size.store';

@Component({
   selector: 'rocket-body',
   template: '<ng-content></ng-content>',
   styleUrls: ['./layout-body.component.scss']
})
export class RocketLayoutBodyComponent {
   @Input() center = true;
   @Input() classNames = '';
   @Input() limit = SizeType.MEDIUM;
   @Input() padding = SizeType.MEDIUM;

   // Apply classes to the host element.
   @HostBinding('class') classes = [
      `_center-${this.center}`,
      `_limit-${this.limit}`,
      `_padding-${this.padding}`,
      `${this.classNames}`
   ].join(' ');
}
