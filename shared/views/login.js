import React from 'react';
import { connect } from 'react-redux';
import { getStore } from '../store';
import { authorizeUser } from '../actions/user-actions';

export class Login extends React.Component {
	constructor(props){
		super(props);
		this.onSubmit = this.onSubmit.bind(this);
	}
	onSubmit(e){
		e.preventDefault();

		var password = document.getElementById('password').value;
		var username = document.getElementById('username').value;

		getStore().dispatch(authorizeUser(username, password, this.props.history));
	}

  render() {
    return (
      <div className="container login-page">
		  <h2>Login Page</h2>

		  <form role="form" action="/login" method="post" >
		    <div className="form-group">
		      <input id="username" type="text" name="username" placeholder="Enter Username" className="form-control"/>
		    </div>
		    <div className="form-group">
		      <input id="password" type="password" name="password" placeholder="Password" className="form-control"/>
		    </div>
		    <button type="submit" className="btn btn-default" onClick={this.onSubmit}>Submit</button>&nbsp;<a href="/">
		      <button type="button" className="btn btn-default">Cancel</button></a>
		  </form>
		</div>
    );
  }
}
