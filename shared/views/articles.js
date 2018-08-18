import {Link} from 'react-router-dom';
import { Article } from '../components';
import React from 'react';
import { connect } from 'react-redux';
import { fetchArticles } from '../actions/articles-actions';
import { getStore } from '../store';

class ArticlesClass extends React.Component {
	componentDidMount() {
		if (!this.props.articles.length) {
			getStore().dispatch(fetchArticles());
		}
	}
	render(){
		const {user, articles} = this.props;
		console.log(this.props)

		const listItems = articles.map((article, i) =>
				<Article key={article._id} article={article} user={this.props.user}/>
			);
		return (<div className="container">
				<ul id="mvpdList" className="articles-list">{listItems}</ul>
			</div>);
	}
}

function mapStateToProps (store) {
	return {
		user: store.user.user,
		userFetched: store.user.fetched,
		articles: store.articles.articles
	}
}

export const Articles = connect(mapStateToProps)(ArticlesClass);
