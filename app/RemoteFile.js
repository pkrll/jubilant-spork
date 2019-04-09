const https = require('https');
const fs = require('fs');

class RemoteFile {
	/**
	 * Returns the contents of the remote file at url.
	 *
	 * @param  {String}  url The URL of the remote file.
	 * @return {Promise} Promise object represents the contents of the file.
	 */
	read(url) {
		return new Promise((resolve, reject) => {
			let body = '';

			https.get(url, response => {
				response.on('data',  (chunk) => body += chunk);
				response.on('end',        () => resolve(body));
				response.on('error', (error) => reject(error));
			});
		});
	}
	/**
	 * Donloads the remote file at url to path.
	 *
	 * @param  {String} url  The URL of the remote file.
	 * @param  {String} path The path at which to save the file.
	 */
	download(url, path) {
		return new Promise((resolve, reject) => {
			const file = fs.createWriteStream(path);
			https.get(url, (response) => {
				response.pipe(file);
				response.on('end',      () => resolve(path));
				response.on('error', error => reject(error));
			});
		});
	}

}

const remoteFile = new RemoteFile();

module.exports = remoteFile;
