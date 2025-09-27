import express from 'express';
import crypto from 'crypto';
import argon2 from 'argon2';

import db from '../db.js';

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
  db.query("SELECT * FROM auths WHERE token = ?", [token])
    .then(data => {
      const [rows, fields] = data;
      const row = rows[0];
      if (!row) {
        res.status(401).json({ error: "Invalid token" });
        return;
      }
      req.circle_id = row.circle_id;
      next();
    }).catch(err => {
      res.status(500).json({ error: err.message });
    });
}

router.post("/auth/logins", async (req, res) => {
  const { username, password } = req.body;
  const password_hash = await hashPassword(password);
  db.query("SELECT * FROM circles WHERE username = ? AND password_hash = ?", [username, password_hash])
    .then(data => {
      const [rows, fields] = data;
      const row = rows[0];
      if (!row) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const ua = req.headers['user-agent'] || 'unknown';
      const token = crypto.randomBytes(16).toString("hex");
      db.query("INSERT INTO auths (circle_id, token, agent) VALUES (?, ?, ?)", [row.id, token, ua])
      .then(() => {
        res.json({ token });
      }).catch(err => {
        res.status(500).json({ error: err.message });
      });
    }).catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.get("/auth/logins", (req, res) => {
  authenticateToken(req, res, () => {
    db.query("SELECT * FROM auths WHERE circle_id = ?", [req.circle_id])
      .then(data => {
        const [rows, fields] = data;
        res.json(rows);
      });
  }).catch(err => {
    res.status(500).json({ error: err.message });
  });
});

router.delete("/auth/logins", authenticateToken, (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader.split(' ')[1];
  db.query("DELETE FROM auths WHERE token = ?", [token])
    .then(() => {
      return res.json({ message: "OK" });
    }).catch(err => {
      return res.status(500).json({ error: err.message });
    });
});

router.post("/auth/register", async (req, res) => {
  const { name, username, password } = req.body;
  const password_hash = await hashPassword(password)
  db.query("INSERT INTO circles (name, username, password_hash) VALUES (?, ?, ?)", [name, username, password_hash])
    .then(() => {
      res.status(201).json({ message: "OK" });
    }).catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.get("/circles/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM circles WHERE id = ?", [id])
    .then(data => {
      const [rows, fields] = data;
      const row = rows[0];
      if (!row) {
        res.status(404).json({ error: "Circle not found" });
        return;
      }
      res.json(row);
    }).catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.put("/circles/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  if (parseInt(id) !== req.circle_id) {
    res.status(403).json({ error: "Cannot modify other circles" });
    return;
  }
  const { name, username, bio } = req.body;
  db.query("UPDATE circles SET name = ?, username = ?, bio = ? WHERE id = ?", [name, username, bio, id])
    .then(() => {
      res.redirect(`/api/v1/circles/${id}`);
    }).catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.get("/circles/:id/bubbles", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM bubbles WHERE circle_id = ?", [id])
    .then(data => {
      const [rows, fields] = data;
      res.json(rows);
    }).catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.get("/circles/:id/joins", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM joins WHERE joiner_id = ?", [id])
    .then(data => {
      const [rows, fields] = data;
      res.json(rows);
    }).catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.post("/circles/:id/joins", authenticateToken, (req, res) => {
  const { id } = req.params;
  const joiner_id = req.circle_id;
  if (parseInt(id) === joiner_id) {
    res.status(400).json({ error: "Cannot join yourself" });
    return;
  }
  db.query("INSERT INTO joins (joiner_id, joinee_id) VALUES (?, ?)", [joiner_id, id])
    .then(() => {
      res.json({ message: "Joined successfully" });
    }).catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.delete("/circles/:id/joins", authenticateToken, (req, res) => {
  const { id } = req.params;
  const joiner_id = req.circle_id;
  db.query("DELETE FROM joins WHERE joiner_id = ? AND joinee_id = ?", [joiner_id, id])
    .then(() => {
      res.json({ message: "Unjoined successfully" });
    }).catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.get("/circles/:id/joinedbys", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM joins WHERE joinee_id = ?", [id])
    .then(data => {
      const [rows, fields] = data;
      res.json(rows);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.post("/bubbles", authenticateToken, (req, res) => {
  const { content, anchor } = req.body;
  const circle_id = req.circle_id;
  db.query("INSERT INTO bubbles (content, anchor, circle_id) VALUES (?, ?, ?)", [content, anchor, circle_id])
    .then(() => {
      res.status(201).json({ message: "OK" });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.get("/bubbles", (req, res) => {
  db.query(`
    SELECT JSON_OBJECT(
      'id', b.id,
      'content', b.content,
      'anchor', b.anchor,
      'timestamp', b.timestamp,
      'circle', JSON_OBJECT(
        'id', c.id,
        'name', c.name,
        'username', c.username,
        'bio', c.bio
      )
    ) AS bubble
    FROM bubbles b
    JOIN circles c ON b.circle_id = c.id
    ORDER BY b.id DESC
    LIMIT 50
  `, []).then(data => {
    const [rows, fields] = data;
    const bubbles = rows.map(row => JSON.parse(row.bubble));
    res.json(bubbles);
  }).catch(err => {
    res.status(500).json({ error: err.message });
  });
});

router.get("/bubbles/:id", (req, res) => {
  const { id } = req.params;
  db.query(`
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
  `, [id]).then(data => {
    const [rows, fields] = data;
    const row = rows[0];
    if (!row) {
      res.status(404).json({ error: "Bubble not found" });
      return;
    }
    const bubble = JSON.parse(row.bubble);
    res.json(bubble);
  }).catch(err => {
    res.status(500).json({ error: err.message });
  });
});

router.delete("/bubbles/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const circle_id = req.circle_id;
  db.query("DELETE FROM bubbles WHERE id = ? AND circle_id = ?", [id, circle_id])
    .then(() => {
      if (this.changes === 0) {
        res.status(404).json({ error: "Bubble not found or not owned by you" });
        return;
      }
      res.json({ message: "OK" });
    }).catch(err => {
      res.status(500).json({ error: err.message });
    });
});

export default router;
