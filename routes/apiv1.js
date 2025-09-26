import express from 'express';
const router = express.Router();

router.get('/hello', (req, res) => {
    res.send('Hello, World!')
});

export default router;
