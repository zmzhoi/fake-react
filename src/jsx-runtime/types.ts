import { Component } from 'src/fake-react/Component';

export type TagName = keyof HTMLElementTagNameMap;
export type ReactProps = {
  [key: string]: any;
  children: (ReactComponent | string)[];
};
export type ReactComponent = {
  type: TagName | typeof Component;
  props: ReactProps;
};

export type ReactElement = ReactComponent | string | null;
