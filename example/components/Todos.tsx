import { Component } from '../../src/fake-react/Component';
import Todo from './Todo';

interface Props {
  title: string;
}

interface State {
  keyword: string;
  todos: { name: string; done: boolean }[];
}

export default class Todos extends Component<Props, State> {
  init() {
    this.state = {
      keyword: '',
      todos: [
        { name: '가짜 투두1', done: false },
        { name: '가짜 투두2', done: false },
      ],
    };
  }

  onToggle = (index: number) => {
    this.setState({
      ...this.state,
      todos: this.state.todos.map((todo, i) =>
        i === index ? { ...todo, done: !todo.done } : todo,
      ),
    });
  };

  onRemove = (index: number) => {
    this.setState({
      ...this.state,
      todos: this.state.todos.filter((_, i) => i !== index),
    });
  };

  onChange = (event) => {
    const nextValue = event.target.value;

    this.setState({
      ...this.state,
      keyword: nextValue,
    });
  };

  onKeyDown = (event) => {
    if (event.key === 'Enter') {
      if (event.isComposing) {
        return;
      }

      if (event.target.value.trim() === '') {
        alert('입력값이 없습니다.');
        return;
      }

      this.setState({
        keyword: '',
        todos: this.state.todos.concat({ name: this.state.keyword, done: false }),
      });
    }
  };

  render() {
    const { onChange, onKeyDown, onToggle, onRemove } = this;
    const { keyword, todos } = this.state;
    const { title } = this.props;

    return (
      <div style={containerStyle}>
        <p style={paragraphStyle}>{title}</p>
        <input
          type="text"
          value={keyword}
          onChange={onChange}
          onKeyDown={onKeyDown}
          style={inputStyle}
        />
        <ul style={ulStyle}>
          {
            todos.map(({ name, done }, index) => (
              <Todo
                index={index} //
                name={name}
                done={done}
                onToggle={onToggle}
                onRemove={onRemove}
              />
            )) //
          }
        </ul>
      </div>
    );
  }
}

const containerStyle = {
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  minWidth: '300px',
  width: '50vw',
  margin: '1rem auto',
};
const paragraphStyle = {
  fontSize: '1.5rem',
  width: '50vw',
  textAlign: 'center',
  borderBottom: '1px solid black',
  paddingBottom: '0.5rem',
};
const inputStyle = {
  padding: '7px 12px',
  border: '1px solid #bdbdbd',
  borderRadius: '4px',
  fontSize: '1rem',
  fontWeight: '500',
  margin: '1rem 0',
};
const ulStyle = { padding: '1rem', width: '100%' };
