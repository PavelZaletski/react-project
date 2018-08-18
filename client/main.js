import '../client/styl/common.styl';
import '../client/styl/news.styl';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createNewStore } from '../shared/store';
import { BrowserRouter as Router, Route,  browserHistory } from 'react-router-dom';
import App from '../shared/app';

const store = createNewStore(window.PRELOADED_STATE);

delete window.PRELOADED_STATE;

const init = ()=>{
	const root = document.getElementById('root');

	ReactDOM.render((
		<Provider store={store}>
			<Router history={browserHistory}>
				<App />
			</Router>
		</Provider>
	), root)
}


if(document.readyState === 'complete' || document.readyState === 'interactive'){
	init();
} else {
	document.addEventListener('DOMContentLoaded', function(){
		init();
	});
}
