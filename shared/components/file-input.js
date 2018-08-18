import React from 'react';

export class FileInput extends React.Component {
	constructor(props){
		super(props);
		this.onFileSelect = this.onFileSelect.bind(this);
	}

	componentDidMount(){
		this.fileInput = document.getElementById('imgFile');
	}

	componentWillMount() {
		if(this.props.src){
			this.src = this.props.src;
		} else {
			this.src = this.props.type === 'avatar' ? 'img/no_avatar.jpg' : "img/no_image.png"
		}
	}

	onFileSelect(e){
		 if (this.fileInput.files && this.fileInput.files[0]) {
			let reader = new FileReader();

			reader.onload = function (e) {
				var imgElement = document.getElementById('imgPreview');
				imgElement.setAttribute('src', e.target.result);
			};

			reader.readAsDataURL(this.fileInput.files[0]);
		}
	}

	render() {
		return (
			<div>
				<div className="img-preview-wrapper">
					<img id="imgPreview" className="img-preview" src={this.src} alt="your image" />
				</div>
				<label>Browse:
					<input id="imgFile" type="file" name="file" required="required" className="form-control" onChange={this.onFileSelect}/>
				</label>
			</div>
		);
	}
}
