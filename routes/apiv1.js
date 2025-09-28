import express from 'express';
import crypto from 'crypto';
import argon2 from 'argon2';

import db from '../db.js';

const CIRCLE_JSON_FIELDS = `
  JSON_OBJECT(
    'id', c.id,
    'name', c.name,
    'username', c.username,
    'bio', c.bio,
    'joins_count', (SELECT COUNT(*) FROM joins j WHERE j.joinee_id = c.id),
    'joinedbys_count', (SELECT COUNT(*) FROM joins j WHERE j.joiner_id = c.id),
    'created_at', c.created_at,
    'bubbles_count', (SELECT COUNT(*) FROM bubbles b WHERE b.circle_id = c.id)
  )
`;
const BUBBLE_JSON_FIELDS = `
  JSON_OBJECT(
    'id', b.id,
    'content', b.content,
    'timestamp', b.timestamp,
    'circle', ${CIRCLE_JSON_FIELDS},
    'anchor', b.anchor,
    'anchoreds_count', (SELECT COUNT(*) FROM bubbles b2 WHERE b2.anchor = b.id),
    'pops_count', (SELECT COUNT(*) FROM pops p WHERE p.popped_id = b.id)
  )
`;

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
  db.query("SELECT * FROM circles WHERE username = ?", [username])
    .then(data => {
      const [rows, fields] = data;
      const row = rows[0];
      if (!row) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      verifyPassword(password, row.password_hash).then(match => {
        if (!match) {
          res.status(401).json({ error: "Invalid credentials" });
          return;
        }

        row.password_hash = undefined;

        const ua = req.headers['user-agent'] || 'unknown';
        const token = crypto.randomBytes(16).toString("hex");
        db.query("INSERT INTO auths (circle_id, token, agent) VALUES (?, ?, ?)", [row.id, token, ua])
        .then(() => {
          res.json({ token, circle: row });
        }).catch(err => {
          res.status(500).json({ error: err.message });
        });
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
      db.query("INSERT INTO joins (joiner_id, joinee_id) SELECT id, id FROM circles WHERE username = ?", [username])
        .then(() => {
          res.status(201).json({ message: "OK" });
        }).catch(err => {
          res.status(500).json({ error: err.message });
        });
    }).catch(err => {
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ error: "Username already taken" });
      } else {
        res.status(500).json({ error: err.message });
      }
    });
});

