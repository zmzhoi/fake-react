import { Component } from '../../src';
import Todo from './Todo';

export default class Todos extends Component {
  init() {
    this.state = {
      keyword: '',
      todos: [],
    };
  }

  onToggle = (index) => {
    this.setState({
      ...this.state,
      todos: this.state.todos.map((todo, i) =>
        i === index ? { ...todo, done: !todo.done } : todo,
      ),
    });
  };
  onChange = (event) => {
    const nextValue = event.target.value;
    console.log(nextValue);
    this.setState({
      ...this.state,
      keyword: nextValue,
    });
  };

  onKeyDown = (event) => {
    if (event.key === 'Enter') {
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
  template() {
    const { onChange, onKeyDown, onToggle } = this;
    const { keyword, todos } = this.state;
    const { title } = this.props;

    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          minWidth: '300px',
          width: '50vw',
          margin: '1rem auto',
        }}
      >
        <p
          style={{
            fontSize: '1.5rem',
            width: '50vw',
            textAlign: 'center',
            borderBottom: '1px solid black',
            paddingBottom: '0.5rem',
          }}
        >
          {title}
        </p>
        <input
          type="text"
          value={keyword}
          onChange={onChange}
          onKeyDown={onKeyDown}
          style={{
            padding: '7px 12px',
            border: '1px solid #bdbdbd',
            borderRadius: '4px',
            fontSize: '1rem',
            fontWeight: '500',
            margin: '1rem 0',
          }}
        />
        <ul style={{ padding: '1rem', width: '100%' }}>
          {
            todos.map(({ name, done }, index) => (
              <Todo
                index={index}
                name={name}
                done={done}
                onToggle={onToggle} //
              />
            )) //
          }
        </ul>
      </div>
    );
  }
}
