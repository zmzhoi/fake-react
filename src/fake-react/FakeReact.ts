import { convertToInlineStyle } from 'src/libs/utils';
import { ReactComponent, ReactElement, ReactProps } from '../jsx-runtime';

const ComponentKey = Symbol();
const instanceMap = {};

export function renderRoot(dom: ReactElement, root: HTMLElement) {
  if (!root) {
    throw new Error('Cannot find root element.');
  }

  const realDom = createRealDom(dom);
  root.appendChild(realDom);
}

export function createElement(element: ReactElement) {
  if (element === null) {
    return null;
  }

  if (typeof element === 'string') {
    return document.createTextNode(element);
  }

  let realDom: HTMLElement;
  const { type, props } = element;

  if (type instanceof Function) {
    const constructor = type;
    const instance = new constructor(props);
    instance.currentVirtualDom = instance.template() as ReactElement;
    realDom = createRealDom(instance.currentVirtualDom);
    instance.container = realDom as HTMLElement;

    const key = uuid();
    instanceMap[key] = instance;
    instance[ComponentKey] = key;
  } else {
    realDom = document.createElement(type);
    setProps(realDom, props);
    props.children.forEach((child) => {
      const childRealDom = createRealDom(child);
      realDom.appendChild(childRealDom);
    });
  }

  return realDom;
}
export function createRealDom(virtualDom: ReactElement) {
  if (virtualDom === null) {
    return null;
  }

  let realDom: HTMLElement | Text;

  if (typeof virtualDom === 'string') {
    realDom = document.createTextNode(virtualDom);
    return realDom;
  }

  const { type, props } = virtualDom;

  if (type instanceof Function) {
    const instance = new type(props);
    instance.currentVirtualDom = instance.template() as ReactElement;
    realDom = createRealDom(instance.currentVirtualDom);
    instance.container = realDom as HTMLElement;

    const key = uuid();
    instanceMap[key] = instance;
    instance[ComponentKey] = key;
  } else {
    realDom = document.createElement(type);
    setProps(realDom, props);
    props.children.forEach((child) => {
      const childRealDom = createRealDom(child);
      realDom.appendChild(childRealDom);
    });
  }

  return realDom;
}

function changeChild(
  parent: HTMLElement,
  target: HTMLElement,
  nextVirtualDom: ReactElement,
  currentVirtualDom: ReactElement,
) {
  if (
    typeof currentVirtualDom === 'string' ||
    typeof nextVirtualDom === 'string' ||
    currentVirtualDom === null ||
    nextVirtualDom === null
  ) {
    parent.replaceChild(FakeReact.createRealDom(nextVirtualDom), target);
  } else {
    if (currentVirtualDom.type !== nextVirtualDom.type) {
      parent.replaceChild(FakeReact.createRealDom(nextVirtualDom), target);
      return;
    }

    for (const prop of Object.keys(nextVirtualDom.props)) {
      if (prop === 'children' || prop === 'style') {
        continue;
      }
      if (currentVirtualDom.props[prop] !== nextVirtualDom.props[prop]) {
        target.setAttribute(prop, nextVirtualDom.props[prop]);

        if (
          target.tagName.toLocaleLowerCase() === 'input' &&
          target.getAttribute('type')?.toLocaleLowerCase() === 'text' &&
          prop === 'value'
        ) {
          (target as HTMLInputElement).value = nextVirtualDom.props[prop];
        }
      }
    }
  }
}

