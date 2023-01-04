import { Component } from '../src/fake-react/refactor/Component';
import Header from './components/Header';
import Template from './components/Template';
import Todos from './components/Todos';

export default class App extends Component {
  init() {
    this.state = {
      count: 0,
    };
  }
  template() {
    return (
      <Template>
        {/* <Header>Todo app using fake-react</Header> */}
        {/* 1 */}
        <Todos title="To-do" />
        {/* <div>{this.state.count}</div> */}
        {/* <button onClick={() => this.setState({ count: this.state.count + 1 })}></button> */}
      </Template>
    );
  }
}
