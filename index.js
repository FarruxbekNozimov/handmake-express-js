const express = require("express");
const path = require("path");

const app = new express();
const PORT = 7000;

app.get("/", (req, res) => {
	res.status(500).json({ msg: "yaxshi" });
});

app.get("/get", (req, res) => {
	res.write("BU BOSHQA GET ");
	res.end();
});

app.post("/", (req, res) => {
	res.write("POST METHOD");
	res.end();
});

app.post("/post", (req, res) => {
	res.write("BU HAM BOSHQA POST");
	res.end();
});

app.put("/", (req, res) => {
	res.write("BU PUT METHOD");
	res.end();
});

app.put("/put", (req, res) => {
	res.write("BU YANA BOSHQA PUT");
	res.end();
});

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
