import express from 'express';
const router = express.Router();
import { addCareContext } from '../handlers/careContextHandle/addcareContext.js';
import { notifyUser } from '../handlers/careContextHandle/notifyUser.js';

router.post("/addCareContext", addCareContext);
router.post("/notify", notifyUser);


export default router;