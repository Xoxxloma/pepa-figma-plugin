const express = require('express');
const path = require('path');
const https = require('https')
const http = require('http');
const cors = require("cors")
const fs = require("fs");
const app = express();

const PORT = 4006;

const folder = fs.readdirSync(path.join(__dirname, "pictures"))
const files = folder.reduce((acc, val) => {
  acc[val] = fs.readdirSync(path.join(__dirname, 'pictures', val))
  return acc;
}, {})

const certPath = '/etc/letsencrypt/live/pepavpn.ru/';


function between(min, max) {
  return Math.floor(
      Math.random() * (max - min) + min
  )
}

app.use(cors({ origin: "*"}))

// добавляем путь до статики с обложками с префиксом /covers
app.use('/covers', express.static('covers', { extensions: ['png', 'jpg', 'jpeg']}))


// TODO добавить проверку на то что папка есть
app.get('/getPicture', function (req, res) {
  const { idx, category } = req.query
  const localFolderName = (category && category !== 'Random') ? category : folder[between(0, folder.length)]
  const pictures = files[localFolderName]
  const localIdx = idx || between(0, pictures.length)
  res.sendFile(path.join(__dirname, 'pictures', localFolderName, pictures[localIdx]))
});

app.get('/getCategories', (req, res) => {
  res.status(200).send({
    categories: folder.map((c, idx) => ({ name: c.replaceAll('_', ' '), id: c }))
  })
})

app.get('/picturesCount', function(req, res) {
  res.status(200).send({ length: 1488 })
})

app.get('/log', (req, res) => {
  try {
    const filePath = path.resolve(__dirname, 'plugin-metrics.log')
    const log = `user_click{category="${req.query?.category}", userid="${req.query?.user}", operation="${req.query?.event}"} 1.0`
    console.log(`operation=${req.query?.event},userId=${req.query?.user},category=${req.query?.category},time=${new Date()}`)
    fs.appendFileSync(filePath, log+"\n", 'utf8');
  } catch (e){
    console.log(e, 'error in log')
  } finally {
    res.sendStatus(200)
  }
})

app.get('/plugin-metrics', (req, res) => {
  try {
    const filePath = path.resolve(__dirname, 'plugin-metrics.log')
    const metrics = fs.readFileSync(filePath, { encoding: 'utf-8'})
    fs.writeFileSync(filePath, '')
    res.status(200).send(metrics)
  } catch (e) {
    res.sendStatus(502)
  }
})


// const httpServer = http.createServer(app);
//
// httpServer.listen(PORT, () => console.log(`Pepa Figma plugin HTTP server started on ${PORT} port`));

https.createServer({
  key: fs.readFileSync(path.join(certPath, 'privkey.pem')), // Приватный ключ
  cert: fs.readFileSync(path.join(certPath, 'fullchain.pem')) // Сертификат
}, app).listen(PORT, () => console.log(`Pepa Figma plugin HTTPS server started on ${PORT} port`));
