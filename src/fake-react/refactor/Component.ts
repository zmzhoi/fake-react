import { fibers } from './Fibers';
import { updateInstance } from './Updator';

export type SetStateFunction<S> = (previousState: S) => S;

export class Component<P = any, S = any> {
  id?: string;
  props: P;
  state?: S;
  private mounted: boolean;

  constructor(props: P) {
    this.props = props;
    this.mounted = false;

    this.init();
  }

  init() {}
  template() {
    return null;
  }

  setState(nextState: S) {
    const current = this.template();
    this.state = nextState;
    const next = this.template();
    const fiber = fibers.get(this.id as string);
    updateInstance(this, current, next, fiber.parent, fiber.index);
    console.log(fibers);
  }
}
