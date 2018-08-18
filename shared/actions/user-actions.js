import axios from 'axios';

export function fetchUser(){
	return function(dispatch){
		axios.get('/check')
			.then((response) => {
				dispatch({type: 'FETCH_USER_FULFILLED', payload: response.data})
			})
			.catch((err) => {
				dispatch({type: 'FETCH_USER_REJECTED', payload: err})
			})
	}
}

export function authorizeUser(username, password, history){
	return function(dispatch){
		axios.post('/login', {
				username,
				password
			})
			.then((response) => {
				dispatch({type: 'FETCH_USER_FULFILLED', payload: response.data});
				history.push('/');
			})
			.catch((err) => {
				dispatch({type: 'FETCH_USER_REJECTED', payload: err})
			});
	}
}

export function logoutUser(){
	return function(dispatch){
		axios.get('/logout')
			.then((response) => {
				dispatch({type: 'USER_LOGOUT', payload: response.data});
			})
			.catch((err) => {
				dispatch({type: 'USER_LOGOUT_REJECTED', payload: err})
			});
	}
}

export function createAccount(formdata, history){
	return function(dispatch){
		axios({
				url: '/create-account',
				method: 'post',
				data: formdata,
				contentType: 'multipart/form-data'
			})
			.then((response) => {
				dispatch({type: 'CREATE_ACCOUNT_FULFILLED', payload: response.data});
				history.push('/');
			})
			.catch((err) => {
				dispatch({type: 'CREATE_ACCOUNT_REJECTED', payload: err})
			});
	}
}