export function updateRealDom(
  parent: HTMLElement,
  nextVirtualDom: ReactElement,
  currentVirutalDom: ReactElement,
  index = 0,
) {
  if (nextVirtualDom && !currentVirutalDom) {
    parent.appendChild(FakeReact.createRealDom(nextVirtualDom));
  } else if (!nextVirtualDom && currentVirutalDom) {
    parent.removeChild(parent.childNodes[index]);
  } else if (isChanged(nextVirtualDom, currentVirutalDom)) {
    changeChild(parent, parent.childNodes[index] as HTMLElement, nextVirtualDom, currentVirutalDom);
  } else if ((nextVirtualDom as ReactComponent)?.type) {
    const _currentVirutalDom = currentVirutalDom as ReactComponent;
    const _nextVirtualDom = nextVirtualDom as ReactComponent;
    const maxLen = Math.max(
      _nextVirtualDom.props.children.length,
      _currentVirutalDom.props.children.length,
    );

    for (let i = 0; i < maxLen; i++) {
      updateRealDom(
        parent.childNodes[index] as HTMLElement,
        _nextVirtualDom.props.children[i],
        _currentVirutalDom.props.children[i],
        i,
      );
    }
  }
}

export const FakeReact = {
  renderRoot,
  createRealDom,
  updateRealDom,
};

function isChanged(nextVirtualDom: ReactElement, currentVirutalDom: ReactElement) {
  if (typeof nextVirtualDom === 'string' && typeof currentVirutalDom === 'string') {
    return nextVirtualDom !== currentVirutalDom;
  }

  if (typeof nextVirtualDom === 'string' || typeof currentVirutalDom === 'string') {
    return true;
  }

  if (nextVirtualDom !== null && currentVirutalDom !== null) {
    if (nextVirtualDom.type !== currentVirutalDom.type) {
      return true;
    } else {
      const currentProps = currentVirutalDom.props;
      const nextProps = nextVirtualDom.props;

      const currentPropsLength = Object.keys(currentProps).length;
      const nextPropsLength = Object.keys(nextProps).length;

      if (currentPropsLength !== nextPropsLength) {
        return true;
      } else {
        for (const prop in currentProps) {
          // FIXME: children이 달라도 바꿔야하므로 true로 바꿔야한다.
          if (prop === 'children') {
            continue;
          }

          if (!(prop in nextProps)) {
            return true;
          }

          if (prop === 'style') {
            if (
              convertToInlineStyle(currentProps[prop]) !== convertToInlineStyle(nextProps[prop])
            ) {
              return true;
            }
          } else {
            if (currentProps[prop] !== nextProps[prop]) {
              return true;
            }
          }
        }

        return false;
      }
    }
  } else {
    return nextVirtualDom !== currentVirutalDom;
  }
}

function isEventProp(attr: string) {
  return attr.startsWith('on');
}
function isAttributeProp(attr: string) {
  return !attr.startsWith('on');
}

function setProps(dom: HTMLElement, props: ReactProps) {
  const attributes = Object.keys(props).filter(isAttributeProp);
  const events = Object.keys(props).filter(isEventProp);

  attributes.forEach((prop) => {
    if (prop === 'children') {
      return;
    } else if (prop === 'style') {
      setAttribute(dom, prop, convertToInlineStyle(props[prop]));
    } else {
      setAttribute(dom, prop, props[prop]);
    }
  });

  events.forEach((event) => {
    setEventListener(dom, event, props[event]);
  });
}

function setAttribute(dom: HTMLElement, attr: string, val: string) {
  if (typeof val === 'boolean') {
    if (val === true) {
      dom.setAttribute(attr, 'true');
      dom[attr] = true;
    } else {
      dom[attr] = false;
    }
  } else {
    dom.setAttribute(attr, val);
  }
}
function setEventListener(dom: HTMLElement, event: string, handler: () => void) {
  // if(dom.tagName === 'input' &&
  const eventName = event.replace('on', '').toLowerCase();

  if (
    eventName === 'change' &&
    dom.tagName.toLocaleLowerCase() === 'input' &&
    dom.getAttribute('type')?.toLocaleLowerCase() === 'text'
  ) {
    dom.addEventListener('input', handler);
  } else {
    dom.addEventListener(eventName, handler);
  }
}

function uuid() {
  return (`${[1e7]}` + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c: any) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
  );
}
