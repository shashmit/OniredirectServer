import express from 'express';
const router = express.Router();
import { addCareContext } from '../handlers/careContextHandle/addcareContext.js';
import { notifyUser } from '../handlers/careContextHandle/notifyUser.js';
import generateToken  from '../handlers/careContextHandle/generateToken.js';
import addNewCareContext from '../handlers/careContextHandle/addNewCareContext.js';

// router.post("/addCareContext", addCareContext);
router.post("/notify", notifyUser);

//v3
router.post('/generate/token', generateToken);
router.post("/add/carecontext", addNewCareContext);

export default router;