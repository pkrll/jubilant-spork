const { remoteURL, rootDir, docDir, imgDir } = require('../config/');
const RemoteFile = require('./RemoteFile.js');
const fs = require('fs');


const didGetError = (err) => {
	console.log("Error!");
	console.log(err);
}

const didFetchIndex = (file) => {
	const data  = fs.readFileSync(file);
	const posts = JSON.parse(data)["posts"];
	for (let post of posts) {
		const url  = remoteURL + post.path + post.name;
		const name = rootDir + docDir + post.name;
		RemoteFile.download(url, name);

		if (post.image.length > 0) {
			const imgURL  = remoteURL + post.path + imgDir + post.image;
			const imgPath = rootDir + imgDir + post.image;
			RemoteFile.download(imgURL, imgPath);
		}
	}
}

const run = () => {
	RemoteFile.download(remoteURL + "index.json", rootDir + "index.json")
		.then(didFetchIndex)
		.catch(didGetError);
}

module.exports = run;
