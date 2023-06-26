import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import 'dotenv/config'
import controller from './src/controllers/controller.js'
import bodyParser from 'body-parser'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


const storage = multer.memoryStorage()
const uploadStorage = multer({ storage: storage })

app.get('/', (_, res) => res.sendFile('src/templates/index.html', {root: __dirname }))

app.post("/upload/single", uploadStorage.single("file"), controller.upload)

app.get('/chat', (_, res) => res.sendFile('src/templates/chat.html', {root: __dirname }))

app.get('/interrogation', controller.interrogation)

app.listen(8080 || process.env.PORT, () => {
  console.log("Server on...")
})