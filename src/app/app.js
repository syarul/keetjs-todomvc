import 'regenerator-runtime/runtime'
import Keet, { html } from '../../keet/keet'
import todoList, { todoModel } from './todo'
import { store } from './util'
import './filter'

const ENTER_KEY = 13
const STORE_KEY = 'keetjs'

class App extends Keet {
  el = 'todo'
  isChecked = false
  count = 0
  plural = ''
  clearToggle = false
  todoState = false

  componentWillMount () {
    todoModel.subscribe(todos => {
      store(STORE_KEY, todos)
      let uncompleted = todos.filter(c => !c.completed)
      let completed = todos.filter(c => c.completed)
      this.clearToggle = !!completed.length
      this.todoState = !!todos.length
      this.plural = uncompleted.length === 1 ? '' : 's'
      this.count = uncompleted.length
      this.isChecked = !uncompleted.length
    })
  }

  componentDidMount () {
    const data = store(STORE_KEY)
    data.map(obj => todoModel.add(obj))
  }

  create (e) {
    if (e.keyCode !== ENTER_KEY) return
    let title = e.target.value.trim()
    if (title) {
      todoList.addTodo({ title, completed: false, editing: false })
      e.target.value = ''
    }
  }

  completeAll () {
    this.isChecked = !this.isChecked
    todoModel.updateAll(this.isChecked)
  }

  clearCompleted () {
    todoModel.clearCompleted()
  }

  render () {
    return html`
      <section class="todoapp">
        <header id="header">
          <h1>todos</h1>
          <input id="new-todo" class="new-todo" k-keydown="create()" placeholder="What needs to be done?" autofocus>
        </header>
        <!-- {{?todoState}} -->
        <section class="main">
          <input id="toggle-all" class="toggle-all" type="checkbox" checked="{{isChecked?checked:''}}" k-click="completeAll()">
          <label for="toggle-all">Mark all as complete</label>
          <!-- {{component:todoList}} -->
        </section>
        <footer class="footer">
          <span class="todo-count">
            <strong>{{count}}</strong> item{{plural}} left
          </span>
          <!-- {{component:filters}} -->
          <!-- {{?clearToggle}} -->
          <button id="clear-completed" k-click="clearCompleted()" class="clear-completed">Clear completed</button>
          <!-- {{/clearToggle}} -->
        </footer>
        <!-- {{/todoState}} -->
      </section>
      <footer class="info">
        <p>Double-click to edit a todo</p>
        <p>Created by <a href="https://github.com/syarul">Shahrul Nizam Selamat</a></p>
        <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
      </footer>
    `
  }
}

export default new App()
