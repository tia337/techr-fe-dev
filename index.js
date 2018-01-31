const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');

const app = express();

app.use(cors());

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
