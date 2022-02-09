import { isEmpty } from 'lodash-es';

export function format(first: string, middle: string, last: string): string {
  return (first || '') + (!isEmpty(middle) ? ` ${middle}` : '') + (!isEmpty(last) ? ` ${last}` : '');
}
