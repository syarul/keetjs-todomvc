import Keet, { html, childLike } from 'keet'
import FilterModel from './filter-model'
import todoList from './todo'
import { camelCase } from './util'

@childLike()
class App extends Keet {
  el = 'filters'
  filterModel = new FilterModel()

  componentWillMount () {
    this.filterModel.subscribe(model => this.callBatchPoolUpdate())
    if (window.location.hash === '') {
      window.history.pushState({}, null, '#/all')
    }
  }

  componentDidMount () {
    this.filterModel.switch(window.location.hash, { selected: true })
    if (window.location.hash !== '#/all') {
      todoList.filterTodo(window.location.hash)
    }
    window.onpopstate = () => this.updateUrl(window.location.hash)
  }

  updateUrl (hash) {
    this.filterModel.switch(hash, { selected: true })
    todoList.filterTodo(hash)
  }

  render () {
    Array.from(['all', 'active', 'completed']).map(page =>
      this.filterModel.add({
        hash: `#/${page}`,
        name: camelCase(page),
        selected: false
      })
    )

    return html`
      <ul id="filters" class="filters">
        <!-- {{model:filterModel}} -->
        <li id="{{name}}" k-click="updateUrl()"><a class="{{selected?selected:''}}" href="{{hash}}">{{name}}</a></li>
        <!-- {{/model:filterModel}} -->
      </ul>
    `
  }
}

export default new App()
