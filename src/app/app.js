import Keet, { html } from '../../keet'
import filterApp from './filter'
import todoList from './todo'

const ENTER_KEY = 13

class App extends Keet {
  todoList = todoList
  filter = filterApp
  isChecked = false
  count = 0
  plural = ''
  clearToggle = false
  todoState = false

  componentWillMount () {
    todoList.subscribe(todos => {
      let uncompleted = todos.filter(c => !c.completed)
      let completed = todos.filter(c => c.completed)
      this.clearToggle = !!completed.length
      this.todoState = !!todos.length
      this.plural = uncompleted.length === 1 ? '' : 's'
      this.count = uncompleted.length
      this.isChecked = !uncompleted.length
    })
  }

  create (e) {
    if (e.keyCode !== ENTER_KEY) return
    let title = e.target.value.trim()
    if (title) {
      this.todoList.addTodo({ title, completed: false })
      e.target.value = ''
    }
  }

  completeAll () {
    this.isChecked = !this.isChecked
    this.todoList.todoModel.updateAll(this.isChecked)
  }

  clearCompleted () {
    this.todoList.todoModel.clearCompleted()
  }
}

const app = new App()

app.mount(html`
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
      <!-- {{component:filter}} -->
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
  </footer>`).link('todo')
