'use strict';
const creds  = require('./config/credentials.json');
const http   = require('http');
const crypto = require('crypto');
const exec = require('child_process').exec;
const path = require('./config').localRepo;

const buildSignature = (body) => {
	const signature = crypto.createHmac('sha1', creds.secret)
	                      .update(body.toString())
												.digest('hex');

	return "sha1=" + signature;
};

const verifySignature = (signature, body) => {
	const standard = buildSignature(body);
	return signature == standard;
};

http.createServer((req, res) => {
	let body = "";

	req.on("data", chunk => body += chunk);

	req.on("end", () => {
		const signature = req.headers['x-hub-signature'];

		let message = "Authentication failed.";
		let status  = 404;

		if (verifySignature(signature, body)) {
			exec('cd ' + path + ' && git pull');
			message = "Request received!";
			status  = 200;
		}

		res.writeHead(status, { "Content-Type": "text/plain" });
		res.write(message);
		res.end();
	});
}).listen(3000);
