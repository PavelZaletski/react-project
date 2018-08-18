let initialState = {
	articles: [],
	fetching: false,
	fetched: false,
	error: null
};

export default function (state = initialState, action){
	switch(action.type){
		case 'FETCH_TWEETS_REJECTED': {
			return Object.assign({}, state, { fetching: false, error: action.payload });
		}
		case 'FETCH_TWEETS_FULFILLED': {
			return Object.assign({}, state, {
				fetching: false,
				fetched: true,
				articles: action.payload
			});
		}
		case 'FETCH_ARTICLE_FULFILLED': {
			if(state.articles.length === 0){
				return Object.assign({}, state, {
					articles: [action.payload]
				});
			} else {
				let newArticles = state.articles.concat([]);
				
				for(let i = 0; i < newArticles.length; i++){
					if(newArticles[i].uniqueId === action.payload.uniqueId){
						newArticles[i] = action.payload;
					}
				}
				return Object.assign({}, state, {
					articles: newArticles
				});
			}
		}
		
		case 'FETCH_COMMENTS_FULFILLED': {
			if (state.articles.length !== 0) {

				let newArticles = state.articles.concat([]);

				for (let i = 0; i < newArticles.length; i++) {
					if (newArticles[i].uniqueId === action.payload.uniqueId) {
						newArticles[i] = Object.assign({}, newArticles[i]);
						newArticles[i].comments = action.payload.comments;
					}
				}
				return Object.assign({}, state, {
					articles: newArticles
				});
			}
		}

		case 'UPDATE_ARTICLE_FULFILLED': {
			let newArticles = state.articles.concat([]);
			
			for(let i = 0; i < newArticles.length; i++){
				if (newArticles[i].uniqueId === action.payload.uniqueId){
					newArticles[i] = Object.assign({}, newArticles[i], action.payload);
					break;
				}
			}
			return Object.assign({}, state, {
				articles: newArticles
			});
		}
		case 'ADD_TWEET_FULFILLED': {
			return Object.assign({}, state, {
				articles: state.articles.concat([action.payload])
			});
		}

		case 'ADD_COMMENT_FULFILLED': {
			let newArticles = state.articles.concat([]);
			
			for(let i = 0; i < newArticles.length; i++){
				if(newArticles[i].uniqueId === action.payload.articleUniqueId){
					newArticles[i].comments.push(action.payload);
				}
			}

			document.getElementById('addCommentText').value = '';

			return Object.assign({}, state, {
				articles: newArticles
			});
		}

		case 'DELETE_ARTICLE_FULFILLED': {
			if(action.payload.status === 'success'){
				return Object.assign({}, state, {
					articles: state.articles.filter(article => article.uniqueId !== action.payload.uniqueId)
				});
			} else {
				console.log(action.payload.message);
			}
		}
	}
	
	return state;
}
