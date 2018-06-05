const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const authorize = require('./authorize');

const app = express();

const forceSSL = function () {
	return function (req, res, next) {
		if (req.headers['x-forwarded-proto'] !== 'https') {
			return res.redirect(
				['https://', req.get('Host'), req.url].join('')
			);
		}
		next();
	}
}

app.use(forceSSL());
app.use(cors());
app.use(authorize());
app.use(compression());
app.use(express.static(path.join(__dirname, 'dist')));

app.get('*', function(req, res) {
	res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || '4200';
app.set('port', port);

const server = http.createServer(app);
server.listen(port, function() {
	console.log('Running app');
});
