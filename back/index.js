const express = require('express');
const path = require('path');
const cors = require("cors")
const fs = require("fs");
const app = express();

app.use(cors({ origin: "*"}))

const folder = fs.readdirSync(path.join(__dirname, "pictures"))
const files = folder.reduce((acc, val) => {
  acc[val] = fs.readdirSync(path.join(__dirname, 'pictures', val))
  return acc;
}, {})


function between(min, max) {
  return Math.floor(
    Math.random() * (max - min) + min
  )
}

app.get('/getPicture', function (req, res) {
  const { idx, category } = req.query
  const localFolderName = (category && category !== 'Random') ? category : folder[between(0, folder.length)]
  const pictures = files[localFolderName]
  const localIdx = idx || between(0, pictures.length)
  res.sendFile(path.join(__dirname, 'pictures', localFolderName, pictures[localIdx]))
});

app.get('/getCategories', (req, res) => {
  res.status(200).send({
    categories: folder.map((c, idx) => ({ name: c.replace('_', ' '), id: c }))
  })
})

app.get('/picturesCount', function(req, res) {
  res.status(200).send({ length: 1488 })
})

app.listen(9000, () => console.log('static server started on 9000 port'));
