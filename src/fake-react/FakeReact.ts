import { convertToInlineStyle } from 'src/libs/convert';
import { ReactComponent, ReactElement, ReactProps } from '../jsx-runtime';

export function renderRoot(dom: ReactElement, root: HTMLElement) {
  if (!root) {
    throw new Error('Cannot find root element.');
  }

  const realDom = createRealDom(dom);
  root.appendChild(realDom);
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
    parent.replaceChild(FakeReact.createRealDom(nextVirtualDom), parent.childNodes[index]);
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

  if (nextVirtualDom === null && currentVirutalDom !== null) {
    return true;
  }

  if (nextVirtualDom !== null && currentVirutalDom === null) {
    return true;
  }

  if (typeof nextVirtualDom !== typeof currentVirutalDom) {
    return true;
  }

  if ((nextVirtualDom as ReactComponent)?.props && (currentVirutalDom as ReactComponent)?.props) {
    const currentProps = (currentVirutalDom as ReactComponent).props;
    const nextProps = (nextVirtualDom as ReactComponent).props;

    const currentPropsLength = Object.keys(currentProps).length;
    const nextPropsLength = Object.keys(nextProps).length;

    if (currentPropsLength !== nextPropsLength) {
      return true;
    } else {
      for (const prop in currentProps) {
        if (prop === 'children') {
          continue;
        }

        if (!(prop in nextProps)) {
          return true;
        }

        if (prop === 'style') {
          if (convertToInlineStyle(currentProps[prop]) !== convertToInlineStyle(nextProps[prop])) {
            return true;
          }
        } else {
          if (currentProps[prop] !== nextProps[prop]) {
            return true;
          }
        }
      }
    }
  }

  if ((nextVirtualDom as ReactComponent)?.type !== (currentVirutalDom as ReactComponent)?.type) {
    return true;
  }

  return false;
}

function isEventProp(attr: string) {
  return attr.startsWith('on');
}

function setProps(dom: HTMLElement, props: ReactProps) {
  Object.keys(props).forEach((prop) => {
    if (prop === 'children') {
      return;
    } else if (isEventProp(prop)) {
      setEventListener(dom, prop, props[prop]);
    } else if (prop === 'style') {
      setAttribute(dom, prop, convertToInlineStyle(props[prop]));
    } else {
      setAttribute(dom, prop, props[prop]);
    }
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
  const eventName = event.replace('on', '').toLowerCase();
  dom.addEventListener(eventName, handler);
  // if(eventName === 'change') {
  //   input.dispatchEvent(new Event("change"));
  // } else {
  //   dom.addEventListener(eventName, handler);
  // }
}
