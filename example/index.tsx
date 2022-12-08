import { renderRoot } from '../src';
import App from './App';

const root = document.getElementById('root') as HTMLElement;
renderRoot(<App />, root);
