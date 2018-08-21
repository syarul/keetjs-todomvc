import { createModel } from '../../keet'

class CreateModel extends createModel {
  clearCompleted () {
    this.list = this.list.filter(todo => !todo.completed)
  }
  updateAll (checked) {
    this.list = this.list.map(todo => ({ ...todo, completed: checked }))
  }
}

const todoModel = new CreateModel('filter')

export default todoModel
