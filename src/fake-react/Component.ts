import { fibers } from './Fibers';
import { updateInstance } from './Updator';

export type SetStateFunction<S> = (previousState: S) => S;

export class Component<P = any, S = any> {
  id?: string;
  props: P;
  state: S;
  private mounted: boolean;

  constructor(props: P) {
    this.props = props;
    this.state = undefined as S;
    this.mounted = false;

    this.init();
  }

  init() {}
  render() {
    return null;
  }

  setState(nextState: S) {
    const current = this.render();
    this.state = nextState;
    const next = this.render();
    const fiber = fibers.get(this.id as string);
    updateInstance(this, current, next, fiber, fiber.parent, fiber.index);
  }
}
