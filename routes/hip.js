import express from 'express'
const router = express.Router()
import { v4 as uuidv4 } from 'uuid'
import config from "../config/temp.js"
import refreshAccessToken from '../utils/refreshToken.js'
import discoverController from '../controller/discoverController.js'

// router.all('/*', async (req, res) => {
//     try {
//         if (!config.accessToken) {
//           await refreshAccessToken();
//         }
//         const requestId = uuidv4();
//         const timestamp = new Date().toISOString();
//         const data = req.body;
//         const path = req.path;
//         console.log(`Received request on path: ${path}`);
//         console.log('Request:', data)
        
//         if(path === "/v0.5/users/auth/on-init"){
//           config.transactionId = data.auth.transactionId;
//         }
//         if(path === "/v0.5/users/auth/on-confirm"){
//           const abhaId = data.auth.patient.id;
//           config.tempDatabase[abhaId] = data.auth.accessToken;
//         }
//         if(path === "/api/v3/hip/patient/care-context/discover"){

//         }
//         res.status(200).send();
//       } catch (error) {
//         console.error('Error:', error.message);
//         res.status(500).json({ status: "error", message: "Internal server error" });
//       }
// });

router.all('/*', async (req, res, next) => {
  try {
      if (!config.accessToken) {
          await refreshAccessToken();
      }
      const requestId = uuidv4();
      const timestamp = new Date().toISOString();
      const data = req.body;
      const path = req.path;
      console.log(`Received request on path: ${path}`);
      console.log('Request:', data);

      switch (true) {
          case path === "/v0.5/users/auth/on-init":
              config.transactionId = data.auth.transactionId;
              res.status(200).send();
              break;

          case path === "/v0.5/users/auth/on-confirm":
              const abhaId = data.auth.patient.id;
              config.tempDatabase[abhaId] = data.auth.accessToken;
              res.status(200).send();
              break;

          case path === '/api/v3/hip/patient/care-context/discover':
              const result = await discoverController(data);
              res.status(200).json(result);
              break;

          default:
              res.status(404).json({ message: "Endpoint not found" });
      }
  } catch (error) {
      console.error('Error:', error.message);
      res.status(500).json({ status: "error", message: "Internal server error" });
  }
});


export default router;