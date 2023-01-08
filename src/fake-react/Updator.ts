import type { ReactNode, ReactComponent, ReactConstructorComponent } from 'src/types';
import { createElement } from './FakeReact';
import { Component } from './Component';
import { convertToInlineStyle } from 'src/libs/utils';
import { Fiber, fibers } from './Fibers';

function isChanged(current: ReactComponent | string, next: ReactComponent | string) {
  if (typeof current === 'string' && typeof next === 'string') {
    return current !== next;
  } else if (typeof current === 'string') {
    return true;
  } else if (typeof next === 'string') {
    return true;
  } else if (current.type !== next.type) {
    return true;
  }

  const currentProps = Object.keys(current.props).filter((prop) => prop !== 'children');
  const nextProps = Object.keys(next.props).filter((prop) => prop !== 'children');

  // prop 개수가 다른 경우
  if (currentProps.length !== nextProps.length) {
    return true;
  }

  for (const prop of nextProps) {
    if (!(prop in current.props)) {
      return true;
    }

    if (prop === 'style') {
      if (convertToInlineStyle(current.props[prop]) !== convertToInlineStyle(next.props[prop])) {
        return true;
      }
    } else {
      if (current.props[prop] !== next.props[prop]) {
        return true;
      }
    }
  }
}

function changeElement(
  parent: HTMLElement,
  target: HTMLElement,
  current: ReactComponent | string,
  next: ReactComponent | string,
) {
  if (typeof current === 'string' && typeof next === 'string' && current !== next) {
    parent.replaceChild(createElement(next, parent) as Node, target);
    return;
  }

  if (typeof current === 'string' || typeof next === 'string') {
    parent.replaceChild(createElement(next, parent) as Node, target);
    return;
  }

  const excludeChildren = (prop) => prop !== 'children';
  const currentProps = Object.keys(current.props).filter(excludeChildren);
  const nextProps = Object.keys(next.props).filter(excludeChildren);

  const standardProps = currentProps.length > nextProps.length ? currentProps : nextProps;

  for (const prop of standardProps) {
    if (prop === 'style') {
      if (convertToInlineStyle(current.props[prop]) !== convertToInlineStyle(next.props[prop])) {
        target.setAttribute(prop, convertToInlineStyle(next.props[prop]));
      }
    } else {
      if (current.props[prop] !== next.props[prop]) {
        if ([null, undefined].includes(next.props[prop])) {
          target.removeAttribute(prop);
        } else {
          target.setAttribute(prop, next.props[prop]);
          if (
            target.tagName.toLocaleLowerCase() === 'input' &&
            target.getAttribute('type')?.toLocaleLowerCase() === 'text' &&
            prop === 'value'
          ) {
            (target as HTMLInputElement).value = next.props[prop];
          }
        }
      }
    }
  }
}

function isChangedInstanceProps(
  current: ReactConstructorComponent,
  next: ReactConstructorComponent,
) {
  const currentProps = Object.keys(current.props);
  const nextProps = Object.keys(next.props);

  if (currentProps.length !== nextProps.length) {
    return true;
  }

  for (const prop of nextProps) {
    if (!(prop in current.props)) {
      return true;
    }

    if (prop === 'children') {
      continue;
    } else if (prop === 'style') {
      if (convertToInlineStyle(current.props[prop]) !== convertToInlineStyle(next.props[prop])) {
        return true;
      }
    } else {
      if (current.props[prop] !== next.props[prop]) {
        return true;
      }
    }
  }

  return false;
}
export function updateInstance(
  context: Component,
  current: ReactNode,
  next: ReactNode,
  fiber: Fiber,
  parent: HTMLElement,
  index: number,
) {
  // next가 컴포넌트인 경우
  if (next && typeof next === 'object' && next.type instanceof Function) {
    if (current === null || typeof current !== 'object' || current.type !== next.type) {
      // next와 current가 다른 경우 -> 새로 생성
      const id = crypto.randomUUID();
      const constructor = next.type;
      const instance = new constructor(next.props);
      instance.id = id;

      const nextElement = createElement(instance.render(), parent, index);
      if (nextElement) {
        if (current === null) {
          parent.appendChild(nextElement);
        } else {
          parent.replaceChild(nextElement, parent.childNodes[index]);
        }
      }

      const newFiber: Fiber = {
        id,
        name: constructor.name,
        context: instance,
        index,
        parent,
        dom: nextElement,
      };
      fibers.set(newFiber);
    } else {
      // next와 current가 같은 경우 -> 리렌더링
      const _current = current as ReactConstructorComponent;
      const _next = next as ReactConstructorComponent;
      if (isChangedInstanceProps(_current, _next)) {
        const id = crypto.randomUUID();
        const constructor = _next.type;
        const instance = new constructor(_next.props);
        instance.id = id;

        const nextElement = createElement(instance.render(), parent, index);
        if (nextElement) {
          parent.replaceChild(nextElement, parent.childNodes[index]);
        }

        const newFiber: Fiber = {
          id,
          name: constructor.name,
          context: instance,
          index,
          parent,
          dom: nextElement,
        };
        fibers.set(newFiber);
      }
    }
  } else {
    // next가 일반 element인 경우

    updateElement(context, current, next, fiber, parent, index);
  }
}

function updateElement(
  context: Component,
  current: ReactNode,
  next: ReactNode,
  fiber: Fiber,
  parent: HTMLElement,
  index = 0,
) {
  if (current && !next) {
    // 삭제된 경우
    parent.removeChild(parent.childNodes[index]);
  } else if (!current && next) {
    // 추가된 경우
    parent.appendChild(createElement(next, parent, index) as Node);
  } else if (isChanged(current as ReactComponent, next as ReactComponent)) {
    changeElement(
      parent,
      parent.childNodes[index] as HTMLElement,
      current as ReactComponent,
      next as ReactComponent,
    );
  } else if (next && typeof next === 'object' && next.type) {
    // isChannged를 타지 않아서 이 곳에서는 current와 next의 타입은 모두 같다.
    if (current && typeof current === 'object' && current.type) {
      const maxLen = Math.max(next.props.children.length, current.props.children.length);

      for (let i = 0; i < maxLen; i++) {
        updateInstance(
          context,
          current.props.children[i] || null,
          next.props.children[i] || null,
          fiber,
          parent.childNodes[index] as HTMLElement,
          i,
        );
      }
    }
  }
}
