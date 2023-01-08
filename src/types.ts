import { Component } from 'src/fake-react/Component';

export type TagName = keyof HTMLElementTagNameMap;
export type Props = Record<string, any> & { children: (ReactComponent | string)[] };
export type ReactConstructorComponent = {
  type: typeof Component;
  props: Props;
};
export type ReactComponent = {
  type: TagName | typeof Component;
  props: Props;
};
export type ReactNode = ReactComponent | string | null;
export interface Fiber {
  id: string;
  name: string;
  context: Component;
  parent: HTMLElement;
  children: Fiber[];
  index: number;
}
