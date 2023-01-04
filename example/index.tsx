import { fibers } from 'src/fake-react/refactor/Fibers';
import { renderRoot } from '../src/fake-react/refactor/FakeReact';
import App from './App';

const root = document.getElementById('root') as HTMLElement;
renderRoot(<App />, root);

console.log(fibers);
