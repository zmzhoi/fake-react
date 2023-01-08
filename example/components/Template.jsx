import { Component } from '../../src/fake-react/Component';

export default class Template extends Component {
  render() {
    return <div style={{ width: '100vw', height: '100vh' }}>{this.props.children}</div>;
  }
}
