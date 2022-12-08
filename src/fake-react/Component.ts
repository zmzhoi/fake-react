import type { ReactElement } from '../jsx-runtime';
import { updateRealDom } from './FakeReact';

export type SetStateFunction<S> = (previousState: S) => S;

export class Component<P = {}, S = {}> {
  container?: HTMLElement;
  props: P;
  state: S;
  mounted: boolean;
  currentVirtualDom?: ReactElement;

  constructor(props: P) {
    this.props = props;
    this.state = {} as S;
    this.mounted = false;

    this.init();
  }

  init() {}
  didMount() {}
  didUpdate() {}
  template() {
    return '';
  }
  setState(nextState: S) {
    this.state = nextState;
    this.rerender();
  }
  rerender() {
    const currentVirtualDom = this.currentVirtualDom;
    const nextVirtualDom = this.template();
    const parent = this.container?.parentElement as HTMLElement;
    const index = [...parent.childNodes].indexOf(this.container as HTMLElement);
    updateRealDom(parent, nextVirtualDom, currentVirtualDom as ReactElement, index);
    this.currentVirtualDom = nextVirtualDom;
  }
}
