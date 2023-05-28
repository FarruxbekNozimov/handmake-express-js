const express = require("./express");
const path = require("path");

const app = new express();
const PORT = 7000;

app.use((req, res, next) => {
	next();
});

app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/", (req, res) => {
	res.sendFile(path.join(__dirname, "post.html"), req.body);
});

app.put("/", (req, res) => {
	res.write("BU PUT METHOD");
	res.end();
});

app.delete("/", (req, res) => {
	res.write("BU O'SHA DELETE");
	res.end();
});

app.get("/get", (req, res) => {
	res.sendFile(path.join(__dirname, "post.html"), req.body);
});

app.post("/post", (req, res) => {
	res.write("BU HAM BOSHQA POST");
	res.end();
});

app.put("/put", (req, res) => {
	res.write("BU YANA BOSHQA PUT");
	res.end();
});

app.delete("/delete", (req, res) => {
	res.write("BU BOSHQA DELETE");
	res.end();
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
