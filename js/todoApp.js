/*global Keet, util*/

(function (exports) {
	'use strict';

	exports.todoApp = function(App) {

		var self = this

		var log = console.log.bind(console)

		var cat = util.cat;

		var todo = { 
			template: '{{todoapp}}{{info}}',
			todoapp: {
				tag: 'section',
				id: 'todoapp'
			},
			info: {
				tag: 'footer',
				id: 'info',
				template: cat(
					'<p>Double-click to edit a todo</p>', 
					'<p>Created by <a href="https://github.com/syarul">Shahrul Nizam Selamat</a></p>', 
					'<p>Part of <a href="http://todomvc.com">TodoMVC</a></p>'
				)
			}
		}

		var todoListCluster = function(){
			self.todoList = new Keet().mount({
				template: cat(
					'<li k-dblclick="editMode({{id}})" class="{{completed}}" data-id="{{id}}" style="display:{{display}}">',
						'<div class="view">', '<input k-click="completeTodo({{id}})" class="toggle" type="checkbox">',
							'<label>{{title}}</label>',
							'<button k-click="destroy({{id}})" class="destroy"></button>',
						'</div>',
						'<input class="edit" value="{{title}}">',
					'</li>'
				),
				list: App.todos,
				editMode: function(id){
					log('editMode', id)
				},
				destroy: function(id){
					log('destroy', id)
				},
				completeTodo: function(id){
					log('completeTodo', id)
				}
			}).link('todo-list')
		}

		var mainCluster = function() {
			self.main = new Keet().mount({
				template: '{{toggleAll}}{{toggleLabel}}{{todoList}}',
				toggleAll: {
					tag: 'input',
					id: 'toggle-all',
					type: 'checkbox',
					checked: false,
					style: {
						display: 'none'
					},
					'k-click': 'completeAll()'
					
				},
				toggleLabel: {
					template: '<label for="toggle-all">Mark all as complete</label>'
				},
				todoList: {
					tag: 'ul',
					id: 'todo-list'
				},
				completeAll: function(evt){
					App.checkedAll(self.todoList, this.checked);
				}
			}).link('main').cluster(todoListCluster)
		}

		var filtersCluster = function() {
			self.filters = new Keet().mount({
				template: cat(
					'<li k-click="updateUrl({{hash}})">',
						'<a class="{{className}}" href="{{hash}}">{{nodeValue}}</a>',
					'</li>'
				),
				list: App.filters
			})
		}

		var footerCluster = function(){
			self.footer = new Keet().mount({
				template: '{{todoCount}}{{filters}}{{clearCompleted}}',
				todoCount: {
					tag: 'span',
					id: 'todo-count',
					template: App.count
				},
				filters: {
					tag: 'ul',
					id: 'filters'
				},
				clearCompleted: {
					tag: 'button',
					id: 'clear-completed',
					style: {
						display: 'none'
					},
					'k-click': 'clearCompletedClicked()',
					template: 'Clear completed'
				},
				clearCompletedClicked: App.clearCompleted.bind(App)
			}).link('footer').cluster(filtersCluster)
		}

		var containerCluster = function() {
			self.container = new Keet().mount({
				template: '{{header}}{{main}}{{footer}}',
				header: {
					tag: 'header',
					id: 'header',
					template: cat(
						'<h1>todos</h1>', 
						'<input id="new-todo" k-keydown="create()" placeholder="What needs to be done?" autofocus>'
					)
				},
				main: {
					tag: 'section',
					id: 'main',
					style: {
						display: 'none'
					}
				},
				footer: {
					tag: 'footer',
					id: 'footer',
					style: {
						display: 'none'
					}
				},
				create: App.create.bind(App)
			}).link('todoapp').cluster(mainCluster, footerCluster)
		}

		this.todoapp = new Keet()

		this.todoapp.mount(todo).link('todo').cluster(containerCluster)

		// log(this)

	}

	// var header = new Keet().mount({ template: '{{todoapp}}{{info}}' }).link('todo')

	exports._todoApp = function (App) {

		// var cat = util.cat;

		// var ctx = {}

		// var keet = function keet() {
		// 	return new Keet(ctx);
		// };

		// log(keet())

		// let c = { template: '{{todoapp}}{{info}}' }

		// this.todo = Object.create()//.mount(c).link('todo');

		// log(this.todo)
		
		// this.todo = keet().link('todo', '{{todoapp}}{{info}}');

		this.todoapp = keet().template('section', 'todoapp')
			.set('{{header}}{{main}}{{footer}}');

		this.header = keet()
			.template('header', 'header')
			.set(cat(
					'<h1>todos</h1>', 
					'<input id="new-todo" placeholder="What needs to be done?" autofocus>'
				));

		this.info = keet().template('footer', 'info')
			.set(cat(
				'<p>Double-click to edit a todo</p>', 
				'<p>Created by <a href="https://github.com/syarul">Shahrul Nizam Selamat</a></p>', 
				'<p>Part of <a href="http://todomvc.com">TodoMVC</a></p>'
			));

		this.main = keet().template('section', 'main')
			.watchDistict(App.base, '{{toggleAll}}<label for="toggle-all">Mark all as complete</label>{{todoList}}');

		this.toggleAll = keet().template('input', 'toggle-all')
			.watchDistict(App.toggle);

		this.completeAll = function () {
			App.checkedAll(self.todoList, this.checked);
		};

		this.editMode = function (evt, id) {
			App.editTodos(id, this);
		};

		this.todoList = keet().template('ul', 'todo-list')
			.array(App.todos, cat(
				'<li k-double-click="editMode({{id}})" class="{{completed}}" data-id="{{id}}" style="display:{{display}}">',
					'<div class="view">', '<input k-click="completeTodo({{id}})" class="toggle" type="checkbox">',
						'<label>{{title}}</label>',
						'<button k-click="destroy({{id}})" class="destroy"></button>',
					'</div>',
					'<input class="edit" value="{{title}}">',
				'</li>')).watch();

		this.footer = keet().template('footer', 'footer')
			.watchDistict(App.length, '{{todoCount}}{{filters}}{{clearCompleted}}');

		this.destroy = function (evt, id) {
			App.destroy(id);
		};

		this.completeTodo = function (evt, id) {
			App.todoCheck(id);
		};

		this.updateUrl = function (ev, uri) {
			App.updateFilter(uri);
		};

		this.todoCount = keet().template('span', 'todo-count')
			.watchDistict(App.count);

		this.filters = keet().template('ul', 'filters')
			.array(App.filters, cat(
				'<li k-click="updateUrl({{hash}})">',
					'<a class="{{className}}" href="{{hash}}">{{nodeValue}}</a>',
				'</li>'
			)).watch();

		this.clearCompleted = keet().template('button', 'clear-completed')
			.watchDistict(App.complete, 'Clear completed');

		this.todo.compose(function () {
			self.todoapp.compose(function () {
				self.header
					.bindListener('new-todo', App.create)
					.bindListener('new-todo', App.create.bind(App), 'keydown');
				self.main.compose();
				App.updateCheckAll();
				App.checkedAll(self.todoList, null, true);
			});
			self.footer.compose(function () {
				self.clearCompleted
					.bindListener('clear-completed', App.clearCompleted.bind(App), 'click');
			});

			App.renderFooter();
		});
	};
})(window);