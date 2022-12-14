# Fake React
React 동작 방식을 이해하기 위해 만들어보는 ~~가짜 리액트~~

## Features.
- [x] JSX Rendering.
- [x] Diffing virtual dom. 
- [x] Detect State and Props.
- [ ] Track `onchange` event of input tag.
- [ ] Optimization, Reafactoring.


## Installation
```
npm i fake-react2
```

## Usage
```javascript
import { renderRoot, Component } from 'fake-react2';

class Counter extends Component {
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

  template() {
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
  template() {
    return (
      <Counter />
    );
  }
}

const root = document.getElementById('root');
renderRoot(<App />, root);
```
