


document.getElementById('newCommentForm').addEventListener('submit', (e)=>{
	e.preventDefault();
	// var form = new FormData(document.getElementById('newCommentForm'));

	// fetch('/comment/create', {
	// 	method: "POST",
	// 	body: form,
	// 	headers: {
	// 		'Content-Type': 'application/x-www-form-urlencoded'
	// 	}
	// })
	// .then(response => response.json())
	// .then((res) => {
	// 	debugger
	// 	console.log(res);
	// })
	// .catch(console.log);

	const renderTemplate = (template)=>{
		const element = document.createElement('div');
		element.innerHTML = template;
		return element.children[0];
	}

	var form = document.forms.comment;

	var body = 'articleUniqueId=' + encodeURIComponent(form.articleUniqueId.value) + 
		'&text=' + encodeURIComponent(form.text.value);

	var xhr = new XMLHttpRequest();
	xhr.open('POST', '/comment/create', true);
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
	xhr.onload = function(res){
		console.log(res);
		const json = JSON.parse(res.target.responseText);
		if(json.status === 'success'){
			let element = renderTemplate(`
				<li>
					<img src="${json.urlToAvatar}">
					<span class="author">${json.author}</span>
					<br>
					<span class="date">${json.date}</span>
					<p>${json.text}</p>
				</li>
			`);

			document.getElementsByClassName('comments')[0].appendChild(element);
			form.text.value = '';
		}
	};

	xhr.send(body);
});

