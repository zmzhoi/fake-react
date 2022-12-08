import { Component } from '../../src';

export default class Template extends Component {
  template() {
    return <div style={{ width: '100vw', height: '100vh' }}>{this.props.children}</div>;
  }
}
