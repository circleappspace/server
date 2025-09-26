import express from "express"
import dotenv from "dotenv"
import path from 'path';

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const __dirname = path.resolve();

app.use(express.static(path.join(__dirname, 'dist'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

app.get("/api/hello", (req, res) => {
  res.send("Hello, World!")
})

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
