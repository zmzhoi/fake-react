// import { fibers } from 'src/fake-react/Fibers';
// import { renderRoot } from '../src/fake-react/FakeReact';
// import App from './App';

// const root = document.getElementById('root') as HTMLElement;
// renderRoot(<App />, root);

// console.log(fibers);

import { renderRoot, Component } from '../src/fake-react';

interface State {
  count: number;
}
class Counter extends Component<{}, State> {
  init() {
    this.state = {
      count: 0,
    };
  }

  increase = () => {
    this.setState({ count: this.state.count + 1 });
  };

  decrease = () => {
    this.setState({ count: Math.max(this.state.count - 1, 0) });
  };

  render() {
    return (
      <div>
        <span>{this.state.count}</span>
        <button onClick={() => this.increase()}>+</button>
        <button onClick={() => this.decrease()}>-</button>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return <Counter />;
  }
}

const root = document.getElementById('root') as HTMLElement;
renderRoot(<App />, root);
