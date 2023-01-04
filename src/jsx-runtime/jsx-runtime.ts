import { ReactComponent } from 'fake-react/jsx-runtime';
import { Component } from 'src/fake-react/Component';

function handleChildren(children: string | number | any[] | ReactComponent | null) {
  if (Array.isArray(children)) {
    return children.map((child) => {
      return typeof child === 'number' ? String(child) : child;
    });
  } else if (typeof children === 'string' || typeof children === 'number') {
    return [typeof children === 'number' ? String(children) : children];
  } else if (children?.type instanceof Function) {
    return [children];
  } else {
    return [];
  }
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
