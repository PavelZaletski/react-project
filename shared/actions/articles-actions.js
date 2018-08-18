import axios from 'axios';
import {browserHistory} from 'react-router-dom';

export function fetchArticles(){
	return function(dispatch){

		// axios.get('http://rest.learncode.academy/api/test123/tweets')
		axios({
			url: '/article',
			 method: 'get'
		})
			.then((response) => {
				dispatch({type: 'FETCH_TWEETS_FULFILLED', payload: response.data})
			})
			.catch((err) => {
				dispatch({type: 'FETCH_TWEETS_REJECTED', payload: err})
			})
	}
}

export function addArticle(formdata, history){
	return function(dispatch){
		axios({
				url: '/article/create',
				data: formdata,
				contentType: 'multipart/form-data',
				method: 'post'
			})
			.then((response) => {
				dispatch({type: 'ADD_TWEET_FULFILLED', payload: response.data});
				history.push('/');
			})
			.catch((err) => {
				dispatch({type: 'ADD_TWEET_REJECTED', payload: err})
			})
	}
}

export function deleteArticle(uniqueId, history){
	return function(dispatch){
		axios.get(`/article/delete/${uniqueId}`)
			.then((response) => {
				dispatch({type: 'DELETE_ARTICLE_FULFILLED', payload: response.data});
				history.push('/');
			})
			.catch((err) => {
				dispatch({type: 'DELETE_ARTICLE_REJECTED', payload: err})
			})
	}
}

export function updateArticle(formdata, uniqueId, history){
	return function(dispatch){
		axios({
				url : `/article/update/${uniqueId}`,
				data: formdata,
				contentType: 'multipart/form-data',
				method: 'post'
			})
			.then((response) => {
				dispatch({type: 'UPDATE_ARTICLE_FULFILLED', payload: response.data});
				history.push(`/article/${uniqueId}`);
			})
			.catch((err) => {
				dispatch({type: 'UPDATE_ARTICLE_REJECTED', payload: err})
			})
	}
}

export function fetchArticle(uniqueId){
	return function(dispatch){
		axios({
			url: `/article/${uniqueId}`,
			 method: 'get'
		})
		.then((response) => {
			dispatch({type: 'FETCH_ARTICLE_FULFILLED', payload: response.data})
		})
		.catch((err) => {
			dispatch({type: 'FETCH_ARTICLE_REJECTED', payload: err})
		});
	}
}

export function fetchComments(uniqueId) {
	return function (dispatch) {
		axios({
			url: `/comment/${uniqueId}`,
			method: 'get'
		})
			.then((response) => {
				dispatch({ type: 'FETCH_COMMENTS_FULFILLED', payload: response.data })
			})
			.catch((err) => {
				dispatch({ type: 'FETCH_COMMENTS_REJECTED', payload: err })
			});
	}
}

export function addComment(formdata){
	var articleUniqueId = formdata.articleUniqueId;
	return function(dispatch){
		axios({
			url: '/comment/create',
			method: 'post',
			data: formdata,
			// contentType: 'multipart/form-data'
		})
		.then((response) => {
			response.data.articleUniqueId = articleUniqueId;
			dispatch({type: 'ADD_COMMENT_FULFILLED', payload: response.data})
		})
		.catch((err) => {
			dispatch({type: 'ADD_COMMENT_REJECTED', payload: err})
		});
	}
}
