import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import { getStore } from '../store';
import {connect} from 'react-redux';
import {logoutUser} from '../actions/user-actions';

class HeaderClass extends React.Component {
	constructor(props){
		super(props);
		this.onLogout = this.onLogout.bind(this);
	}
	onLogout(e){
		e.preventDefault();
		getStore().dispatch(logoutUser(this.props.history));
	}
	render(){
		const user = this.props.user;

		return (
			<header>
				<div className="container">
					<h1 className="app-title">
						<Link to='/'>Frontcamp</Link>
					</h1>
					{
						user.username ?
						<div className="user-info">
							<img className="avatar" src={'/image/' + user.urlToAvatar}/>
							<span className="user-name">{user.firstname} {user.lastname}</span>
						</div>
						:
						null
					}
					{
						user.username ?
						<div className="buttons">
							<a className="btn btn-blue btn-logout" onClick={this.onLogout}>logout</a>
							<Link className="add-article" to='/article/add'>Write a story</Link>
						</div>
						:
						<div className="buttons">
							<Link className="btn btn-blue" to='/login'>login</Link>
							<Link className="btn btn-green" to="/create-account">register</Link>
						</div>
					}	
				</div>
			</header>
		);

	}
}

function mapStateToProps (store) {
	return {
		user: store.user.user,
		userFetched: store.user.fetched
	}
}

export const Header = withRouter(connect(mapStateToProps)(HeaderClass));