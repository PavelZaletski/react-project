import React from 'react';
import processDate from '../processDate';

export class Comments extends React.Component {
	render(){
		const comments = this.props.comments;

		if(comments){
			let commentsItems = [];

			if(comments.length){
				commentsItems = comments.map((comment, i) =>{
						return <li key={i.toString()}>
							<img className="avatar" src={'/image/' + comment.author.urlToAvatar}/>
							<span className ="author">{comment.author.firstname} {comment.author.lastname}</span>
							<br/>
							<span className="date">{processDate(comment.publishedAt)}</span>
							<p>{comment.text}</p>
						</li>
					}
				);
			}

			return <ul className="comments">{commentsItems}</ul>
		} else {
			return null;
		}

	}
}
