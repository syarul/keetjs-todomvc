import Keet, { html } from '../../keet'
import filterModel from './filter-model'
import todoList from './todo'

class App extends Keet {
  el = 'filters'
  filterModel = filterModel
  componentWillMount () {
    this.filterModel.subscribe(model => this.callBatchPoolUpdate())
    if (window.location.hash === '') {
      window.history.pushState({}, null, '#/all')
    }
  }
  componentDidMount () {
    this.updateUrl(window.location.hash)
    window.onpopstate = () => this.updateUrl(window.location.hash)
  }
  updateUrl (hash) {
    this.filterModel.switch(hash, { selected: true })
    todoList.filterTodo(hash)
  }
}

const filterApp = new App()

filterApp.mount(html`
  <ul id="filters" class="filters">
    <!-- {{model:filterModel}} -->
    <li id="{{name}}" k-click="updateUrl({{hash}})"><a class="{{selected?selected:''}}" href="{{hash}}">{{name}}</a></li>
    <!-- {{/model:filterModel}} -->
  </ul>`)

export default filterApp
