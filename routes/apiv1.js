import express from 'express';
import sqlite3 from 'sqlite3';
import crypto from 'crypto';

const router = express.Router();
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Could not connect to database', err);
    throw err;
  }
});

router.get('/hello', (req, res) => {
  res.send('Hello, World!')
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    res.status(401).json({ error: "No authorization header" });
    return;
  }
  const token = authHeader.split(' ')[1];
  db.get("SELECT * FROM auths WHERE token = ?", [token], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
    req.circle_id = row.circle_id;
    next();
  });
}

router.post("/logins", (req, res) => {
  const { username, password_hash } = req.body;
  db.get("SELECT * FROM circles WHERE username = ? AND password_hash = ?", [username, password_hash], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const ua = req.headers['user-agent'] || 'unknown';
    const token = crypto.randomBytes(16).toString("hex");
    db.run("INSERT INTO auths (circle_id, token, agent) VALUES (?, ?, ?)", [row.id, token, ua], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ token });
    });
  });
});

router.get("/logins", (req, res) => {
  authenticateToken(req, res, () => {
    db.all("SELECT * FROM auths WHERE circle_id = ?", [req.circle_id], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(rows);
    });
  });
});

router.delete("/logins", authenticateToken, (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader.split(' ')[1];
  db.run("DELETE FROM auths WHERE token = ?", [token], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "Logged out" });
  });
});

router.get("/circles/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM circles WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: "Circle not found" });
      return;
    }
    res.json(row);
  });
});

router.post("/bubbles", authenticateToken, (req, res) => {
  const { content, anchor } = req.body;
  const circle_id = req.circle_id;
  db.run("INSERT INTO bubbles (content, anchor, circle_id) VALUES (?, ?, ?)", [content, anchor, circle_id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.redirect(`/api/v1/bubbles/${this.lastID}`);
  });
});

router.get("/bubbles", (req, res) => {
  db.all("SELECT * FROM bubbles", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

router.get("/bubbles/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM bubbles WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

router.get("/circles/:circlesId/bubbles", (req, res) => {
  const { circlesId } = req.params;
  db.all("SELECT * FROM bubbles WHERE circle_id = ?", [circlesId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

export default router;
