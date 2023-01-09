import { convertToInlineStyle } from 'src/libs/utils';
import { ReactNode, Props, ReactConstructorComponent } from '../types';
import { Fiber, fibers } from './Fibers';

export function renderRoot(element: ReactNode, root: HTMLElement) {
  if (!root) {
    throw new Error('Cannot find root element.');
  }

  if (root.childNodes.length > 0) {
    throw new Error('root element should be empty.');
  }

  root.appendChild(createElement(element, root) as Node);
}

export function createElement(
  element: ReactNode,
  parent: HTMLElement,
  index = 0,
): HTMLElement | Text | null {
  if (element === null) {
    return null;
  }

  // 텍스트 element인 경우
  if (typeof element === 'string') {
    const domElement = document.createTextNode(element);
    return domElement;
  }

  // 일반 element인 경우
  if (typeof element.type === 'string') {
    const domElement = document.createElement(element.type);
    setProps(domElement, element.props);

    element.props.children.forEach((child, index) => {
      const childElement = createElement(child, domElement, index) as Node;
      if (childElement) {
        domElement.appendChild(childElement);
      }
    });

    return domElement;
  }

  // 컴포넌트인 경우
  const createdElement = createInstance(element as ReactConstructorComponent, parent, index);

  return createdElement;
}

export function createInstance(element: ReactConstructorComponent, parent: HTMLElement, index = 0) {
  const id = crypto.randomUUID();
  const constructor = element.type;
  const instance = new constructor(element.props);
  instance.id = id;

  const template = (instance.render() as ReactNode) || null;
  const createdElement = createElement(template, parent, index);
  const fiber: Fiber = {
    id,
    name: constructor.name,
    context: instance,
    index,
    parent,
    dom: createdElement,
  };

  fibers.set(fiber);

  return createdElement;
}

function isEventProp(attr: string) {
  return attr.startsWith('on');
}
function isAttributeProp(attr: string) {
  return !attr.startsWith('on');
}

function setProps(element: HTMLElement, props: Props) {
  const attributes = Object.keys(props).filter(isAttributeProp);
  const events = Object.keys(props).filter(isEventProp);

  const excludeChildren = (attr) => attr !== 'children';
  attributes.filter(excludeChildren).forEach((attr) => {
    if (attr === 'style') {
      setAttribute(element, attr, convertToInlineStyle(props[attr]));
    } else {
      setAttribute(element, attr, props[attr]);
    }
  });

  events.forEach((event) => {
    setEventListener(element, event, props[event]);
  });
}

function setAttribute(element: HTMLElement, attr: string, val: string) {
  if (typeof val === 'boolean') {
    if (val === true) {
      element.setAttribute(attr, 'true');
      element[attr] = true;
    } else {
      element[attr] = false;
    }
  } else {
    element.setAttribute(attr, val);
  }
}
function setEventListener(element: HTMLElement, event: string, handler: () => void) {
  const eventName = event.replace('on', '').toLowerCase();

  if (
    eventName === 'change' &&
    element.tagName.toLocaleLowerCase() === 'input' &&
    element.getAttribute('type')?.toLocaleLowerCase() === 'text'
  ) {
    // input[type=text]의 onChange로 등록했던 change 이벤트 핸들러는 input 이벤트로 치환해서 등록한다.
    element.addEventListener('input', handler);
  } else {
    element.addEventListener(eventName, handler);
  }
}
