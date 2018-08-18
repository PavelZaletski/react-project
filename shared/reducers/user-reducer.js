let initialState = {
	user: {
		firstName: null,
		lastName: null,
		username: null,
		urlToAvatar: null,
	},
	fetching: false,
	fetched: false,
	error: null
};

export default function(state = initialState, action){
	switch(action.type){
		case 'FETCH_USER': {
			return Object.assign({}, state, {fetching: true});
		}
		case 'FETCH_USER_REJECTED': {
			return Object.assign({},  state, {fetching: false, error: action.payload});
		}
		case 'FETCH_USER_FULFILLED': {
			return Object.assign({}, state, {
				fetching: false,
				fetched: true,
				user: action.payload
			});
		}
		case 'USER_LOGOUT': {
			return Object.assign({}, state, initialState);
		}
		case 'CREATE_ACCOUNT_FULFILLED': {
			return Object.assign({}, state, {
				fetching: false,
				fetched: true,
				user: action.payload
			});
		}
	}
	return state;
}