router.get("/auth/me", authenticateToken, (req, res) => {
  const circle_id = req.circle_id;
  db.query(`SELECT ${CIRCLE_JSON_FIELDS} AS circle FROM circles c WHERE id = ?`, [circle_id])
    .then(data => {
      const [rows, fields] = data;
      const row = rows[0];
      if (!row) {
        res.status(404).json({ error: "Circle not found" });
        return;
      }
      const circle = JSON.parse(row.circle);
      res.json(circle);
    }).catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.put("/circles", authenticateToken, (req, res) => {
  const id = req.circle_id;
  const { name, username, bio } = req.body;
  const updates = [];
  const params = [];
  if (name !== undefined) {
    updates.push("name = ?");
    params.push(name);
  }
  if (username !== undefined) {
    updates.push("username = ?");
    params.push(username);
  }
  if (bio !== undefined) {
    updates.push("bio = ?");
    params.push(bio);
  }
  if (updates.length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }
  params.push(id);
  const sql = `UPDATE circles SET ${updates.join(", ")} WHERE id = ?`;
  db.query(sql, params)
    .then(() => {
      res.json({ message: "OK" });
    }).catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.get("/circles/username/:username", (req, res) => {
  const { username } = req.params;
  db.query(`SELECT ${CIRCLE_JSON_FIELDS} AS circle FROM circles c WHERE c.username = ?`, [username])
    .then(data => {
      const [rows, fields] = data;
      const row = rows[0];
      if (!row) {
        res.status(404).json({ error: "Circle not found" });
        return;
      }
      const circle = JSON.parse(row.circle);
      res.json(circle);
    }).catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.get("/circles/username/:username/bubbles", (req, res) => {
  const { username } = req.params;
  db.query(`
    SELECT ${BUBBLE_JSON_FIELDS} AS bubble
    FROM bubbles b
    JOIN circles c ON b.circle_id = c.id
    WHERE c.username = ?
    ORDER BY b.id DESC
    LIMIT 50
  `, [username]).then(data => {
    const [rows, fields] = data;
    const bubbles = rows.map(row => JSON.parse(row.bubble));
    res.json(bubbles);
  }).catch(err => {
    res.status(500).json({ error: err.message });
  });
});

router.get("/circles/:id", (req, res) => {
  const { id } = req.params;
  db.query(`SELECT ${CIRCLE_JSON_FIELDS} AS circle FROM circles c WHERE id = ?`, [id])
    .then(data => {
      const [rows, fields] = data;
      const row = rows[0];
      if (!row) {
        res.status(404).json({ error: "Circle not found" });
        return;
      }
      const circle = JSON.parse(row.circle);
      res.json(circle);
    }).catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.get("/circles/:id/bubbles", (req, res) => {
  const { id } = req.params;
  db.query(`SELECT ${BUBBLE_JSON_FIELDS} AS bubble FROM bubbles b JOIN circles c ON b.circle_id = c.id WHERE b.circle_id = ? ORDER BY b.id DESC LIMIT 50`, [id])
    .then(data => {
      const [rows, fields] = data;
      const bubbles = rows.map(row => JSON.parse(row.bubble));
      res.json(bubbles);
    }).catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.get("/circles/:id/joins", (req, res) => {
  const { id } = req.params;
  db.query(`SELECT ${CIRCLE_JSON_FIELDS} AS circle FROM circles c JOIN joins j ON c.id = j.joinee_id WHERE j.joiner_id = ?`, [id])
    .then(data => {
      const [rows, fields] = data;
      const circles = rows.map(row => JSON.parse(row.circle));
      res.json(circles);
    }).catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.get("/circles/:id/is_joined", authenticateToken, (req, res) => {
  const { id } = req.params;
  const joiner_id = req.circle_id;
  db.query("SELECT * FROM joins WHERE joiner_id = ? AND joinee_id = ?", [joiner_id, id])
    .then(data => {
      const [rows, fields] = data;
      res.json({ joined: rows.length > 0 });
    }).catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.post("/circles/:id/joinedbys", authenticateToken, (req, res) => {
  const { id } = req.params;
  const joiner_id = req.circle_id;
  db.query("INSERT INTO joins (joiner_id, joinee_id) VALUES (?, ?)", [joiner_id, id])
    .then(() => {
      res.status(201).json({ message: "OK" });
    }).catch(err => {
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ error: "Already joined" });
      } else {
        res.status(500).json({ error: err.message });
      }
    });
});

router.get("/circles/:id/joinedbys", (req, res) => {
  const { id } = req.params;
  db.query(`SELECT ${CIRCLE_JSON_FIELDS} AS circle FROM circles c JOIN joins j ON c.id = j.joiner_id WHERE j.joinee_id = ?`, [id])
    .then(data => {
      const [rows, fields] = data;
      const circles = rows.map(row => JSON.parse(row.circle));
      res.json(circles);
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.delete("/circles/:id/joinedbys", authenticateToken, (req, res) => {
  const { id } = req.params;
  const joiner_id = req.circle_id;
  db.query("DELETE FROM joins WHERE joiner_id = ? AND joinee_id = ?", [joiner_id, id])
    .then(() => {
      res.json({ message: "OK" });
    }).catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.post("/bubbles", authenticateToken, (req, res) => {
  const { content, anchor } = req.body;
  const circle_id = req.circle_id;
  db.query("INSERT INTO bubbles (circle_id, content, anchor) VALUES (?, ?, ?)", [circle_id, content, anchor])
    .then(() => {
      res.status(201).json({ message: "OK" });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.get("/bubbles", (req, res) => {
  const query = `
    SELECT ${BUBBLE_JSON_FIELDS} AS bubble
    FROM bubbles b
    JOIN circles c ON b.circle_id = c.id
    ORDER BY b.id DESC
    LIMIT 50
  `;
  db.query(query).then(data => {
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
    SELECT ${BUBBLE_JSON_FIELDS} AS bubble
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

router.get("/bubbles/:id/anchoreds", (req, res) => {
  const { id } = req.params;
  db.query(`
    SELECT ${BUBBLE_JSON_FIELDS} AS bubble
    FROM bubbles b
    JOIN circles c ON b.circle_id = c.id
    WHERE b.anchor = ?
    ORDER BY b.id DESC
    LIMIT 50
  `, [id]).then(data => {
    const [rows, fields] = data;
    const bubbles = rows.map(row => JSON.parse(row.bubble));
    res.json(bubbles);
  }).catch(err => {
    res.status(500).json({ error: err.message });
  });
});

router.post("/bubbles/:id/pops", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { emoji } = req.body;
  const circle_id = req.circle_id;
  db.query("INSERT INTO pops (popper_id, popped_id, emoji) VALUES (?, ?, ?)", [circle_id, id, emoji])
    .then(() => {
      res.status(201).json({ message: "OK" });
    }).catch(err => {
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ error: "Already popped with this emoji" });
      } else {
        res.status(500).json({ error: err.message });
      }
    });
});

router.get("/bubbles/:id/pops", (req, res) => {
  const { id } = req.params;
  db.query("SELECT emoji, COUNT(*) AS count FROM pops WHERE popped_id = ? GROUP BY emoji", [id])
    .then(data => {
      const [rows, fields] = data;
      res.json(rows);
    }).catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.get("/bubbles/:id/is_popped", authenticateToken, (req, res) => {
  const { id } = req.params;
  const circle_id = req.circle_id;
  db.query("SELECT emoji FROM pops WHERE popper_id = ? AND popped_id = ?", [circle_id, id])
    .then(data => {
      const [rows, fields] = data;
      const emojis = rows.map(row => row.emoji);
      res.json({ popped: emojis });
    }).catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.delete("/bubbles/:id/pops", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { emoji } = req.body;
  const circle_id = req.circle_id;
  db.query("DELETE FROM pops WHERE popper_id = ? AND popped_id = ? AND emoji = ?", [circle_id, id, emoji])
    .then(() => {
      res.json({ message: "OK" });
    }).catch(err => {
      res.status(500).json({ error: err.message });
    });
});

router.get("/feed", authenticateToken, (req, res) => {
  const circle_id = req.circle_id;
  db.query(`
    SELECT ${BUBBLE_JSON_FIELDS} AS bubble
    FROM bubbles b
    JOIN circles c ON b.circle_id = c.id
    WHERE b.circle_id IN (
      SELECT joinee_id FROM joins WHERE joiner_id = ?
    )
    ORDER BY b.id DESC
    LIMIT 50
  `, [circle_id]).then(data => {
    const [rows, fields] = data;
    const bubbles = rows.map(row => JSON.parse(row.bubble));
    res.json(bubbles);
  }).catch(err => {
    res.status(500).json({ error: err.message });
  });
});

export default router;
