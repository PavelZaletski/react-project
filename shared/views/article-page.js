import React from 'react';
import { getStore } from '../store';
import { fetchArticle, deleteArticle, fetchComments} from '../actions/articles-actions';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import processDate from '../processDate';
import { AddComment, Comments, Image } from '../components';
import showdown from 'showdown';
const converter = new showdown.Converter();
import Highlight from 'highlight.js';

class ArticlePageClass extends React.Component {
	constructor(props){
		super(props);
		this.deleteArticle = this.deleteArticle.bind(this);
	}

	componentWillMount(){
		// store.dispatch(fetchArticle(this.props.params.uniqueId));

		this.articleId = this.props.params && this.props.params.uniqueId || this.props.match.params && this.props.match.params.uniqueId

		getStore().dispatch(fetchComments(this.articleId));
	}

	componentDidMount() {
		let code = document.getElementById('text').querySelectorAll('pre code');

		code.forEach(function (block) {
			Highlight.highlightBlock(block);
		});
	}

	deleteArticle(e){
		e.preventDefault(e);
		const uniqueId = e.target.getAttribute('data-uniqueId');
		getStore().dispatch(deleteArticle(uniqueId, this.props.history));
	}

	render(){
		const articles = this.props.articles;
		const articleId = this.articleId;
		
		const user = this.props.user;
		let article;
		let len = articles && articles.length || 0;

		for (let i = 0; i < len; i++){
			if(articles[i].uniqueId === articleId){
				article = articles[i];
				break;
			}
		}

		if(article){
			let converted = converter.makeHtml(article.text);

			return (
				<div className="article-page">
					<link rel="stylesheet" type="text/css" href="/css/highlight/default.css"></link>
					<div className="container">
						<div className="article">
							<div className="article-header">
								<img className="avatar" src={'/image/' + article.author.urlToAvatar} />
								<span className="author">{article.author.firstname || null}</span>
								<span className="date">{processDate(article.publishedAt)}</span>
							</div>

							<h3>{article.title}</h3>
							<h4>{article.description}</h4>
							<Image article={article }/>
							<div id="text" className="text" dangerouslySetInnerHTML={{ __html: converted }} />

							{user.username === article.author.username ?
								<div className="buttons">
									<a className="btn btn-default" data-uniqueId={article.uniqueId} onClick={this.deleteArticle}>delete</a>
									<Link className="btn btn-default" to={'/article/edit/' + article.uniqueId}>edit</Link>
								</div>
								 : null}

						</div>
						<Comments comments={article.comments} className="comments"></Comments>
						{user.username ? <AddComment articleUniqueId={article.uniqueId} /> : null}
					</div>
				</div>
			);
		} else {
			return null;
		}
	}
}

function mapStateToProps (store) {
	return {
		user: store.user.user,
		userFetched: store.user.fetched,
		articles: store.articles.articles,
		// article: store.article
	}
}

export const ArticlePage = connect(mapStateToProps)(ArticlePageClass);