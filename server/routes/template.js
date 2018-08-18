export default function (html, preloadedState) {
    return `
        <html>
			<head>
				<meta charSet="utf-8"/>
				<title>FrontCamp</title>
				<link rel="stylesheet" type="text/css" href="/assets/style.css" ></link>
			</head>
			<body>
				<div id="root">${html}</div>

				<script>
					window.PRELOADED_STATE = ${JSON.stringify(preloadedState).replace(/</g, '\\u003c')}
				</script>
				<script src="/assets/bundle.js" type="text/javascript"></script>
			</body>
			</html>
    `
}