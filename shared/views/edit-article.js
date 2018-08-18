import React from 'react';
import { connect } from 'react-redux';
import { getStore } from '../store';
import { updateArticle } from '../actions/articles-actions';
import { FileInput } from '../components';

class UpdateArticleClass extends React.Component {
	constructor(props){
		super(props);
		this.onSubmit = this.onSubmit.bind(this);
		this.onFileSelect = this.onFileSelect.bind(this);
	}

	componentWillMount() {
		this.articleId = this.props.params && this.props.params.uniqueId || this.props.match.params && this.props.match.params.uniqueId
	}

	onSubmit(e){
		e.preventDefault();
		const f = new FormData(document.getElementById('updateArticleForm'));

		getStore().dispatch(updateArticle(f, this.articleId, this.props.history));
	}

	onFileSelect(e){
		var input = document.getElementById('imgFile');
		 if (input.files && input.files[0]) {
			let reader = new FileReader();

			reader.onload = function (e) {
				var imgElement = document.getElementById('imgPreview');
				imgElement.setAttribute('src', e.target.result);
			};

			reader.readAsDataURL(input.files[0]);
		}
	}
	render() {
	  	const articles = this.props.articles;
		const articleId = this.articleId;

		let article;

		if(articles){
			for(let i = 0; i < articles.length; i++){
				if(articles[i].uniqueId === articleId){
					article = articles[i];
					break;
				}
			}
			if(article){
				return (
					<div className="update-article">
						<div className="container">
							<div className="article">
								<div id="addAricleForm" className="form-wrapper" >
									<form id="updateArticleForm" action="../article/create" method="POST" encType="multipart/form-data">
										<FileInput src={'/image/' + article.urlToImage} />
										<p>
											<input id="textInput" className="title-input" type="text" name="title" defaultValue={article.title} required="required"/>
										</p>
										<p>
											<input id="descriptionInput" className="description-input" type="text" name="description" defaultValue={article.description}/>
										</p>
										<p>
											<textarea id="articleText" name="text" defaultValue={article.text}></textarea>
										</p>
										<input className="btn btn-green" type="submit" value="update" required="required" onClick={this.onSubmit}/>
									</form>
								</div>
							</div>
						</div>
					</div>
				);
			} else {
				return null;
			}
		} else {
			return null;
		}
	}
}

function mapStateToProps (store) {
	return {
		user: store.user.user,
		articles: store.articles.articles
	}
}

export const EditArticle = connect(mapStateToProps)(UpdateArticleClass);