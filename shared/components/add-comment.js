import React from 'react';
import { getStore } from '../store';
import { addComment } from '../actions/articles-actions';

export class AddComment extends React.Component {
	constructor(props){
		super(props);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(e){
		e.preventDefault(e);

		getStore().dispatch(addComment({
			articleUniqueId: this.props.articleUniqueId,
			text: document.getElementById('addCommentText').value
		}));
	}

	render(){
		const article = this.props.article;

		return <form id="addCommentForm" name="comment" >
			  <p>
			      <textarea name="text" id="addCommentText" placeholder="Your comment..."></textarea>
			  </p>
			  <input type="submit" value="add comment" id="addCommentButton" onClick={this.onSubmit}/>
			</form>
	}
}

