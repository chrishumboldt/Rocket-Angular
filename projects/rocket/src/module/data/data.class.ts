/**
 * @author Chris Humboldt
 */

import { ValueGenerator } from '../../generator/value.generator';

export class DataEntry {
   asObservable?: boolean;
   data?: any;
   force?: boolean;
   name: string;
   sortBy?: string;
   sortOrder?: string;

   constructor(input: any = {}) {
      this.asObservable = ValueGenerator(this, input, 'asObservable', true);
      this.data = ValueGenerator(this, input, 'data');
      this.force = ValueGenerator(this, input, 'force', false);
      this.name = ValueGenerator(this, input, 'name', '');
      this.sortOrder = ValueGenerator(this, input, 'sortOrder', 'asc');

      /**
       * Optionals.
       */
      if (input.sortBy) {
         this.sortBy = ValueGenerator(this, input, 'sortBy');
      }
   }
}

export class SubscribeToOptions {
   name: any;
   onEmit: any;
   safeEmit?: boolean;

   constructor(input: any = {}) {
      this.name = ValueGenerator(this, input, 'name', '');
      this.onEmit = ValueGenerator(this, input, 'onEmit', () => {});
      this.safeEmit = ValueGenerator(this, input, 'safeEmit', true);
   }
}
