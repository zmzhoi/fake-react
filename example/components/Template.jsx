import { Component } from '../../src/fake-react/refactor/Component';

export default class Template extends Component {
  template() {
    return <div style={{ width: '100vw', height: '100vh' }}>{this.props.children}</div>;
  }
}
