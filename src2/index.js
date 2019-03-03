import { vdom } from 'keet';
import App from './app';
// import 'todomvc-common';
// import 'todomvc-common/base.css';
// import 'todomvc-app-css/index.css';

vdom.render(<App />, document.querySelector('.todoapp'));
