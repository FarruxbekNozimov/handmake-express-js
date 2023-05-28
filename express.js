const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");

class express {
	constructor() {
		this.router = {
			GET: [],
			POST: [],
			PUT: [],
			DELETE: [],
		};
		this.server = http.createServer;
	}

	listen(PORT, callback = () => {}) {
		this.server((req, res) => {
			// SET REQ BODY
			req.on("data", (chunk) => {
				req.body = JSON.parse(chunk.toString());
				req.body = req.body || {};
			});

			// SET REQ QUERY
			const query = new URL(req.url, `http://${req.headers.host}`).searchParams;

			req.query = {};

			for (const [key, value] of query.entries()) {
				req.query[key] = value;
			}

			// SET REQ SENDFILE
			res.sendFile = (pathFile) => {
				fs.readFile(path.join(pathFile), (error, data) => {
					try {
						res.setHeader("Content-Type", "text/html");
						res.end(data);
					} catch (error) {
						res.end(error.toString());
						console.log(error);
					}
				});
			};

			// SET REQ JSON
			res.json = (obj) => {
				try {
					res.setHeader("Content-Type", "application/json");
					res.end(JSON.stringify(obj));
				} catch (error) {
					console.log(error);
				}
			};

			// SET RES STATUS
			res.status = (status) => {
				try {
					res.statusCode = status;
				} catch (error) {
					console.log(error);
				}
				function json(obj) {
					res.json(obj);
				}
			};

			for (let method in this.router) {
				for (let i in this.router[method]) {
					if (this.router[method][i][`${req.url}`] && req.method == method) {
						req.on("end", () => {
							this.router[method][i][`${req.url}`](req, res);
						});
						return;
					}
				}
			}
		}).listen(PORT, callback());
	}

	get(url, callback = () => {}) {
		this.router.GET.push({ [`${url}`]: callback });
	}

	post(url, callback = () => {}) {
		this.router.POST.push({ [`${url}`]: callback });
	}

	put(url, callback = () => {}) {
		this.router.PUT.push({ [`${url}`]: callback });
	}

	delete(url, callback = () => {}) {
		this.router.DELETE.push({ [`${url}`]: callback });
	}
}

module.exports = express;
