import { Component } from 'src/fake-react/Component';

function handleChildren(children: string | number | any[] | null) {
  if (Array.isArray(children)) {
    return children.map((child) => {
      return typeof child === 'number' ? String(child) : child;
    });
  } else if (typeof children === 'string' || typeof children === 'number') {
    return [typeof children === 'number' ? String(children) : children];
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
