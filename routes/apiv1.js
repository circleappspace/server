import express from 'express';
import sqlite3 from 'sqlite3';
import crypto from 'crypto';
import argon2 from 'argon2';

async function hashPassword(plain) {
  return await argon2.hash(plain, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  });
}

async function verifyPassword(plain, storedHash) {
  try {
    return await argon2.verify(storedHash, plain);
  } catch (err) {
    return false;
  }
}

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
    verifyPassword(token, row.token).then(isValid => {
      if (!isValid) {
        res.status(401).json({ error: "Invalid token" });
        return;
      }
    });
    req.circle_id = row.circle_id;
    next();
  });
}

router.post("/auth/logins", (req, res) => {
  const { username, password } = req.body;
  const password_hash = hashPassword(password);
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

router.get("/auth/logins", (req, res) => {
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

router.delete("/auth/logins", authenticateToken, (req, res) => {
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

router.post("/auth/register", (req, res) => {
  const { username, password_hash } = req.body;
  db.run("INSERT INTO circles (username, password_hash) VALUES (?, ?)", [username, password_hash], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.redirect(`/api/v1/circles/${this.lastID}`);
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

router.put("/circles/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  if (parseInt(id) !== req.circle_id) {
    res.status(403).json({ error: "Cannot modify other circles" });
    return;
  }
  const { name, username, bio } = req.body;
  db.run("UPDATE circles SET name = ?, username = ?, bio = ? WHERE id = ?", [name, username, bio, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.redirect(`/api/v1/circles/${id}`);
  });
});

router.get("/circles/:id/bubbles", (req, res) => {
  const { id } = req.params;
  db.all("SELECT * FROM bubbles WHERE circle_id = ?", [id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

router.get("/circles/:id/joins", (req, res) => {
  const { id } = req.params;
  db.all("SELECT * FROM joins WHERE joiner_id = ?", [id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

router.post("/circles/:id/joins", authenticateToken, (req, res) => {
  const { id } = req.params;
  const joiner_id = req.circle_id;
  if (parseInt(id) === joiner_id) {
    res.status(400).json({ error: "Cannot join yourself" });
    return;
  }
  db.run("INSERT INTO joins (joiner_id, joinee_id) VALUES (?, ?)", [joiner_id, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "Joined successfully" });
  });
});

router.delete("/circles/:id/joins", authenticateToken, (req, res) => {
  const { id } = req.params;
  const joiner_id = req.circle_id;
  db.run("DELETE FROM joins WHERE joiner_id = ? AND joinee_id = ?", [joiner_id, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "Unjoined successfully" });
  });
});

router.get("/circles/:id/joinedbys", (req, res) => {
  const { id } = req.params;
  db.all("SELECT * FROM joins WHERE joinee_id = ?", [id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
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
  db.all(`
    SELECT JSON_OBJECT(
      'id', b.id,
      'content', b.content,
      'anchor', b.anchor,
      'circle', JSON_OBJECT(
        'id', c.id,
        'name', c.name,
        'username', c.username,
        'bio', c.username
      )
    ) AS bubble
    FROM bubbles b
    JOIN circles c ON b.circle_id = c.id
    ORDER BY b.id DESC
    LIMIT 50
  `, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const bubbles = rows.map(row => JSON.parse(row.bubble));
    res.json(bubbles);
  });
});

router.get("/bubbles/:id", (req, res) => {
  const { id } = req.params;
  db.get(`
    SELECT JSON_OBJECT(
      'id', b.id,
      'content', b.content,
      'anchor', b.anchor,
      'timestamp', b.timestamp,
      'circle', JSON_OBJECT(
        'id', c.id,
        'name', c.name,
        'username', c.username,
        'bio', c.username
      )
    ) AS bubble
    FROM bubbles b
    JOIN circles c ON b.circle_id = c.id
    WHERE b.id = ?
  `, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!bubbles) {
      res.status(404).json({ error: "Bubble not found" });
      return;
    }
    const bubble = JSON.parse(row.bubble);
    res.json(bubble);
  });
});

router.delete("/bubbles/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const circle_id = req.circle_id;
  db.run("DELETE FROM bubbles WHERE id = ? AND circle_id = ?", [id, circle_id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: "Bubble not found or not owned by you" });
      return;
    }
    res.json({ message: "OK" });
  });
});

export default router;
