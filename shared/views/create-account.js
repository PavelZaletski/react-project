import React from 'react';
import { connect } from 'react-redux';
import { getStore } from '../store';
import { createAccount } from '../actions/user-actions';
import { FileInput } from '../components';

export class CreateAccount extends React.Component {
	constructor(props){
		super(props);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(e){
		e.preventDefault();
		const f = new FormData(document.getElementById('createAccountForm'));
		const input = document.getElementById('imgFile');

		if(!f.get('username')){
			alert('please, write username');
			return;
		}

		if(!input.files || !input.files[0]){
			alert('please, choose an avatar');
			return;
		}

		getStore().dispatch(createAccount(f, this.props.history));
	}

	render() {
		return (
			<div className="container register-page">
				<h2>Register</h2>
				<form id="createAccountForm" action="/createUser" method="POST" encType="multipart/form-data">
					<FileInput type="avatar" />
					<p>
					<label>username<br/>
						<input className="form-control" type="text" name="username" required/>
					</label>
					</p>
					<p>
						<label>Password<br/>
							<input className="form-control" type="password" name="password" required/>
						</label>
					</p>
					<p>
						<label>Firstname<br/>
							<input className="form-control" type="firstname" name="firstname" required/>
						</label>
					</p>
					<p>
						<label>Lastname<br/>
							<input className="form-control" type="firstname" name="lastname"/>
						</label>
					</p>
					<input type="submit" className="btn btn-default" value="create account" onClick={this.onSubmit}/>
				</form>
			</div>
		);
	}
}
