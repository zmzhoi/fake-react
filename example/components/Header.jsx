import { Component } from '../../src/fake-react/refactor/Component';

export default class Header extends Component {
  template() {
    return (
      <h1
        style={{
          background: '#3f51b5',
          color: '#fffafa',
          padding: '1.5rem',
          fontWeight: '600',
          fontSize: '2rem',
          textAlign: 'center',
          boxShadow: '0px 2px 8px 2px rgb(0 0 0 / 20%)',
        }}
      >
        {this.props.children}
      </h1>
    );
  }
}
