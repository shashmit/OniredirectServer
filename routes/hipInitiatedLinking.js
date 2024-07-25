import express from 'express';
import generateToken from '../handlers/careContextHandle/generateToken.js';

const router = express.Router();

router.post('/generateToken', generateToken);

export default router;