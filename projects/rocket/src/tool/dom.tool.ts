/**
 * @author Chris Humboldt
 */

import { RocketArray } from './array.tool';
import { RocketError } from './development.tool';
import { RocketExists } from './exists.tool';
import { RocketGet } from './get.tool';
import { RocketIs } from './is.tool';
import { RocketString } from './string.tool';
import { SelectorType } from '../store';

/**
 * Return the elements of a web client should they be available.
 */
let domBody: HTMLBodyElement;
let domHead: HTMLHeadElement;
let domHTML: HTMLHtmlElement;
let domTitle: HTMLTitleElement;
let domWindow: Window;
if (typeof document !== undefined) {
   domBody = document.getElementsByTagName('body')[0];
   domHead = document.getElementsByTagName('head')[0];
   domHTML = document.getElementsByTagName('html')[0];
   domTitle = document.getElementsByTagName('title')[0];
}
if (typeof window !== undefined) {
   domWindow = window;
}

/**
 * Set the height of an element based on the width but apply a ration
 * multiplier if desired.
 *
 * @param selector - The selector of the DOM element.
 * @param multiplier - How much to multiply the width value by.
 */
function domRatio(selector: any, multiplier: number = 1): void {
   const elements = domSelect(selector);

   /**
    * DOM select will alwasy return an array.
    */
   elements.forEach((item: HTMLElement) => {
      item.style.height = `${Math.floor(item.offsetWidth * multiplier)}px`;
   });
}

/**
 * Remove DOM elements from the client.
 *
 * @param selector - The selector of the DOM element.
 */
function domRemove(selector: any): void {
   /**
    * Catch if the elements does not exist and simply kill the execution.
    */
   if (!RocketExists(selector)) {
      return;
   }

   if (RocketIs.string(selector)) {
      const elementList = domSelect(selector);

      elementList.forEach((item: HTMLElement) => {
         domRemoveItem(item);
      });
   } else {
      domRemoveItem(selector);
   }
}

/**
 * Remove a single DOM element from the client.
 *
 * @param element - The selector of the DOM element.
 */
function domRemoveItem(element: HTMLElement): void {
   if (RocketIs.element(element) && RocketIs.element(element.parentNode)) {
      element.parentNode.removeChild(element);
   }
}

/**
 * Get multiple elements. The method assumes that many elements exist
 * on the DOM with the "selectors". As such an array will ALWAYS be returned.
 * Even an ID selector will return an array as the user has requested
 * this particular method type. It's important to maintain consistency.
 *
 * @param selector - The selector of the DOM element.
 */
function domSelect(selector: any): HTMLElement[] {
   let elementList = [];

   /**
    * Determine the selection type.
    */
   if (RocketIs.string(selector)) {
      /**
       * String selectors are returned via another function.
       */
      elementList = elementList.concat(domSelectByString(selector));
   } else if (RocketIs.element(selector)) {
      /**
       * The selector is already and element so just added it in and return.
       */
      elementList.push(selector);
   } else if (RocketIs.array(selector)) {
      /**
       * An array requires inspecting each item in the array.
       */
      let stringSelectors = '';

      /**
       * Iterate over the selectors and determine the type.
       */
      selector.forEach((item: any) => {
         if (RocketIs.string(item)) {
            /**
             * The array item is a string.
             */
            stringSelectors += `${item},`;
         } else if (RocketIs.element(item)) {
            /**
             * The array item is an element.
             */
            elementList.push(item);
         }
      });
      /**
       * If there are any string selectors than fetch those and populate the
       * element list.
       */
      if (stringSelectors.length > 0) {
         elementList = elementList.concat(domSelectByString(stringSelectors));
      }
   } else if (RocketIs.object(selector)) {
      /**
       * An object has a few conditions that needs to be checked.
       */
      if (selector === window || selector === document) {
         elementList = [selector];
      } else {
         selector = Array.prototype.slice.call(selector);

         if (RocketIs.array(selector) && selector.length > 0) {
            elementList = selector;
         }
      }
   } else if (selector === window || selector === document) {
      /**
       * This is accomodating a strange interaction that can occur.
       */
      elementList = [selector];
   }
   /**
    * Now return the resulting element list.
    */
   return RocketArray.clean(RocketArray.unique(elementList), true);
}

