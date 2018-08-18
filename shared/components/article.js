import React from 'react';
import store from '../store';
import { deleteArticle } from '../actions/articles-actions';
import processDate from '../processDate';
import { Link } from 'react-router-dom';
import { Image } from './image';

export class Article extends React.Component {
	constructor(props){
		super(props);
		this.deleteArticle = this.deleteArticle.bind(this);
	}

	deleteArticle(e){
		e.preventDefault(e);
		const uniqueId = e.target.getAttribute('data-uniqueId');
		store.dispatch(deleteArticle(uniqueId));
	}

	render(){
		const article = this.props.article;

		return (
			<li className="article">
				<div className="article-header">
					<img className="avatar" src={'image/' + article.author.urlToAvatar} />
					<span className="author">{article.author.firstname || ''}</span>
					<span className="date">{processDate(article.publishedAt)}</span>
				</div>

				<Link className="link" to={'/article/' + article.uniqueId}>
					<Image article={article} />
				</Link>

				<h3>{article.title}</h3>
				
				<h4>{article.description}</h4>
			</li>
		);
	}
}
