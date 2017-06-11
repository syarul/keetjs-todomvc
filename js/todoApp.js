/*global Keet, util*/

(function (exports) {
	'use strict';

	exports.todoApp = function (App) {
		var self = this;

		var cat = util.cat;

		var keet = function keet() {
			return new Keet(self);
		};

		this.todo = keet().link('todo', '{{todoapp}}{{info}}');

		this.todoapp = keet().template('section', 'todoapp').set('{{header}}{{main}}{{footer}}');

		this.header = keet()
			.template('header', 'header')
			.set(cat('<h1>todos</h1>', '<input id="new-todo" placeholder="What needs to be done?" autofocus>'));

		this.info = keet().template('footer', 'info')
			.set(cat(
				'<p>Double-click to edit a todo</p>', 
				'<p>Created by <a href="https://github.com/syarul">Shahrul Nizam Selamat</a></p>', 
				'<p>Part of <a href="http://todomvc.com">TodoMVC</a></p>'
			));

		this.main = keet().template('section', 'main')
			.set({
				value: cat(
					'<input k-click="completeAll()" id="toggle-all" type="checkbox">', 
					'<label for="toggle-all">Mark all as complete</label>',
					' ',
					'{{todoList}}'
				),
				'css-display': App.base.hasData
			}).watchObj(App.base, 'css-display', 'hasData');

		this.completeAll = function () {
			App.checkedAll(this.checked);
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

		this.footer = keet().template('footer', 'footer').set({
			value: '{{todoCount}}{{filters}}{{clearCompleted}}',
			'css-display': App.length.hasData
		}).watchObj(App.length, 'css-display', 'hasData');

		this.destroy = function (evt, id) {
			App.destroy(id);
		};

		this.completeTodo = function (evt, id) {
			App.todoCheck(id);
		};

		this.updateUrl = function (ev, uri) {
			App.updateFilter(uri);
		};

		this.todoCount = keet().template('span', 'todo-count').set(App.updateCount()).watchObj(App.count, function () {
			this.set(App.updateCount());
		});

		this.filters = keet().template('ul', 'filters')
			.array(App.filters, '<li k-click="updateUrl({{hash}})"><a class="{{className}}" href="{{hash}}">{{nodeValue}}</a></li>').watch();

		this.clearCompleted = keet().template('button', 'clear-completed').set({
			value: 'Clear completed',
			'css-display': App.complete.hasCompleted
		}).watchObj(App.complete, 'css-display', 'hasCompleted');

		this.todo.compose(function () {
			self.todoapp.compose(function () {
				self.header.bindListener('new-todo', App.create).bindListener('new-todo', App.create.bind(App), 'keydown');
				self.main.compose();
				App.updateCheckAll();
				App.checkedAll(null, true);
			});
			self.footer.compose(function () {
				self.clearCompleted.bindListener('clear-completed', App.clearCompleted.bind(App), 'click');
			});

			App.renderFooter();
		});
	};
})(window);