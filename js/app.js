/*global util, todoApp*/

(function () {
	'use strict';

	var App = {
		init: function init() {
			this.todos = util.store('todos-keetjs');
			var filters = ['all', 'active', 'completed'];
			this.filters = filters.map(function (f) {
				return {
					className: '',
					hash: '#/' + f,
					nodeValue: util.camelCase(f)
				};
			});

			this.complete = {};
			this.count = {};
			this.length = {};
			this.base = {};

			this.getActive();
			this.getCompleted();
			new todoApp(this);
		},
		filterTodos: function filterTodos(prop, compare, notEqual) {
			return this.todos.filter(function (f) {
				return notEqual ? f[prop] !== compare : f[prop] === compare;
			});
		},
		getIndex: function getIndex(id, cb) {
			var idx = this.todos.map(function (f) {
				return f.id;
			}).indexOf(id);
			if (~idx) cb(idx);
		},
		getActive: function getActive() {
			var actives = this.filterTodos('completed', 'completed', true);

			this.count.total = actives.length;
			this.length.hasData = this.todos.length ? 'block' : 'none';
			this.base.hasData = this.todos.length ? 'block' : 'none';
			return actives;
		},
		getCompleted: function getCompleted() {
			var completed = this.filterTodos('completed', 'completed');

			this.complete.hasCompleted = completed.length ? 'block' : 'none';
			return completed;
		},

		renderFooter: function renderFooter() {
			var self = this;
			if (window.location.hash !== '') {
				this.updateFilter(window.location.hash);
			} else {
				this.updateFilter('#/all');
				window.history.pushState({}, null, '#/all');
			}

			window.onpopstate = function () {
				self.updateFilter(window.location.hash);
			};
		},
		updateFilter: function updateFilter(hash) {
			var self = this;
			this.filters.map(function (f, i, r) {
				f.className = f.hash === hash ? 'selected' : '';
				if (f.className === 'selected') self.page = f.nodeValue;
				r.assign(i, f);
			});
			this.updatePage();
		},
		updatePage: function updatePage() {
			var self = this;
			this.todos.map(function (f, i, r) {
				if (self.page === 'Active' && f.completed === 'completed') f.display = 'none';
				else if (self.page === 'Completed' && f.completed !== 'completed') f.display = 'none';
				else f.display = 'block';
				r.assign(i, f);
			});
			util.store('todos-keetjs', this.todos);
			this.updateCheckAll();
			this.focus();
		},
		updateCount: function updateCount() {
			return util.cat('<strong>', this.count.total, '</strong> ', this.count.total === 1 ? 'item' : 'items', ' left');
		},
		create: function create(e, evt) {
			var value = e.trim();

			if (evt.which === 13) {
				this.todos.push({
					id: util.genId(),
					title: value,
					completed: '',
					display: ''
				});

				util.store('todos-keetjs', this.todos);

				document.getElementById('new-todo').value = '';
				this.getActive();
				this.updatePage();
				this.updateCheckAll();
				this.focus();
			}
		},
		editTodos: function editTodos(id, ele) {
			var self = this,
			    val,
			    input,
			    isEsc;
			ele.classList.add('editing');
			input = ele.querySelector('.edit');
			val = input.value;
			input.value = '';
			input.focus();
			input.value = val;

			function saveEditing() {
				var ctx = this;
				self.getIndex(id, function (idx) {
					if (ctx.value !== '') {
						ele.classList.remove('editing');
						var changed = self.todos[idx];
						changed.title = ctx.value.trim();
						self.todos.assign(idx, changed);
						self.focus();
					} else if (ctx.value === '') {
						ele.classList.remove('editing');
						self.todos.splice(idx, 1);
					}
				});
			}

			input.onblur = function () {
				ele.classList.remove('editing');
				if (isEsc) return;
				else {
					saveEditing.call(this);
					isEsc = false;
				}
			};

			input.onkeydown = function (e) {
				if (e.which === 13) {
					saveEditing.call(this);
				} else if (e.which === 27) {
					isEsc = true;
					ele.classList.remove('editing');
				}
			};
		},
		todoCheck: function todoCheck(id) {
			var self = this;
			this.getIndex(id, function (idx) {
				var changed = self.todos[idx];
				changed.completed = changed.completed === '' ? 'completed' : '';
				self.todos.assign(idx, changed);
				util.store('todos-keetjs', self.todos);
				self.getActive();
				self.updatePage();
				self.getCompleted();
				self.updateCheckAll();
			});

			this.focus();
		},
		destroy: function destroy(id) {
			var self = this;
			this.getIndex(id, function (idx) {
				self.todos.splice(idx, 1);
			});
			util.store('todos-keetjs', this.todos);
			this.updateCheckAll();
			this.focus();
		},
		clearCompleted: function clearCompleted() {
			var len = this.todos.length;
			while (len--) {
				var idx = this.todos.map(function (f, i) {
					return f.completed;
				}).indexOf('completed');

				if (~idx) this.todos.splice(idx, 1);
				util.store('todos-keetjs', this.todos);
				this.getActive();
			}
			this.updateCheckAll();
			this.focus();
		},
		focus: function focus() {
			document.getElementById('new-todo').focus();
		},
		updateCheckAll: function updateCheckAll() {
			var page = this.page,
			    hasTodo = this.todos.length ? true : false,
			    isAllCompleted = this.todos.length === this.getCompleted().length ? true : false,
			    isAllNotCompleted = this.todos.length === this.getActive().length ? true : false,
			    hasSomeCompleted = this.todos.some(function (f) {
				return f.completed === 'completed';
			}),
			    i;
			if (page === 'All') i = hasTodo ? isAllCompleted ? 2 : 1 : 0;
			else if (page === 'Active') i = hasTodo ? isAllCompleted ? 0 : 1 : 0;
			else if (page === 'Completed') i = hasTodo && isAllNotCompleted ? 0 : hasTodo && isAllCompleted ? 2 : hasTodo && hasSomeCompleted ? 1 : 0;
			this.updateCheckInput(i);
		},
		updateCheckInput: function updateCheckInput(i) {
			var e = document.getElementById('toggle-all');
			if (i == 1) {
				e.style.display = 'block';
				e.checked = false;
			} else if (i == 2) {
				e.style.display = 'block';
				e.checked = true;
			} else {
				e.style.display = 'none';
			}
		},
		checkedAll: function checkedAll(state, initial) {
			var self = this;
			this.todos.forEach(function (f) {
				var e = document.querySelector(util.cat('[data-id="', f.id, '"]'));
				var input = e.getElementsByClassName('toggle')[0];

				if (!initial && state && f.completed !== 'completed') input.click();
				else if (!initial && !state && f.completed === 'completed') input.click();
				else if (initial && f.completed === 'completed' && !input.checked) input.checked = true;
			});
			this.focus();
		}
	};

	App.init();
})();