import Keet, { html } from '../../keet'
import todoModel from './todo-model'

const ENTER_KEY = 13
const ESC_KEY = 27

class App extends Keet {
  el = 'todo-list'
  todoModel = todoModel
  constructor () {
    super()
    this.todoModel.subscribe((model, filterModel) =>
      this.inform(model)
    )
  }
  addTodo (newTodo) {
    this.todoModel.add(newTodo)
  }
  evtTodo (obj, target) {
    if (target.className === 'toggle') {
      this.todoModel.update({ ...obj, completed: !obj.completed })
    } else if (target.className === 'destroy') {
      this.todoModel.destroy(obj)
    }
  }
  filterTodo (page) {
    if (page === '#/all') {
      this.todoModel.filter(null)
    } else if (page === '#/active') {
      this.todoModel.filter('completed', false)
    } else if (page === '#/completed') {
      this.todoModel.filter('completed', true)
    }
  }
  saveEditing (obj, title) {
    title === '' ? this.todoModel.destroy(obj) : this.todoModel.update({ ...obj, title: title })
  }
  editTodo (obj, target, node) {
    if (target.nodeName !== 'LABEL') return
    this.isEditing = true
    node.classList.add('editing')
    let input = node.querySelector('.edit')
    this.currentValue = input.value
    input.value = ''
    input.focus()
    input.value = this.currentValue
  }
  blurTodo (obj, target, node) {
    if (!this.isEditing) return
    this.saveEditing(obj, target.value.trim())
    node.classList.remove('editing')
    this.isEditing = false
  }
  keyTodo (obj, target, node, e) {
    if (e.which === ENTER_KEY || e.which === ESC_KEY) {
      node.classList.remove('editing')
      this.isEditing = false
      e.which === ENTER_KEY ? this.saveEditing(obj, target.value.trim()) : target.value = this.currentValue
    }
  }
}

const todoList = new App()

todoList.mount(html`
  <ul id="todo-list" class="todo-list" k-click="evtTodo()" k-dblclick="editTodo()" k-keydown="keyTodo()" k-blur="blurTodo(useCapture)" >
    <!-- {{model:todoModel}} -->
      <li class="{{completed?completed:''}}">
        <div class="view">
          <input class="toggle" type="checkbox" checked="{{completed?checked:''}}">
          <label>{{title}}</label>
          <button class="destroy"></button>
        </div>
        <input class="edit" value="{{title}}">
      </li>
    <!-- {{/model:todoModel}} -->
  </ul>`)

export default todoList
