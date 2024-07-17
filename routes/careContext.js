import express from 'express';
const router = express.Router();
import { addCareContext } from '../handlers/careContextHandle/addcareContext.js';


router.post("/addCareContext", addCareContext);


export default router;