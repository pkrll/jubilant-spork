const { remoteURL, downloadPath } = require('./config.js');
const https = require('https');
const fs = require('fs');

const request = (url) => {
	return new Promise((resolve, reject) => {
		let body = '';

		https.get(url, response => {
			response.on('data',  (chunk) => body += chunk);
			response.on('end',        () => resolve(body));
			response.on('error', (error) => reject(error));
		});
	});
};

const download = (url, fileName) => {
	const file = fs.createWriteStream(fileName);
	https.get(url, (response) => response.pipe(file));
};

const didGetError = (err) => {
	console.log("Error!");
	console.log(err);
}

const didFetchFile = (data) => {
	console.log(data);
};

const didFetchIndex = (data) => {
	const posts = JSON.parse(data)["posts"];
	for (let post of posts) {
		const url  = remoteURL + post.path + post.name;
		const name = downloadPath + post.name;
		download(url, name);
	}
}

request(remoteURL + "index.json").then(didFetchIndex).catch(didGetError);
