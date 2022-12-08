import { Component } from '../../src';

export default class Todo extends Component {
  template() {
    const { index, name, done, onToggle } = this.props;
    return (
      <li style={{ marginBottom: '1rem' }}>
        <div
          style={{
            textDecoration: done ? 'line-through' : 'none',
            display: 'inline-block',
            marginRight: '1rem',
          }}
        >
          {index + 1}. {name}
        </div>
        <button
          style={{
            color: 'white',
            fontSize: '0.9rem',
            background: done ? '#2196f3' : '#3f50b5',
            border: 'none',
            borderRadius: '3px',
            padding: '6px 0',
            boxSizing: 'border-box',
            width: '85px',
            cursor: 'pointer',
          }}
          onClick={() => onToggle(index)}
        >
          {done ? 'Redo' : 'Complete'}
        </button>
      </li>
    );
  }
}
