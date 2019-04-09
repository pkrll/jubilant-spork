'use strict';
const creds  = require('./config/credentials.json');
const http   = require('http');
const crypto = require('crypto');
const exec = require('child_process').exec;
const path = require('./config').localRepo;

http.createServer((req, res) => {
	req.on("data", chunk => {
		exec('rm -f success.txt fail.txt');

		const signature = "sha1=" + crypto.createHmac('sha1', creds.secret).update(chunk.toString()).digest('hex');

		if (req.headers['x-hub-signature'] == signature) {
			exec('cd ' + path + ' && git pull');
			exec('touch success.txt');
		} else {
			exec('touch fail.txt');
		}
	});

	res.end("Request received");
}).listen(3000);
