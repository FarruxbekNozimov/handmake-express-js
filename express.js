const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs");
const qs = require("querystring");

class express {
	constructor() {
		this.router = {
			GET: [],
			POST: [],
			PUT: [],
			DELETE: [],
		};
		this.middleware = [];
		this.server = http.createServer;
	}

	use(callback = () => {}) {
		this.middleware.push(callback);
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
			req.url = req.url.split("?")[0];

			// REQ HEADERS ALSO EXIST

			// SET RES SEND
			res.send = (data) => {
				try {
					res.setHeader("Content-Type", "text/html");
					res.end(data);
				} catch (error) {
					console.log(new Error(error.message));
				}
			};

			// SET RES JSON
			res.json = (obj) => {
				try {
					res.setHeader("Content-Type", "application/json");
					res.end(JSON.stringify(obj));
				} catch (error) {
					console.log(new Error(error.message));
				}
			};

			// SET RES STATUS
			res.status = (status) => {
				try {
					res.statusCode = status;
					const parent = {
						json: (obj) => res.json(obj),
					};
					return parent;
				} catch (error) {
					console.log(new Error(error.message));
				}
			};

			// SET RES SENDFILE
			res.sendFile = (pathFile, data = {}) => {
				fs.readFile(path.join(pathFile), (error, result) => {
					try {
						res.setHeader("Content-Type", "text/html");
						console.log(data);
						for (let i in data) {
							console.log(`{{${i}}}`);
							result = Buffer.from(
								result.toString().replace(`{{${i}}}`, data[i]),
								"utf8"
							);
						}
						res.end(result);
					} catch (error) {
						console.log(new Error(error.message));
					}
				});
			};

			for (let method in this.router) {
				for (let i in this.router[method]) {
					if (!this.middleware.length) {
						if (this.router[method][i][`${req.url}`] && req.method == method) {
							req.on("end", () => {
								console.log(qs.parse(req.body));
								this.router[method][i][`${req.url}`](req, res);
							});
							return;
						}
					} else {
						for (let j in this.middleware) {
							this.middleware[j](req, res, () => {
								if (
									this.router[method][i][`${req.url}`] &&
									req.method == method
								) {
									req.on("end", () => {
										this.router[method][i][`${req.url}`](req, res);
									});
									return;
								}
							});
						}
					}
				}
			}
		}).listen(PORT, callback());
	}
}

module.exports = express;
