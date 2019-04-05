const { remoteURL, downloadPath } = require('../config/');
const RemoteFile = require('./RemoteFile.js');

const didGetError = (err) => {
	console.log("Error!");
	console.log(err);
}

const didFetchIndex = (data) => {
	const posts = JSON.parse(data)["posts"];
	for (let post of posts) {
		const url  = remoteURL + post.path + post.name;
		const name = downloadPath + post.name;
		RemoteFile.download(url, name);
	}
}

RemoteFile.read(remoteURL + "index.json")
	.then(didFetchIndex)
	.catch(didGetError);
