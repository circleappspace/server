import express from "express"
import path from 'path';
import dotenv from "dotenv"

import apiv1Router from "./routes/apiv1.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, 'build'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

app.use(express.json())

app.use('/api/v1', apiv1Router)

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