/**
 * Select elements by string input.
 *
 * @param selector - The selector of the DOM element.
 */
function domSelectByString(selector: string): HTMLElement[] {
   let elementList = [];

   /**
    * Catch an empty selector.
    */
   if (selector && RocketIs.string(selector)) {
      const selectorSplit = RocketArray.clean(
         selector.split(',').map(RocketString.trim),
         true
      );

      /**
       * Iterate over the selector strings and get the elements.
       */
      selectorSplit.forEach((item: string) => {
         switch (RocketGet.selectorType(item)) {
            case SelectorType.GET_ELEMENT_BY_ID:
               elementList.push(document.getElementById(item.substring(1)));
               break;

            case SelectorType.GET_ELEMENT_BY_TAG:
               elementList = elementList.concat(Array.prototype.slice.call(document.getElementsByTagName(item)));
               break;

            case SelectorType.QUERY_SELECTOR_ALL:
               elementList = elementList.concat(Array.prototype.slice.call(document.querySelectorAll(item)));
               break;
         }
      });
   }

   /**
    * Return the result.
    */
   return elementList;
}

/**
 * Select the first, possibly unique element within the DOM. Only a single
 * element is required. The below uses a more performant
 * code block to complete this action.
 *
 * @param selector - The selector of the DOM element.
 */
function domSelectElement(selector: any): HTMLElement {
   /**
    * Catch non-web client sessions.
    */
   if (typeof document === undefined) {
      RocketError('You can only select an element within an html client.');
      return undefined;
   }
   /**
    * Determine the selector condition.
    */
   if (RocketIs.string(selector)) {
      /**
       * Work with a string selector input.
       */
      switch (RocketGet.selectorType(selector)) {
         case SelectorType.GET_ELEMENT_BY_ID:
            return document.getElementById(selector.substring(1));

         default:
            return document.querySelector(selector);
      }
   } else if (RocketIs.element(selector)) {
      /**
       * If the selector is an element than who knows why this function is being
       * called but just return the element back.
       */
      return selector;
   } else if (RocketIs.object(selector)) {
      /**
       * An object was detected so handle this use case properly.
       */
      if (selector === window || selector === document) {
         /**
          * Return document and window references.
          */
         return selector;
      } else {
         /**
          * Return the first found element in an array of elements.
          */
         selector = Array.prototype.slice.call(selector);

         if (RocketIs.array(selector) && selector.length > 0) {
            return selector[0];
         }
      }
   } else {
      /**
       * Fail correctly to undefined.
       */
      return undefined;
   }
}

/**
 * Setup an application to be "Rocket" ready, meaning add some CSS resets
 * directly onto the html and body tags of the app.
 */
function domSetup() {
   /**
    * Create the style tag first and set the type.
    */
   const styleTag = document.createElement('style');
   /**
    * Now create the content that will exist within the style tag.
    */
   const styleTagContent = document.createTextNode(`
*,
*:before,
*:after {
   -webkit-box-sizing: border-box;
   -moz-box-sizing: border-box;
   box-sizing: border-box;
}
html {
   font-family: 'Open Sans', Helvetica, Arial, sans-serif;
   color: #999;
   background-color: #fff;
   -ms-text-size-adjust: 100%;
   -webkit-texts-size-adjust: 100%;
   -webkit-backface-visibility: hidden;
}
body {
   margin: 0;
   padding: 0;
}`);
   /**
    * Append the style tag content to the tag itself.
    */
   styleTag.appendChild(styleTagContent);
   /**
    * Attach the new style tag to the header.
    */
   domHead.appendChild(styleTag);
}

/**
 * Export.
 */
export const RocketDOM = {
   body: domBody,
   element: domSelectElement,
   head: domHead,
   html: domHTML,
   ratio: domRatio,
   remove: domRemove,
   select: domSelect,
   setup: domSetup,
   title: domTitle,
   window: domWindow
};