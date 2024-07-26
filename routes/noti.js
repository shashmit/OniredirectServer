import express from 'express';
const router = express.Router();
import { notifyUser } from '../handlers/notify/notifyUser.js';

router.post("/sms", notifyUser);

export default router;