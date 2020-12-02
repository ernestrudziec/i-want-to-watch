const express = require('express');
const app = express();
const fs = require('fs');
const cors = require('cors');
const { parse } = require('path');

let data = fs.readFileSync('data.json');
let parsedData = JSON.parse(data);

// app.use(express.json({type: '*/*'}));
app.use(cors());

const finished = (err) => {
	console.log(err);
};

app.get('/data', (req, res) => {
	let datas = fs.readFileSync('data.json');
	let parsedDatas = JSON.parse(datas);

	res.send(parsedDatas);
});

app.post('/add', express.json({ type: '*/*' }), (req, res) => {
	req.body.id = parsedData.length + 1;

	res.json(req.body);

	let writeable = JSON.stringify([...parsedData, req.body]);
	parsedData = JSON.parse(writeable);

	fs.writeFile('data.json', writeable, finished);
});

app.put('/change/:id', (req, res) => {
	let putObjectIndex = parsedData.findIndex((x) => x.id == req.params.id);

	parsedData[putObjectIndex].isWatched = req.body.isWatched;

	let writeable = JSON.stringify([...parsedData, req.body]);
	parsedData = JSON.parse(writeable);
	res.send(writeable);
	fs.writeFile('data.json', writeable, finished);
});

app.delete('/delete/:id', (req, res) => {
	parsedData.splice(req.params.id, 1);
	let writeable = JSON.stringify(parsedData);
	res.send(parsedData);
	fs.writeFile('data.json', writeable, finished);
});

app.post('/reset', (req, res) => {
	let writeable = JSON.stringify([]);
	res.send(writeable);
	fs.writeFile('data.json', writeable, finished);
});

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Listening on ${port}`));
