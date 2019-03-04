import { Component } from 'keet';
import { pluralize } from './util';
//{ completedCount > 0 ? (
//					<button class="clear-completed" onClick={onClearCompleted}>
//						Clear completed
//					</button>
//				) : null }
export default class TodoFooter extends Component {
	clear () {
		let a = this.props.completedCount > 0 ? (<button class="clear-completed" onClick={this.props.onClearCompleted}>
					Clear completed
				</button>
			) : null
		console.log(a)
		return a
	}
	render() {
		
		const {
			nowShowing,
			count,
			completedCount,
			onClearCompleted 
		} = this.props	
		console.log(completedCount, completedCount > 0)
		return (
			<footer class="footer">
				<span class="todo-count">
					<strong>{count}</strong> {pluralize(count, 'item')} left
				</span>
				<ul class="filters">
					<li>
						<a href="#/" class={nowShowing=='all' && 'selected'}>All</a>
					</li>
					<li>
						<a href="#/active" class={nowShowing=='active' && 'selected'}>Active</a>
					</li>
					<li>
						<a href="#/completed" class={nowShowing=='completed' && 'selected'}>Completed</a>
					</li>
				</ul>
				{ this.clear.call(this) }
			</footer>
		);
	}
}
