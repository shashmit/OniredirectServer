import express from 'express';
import generateToken from '../handlers/careContextHandle/generateToken.js';
import linkCareContext from '../handlers/careContextHandle/linkCareContext.js';
const router = express.Router();

router.post('/generateToken', generateToken);
router.post("/linkCareContext", linkCareContext)

export default router;