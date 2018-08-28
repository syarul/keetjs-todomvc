import { CreateModel } from 'keet'

class TodoModel extends CreateModel {
  clearCompleted () {
    this.list = this.list.filter(todo => !todo.completed)
  }
  updateAll (checked) {
    this.list = this.list.map(todo => ({ ...todo, completed: checked }))
  }
}

const todoModel = new TodoModel('filter')

export default todoModel
