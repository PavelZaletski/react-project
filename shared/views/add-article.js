import React from 'react';
import { connect } from 'react-redux';
import { getStore } from '../store';
import { addArticle } from '../actions/articles-actions';
import { FileInput } from '../components';

export class AddArticle extends React.Component {
	constructor(props){
		super(props);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(e){
		e.preventDefault();
		const f = new FormData(document.getElementById('addArticleForm'));
		const input = document.getElementById('imgFile');

		if(!f.get('title')){
			alert('please, write title');
			return;
		}

		if(!input.files || !input.files[0]){
			alert('please, choose an image');
			return;
		}

		getStore().dispatch(addArticle(f, this.props.history));
	}

	render() {
		return (
			<div className="container" >
				<form id="addArticleForm" action="../article/create" method="POST" encType="multipart/form-data">
					<FileInput />
					<p>
						<input className="form-control" type="text" name="title" required="required" placeholder="title..."/>
					</p>
					<p>
						<input className="form-control" type="text" name="description" placeholder="description..."/>
					</p>
					<p>
						<textarea name="text" placeholder="text..."></textarea>
					</p>
					<input className="btn btn-blue" type="submit" value="add article" required="required" onClick={this.onSubmit} />
				</form>
			</div>
		);
	}
}