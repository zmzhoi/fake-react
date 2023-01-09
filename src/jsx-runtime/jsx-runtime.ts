import { Component } from 'src/fake-react/Component';
import type { ReactComponent } from '../types';

function handleChildren(children: string | number | any[] | ReactComponent | null) {
  if (Array.isArray(children)) {
    return children.map((c) => String(c));
  }

  const resolved = typeof children === 'object' ? children : String(children);
  return [resolved];
}

export function jsx(
  type: keyof HTMLElementTagNameMap | Component,
  props: {
    [key: string]: any;
    children: string | number | any[];
  },
) {
  return {
    type,
    props: {
      ...props,
      children: handleChildren(props.children),
    },
  };
}
export const jsxs = jsx;
