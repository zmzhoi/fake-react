import { Component } from '../src/fake-react/Component';
import Header from './components/Header';
import Template from './components/Template';
import Todos from './components/Todos';

export default class App extends Component {
  init() {
    this.state = {
      count: 0,
    };
  }

  render() {
    return (
      <Template>
        <Header>Todo app using fake-react</Header>
        <Todos title="To-do" />
      </Template>
    );
  }
}
